import { extractDiff } from "../../../lib/github";
import { preprocessFiles } from "@/lib/diff-preprocess";
import { analyzeDiff } from "@/lib/llm/analyze";
import { impactAnalysis } from "@/lib/llm/impact";
import { withRetry } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

const TTL_MS = 5 * 60 * 1000;   // 3 minutes

export async function POST(req: Request) {
    const { repo, baseCommit, targetCommit } = await req.json();

    const now = new Date();

    const cached = await prisma.comparison.findFirst({
        where: {
            repo,
            baseCommit,
            targetCommit,
            expiresAt: {
                gt: now
            }
        },
        include: {
            changes: true
        }
    });

    if (cached) {
        return Response.json({
            source: "cache",
            diff: {
                summary: cached.summary,
                breaking: cached.breaking,
                risk_score: cached.riskScore,
                changes: cached.changes
            },
            impact: {
                impact_level: cached.impactLevel
            }
        });
    }

    const files = await extractDiff(
        repo,
        baseCommit,
        targetCommit
    );
    const preproccesedFiles = preprocessFiles(files);
    const diffResult = await withRetry(analyzeDiff, preproccesedFiles);
    const impact = await withRetry(impactAnalysis, diffResult.changes);

    const record = await prisma.comparison.create({
        data: {
          repo,
          baseCommit,
          targetCommit,
          summary: diffResult.summary,
          breaking: diffResult.breaking,
          riskScore: diffResult.risk_score,
          impactLevel: impact.impact_level,
          expiresAt: new Date(Date.now() + TTL_MS),
    
          changes: {
            create: diffResult.changes
          }
        }
      });

    return Response.json({ source: "fresh", diff: diffResult, impact: impact });
}
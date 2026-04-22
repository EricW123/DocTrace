import { z } from "zod";

/**
 * analyze-diff schema
 */
export const DiffSchema = z.object({
    summary: z.string().min(1),
    breaking: z.boolean(),
    risk_score: z.number().min(0).max(1),
    changes: z.array(
        z.object({
            path: z.string(),
            description: z.string().min(1)
        })
    )
});

/**
 * impact-analysis schema
 */
export const ImpactSchema = z.object({
    impact_level: z.enum(["low", "medium", "high", "critical"]),
    affected_areas: z.array(z.string()),
    suggested_actions: z.array(z.string())
});
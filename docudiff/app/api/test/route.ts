// import { prisma } from "../../../lib/prisma";
// import { extractDiff } from "../../../lib/github";
// import { preprocessFiles } from "@/lib/diff-preprocess";
// import { analyzeDiff } from "@/lib/llm/analyze";
// import { impactAnalysis } from "@/lib/llm/impact";
// import { withRetry } from "@/lib/utils";

// async function test_db() {
//     const record = await prisma.comparison.create({
//         data: {
//             repo: "test/repo",
//             baseCommit: "a",
//             targetCommit: "b",

//             summary: "summary2",
//             breaking: false,
//             riskScore: 10,
//             impactLevel: "low"
//         }
//     });

//     return Response.json(record);
// }

// async function test_gh() {
//     const files = await extractDiff(
//         "git/git",
//         "v2.2.0-rc1",
//         "v2.2.0-rc2"
//     );

//     console.log(files);
//     return Response.json({});
// }

// async function test_gmn() {
//     const files = await extractDiff(
//         "git/git",
//         "v2.2.0-rc1",
//         "v2.2.0-rc2"
//     );
//     const preproccesedFiles = preprocessFiles(files);
//     // console.log(preproccesedFiles);
//     const diffResult = await analyzeDiff(preproccesedFiles);
//     const impact = await impactAnalysis(diffResult.changes);
//     console.log(impact);
//     return Response.json({});
// }

export async function GET() {
//     return test_db();
//     return test_gh();
//     return withRetry(test_gmn);
}

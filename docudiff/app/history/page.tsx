import { prisma } from "@/lib/prisma";
import Link from "next/link";


export default async function HistoryPage() {
    const now = new Date();

    // only display unexpired entries
    const records = await prisma.comparison.findMany({
        where: {
            expiresAt: {
                gt: now
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 20
    });

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">History</h1>

            {records.length === 0 && (
                <div className="text-gray-500">No recent comparisons</div>
            )}

            <ul className="space-y-4">
                {records.map((r) => (
                    <li key={r.id} className="border p-4 rounded">
                        <Link href={`/history/${r.id}`} className="block">
                            <div className="font-semibold">{r.repo}</div>

                            <div className="text-sm text-gray-600">
                                {r.baseCommit.slice(0, 7)} → {r.targetCommit.slice(0, 7)}
                            </div>

                            <div className="mt-2 text-sm">
                                {r.summary}
                            </div>

                            <div className="mt-2 flex gap-4 text-sm">
                                <span>
                                    Breaking:{" "}
                                    <b className={r.breaking ? "text-red-500" : "text-green-500"}>
                                        {String(r.breaking)}
                                    </b>
                                </span>

                                <span>Risk: {r.riskScore}</span>
                                <span>Impact: {r.impactLevel}</span>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
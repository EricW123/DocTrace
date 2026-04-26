import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    if (!id) return notFound();

    const record = await prisma.comparison.findUnique({
        where: { id: id },
        include: { changes: true }
    });

    if (!record) return notFound();

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-xl font-bold">{record.repo}</h1>

            <div className="text-sm text-gray-600">
                {record.baseCommit} → {record.targetCommit}
            </div>

            {/* Summary */}
            <div className="border p-4 rounded">
                <h2 className="font-semibold">Summary</h2>
                <p>{record.summary}</p>

                <div className="mt-2 flex gap-4 text-sm">
                    <span>
                        Breaking:{" "}
                        <b className={record.breaking ? "text-red-500" : "text-green-500"}>
                            {String(record.breaking)}
                        </b>
                    </span>

                    <span>Risk: {record.riskScore}</span>
                    <span>Impact: {record.impactLevel}</span>
                </div>
            </div>

            {/* Changes */}
            <div className="border p-4 rounded">
                <h2 className="font-semibold mb-2">Changes</h2>

                <ul className="space-y-2">
                    {record.changes.map((c: any) => (
                        <li key={c.id} className="border p-2 rounded">
                            <div className="font-mono text-sm">{c.path}</div>
                            <div>{c.description}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

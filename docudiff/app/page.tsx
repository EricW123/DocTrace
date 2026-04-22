"use client";

import { useState } from "react";
import { SummaryCard } from "@/components/SummaryCard";
import { ChangesList } from "@/components/ChangesList";

import Link from "next/link";

export default function Home() {
    const [repo, setRepo] = useState("");
    const [base, setBase] = useState("");
    const [target, setTarget] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);

    async function handleCompare() {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/compare", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    repo,
                    baseCommit: base,
                    targetCommit: target
                })
            });

            if (!res.ok) throw new Error("Request failed, please try again later");

            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Input */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold">DocuTrace</h1>

                <input
                    className="w-full border p-2 rounded"
                    placeholder="owner/repo (e.g. vercel/next.js)"
                    value={repo}
                    onChange={e => setRepo(e.target.value)}
                />

                <input
                    className="w-full border p-2 rounded"
                    placeholder="base commit SHA"
                    value={base}
                    onChange={e => setBase(e.target.value)}
                />

                <input
                    className="w-full border p-2 rounded"
                    placeholder="target commit SHA"
                    value={target}
                    onChange={e => setTarget(e.target.value)}
                />

                <button
                    onClick={handleCompare}
                    className="bg-black text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Analyzing..." : "Compare"}
                </button>
            </div>

            {/* Status */}
            {error && (
                <div className="text-red-500 border p-2 rounded">
                    {error}
                </div>
            )}

            {/* Result */}
            {result && (
                <div className="space-y-4">
                    <SummaryCard diff={result.diff} impact={result.impact} />
                    <ChangesList changes={result.diff.changes} />
                </div>
            )}

            <Link href="/history" className="underline text-blue-500">
                View History
            </Link>
        </div>
    );
}
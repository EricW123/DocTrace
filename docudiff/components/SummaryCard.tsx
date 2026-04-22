export function SummaryCard({ diff, impact }: any) {
    return (
        <div className="border rounded p-4 space-y-2">
            <h2 className="text-lg font-semibold">Summary</h2>

            <p>{diff.summary}</p>

            <div className="gap-4">
                <span>
                    Breaking:{" "}
                    <b className={diff.breaking ? "text-red-500" : "text-green-500"}>
                        {String(diff.breaking)}
                    </b>
                </span>

                <br></br>

                <span>Risk: {diff.risk_score}</span>

                <br></br>

                <span>Impact: {impact.impact_level}</span>
            </div>
        </div>
    );
}
export function ChangesList({ changes }: any) {
    return (
        <div className="border rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Changes</h2>

            <ul className="space-y-2">
                {changes.map((c: any, i: number) => (
                    <li key={i} className="border p-2 rounded">
                        <div className="font-mono text-sm">{c.path}</div>
                        <div>{c.description}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export async function extractDiff(
    repo: string,
    base: string,
    target: string
) {
    const [owner, name] = repo.split("/");

    const res = await fetch(
        `https://api.github.com/repos/${owner}/${name}/compare/${base}...${target}`
    );

    const data = await res.json();

    return data.files
        ?.filter((f: any) => f.patch)
        .slice(0, 10)
        .map((f: any) => ({
            path: f.filename,
            patch: f.patch,
            change_type: f.status
        })) || [];
}
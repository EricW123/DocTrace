export function preprocessFiles(files: any[]) {
    return files.map(f => ({
        path: f.path,
        change_type: f.change_type,
        // only remain changed lines, rather than all lines
        changes: f.patch
            ?.split("\n")
            ?.filter((line: string) => line.startsWith("+") || line.startsWith("-"))
            ?.slice(0, 50)   // maximum 50 lines of each file
    }));
}
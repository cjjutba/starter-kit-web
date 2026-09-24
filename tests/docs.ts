/** Rows of the Features table in docs/progress.md, as id and status. */
export function featureRows(source: string): { id: string; status: string }[] {
  const table = source.split(/^## Features$/m)[1]?.split(/^## /m)[0] ?? "";
  return table
    .split("\n")
    .filter((line) => /^\| F\d+ /.test(line))
    .map((line) => {
      const cells = line.split("|").map((cell) => cell.trim());
      return { id: cells[1], status: cells[3] };
    });
}

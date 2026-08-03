export interface CsvColumn<T> {
  header: string;
  accessor: (row: T) => string | number;
}

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function buildCsv<T>(columns: CsvColumn<T>[], rows: T[]): string {
  const header = columns.map((column) => escapeCsvValue(column.header)).join(",");
  const lines = rows.map((row) =>
    columns.map((column) => escapeCsvValue(column.accessor(row))).join(",")
  );
  return [header, ...lines].join("\n");
}

export function downloadCsv<T>(filename: string, columns: CsvColumn<T>[], rows: T[]): void {
  const csv = buildCsv(columns, rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

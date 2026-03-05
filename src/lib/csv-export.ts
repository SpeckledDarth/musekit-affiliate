export function exportToCSV(
  columns: { key: string; header: string }[],
  data: any[],
  filename: string,
) {
  const escapeCSV = (value: any): string => {
    if (value == null) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerRow = columns.map((col) => escapeCSV(col.header)).join(",");
  const dataRows = data.map((item) =>
    columns.map((col) => escapeCSV(item[col.key])).join(","),
  );
  const csv = [headerRow, ...dataRows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

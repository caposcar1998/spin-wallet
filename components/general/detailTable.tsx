interface DetailTableProps {
  rows: { label: string; value: React.ReactNode }[];
  className?: string;
}

export function DetailTable({ rows, className }: DetailTableProps) {
  return (
    <div
      data-testid="detail-table"
      className={`bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden ${className ?? ""}`}
    >
      <table className="w-full text-sm text-left text-gray-600">
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              className={i < rows.length - 1 ? "border-b border-gray-200" : ""}
            >
              <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                {row.label}
              </th>
              <td className="px-6 py-4">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

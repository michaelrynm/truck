import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

function Table<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
}: TableProps<T>) {
  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor] as ReactNode;
  };

  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-200">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-3 md:px-6 py-3 md:py-3.5 text-left text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50 ${
                    column.className || ''
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 md:px-6 py-8 md:py-12 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center">
                    <svg className="w-10 h-10 md:w-12 md:h-12 text-slate-300 mb-2 md:mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span className="text-xs md:text-sm font-medium">No data available</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={`${onRowClick ? 'hover:bg-slate-50 cursor-pointer' : ''} transition-colors`}
                >
                  {columns.map((column, index) => (
                    <td
                      key={index}
                      className={`px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-900 ${
                        column.header === 'Actions' ? 'whitespace-nowrap' : ''
                      } ${column.className || ''}`}
                    >
                      {getCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;

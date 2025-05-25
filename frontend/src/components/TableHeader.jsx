import React from "react";

const TableHeader = ({ columns, sortField, sortOrder, handleSort }) => {
  return (
    <thead>
      <tr className="bg-gray-50">
        {columns.map((column) => (
          <th
            key={column.key}
            onClick={() => column.sortable !== false && handleSort(column.key)}
            className={`px-4 py-2 text-left text-sm font-medium text-black uppercase tracking-wide ${
              column.sortable !== false ? 'cursor-pointer hover:text-blue-600' : 'pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-1">
              {column.label}
              {column.sortable !== false && (
                <span className={sortField === column.key ? 'text-blue-600' : 'text-gray-400'}>
                  {sortField === column.key && sortOrder === "asc" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 4l-8 8h16z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 20l-8-8h16z" />
                    </svg>
                  )}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
import React, { useMemo, useReducer, useState } from "react";

import {
    Column,
    Table as ReactTable,
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";

import { useNavigate } from "react-router-dom";

type Props = {
    data: any;
};

type Company = {
    id: number;
    name: string;
    cin: string;
};

export default function PaginatedTable({ data }: Props) {
    const goto = useNavigate();
    const columnHelper = createColumnHelper<Company>();
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns = [
        columnHelper.accessor("id", {
            header: () => <span>ID</span>,
            cell: (info) => info.getValue()
        }),
        columnHelper.accessor("name", {
            header: () => <span className="thName">Company Name</span>,
            cell: (info) => info.renderValue()
        }),
        columnHelper.accessor("cin", {
            header: () => <span>Company CIN</span>,
            cell: (info) => info.renderValue()
        })
    ];

    const rerender = useReducer(() => ({}), {})[1];
    const sortees = useMemo(
        () => [
            {
                id: "name",
                desc: false
            }
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        initialState: {
            sorting: [
                {
                    id: "name",
                    desc: false
                }
            ]
        },

        onSortingChange: setSorting,

        //pipeline
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        debugTable: false,
        state: {
            sorting
        }
    });

    return (
        <>
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            {...{
                                                className:
                                                    header.column.getCanSort()
                                                        ? "cursor-pointer select-none"
                                                        : "",
                                                onClick:
                                                    header.column.getToggleSortingHandler()
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: " 🔼",
                                                desc: " 🔽"
                                            }[
                                                header.column.getIsSorted() as string
                                            ] ?? null}
                                        </div>
                                    )}{" "}
                                    {header.column.getCanFilter() ? (
                                        <div>
                                            {header.id !== "id" && (
                                                <Filter
                                                    column={header.column}
                                                    table={table}
                                                />
                                            )}
                                        </div>
                                    ) : null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-between items-center gap-2">
                <button
                    className="btn btn-secondary"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<<"}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<"}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {">"}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {">>"}
                </button>
                <span className="d-flex items-center gap-1 mt-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:{" "}
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            table.setPageIndex(page);
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                <div className="h-4">
                    <button
                        onClick={() => goto("/")}
                        className="border p-2 btn btn-primary"
                    >
                        Add Company
                    </button>
                </div>
            </div>
        </>
    );
}

function Filter({
    column,
    table
}: {
    column: Column<any, any>;
    table: ReactTable<any>;
}) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id);

    const columnFilterValue = column.getFilterValue();

    return typeof firstValue === "number" ? (
        <div className="flex space-x-2">
            <input
                type="number"
                value={(columnFilterValue as [number, number])?.[0] ?? ""}
                onChange={(e) =>
                    column.setFilterValue((old: [number, number]) => [
                        e.target.value,
                        old?.[1]
                    ])
                }
                placeholder={`Min`}
                className="w-24 border shadow rounded"
            />
            <input
                type="number"
                value={(columnFilterValue as [number, number])?.[1] ?? ""}
                onChange={(e) =>
                    column.setFilterValue((old: [number, number]) => [
                        old?.[0],
                        e.target.value
                    ])
                }
                placeholder={`Max`}
                className="w-24 border shadow rounded"
            />
        </div>
    ) : (
        <input
            type="text"
            value={(columnFilterValue ?? "") as string}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder={`Search...`}
            className="w-100 rounded text-white"
            style={{
                backgroundColor: "transparent",
                border: "0",
                borderBottom: "1px solid white"
            }}
        />
    );
}

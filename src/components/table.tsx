import React, {InputHTMLAttributes, useEffect, useState} from "react";
import {CSV_HEADERS} from "@/util/constants";
import {
    ColumnFiltersState,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import {rankItem} from "@tanstack/match-sorter-utils";

const DebouncedInput = (
    {
        value: initialValue,
        onChange,
        debounce = 500,
        ...props
    }: {
        value: string | number;
        onChange: (value: string | number) => void;
        debounce?: number;
    } & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => onChange(value), debounce);
        return () => clearTimeout(timeout);
    }, [value, debounce, onChange]);

    return <input {...props} value={value} onChange={(e) => setValue(e.target.value)}/>;
}
const columns = Object.keys(CSV_HEADERS).map((key) => ({
    header: key,
    accessorKey: key,
    cell: (props) => <p>{props.getValue()}</p>
}));
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({itemRank});
    return itemRank.passed;
};
const PasswordTable = ({passwords}) => {
    const [data, setData] = useState(passwords);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const table = useReactTable({
        data,
        columns,
        filterFns: {fuzzy: fuzzyFilter},
        state: {columnFilters, globalFilter, sorting},
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        sortDescFirst: false,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: false,
        debugHeaders: true,
        debugColumns: false,
    });

    return (
        <div className="max-w-sm mx-auto p-6 mt-10 bg-black rounded-lg shadow-2xl drop-shadow-2xl">
            <div className="flex flex-col w-full">
                <div className="overflow-x-auto flex flex-col gap-2">
                    <div className="flex gap-4 justify-center items-center">
                        <DebouncedInput
                            value={globalFilter ?? ""}
                            onChange={(value) => setGlobalFilter(String(value))}
                            className="flex w-full sm:w-64 p-2 font-lg shadow border border-black rounded"
                            placeholder="Search"
                        />
                    </div>
                    <table className="min-w-full bg-black border border-gray-200 rounded-lg shadow-lg text-center">
                        <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="text-white">
                                {headerGroup.headers.map((header, index) => {
                                    return (
                                        <th key={header.id}
                                            className={`p-2 border-2 border-black cursor-pointer select-none group hover:bg-blue-500`}
                                            onClick={header.column.getToggleSortingHandler()}>
                                            <div className="flex items-center justify-center gap-1 w-full">
                                                <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                                                <div className="flex flex-col items-center">
                                                <span className={`${header.column.getIsSorted() === 'asc'
                                                    ? 'text-gray-300 group-hover:text-gray-300'
                                                    : 'text-gray-600 group-hover:text-gray-600'}`}>
                                                    ▲
                                                </span>
                                                    <span className={`${header.column.getIsSorted() === 'desc'
                                                        ? 'text-gray-300 group-hover:text-gray-300'
                                                        : 'text-gray-600 group-hover:text-gray-600'}`}>
                                                    ▼
                                                </span>
                                                </div>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                        </thead>
                        <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="border-b hover:bg-blue-500">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-2 py-1 border border-black">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="flex items-center gap-2 pl-6">
                        <div>
                            <button className="border rounded p-1"
                                    onClick={() => table.firstPage()}
                                    disabled={!table.getCanPreviousPage()}>
                                {"<<"}
                            </button>
                            <button className="border rounded p-1"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}>
                                {"<"}
                            </button>
                            <button className="border rounded p-1"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}>
                                {">"}
                            </button>
                            <button className="border rounded p-1"
                                    onClick={() => table.lastPage()}
                                    disabled={!table.getCanNextPage()}>
                                {">>"}
                            </button>
                            <span className="flex justify-center gap-1">Page {table.getState().pagination.pageIndex + 1}
                                {" "} of {" "}
                                {table.getPageCount().toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <div className="flex justify-center items-center gap-3">
                        <span className="text-white">
                              Go to page:
                             </span>
                                <input type="number"
                                       min="1"
                                       max={table.getPageCount()}
                                       defaultValue={table.getState().pagination.pageIndex + 1}
                                       onChange={e => {
                                           const page = e.target.value ? Number(e.target.value) - 1 : 0
                                           table.setPageIndex(page)
                                       }}
                                       className="border p-1 rounded w-16 text-black"/>
                            </div>

                            <div className="flex justify-center items-center pt-1">
                                <select className="text-black gap-1 border p-1 rounded w-full"
                                        value={table.getState().pagination.pageSize}
                                        onChange={e => {
                                            table.setPageSize(Number(e.target.value))
                                        }}>
                                    {[10, 20, 30, 40, 50].map(pageSize => (
                                        <option key={pageSize} value={pageSize}>
                                            Show {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        Show {table.getRowModel().rows.length.toLocaleString()} of {" "}
                        {table.getRowCount().toLocaleString()} passwords
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PasswordTable;
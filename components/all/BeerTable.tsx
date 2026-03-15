"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Beer } from "@/lib/types";
import { formatDollarsPerDrink, formatPrice, formatSize } from "@/lib/beerUtils";

const columnHelper = createColumnHelper<Beer>();

const columns = [
  columnHelper.accessor("beer_name", {
    header: "Beer",
    cell: (info) => (
      <a
        href={info.row.original.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-700 hover:underline font-medium block max-w-[220px] whitespace-normal sm:whitespace-nowrap sm:max-w-none"
      >
        {info.getValue()}
      </a>
    ),
  }),
  columnHelper.display({
    id: "pack",
    header: "Pack",
    cell: (info) => {
      const beer = info.row.original;
      return `${beer.quantity} × ${formatSize(beer)}`;
    },
    enableSorting: false,
  }),
  columnHelper.accessor("case_type", {
    header: "Type",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => {
      const beer = info.row.original;
      if (beer.original_price != null) {
        return (
          <span>
            <span className="text-green-700 font-medium">{formatPrice(beer.price)}</span>
            <span className="ml-1 text-xs text-zinc-400 line-through">
              {formatPrice(beer.original_price)}
            </span>
          </span>
        );
      }
      return formatPrice(beer.price);
    },
  }),
  columnHelper.accessor("dollars_per_serving_of_alcohol", {
    header: "$/Drink",
    cell: (info) => formatDollarsPerDrink(info.getValue()),
    sortingFn: (a, b) => {
      const av = a.original.dollars_per_serving_of_alcohol ?? Infinity;
      const bv = b.original.dollars_per_serving_of_alcohol ?? Infinity;
      return av - bv;
    },
  }),
  columnHelper.accessor("abv", {
    header: "ABV",
    cell: (info) => `${info.getValue()}%`,
  }),
  columnHelper.accessor("country", {
    header: "Country",
    cell: (info) => info.getValue(),
  }),
];

interface Props {
  data: Beer[];
}

export default function BeerTable({ data }: Props) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "dollars_per_serving_of_alcohol", desc: false },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 50 } },
  });

  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-zinc-100 border-b border-zinc-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-3 py-2.5 text-left text-xs font-semibold text-zinc-600 whitespace-nowrap ${
                      header.column.getCanSort()
                        ? "cursor-pointer hover:text-zinc-900 select-none"
                        : ""
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span className="ml-1 text-zinc-400">
                        {header.column.getIsSorted() === "asc"
                          ? "↑"
                          : header.column.getIsSorted() === "desc"
                          ? "↓"
                          : "↕"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 text-zinc-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-zinc-400">
                  No beers match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">
            Page {pageIndex + 1} of {pageCount}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 rounded border border-zinc-300 text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  OnChangeFn,
  FilterFn,
  Column,
  Table,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { columns } from "./components/columnsReorder";
import "./table.css";
import { useSession } from "next-auth/react";
import axios from "axios";

import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import SelectComp from "./components/SelectComp";
import { getLocations, getStockOrder } from "./lib/lib";

//declare module "@tanstack/table-core" {
//   interface FilterFns {
//     globalFns: FilterFn<unknown>;
//   }
// }

// function testFalsey(val: any) {
//   return val === undefined || val === null || val === "";
// }

// declare module '@tanstack/table-core' {
//   interface FilterFns {
//     fuzzy: FilterFn<unknown>
//   }
//   interface FilterMeta {
//     itemRank: RankingInfo
//   }
// }

// const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
//   // Rank the item
//   const itemRank = rankItem(row.getValue(columnId), value)
// console.log('ok');

//   // Store the itemRank info
//   addMeta({
//     itemRank,
//   })

//   // Return if the item should be filtered in/out
//   return itemRank.passed
// }

type Props = {};

function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

const ReorderTool = (props: Props) => {
  const globalFns: FilterFn<any> = (
    row,
    columnId: string,
    filterValue: any
  ) => {
    if (options.length > 0 || optionsTwo.length > 0 ) {
      if (columnId === "name") {
        return false;
      }
      return filterValue.includes("ALL")
        ? true
        : (filterValue?.includes(row.getValue<unknown[]>(columnId)) );
    } 
    // else {
    //   const search = filterValue.toLowerCase();
    //   return Boolean(
    //     row
    //       .getValue<string | null>(columnId)
    //       ?.toString()
    //       ?.toLowerCase()
    //       ?.includes(search)
    //   );
    // }
  };

  // globalFns.resolveFilterValue = (val: any) => {
  //   console.log("resolveFilterValue", val);
  //   return `${val}`;
  // };

  // globalFns.autoRemove = (val: any) => {
  //   console.log("resolveFilterValue", val);
  //   return testFalsey(`${val}`);
  // };

  const { data: session } = useSession();

  const [data, setData] = useState<any[]>([]);
  const [tempData, setTempData] = useState<any[]>([]);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const [arrayOfLocations, setArrayOfLocations] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchValue, setSearchValue] = useState('');
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [optionsTwo, setOptionsTwo] = useState<any[]>([]);

  const optionsArray = useMemo(
    () => arrayOfLocations.map((val) => ({ value: val, label: val })),
    [arrayOfLocations]
  );

  const columnDef = useMemo(() => {
    return columns;
  }, []);


  useEffect(() => {
   
      table.getAllColumns().filter((col) => col.id === 'stockCode')[0].setFilterValue(searchValue);
    
  }, [ searchValue]);






  useEffect(() => {
    const getData = async () => {
      const url = "/api/stktool";
      const config = {
        method: "get",
        url,
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const res = await axios(config);
        const stkData = getStockOrder(res.data.slice(0, 1000));
        setData(stkData);
        setTempData(stkData);
        setArrayOfLocations(getLocations(res.data));
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const table = useReactTable({
    data,
    columns: columnDef,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    autoResetPageIndex,
    filterFns: {
      globalFns,
    },
    state: {
      rowSelection,
      sorting,
      globalFilter,
      columnFilters,
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: setRowSelection,
    getRowCanExpand: () => true,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    //  debugTable: true,
    // globalFilterFn: globalFnsTwo,
    globalFilterFn: globalFns,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setData((old) => {
          const oldData = old.map((row, index) => {
            if (index === rowIndex) {
              setTempData((pre) =>
                pre.map((data) => {
                  if (data.id === row.id) {
                    return { ...data, [columnId]: value };
                  }
                  return data;
                })
              );
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }

            return row;
          });

          return oldData;
        });
      },
    },
  });
  //  console.log("render",tempData.filter(d=>d.select));
  //  console.log("render",data.filter(d=>d.select));

  const handleInputChange = (e: any) => {
    setSearchValue(e.target.value);
  };
  const selectRowCount = useMemo(() => {
    return data.filter((item) => item.select).length;
  }, [data]);

  useEffect(() => {
    const locations = options.map((loc) => loc.value);
    const locationsTwo = optionsTwo.map((loc) => loc.value);

    // if (options.length > 0) {
    //   const locations = options.map((loc) => loc.value);

    //   setData(tempData.filter((data) => locations.includes(data.branchName)));
    // } else {
    //   setData(tempData);

    // }
    if (locations.length > 0 || locationsTwo.length > 0 ) {
      console.log("location");

      setGlobalFilter(JSON.stringify([...locations, ...locationsTwo]));
    } else {
      setGlobalFilter("");
    }

    // table.getFilteredRowModel()
    //  console.log(table.getFilteredRowModel());
  }, [options, optionsTwo]);

  return (
    <div className="p-10 flex-col">
      
        <input
          type="text"
          className="text-black border m-2"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      

      {/* <input
        type="text"
        className="text-black border m-2"
        value={searchValue}
        onChange={handleInputChange}
      /> */}
      <div className="flex justify-center items-center">

     
        <SelectComp
          id={"loc-filter"}
          options={options}
          setOptions={setOptions}
          optionArray={optionsArray}
          setGlobalFilter={setGlobalFilter}
        />

        <SelectComp
          id={"loc-filter"}
          options={optionsTwo}
          setOptions={setOptionsTwo}
          optionArray={optionsArray}
          setGlobalFilter={setGlobalFilter}
        />
      </div>

      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="text-center text-xs ">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {row.getIsExpanded() && (
                <tr>
                  {/* 2nd row is a custom 1 cell row */}
                  <td colSpan={row.getVisibleCells().length}>hell</td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />

      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
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
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
      <div>{selectRowCount} selected Rows</div>
    </div>
  );
};

export default ReorderTool;

function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();
  console.log(columnFilterValue, "firstValue");

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      className="text-slate-950"
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

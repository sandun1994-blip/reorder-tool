"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Column,
  ColumnDef,
  Table as TableType,
  flexRender,
} from "@tanstack/react-table";
import React, {
  Fragment,
  useState,
} from "react";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import ExpandComp from "../expandComp/components/expandComp";
import { RotatingLines } from "react-loader-spinner";

interface DataTableProps<TData, TValue> {
  useTable: TableType<any>;
  supData :any
  columns: ColumnDef<TData, TValue>[];
  columnResizeMode:any
  resizeMode:boolean
  loading:boolean
  
}

const ReorderDataTable = <TData, TValue>({
  supData,
  useTable,
  columnResizeMode,
  columns,
  resizeMode,
  loading
}: DataTableProps<TData, TValue>) => {
  const table = useTable;
  return (
    <div className="bg-white dark:bg-slate-800  rounded-2xl shadow-xl">
      <Table className=" rounded-lg dark:text-black h-fit" 
            style= {{ width: resizeMode?table.getCenterTotalSize():'',
            }}
          >
        <TableHeader className="m-10  shadow-2xl rounded-lg  ">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="text-center text-xs border px-2 py-2   text-black font-semibold dark:bg-[#2E3B42] dark:text-white   "
                    style={{
                      width: header.getSize(),
                    }}
                  >
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
                           <div
                      {...{
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${
                          header.column.getIsResizing() ? 'isResizing' : ''
                        }`,
                        style: {
                          transform:
                            columnResizeMode === 'onEnd' &&
                            header.column.getIsResizing()
                              ? `translateX(${
                                  table.getState().columnSizingInfo.deltaOffset
                                }px)`
                              : '',
                        },
                      }}
                    />
                          {{
                            asc: "🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        <div className="flex justify-center items-center">
                          {header.column.columnDef.meta?.filterVisible ? (
                            <div>
                              <FilterVisible
                                column={header.column}
                                table={table}
                              />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="border  font-semibold">
          {table.getRowModel().rows?.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow key={row.id} className="border dark:bg-white border-b-2 border-b-gray-300">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-center text-xs  px-2 py-2"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow className="border dark:bg-white">
                    {/* 2nd row is a custom 1 cell row */}
                    <TableCell
                      colSpan={row.getVisibleCells().length}
                      className="h-24 text-center "
                    >
                      <ExpandComp supData={supData} mainDataItem={row.original}/>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          ) : (
            <TableRow>
               <TableCell colSpan={columns.length} className="h-24">
                <div className=" flex justify-center items-center p-3">
                {loading? (<RotatingLines
                  strokeColor="blue"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="96"
                  visible={loading}
                />):(<h6>NO DATA ...........</h6>)}
                </div>
               
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        
      </Table>
    </div>
  );
};

export default ReorderDataTable;

function FilterVisible({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: TableType<any>;
}) {
  const [visible, setVisible] = useState(true);
  const toggleChange = () => {
    setVisible((pre) => {
      if (pre === false) {
        column.setFilterValue('');
      }
      return !pre;
    });
  };

  return (
    <div className="flex">
      {visible ? "" : <Filter column={column} table={table} />}
      {!visible ? (
        <MdFilterListOff
          onClick={toggleChange}
          size={20}
          className="cursor-pointer ml-2"
        />
      ) : (
        <MdFilterList
          size={20}
          onClick={toggleChange}
          className="cursor-pointer"
        />
      )}
    </div>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: TableType<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

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

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 0,
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
      onChange={(e) => setValue(e.target.value)}
      className="text-end  rounded-md  dark:text-black border bg-green-50  border-green-500 focus:outline-none focus:border-red-500 p-1"
      style={{ maxWidth: "100px" }}
    />
  );
}

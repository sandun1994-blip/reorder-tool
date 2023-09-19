/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { FcHighPriority } from "react-icons/fc";
import { RowData, createColumnHelper } from "@tanstack/react-table";
import React, { useState } from "react";
import ReactSelect from "react-select";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const columnHelper = createColumnHelper<any>();

export const columns = [
  columnHelper.accessor("fromLoc", {
    header: () => "",
    cell: (info) => (
      <div className=" flex items-center justify-center">
        {info.getValue() ? <FcHighPriority size={25} /> : " "}
      </div>
    ),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.name, {
    id: "name",
    cell: ({ getValue, row, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState<{
        value: string;
        label: string;
      } | null>({
        value: initialValue,
        label: initialValue,
      });

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {};

      // If the initialValue is changed external, sync it up with our state
      React.useEffect(() => {
        table.options.meta?.updateData(row.index, id, value?.value);
      }, [value]);

      const options =
        row.original.nameArray &&
        row.original.nameArray.map((data: string) => ({
          value: data,
          label: data,
        }));
      return (
        // <input
        //   value={value as string}
        //   onChange={e => setValue(e.target.value)}
        //   onBlur={onBlur}
        // />

        <>
          <div style={{ width: "200px" }}>
            <ReactSelect
              id={row.id}
              defaultValue={value}
              onChange={setValue}
              options={options}
            />
          </div>
        </>
      );
    },
    header: () => <span>Supplier</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("onHandQty", {
    header: () => "",
    cell: (info) => {
// console.log(info.row.original.fromLoc);

      return<>{info.row.original.fromLoc>0?<button>qty</button>:''}</> 
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("stockCode", {
    header: () => <span>Stockcode</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("branchName", {
    header: "Location",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("sales6", {
    header: "6",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("sales5", {
    header: "5",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("sales4", {
    header: "4",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("sales3", {
    header: "3",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("sales2", {
    header: "2",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("sales1", {
    header: "1",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("sales0", {
    header: "Cur",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("sales", {
    header: "Avg",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("inStockQTY", {
    header: "On Hand",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("Incommingty", {
    header: "Incoming",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("For Sales", {
    header: "salesOrdQTY",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("minStock", {
    header: "Min",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("maxStock", {
    header: "Max",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("calcReOrd", {
    header: "Reord Qty",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("pause", {
    header: "Pause",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("select", {
    header: "All",
    footer: (info) => info.column.id,
  }),
];

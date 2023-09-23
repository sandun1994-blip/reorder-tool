/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { FcHighPriority } from "react-icons/fc";
import {
  Column,
  ColumnDef,
  RowData,
  Table,
  createColumnHelper,
} from "@tanstack/react-table";
import React, { HTMLProps, useEffect, useState } from "react";
import ReactSelect from "react-select";
import { Checkbox } from "@/components/ui/checkbox";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import { Button } from "@/components/ui/button";

declare module "@tanstack/react-table" {
  //   interface TableMeta<TData extends RowData> {
  //     updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  //   }
  interface ColumnMeta<TData extends unknown, TValue> {
    filterVisible: any;
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
    enableColumnFilter: false,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.name, {
    id: "name",
    meta: {
      filterVisible: true,
    },
    cell: ({ getValue, row, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [option, setOption] = useState<{
        value: string;
        label: string;
      } | null>({
        value: initialValue,
        label: initialValue,
      });
      const [value, setValue] = useState(initialValue);

      const [selectedOption, setSelectedOption] = useState("");

      // Handle the change event when an option is selected
      // const handleSelectChange = (event) => {
      //   setSelectedOption(event.target.value);
      //   table.options.meta?.updateData(row.index, id, event.target.value);
      // };

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, id, option?.value);
      };

      // If the initialValue is changed external, sync it up with our state
      React.useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      //  console.log('updated');
      const handle = (val: any) => {
        table.options.meta?.updateData(row.index, id, val?.value as string);
      };

      const options =
        row.original.nameArray &&
        row.original.nameArray.map((data: string) => ({
          value: data,
          label: data,
        }));
      return (
        <>
          <div style={{ width: "200px" }}>
            {/* <select id="mySelect" value={selectedOption} onChange={handleSelectChange}>
        <option value="">Select...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select> */}
            <ReactSelect
              id={row.id}
              defaultValue={option}
              onChange={handle}
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
    enableColumnFilter: false,
    cell: ({ getValue, row: { index, original }, column: { id }, table }) => {
      // console.log(info.row.original.fromLoc);
      const handleClick = () => {
        table.options.meta?.setwareHouseData(original);
        table.options.meta?.setChartModal(true);
      };

      return (
        <>
          {original.fromLoc > 0 ? (
            <Button variant={"outline"} size={"sm"} onClick={handleClick}>
              QTY
            </Button>
          ) : (
            ""
          )}
        </>
      );
    },
    footer: (id) => id,
  }),
  columnHelper.accessor("stockCode", {
    header: () => <span>Stockcode</span>,
    footer: (info) => info.column.id,
    meta: {
      filterVisible: true,
    },
  }),
  columnHelper.accessor("expander", {
    header: () => "",
    enableColumnFilter: false,
    cell: ({ row }) => {
      return row.original.isExpand ? (
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: "pointer" },
          }}
        >
          {row.getIsExpanded() ? "👇" : "👉"}
        </button>
      ) : (
        ""
      );
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    enableColumnFilter: false,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("branchName", {
    header: "Location",
    meta: {
      filterVisible: true,
    },
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
  columnHelper.accessor("salesOrdQTY", {
    header: "For Sales ",
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
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = React.useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      React.useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      return (
        <input
          value={value as number}
          onChange={(e) => setValue(+e.target.value)}
          onBlur={onBlur}
          type="number"
          className=" text-end  rounded-md  dark:text-black border bg-green-50  border-green-500 focus:outline-none focus:border-red-500 p-1"
          style={{ maxWidth: "50px" }}
        />
      );
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("pause", {
    header: "Pause",
    enableColumnFilter: false,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("select", {
    header: ({ table }) => {
      return (
        <Checkbox
          className="mr-2"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <Checkbox
        className="mr-2"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
      />
    ),
    footer: (info) => info.column.id,
  }),
];

/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import {
  createColumnHelper,
} from "@tanstack/react-table";
import React, { useState } from "react";
import ReactSelect from "react-select";
import { Checkbox } from "@/components/ui/checkbox";





const columnHelper = createColumnHelper<any>();

export const columnsExpand = [
  columnHelper.accessor((row) => row.sName, {
    id: "sName",
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
        value: row.original?.name.accNo,
        label: row.original?.name.name,
      });

      // When the input is blurred, we'll call our table meta's updateData function

      // If the initialValue is changed external, sync it up with our state
      React.useEffect(() => {
        setOption(pre=>({...pre,
          value: row.original?.name.accNo,
          label: row.original?.name.name,
        }));
           
      }, [row.original.name, row.original.sName]);
     
      //  console.log('updated');
      const handle = (val: any) => {
        table.options.meta?.updateSelectValue(row.index, id, val);
      };

      const options = row.original.nameArray && row.original.nameArray;

      return (
        <>
          <div style={{ width: "200px", }}>
            <ReactSelect
              theme={(theme) => ({
                ...theme,
                borderRadius: 1,
                colors: {
                  ...theme.colors,
                  text: "orangered",
                  primary25: "#22C55E",
                  primary: "#22C55E",
                },
              })}
              styles={{ control: base => ({
                ...base,
                border: 1,
                // This line disable the blue border
                boxShadow: 'none',
                borderRadius:'5px',
                
               
              })}}
              className="text-black focus:outline-none  shadow-xl rounded border border-gray-400 dark:border-gray-400 focus:border-gray-400"
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
  columnHelper.accessor("stockCode", {
    header: () => <span>Stockcode</span>,
    footer: (info) => info.column.id,
    meta: {
      filterVisible: true,
    },
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      return <div className="text-start">{getValue()}</div>
    },
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
  columnHelper.accessor("incommingty", {
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
          className=" text-end    dark:text-white border  border-gray-300  focus:outline-none focus:border-red-500 p-1 rounded dark:bg-slate-600"
          style={{ maxWidth: "70px" }}
        />
      );
    },
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

/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { FcHighPriority } from "react-icons/fc";
import { RowData, createColumnHelper } from "@tanstack/react-table";
import React, { HTMLProps, useEffect, useState } from "react";
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
    // enableSorting:false,
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

      const [selectedOption, setSelectedOption] = useState('');

      // Handle the change event when an option is selected
      // const handleSelectChange = (event) => {
      //   setSelectedOption(event.target.value);
      //   table.options.meta?.updateData(row.index, id, event.target.value);
      // };

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, id, option?.value)
      };

      // If the initialValue is changed external, sync it up with our state
      React.useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

    //  console.log('updated');
     const handle=(val :any)=>{
      table.options.meta?.updateData(row.index, id, val?.value as string)
     }

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
    cell: (info) => {
      // console.log(info.row.original.fromLoc);

      return <>{info.row.original.fromLoc > 0 ? <button>qty</button> : ""}</>;
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("stockCode", {
    header: () => <span>Stockcode</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("expander", {
    header: () => "",
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
          className="w-16 text-end"
        />
      );
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("pause", {
    header: "Pause",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("select", {
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
    footer: (info) => info.column.id,
  }),
];

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

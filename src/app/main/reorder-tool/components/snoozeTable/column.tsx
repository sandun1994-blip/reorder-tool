/* eslint-disable react-hooks/rules-of-hooks */
"use client";


import {
  Column,
  ColumnDef,
  RowData,
  Table,
  createColumnHelper,
} from "@tanstack/react-table";
import React, { HTMLProps, useEffect, useState } from "react";

import {
  MdExpandLess,
  MdExpandMore,
  MdFilterList,
  MdFilterListOff,
} from "react-icons/md";
import { FaDeleteLeft } from "react-icons/fa6";

import axios from "axios";

import { toast } from "react-toastify";

declare module "@tanstack/react-table" {
  //   interface TableMeta<TData extends RowData> {
  //     updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  //   }
  interface ColumnMeta<TData extends unknown, TValue> {
    filterVisible: any;
  }
}

const columnHelper = createColumnHelper<any>();

export const columnsSnooze = [
  columnHelper.accessor("stockCode", {
    header: () => <span>STOCKCODE</span>,
    footer: (info) => info.column.id,
    meta: {
      filterVisible: false,
    },
  }),
  columnHelper.accessor("locNo", {
    header: "LOC NO",
    enableColumnFilter: true,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("accNo", {
    header: "ACC NO",
    meta: {
      filterVisible: false,
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("insertDate", {
    header: "INSERT DATE",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("hiddenDay", {
    header: "SNOOZED DAY",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("insertBy", {
    header: "INSERT BY",
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("delete", {
    header: "UNSNOOZE",
    cell: ({ getValue, row: { index, original }, column: { id }, table }) => {


      const postData = async () => {

        const config = {
          method: "DELETE",
          url: "/api/reordertool/pauseItem/"+ original.id,
          headers: {
            "Content-Type": "application/json",
          },
        };
        const res = await axios(config);
        return res.data;
      };

      const handleClick = async () => {
        try {
          await postData();
          toast.success('Sucess', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });

            table.options.meta?.removeRow(index, id);
            table.options.meta?.setSnoozeRemoveData((data:any)=>[...data,original])
        } catch (error) {
          toast.error('Can Not Delete', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
           console.log(error);
        }
      };
      return (
        <div className=" flex items-center justify-center">
          <FaDeleteLeft
            size={25}
            className="cursor-pointer hover:text-red-600"
            onClick={handleClick}
            />
          
        </div>
      );
    },
    enableColumnFilter: false,
    footer: (info) => info.column.id,
  })
];

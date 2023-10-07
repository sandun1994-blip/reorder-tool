/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { FaExclamation } from "react-icons/fa";
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
import {
  MdExpandLess,
  MdExpandMore,
  MdFilterList,
  MdFilterListOff,
} from "react-icons/md";
import { BsPauseCircle } from "react-icons/bs";
import { ImCheckmark } from "react-icons/im";

import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const columns = [
  columnHelper.accessor("fromLoc", {
    header: () => "",
    cell: (info) => (
      <div className=" flex items-center justify-center">
        {info.getValue() ? (
          <FaExclamation size={20} className="text-red-500" />
        ) : (
          " "
        )}
      </div>
    ),
    enableColumnFilter: false,
    footer: (info) => info.column.id,
  }),
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
              classNames={{
                control: (state) =>
                  state.isFocused ? "border-red-600" : "border-red-300",
                input: () => "text-red-500 ",
                menuList(props) {
                  return " ";
                },
                groupHeading(props) {
                  return "bg-yellow-400";
                },
                menu: () => "bg-red-400",
                indicatorsContainer(props) {
                  return "text-red-400";
                },
                valueContainer: () => " rounded-md  dark:text-white  ",
                dropdownIndicator: () => "bg-green-2s00",
                group(props) {
                  return "bg-red-500";
                },
                menuPortal: () => "bg-red-500",
                option: () => "text-red-500",
                singleValue(props) {
                  return "text-green-500";
                },
                placeholder: () => "text-green-500",
                multiValueLabel: () => "text-red-500",multiValue:()=>'text-red-500 bg-black',indicatorSeparator:()=>'text-green-400'
              }}
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
            <Button variant={"outline"} size={"sm"} onClick={handleClick} className="border-gray-400 dark:bg-slate-600 dark:text-white rounded">
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
          {row.getIsExpanded() ? (
            <MdExpandLess size={25} color={"red"} />
          ) : (
            <MdExpandMore size={25} color={"red"} />
          )}
        </button>
      ) : (
        ""
      );
    },
    footer: (info) => info.column.id,
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
          className=" text-end    dark:text-white border    focus:outline-none focus:border-red-500 p-1 rounded dark:bg-slate-600"
          style={{ maxWidth: "70px" }}
        />
      );
    },
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("pause", {
    header: "Pause",
    cell: ({ getValue, row: { index, original }, column: { id }, table }) => {
      const [visible, setVisible] = useState(false);
      const [day, setDay] = useState(7);

      const today = new Date();
      const pasueItem = {
        stockCode: original.stockCode.trim(),
        accNo: original.supplierNumber,
        locNo: original.locationNumber,
        insertDate: today,
        hiddenDay: day,
        combineCode: (
          `${original.stockCode}` +
          "-" +
          `${original.locationNumber}` +
          "-" +
          `${original.supplierNumber}`
        ).trim(),
      };

      const postData = async () => {
        const postData = { ...pasueItem };

        const config = {
          method: "post",
          url: "/api/reordertool/pauseItem",
          headers: {
            "Content-Type": "application/json",
          },
          data: postData,
        };
        const res = await axios(config);
        return res.data;
      };

      const handleClick = async () => {
        try {
          await postData();
          toast.success("Sucess", {
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
          setVisible(false);
        } catch (error) {
          toast.error("Error", {
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
          <Dialog open={visible} onOpenChange={setVisible}>
            <DialogTrigger asChild>
              <Button  className="dark:bg-transparent bg-transparent hover:bg-transparent">
                <BsPauseCircle size={25} className="cursor-pointer hover:text-green-500 text-black" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Snoozed Item</DialogTitle>
                <DialogDescription>
                  How many day do you want to hidden this item from today?
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    No of Days
                  </Label>
                  <Input
                    id="day"
                    className="col-span-3"
                    type="number"
                    onChange={(e) => setDay(Number(e.target.value))}
                    value={day}
                    min={1}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleClick}>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
    enableColumnFilter: false,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor("isCreateWorkOrder", {
    header: () => "WO",
    cell: (info) => (
      <div className=" flex items-center justify-center">
        {info.getValue() ? (
          <ImCheckmark size={20} className="text-green-500" />
        ) : (
          " "
        )}
      </div>
    ),
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

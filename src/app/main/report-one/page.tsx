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
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  RowData,
  TableOptions,
  VisibilityState,
  ColumnResizeMode,
} from "@tanstack/react-table";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { columns } from "./components/columnsReorder";
import axios from "axios";
import SelectComp from "./components/SelectComp";
import {
  getCombineCode,
  getLocations,
  getStockOrder,
  getSupplier,
  isCreateWorkOrder,
} from "./lib/lib";

import ReorderDataTable from "./components/data-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadToExcel } from "./lib/xlsx";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import WarehouseComp from "./components/warehouseComp";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  refreshAll,
  sendOrder,
  sendTransfers,
  sendWorkOrder,
} from "./lib/sendHooks";
import SnoozeItems from "./components/snoozeItems";
import { useRouter } from "next/navigation";
import { FcSearch } from "react-icons/fc";
import "../reorder-tool/index.css";
import { ImFolderDownload } from "react-icons/im";
import { BsExclude, BsFillPauseBtnFill, BsFillSendFill } from "react-icons/bs";
import { BiSolidReport } from "react-icons/bi";
import { IoIosListBox, IoMdRefreshCircle, IoMdResize } from "react-icons/io";
import { Card, CardContent } from "@/components/ui/card";
import { IoSearchCircle } from "react-icons/io5";
import { Checkbox } from "@/components/ui/checkbox";

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> {
    editedRows: any | null;
    updateData: (rowIndex: any, columnId: any, value: any) => void;
    setEditedRows: any;
    addRow: any;
    setwareHouseData: any;
    setChartModal: React.Dispatch<React.SetStateAction<boolean>>;
    updateSelectValue: (rowIndex: any, columnId: any, value: any) => void;
    removeRow: (rowIndex: any, columnId: any) => void;
    setSnoozeRemoveData: any;
  }
}

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
  const router = useRouter();

  const globalFns: FilterFn<any> = (
    row,
    columnId: string,
    filterValue: any
  ) => {
    if (options.length > 0 || optionsTwo.length > 0) {
      if (columnId === "name") {
        return false;
      }
      return filterValue.includes("ALL")
        ? true
        : filterValue?.includes(row.getValue<unknown[]>(columnId));
    } else {
      const search = filterValue.toLowerCase();
      return Boolean(
        row
          .getValue<string | null>(columnId)
          ?.toString()
          ?.toLowerCase()
          ?.includes(search)
      );
    }
  };
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [loading,setLoading]=useState(false)
  const [data, setData] = useState<any[]>([]);
  const [supplierData, setSupplierData] = useState([]);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const [arrayOfLocations, setArrayOfLocations] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [optionsTwo, setOptionsTwo] = useState<any[]>([]);
  const [editedRows, setEditedRows] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [wareHouseData, setwareHouseData] = useState({});
  const [chartModal, setChartModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [pauseItems, setPauseItems] = useState([]);
  const [snoozeVisible, setSnoozeVisible] = useState(false);
  const [soonzeRemoveData, setSnoozeRemoveData] = useState([]);
  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>("onChange");
  const [resizeMode, setResizemode] = useState(false);
  const [checkWoCurrent, setCheckWoCurrent] = useState(false);
  const optionsArray = useMemo(
    () => arrayOfLocations.map((val) => ({ value: val, label: val })),
    [arrayOfLocations]
  );

  const columnDef = useMemo(() => {
    return columns;
  }, []);

  useEffect(() => {
    setGlobalFilter(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const getData = async (supData: any, snoozeItem: any) => {
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
        const reduceSupData = supData.map((item: any) => ({
          value: item.value,
          label: item.label,
        }));
        const pauseItems = getCombineCode(snoozeItem);
        const stkData = getStockOrder(res.data, reduceSupData, pauseItems);

        setData(
          stkData.filter(
            (data) =>
              data.workOrder &&
              data.maxStock >
                data.inStockQTY + data?.incommingty - data.salesOrdQTY &&
              data.minStock <
                data.inStockQTY + data?.incommingty - data.salesOrdQTY
          )
        );
        setSupplierData(supData);
        setArrayOfLocations(getLocations(res.data));
        setPauseItems(snoozeItem);
        setOriginalData(
          stkData.filter(
            (data) =>
              data.maxStock >
                data.inStockQTY + data?.incommingty - data.salesOrdQTY &&
              data.minStock <
                data.inStockQTY + data?.incommingty - data.salesOrdQTY
          )
        );
      } catch (error) {
        console.log(error);
      }
    };

    const getSupplierData = async () => {
      const url = "/api/supplieraccount";
      const config = {
        method: "get",
        url,
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const res = await axios(config);
        const supData = getSupplier(res.data);

        return supData;
      } catch (error) {
        console.log(error);
      }
    };

    const getPauseItems = async () => {
      const url = "/api/reordertool/pauseItem";
      const config = {
        method: "get",
        url,
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const res = await axios(config);

        return res.data;
      } catch (error) {
        console.log(error);
      }
    };

    const getAllData = async () => {
      setLoading(true)
      try {
        const pauseItems = await getPauseItems();
        const supData = await getSupplierData();
        const allData = await getData(supData, pauseItems);
        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    };

    getAllData();
  }, []);

  const table = useReactTable({
    data,
    columns: columnDef,
    columnResizeMode,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    autoResetPageIndex,
    filterFns: {
      globalFns,
    },
    state: {
      rowSelection,
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
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
      editedRows,
      setSnoozeRemoveData,
      setEditedRows,
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setData((old: any) =>
          old.map((row: any, index: any) => {
            if (index === rowIndex) {
              if (old[rowIndex]?.billomatHdr) {
                return {
                  ...old[rowIndex],
                  [columnId]: value,
                  isCreateWorkOrder: isCreateWorkOrder({
                    ...old[rowIndex],
                    calcReOrd: value,
                  }),
                };
              }
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
      updateSelectValue: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();

        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value.label,
                name: { name: value.label, accNo: value.value },
              };
            }
            return row;
          })
        );
      },
      removeRow: (rowIndex, columnId) => {
        skipAutoResetPageIndex();
        setData((old) => old.filter((row, index) => index != rowIndex));

        table.resetRowSelection();
      },
      addRow: () => {
        const newRow: any = {
          studentId: Math.floor(Math.random() * 10000),
          name: "",
          dateOfBirth: "",
          major: "",
        };
        const setFunc = (old: any[]) => [...old, newRow];
        setData(setFunc);
        // setOriginalData(setFunc);
      },
      setwareHouseData,
      setChartModal,
    },
  });

  useEffect(() => {
    const locations = options.map((loc) => loc.value);
    const locationsTwo = optionsTwo.map((loc) => loc.value);

    if (locations.length > 0 || locationsTwo.length > 0) {
      setGlobalFilter(
        JSON.stringify([...locations, ...locationsTwo, searchValue])
      );
    } else {
      setGlobalFilter("");
    }
  }, [options, optionsTwo]);

  const shoCurrentWo = (val: boolean) => {
    table.resetRowSelection();
    if (val) {
      setData(originalData.filter((data) => !data.workOrder));
    } else {
      setData(originalData.filter((data) => data.workOrder));
    }
    setCheckWoCurrent(val);
  };

  const chartData = useMemo(() => {
    return wareHouseData;
  }, []);

  console.log(table.getFilteredSelectedRowModel().rows);
  return (
    <div className="pr-5 pl-5 py-5 shadow-2xl  h-full ml-5 rounded-md">
      <>
        {snoozeVisible && (
          <SnoozeItems
            setSnoozeVisible={setSnoozeVisible}
            snoozeVisible={snoozeVisible}
            setSnoozeRemoveData={setSnoozeRemoveData}
          />
        )}
        {chartModal && (
          <WarehouseComp
            chartModal={chartModal}
            setChartModal={setChartModal}
            details={wareHouseData}
          />
        )}
      </>

      <div className="mx-3 ">
        <div
          className=" flex justify-between items-center pt-4
       bg-white rounded-lg shadow-xl p-6 dark:bg-[#2E3B42] border-gray-400"
        >
          <div className="rounded-md  ">
            <label
              htmlFor="search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative ">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IoSearchCircle color={"gray"} size={25} />
              </div>
              <input
                type="search"
                id="search"
                className="block w-full p-2 pl-10 text-sm text-gray-900 border
         border-gray-400 rounded-lg bg-gray-50 focus:ring-[#B4B4B3] focus:border-[#B4B4B3]
          dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
           dark:focus:ring-[#B4B4B3] dark:focus:border-[#B4B4B3] focus:outline-none  shadow-md"
                value={searchValue}
                placeholder="Search..."
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          <div className="z-50 hidden md:flex">
            {" "}
            <SelectComp
              id={"loc-filter"}
              options={options}
              setOptions={setOptions}
              optionArray={optionsArray}
              setGlobalFilter={setGlobalFilter}
            />
          </div>

          <div className="z-50 hidden md:flex items-center">
            <Checkbox
              className="mr-2 rounded transform hover:scale-105 transition-transform w-5 h-5"
              checked={checkWoCurrent}
              onCheckedChange={(value) => shoCurrentWo(!!value)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              SHOW CURRENT WO
            </label>
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="ml-auto border-gray-400 dark:bg-[#2E3B42] rounded transform hover:scale-105 transition-transform"
                  disabled={sending}
                >
                  Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="rounded-lg borrder border-gray-500 "
              >
                <DropdownMenuLabel>Select Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize cursor-pointer transform hover:scale-105 transition-transform"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value: boolean) => {
                          column.toggleVisibility(!!value);
                        }}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  disabled={sending}
                  className="shadow-lg dark:bg-[#2E3B42] rounded border-gray-400
                  transform hover:scale-110 transition-transform"
                >
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-lg borrder border-gray-300 w-56">
                <DropdownMenuLabel className="flex justify-center items-center text-black font-bold dark:text-white">
                  Select Action{" "}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Button
                      variant={"outline"}
                      onClick={() => downloadToExcel(data)}
                      className="rounded-lg w-40 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white text-left border border-gray-300  hover:border-green-500 transform hover:scale-105 transition-transform"
                    >
                      Download
                    </Button>
                    <DropdownMenuShortcut>
                      <ImFolderDownload size={25} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        sendOrder(table, toast, setSending, supplierData);
                      }}
                      className="rounded-lg w-40 text-left border-gray-300  hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white transform hover:scale-105 transition-transform"
                    >
                      Send Orders
                    </Button>
                    <DropdownMenuShortcut>
                      <BsFillSendFill size={25} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        sendTransfers(table, toast, setSending, supplierData);
                      }}
                      className="rounded-lg w-40 text-left border-gray-300  hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white transform hover:scale-105 transition-transform"
                    >
                      Transfer
                    </Button>
                    <DropdownMenuShortcut>
                      <BsFillSendFill size={25} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        sendWorkOrder(table, toast, setSending, supplierData);
                      }}
                      className="rounded-lg w-40 text-left border-gray-300  hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white transform hover:scale-105 transition-transform"
                    >
                      Work Order
                    </Button>
                    <DropdownMenuShortcut>
                      <BsFillSendFill size={25} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        setSnoozeVisible(true);
                      }}
                      className="rounded-lg w-40 border-gray-300  hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white transform hover:scale-105 transition-transform"
                    >
                      Snoozed Items
                    </Button>
                    <DropdownMenuShortcut>
                      <BsFillPauseBtnFill size={25} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>
                    <Button
                      variant={"outline"}
                      onClick={() => {}}
                      className="rounded-lg w-40 border-gray-300  hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white transform hover:scale-105 transition-transform"
                    >
                      Exclude Items
                    </Button>
                    <DropdownMenuShortcut>
                      <BsExclude size={25} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        router.push("reorder-tool");
                      }}
                      className="rounded-lg w-40 border-gray-300 0 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white transform hover:scale-105 transition-transform"
                    >
                      RO-Tool
                    </Button>
                    <DropdownMenuShortcut>
                      <BiSolidReport size={25} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        refreshAll(toast, setSending);
                      }}
                      className="rounded-lg w-40 border-gray-300  hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white transform hover:scale-105 transition-transform"
                    >
                      Refresh
                    </Button>
                    <DropdownMenuShortcut>
                      <IoMdRefreshCircle size={25} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Button
                      variant={"outline"}
                      onClick={() => {
                        setResizemode((pre) => !pre);
                      }}
                      className="rounded-lg w-40 border-gray-300  hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white transform hover:scale-105 transition-transform"
                    >
                      Resize Mode
                    </Button>
                    <DropdownMenuShortcut>
                      <IoMdResize size={25} />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className=" p-3 shadow-2xl  overflow-x-auto ">
        <ReorderDataTable
          useTable={table}
          supData={supplierData}
          columns={columnDef}
          columnResizeMode={columnResizeMode}
          resizeMode={resizeMode}
          loading={loading}
        />
      </div>

      <div className="h-4" />

      <nav
        className="my-3  bg-white rounded-lg 
      shadow-xl p-6 dark:bg-[#2E3B42] flex items-center justify-between "
      >
        <div>
          <ul className="list-style-none flex">
            <li>
              <button
                className="pointer-events-none relative block rounded bg-transparent
                hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white
                px-3 py-1.5 text-sm text-black font-semibold transition-all duration-300 dark:text-neutral-400"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
            </li>
            <li>
              <button
                className="relative block rounded bg-transparent px-3 py-1.5 text-sm
                hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white
                text-black font-bold transition-all duration-300 hover:bg-neutral-100  dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </button>
            </li>
            <li aria-current="page">
              <button
                className="relative block rounded bg-primary-100
                hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white
                text-black  px-3 py-1.5 text-sm font-bold text-primary-700 transition-all duration-300 dark:text-white"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </button>
            </li>

            <li>
              <button
                className="relative block rounded bg-transparent px-3 py-1.5 text-sm
                 text-black font-bold transition-all duration-300 hover:bg-neutral-100
                  dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white
                  hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </li>

            <li></li>
          </ul>
        </div>

        <div className="hidden md:flex">
          <span className="flex  text-black font-bold items-center bg-transparent px-3 py-1.5 text-sm  transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white">
            Go to page :
            <input
              type="number"
              min="1"
              max={`${table?.getPageCount()}`}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className=" block w-16 ml-3  p-2 text-center  text-sm text-gray-900 border
              border-gray-300 rounded-lg bg-gray-50 focus:ring-[#B4B4B3] focus:border-[#B4B4B3]
               dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
                dark:focus:ring-[#B4B4B3] dark:focus:border-[#B4B4B3] focus:outline-none  shadow-md"
            />
          </span>
        </div>
        <div>
          <Select
            onValueChange={(val) => {
              table.setPageSize(Number(val));
            }}
          >
            <SelectTrigger
              className=" w-[110px]  p-2   border border-gray-300 rounded-lg 
           focus:outline-none   dark:border-gray-600
           dark:placeholder-gray-400 dark:text-white dark:focus:outline-none dark:focus:border-whi 
           text-md dark:bg-[#2E3B42] "
            >
              <SelectValue
                placeholder={`show ${table.getState().pagination.pageSize}`}
                className=" font-bold "
              />
            </SelectTrigger>
            <SelectContent className="text-md  dark:bg-[#2E3B42]  font-bold">
              <SelectGroup className=" dark:bg-[#2E3B42]  font-bold">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={`${pageSize}`}
                    className="text-md  font-bold hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white dark:bg-[#2E3B42]"
                  >
                    show {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex fle">
          <span className="flex items-center gap-1 pointer-events-none relative  rounded bg-transparent px-3 py-1.5 text-sm text-neutral-500 transition-all duration-300 dark:text-neutral-400">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <form>
            <button
              type="submit"
              className="ml-3  relative  rounded bg-transparent px-3 
            py-1.5 text-sm text-neutral-500 transition-all duration-300
            cursor-pointer dark:text-neutral-400 
            hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-400 hover:text-white"
            >
              Reload
            </button>
          </form>
        </div>
      </nav>

      <div
        className="flex-1 text-sm  text-blue-900 font-bold dark:text-blue-600"
        style={{ color: "blue" }}
      >
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected
      </div>
    </div>
  );
};

export default ReorderTool;

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
} from "./lib/lib";

import ReorderDataTable from "./components/data-table";
import { Input } from "@/components/ui/input";

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
import { sendOrder, sendTransfers, sendWorkOrder } from "./lib/sendHooks";
import SnoozeItems from "./components/snoozeItems";
import { useRouter } from "next/navigation";
import { FcSearch } from "react-icons/fc";
import '../reorder-tool/index.css'


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
  const [columnResizeMode, setColumnResizeMode] =React.useState<ColumnResizeMode>('onChange')
  const [resizeMode,setResizemode] =useState(false)
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
      console.log("initial");

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

        setData(stkData);
        setSupplierData(supData);
        setArrayOfLocations(getLocations(res.data));
        setPauseItems(snoozeItem);
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
      try {
        const pauseItems = await getPauseItems();
        const supData = await getSupplierData();
        const allData = await getData(supData, pauseItems);
      } catch (error) {
        console.log(error);
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
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
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
                name: {name:value.label,accNo:value.value},
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
      console.log("location");

      setGlobalFilter(
        JSON.stringify([...locations, ...locationsTwo, searchValue])
      );
    } else {
      setGlobalFilter("");
    }

    // table.getFilteredRowModel()
    //  console.log(table.getFilteredRowModel());
  }, [options, optionsTwo]);

  // const soonzedepency =useMemo(()=>{
  //   return soonzeRemoveData
  // },[soonzeRemoveData])

  // useEffect(()=>{
  //   console.log(soonzeRemoveData,'soonzeRemoveData');
  // },[soonzedepency])

  const chartData = useMemo(() => {
    return wareHouseData;
  }, []);

  console.log(table.getFilteredSelectedRowModel().rows);
  return (
    <div className="pr-5 pl-5 py-5 shadow-2xl  ">
      <>
      <SnoozeItems
          details={pauseItems}
          setDetails={setPauseItems}
          setSnoozeVisible={setSnoozeVisible}
          snoozeVisible={snoozeVisible}
          setSnoozeRemoveData={setSnoozeRemoveData}
        />
        <WarehouseComp
          chartModal={chartModal}
          setChartModal={setChartModal}
          details={wareHouseData}
        /></>
      <div className="flex justify-around items-center p-5  shadow-2xl sha">
      
        <div className="flex justify-center items-center gap-4">
          {" "}
          <FcSearch size={35}/>
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="max-w-sm border-gray-300"
          />
        </div>
        <div className="">
          {" "}
          <SelectComp
            id={"loc-filter"}
            options={options}
            setOptions={setOptions}
            optionArray={optionsArray}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
        <div className=" ml-3">
          <SelectComp
            id={"loc-filter-2"}
            options={optionsTwo}
            setOptions={setOptionsTwo}
            optionArray={optionsArray}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
        <div></div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto border-gray-300" disabled={sending}>
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
                      className="capitalize cursor-pointer"
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
              <Button variant="outline" disabled={sending} className="border-gray-300">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-lg borrder border-gray-300 w-56">
              <DropdownMenuLabel className="">Select Action</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Button
                    variant={"outline"}
                    onClick={() => downloadToExcel(data)}
                    className="rounded-lg w-40 text-left"
                  >
                    Download
                  </Button>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      sendOrder(table, toast, setSending, supplierData);
                    }}
                    className="rounded-lg w-40 text-left"
                  >
                    Send Orders
                  </Button>
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      sendTransfers(table, toast, setSending, supplierData);
                    }}
                    className="rounded-lg w-40 text-left"
                  >
                    Transfer
                  </Button>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      sendWorkOrder(table, toast, setSending, supplierData);
                    }}
                    className="rounded-lg w-40 text-left"
                  >
                    Work Order
                  </Button>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setSnoozeVisible(true);
                    }}
                    className="rounded-lg w-40"
                  >
                    Snoozed Items
                  </Button>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"outline"}
                    onClick={() => {}}
                    className="rounded-lg w-40"
                  >
                    Exclude Items
                  </Button>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"outline"}
                    onClick={() => {}}
                    className="rounded-lg w-40"
                  >
                    Report One
                  </Button>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Button
                    variant={"outline"}
                    onClick={() => {}}
                    className="rounded-lg w-40"
                  >
                    Refresh
                  </Button>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Button
                    variant={"outline"}
                    onClick={() => {setResizemode(pre=>!pre)}}
                    className="rounded-lg w-40"
                  >
                    Resize Mode
                  </Button>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className=" p-3 shadow-2xl  overflow-x-auto">
        <ReorderDataTable
          useTable={table}
          supData={supplierData}
          columns={columnDef}
          columnResizeMode={columnResizeMode}
          resizeMode={resizeMode}
        />
      </div>

      <div className="h-4" />

      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1 hover:border-green-500"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1 hover:border-green-500"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1 hover:border-green-500"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1 hover:border-green-500"
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
            min="1"
            max={`${table?.getPageCount()}`}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className=" text-center w-20 rounded-lg  border 
             border-gray-300 focus:outline-none focus:border-green-500 p-1.5 dark:text-white"
          />
        </span>

        <Select
          onValueChange={(val) => {
            table.setPageSize(Number(val));
          }}
        >
          <SelectTrigger
            className=" w-[110px]  p-2  text-gray-900 border border-gray-300 rounded-lg 
           focus:ring-green-500 focus:border-green-500  dark:border-gray-600
           dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500 text-md"
          >
            <SelectValue
              placeholder={`Show ${table.getState().pagination.pageSize}`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className=" ">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className="text-md focus:bg-green-500"
                >
                  Show {pageSize}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <form>
          <button type="submit" className="ml-3 font-bold hover:text-green-500 p-1  ">reload</button>
        </form>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected
      </div>
    </div>
  );
};

export default ReorderTool;

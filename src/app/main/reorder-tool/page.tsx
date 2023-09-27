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
} from "@tanstack/react-table";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { columns } from "./components/columnsReorder";
import axios from "axios";
import SelectComp from "./components/SelectComp";
import { getLocations, getStockOrder, getSupplier } from "./lib/lib";

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
import { Puff, Watch } from "react-loader-spinner";

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> {
    editedRows: any;
    updateData: (rowIndex: any, columnId: any, value: any) => void;
    setEditedRows: any;
    addRow: any;
    setwareHouseData: any;
    setChartModal: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [loading,setLoading] = useState(false)

  const optionsArray = useMemo(
    () => arrayOfLocations.map((val) => ({ value: val, label: val })),
    [arrayOfLocations]
  );

  const columnDef = useMemo(() => {
    return columns;
  }, []);

  useEffect(() => {
    //    table.getAllColumns().filter((col) => col.id === 'stockCode')[0].setFilterValue(searchValue);
    //console.log(table.getGlobalAutoFilterFn());

    setGlobalFilter(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const getData = async (supData: any) => {
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
        const stkData = getStockOrder(res.data.slice(0, 1000), reduceSupData);

        setData(stkData);
        setSupplierData(supData);
        setArrayOfLocations(getLocations(res.data));
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

    const getAllData = async () => {
      try {
        const supData = await getSupplierData();
        const allData = await getData(supData);
      } catch (error) {
        console.log(error);
      }
    };

    getAllData();
  }, []);

  const table = useReactTable({
    data,
    columns: columnDef,
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
      editedRows,
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

  const sendOrder = async () => {
    const orderData = table.getFilteredSelectedRowModel().rows;
    console.log("okk");

    // if (orderData.length === 0) {
    //   toast.warning("Select At Least One Order", { position: "top-center" });
    //   return;
    // }
    // if (orderData.filter((item) => Number(item.original.calcReOrd) <= 0).length > 0) {
    //   toast.warning("Reorder Value Should Be Greather Than 0", { position: "top-center" });
    //   return;
    // }
    //
    
    

    const postData = orderData
      .map((item) => item.original)
      .filter((item1) => item1.calcReOrd > 0)
      .map((subItem: any) => {
        const isChectItemWithCode = subItem.stockItem.supplierStockItems.find(
          ({ supplierAccount, stockCode }: any) =>
            supplierAccount.accNo === subItem.name.accNo &&
            stockCode === subItem.stockCode
        );

        if (isChectItemWithCode) {
          return {
            ...subItem,
            supplierAccount: isChectItemWithCode.supplierAccount,
            supplierNumber: isChectItemWithCode.supplierAccount.accNo,
            supplierCode: isChectItemWithCode.supplierCode,
          };
        } else if (
          supplierData.find((sup: any) => {
            return sup.supData.accNo === subItem.name.accNo;
          })
        ) {
          const supAccont: any = supplierData.find((sup: any) => {
            return sup.supData.accNo === subItem.name.accNo;
          });

          if (supAccont) {
            return {
              ...subItem,
              supplierAccount: supAccont.supData,
              supplierNumber: supAccont.supData.accNo,
            };
          }
          return subItem;
        } else {
          return subItem;
        }
      });

      
   
console.log(postData);


    try {
      const config = {
        method: "post",
        url: "/api/reordertool/sendorder",
        headers: {
          "Content-Type": "application/json",
        },
        data: postData,
      };

      // const res = await axios(config);
      const id = toast.loading(<div className="flex items-center justify-around"><Puff
      height="80"
      width="80"
      radius={1}
      color="#4fa94d"
      ariaLabel="puff-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />Sending....</div>,{icon:false})
const res= await new Promise((resolve)=>{
  setTimeout(()=>{
resolve('hi')
  },5000)
})

toast.update(id, { render: "All is good", type: "success", isLoading: false,autoClose:2000,style:{} });
     // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pr-5 pl-5 py-5 ">
      <div className="flex justify-between items-center p-5">
        <WarehouseComp
          chartModal={chartModal}
          setChartModal={setChartModal}
          details={wareHouseData}
        />
        <div>
          {" "}
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="max-w-sm"
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
              <Button variant="outline" className="ml-auto">
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
              <Button variant="outline">Actions</Button>
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
                    onClick={sendOrder}
                    className="rounded-lg w-40 text-left"
                  >
                    Send Orders
                  </Button>
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"outline"}
                    onClick={() => {}}
                    className="rounded-lg w-40 text-left"
                  >
                    Transfer
                  </Button>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"outline"}
                    onClick={() => {}}
                    className="rounded-lg w-40 text-left"
                  >
                    Work Order
                  </Button>
                  <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"outline"}
                    onClick={() => {}}
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
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className=" p-1">
        <ReorderDataTable useTable={table} data={data} columns={columns} />
      </div>

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
          className="border p-1 rounded "
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected
      </div>
    </div>
  );
};

export default ReorderTool;

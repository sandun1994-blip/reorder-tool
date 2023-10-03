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
import axios from "axios";
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
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "react-toastify";
import { Puff, Watch } from "react-loader-spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { columnsExpand } from "./columnExpand";
import { getLocations, getStockOrder, getStockOrderTwo, getSupplier } from "../../lib/lib";
import { downloadToExcel } from "../../lib/xlsx";
import ExpandDataTable from "./expandTable";

// declare module "@tanstack/table-core" {
//   interface TableMeta<TData extends RowData> {
//     editedRows: any;
//     updateData: (rowIndex: any, columnId: any, value: any) => void;
//     setEditedRows: any;
//     addRow: any;
//     setwareHouseData: any;
//     setChartModal: React.Dispatch<React.SetStateAction<boolean>>;
//     updateSelectValue : (rowIndex: any, columnId: any, value: any) => void;
//     removeRow :  (rowIndex: any, columnId: any) => void;
//   }
// }

type Props = {
    supData:any 
    mainDataItem:any
};

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

const ExpandComp = ({ supData,mainDataItem}: Props) => {





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

  const optionsArray = useMemo(
    () => arrayOfLocations.map((val) => ({ value: val, label: val })),
    [arrayOfLocations]
  );

  const columnDef:any = useMemo(() => {
    return columnsExpand;
  }, []);

  useEffect(() => {
    setGlobalFilter(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const getData = async () => {
      const url = "/api/billomatlines/" + mainDataItem.stockCode ;
      const config = {
        method: "get",
        url,
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const res = await axios(config);
        console.log(res.data);
        
        const reduceSupData = supData.map((item: any) => ({
          value: item.value,
          label: item.label,
        }));
        
        
        const stkData = getStockOrderTwo(res.data, reduceSupData,mainDataItem);
        console.log(stkData);
        setData(stkData);
      } catch (error) {
        console.log(error);
      }
    };

    ;

    const getAllData = async () => {
      try {
        
         await getData();
        
        
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
        console.log(rowIndex, columnId, value);
        
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value.label,name:value
              };
            }
            return row;
          })
        );
      },
      updateSelectValue:(rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value.label,name:value
              };
            }
            return row;
          })
        );
      },
      removeRow:()=>{},
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
console.log(data);

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

    // table.getFilteredRowModel()
    //  console.log(table.getFilteredRowModel());
  }, [options, optionsTwo]);

  const sendOrder = async () => {
    const orderData = table.getFilteredSelectedRowModel().rows;
    

    if (orderData.length === 0) {
      toast.warning("Select At Least One Order", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }
    if (
      orderData.filter((item) => Number(item.original.calcReOrd) <= 0).length >
      0
    ) {
      toast.warning("Reorder Value Should Be Greather Than 0", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }

    setSending(true);
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
          supData.find((sup: any) => {
            return sup.supData.accNo === subItem.name.accNo;
          })
        ) {
          const supAccont: any = supData.find((sup: any) => {
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

    

    const idsend = toast.loading(
      <div className="flex items-center justify-around text-slate-950 font-semibold">
        <Puff
          height="50"
          width="50"
          radius={1}
          color="#4fa94d"
          ariaLabel="puff-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
        Sending........
      </div>,
      { icon: false }
    );

    try {
      const config = {
        method: "post",
        url: "/api/reordertool/sendorder",
        headers: {
          "Content-Type": "application/json",
        },
        data: postData,
      };

      const res = await axios(config);

  

      toast.update(idsend, {
        render: "Created",
        isLoading: false,
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: "success",
      });
      

      const popupTost = (time: number, element: any) => {
        setTimeout(() => {
          if (element.status === "fulfilled") {
            toast(`PO ${element.value} Created`, {
              position: "top-right",
              autoClose: 2000 * time,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
              type: "success",
            });
          } else {
            toast("Order is not created", {
              position: "top-right",
              autoClose: 2000 * time,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
              type: "error",
            });
          }
        }, 1000 * time);
      };
      const valu = res.data.map((item: any) => ({
        ...item,
        value: item.value.poNumber,
      }));
      for (let index = 0; index < valu.length; index++) {
        const element = valu[index];
        popupTost(index + 1, element);
      }
      setSending(false);
    } catch (error) {
      toast.update(idsend, {
        render: "Internal Error",
        isLoading: false,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: "error",
      });
      console.log(error);
      setSending(false);
    }
  };

  const sendTransfers = async () => {
    const orderData = table.getFilteredSelectedRowModel().rows;

    if (orderData.length === 0) {
      toast.warning("Select At Least One Order", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }
    if (
      orderData.filter((item) => Number(item.original.calcReOrd) <= 0).length >
      0
    ) {
      toast.warning("Reorder Value Should Be Greather Than 0", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }
    setSending(true);
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
          supData.find((sup: any) => {
            return sup.supData.accNo === subItem.name.accNo;
          })
        ) {
          const supAccont: any = supData.find((sup: any) => {
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

    

    const id = toast.loading(
      <div className="flex items-center justify-around text-slate-950 font-semibold">
        <Puff
          height="50"
          width="50"
          radius={1}
          color="#4fa94d"
          ariaLabel="puff-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
        Sending........
      </div>,
      { icon: false }
    );

    try {
      const config = {
        method: "post",
        url: "/api/reordertool/sendtransfer",
        headers: {
          "Content-Type": "application/json",
        },
        data: postData,
      };

      const res = await axios(config);

      toast.update(id, {
        render: "Created",
        isLoading: false,
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: "success",
      });

      const popupTost = (time: number, element: any) => {
        setTimeout(() => {
          if (element.status === "fulfilled") {
            toast(`Stock ${element.value} Created`, {
              position: "top-right",
              autoClose: 2000 * time,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
              type: "success",
            });
          } else {
            toast("Stock is not created", {
              position: "top-right",
              autoClose: 2000 * time,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
              type: "error",
            });
          }
        }, 1000 * time);
      };
      const valu = res.data.map((item: any) => ({
        ...item,
        value: item.value.seqNo,
      }));
      for (let index = 0; index < valu.length; index++) {
        const element = valu[index];
        popupTost(index + 1, element);
      }
      
      setSending(false);
    } catch (error) {
      toast.update(id, {
        render: "Internal Error",
        isLoading: false,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type: "error",
      });
      console.log(error);
      setSending(false);
    }
  };

  return (
    <div className="pr-5 pl-5 py-5 ">
      
       
        
        <div className="flex justify-between items-center p-5">
        <div>
         
         <Input
           type="text"
           value={searchValue}
           onChange={(e) => setSearchValue(e.target.value)}
           className="max-w-sm border border-gray-300"
         />
       </div>
       
        <div className=" ml-3">
         
        </div>
        <div></div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto" disabled={sending}>
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
              <Button variant="outline" disabled={sending}>
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
                    onClick={sendTransfers}
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
        <ExpandDataTable useTable={table} data={data} columns={columnsExpand} />
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
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected
      </div>
    </div>
  );
};

export default ExpandComp;

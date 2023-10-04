"use client";

import { Button } from "@/components/Button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { DialogClose } from "@radix-ui/react-dialog";
import { Hourglass } from "react-loader-spinner";

import React, { useEffect, useMemo, useState } from "react";
import {
  RowData,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columnsSnooze } from "./snoozeTable/column";
import SnozzeDataTable from "./snoozeTable/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";
 import { FcSearch } from "react-icons/fc";





type Props = {
  setSnoozeVisible: any;
  snoozeVisible: boolean;
  details: any;
  setSnoozeRemoveData:any
  setDetails:any
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

const SnoozeItems = ({ setDetails,setSnoozeVisible, snoozeVisible, details ,setSnoozeRemoveData}: Props) => {
  console.log('snooze');

  const [data, setData] = useState(details);
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

  //const router = useRouter()

  const columnDef: any = useMemo(() => {
    return columnsSnooze;
  }, []);
 

  //   useEffect(() => {
  //     setLoading(true);
  //     const getData = async () => {
  //       const url = "/api/stktooltwo/" + details.stockCode;
  //       const config = {
  //         method: "get",
  //         url,
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       };
  //       try {
  //         const res = await axios(config);

  //         setData(getWareHouseData(res?.data));
  //         setLoading(false);
  //       } catch (error) {
  //         console.log(error);
  //         setLoading(false);
  //       }
  //     };
  //     if (details.stockCode) {
  //         getData();
  //     }

  //   }, [details.stockCode]);

  const table: any = useReactTable({
    data:details,
    columns: columnDef,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    autoResetPageIndex,
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
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    //  debugTable: true,
    // globalFilterFn: globalFnsTwo,

    meta: {
      editedRows,
      setEditedRows,
      updateData: (rowIndex, columnId, value) => {
      },
      updateSelectValue: (rowIndex, columnId, value) => {
       
      },
      removeRow: (rowIndex, columnId, ) => {
        skipAutoResetPageIndex();
        setDetails((old:any) =>
          old.filter((row:any, index:number) => index != rowIndex)
        );
      },
      addRow: () => {},
      setwareHouseData,
      setChartModal,
      setSnoozeRemoveData
    },
  });

;
  return (
    <div>
      <Dialog onOpenChange={setSnoozeVisible} open={snoozeVisible}>
        <DialogContent
          className={
            " overflow-y-scroll max-h-screen mt-10 border border-gray-500   max-w-fit "
          }
        >
          <DialogHeader>
            <DialogTitle className="ml-8">SNOOZED ITEMS</DialogTitle>
          </DialogHeader>
          <div className="flex justify-start gap- items-center">
          {" "}
          <FcSearch size={30} className='ml-8'/>
          <Input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-48 ml-8 mt-2 border-gray-400 h-8"
          />
        </div>
          <div className="grid gap-4 py-4 p-5 ">
            <div className=" p-5">
              <SnozzeDataTable useTable={table} columns={columnDef} />
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
            </div>
          </div>

          <DialogFooter>
          <form>
          <button type="submit" className="font-bold hover:text-blue-900">Refresh</button>
        </form>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SnoozeItems;


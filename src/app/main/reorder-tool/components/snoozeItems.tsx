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

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> {
    editedRows: any;
    updateData: (rowIndex: any, columnId: any, value: any) => void;
    setEditedRows: any;
    addRow: any;
    setwareHouseData: any;
    setChartModal: React.Dispatch<React.SetStateAction<boolean>>;
    updateSelectValue: (rowIndex: any, columnId: any, value: any) => void;
    removeRow: (rowIndex: any, columnId: any) => void;
  }
}

type Props = {
  setSnoozeVisible: any;
  snoozeVisible: boolean;
  details: any;
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

const SnoozeItems = ({ setSnoozeVisible, snoozeVisible, details }: Props) => {
  console.log(details);

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
console.log(data);

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

    // meta: {
    //   editedRows,
    //   setEditedRows,
    //   updateData: (rowIndex, columnId, value) => {
    //     // Skip page index reset until after next rerender
    //     console.log(rowIndex, columnId, value);

    //     skipAutoResetPageIndex();
    //     setData((old) =>
    //       old.map((row, index) => {
    //         if (index === rowIndex) {
    //           return {
    //             ...old[rowIndex],
    //             [columnId]: value.label,
    //             name: value,
    //           };
    //         }
    //         return row;
    //       })
    //     );
    //   },
    //   updateSelectValue: (rowIndex, columnId, value) => {
    //     // Skip page index reset until after next rerender
    //     skipAutoResetPageIndex();
    //     setData((old) =>
    //       old.map((row, index) => {
    //         if (index === rowIndex) {
    //           return {
    //             ...old[rowIndex],
    //             [columnId]: value.label,
    //             name: value,
    //           };
    //         }
    //         return row;
    //       })
    //     );
    //   },
    //   removeRow: () => {},
    //   addRow: () => {},
    //   setwareHouseData,
    //   setChartModal,
    // },
  });

  console.log(data);
  return (
    <div>
      <Dialog onOpenChange={setSnoozeVisible} open={snoozeVisible}>
        <DialogContent
          className={
            " overflow-y-scroll max-h-screen mt-10 border border-gray-500   max-w-fit "
          }
        >
          <DialogHeader>
            <DialogTitle>{details?.locationName}</DialogTitle>
            <DialogDescription>{details.stockCode}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 p-5 ">
            <div className=" p-1">
              <SnozzeDataTable useTable={table} columns={columnDef} />
            </div>
            {/* <div className="h-4" />

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
            </div> */}
          </div>

          <DialogFooter>
            <DialogClose className="border p-2 rounded-md hover:border-red-600 border-gray-600 mb-10">
              CLOSE
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SnoozeItems;


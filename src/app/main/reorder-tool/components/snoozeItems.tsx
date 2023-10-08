"use client";
import { Modal } from "react-responsive-modal";
import React, { useEffect, useMemo, useState } from "react";
import {
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
import { Input } from "@/components/ui/input";
import { FcSearch } from "react-icons/fc";
import axios from "axios";

import "react-responsive-modal/styles.css";
import "./custom-animation.css";
import { IoSearchCircle } from "react-icons/io5";

type Props = {
  setSnoozeVisible: any;
  snoozeVisible: boolean;
  setSnoozeRemoveData: any;
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

const SnoozeItems = ({
  setSnoozeVisible,
  snoozeVisible,
  setSnoozeRemoveData,
}: Props) => {
  const [data, setData] = useState([]);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [editedRows, setEditedRows] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [wareHouseData, setwareHouseData] = useState({});
  const [chartModal, setChartModal] = useState(false);
  const [loading, setLoading] = useState(false);

  //const router = useRouter()

  const columnDef: any = useMemo(() => {
    return columnsSnooze;
  }, []);

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
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

        setData(res?.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    getData();
  }, []);

  const table: any = useReactTable({
    data: data,
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
      updateData: (rowIndex, columnId, value) => {},
      updateSelectValue: (rowIndex, columnId, value) => {},
      removeRow: (rowIndex, columnId) => {
        skipAutoResetPageIndex();
        setData((old: any) =>
          old.filter((row: any, index: number) => index != rowIndex)
        );
      },
      addRow: () => {},
      setwareHouseData,
      setChartModal,
      setSnoozeRemoveData,
    },
  });

  console.log(snoozeVisible);

  return (
    <div>
      <Modal
        open={snoozeVisible}
        onClose={() => {
          setSnoozeVisible(false);
        }}
        center
        classNames={{
          overlayAnimationIn: "customEnterOverlayAnimation",
          overlayAnimationOut: "customLeaveOverlayAnimation",
          modalAnimationIn: "customEnterModalAnimation",
          modalAnimationOut: "customLeaveModalAnimation",
        }}
        animationDuration={800}
      >
        <div
          className={
            "  max-h-screen mt-10 border   max-w-fit shadow-md rounded-xl p-4 "
          }
        >
          <div>
            <h6 className="ml-8  font-semibold">SNOOZED ITEMS</h6>
          </div>
          <div className="flex justify-start gap- items-center mt-2">
            <div className="rounded-md  ml-8 ">
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
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="grid gap-4 py-4 p-5 ">
            <div className=" p-5">
              <SnozzeDataTable useTable={table} columns={columnDef} />
            </div>

            <nav
              className="my-0  bg-white rounded-lg 
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
                      onClick={() =>
                        table.setPageIndex(table.getPageCount() - 1)
                      }
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
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      table.setPageIndex(page);
                    }}
                    className=" block w-16 ml-3  p-2 text-center  text-sm text-gray-900 border
              border-gray-300 rounded-lg bg-gray-50 focus:ring-[#B4B4B3] focus:border-[#B4B4B3]
               dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black
                dark:focus:ring-[#B4B4B3] dark:focus:border-[#B4B4B3] focus:outline-none  shadow-md"
                  />
                </span>
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
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SnoozeItems;

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
import axios from "axios";
import { Hourglass } from  'react-loader-spinner'

import React, { useEffect, useState } from "react";
import { getStockOrder, getLocations } from "../lib/lib";

type Props = {
  setChartModal: any;
  chartModal: boolean;
  details: any;
};

const WarehouseComp = ({ setChartModal, chartModal, details }: Props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      const url = "/api/stktooltwo/" + details.stockCode;
      const config = {
        method: "get",
        url,
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const res = await axios(config);
        console.log(res.data,'ssssss');
        
        setData(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    if (details.stockCode) {
        getData();
    }

  }, [details.stockCode]);

 

  return (
    <div>
      <Dialog onOpenChange={setChartModal} open={chartModal}>
        <DialogContent
          className={
            " overflow-y-scroll max-h-screen mt-10 border border-green-500   max-w-fit"
          }
        >
          <DialogHeader>
            <DialogTitle>Add Trainee</DialogTitle>
            <DialogDescription>
              Add the email of your trainee.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 p-5 border border-green-500">
            {loading ? (
              <Hourglass
                visible={true}
                height="80"
                width="80"
                ariaLabel="hourglass-loading"
                wrapperStyle={{}}
                wrapperClass=""
                colors={["#306cce", "#72a1ed"]}
              />
            ) : (
              <div className=" items-center gap-4 border ">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>WAREHOUSES</TableHead>
                      <TableHead>SOH</TableHead>
                      <TableHead>WAREINCOMINGHOUSES</TableHead>
                      <TableHead>ANALASIS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((a) => (
                      <TableRow key={a} className="p-20 ">
                        <TableCell >WAREHOOOOOOOOOOOOOO</TableCell>
                        <TableCell >WAREHOOOOOOOOOOOOOO</TableCell>
                        <TableCell >WAREHOOOOOOOOOOOOOO</TableCell>
                        <TableCell >
                          WAREHOOOOOOOOOOOOOOFFFFFFFFFFFFFF
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose className="border p-2 rounded-md hover:border-red-600 border-green-600">
              CLOSE
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WarehouseComp;

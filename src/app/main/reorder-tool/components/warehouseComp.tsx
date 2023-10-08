"use client";


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
import { getStockOrder, getLocations, getWareHouseData } from "../lib/lib";
import { LineChartCom } from "./LineChartCom";

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
      
        
        setData(getWareHouseData(res?.data));
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
    <div >
      <Dialog onOpenChange={setChartModal} open={chartModal} >
        <DialogContent
          className={
            " overflow-y-scroll max-h-screen mt-10 border border-gray-500   max-w-fit shadow-2xl "
          }
        >
          <DialogHeader >
            <DialogTitle>{details?.locationName}</DialogTitle>
            <DialogDescription>
              {details.stockCode}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 p-5 ">
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
                <Table >
                  <TableHeader className="border border-gray-500 bg-gray-300 font-bold">
                    <TableRow className="border border-gray-500 font-bold">
                      <TableHead>WAREHOUSES</TableHead>
                      <TableHead>SOH</TableHead>
                      <TableHead>INCOMING</TableHead>
                      <TableHead className="text-center">ANALASIS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="border border-gray-500 font-sans font-bold">
                    {data?.map((item:any,i) => (
                      <TableRow key={i} className="p-20 ">
                        <TableCell >{item?.stockLocation?.lName}</TableCell>
                        <TableCell >{item?.inStockQTY}</TableCell>
                        <TableCell >{item?.incommingty}</TableCell>
                        <TableCell >
                          <LineChartCom chartdata={item?.chartData}/>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
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

export default WarehouseComp;

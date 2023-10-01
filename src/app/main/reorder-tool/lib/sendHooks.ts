"use client";

import axios from "axios";
import LoaderToast from "./Loader";

export const sendWorkOrder = async (
  table: any,
  toast: any,
  setSending: any,
  supplierData: any
) => {
  const orderData = table.getFilteredSelectedRowModel().rows;


  if (orderData.length === 0) {
    toast.warning("Select At Least One Order", {
      position: "top-center",
      theme: "colored",
    });
    return;
  }
  if (
    orderData.filter((item: any) => Number(item.original.calcReOrd) <= 0 || item.original.calcReOrd=== undefined )
      .length > 0 
  ) {
    toast.warning("Reorder Value Should Be Greather Than 0 ", {
      position: "top-center",
      theme: "colored",
    });
    return;
  }


  if (
    orderData.filter((item: any) =>   !item.original.billomatHdr)
      .length > 0 
  ) {
    toast.warning("Selected Item isn't Workorder", {
      position: "top-center",
      theme: "colored",
    });
    return;
  }

  if (
    orderData.filter((item: any) => item.original.isCreateWorkOrder===false )
      .length > 0 
  ) {
    toast.warning("There is no enough item built  WO ", {
      position: "top-center",
      theme: "colored",
    });
    return;
  }


  setSending(true);
  const postData = orderData
    .map((item: any) => item.original)
    .filter((item1: any) => item1.calcReOrd > 0).map((item2:any)=>({seqNo: null,
        transDate: new Date(),
        salesNo: 2,
        billCode: item2.billomatHdr.billCode,
        prodQty: Number(item2.calcReOrd),
        prodLocNo: item2.locationNumber}))



  const id = toast.loading(LoaderToast({}), { icon: false });

  try {
    const config = {
      method: "post",
      url: "/api/workorder",
      headers: {
        "Content-Type": "application/json",
      },
      data: postData,
    };

    const res = await axios(config);
console.log(res.data);

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
        console.log(element.value);
        
      setTimeout(() => {
        if (element.status === "fulfilled") {
          toast(`WO ${element.value.seqNo} Created`, {
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
      value: item.value,
    }));
    for (let index = 0; index < valu.length; index++) {
      const element = valu[index];      
      popupTost(index + 1, element);
    }
    console.log(res);
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

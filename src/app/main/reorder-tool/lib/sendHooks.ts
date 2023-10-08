"use client";

import axios from "axios";
import LoaderToast from "./Loader";


interface SupplierAccount {
  accNo: number;
  name: string;
  address1: string;
  address2: string;
  address3: string;
  phone: string;
  fax: string | null;
  email: string;
  currencyNo? :number 
  // Add other fields as needed
}

interface Supplier {
  stockCode: string;
  supplierCode: string;
  description: string;
  latestCost: number;
  accNo: number;
  econOrderQty: number | null;
  purchPackQuant: number;
  purchPackPrice: number;
  packReference: string | null;
  lastUpdate: Date | null;
  discount: number;
  isDefault: 'Y' | 'N';
  leadTime: number;
  tempLoc: string | null;
  supplierAccount: SupplierAccount;
  // Add other fields as needed
}

interface StockItem {
  stockCode: string;
  description: string;
  stockGroupNo: number;
  status:string 
  sellPrice1: number;
  sellPrice2: number;
  sellPrice3: number;
  sellPrice4: number;
  // Add other fields as needed
}

interface NameArrayItem {
  label: string;
  value: number;
}

interface ProductData {
  id?: number;
  exclamationMark?: boolean;
  stockCode: string;
  billomatHdr: any | null;
  branchName: string;
  locationNumber: number;
  locationName: string;
  locationAddress1: string;
  locationAddress2: string;
  locationAddress3: string;
  locationAddress4: string;
  supplierNumber: number;
  supplierAccount: SupplierAccount;
  description: string;
  minStock: number;
  maxStock: number;
  inStockQTY: number;
  incomingty: number;
  purchOrdQTY: number;
  salesOrdQTY: number;
  nameArray: NameArrayItem[];
  isExpand: boolean;
  isCreateWorkOrder: boolean;
  supplierCode: string;
  fromLoc: number;
  workOrder: boolean;
  stockItem: StockItem;
  supplierStockItems: Supplier[];
  // Add other fields as needed
}





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
    toast.warning("Reorder Value Should Be Greater Than 0 ", {
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
    toast.warning("There is no enough itembeing built  WO ", {
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
      render: "Completed",
      isLoading: false,
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
      type: "info",
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


export const sendTransfers = async ( table: any,
  toast: any,
  setSending: any,
  supplierData: any) => {
  const orderData = table.getFilteredSelectedRowModel().rows;

  if (orderData.length === 0) {
    toast.warning("Select At Least One Order", {
      position: "top-center",
      theme: "colored",
    });
    return;
  }
  if (
    orderData.filter((item:any) => Number(item.original.calcReOrd) <= 0).length >0
  ) {
    toast.warning("Reorder Value Should Be Greater Than 0", {
      position: "top-center",
      theme: "colored",
    });
    return;
  }
  setSending(true);
  const postData = orderData
    .map((item:any) => item.original)
    .filter((item1:any) => item1.calcReOrd > 0)
    .map((subItem: any) => {
      const isChectItemWithCode = subItem.stockItem.supplierStockItems.find(
        ({ supplierAccount, stockCode,supplierCode }: any) =>
        supplierAccount.accNo === subItem.name.accNo &&
        stockCode?.toLowerCase().trim() === subItem.stockCode?.toLowerCase().trim() &&
        supplierCode?.toLowerCase().trim() === subItem.supplierCode?.toLowerCase().trim()
      );

      if (isChectItemWithCode) {
        return {
          ...subItem,
          supplierAccount: isChectItemWithCode.supplierAccount,
          supplierNumber: isChectItemWithCode.supplierAccount.accNo,
          supplierCode: isChectItemWithCode?.supplierCode,
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

  const id = toast.loading(LoaderToast({}),
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
console.log(res);

    toast.update(id, {
      render: "Completed",
      isLoading: false,
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
      type: "info",
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
      status:item.status,
      value: item.value.seqNo
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


export const sendOrder = async (table: any,
  toast: any,
  setSending: any,
  supplierData: any) => {
  const orderData = table.getFilteredSelectedRowModel().rows;

  if (orderData.length === 0) {
    toast.warning("Select At Least One Order", {
      position: "top-center",
      theme: "colored",
    });
    return;
  }
  if (
    orderData.filter((item:any) => Number(item.original.calcReOrd) <= 0).length >  0 
  ) {
    toast.warning("Reorder Value Should Be Greater Than 0", {
      position: "top-center",
      theme: "colored",
    });
    return;
  }

  
  setSending(true);
  const postData = orderData
    .map((item:any) => item.original)
    .filter((item1:any) => item1.calcReOrd > 0)
    .map((subItem: any) => {
      const isChectItemWithCode = subItem.stockItem.supplierStockItems.find(
        ({ supplierAccount, stockCode,supplierCode}: any) =>
          supplierAccount.accNo === subItem.name.accNo &&
          stockCode?.toLowerCase().trim() === subItem.stockCode?.toLowerCase().trim() &&
          supplierCode?.toLowerCase().trim() === subItem.supplierCode?.toLowerCase().trim()
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



  const idsend = toast.loading(LoaderToast({}),
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

    console.log(res);

    toast.update(idsend, {
      render: "Completed",
      isLoading: false,
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
      type: "info",
    });
    // console.log(res);

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
    const valu = res.data.map((item: any) => { 
      // console.log(item);
      
      return {
      status:item.status,
      value: item?.value?.poNumber,
    }});
    // console.log(valu);
    
    for (let index = 0; index < valu.length; index++) {
      const element = valu[index];
      // console.log(element,'ele');
      
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
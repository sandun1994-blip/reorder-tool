import {
  RowData,
  Row,
  FilterMeta,
  TransformFilterValueFn,
  ColumnFilterAutoRemoveTestFn,
} from "@tanstack/react-table";

export const getLocations = (items: any[]) => {
  const locations: string[] = [];
  let location: string = "";

  items.forEach((elem: any) => {
    location = elem.stockLocation.lName;

    if (location && !locations.includes(location.trim())) {
      locations.push(location.trim());
    }
  });
  locations.sort();
  locations.unshift("ALL");
  return locations;
};

export const palletQty = (data: any) => {
  if (data.stockItem.xLeadTimeRest) {
    const pQty = data.calcReOrd / data.stockItem.xLeadTimeRest;

    const calcReOrd =
      pQty <= 1
        ? data.stockItem.xLeadTimeRest
        : Math.ceil(pQty) * data.stockItem.xLeadTimeRest;

    return calcReOrd;
  }

  return data.calcReOrd.toFixed(0);
};

export const processWorkorder = (data: any) => {
  if (
    data.stockItem.billomatHdr?.workOrder.filter((a: any) => {
      return a.orderStatus === 1 || a.orderStatus === 0;
    }).length > 0
  ) {
    return false;
  }

  return true;
};

const addSupNames = (data: any,supData:any) => {
  let name: {label:string ,value:number}[] = [];
  const dataArry = data.stockItem?.supplierStockItems;
  if (dataArry.length > 0) {
    dataArry.forEach((item: any) => {
      if (!name.map(acc=>acc.value).includes(item.supplierAccount.accNo)) {
        name.push({label:item.supplierAccount.name,value:item.supplierAccount.accNo});
      }
      if (item.tempLoc) {
        name.push({label:item.tempLoc,value:item.supplierAccount.accNo});
      }
    });
  }
  else {
    name = supData
  }

  if (!name.map(acc=>acc.value).includes(data.accNo)) {
    name.push({label:data.supplierName,value:data.accNo});
  }

  if (!name.map(na=>na.label).includes("MALAGA WAREHOUSE") && data.centralLocation > 0) {
    name.push({label:"MALAGA WAREHOUSE",value:-1});
  }

  if (!name.map(na=>na.label).includes("GYMPIE WAREHOUSE") && data.centralLocation > 0) {
    name.push({label:"GYMPIE WAREHOUSE",value:-1});
  }

  if (!name.map(na=>na.label).includes("KALGOORLIE WAREHOUSE") && data.centralLocation > 0) {
    name.push({label:"KALGOORLIE WAREHOUSE",value:-1});
  }

  return name;
};

const getExclamation = (item: any) => {
  const visible =
    item.inStockQTY + item.Incommingty - item.salesOrdQTY <= item.minStock &&
    item.fromLoc > 0;

  return visible;
};

export const getStockOrder = (item: any[],supData:any) => {
  const stockOrder = item.map((e, i) => {
    return {
      id: i,
      exclamationMark: getExclamation(e),
      stockCode: e.stockItem.stockCode,
      billomatHdr: e.stockItem?.billomatHdr,
      branchName: e.stockLocation.lName,
      locationNumber: e.stockLocation.locNo,
      locationName: e.stockLocation.lName,
      locationAddress1: e.stockLocation.deladdr1,
      locationAddress2: e.stockLocation.deladdr2,
      locationAddress3: e.stockLocation.deladdr3,
      locationAddress4: e.stockLocation.deladdr4,
      supplierNumber: e.supplierAccount.accNo,
      supplierAccount: e.supplierAccount,
      description: e.stockItem.description,
      minStock: e.minStock,
      maxStock: e.maxStock,
      inStockQTY: e.inStockQTY,
      purchOrdQTY: e.purchOrdQTY,
      Incommingty: e.Incommingty,
      salesOrdQTY: e.salesOrdQTY,
      name: {name:e.supplierName,accNo:e.supplierAccount.accNo},
      sales1: e.sales1,
      sales2: e.sales2,
      sales3: e.sales3,
      sales4: e.sales4,
      sales5: e.sales5,
      sales6: e.sales6,
      sales0: e.sales0,
      calcReOrd: palletQty(e),
      select: false,
      stockItem: e.stockItem,
      supplierCode: e.supplierCode,
      fromLoc: e.centralLocation,
      workOrder: processWorkorder(e),
      nameArray: addSupNames(e,supData),
      isExpand: e.stockItem.billomatHdr ? true : false,
    };
  });

  return stockOrder;
};

export interface FilterFn<TData extends RowData> {
  (
    row: Row<TData>,
    columnId: string,
    filterValue: any,
    addMeta: (meta: FilterMeta) => void
  ): boolean;
  resolveFilterValue?: TransformFilterValueFn<TData>;
  autoRemove?: ColumnFilterAutoRemoveTestFn<TData>;
}

export const getWareHouseData = (data: any) => {
  const wareHouseData = data
    ?.map((data1: any) => {
      const chartData = [
        data1?.sales0 ? data1?.sales0 : 0,
        data1?.sales1 ? data1?.sales1 : 0,
        data1?.sales2 ? data1?.sales2 : 0,
        data1?.sales3 ? data1?.sales3 : 0,
        data1?.sales4 ? data1?.sales4 : 0,
        data1?.sales5 ? data1?.sales5 : 0,
        data1?.sales6 ? data1?.sales6 : 0,
      ];

      return {
        ...data1,
        ...{
          Incommingty: data1?.Incommingty,
          chartData,
        },
      };
    })
    .filter(
      (data: any) =>
        data?.chartData.reduce(function (
          accumulator: number,
          currentValue: number
        ) {
          return accumulator + currentValue;
        },
        0) > 0 ||
        data.incommingty > 0 ||
        data.inStockQTY > 0
    );

  const finalData = <any>[];

  wareHouseData.length > 0 &&
    wareHouseData.forEach((obj: any) => {
      const findValue = finalData.findIndex(
        (d: any) =>
          d.stockLocation?.lName === obj.stockLocation?.lName &&
          d.inStockQTY === obj.inStockQTY &&
          d.incommingty === obj.incommingty
      );
     
      
      if (findValue === -1) {
        finalData.push(obj);
      }
    });
  return finalData;
};

type Acc ={
  value:number
  label:string
}
export const getSupplier=(data:any)=>{
  const supdata = <any>[]
  let supNo = ''
  data.forEach((elem:any) => {
    supNo = elem.accNo
    if (supNo && !supdata.map((acc:Acc)=>acc.value).includes(supNo)) {
      supdata.push({value:elem.accNo,label:elem.name,supData:elem})
    }
  })
  return supdata
}

export const  sendOrdersNew=async(selectData:any)=> {
  const sendOrder = <any>[]

  selectData.forEach((d) => {
    if (d.select === true && d.calcReOrd > 0) {
      // console.log(d);
      //  console.log((d.select === true && d.calcReOrd > 0 && this.supplierStockItems.find(({supplierAccount,stockCode})=>supplierAccount.name.toLowerCase().trim()===d.name.toLowerCase().trim() && stockCode.toLowerCase().trim() === d.stockCode.toLowerCase().trim() )) )
      if (
        d.select === true &&
        d.calcReOrd > 0 &&
        this.supplierStockItems.find(
          ({ supplierAccount, stockCode }) =>
            supplierAccount.name.toLowerCase().trim() ===
            d.name.toLowerCase().trim() &&
            stockCode.toLowerCase().trim() ===
            d.stockCode.toLowerCase().trim()
        )
      ) {
        const data = this.supplierStockItems.find(
          ({ supplierAccount, stockCode }) =>
            supplierAccount.name.toLowerCase().trim() ===
            d.name.toLowerCase().trim() &&
            stockCode.toLowerCase().trim() ===
            d.stockCode.toLowerCase().trim()
        )
        // console.log(data);
        sendOrder.push({
          ...d,
          supplierAccount: data.supplierAccount,
          supplierNumber: data.supplierAccount.id,
          supplierCode: data.supplierCode
        })
      } else if (
        this.supplierInfo.find(
          (sup) =>
            sup.name.toLowerCase().trim() === d.name.toLowerCase().trim()
        )
      ) {
        const supData = this.supplierInfo.find(
          (sup) =>
            sup.name.toLowerCase().trim() === d.name.toLowerCase().trim()
        )
        sendOrder.push({
          ...d,
          supplierAccount: supData,
          supplierNumber: supData.id
        })
      } else {
        sendOrder.push(d)
      }
    }
  })
  this.loader = 'loading'

  //   console.log(sendOrder);

  const url = '' + process.env.apiBaseURL + 'sendorder'
  const config = {
    method: 'post',
    url,
    headers: {
      'Content-Type': 'application/json',
      Authorization: this.$auth.strategy.token.get()
    },
    data: {
      sendOrder,
      user: this.loggedInUser,
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.$auth.strategy.token.get()
      }
    }
  }
  await axios(config)
    .then((response) => {
      if (response.data.status) {
        this.messageColor = 'success'
        this.dialogMessage = 'Successfully Send'
        setTimeout(() => {
          this.dialogMessage = ''
          this[this.loader] = false
          this.loader = null
          this.loading = false
        }, 6000)
      }
    })
    .catch((error) => {
      console.log(error, 'some err')
      this.dialogMessage = 'SERVER ERROR'
      this.messageColor = 'error'
      setTimeout(() => {
        this.dialogMessage = ''
        this[this.loader] = false
        this.loader = null
        this.loading = false
      }, 6000)
    })
}

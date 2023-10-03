import {
  RowData,
  Row,
  FilterMeta,
  TransformFilterValueFn,
  ColumnFilterAutoRemoveTestFn,
} from "@tanstack/react-table";







interface SupplierAccount {
  accNo: number;
  name: string;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
  acccountGroup: number;
  creditStatus: number;
  deleveryAddress1: string | null;
  deleveryAddress2: string | null;
  deleveryAddress3: string | null;
  deleveryAddress4: string | null;
  notes: string | null;
  currencyNo: number;
  isActive: 'Y' | 'N' | null;
  postCode: string | null;
  deleveryAddress5: string | null;
  deleveryAddress6: string | null;
  address4: string | null;
  acccountGroup2: number;
  address5: string | null;
  deliveryNotes: string | null;
  deliveryNotesTwo: string | null;
  creditStatuses: {
    statusNo: number;
    statusDesc: string;
    creditFactor: number;
    activeDr: 'Y' | 'N' | null;
    activeCr: 'Y' | 'N' | null;
    balWarningSql: string;
    warningText: string;
  };
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
  isDefault: 'Y' | 'N' | null;
  leadTime: number;
  tempLoc: string | null;
  supplierAccount: SupplierAccount;
  notes: string;
}

interface NameArrayItem {
  label: string;
  value: number;
}

interface StockItem {
  stockCode: string;
  description: string;
  stockGroupNo: number;
  status: string
  sellPrice1: number;
  sellPrice2: number;
  sellPrice3: number;
  sellPrice4: number;
  sellPrice5: number;
  sellPrice6: number;
  sellPrice7: number;
  sellPrice8: number;
  sellPrice9: number;
  sellPrice10: number;
  latestCost: number;
  xLeadTimeRest: number;
  avgCost: number;
  supplierNo: number;
  notes: string;
  totalStock: number;
  pitureUrl: string;
  qrCode: string | null;
  toolItemsImage: string | null;
  billomatHdr: any | null;
  supplierStockItems: Supplier[];
}

interface ProductData {
  id: number;
  exclamationMark: boolean;
  stockCode: string;
  billomatHdr?: any | null;
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
  incomingty?: number;
  purchOrdQTY: number;
  salesOrdQTY: number;
  nameArray: NameArrayItem[];
  isExpand: boolean;
  isCreateWorkOrder: boolean;
  supplierCode: string;
  fromLoc: number;
  workOrder: boolean;
  stockItem: StockItem;
}




























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

export const palletQtyTwo = (data: any, calcQty: number) => {
  if (data.stockItem.xLeadTimeRest) {
    const pQty = calcQty / data.stockItem.xLeadTimeRest;

    const calcReOrd =
      pQty <= 1
        ? data.stockItem.xLeadTimeRest
        : Math.ceil(pQty) * data.stockItem.xLeadTimeRest;

    return calcReOrd;
  }

  return calcQty.toFixed(0);
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

const addSupNames = (data: any, supData: any) => {
  let name: { label: string; value: number }[] = [];
  const dataArry = data.stockItem?.supplierStockItems;

  if (dataArry.length > 0) {
    dataArry.forEach((item: any) => {
      if (!name.map((acc) => acc.value).includes(item.supplierAccount.accNo)) {
        name.push({
          label: item.supplierAccount.name,
          value: item.supplierAccount.accNo,
        });
      }
      if (item.tempLoc) {
        name.push({ label: item.tempLoc, value: item.supplierAccount.accNo });
      }
    });
  } else {
    name = supData;
  }

  if (!name.map((acc) => acc.value).includes(data.accNo)) {
    name.push({ label: data.supplierName, value: data.accNo });
  }

  if (
    !name.map((na) => na.label).includes("MALAGA WAREHOUSE") &&
    data.centralLocation > 0
  ) {
    name.push({ label: "MALAGA WAREHOUSE", value: -1 });
  }

  if (
    !name.map((na) => na.label).includes("GYMPIE WAREHOUSE") &&
    data.centralLocation > 0
  ) {
    name.push({ label: "GYMPIE WAREHOUSE", value: -1 });
  }

  if (
    !name.map((na) => na.label).includes("KALGOORLIE WAREHOUSE") &&
    data.centralLocation > 0
  ) {
    name.push({ label: "KALGOORLIE WAREHOUSE", value: -1 });
  }

  return name;
};

const getExclamation = (item: any) => {
  const visible =
    item.inStockQTY + item.i - item.salesOrdQTY <= item.minStock &&
    item.fromLoc > 0;

  return visible;
};

const isCreateWorkOrder = (item: any) => {
  if (item.stockItem?.billomatHdr) {
    let condition = <any>[];
    // const jk=[]
    item.stockItem?.billomatHdr.billomatLines
      .filter((stk: any) => stk.stockItem.stockRequirementTwo.length > 0)
      .forEach((data: any) => {
        const obj1 = data.stockItem.stockRequirementTwo.filter(
          (data1: any) => data1.locNo === item.stockLocation.locNo
        );

        //  jk.push(obj1)

        if (
          obj1[0]?.incommingty + obj1[0]?.inStockQTY - obj1[0]?.salesOrdQTY <
          data?.quantity * Number(item?.calcReOrd)
        ) {
          condition.push(false);
        }

        condition.push(true);
      });

    // console.log(jk);

    return !condition.includes(false);
  }

  return false;
};

export const getStockOrder = (item: any[], supData: any, pauseItems: any):ProductData[] => {
  const stockOrder = item
    .filter(
      (item1) =>
       {   
        return (item1.calcReOrd > 0 &&
        !pauseItems.includes(
          `${item1.stockItem.stockCode?.trim()}` +
            "-" +
            `${item1.stockLocation.locNo}` +
            "-" +
            `${item1.supplierAccount.accNo}`)
        )}
    )
    .map((e, i) => {
      return {
        id: i,
        exclamationMark: getExclamation(e),
        stockCode: e.stockItem.stockCode,
        billomatHdr: e.stockItem?.billomatHdr,
        branchName: e.stockLocation.lName,
        locationNumber: e.stockLocation.locNo,
        locationName: e.stockLocation.lName,
        locationAddress1: e.stockLocation?.deladdr1,
        locationAddress2: e.stockLocation?.deladdr2,
        locationAddress3: e.stockLocation?.deladdr3,
        locationAddress4: e.stockLocation?.deladdr4,
        supplierNumber: e.supplierAccount.accNo,
        supplierAccount: e.supplierAccount,
        description: e.stockItem?.description,
        minStock: e?.minStock,
        maxStock: e?.maxStock,
        inStockQTY: e?.inStockQTY,
        incommingty: e?.incommingty,
        purchOrdQTY: e.purchOrdQTY,
        i: i,
        salesOrdQTY: e.salesOrdQTY,
        name: { name: e.supplierName, accNo: e.supplierAccount.accNo },
        sName: e.supplierName,
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
        supplierCode: e?.supplierCode,
        fromLoc: e.centralLocation,
        workOrder: processWorkorder(e),
        nameArray: addSupNames(e, supData),
        isExpand: e.stockItem.billomatHdr ? true : false,
        isCreateWorkOrder: isCreateWorkOrder(e),
      };
    });

  return stockOrder;
};

export const getStockOrderTwo = (item: any[], supData: any, mainItem: any) => {
  const stockOrder = item
    .filter((stk) => stk.stockItem.stockRequirementTwo.length > 0)
    .map((e, i) => {
      const obj = e.stockItem.stockRequirementTwo.filter((stk: any) => {
        return (
          stk.stockCode === e.stockCode && stk.locNo === mainItem.locationNumber
        );
      });

      const data = obj[0];

      const reOrdQty = e?.quantity * Number(mainItem.calcReOrd);

      const calcQty =
        data?.incommingty + data?.inStockQTY - data?.salesOrdQTY >= reOrdQty
          ? 0
          : reOrdQty -
            (data?.incommingty + data?.inStockQTY - data?.salesOrdQTY);

      return {
        id: i,
        stockCode: e?.stockItem.stockCode,
        branchName: data?.stockLocation.lName,
        locationNumber: data?.stockLocation.locNo,
        locationName: data?.stockLocation.lName,
        locationAddress1: data?.stockLocation.deladdr1,
        locationAddress2: data?.stockLocation.deladdr2,
        locationAddress3: data?.stockLocation.deladdr3,
        locationAddress4: data?.stockLocation.deladdr4,
        supplierNumber: data?.supplierAccount.accNo,
        supplierAccount: data?.supplierAccount,
        description: e?.stockItem.description,
        minStock: data?.minStock,
        maxStock: data?.maxStock,
        inStockQTY: data?.inStockQTY,
        purchOrdQTY: data?.purchOrdQTY,
        salesOrdQTY: data?.salesOrdQTY,
        name: { name: data?.supplierName, accNo: data?.supplierAccount.accNo },
        sName: data?.supplierName,
        incommingty: data?.incommingty,
        sales1: data?.sales1,
        sales2: data?.sales2,
        sales3: data?.sales3,
        sales4: data?.sales4,
        sales5: data?.sales5,
        sales6: data?.sales6,
        sales0: data?.sales0,
        calcReOrd: palletQtyTwo(e, calcQty),
        select: false,
        stockItem: e?.stockItem,
        supplierCode: data?.supplierCode,
        fromLoc: data?.centralLocation,
        nameArray: addSupNames(e, supData),
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
          i: data1?.i,
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
        data.i > 0 ||
        data.inStockQTY > 0
    );

  const finalData = <any>[];

  wareHouseData.length > 0 &&
    wareHouseData.forEach((obj: any) => {
      const findValue = finalData.findIndex(
        (d: any) =>
          d.stockLocation?.lName === obj.stockLocation?.lName &&
          d.inStockQTY === obj.inStockQTY &&
          d.i === obj.i
      );

      if (findValue === -1) {
        finalData.push(obj);
      }
    });
  return finalData;
};

type Acc = {
  value: number;
  label: string;
};
export const getSupplier = (data: any) => {
  const supdata = <any>[];
  let supNo = "";
  data.forEach((elem: any) => {
    supNo = elem.accNo;
    if (supNo && !supdata.map((acc: Acc) => acc.value).includes(supNo)) {
      supdata.push({ value: elem.accNo, label: elem.name, supData: elem });
    }
  });
  return supdata;
};

export const getCombineCode = (data: any) => {
  const combineCode = <any>[];
  data.forEach((element: any) => {
    combineCode.push(element.combineCode.trim());
  });

  return combineCode;
};

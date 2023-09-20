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
    data.stockItem.billomatHdr?.workOrder.filter((a:any) => {
      return a.orderStatus === 1 || a.orderStatus === 0;
    }).length > 0
  ) {
    return false;
  }

  return true;
};


const addSupNames=(data:any)=> {
    const name :string[] = []
const dataArry=data.stockItem?.supplierStockItems
    if (
        dataArry.length>0
    ) {
     
        dataArry.forEach((item:any) => {
         
          if (!name.includes(item.supplierAccount.name)) {
            name.push(item.supplierAccount.name)
          }
          if (item.tempLoc) {
            name.push(item.tempLoc)
          }
        })
    } 
    // else {
    //   name = this.supNames
    // }

    if (!name.includes(data.supplierName)) {
      name.push(data.supplierName)
    }

    if (!name.includes('MALAGA WAREHOUSE') && data.centralLocation > 0) {
      name.push('MALAGA WAREHOUSE')
    }

    if (!name.includes('GYMPIE WAREHOUSE') && data.centralLocation > 0) {
      name.push('GYMPIE WAREHOUSE')
    }

    if (!name.includes('KALGOORLIE WAREHOUSE') && data.centralLocation > 0) {
      name.push('KALGOORLIE WAREHOUSE')
    }

    return name
  }

  const getExclamation=(item:any)=> {

const visible =(item.inStockQTY + item.Incommingty - item.salesOrdQTY <= item.minStock) && (item.fromLoc > 0)

    return visible
  }

export const getStockOrder = (item: any[]) => {
  const stockOrder = item.map((e, i) => {
    return {
      id: i,
      exclamationMark:getExclamation(e),
      stockCode: e.stockItem.stockCode,
      billomatHdr: e.stockItem?.billomatHdr,
      branchName: e.stockLocation.lName,
      locationNumber: e.stockLocation.locNo,
      locationName: e.stockLocation.lName,
      locationAddress1: e.stockLocation.deladdr1,
      locationAddress2: e.stockLocation.deladdr2,
      locationAddress3: e.stockLocation.deladdr3,
      locationAddress4: e.stockLocation.deladdr4,
      supplierNumber: e.supplierAccount.id,
      supplierAccount: e.supplierAccount,
      description: e.stockItem.description,
      minStock: e.minStock,
      maxStock: e.maxStock,
      inStockQTY: e.inStockQTY,
      purchOrdQTY: e.purchOrdQTY,
      Incommingty: e.Incommingty,
      salesOrdQTY: e.salesOrdQTY,
      name: e.supplierName,
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
      nameArray:addSupNames(e),
      isExpand:e.stockItem.billomatHdr?true:false
    };
  });

  return stockOrder;
};




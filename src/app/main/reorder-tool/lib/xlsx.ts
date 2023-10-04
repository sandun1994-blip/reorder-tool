import xlsx, { IJsonSheet } from "json-as-xlsx";


export function downloadToExcel(data:any) {


  
  let columns: IJsonSheet[] = [
    {
      sheet: "Persons",
      columns: [
        { label: "From Loc", value: "fromLoc" },
        { label: "Supplier Name ", value: "sName" },
         { label: "Stockcode", value: "stockCode" },
         { label: "Description", value: "description" },
         { label: "Location", value: "branchName" },
         { label: "6", value: "sales6" },
         { label: "5", value: "sales5" },
         { label: "4", value: "sales4" },
         { label: "3", value: "sales3" },
         { label: "2", value: "sales2" },
         { label: "1", value: "sales1" },
         { label: "Current", value: "sales0" },
         { label: "Incoming", value: "incommingty" },
         { label: "On Hand", value: "inStockQTY" },
         { label: "For Sales", value: "salesOrdQTY" },
         { label: "Min", value: "minStock" },
         { label: "Max", value: "maxStock" },
         { label: "Reord Qty", value: "calcReOrd" },
         { label: "Create WO", value: "isCreateWorkOrder" },
        // {
        //   label: "Date of Birth",
        //   value: (row) => new Date(row.date_of_birth).toLocaleDateString(),
        // },
      ],
      content: data,
    },
  ];

  let settings = {
    fileName: "ReordData",
  };

  xlsx(columns, settings);
}
import xlsx, { IJsonSheet } from "json-as-xlsx";


export function downloadToExcel(data:any) {
  let columns: IJsonSheet[] = [
    {
      sheet: "Persons",
      columns: [
        { label: "name", value: "id" },
        { label: "First Name", value: "stockCode" },
        // { label: "Last Name", value: "last_name" },
        // { label: "Email", value: "email" },
        // { label: "Gender", value: "gender" },
        // {
        //   label: "Date of Birth",
        //   value: (row) => new Date(row.date_of_birth).toLocaleDateString(),
        // },
      ],
      content: data,
    },
  ];

  let settings = {
    fileName: "People Excel",
  };

  xlsx(columns, settings);
}
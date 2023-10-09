"use client";
import React from "react";
import ReactSelect from "react-select";

type Props = {
  id: string;
  optionArray: any[];
  options: any[];
  setOptions: any;
  setGlobalFilter: any;
};

const SelectComp = ({
  id,
  optionArray,
  options,
  setOptions,
  setGlobalFilter,
}: Props) => {
  const onChange = (val: any) => {
    setOptions(val);
  };

  return (
    <div style={{ maxWidth: "600px",minWidth:'300px' }} className="ml-2 ">
      <ReactSelect
        id={id}
        defaultValue={options}
        onChange={onChange}
        options={optionArray}
        isMulti={true}
        className="text-black focus:outline-none  shadow-xl rounded border border-gray-400 dark:border-gray-400 focus:border-gray-400"
        placeholder="Locations"
        theme={(theme) => ({
          ...theme,
          borderRadius: 1,
          colors: {
            ...theme.colors,
            text: "orangered",
            primary25: "#4B8EF4",
            primary: "primary",
          },
        })}
        styles={{ control: base => ({
          ...base,
          border: 50,
          // This line disable the blue border
          boxShadow: 'none',
          borderRadius:'5px',
         
        })}}
      />
    </div>
  );
};

export default SelectComp;

// theme={(theme) => ({
//   ...theme,
//   borderRadius: 1,
//   colors: {
//     ...theme.colors,
//     text: 'orangered',
//     primary25: "#22C55E",
//     primary: "#22C55E",
//   },
// })}

// classNames={{
//   control: (state) =>
//     state.isFocused ? "border-red-600" : "border-red-300",
//   input: () => "text-red-500 ",
//   container(props) {
//     return "bg-red-500";
//   },
//   menuList(props) {
//     return "dark:bg-gray-600 ";
//   },
//   groupHeading(props) {
//     return "bg-yellow-400";
//   },
//   menu: () => "bg-red-400",
//   indicatorsContainer(props) {
//     return "text-red-400";
//   },
//   valueContainer: () => " rounded-md  dark:text-white dark:bg-[#2E3B42]  ",
//   dropdownIndicator: () => "bg-green-400",
//   group(props) {
//     return "bg-red-500";
//   },
//   menuPortal: () => "bg-red-500",
//   option: () => "text-red-500",
//   singleValue(props) {
//     return "text-green-500";
//   },
//   placeholder: () => "text-green-500",
//   multiValueLabel: () => "text-red-500",multiValue:()=>'text-red-500 bg-black',indicatorSeparator:()=>'text-green-400'
// }}

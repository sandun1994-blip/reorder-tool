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
  const customStyles = {
    option: (base:any, { data, isDisabled, isFocused, isSelected }:any) => {
    return {
      ...base,
      // backgroundColor: isFocused ? "red" : "blue",
    };
  },
  // multiValue: (styles, { data }) => {
  //   return {
  //     ...styles,
  //     backgroundColor: 'red',
  //   };
  // },
  // multiValueLabel: (styles, { data }) => ({
  //   ...styles,
  //   color: 'blue',
  // }),
  // multiValueRemove: (styles, { data }) => ({
  //   ...styles,
  //   color: data.color,
  //   ':hover': {
  //     backgroundColor: data.color,
  //     color: 'white',
  //   },
  // }),
};

  const onChange = (val: any) => {
    setOptions(val);
  };

  return (
    <div style={{ width: "300px" }} className="ml-2 ">
      <ReactSelect
        id={id}
        defaultValue={options}
        classNames={{
          control: (state) =>
            state.isFocused ? "border-red-600" : "border-red-300",
          input: () => "text-red-500 ",
          container(props) {
            return "bg-red-500";
          },
          menuList(props) {
            return "dark:bg-gray-600 ";
          },
          groupHeading(props) {
            return "bg-yellow-400";
          },
          menu: () => "bg-red-400",
          indicatorsContainer(props) {
            return "text-red-400";
          },
          valueContainer: () => " rounded-md  dark:text-white dark:bg-[#2E3B42]  ",
          dropdownIndicator: () => "bg-green-400",
          group(props) {
            return "bg-red-500";
          },
          menuPortal: () => "bg-red-500",
          option: () => "text-red-500",
          singleValue(props) {
            return "text-green-500";
          },
          placeholder: () => "text-green-500",
          multiValueLabel: () => "text-red-500",multiValue:()=>'text-red-500 bg-black',indicatorSeparator:()=>'text-green-400'
        }}
        onChange={onChange}
        options={optionArray}
        isMulti={true}
        theme={(theme) => ({
          ...theme,
          borderRadius: 1,
          colors: {
            ...theme.colors,
            text: 'orangered',
            primary25: "#22C55E",
            primary: "#22C55E",
          },
        })}
        styles={customStyles}
      />
    </div>
  );
};

export default SelectComp;

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
    <div style={{ width: "300px" }} className="ml-2 ">
      <ReactSelect
        id={id}
        defaultValue={options}
        onChange={onChange}
        options={optionArray}
        isMulti={true}
        className="bg-black"
        
      />
    </div>
  );
};

export default SelectComp;

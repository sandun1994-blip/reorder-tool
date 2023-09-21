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
    <div style={{ width: "600px" }} className="m-2">
      <ReactSelect
        id={"react-select-2-live-region"}
        defaultValue={options}
        onChange={onChange}
        options={optionArray}
        isMulti={true}
      />
    </div>
  );
};

export default SelectComp;

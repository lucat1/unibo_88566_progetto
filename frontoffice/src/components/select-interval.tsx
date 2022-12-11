import * as React from "react";
import DatePicker from "react-datepicker";

export interface SelectIntervalProps {
  selected?: Date;
  onSelect: (n: Date | undefined) => void;
}

const SelectInterval: React.FC<SelectIntervalProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="field my-2">
      <label htmlFor="category" className="label">
        Select a time interval
      </label>
    </div>
  );
};

export default SelectInterval;

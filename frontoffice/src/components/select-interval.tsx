import React, { ChangeEventHandler } from "react";

export interface SelectIntervalProps {
  selected: Date;
  onSelect: ChangeEventHandler<HTMLInputElement>;
  foresight: number;
}

function toString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const SelectInterval: React.FC<SelectIntervalProps> = ({
  selected,
  onSelect,
  foresight,
}) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    selected = new Date(event.target.value);
    onSelect(event);
  };
  selected = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + foresight);
  return (
    <div className="field my-2">
      <label htmlFor="date" className="label">
        Date (reservations can be made at most{" "}
        <span className="has-text-link">{foresight} days</span> in advance)
      </label>
      <input
        id="date"
        type="date"
        className="input"
        min={toString(selected)}
        max={toString(maxDate)}
        onChange={handleChange}
      />
    </div>
  );
};

export default SelectInterval;

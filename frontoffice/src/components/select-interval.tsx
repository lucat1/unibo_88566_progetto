import React, { FormEvent } from "react";

export interface SelectIntervalProps {
  selected: string[];
  onSelect: (n: string[]) => void;
}

const SelectInterval: React.FC<SelectIntervalProps> = ({
  selected,
  onSelect,
}) => {
  const handleChange1 = (event: FormEvent<HTMLFormElement>) =>
    onSelect([
      (event.target as unknown as HTMLInputElement).value,
      selected[1],
    ]);
  const handleChange2 = (event: FormEvent<HTMLFormElement>) =>
    onSelect([
      selected[0],
      (event.target as unknown as HTMLInputElement).value,
    ]);
  return (
    <div className="columns">
      <div className="column field my-2">
        <label htmlFor="from" className="label">
          From
        </label>
        <input
          id="for"
          type="datetime-local"
          className="input"
          value={selected ? selected[0].toString() : ""}
          onChange={handleChange1}
        />
      </div>
      <div className="column field my-2">
        <label htmlFor="to" className="label">
          To
        </label>
        <input
          id="to"
          type="datetime-local"
          className="input"
          value={selected ? selected[1].toString() : ""}
          onChange={handleChange2}
        />
      </div>
    </div>
  );
};

export default SelectInterval;

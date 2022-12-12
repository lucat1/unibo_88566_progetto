import React, { FormEvent } from "react";

export interface SelectIntervalProps {
  selected?: Date[];
  onSelect: (n: Date[] | undefined) => void;
}

const SelectInterval: React.FC<SelectIntervalProps> = ({
  selected,
  onSelect,
}) => {
  const handleChange1 = (event: FormEvent<HTMLFormElement>) =>
    onSelect([event.target.value, selected[1]]);
  const handleChange2 = (event: FormEvent<HTMLFormElement>) =>
    onSelect([selected[0], event.target.value]);
  return (
    <>
      <div className="field my-2">
        <label for="from" className="label">
          From
        </label>
        <input
          id="for"
          type="datetime-local"
          class="input"
          value={selected ? selected[0].toString() : ""}
          onChange={handleChange1}
        />
      </div>
      <div className="field my-2">
        <label for="to" className="label">
          To
        </label>
        <input
          id="to"
          type="datetime-local"
          class="input"
          value={selected ? selected[1].toString() : ""}
          onChange={handleChange2}
        />
      </div>
    </>
  );
};

export default SelectInterval;

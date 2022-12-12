import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import fetch from "shared/fetch";

import type { IStore } from "shared/models/store";

export interface SelectStoreProps {
  selected?: IStore;
  onSelect: (n: IStore | undefined) => void;
}

const SelectStore: React.FC<SelectStoreProps> = ({ selected, onSelect }) => {
  const ref = React.useRef<HTMLSelectElement>();
  const { data, isLoading, error } = useQuery(["stores"], () =>
    fetch<IStore[]>("store/stores")
  );
  React.useEffect(() => {
    if (!selected || !data) return;
    data.docs.forEach((d, i) => {
      if (d._id == selected._id && ref.current != null)
        ref.current.selectedIndex = i + 1;
    });
  }, [data, selected]);

  return error ? (
    <div className="notification is-danger">Error: {error}</div>
  ) : (
    <div className="field my-2">
      <label htmlFor="store" className="label">
        Select a store
      </label>
      <div className="select">
        <select
          ref={ref as any}
          id="store"
          disabled={isLoading}
          onInput={(_) => {
            const i = ref.current!.selectedIndex;
            onSelect(i == 0 ? undefined : data!.docs![i - 1]);
          }}
        >
          <option onSelect={(_) => onSelect(undefined)}>
            {isLoading ? "Loading" : "Select a store"}
          </option>
          {!isLoading &&
            data.docs.map((store) => (
              <option key={store._id}>{store.name}</option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default SelectStore;

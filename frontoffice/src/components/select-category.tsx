import * as React from 'react'
import { useQuery } from "@tanstack/react-query";
import fetch from "shared/fetch";

import type { ICategory } from 'shared/models/category'

export interface SelectCategoryProps {
  selected?: ICategory
  onSelect: (n: ICategory | undefined) => void
}

const SelectCategory: React.FC<SelectCategoryProps> = ({ selected, onSelect }) => {
  const ref = React.useRef<HTMLSelectElement>()
  const { data, isLoading, error } = useQuery(["categories"], () => fetch<ICategory[]>('store/categories'));
  React.useEffect(() => {
    if (!selected || !data) return;
    data.forEach((d, i) => {
      if (d._id == selected._id && ref.current != null)
        ref.current.selectedIndex = i + 1;
    });
  }, [data, selected]);

  return error ?
    <div className="notification is-danger">Error: {error}</div>
    : (
      <div className="field my-2">
        <label htmlFor="category" className="label">Select a category</label>
        <div className="select">
          <select ref={ref as any} id="category" disabled={isLoading} onChange={() => {
            const i = ref.current!.selectedIndex
            onSelect(i == 0 ? undefined : data![i - 1]);
          }}
          >
            <option onSelect={_ => onSelect(undefined)}>{isLoading ? 'Loading' : 'Select a category'}</option>
            {!isLoading && data.map(category => <option key={category._id}>{category.name}</option>)}
          </select>
        </div>
      </div>
    );
};

export default SelectCategory;

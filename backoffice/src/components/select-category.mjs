import { h, useEffect } from "../h";
import req from "../async";
import fetch from "shared/fetch";

const SelectCategory = ({ selected, onSelect }) => {
  const { data, loading, err } = req("store/categories", fetch);
  useEffect(() => {
    if (!selected || !data) return;
    data.forEach((d, i) => {
      if (d._id == selected._id)
        document.getElementById("category").selectedIndex = i + 1;
    });
  }, [data, selected]);
  return err
    ? h("div", { className: "notification is-danger" }, "Error: ", err)
    : h(
      "div",
      { className: "field my-2" },
      h(
        "label",
        { for: "category", className: "label" },
        "Select a category"
      ),
      h(
        "div",
        { className: "select" },
        h(
          "select",
          {
            id: "category",
            disabled: loading,
            onChange: () => {
              const i = document.getElementById("category").selectedIndex;
              onSelect(i == 0 ? undefined : data[i - 1]);
            },
          },
          h(
            "option",
            {
              onSelect: () => onSelect("some"),
            },
            loading ? "Loading" : "Select a category"
          ),
          loading
            ? null
            : data.map((category) =>
              h("option", { key: category._id }, category.name)
            )
        )
      )
    );
};

export default SelectCategory;

import { h, useEffect } from "../h";
import req from "../async";
import fetch from "shared/fetch";

const SelectSubcategory = ({ selected, category, onSelect }) => {
  const { data, loading, err } = req(
    `store/categories/${category._id}/subcategories`,
    fetch
  );
  console.log("selected", selected);
  useEffect(() => {
    if (!selected || !data) return;
    data.forEach((d, i) => {
      if (d._id == selected._id) {
        document.getElementById("subcategory").selectedIndex = i + 1;
        console.log(i + 1);
      }
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
          "Select a subcategory"
        ),
        h(
          "div",
          { className: "select" },
          h(
            "select",
            {
              id: "subcategory",
              disabled: loading,
              onChange: () => {
                const i = document.getElementById("subcategory").selectedIndex;
                console.log("aaaa");
                onSelect(i == 0 ? undefined : data[i - 1]);
              },
            },
            h(
              "option",
              {
                onSelect: () => onSelect("some"),
              },
              "Select a category"
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

export default SelectSubcategory;

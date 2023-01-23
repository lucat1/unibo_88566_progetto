import { h, useEffect } from "../h";
import req from "../async";
import fetch from "shared/fetch";

const SelectStore = ({ selected, onSelect }) => {
  const { data, loading, err } = req(
    "store/stores/?limit=30&page=1&sort=string&order=-1",
    fetch
  );
  useEffect(() => {
    if (!selected || !data) return;
    data.docs.forEach((d, i) => {
      if (d._id == selected._id)
        document.getElementById("store").selectedIndex = i + 1;
    });
  }, [data, selected]);
  return err
    ? h("div", { className: "notification is-danger" }, "Error: ", err)
    : h(
        "div",
        { className: "field my-2" },
        h("label", { for: "store", className: "label" }, "Select a store"),
        h(
          "div",
          { className: "select" },
          h(
            "select",
            {
              id: "store",
              disabled: loading,
              onChange: () => {
                const i = document.getElementById("store").selectedIndex;
                onSelect(i == 0 ? undefined : data.docs[i - 1]);
              },
            },
            h(
              "option",
              {
                onSelect: () => onSelect("some"),
              },
              loading ? "Loading" : "Select a store"
            ),
            loading
              ? null
              : data.docs.map((store) =>
                  h("option", { key: store._id }, store.name)
                )
          )
        )
      );
};

export default SelectStore;

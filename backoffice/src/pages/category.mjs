import { h, useState } from "../h";

import fetch, { withOptions } from "shared/fetch";
import { navigate } from "../router";
import req from "../async";

import Subcategories from "./subcategories";

const Category = () => {
  const id = parseInt(
    window.location.pathname.match(/\/categories\/(\d+)\/?$/)[1]
  );
  const {
    data,
    loading: fetching,
    err: fetchErr,
  } = req(`store/categories/${id}`, fetch);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const rename = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    setLoading(true);
    setErr(null);
    try {
      const { name: newName } = await fetch(
        `store/categories/${id}`,
        withOptions("PATCH", { name })
      );
      data.name = newName;
    } catch (err) {
      setErr("Error while renaming: " + (err.message || "Could not rename"));
    }
    setLoading(false);
  };
  const del = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await fetch(`store/categories/${id}`, withOptions("DELETE"));
      navigate("/categories");
    } catch (err) {
      setErr("Error while deleting: " + (err.message || "Could not rename"));
    }
    setLoading(false);
  };

  return h(
    "main",
    {},
    fetching
      ? h("progress", { className: "progress is-primary" })
      : fetchErr
        ? h("div", { className: "notification is-danger" }, "Error: ", fetchErr)
        : h(
          "main",
          {},
          h("h1", { className: "is-size-3" }, "Category #", data._id),
          h(
            "form",
            { onSubmit: rename },
            h(
              "div",
              { className: "field" },
              h("label", { for: "name", className: "label" }, "Name"),
              h(
                "div",
                { className: "control" },
                h("input", {
                  id: "name",
                  type: "text",
                  className: "input",
                  disabled: loading,
                  value: data.name,
                })
              )
            ),
            h(
              "div",
              {
                className:
                  "is-flex is-flex-direction-row is-justify-content-space-between py-2",
              },
              h(
                "button",
                {
                  className: "button is-danger",
                  action: "none",
                  onClick: del,
                  disabled: loading,
                },
                "Delete"
              ),
              h(
                "button",
                {
                  action: "submit",
                  className: "button is-primary",
                  disabled: loading,
                },
                "Rename"
              )
            ),
            err && h("div", { className: "notification is-danger" }, err)
          ),
          h(Subcategories, { category: id })
        )
  );
};

export default Category;

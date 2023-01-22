import { h, useState } from "../h";

import fetch, { withOptions } from "shared/fetch";
import { navigate, back } from "../router";
import req from "../async";

const Subcategory = () => {
  const id = parseInt(
    window.location.pathname.match(/\/subcategories\/(\d+)\/?$/)[1]
  );
  const {
    data,
    loading: fetching,
    err: fetchErr,
  } = req(`store/subcategories/${id}`, fetch);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const rename = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    setLoading(true);
    setErr(null);
    try {
      const { name: newName } = await fetch(
        `store/subcategories/${id}`,
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
      await fetch(`store/subcategories/${id}`, withOptions("DELETE"));
      back();
    } catch (err) {
      setErr("Error while deleting: " + (err.message || "Unknown Error"));
    }
    setLoading(false);
  };

  return h(
    "div",
    {},
    fetching
      ? h("progress", { className: "progress is-primary" })
      : fetchErr
        ? h("div", { className: "notification is-danger" }, "Error: ", fetchErr)
        : [
          h("h1", { className: "is-size-3" }, "Subcategory #", data._id),
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
                  name: "name",
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
        ]
  );
};

export default Subcategory;

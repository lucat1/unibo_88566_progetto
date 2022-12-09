import { h, useState } from "../h";

import fetch, { withOptions } from "shared/fetch";
import { navigate } from "../router";
import req from "../async";

import Posts from "./posts";

const Board = () => {
  const id = window.location.pathname.match(
    /\/boards\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/
  )[1];
  console.log(id);
  const {
    data,
    loading: fetching,
    err: fetchErr,
  } = req(`community/boards/${id}`, fetch);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const rename = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    setLoading(true);
    setErr(null);
    try {
      const { name: newName } = await fetch(
        `community/boards/${id}`,
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
      await fetch(`community/boards/${id}`, withOptions("DELETE"));
      navigate("/boards");
    } catch (err) {
      setErr("Error while deleting: " + (err.message || "Unknown error"));
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
          h(
            "h1",
            { className: "is-size-3" },
            '"',
            data.name,
            '" (board #',
            data._id,
            ")"
          ),
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
          h(Posts, { board: data })
        )
  );
};

export default Board;

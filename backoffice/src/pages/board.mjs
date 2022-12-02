import { h, useState } from "../h";

import { navigate } from "../router";
import fetch, { withOptions } from "shared/fetch";
import req from "../async";

const PostWrapper = () => {
  const id = window.location.pathname.match(
    /\/posts\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/
  )[1];
  const {
    data,
    loading: fetching,
    err: fetchErr,
  } = req(`store/posts/${id}`, fetch);
  return h(
    "main",
    {},
    fetching
      ? h("progress", { className: "progress is-primary" })
      : fetchErr
      ? h("div", { className: "notification is-danger" }, "Error: ", fetchErr)
      : h(Post, { id, data })
  );
};

const Post = ({ id, data }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const patch = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    setLoading(true);
    setError(null);
    try {
      const { name: newName } = await fetch(
        `store/posts/${id}`,
        withOptions("PATCH", {
          name,
        })
      );
      data.name = newName;
    } catch (err) {
      setError(err.message || "An error occourred while updating the post");
    }
    setLoading(false);
  };
  const del = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetch(`store/posts/${id}`, withOptions("DELETE"));
      navigate("/posts");
    } catch (err) {
      setError("Error while deleting: " + (err.message || "Unknown error"));
    }
    setLoading(false);
  };

  return h(
    "main",
    { className: "columns" },
    h(
      "section",
      { className: "column" },
      h("h1", { className: "is-size-3" }, "Post #", data._id),
      h(
        "form",
        { onSubmit: patch },
        h(
          "div",
          { className: "field my-2" },
          h("label", { for: "name", className: "label" }, "Name"),
          h(
            "div",
            { className: "control" },
            h("input", {
              id: "name",
              type: "text",
              className: "input",
              value: data.name,
              disabled: loading,
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
            "Update"
          )
        ),
        error && h("div", { className: "notification is-danger" }, error)
      )
    )
  );
};

export default PostWrapper;

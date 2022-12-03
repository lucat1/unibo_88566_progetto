import { h, useState } from "../h";

import { navigate } from "../router";
import fetch, { withOptions } from "shared/fetch";
import req from "../async";
import { FRONTOFFICE_ENDPOINT } from "shared/endpoints";

import { Link } from "../router";
import Pictures from "../components/pictures";

const PostWrapper = () => {
  const params = window.location.pathname.match(
      /\/boards\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})\/posts\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/
    ),
    id = params[1],
    post = params[2];
  const {
    data,
    loading: fetching,
    err: fetchErr,
  } = req(`community/boards/${id}/${post}`, fetch);
  return h(
    "main",
    {},
    fetching
      ? h("progress", { className: "progress is-primary" })
      : fetchErr
      ? h("div", { className: "notification is-danger" }, "Error: ", fetchErr)
      : h(Post, { id: post, board: id, data })
  );
};

const Post = ({ id, board, data }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photos] = useState(data.photos || []);

  const patch = async (e) => {
    e.preventDefault();
    const message = document.getElementById("description")?.value;
    if (message == null) return;
    setLoading(true);
    setError(null);
    try {
      const { title: newName, message: newDescription } = await fetch(
        `community/posts/${id}`,
        withOptions("PATCH", {
          title,
          message,
          photos,
        })
      );
      data.title = newName;
      data.message = newDescription;
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
      await fetch(`community/boards/${board}/${id}`, withOptions("DELETE"));
      navigate(`/boards/${board}`);
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
      { className: "column is-one-third" },
      h(Pictures, {
        pictures: photos,
      })
    ),
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
          h("label", { for: "message", className: "label" }, "Message"),
          h(
            "div",
            { className: "control" },
            h(
              "textarea",
              {
                id: "message",
                type: "text",
                className: "textarea",
                placeholder: "Type in a message...",
                disabled: loading,
              },
              data.message
            )
          )
        ),
        h(
          "div",
          {
            className:
              "is-flex is-flex-direction-row is-justify-content-space-between py-2",
          },
          h(
            Link,
            {
              to: FRONTOFFICE_ENDPOINT + "users/" + data._id,
            },
            h(
              "button",
              {
                className: "button is-primary",
                disabled: loading,
              },
              "Who made this?"
            )
          ),
          h(
            "button",
            {
              className: "button is-danger",
              action: "none",
              onClick: del,
              disabled: loading,
            },
            "Delete"
          )
        ),
        error && h("div", { className: "notification is-danger" }, error)
      )
    )
  );
};

export default PostWrapper;

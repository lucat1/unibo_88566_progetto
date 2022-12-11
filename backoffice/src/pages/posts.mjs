import { h, useState } from "../h";

import fetch, { withOptions } from "shared/fetch";
import { navigate } from "../router";

import Pagination from "../components/pagination";

const Posts = ({ board }) => {
  const [loading, setLoading] = useState(false),
    [id, setId] = useState(0),
    [err, setErr] = useState(null),
    del = (post_id) => async (e) => {
      e.preventDefault();
      setLoading(true);
      setErr(null);
      try {
        await fetch(
          `community/boards/${board._id}/${post_id}`,
          withOptions("DELETE")
        );
        navigate(`/boards/${board._id}`);
      } catch (err) {
        setErr("Error while deleting: " + (err.message || "Unknown error"));
      }
      setLoading(false);
      setId(id + 1);
    };

  return h(
    "main",
    {},
    h(
      "div",
      { className: "menu my-4" },
      h(
        "div",
        {
          className:
            "is-flex is-flex-direction-row is-justify-content-space-between py-2",
        },
        h("p", { className: "menu-label" }, "Posts")
      ),
      err && h("div", { className: "notification is-danger" }, err),
      h(
        Pagination,
        {
          url: (page) => `community/boards/${board._id}?page=${page}&limit=20`,
          className: "is-flex is-flex-direction-column",
          id: id,
        },
        (post, _) =>
          h(
            "div",
            { className: "card" },
            post.photos?.length > 0
              ? h(
                  "div",
                  { className: "card-image" },
                  h(
                    "figure",
                    { className: "image is-square" },
                    h("img", {
                      style: { "object-fit": "cover" },
                      src: post.photos ? post.photos[0] : undefined,
                      alt: `${post.name} main image`,
                    })
                  )
                )
              : null,
            h(
              "div",
              { className: "card-content" },
              h(
                "div",
                { className: "content" },
                h("p", {}, post.message || "No description provided"),
                h(
                  "button",
                  {
                    className: "button is-danger",
                    action: "none",
                    onClick: del(post._id),
                    disabled: loading,
                  },
                  "Delete"
                )
              )
            )
          )
      )
    )
  );
};

export default Posts;

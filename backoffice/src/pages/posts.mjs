import { h } from "../h";
import { Link } from "../router";
import req from "../async";
import fetch from "shared/fetch";

const Posts = ({ board }) => {
  const { data, loading, err } = req(`community/boards/${board}/posts`, fetch);
  return h(
    "main",
    {},
    loading
      ? h("progress", { className: "progress is-primary" })
      : err
      ? h("div", { className: "notification is-danger" }, "Error: ", err)
      : h(
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
          h(
            "ul",
            { className: "menu-list" },
            ...data.map((ele, i) =>
              h(
                "li",
                { key: i },
                h(
                  Link,
                  { to: `/boards/${board}/posts/${ele._id}` },
                  ele._id,
                  ' "',
                  ele.message,
                  '"'
                )
              )
            )
          )
        )
  );
};

export default Posts;

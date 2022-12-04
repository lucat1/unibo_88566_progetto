import { h } from "../h";
import Pagination from "../components/pagination";

const Posts = ({ board }) => {
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
      h(
        Pagination,
        {
          url: (page) => `community/boards/${board._id}?page=${page}&limit=20`,
          className: "is-flex is-flex-direction-row is-flex-wrap-wrap",
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
                    // onClick: del,
                    // disabled: loading,
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

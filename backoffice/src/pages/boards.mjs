import { h } from "../h";
import { Link } from "../router";

import Pagination from "../components/pagination";

const Boards = () =>
  h(
    "main",
    { className: "menu" },
    h("p", { className: "menu-label" }, "Boards"),
    h(
      Link,
      { to: "/boards/add" },
      h("button", { className: "button is-primary" }, "Add")
    ),
    h(
      Pagination,
      {
        url: (page) => `community/boards?page=${page}&limit=20`,
        className: "is-flex is-flex-direction-row is-flex-wrap-wrap",
      },
      (prod, i) =>
        h(
          Link,
          {
            to: `/boards/${prod._id}`,
            key: i,
            className: "m-4",
            style: { width: "100%", "max-width": "24rem" },
          },
          h(
            "div",
            { className: "card" },
            prod.photos?.length > 0
              ? h(
                  "div",
                  { className: "card-image" },
                  h(
                    "figure",
                    { className: "image is-square" },
                    h("img", {
                      style: { "object-fit": "cover" },
                      src: prod.photos ? prod.photos[0] : undefined,
                      alt: `${prod.name} main image`,
                    })
                  )
                )
              : null,
            h(
              "div",
              { className: "card-content" },
              h(
                "div",
                { className: "media" },
                h(
                  "div",
                  { className: "media-content" },
                  h("p", { className: "title is-4" }, prod.name)
                )
              )
            )
          )
        )
    )
  );

export default Boards;

import { h } from "../h";
import { Link } from "../router";

import Pagination from "../components/pagination";

const Boards = () =>
  h(
    "div",
    { className: "menu" },
    h(
      "div",
      {
        className:
          "is-flex is-flex-direction-row is-justify-content-space-between py-2",
      },
      h("p", { className: "menu-label" }, "Boards"),
      h(
        Link,
        { to: "/boards/add" },
        h("span", { className: "button is-primary" }, "Add")
      )
    ),
    h(
      Pagination,
      {
        url: (page) => `community/boards?page=${page}&limit=20`,
        className: "is-flex is-flex-direction-column",
      },
      (prod, i) =>
        h(
          Link,
          {
            to: `/boards/${prod._id}`,
            key: i,
            className: "m-4",
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

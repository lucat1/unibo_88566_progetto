import { h } from "../h";
import { Link } from "../router";

import Pagination from "../components/pagination";

const Boards = () =>
  h(
    "main",
    { className: "menu" },
    h("p", { className: "menu-label" }, "Boards"),
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
            to: `/products/${prod._id}`,
            key: i,
            className: "m-4",
            style: { width: "100%", "max-width": "24rem" },
          },
          h(
            "div",
            { className: "card" },
            prod.photos.length > 0
              ? h(
                  "div",
                  { className: "card-image" },
                  h(
                    "figure",
                    { className: "image is-square" },
                    h("img", {
                      style: { "object-fit": "cover" },
                      src: prod.photos[0],
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
              ),
              h(
                "div",
                { className: "content" },
                h("p", {}, prod.description || "No description provided")
              )
            ),
            (prod.category || prod.subcategory) &&
              h(
                "footer",
                { className: "card-footer" },
                prod.category &&
                  h(
                    Link,
                    {
                      to: `/categories/${prod.category._id}`,
                      className: "card-footer-item",
                    },
                    prod.category.name
                  ),
                prod.subcategory &&
                  h(
                    Link,
                    {
                      to: `/subcategories/${prod.subcategory._id}`,
                      className: "card-footer-item",
                    },
                    prod.subcategory.name
                  )
              )
          )
        )
    )
  );

export default Boards;

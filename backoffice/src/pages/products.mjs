import { h } from "../h";
import { Link } from "../router";

import Pagination from "../components/pagination";

const Products = () =>
  h(
    "main",
    { className: "menu" },
    h(
      "div",
      {
        className:
          "is-flex is-flex-direction-row is-justify-content-space-between py-2",
      },
      h("p", { className: "menu-label" }, "Products"),
      h(
        Link,
        { to: "/products/add" },
        h("button", { className: "button is-primary" }, "Add")
      )
    ),
    h(
      Pagination,
      {
        url: (page) => `store/products?page=${page}&limit=20`,
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

export default Products;

import { h } from "../h";
import { Link } from "../router";

import Pagination from "../components/pagination";

const Pets = () =>
  h(
    "main",
    { className: "menu" },
    h(
      "div",
      {
        className:
          "is-flex is-flex-direction-row is-justify-content-space-between py-2",
      },
      h("p", { className: "menu-label" }, "Pets"),
      h(
        Link,
        { to: "/pets/add" },
        h("button", { className: "button is-primary" }, "Add")
      )
    ),
    h(
      Pagination,
      {
        url: (page) => `store/pets?page=${page}&limit=20`,
        className: "is-flex is-flex-direction-row is-flex-wrap-wrap",
      },
      (pet, i) =>
        h(
          Link,
          {
            to: `/pets/${pet._id}`,
            key: i,
            className: "m-4",
            style: { width: "100%", "max-width": "24rem" },
          },
          h(
            "div",
            { className: "card" },
            pet.photos?.length > 0
              ? h(
                  "div",
                  { className: "card-image" },
                  h(
                    "figure",
                    { className: "image is-square" },
                    h("img", {
                      style: { "object-fit": "cover" },
                      src: pet.photos ? pet.photos[0] : undefined,
                      alt: `${pet.name} main image`,
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
                  h("p", { className: "title is-4" }, pet.name)
                )
              ),
              h(
                "div",
                { className: "content" },
                h("p", {}, pet.description || "No description provided")
              )
            ),
            (pet.category || pet.subcategory) &&
              h(
                "footer",
                { className: "card-footer" },
                pet.category &&
                  h(
                    Link,
                    {
                      to: `/categories/${pet.category._id}`,
                      className: "card-footer-item",
                    },
                    pet.category.name
                  ),
                pet.subcategory &&
                  h(
                    Link,
                    {
                      to: `/subcategories/${pet.subcategory._id}`,
                      className: "card-footer-item",
                    },
                    pet.subcategory.name
                  )
              )
          )
        )
    )
  );

export default Pets;

import { h } from "../h";
import { Link } from "../router";

import Pagination from "../components/pagination";

const Services = () =>
  h(
    "div",
    { className: "menu" },
    h(
      "div",
      {
        className:
          "is-flex is-flex-direction-row is-justify-content-space-between py-2",
      },
      h("p", { className: "menu-label" }, "Services"),
      h(
        Link,
        { to: "/services/add" },
        h("button", { className: "button is-primary" }, "Add")
      )
    ),
    h(
      Pagination,
      {
        url: (page) => `store/services?page=${page}&limit=20`,
        className: "is-flex is-flex-direction-row is-flex-wrap-wrap",
      },
      (serv, i) =>
        h(
          Link,
          {
            to: `/services/${serv._id}`,
            key: i,
            className: "m-4",
            style: { width: "100%", "max-width": "24rem" },
          },
          h(
            "div",
            { className: "card" },
            serv.photos?.length > 0
              ? h(
                "div",
                { className: "card-image" },
                h(
                  "figure",
                  { className: "image is-square" },
                  h("img", {
                    style: { "object-fit": "cover" },
                    src: serv.photos ? serv.photos[0] : undefined,
                    alt: `${serv.name} main image`,
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
                  h("p", { className: "title is-4" }, serv.name)
                )
              ),
              h(
                "div",
                { className: "content" },
                h("p", {}, serv.description || "No description provided")
              )
            )
          )
        )
    )
  );

export default Services;

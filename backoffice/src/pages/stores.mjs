import { h } from "../h";
import { Link } from "../router";

import Pagination from "../components/pagination";
import Map from "../components/map";

const Stores = () =>
  h(
    "main",
    { className: "menu" },
    h(
      "div",
      {
        className:
          "is-flex is-flex-direction-row is-justify-content-space-between py-2",
      },
      h("p", { className: "menu-label" }, "Stores"),
      h(
        Link,
        { to: "/stores/add" },
        h("button", { className: "button is-primary" }, "Add")
      )
    ),
    h(
      Pagination,
      {
        url: (page) => `store/stores?page=${page}&limit=20`,
        className: "is-flex is-flex-direction-row is-flex-wrap-wrap",
      },
      (store, i) =>
        h(
          Link,
          {
            to: `/stores/${store._id}`,
            key: i,
            className: "m-4",
            style: { width: "100%", "max-width": "24rem" },
          },
          h(
            "div",
            { className: "card" },
            h(Map, {
              lat: store.location[0],
              lng: store.location[1],
              defaultZoom: 10,
            }),
            h(
              "div",
              { className: "card-content" },
              h(
                "div",
                { className: "media" },
                h(
                  "div",
                  { className: "media-content" },
                  h("p", { className: "title is-4" }, store.name)
                )
              )
            )
          )
        )
    )
  );

export default Stores;

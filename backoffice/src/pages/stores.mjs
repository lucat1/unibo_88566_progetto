import { h } from "../h";
import { Link } from "../router";

import Pagination from "../components/pagination";

const Stores = () =>
  h(
    "div",
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
        h("span", { className: "button is-primary" }, "Add")
      )
    ),
    h(
      Pagination,
      {
        url: (page) => `store/stores?page=${page}&limit=20`,
        ele: "ul",
        className: "menu-list",
      },
      (store, i) =>
        h("li", { key: i }, h(Link, { to: `/stores/${store._id}` }, store.name))
    )
  );

export default Stores;

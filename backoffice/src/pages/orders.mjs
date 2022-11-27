import { h } from "../h";
import { Link } from "../router";

import Pagination from "../components/pagination";

const Orders = () =>
  h(
    "main",
    { className: "menu" },
    h(
      "div",
      {
        className:
          "is-flex is-flex-direction-row is-justify-content-space-between py-2",
      },
      h("p", { className: "menu-label" }, "Orders")
    ),
    h(
      Pagination,
      {
        url: (page) => `store/orders?page=${page}&limit=20`,
        subele: "table",
        className: "table",
        style: { width: "100%" },
        pre: h(
          "thead",
          null,
          h(
            "tr",
            null,
            h("th", null, "Index"),
            h("th", null, h("abbr", { title: "Number of items" }, "N. items")),
            h("th", null, "Products"),
            h("th", null, "Total"),
            h("th", null, h("abbr", { title: "Date of purchase" }, "Date")),
            h("th", null, "Buyer")
          )
        ),
        around: "tbody",
      },
      (order, i) =>
        h(
          "tr",
          null,
          h("th", null, h(Link, { to: `/orders/${order?._id}` }, i)),
          h("td", null, order?.items?.length),
          h(
            "td",
            null,
            order?.items
              ?.map((i, j) => [
                h(
                  Link,
                  {
                    to: `/${i.pet ? "pets" : "products"}/${
                      (i.product || i.pet)._id
                    }`,
                  },
                  (i.product || i.pet).name
                ),
                j < order?.items?.length - 1 ? "," : undefined,
              ])
              .flat()
          ),
          h(
            "td",
            null,
            "$",
            order?.items?.reduce(
              (prev, item) => prev + (item.product || item.pet).price,
              0
            )
          ),
          h("td", null, new Date(order?.date).toLocaleDateString("en-US")),
          h(
            "td",
            null,
            h(Link, { to: `/users/${order?.user?._id}` }, order.user?.username)
          )
        )
    )
  );

export default Orders;

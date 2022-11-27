import { h, useState, useEffect } from "../h";

import { Link, navigate } from "../router";
import fetch, { withOptions } from "shared/fetch";
import req from "../async";

const OrderWrapper = () => {
  const id = window.location.pathname.match(
    /\/orders\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/
  )[1];
  const {
    data,
    loading: fetching,
    err: fetchErr,
  } = req(`store/orders/${id}`, fetch);
  return h(
    "main",
    {},
    fetching
      ? h("progress", { className: "progress is-primary" })
      : fetchErr
      ? h("div", { className: "notification is-danger" }, "Error: ", fetchErr)
      : h(Order, { id, data })
  );
};

const Order = ({ id, data }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const del = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetch(`store/orders/${id}`, withOptions("DELETE"));
      navigate("/orders");
    } catch (err) {
      setError("Error while deleting: " + (err.message || "Unknown error"));
    }
    setLoading(false);
  };

  return h(
    "main",
    { className: "is-flex is-flex-direction-column" },
    h(
      "div",
      {
        className:
          "is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between",
      },
      h("h1", { className: "is-size-2 my-4" }, "Order #", data._id),
      h(
        "button",
        {
          className: "button is-danger",
          action: "none",
          onClick: del,
          disabled: loading,
        },
        "Delete"
      )
    ),
    error && h("div", { className: "notification is-danger" }, error),
    h(
      "table",
      { className: "table" },
      h(
        "thead",
        null,
        h(
          "tr",
          null,
          h("th", null, h("abbr", { title: "Position" }, "Pos")),
          h("th", null, h("abbr", { title: "Product image" }, "Image")),
          h("th", null, h("abbr", { title: "Product name" }, "Name")),
          h("th", null, h("abbr", { title: "Product unitary price" }, "Price")),
          h("th", null, "Amount")
        )
      ),
      h(
        "tbody",
        null,
        data.items.map((item, i) =>
          h(
            "tr",
            { key: i },
            h("th", null, i + 1),
            h(
              "td",
              null,
              h("img", {
                style: { width: "1.5rem", height: "1.5rem" },
                alt: `${(item.pet || item.product).name}'s ${
                  item.pet ? "pet" : "product"
                } image`,
                src: (item.product || item.pet).photos[0],
              })
            ),
            h(
              "td",
              null,
              h(
                Link,
                {
                  to: `/${item.pet ? "pets" : "products"}/${
                    (item.product || item.pet)._id
                  }`,
                },
                (item.product || item.pet).name
              )
            ),
            h("td", null, "$", (item.product || item.pet).price.toFixed(2)),
            h("td", null, item.amount)
          )
        )
      )
    ),
    h("h2", { className: "is-size-3 my-3" }, "Shipping info"),
    h(
      "section",
      { className: "columns" },
      h(
        "div",
        { className: "column" },
        h("h4", { className: "is-size-5 my-1" }, "First name"),
        h("span", null, data.shipping.firstName)
      ),
      h(
        "div",
        { className: "column" },
        h("h4", { className: "is-size-5 my-1" }, "Last name"),
        h("span", null, data.shipping.lastName)
      ),
      h(
        "div",
        { className: "column" },
        h("h4", { className: "is-size-5 my-1" }, "Address"),
        h("span", null, data.shipping.address)
      ),
      h(
        "div",
        { className: "column" },
        h("h4", { className: "is-size-5 my-1" }, "Phone number"),
        h("span", null, data.shipping.phone)
      )
    ),
    h(
      "h3",
      { className: "is-size-3 my-3" },
      "Date: ",
      new Date(data?.date).toLocaleString("en-US")
    ),
    h(
      "h3",
      { className: "is-size-3 my-3" },
      "Buyer: ",
      h(Link, { to: `/users/${data.user._id}` }, data.user.username)
    )
  );
};

export default OrderWrapper;

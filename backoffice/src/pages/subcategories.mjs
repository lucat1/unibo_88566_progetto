import { h } from "../h";
import { Link } from "../router";
import req from "../async";
import fetch from "shared/fetch";

const Subcategories = ({ category }) => {
  const { data, loading, err } = req(
    `store/categories/${category}/subcategories`,
    fetch
  );
  return h(
    "div",
    {},
    loading
      ? h("progress", { className: "progress is-primary" })
      : err
        ? h("div", { className: "notification is-danger" }, "Error: ", err)
        : h(
          "div",
          { className: "menu my-4" },
          h(
            "div",
            {
              className:
                "is-flex is-flex-direction-row is-justify-content-space-between py-2",
            },
            h("p", { className: "menu-label" }, "Subcategories"),
            h(
              Link,
              { to: `/categories/${category}/add` },
              h("button", { className: "button is-primary" }, "Add")
            )
          ),
          h(
            "ul",
            { className: "menu-list" },
            ...data.map((ele, i) =>
              h(
                "li",
                { key: i },
                h(Link, { to: `/subcategories/${ele._id}` }, ele.name)
              )
            )
          )
        )
  );
};

export default Subcategories;

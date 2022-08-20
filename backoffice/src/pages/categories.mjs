import { h } from "../h";
import { Link } from "../router";
import req from "../async";
import fetch from "shared/fetch";

const Categories = () => {
  const { data, loading, err } = req("store/categories", fetch);
  // console.log(data, loading, err);
  return h(
    "main",
    {},
    loading
      ? h("progress", { className: "progress is-primary" })
      : err
      ? h("div", { className: "notification is-danger" }, "Error: ", err)
      : h(
          "div",
          { className: "menu" },
          h(
            "div",
            {
              className:
                "is-flex is-flex-direction-row is-justify-content-space-between",
            },
            h("p", { className: "menu-label" }, "Categories"),
            h(
              Link,
              { to: "/categories/add" },
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
                h(Link, { to: `/categories/${ele._id}` }, ele.name)
              )
            )
          )
        )
  );
};

export default Categories;

import { h } from "../h";

import { navigate } from "../router";
import { useContext } from "../ctx";
import { user as userContext } from "../ctxs";

const Category = () => {
  if (!useContext(userContext)[0]) navigate("/");

  const id = parseInt(
    window.location.pathname.match(/^\/categories\/(\d+)\/?$/)[1]
  );
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
            h("p", { className: "menu-label" }, "Category #", id),
            h(
              "div",
              {
                className:
                  "is-flex is-flex-direction-row is-justify-content-space-between",
              },
              h("button", { className: "button is-primary" }, "Rename"),
              h(Link, { className: "button is-success", to: "/subcategories/add" }, "Add"),
              h("button", { className: "button is-danger" }, "Delete")
            ),
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
};

export default Category;

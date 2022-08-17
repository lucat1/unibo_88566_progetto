import { h } from "../h";
import { Link } from "../router";
import req from "../async";
import fetch from "shared/fetch";

const Categories = () => {
  const { data, loading, err } = req("store/categories", fetch);
  console.log(data, loading, err);
  return h(
    "main",
    {},
    h(Link, { to: "/categories/add" }, "add"),
    h("h1", {}, "categories"),
    loading
      ? h("span", {}, "loading")
      : err
      ? h("span", {}, "err: ", err)
      : h(
          "ul",
          {},
          ...data.map((ele, i) =>
            h(
              "li",
              { key: i },
              h(Link, { to: `/categories/${ele._id}` }, ele.name)
            )
          )
        )
  );
};

export default Categories;

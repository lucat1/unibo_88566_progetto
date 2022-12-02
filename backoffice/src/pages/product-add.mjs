import { h, useState } from "../h";
import { navigate } from "../router";
import fetch, { withOptions } from "shared/fetch";

import SelectCategory from "../components/select-category";
import SelectSubcategory from "../components/select-subcategory";

const ProductAdd = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(undefined);
  const [subcategory, setSubcategory] = useState(undefined);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);
    const stock = parseFloat(document.getElementById("stock").value);
    setLoading(true);
    setError(null);
    try {
      const { _id } = await fetch(
        "store/products",
        withOptions("PUT", {
          name,
          description,
          price,
          stock,
          category: category?._id,
          subcategory: subcategory?._id,
        })
      );
      navigate(`/products/${_id}`);
    } catch (err) {
      setError(err.message || "An error occourred while adding a new product");
    }
    setLoading(false);
  };
  return h(
    "form",
    { onSubmit: handleSubmit },
    h("h1", { className: "title" }, "Add a product"),

    h(
      "div",
      { className: "field my-2" },
      h("label", { for: "name", className: "label" }, "Name"),
      h(
        "div",
        { className: "control" },
        h("input", {
          id: "name",
          type: "text",
          className: "input",
          disabled: loading,
        })
      )
    ),
    h(
      "div",
      { className: "field my-2" },
      h("label", { for: "description", className: "label" }, "Description"),
      h(
        "div",
        { className: "control" },
        h("textarea", {
          id: "description",
          type: "text",
          className: "textarea",
          placeholder: "Type in a description...",
          disabled: loading,
        })
      )
    ),
    h(
      "div",
      { className: "field my-2" },
      h("label", { for: "price", className: "label" }, "Price"),
      h(
        "div",
        { className: "control" },
        h("input", {
          id: "price",
          type: "number",
          step: "0.01",
          className: "input",
          disabled: loading,
        })
      )
    ),
    h(
      "div",
      { className: "field my-2" },
      h("label", { for: "stock", className: "label" }, "Stock"),
      h(
        "div",
        { className: "control" },
        h("input", {
          id: "stock",
          type: "number",
          step: "1",
          value: "1",
          className: "input",
          disabled: loading,
        })
      )
    ),
    h(SelectCategory, { onSelect: (c) => setCategory(c) }),
    category != undefined
      ? h(SelectSubcategory, { category, onSelect: (c) => setSubcategory(c) })
      : null,
    h("p", { class: "help is-danger" }, error),
    h(
      "div",
      { className: "field my-2" },
      h(
        "div",
        { className: "control" },
        h(
          "button",
          {
            action: "submit",
            className: "button is-link",
            disabled: loading,
          },
          "Add"
        )
      )
    )
  );
};

export default ProductAdd;

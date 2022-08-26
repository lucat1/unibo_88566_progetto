import { h, useState } from "../h";
import { navigate } from "../router";
import fetch, { withOptions } from "shared/fetch";
import req from "../async";

const CategorySelector = ({ onSelect }) => {
  const { data, loading, err } = req("store/categories", fetch);
  return err
    ? h("div", { className: "notification is-danger" }, "Error: ", err)
    : h(
        "div",
        { className: "field my-2" },
        h(
          "label",
          { for: "category", className: "label" },
          "Select a category"
        ),
        h(
          "div",
          { className: "select" },
          h(
            "select",
            {
              id: "category",
              disabled: loading,
              onChange: () => {
                const i = document.getElementById("category").selectedIndex;
                onSelect(i == 0 ? undefined : data[i - 1]);
              },
            },
            h(
              "option",
              {
                onSelect: () => onSelect("some"),
              },
              loading ? "Loading" : "Select a category"
            ),
            loading
              ? null
              : data.map((category) =>
                  h("option", { key: category._id }, category.name)
                )
          )
        )
      );
};

const SubcategorySelector = ({ category, onSelect }) => {
  const { data, loading, err } = req(
    `store/categories/${category._id}/subcategories`,
    fetch
  );
  return err
    ? h("div", { className: "notification is-danger" }, "Error: ", err)
    : h(
        "div",
        { className: "field my-2" },
        h(
          "label",
          { for: "category", className: "label" },
          "Select a subcategory"
        ),
        h(
          "div",
          { className: "select" },
          h(
            "select",
            {
              id: "subcategory",
              disabled: loading,
              onChange: () => {
                const i = document.getElementById("subcategory").selectedIndex;
                onSelect(i == 0 ? undefined : data[i - 1]);
              },
            },
            h(
              "option",
              {
                onSelect: () => onSelect("some"),
              },
              "Select a category"
            ),
            loading
              ? null
              : data.map((category) =>
                  h("option", { key: category._id }, category.name)
                )
          )
        )
      );
};

// TODO: photos?
const ProductAdd = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [category, setCategory] = useState(undefined);
  const [subcategory, setSubcategory] = useState(undefined);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { _id } = await fetch(
        "store/products",
        withOptions("PUT", {
          name,
          description,
          price,
          category: category._id,
          subcategory: subcategory._id,
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
    h(CategorySelector, { onSelect: (c) => setCategory(c) }),
    category != undefined
      ? h(SubcategorySelector, { category, onSelect: (c) => setSubcategory(c) })
      : null,
    h("p", { class: "help is-danger" }, error),
    h("p", { class: "help is-success" }, message),
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

import { h, useState, useEffect } from "../h";

import { navigate } from "../router";
import fetch, { withOptions } from "shared/fetch";
import req from "../async";

import SelectCategory from "../components/select-category";
import SelectSubcategory from "../components/select-subcategory";

const Product = () => {
  const id = window.location.pathname.match(
    /^\/products\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/
  )[1];
  const {
    data,
    loading: fetching,
    err: fetchErr,
  } = req(`store/products/${id}`, fetch);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(undefined);
  const [subcategory, setSubcategory] = useState(undefined);

  const [prevLoading, setPrevLoading] = useState(true);
  useEffect(() => {
    if ((!loading && !prevLoading) || !data) return;

    console.log("a", loading, prevLoading);
    if (data.category != category) {
      setCategory(data.category);
    }
    if (data.subcategory != subcategory) {
      console.log("here with", data.subcategory);
      setSubcategory(data.subcategory);
    }
    if (!loading && prevLoading) setPrevLoading(false);
  }, [loading, data, category, setCategory, subcategory, setSubcategory]);
  const patch = async (e) => {
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
  const del = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetch(`store/products/${id}`, withOptions("DELETE"));
      navigate("/products");
    } catch (err) {
      setError("Error while deleting: " + (err.message || "Could not rename"));
    }
    setLoading(false);
  };
  console.log("rendering with", subcategory);
  return h(
    "main",
    {},
    fetching
      ? h("progress", { className: "progress is-primary" })
      : fetchErr
      ? h("div", { className: "notification is-danger" }, "Error: ", fetchErr)
      : h(
          "main",
          {},
          h("h1", { className: "is-size-3" }, "Product #", data._id),
          h(
            "form",
            { onSubmit: patch },
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
                  value: data.name,
                  disabled: loading,
                })
              )
            ),
            h(
              "div",
              { className: "field my-2" },
              h(
                "label",
                { for: "description", className: "label" },
                "Description"
              ),
              h(
                "div",
                { className: "control" },
                h("textarea", {
                  id: "description",
                  type: "text",
                  className: "textarea",
                  placeholder: "Type in a description...",
                  value: data.description,
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
                  value: data.price,
                  disabled: loading,
                })
              )
            ),
            h(SelectCategory, {
              selected: category,
              onSelect: (c) => setCategory(c),
            }),
            category != undefined
              ? h(SelectSubcategory, {
                  selected: subcategory,
                  category,
                  onSelect: (c) => setSubcategory(c),
                })
              : null,
            h(
              "div",
              {
                className:
                  "is-flex is-flex-direction-row is-justify-content-space-between py-2",
              },
              h(
                "button",
                {
                  className: "button is-danger",
                  action: "none",
                  onClick: del,
                  disabled: loading,
                },
                "Delete"
              ),
              h(
                "button",
                {
                  action: "submit",
                  className: "button is-primary",
                  disabled: loading,
                },
                "Rename"
              )
            ),
            error && h("div", { className: "notification is-danger" }, error)
          )
        )
  );
};

export default Product;

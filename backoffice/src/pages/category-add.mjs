import { h, useState } from "../h";
import fetch, { withOptions } from "shared/fetch";

const CategoryAdd = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name");
    console.log("submit", name.value);
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { _id, name: n } = await fetch(
        "store/categories",
        withOptions("PUT", { name: name.value })
      );
      name.value = "";
      setMessage(`New category (#${_id}) added with name "${n}"`);
    } catch (err) {
      setError(err.message || "An error occourred while adding a new category");
    }
    setLoading(false);
  };
  return h(
    "main",
    {},
    h(
      "form",
      { className: "box", onSubmit: handleSubmit },
      h("h1", { className: "title" }, "Add a category"),

      h(
        "div",
        { className: "field" },
        h("label", { for: "name", className: "label" }, "Name"),
        h(
          "div",
          { className: "control" },
          h("input", {
            id: "name",
            type: "text",
            name: "name",
            className: "input",
            disabled: loading,
          })
        )
      ),
      h("p", { class: "help is-danger" }, error),
      h("p", { class: "help is-success" }, message),
      h(
        "div",
        { className: "field" },
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
    )
  );
};

export default CategoryAdd;

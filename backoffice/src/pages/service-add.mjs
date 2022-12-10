import { h, useState } from "../h";
import { navigate } from "../router";
import fetch, { withOptions } from "shared/fetch";

const ServiceAdd = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);
    setLoading(true);
    setError(null);
    try {
      const { _id } = await fetch(
        "store/services",
        withOptions("PUT", {
          name,
          description,
          price,
        })
      );
      navigate(`/services/${_id}`);
    } catch (err) {
      setError(err.message || "An error occourred while adding a new service");
    }
    setLoading(false);
  };
  return h(
    "form",
    { onSubmit: handleSubmit },
    h("h1", { className: "title" }, "Add a service"),

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

export default ServiceAdd;

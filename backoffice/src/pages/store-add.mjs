import { h, useState } from "../h";
import { navigate } from "../router";
import fetch, { withOptions } from "shared/fetch";

import Map from "../components/map";

const StoreAdd = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState([
    51.50085555874079, -0.12181520462036134,
  ]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    setLoading(true);
    setError(null);
    try {
      const { _id } = await fetch(
        "store/stores",
        withOptions("PUT", {
          name,
          location,
        })
      );
      navigate(`/stores/${_id}`);
    } catch (err) {
      setError(err.message || "An error occourred while adding a new store");
    }
    setLoading(false);
  };
  return h(
    "form",
    { onSubmit: handleSubmit },
    h("h1", { className: "title" }, "Add a store"),

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
      h("label", { for: "map", className: "label" }, "Location"),
      h(Map, {
        lat: location[0],
        lng: location[1],
        defaultZoom: 10,
        onClick: (e) => {
          setLocation([e.latlng.lat, e.latlng.lng]);
        },
      })
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

export default StoreAdd;

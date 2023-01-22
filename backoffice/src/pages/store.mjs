import { h, useState } from "../h";

import { navigate } from "../router";
import fetch, { withOptions } from "shared/fetch";
import req from "../async";

import Map from "../components/map";

const StoreWrapper = () => {
  const id = window.location.pathname.match(
    /\/stores\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/
  )[1];
  const {
    data,
    loading: fetching,
    err: fetchErr,
  } = req(`store/stores/${id}`, fetch);
  return h(
    "div",
    {},
    fetching
      ? h("progress", { className: "progress is-primary" })
      : fetchErr
        ? h("div", { className: "notification is-danger" }, "Error: ", fetchErr)
        : h(Store, { id, data })
  );
};

const Store = ({ id, data }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let [location, setLocation] = useState(data.location);

  const patch = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    setLoading(true);
    setError(null);
    try {
      const { name: newName, location: newLocation } = await fetch(
        `store/stores/${id}`,
        withOptions("PATCH", {
          name,
          location,
        })
      );
      data.name = newName;
      if (newLocation != location) setLocation(newLocation);
      // location = newLocation
    } catch (err) {
      setError(err.message || "An error occourred while updating the store");
    }
    setLoading(false);
  };
  const del = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetch(`store/stores/${id}`, withOptions("DELETE"));
      navigate("/stores");
    } catch (err) {
      setError("Error while deleting: " + (err.message || "Unknown Error"));
    }
    setLoading(false);
  };

  return h(
    "form",
    { onSubmit: patch },
    h("h1", { className: "title" }, "Edit a store"),

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
        "Update"
      )
    )
  );
};

export default StoreWrapper;

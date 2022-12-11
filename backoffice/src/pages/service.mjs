import { h, useState } from "../h";

import { navigate } from "../router";
import fetch, { withOptions } from "shared/fetch";
import req from "../async";

import Disponibilities from "../components/disponibilities";
import Pictures from "../components/pictures";
import SelectStore from "../components/select-store";
import File from "../components/file";

const ServiceWrapper = () => {
  const id = window.location.pathname.match(
    /\/services\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/
  )[1];
  const {
    data,
    loading: fetching,
    err: fetchErr,
  } = req(`store/services/${id}`, fetch);
  return h(
    "main",
    {},
    fetching
      ? h("progress", { className: "progress is-primary" })
      : fetchErr
        ? h("div", { className: "notification is-danger" }, "Error: ", fetchErr)
        : h(Service, { id, data })
  );
};

const Service = ({ id, data }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [photos, setPhotos] = useState(data.photos || []);
  const [store, setStore] = useState(data.store);
  const [disponibilities, setDisponibilities] = useState(data.disponibilities);

  const patch = async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);
    setLoading(true);
    setError(null);
    try {
      const {
        name: newName,
        description: newDescription,
        price: newPrice,
        store: newStore,
      } = await fetch(
        `store/services/${id}`,
        withOptions("PATCH", {
          name,
          description,
          price,
          photos,
          store: store?._id,
          disponibilities,
        })
      );
      data.name = newName;
      data.description = newDescription;
      data.price = newPrice;
      data.store = newStore;
    } catch (err) {
      setError(err.message || "An error occourred while updating the service");
    }
    setLoading(false);
  };
  const del = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetch(`store/services/${id}`, withOptions("DELETE"));
      navigate("/services");
    } catch (err) {
      setError("Error while deleting: " + (err.message || "Unknown error"));
    }
    setLoading(false);
  };

  return h(
    "main",
    { className: "columns" },
    h(
      "section",
      { className: "column is-one-third" },
      h(Pictures, {
        pictures: photos,
        extra: h(File, { onUpload: (url) => setPhotos(photos.concat(url)) }),
        extraIcon: h("i", { className: "fas fa-upload" }),
      })
    ),
    h(
      "section",
      { className: "column" },
      h("h1", { className: "is-size-3" }, "Service #", data._id),
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
          h("label", { for: "description", className: "label" }, "Description"),
          h(
            "div",
            { className: "control" },
            h(
              "textarea",
              {
                id: "description",
                type: "text",
                className: "textarea",
                placeholder: "Type in a description...",
                disabled: loading,
              },
              data.description
            )
          )
        ),
        h(SelectStore, {
          selected: store,
          onSelect: (s) => setStore(s),
        }),
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
        h(Disponibilities, disponibilities, setDisponibilities),
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
        ),
        error && h("div", { className: "notification is-danger" }, error)
      )
    )
  );
};

export default ServiceWrapper;

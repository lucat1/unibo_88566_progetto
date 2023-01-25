import { h, useState, useEffect } from "../h";

import { navigate } from "../router";
import fetch, { withOptions } from "shared/fetch";
import req from "../async";

import Pictures from "../components/pictures";

const UserWrapper = () => {
  const id = window.location.pathname.match(
    /\/users\/([0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})$/
  )[1];
  const { data, loading: fetching, err: fetchErr } = req(`users/${id}`, fetch);
  return h(
    "div",
    {},
    fetching
      ? h("progress", { className: "progress is-primary" })
      : fetchErr
      ? h("div", { className: "notification is-danger" }, "Error: ", fetchErr)
      : h(User, { id, data })
  );
};

const User = ({ id, data }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const patch = async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const city = document.getElementById("city").value;
    const password = document.getElementById("password").value;
    if (username == "") {
      setError("Username cannot be empty");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await fetch(
        `users/${id}`,
        withOptions("PATCH", {
          username,
          firstName,
          lastName,
          city,
          ...(password ? { password } : {}),
        })
      );
      document.getElementById("password").value = "";
    } catch (err) {
      setError(
        err.message || "An error occourred while changing the user's password"
      );
    }
    setLoading(false);
  };

  const del = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetch(`users/${id}`, withOptions("DELETE"));
      navigate("/users");
    } catch (err) {
      setError("Error while deleting: " + (err.message || "Unknown error"));
    }
    setLoading(false);
  };

  return h(
    "div",
    { className: "columns" },
    h(
      "section",
      { className: "column is-one-third" },
      data.avatar
        ? h(Pictures, {
            pictures: [data.avatar],
            name: "@" + data.username,
          })
        : h(
            "div",
            {
              className:
                "has-ratio is-flex is-flex-direction-column is-align-items-center is-justify-content-center",
            },
            "No profile picture"
          )
    ),
    h(
      "section",
      { className: "column" },
      h("h1", { className: "is-size-3" }, "User #", data._id),
      h(
        "form",
        { onSubmit: patch },
        h(
          "div",
          { className: "field my-2" },
          h("label", { for: "username", className: "label" }, "Username"),
          h(
            "div",
            { className: "control" },
            h("input", {
              id: "username",
              type: "text",
              className: "input",
              value: data.username,
              disabled: loading,
            })
          )
        ),
        h(
          "div",
          { className: "field my-2" },
          h("label", { for: "firstName", className: "label" }, "First name"),
          h(
            "div",
            { className: "control" },
            h("input", {
              id: "firstName",
              type: "text",
              className: "input",
              value: data.firstName,
              disabled: loading,
            })
          )
        ),
        h(
          "div",
          { className: "field my-2" },
          h("label", { for: "lastName", className: "label" }, "Last name"),
          h(
            "div",
            { className: "control" },
            h("input", {
              id: "lastName",
              type: "text",
              className: "input",
              value: data.lastName,
              disabled: loading,
            })
          )
        ),
        h(
          "div",
          { className: "field my-2" },
          h("label", { for: "city", className: "label" }, "City"),
          h(
            "div",
            { className: "control" },
            h("input", {
              id: "city",
              type: "text",
              className: "input",
              value: data.city,
              disabled: loading,
            })
          )
        ),
        h(
          "div",
          { className: "field my-2" },
          h("label", { for: "password", className: "label" }, "Password"),
          h(
            "div",
            { className: "control" },
            h("input", {
              id: "password",
              type: "password",
              className: "input",
              value: "",
              disabled: loading,
            })
          )
        ),
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

export default UserWrapper;

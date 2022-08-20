import { h, useState } from "../h";
import { navigate } from "../router";
import { useContext } from "../ctx";
import { user as userContext } from "../ctxs";
import { me, setAuthToken } from "shared/auth";
import fetch, { withOptions } from "shared/fetch";

const Login = () => {
  const [user, setUser] = useContext(userContext);
  if (user) navigate("/");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    setLoading(true);
    setError(null);
    try {
      const { token } = await fetch(
        "auth/login",
        withOptions("POST", { username, password })
      );
      setAuthToken(token);
      setUser(await me());
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid username/password combination");
    }
    setLoading(false);
  };

  return h(
    "div",
    { className: "center h-full" },
    h(
      "form",
      { className: "box", onSubmit: handleSubmit },
      h("h1", { className: "title" }, "Login"),
      h(
        "div",
        { className: "field" },
        h("label", { for: "username", className: "label" }, "Username"),
        h(
          "div",
          { className: "control" },
          h("input", {
            id: "username",
            type: "text",
            name: "username",
            className: "input",
            disabled: loading,
          })
        )
      ),
      h(
        "div",
        { className: "field" },
        h("label", { for: "password", className: "label" }, "Password"),
        h(
          "div",
          { className: "control" },
          h("input", {
            id: "password",
            type: "password",
            name: "password",
            className: "input",
            disabled: loading,
          })
        )
      ),
      h("p", { class: "help is-danger" }, error),
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
            "Login"
          )
        )
      )
    )
  );
};

export default Login;

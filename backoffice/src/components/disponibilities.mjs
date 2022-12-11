import { h } from "../h";

const Disponibilities = (disponibilities, setDisponibilities) => {
  return h(
    "div",
    { className: "field my-2" },
    h(
      "label",
      { for: "disponibilities", className: "label" },
      "Disponibilities"
    ),
    disponibilities?.length == 0 ? "No disponibilities yet." : null,
    h(
      "div",
      {
        id: "disponibilities",
        className: "menu my-4",
      },
      disponibilities?.map((disponibility, i) =>
        h(
          "div",
          { className: "card my-4" },
          h(
            "div",
            { className: "card-content" },
            h(
              "div",
              { className: "content" },
              h(
                "label",
                { for: "disponibility-name", className: "label" },
                "Name"
              ),
              h(
                "div",
                { className: "control" },
                h("input", {
                  id: "disponibility-name-" + i,
                  className: "input",
                  value: disponibility.name ? disponibility.name : "",
                  onchange: () => {
                    disponibility.name = document.getElementById(
                      "disponibility-name-" + i
                    ).value;
                    setDisponibilities[0](disponibilities);
                  },
                }),
                h(
                  "button",
                  {
                    className: "button is-danger my-2",
                    action: "none",
                    onClick: () => {
                      disponibilities.splice(i);
                      setDisponibilities[0](disponibilities);
                    },
                  },
                  "Delete"
                )
              )
            )
          )
        )
      )
    ),
    h(
      "div",
      {
        className: "is-flex  is-justify-content-space-between py-2",
      },
      h(
        "button",
        {
          action: "submit",
          className: "button is-primary",
          onClick: () =>
            setDisponibilities[0]([
              ...disponibilities,
              { name: "???", intervals: [] },
            ]),
        },
        "Add disponibility"
      )
    )
  );
};

export default Disponibilities;

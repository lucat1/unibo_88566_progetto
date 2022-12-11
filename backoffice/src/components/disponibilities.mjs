import { h } from "../h";

const Disponibilities = (data) => {
  return h(
    "div",
    { className: "field my-2" },
    h("label", { for: "price", className: "label" }, "Disponibilities"),
    data?.disponibilities?.length == 0 ? "No disponibilities yet." : null,
    h(
      "div",
      {
        className:
          "mt-4 is-flex is-flex-direction-row is-align-items-center is-justify-content-center",
      },
      data?.disponibilities?.map((disponibility) =>
        h(
          "div",
          { className: "card" },
          h("div", { className: "card-content" }, disponibility.name)
        )
      )
    )
  );
};

export default Disponibilities;

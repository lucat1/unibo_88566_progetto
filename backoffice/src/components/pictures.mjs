import { h, useState } from "../h";

const Pictures = ({ pictures, extra, extraIcon }) => {
  const [selected, setSelected] = useState(0);
  const select = (index) => (e) => {
    e.preventDefault();
    setSelected(index);
  };

  return h(
    "div",
    { className: "is-flex is-flex-direction-column container is-max-desktop" },
    h(
      "div",
      { className: "card" },
      h(
        "div",
        { className: "card-image" },
        h(
          "figure",
          { className: "image is-square" },
          pictures.length - 1 >= selected
            ? h("img", { src: pictures[selected] })
            : h(
                "div",
                {
                  className:
                    "has-ratio is-flex is-flex-direction-column is-align-items-center is-justify-content-center",
                },
                extra
              )
        )
      )
    ),
    h(
      "div",
      {
        className:
          "is-flex is-flex-direction-row is-align-items-center is-justify-content-center p-4",
      },
      pictures.map((picture, i) =>
        h(
          "a",
          { onClick: select(i) },
          h(
            "div",
            {
              key: i,
              className: "card mx-4",
              style: { width: "6rem", height: "6rem" },
            },
            h("div", { className: "card-image" }, h("img", { src: picture }))
          )
        )
      ),
      extra &&
        extraIcon &&
        h(
          "a",
          { onClick: select(pictures.lenght + 1) },
          h(
            "div",
            {
              className:
                "card mx-4 is-flex is-align-items-center is-justify-content-center p-2",
              style: { width: "6rem", height: "6rem" },
            },
            extraIcon
          )
        )
    )
  );
};

export default Pictures;

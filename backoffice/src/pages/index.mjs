import { h } from "../h";
import { Link } from "../router";

const pages = ["Categories", "Products", "Pets", "Stores"];

const Index = () =>
  h(
    "div",
    {
      className: "container",
    },
    h(
      "aside",
      {
        className: "menu",
      },
      h(
        "p",
        {
          className: "menu-label",
        },
        "Backoffice"
      ),
      h(
        "ul",
        {
          className: "menu-list",
        },
        pages.map((product, i) =>
          h(
            "li",
            {},
            h(
              Link,
              {
                key: i,
                to: `/${product.toLowerCase()}`,
              },
              product
            )
          )
        )
      )
    )
  );

export default Index;

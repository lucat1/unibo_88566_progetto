import { h } from "../h";
import { Link } from "../router";

import Pagination from "../components/pagination";

const Users = () =>
  h(
    "div",
    { className: "menu" },
    h("p", { className: "menu-label" }, "Users"),
    h(
      Pagination,
      {
        url: (page) => `users?page=${page}&limit=20`,
        className: "is-flex is-flex-direction-row is-flex-wrap-wrap",
      },
      (user, i) =>
        h(
          Link,
          {
            to: `/users/${user._id}`,
            key: i,
            className: "m-4",
          },
          h(
            "div",
            { className: "card is-flex is-flex-direction-row" },
            user.avatar
              ? h("img", {
                  className: "is-square",
                  style: {
                    "object-fit": "cover",
                    "max-height": "5rem",
                    "border-top-left-radius": "5%",
                    "border-bottom-left-radius": "5%",
                  },
                  src: user.avatar,
                  alt: `${user.username} main image`,
                })
              : null,
            h(
              "div",
              { className: "card-content" },
              h(
                "div",
                { className: "media" },
                h(
                  "div",
                  { className: "media-content" },
                  h("p", { className: "title is-4" }, user.username)
                )
              )
            )
          )
        )
    )
  );

export default Users;

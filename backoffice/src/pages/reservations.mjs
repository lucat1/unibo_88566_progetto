import { h, useState } from "../h";

import fetch, { withOptions } from "shared/fetch";
import { navigate } from "../router";

import Pagination from "../components/pagination";

const Reservations = ({ service_id }) => {
  const [loading, setLoading] = useState(false),
    [id, setId] = useState(0),
    [err, setErr] = useState(null),
    del = (reservation_id) => async (e) => {
      e.preventDefault();
      setLoading(true);
      setErr(null);
      try {
        await fetch(
          `store/appointments/${reservation_id}`,
          withOptions("DELETE")
        );
        navigate(`/services/${service_id}`);
      } catch (err) {
        setErr("Error while deleting: " + (err.message || "Unknown error"));
      }
      setLoading(false);
      setId(id + 1);
    };

  return h(
    "main",
    {},
    h(
      "div",
      { className: "menu my-4" },
      h(
        "div",
        {
          className:
            "is-flex is-flex-direction-row is-justify-content-space-between py-2",
        },
        h("p", { className: "menu-label" }, "Reservations")
      ),
      err && h("div", { className: "notification is-danger" }, err),
      h(
        Pagination,
        {
          url: (page) =>
            `store/appointments/${service_id}?page=${page}&limit=20`,
          className: "is-flex is-flex-direction-column",
          id: id,
        },
        (reservation, _) =>
          h(
            "div",
            { className: "card" },
            h(
              "div",
              { className: "card-content" },
              h(
                "div",
                { className: "content" },
                h(
                  "p",
                  {},
                  reservation.customer.username || "No description provided"
                ),
                h(
                  "button",
                  {
                    className: "button is-danger",
                    action: "none",
                    onClick: del(reservation._id),
                    disabled: loading,
                  },
                  "Delete"
                )
              )
            )
          )
      )
    )
  );
};

export default Reservations;

import { h, useState } from "../h";

import fetch, { withOptions } from "shared/fetch";
import { navigate } from "../router";

import Pagination from "../components/pagination";

const Appointments = ({ service_id }) => {
  const [loading, setLoading] = useState(false),
    [id, setId] = useState(0),
    [err, setErr] = useState(null),
    del = (appointment_id) => async (e) => {
      e.preventDefault();
      setLoading(true);
      setErr(null);
      try {
        await fetch(
          `store/appointments/${appointment_id}`,
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
      err && h("div", { className: "notification is-danger" }, err),
      h(
        Pagination,
        {
          url: (page) =>
            `store/appointments/?service=${service_id}?page=${page}&limit=20&sort=minutes&order=1`,
          className: "is-flex is-flex-direction-column",
          id: id,
        },
        (appointment, _) =>
          h(
            "div",
            { className: "card" },
            h(
              "header",
              { className: "card-header" },
              h(
                "p",
                { className: "card-header-title" },
                h(
                  "a",
                  { href: `/users/${appointment.customer._id}` },
                  `${appointment.customer.firstName} ${appointment.customer.lastName} (@${appointment.customer.username})`
                )
              ),
              h(
                "div",
                { className: "card-content" },
                h(
                  "div",
                  { className: "content" },
                  `${appointment.calendar}, ${new Date(
                    appointment.minutes
                  ).toLocaleString("en-US")}`
                )
              ),
              h(
                "footer",
                { className: "card-footer" },
                h(
                  "a",
                  {
                    className: "card-footer-item",
                  },
                  h(
                    "button",
                    {
                      action: "none",
                      className: "button is-danger",
                      onClick: del(appointment._id),
                      disabled: loading,
                    },
                    "Delete"
                  )
                )
              )
            )
          )
      )
    )
  );
};

export default Appointments;

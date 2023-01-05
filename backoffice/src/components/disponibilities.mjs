import { h } from "../h";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
],
  sampleTimeWindow = "9:00-13:00,14:00-18:00";

function stringToWindows(str) {
  let hours = [...str.matchAll(/(2[0-3]|[01]?[0-9])(:([0-5]?[0-9]))?/g)]
    .map(
      (match) =>
        parseInt(match[1]) * 60 +
        Math.floor(parseInt(match[3] ? match[3] : "0") / 30) * 30
    )
    .sort((a, b) => a - b),
    res = [];
  for (let i = 0; i < hours.length - 1; i += 2)
    res.push([hours[i], hours[i + 1]]);
  return res;
}

const toTwoDigits = (number) => (number < 10 ? "0" + number : number);

const minutesToTime = (minutes) =>
  `${toTwoDigits(Math.floor(minutes / 60))}:${toTwoDigits(minutes % 60)}`;

const windowsToString = (windows) =>
  windows
    .map(
      (window) => minutesToTime(window.from) + "-" + minutesToTime(window.to)
    )
    .join(",");

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
              // Name
              h(
                "label",
                { for: "disponibility-name" + i, className: "label" },
                "Name",
                h(
                  "div",
                  { className: "control" },
                  h("input", {
                    id: "disponibility-name-" + i,
                    className: "input",
                    value: disponibility.name ? disponibility.name : "",
                    onchange: (e) => {
                      disponibility.name = e.target.value;
                      setDisponibilities[0](disponibilities);
                    },
                  })
                )
              ),
              // Slot Duration
              h(
                "label",
                { for: "slot-duration-" + i, className: "label" },
                "Slot duration (minutes)",
                h(
                  "div",
                  { className: "control" },
                  h("input", {
                    id: "slot-duration-" + i,
                    className: "input my-2",
                    type: "number",
                    min: "30",
                    max: "1440",
                    step: "30",
                    value: disponibility.slotDuration
                      ? disponibility.slotDuration
                      : "60",
                    onchange: (e) => {
                      disponibility.slotDuration = e.target.value;
                      setDisponibilities[0](disponibilities);
                    },
                  })
                )
              ),
              // Time windows
              days.map((day, day_index) =>
                h(
                  "label",
                  { for: "window-" + i + "-" + day_index, className: "label" },
                  day,
                  h("input", {
                    id: "window-" + i + "-" + day_index,
                    className: "input",
                    value: sampleTimeWindow,
                    placeholder: sampleTimeWindow,
                    onchange: (e) => {
                      disponibility.intervals = days.flatMap((_, day_index) =>
                        stringToWindows(
                          document.getElementById(
                            "window-" + i + "-" + day_index
                          ).value
                        ).map((interval) => ({
                          dayOfWeek: day_index,
                          from: interval[0],
                          to: interval[1],
                        }))
                      );
                      setDisponibilities[0](disponibilities);
                      e.target.value = windowsToString(
                        disponibility.intervals.filter(
                          (interval) => interval.dayOfWeek == day_index
                        )
                      );
                    },
                  })
                )
              ),
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

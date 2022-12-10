import { h, useState, useEffect } from "../h";
import req from "../async";
import fetch from "shared/fetch";

/**
 * Pagination response
 * @typedef {Object} Pagination
 * @property {Array} docs - List of items in the page
 * @property {number} total - Total number of items in the whole collection
 * @property {number} limit - Number of items in the current page
 * @property {number} page - Index of the current page
 * @property {number} pages - Number of pages for the collection with the given limit
 * @property {number} id - The id of the request
 */

const Pagination = (
  { url, ele, subele, pre, around, className, style, id },
  children
) => {
  const [page, setPage] = useState(1);
  const [max, setMax] = useState(10);
  const { data, loading, err } = req(url(page), fetch, {}, id || 0);
  useEffect(() => {
    if (data && max != data.pages) setMax(data.pages);
  }, [data, max, setMax]);
  const min = Math.max(1, page - 5);
  const pages = Array.from({ length: max - min + 1 }).map((_, i) => min + i);

  return h(
    ele || "div",
    {},
    loading
      ? h("progress", { className: "progress is-primary" })
      : err
      ? h("div", { className: "notification is-danger" }, "Error: ", err)
      : h(
          subele || "div",
          { className, style },
          pre,
          around
            ? h(
                around,
                null,
                data.docs.map((doc, i) => children[0](doc, i))
              )
            : data.docs.map((doc, i) => children[0](doc, i))
        ),
    h(
      "div",
      {
        className:
          "mt-4 is-flex is-flex-direction-row is-align-items-center is-justify-content-center",
      },
      pages.map((index) =>
        h(
          "button",
          {
            key: index,
            className: "button" + (index == page ? " is-active" : ""),
            onClick: () => {
              if (index != page) setPage(index);
            },
          },
          index
        )
      )
    )
  );
};

export default Pagination;

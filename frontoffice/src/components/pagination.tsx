import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import fetch from "shared/fetch";

interface PaginationProps<T> {
  url: (page: number) => string;
  resource: (page: number) => any[];
  children: (data: T, index: number) => JSX.Element;
  ele?: string;
  child?: string;
  pre: JSX.Element;
  className?: string;
}

const Pagination: React.FC<
  Omit<React.HTMLProps<HTMLDivElement>, "children"> & PaginationProps<any>
> = ({ url, resource, ele, child, className, style, pre, children }) => {
  const [page, setPage] = React.useState(1);
  const [max, setMax] = React.useState(10);
  const { data, isLoading, isError, error } = useQuery(resource(page), () =>
    fetch<any>(url(page))
  );
  React.useEffect(() => {
    if (data && max != data.pages) setMax(data.pages);
  }, [data, max, setMax]);
  const min = Math.max(1, page - 5);
  const pages = Array.from({ length: max - min + 1 }).map((_, i) => min + i);
  const Ele = (ele || "div") as any;
  const Child = (child || React.Fragment) as any;
  return (
    <>
      <Ele className={className} style={style as any}>
        {isLoading ? (
          <progress className="progress is-info" />
        ) : isError ? (
          <div className="notification is-danger">
            <>Error: {error.message}</>
          </div>
        ) : (
          <>
            {pre}
            <Child>
              {data.docs.map((doc: any, i: number) => children(doc, i))}
            </Child>
          </>
        )}
      </Ele>
      <div className="my-4 is-flex is-flex-direction-row is-align-items-center is-justify-content-center">
        {pages.map((index) => (
          <button
            key={index}
            className={`button ${index == page ? " is-active" : ""}`}
            style={{ margin: "0 .25rem" }}
            onClick={() => index != page && setPage(index)}
          >
            {index}
          </button>
        ))}
      </div>
    </>
  );
};

export default Pagination;

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import fetch from "shared/fetch";

interface PaginationProps<T> {
  url: (page: index) => string;
  resource: (page: index) => any[];
  children: (data: T, index: number) => JSX.Element;
  ele?: string;
  className?: string;
}

const Pagination: React.FC<PaginationProps<any>> = ({
  url,
  resource,
  ele,
  className,
  children,
}) => {
  const [page, setPage] = React.useState(1);
  const [max, setMax] = React.useState(10);
  const { data, isLoading, isError, error } = useQuery(resource(page), () =>
    fetch(url(page))
  );
  React.useEffect(() => {
    if (data && max != data.pages) setMax(data.pages);
  }, [data, max, setMax]);
  const min = Math.max(1, page - 5);
  const pages = Array.from({ length: max - min + 1 }).map((_, i) => min + i);
  const Ele = ele || "div";
  return (
    <Ele>
      {isLoading ? (
        <progress className="progress is-primary" />
      ) : isError ? (
        <div className="notification is-danger">Error: {error}</div>
      ) : (
        <div className={className}>
          {data.docs.map((doc, i) => children(doc, i))}
        </div>
      )}
      <div className="mt-4 is-flex is-flex-direction-row is-align-items-center is-justify-content-center">
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
    </Ele>
  );
};

export default Pagination;

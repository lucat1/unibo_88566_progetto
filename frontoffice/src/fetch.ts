import originalSwr from "swr";
import fetch from "shared/fetch";
import type { Error } from "shared/fetch";

const swr = <T = Object, E>(resource: string, opts?: RequestInit) => {
  const fetcher = <T>(resource: string, opts: RequestInit | undefined) =>
    fetch<T>(resource, opts);

  return originalSwr<T, Error<E>, [string, RequestInit | undefined]>(
    [resource, opts],
    fetcher<T>,
    {
      suspense: true,
    }
  );
};

export default swr;

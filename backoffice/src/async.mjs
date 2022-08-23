import { useEffect, useState } from "./h";

const req = (resource, fetcher = fetch, init = {}) => {
  const [err, setErr] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    fetcher(resource, init).then(setData, setErr);
  }, [resource]);
  return { data, err, loading: data == null && err == null };
};

export default req;

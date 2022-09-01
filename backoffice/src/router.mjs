import { h, useEffect } from "./h";
import { createContext, useContext } from "./ctx";
import { BACKOFFICE_ENDPOINT } from "shared/endpoints";

// Having a context would be much safer (and could allow for nested routers)
export const urlContext = createContext(window.location.pathname);
const baseURL = BACKOFFICE_ENDPOINT.includes("unibo.it") ? "/backoffice" : "";

/**
 * The children props
 * @typedef {Array.VNode} Children
 */

/**
 * The router component. Only acceps h(Routes, ...) as children.
 * @param {{ element: Children, path: string | RegExp }} props The component props
 * @return {VNode} The matched route;
 */
export const Route = ({ element }) => {
  return element;
};

const match = (expr, url) =>
  typeof expr == "string" ? url.startsWith(expr) : expr.test(url);

export const resolveURL = (url) => (url.startsWith("/") ? baseURL + url : url);

/**
 * Navigate to a url
 * @param {string} url The url to navigate to
 */
export const navigate = (url) => {
  const rurl = resolveURL(url);
  window.history.pushState("", null, rurl);
  urlContext.set(rurl);
};

/**
 * Move back one navigation step
 */
export const back = window.history.back.bind(window.history);

/**
 * Redirect to a url (replacing the previous history item)
 * @param {string} url The url to redirect to
 */
export const redirect = (url) => {
  const rurl = resolveURL(url);
  window.history.replaceState("", null, rurl);
  urlContext.set(rurl);
};

/**
 * The router component. Only acceps h(Routes, ...) as children.
 * @param {Object} props The component props
 * @param {Children} children The component children
 * @return {VNode} The matched route;
 */
export const Router = (_, children) => {
  for (const child of children)
    if (child.tag != Route)
      throw new TypeError("Router acceps only some Route(s) as children");

  const [url, setUrl] = useContext(urlContext);
  useEffect(() => {
    const handlePop = (_) => setUrl(window.location.pathname);

    window.addEventListener("popstate", handlePop);
    return () => {
      window.removeEventListener("popstate", handlePop);
    };
  }, [setUrl]);
  const route = children.filter((route) =>
    match(route.props.path, url.replace(baseURL, ""))
  );

  if (route.length > 0) return route[0];
  else return null;
};

export const Link = ({ to, as, ...props }, children) => {
  return h(
    as || "a",
    {
      ...props,
      href: to,
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(to);
      },
    },
    children
  );
};

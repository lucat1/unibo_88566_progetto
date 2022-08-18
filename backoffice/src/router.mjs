import { h, useEffect } from "./h";
import { createContext, useContext } from "./ctx";

// Having a context would be much safer (and could allow for nested routers)
const urlContext = createContext(window.location.pathname);

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

/**
 * Navigate to a url
 * @param {string} url The url to navigate to
 */
export const navigate = (url) => {
  window.history.pushState("", null, url);
  urlContext.set(url);
};

/**
 * Redirect to a url (replacing the previous history item)
 * @param {string} url The url to redirect to
 */
export const redirect = (url) => {
  window.history.replaceState("", null, url);
  urlContext.set(url);
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
  // console.log(url);
  useEffect(() => {
    const handlePop = (_) => {
      console.log("pop");
      setUrl(window.location.pathname);
    };
    console.log("add");
    window.addEventListener("popstate", handlePop);

    return () => {
      console.log("del");
      window.removeEventListener("popstate", handlePop);
    };
  }, [setUrl]);
  const route = children.filter((route) => match(route.props.path, url));

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
        navigate(to);
      },
    },
    children
  );
};

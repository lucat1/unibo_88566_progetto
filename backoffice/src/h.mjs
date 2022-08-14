/**
 * The type for a FunctionalComponent a-la react. Not exactly a callback but
 * it's the closest thing JSDoc provides.
 * @callback FunctionalComponent
 * @param {object} props An object of props for the element.
 * @param {Element} children A list of or single virtual dom child.
 * @return {Element} The generated virtual dom strucutre
 */

/**
 * A virtual dom element tag.
 * @typedef {(string | FunctionalComponent)} VTag
 */

/**
 * A virtual dome node.
 * @typedef VNode
 * @type {object}
 * @type {VTag} tag The virtual node tag.
 * @type {object} props An object of HTML props.
 * @type {(VNode|Array.VNode)} children A list or single VNode(s) child(ren).
 */

/**
 * A type of all possible virtual element types.
 * @typedef Element
 * @type {(Stitring | VNode | Array.Children)}
 */

/**
 * The children props
 * @typedef {Array.VNode} Children
 */

/**
 * Creates a virtual dom node for the given element/props combination.
 * @param {VTag} tag
 * @param {object} props An object of HTML props.
 * @param {Element} children A list or single VNode(s) child(ren).
 * @return {VNode} The generated virtual node.
 */
export const h = (tag, props, ...children) => ({ tag, props, children });

const listen = (ele, event, handler) => {
  ele.__listeners = (ele.__listeners || []).concat({ event, handler });
  ele.addEventListener(event, handler);
};

const unlinsten = (ele) => {
  (ele.__listeners || []).forEach(({ event, handler }) =>
    ele.removeEventListener(event, handler)
  );
  ele.__listeners = [];
};

let forceRender, hooks, hooksIndex;

/**
 * Renders a virtual dom structure into a DOM element.
 * @param {Element} vnode The virtual dom node.
 * @param {HTMLElement} root The DOM root target.
 */
export const render = (vnode, root) => {
  const currentHooks = root.__hooks || {};
  root.__hooks = {};
  const ids = {};
  const vlist = []
    .concat(vnode)
    .filter((child) => child != null && child != undefined)
    .flat();

  /* TODO: diff event handlers just like hooks */
  vlist.forEach((child, i) => {
    forceRender = () => render(vlist, root);
    while (typeof child.tag == "function") {
      const key =
        (child.props && child.props.key) ||
        "" + child.tag + (ids[child.tag] = (ids[child.tag] || 0) + 1);
      hooks = currentHooks[key] || [];
      hooksIndex = 0;
      child = child.tag(child.props, child.children);
      root.__hooks[key] = hooks;
      if (!child)
        throw new TypeError(
          "You lickely forgot to return from one of you components"
        );
    }
    let node = root.childNodes[i];
    if (
      !node ||
      (child.tag
        ? node.__tag !== child.tag
        : typeof node.textContent == "undefined")
    )
      node = root.insertBefore(
        child.tag
          ? document.createElement(child.tag)
          : document.createTextNode(child),
        node
      );
    else unlinsten(node);
    if (child.tag) {
      node.__tag = child.tag;
      for (const key in child.props)
        if (key == "className") node.setAttribute("class", child.props[key]);
        else if (key == "style" && typeof child.props[key] == "object")
          for (const k in child.props[key]) node.style[k] = child.props[key][k];
        else if (key.startsWith("on") && typeof child.props[key] == "function")
          listen(node, key.replace(/^on/, "").toLowerCase(), child.props[key]);
        else if (typeof child.props[key] == "boolean")
          node.toggleAttribute(key, child.props[key]);
        else node.setAttribute(key, child.props[key]);

      if (child.children) render(child.children, node);
    } else if (node.textContent != child) node.textContent = child;
  });

  Object.values(root.__hooks).forEach((hooks) =>
    hooks.forEach(
      (h) => h.callback && ((h.cleanup = h.callback()), (h.callback = false))
    )
  );

  // if (!root.__hooks[element])
  for (const element in currentHooks)
    if (root.__hooks[element])
      currentHooks[element].map((h) => {
        h.cleanup && h.cleanup();
      });

  /* Remove hooks from any unmounted component */
  let child;
  while ((child = root.childNodes[vlist.length]))
    render([], root.removeChild(child));
  /* Prevent unwanted behaviour */
  forceRender = null;
  hooks = [];
};

/* Internal use only: Creates an hook object and on re-renders returns the same value */
export const getHook = (value) => {
  let hook = hooks[hooksIndex++];
  if (!hook) {
    hook = { value };
    hooks.push(hook);
  }
  return hook;
};

/**
 * The type for a FunctionalComponent a-la react. Not exactly a callback but
 * it's the closest thing JSDoc provides.
 * @callback Reducer
 * @param {*} state The previous state.
 * @param {string} action The action to execute in order to modify the state.
 * @return {*} The next state.
 */

/**
 * Akin to react's useReducer hook.
 * @function
 * @param {Reducer} reducer The transition function.
 * @param {*} initial The store initial state.
 * @returns {Array} [state, (action) => void] The state current value and a dispatch function to execute actions.
 * state.
 */
export const useReducer = (reducer, initial) => {
  const hook = getHook(initial);
  const update = forceRender;
  const dispatch = (action) => {
    hook.value = reducer(hook.value, action);
    update();
  };
  return [hook.value, dispatch];
};

/**
 * Use a local state which can be updated alongside the component.
 * @function
 * @param initial The initial state value.
 * @returns {Array} [state, (update) => void] The current state and an update function.
 */
export const useState = (initial) => useReducer((_, v) => v, initial);

const changed = (a, b) => !a || b.some((arg, i) => arg !== a[i]);

/**
 * Provides a callback to insert additional side-effects at two key component lifecycle stages:
 * - upon mounting the provided function will be called.
 * - upon unmounting if the provided function returned a callback it shall be called.
 * Additionally the mounting call can be executed only when the given parameters change.
 *
 * @function
 * @param {function} callback - The callback to be executed upon mounting.
 * @param {Array} watch - An array of identifiers to watch changes for.
 * are modified - callback is evaluated on the next render.
 */
export const useEffect = (callback, watch = []) => {
  const hook = getHook();
  if (changed(hook.value, watch)) {
    hook.value = watch;
    hook.callback = callback;
  }
};

export default h;

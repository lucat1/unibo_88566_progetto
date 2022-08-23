import { useState, useEffect } from "./h";

export const createContext = (init) => {
  let mitt = [];
  let val = init;

  return {
    val() {
      return val;
    },
    set(v) {
      val = v;
      mitt.forEach((f) => f());
    },
    on(fn) {
      mitt.push(fn);
    },
    off(fn) {
      mitt = mitt.filter((f) => f != fn);
    },
  };
};

export const useContext = (ctx) => {
  const [val, setVal] = useState(ctx.val());
  useEffect(() => {
    const handler = () => setVal(ctx.val());

    ctx.on(handler);
    return () => ctx.off(handler);
  }, [ctx, setVal]);
  return [val, ctx.set];
};

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
      console.log("(on) len", mitt.length);
      mitt.push(fn);
    },
    off(fn) {
      console.log("(off) len", mitt.length);
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
  }, [setVal]);
  return [val, ctx.set];
};

import { useState, useEffect } from "./h";

export const createContext = (init) => {
  let mitt = [];
  let val = init;

  const emit = () => mitt.forEach((f) => f());

  return {
    val() {
      return val;
    },
    set(v) {
      val = v;
      emit();
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

    console.log("add1");
    ctx.on(handler);
    return () => {
      console.log("del1");
      ctx.off(handler);
    };
  }, [setVal]);
  return [val, ctx.set];
};

import { h } from "../h";

import { navigate } from "../router";
import { useContext } from "../ctx";
import { user as userContext } from "../ctxs";

const Category = () => {
  if (!useContext(userContext)[0]) navigate("/");

  const id = parseInt(
    window.location.pathname.match(/^\/categories\/(\d+)$/)[1]
  );
  console.log(id);
  return h("h1", {}, "category #", id);
};

export default Category;

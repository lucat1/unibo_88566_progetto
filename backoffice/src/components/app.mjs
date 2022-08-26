import { h, useEffect } from "../h";
import { redirect, urlContext } from "../router";
import { useContext } from "../ctx";
import { user as userContext } from "../ctxs";

const Index = () => {
  const [user] = useContext(userContext);
  const [url] = useContext(urlContext);
  useEffect(() => {
    if (!user && url != "/login") redirect("/login");
  }, [user, url]);

  return h("div", {});
};

export default Index;

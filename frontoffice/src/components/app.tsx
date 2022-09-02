import * as React from "react";
import { isAuthenticated } from "shared/auth";

import { useAuth } from "../auth";
import Nav from "./nav";

const App: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [auth, setAuth] = useAuth();
  React.useEffect(() => {
    if (auth.user == null && isAuthenticated()) setAuth(true);
  }, []);

  return (
    <>
      <Nav />
      <React.Suspense fallback={<h1>loading...</h1>}>{children}</React.Suspense>
    </>
  );
};

export default App;

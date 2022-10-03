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
      <main style={{ flex: 1 }} className="m-5">
        <React.Suspense fallback={<progress className="progress is-primary" />}>
          {children}
        </React.Suspense>
      </main>
    </>
  );
};

export default App;

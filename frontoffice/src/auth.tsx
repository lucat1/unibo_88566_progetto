import * as React from "react";
import fetch from "shared/fetch";
import type { IUser } from "shared/models/user";

export type AuthValue =
  | {
      authenticated: true;
      user: IUser;
    }
  | {
      authenticated: false;
      user: null;
    };

export type AuthContext = [AuthValue, (logged: boolean) => void];

const DEFAULT_VALUE = { authenticated: false, user: null } as AuthValue;

const AuthContext = React.createContext<AuthContext>([
  DEFAULT_VALUE,
  void 0 as any,
]);

const AuthContextFetcher: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [value, setValue] = React.useState<AuthValue>(DEFAULT_VALUE);
  const logged = React.useCallback(
    (logged: boolean) => {
      if (logged) {
        fetch<IUser>("auth/me").then(
          (user) => setValue({ authenticated: true, user }),
          (_) => setValue({ authenticated: false, user: null })
        );
      } else {
        setValue({ authenticated: false, user: null });
      }
    },
    [setValue]
  );

  return (
    <AuthContext.Provider value={[value, logged]}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => (
  <React.Suspense fallback={<> </>}>
    <AuthContextFetcher> {children} </AuthContextFetcher>
  </React.Suspense>
);

export const useAuth = () => React.useContext(AuthContext);

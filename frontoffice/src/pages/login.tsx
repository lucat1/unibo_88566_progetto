import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import fetch, { Error, withOptions } from "shared/fetch";
import { setAuthToken } from "shared/auth";

import { useAuth } from "../auth";

interface FormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  if (auth.authenticated) navigate("/", { replace: true });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const login = async ({ username, password }: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const { token } = await fetch<{ token: string }>(
        "auth/login",
        withOptions("POST", { username, password })
      );
      setAuthToken(token);
      setAuth(true);
      navigate("/");
    } catch (err) {
      setError(
        (err as Error<any>).message || "Invalid username/password combination"
      );
    }
    setLoading(false);
  };

  return (
    <div className="center h-full">
      <form onSubmit={handleSubmit(login)} className="box">
        <h1 className="title">Login</h1>
        <div className="field">
          <label htmlFor="username" className="label">
            Username
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              id="username"
              disabled={loading}
              {...register("username", { required: true })}
            />
          </div>
          {errors.username && (
            <span className="help is-danger">Username is required</span>
          )}
        </div>
        <div className="field">
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="control">
            <input
              className="input"
              type="password"
              id="password"
              disabled={loading}
              {...register("password", { required: true })}
            />
          </div>
          {errors.password && (
            <span className="help is-danger">Password is required</span>
          )}
        </div>
        {error && <span className="help is-danger">{error}</span>}
        <div className="field">
          <div className="control">
            <button className="button is-link" disabled={loading}>
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;

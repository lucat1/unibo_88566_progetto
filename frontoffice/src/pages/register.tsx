import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import fetch, { Error, withOptions } from "shared/fetch";
import { setAuthToken, getUUID, removeUUID } from "shared/auth";
import { getPets, removePets } from "shared/pets";

import { useAuth } from "../auth";

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  if (auth.authenticated) navigate("/", { replace: true });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const login = async ({
    username,
    password,
    firstName,
    lastName,
  }: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const { token } = await fetch<{ token: string }>(
        "auth/register",
        withOptions("POST", {
          username,
          password,
          firstName,
          lastName,
          fromuuid: getUUID(),
          frompets: getPets(),
        })
      );
      removeUUID();
      removePets();
      setAuthToken(token);
      setAuth(true);
      navigate("/");
    } catch (err) {
      setError((err as Error<any>).message || "Unkown error while registering");
    }
    setLoading(false);
  };

  return (
    <div className="center h-full">
      <form onSubmit={handleSubmit(login)} className="box">
        <h1 className="title">Sign up</h1>
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
          <label htmlFor="firstName" className="label">
            First Name
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              id="firstName"
              disabled={loading}
              {...register("firstName", { required: true })}
            />
          </div>
          {errors.firstName && (
            <span className="help is-danger">A first name is required</span>
          )}
        </div>
        <div className="field">
          <label htmlFor="lastName" className="label">
            Last Name
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              id="lastName"
              disabled={loading}
              {...register("lastName")}
            />
          </div>
          {errors.lastName && (
            <span className="help is-danger">Invalid last name</span>
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
        <div className="field">
          <label htmlFor="confirmPassword" className="label">
            Confirm password
          </label>
          <div className="control">
            <input
              className="input"
              type="password"
              id="confirmPassword"
              disabled={loading}
              {...register("confirmPassword", {
                required: true,
                validate: (val: string) =>
                  watch("password") != val
                    ? "Your passwords do no match"
                    : undefined,
              })}
            />
          </div>
          {errors.confirmPassword && (
            <span className="help is-danger">
              {errors.confirmPassword.message ||
                "Invalid confirmation password"}
            </span>
          )}
        </div>
        {error && <span className="help is-danger">{error}</span>}
        <div className="field">
          <div className="control">
            <button className="button is-link" disabled={loading}>
              Sign up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;

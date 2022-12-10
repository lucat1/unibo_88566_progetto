import * as React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import fetch, { withOptions } from "shared/fetch";
import type { IUser } from "shared/models/user";

import { useAuth } from "../auth";

interface PasswordProps {
  id: string;
}

interface PasswordForm {
  password: string;
  confirm: string;
}

const Password: React.FC<PasswordProps> = ({ id }) => {
  const [{ authenticated, user }] = useAuth();
  const patchPassword = ({ password }: PasswordForm) =>
    fetch<IUser>("auth/password", withOptions("PATCH", { password }));
  const { isLoading, isError, error, mutate } = useMutation(patchPassword);
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<PasswordForm>();
  if (!authenticated || user!._id != id) return null;

  return (
    <div className="is-flex is-flex-direction-column my-6">
      <h2 className="title my-3">Change password</h2>
      <form
        onSubmit={handleSubmit(async (data) => {
          mutate(data);
          reset();
        })}
      >
        <div className="is-flex is-flex-direction-column">
          <div>
            <input
              className="input"
              placeholder="Password"
              aria-label="Password"
              type="password"
              id="password"
              disabled={isLoading}
              {...register("password", { required: true })}
            />
            {formErrors.password && (
              <span className="help is-danger">A password is required</span>
            )}
          </div>
          <div>
            <input
              className="input mt-4"
              placeholder="Confirm password"
              aria-label="Confirm password"
              type="password"
              id="confirm"
              disabled={isLoading}
              {...register("confirm", {
                required: true,
                validate: (val: string) => {
                  if (watch("password") != val) {
                    return "The password confirmation must match the new password";
                  }
                },
              })}
            />
            {formErrors.confirm && (
              <span className="help is-danger">
                {formErrors.confirm.message}
              </span>
            )}
          </div>

          <div
            className="mt-4 is-flex is-justify-content-end"
            style={{ width: "100%" }}
          >
            <button className="button is-danger" disabled={isLoading}>
              Change
            </button>
          </div>
        </div>
      </form>
      {isError && (
        <span className="help is-danger">
          Unexpected error while updating password: {error}
        </span>
      )}
    </div>
  );
};

export default Password;

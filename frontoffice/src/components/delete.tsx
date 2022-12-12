import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import fetch, { withOptions } from "shared/fetch";
import type { IUser } from "shared/models/user";
import { removeAuthToken } from "shared/auth";

import { useAuth } from "../auth";

interface DeleteProps {
  id: string;
}

const Delete: React.FC<DeleteProps> = ({ id }) => {
  const [{ authenticated, user }, setAuth] = useAuth();
  const navigate = useNavigate();
  const deleteMe = async () => {
    await fetch<IUser>("auth/me", withOptions("DELETE"));
    removeAuthToken();
    setAuth(false);
  };
  const { isLoading, isError, error, mutate } = useMutation(deleteMe);
  if (!authenticated || user!._id != id) return null;

  return (
    <div className="is-flex is-flex-direction-column my-6">
      <h2 className="title my-3">DANGER: Delete your account</h2>

      <div className="mt-4 is-flex" style={{ width: "100%" }}>
        <button
          onClick={(_) => {
            mutate();
            navigate("/");
          }}
          className="button is-danger"
          disabled={isLoading}
        >
          Delete
        </button>
      </div>
      {isError && (
        <span className="help is-danger">
          Unexpected error while deleting your account: {error}
        </span>
      )}
    </div>
  );
};

export default Delete;

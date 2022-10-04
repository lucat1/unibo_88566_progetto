import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import fetch, { withOptions } from "shared/fetch";
import type { IUser } from "shared/models/user";
import { useAuth } from "../auth";
import File from "../components/file";

const User: React.FC = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data } = useQuery(["user", id], () => fetch<IUser>(`user/${id}`), {
    suspense: true,
  });
  const updateUser = async (user: Partial<IUser>) =>
    await fetch<IUser>("auth/me", withOptions("PATCH", user));
  const { isLoading, isError, error, mutate } = useMutation(updateUser, {
    onSuccess: (data: IUser) =>
      queryClient.setQueryData(["user", data._id], data),
  });
  const [{ authenticated, user }] = useAuth();
  const handleUpload = (url: string) => {
    mutate({
      avatar: url,
    });
  };

  return (
    <main className="columns">
      <section className="column is-one-third">
        <div className="is-flex is-flex-direction-column container is-max-desktop">
          <div className="card">
            <div className="card-image">
              <figure className="image is-square">
                {user?.avatar ? (
                  <img
                    src={user?.avatar}
                    style={{ objectFit: "cover" }}
                    alt={`${data?.username}'s profile picture`}
                  />
                ) : (
                  <div className="has-ratio is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
                    No profile picture
                  </div>
                )}
              </figure>
            </div>
          </div>
          <div className="mt-5 is-flex">
            {authenticated && data?._id == user?._id && (
              <File onUpload={handleUpload} />
            )}
            {isError && <span className="is-danger">{error as string}</span>}
          </div>
        </div>
      </section>
      <section className="column">
        <h2 className="is-size-3 has-text-weight-semibold">
          {data!.firstName} {data!.lastName}
        </h2>
        <span className="is-size-6">
          @{data?.username} · {data?.city}
        </span>
      </section>
    </main>
  );
};

export default User;

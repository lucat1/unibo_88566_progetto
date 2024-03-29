import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import fetch, { withOptions } from "shared/fetch";
import type { IUser } from "shared/models/user";

import { useAuth } from "../auth";
import File from "../components/file";
import Pets from "../components/pets";
import Favourites from "../components/favourites";
import Password from "../components/password";
import Delete from "../components/delete";

const User: React.FC = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data } = useQuery(["user", id], () => fetch<IUser>(`users/${id}`), {
    suspense: true,
  });
  const patchUser = (user: Partial<IUser>) =>
    fetch<IUser>("auth/me", withOptions("PATCH", user));
  const [editing, setEditing] = React.useState(false);
  const {
    isLoading,
    isError,
    error: mutationError,
    mutate,
  } = useMutation(patchUser, {
    onSettled: (_) => queryClient.invalidateQueries(["user", data!._id]),
  });
  const [{ authenticated, user }] = useAuth();
  const handleUpload = (url: string) => {
    mutate({
      avatar: url,
    });
  };
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<IUser>();

  const updateUser = (data: IUser) => {
    setEditing(false);
    mutate(data);
  };

  return (
    <div className="columns">
      <section className="column is-one-third">
        <div className="is-flex is-flex-direction-column container is-max-desktop">
          <div className="card">
            <div className="card-image">
              <figure className="image is-square">
                {data?.avatar ? (
                  <img
                    src={data?.avatar}
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
            {authenticated && user?._id == data?._id && (
              <File onUpload={handleUpload} />
            )}
            {isError && (
              <span className="help is-danger">{mutationError as string}</span>
            )}
          </div>
        </div>
      </section>
      <section className="column">
        <form onSubmit={handleSubmit(updateUser)}>
          <div className="is-flex is-flex-direction-row is-justify-content-space-between">
            <h2
              className="is-size-3 has-text-weight-semibold"
              aria-hidden={!editing}
              style={editing ? { display: "none" } : {}}
            >
              {data!.firstName} {data!.lastName}
            </h2>
            <div className="is-flex is-flex-direction-row">
              <div
                className="mx-2"
                aria-hidden={!editing}
                style={!editing ? { display: "none" } : {}}
              >
                <input
                  className="input"
                  placeholder="First Name"
                  aria-label="First Name"
                  type="text"
                  id="firstName"
                  defaultValue={data!.firstName}
                  disabled={isLoading}
                  {...register("firstName", { required: true })}
                />
                {formErrors.firstName && (
                  <span className="help is-danger">First Name is required</span>
                )}
              </div>
              <input
                aria-hidden={!editing}
                style={!editing ? { display: "none" } : {}}
                className="input mx-2"
                placeholder="Last Name"
                aria-label="Last Name"
                type="text"
                id="lastName"
                defaultValue={data!.lastName}
                disabled={isLoading}
                {...register("lastName")}
              />
            </div>
            <button
              type="button"
              className={`button ${!editing ? "is-success" : ""}`}
              aria-label="Edit profile"
              onClick={(_) => setEditing(!editing)}
            >
              <span className="icon is-small">
                <i
                  className={`fas ${editing ? "fa-x" : "fa-pen-to-square"}`}
                ></i>
              </span>
            </button>
          </div>
          <div className="is-size-6 mt-4 is-flex is-flex-direction-row is-align-items-center">
            <span>@{data?.username}</span> <span className="mx-2">·</span>{" "}
            {!editing ? (
              <>{data?.city || "World"}</>
            ) : (
              <input
                className="input"
                placeholder="City"
                aria-label="City"
                type="text"
                id="city"
                defaultValue={data!.city}
                disabled={isLoading}
                {...register("city")}
              />
            )}
          </div>
          {editing && (
            <div className="mt-4 is-flex is-justify-content-end">
              <button className="button is-success" disabled={isLoading}>
                Save
              </button>
            </div>
          )}
        </form>
        <Pets
          pets={data!.pets}
          id={data!._id}
          update={(pets) => mutate({ pets })}
          isLoading={isLoading}
        />
        <Favourites
          favourites={data!.favourites || []}
          id={data!._id}
          update={(favourites) => mutate({ favourites })}
          isLoading={isLoading}
        />
        {isError && (
          <span className="help is-danger">
            Unexpected error while updating: {mutationError}
          </span>
        )}
        <Password id={data!._id} />
        <Delete id={data!._id} />
      </section>
    </div>
  );
};

export default User;

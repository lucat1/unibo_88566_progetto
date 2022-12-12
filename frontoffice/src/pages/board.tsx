import * as React from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ImageGroup, Image } from "react-fullscreen-image";
import fetch, { withOptions } from "shared/fetch";
import type { IBoard, IPost } from "shared/models/board";

import { PicturesList } from "../components/pictures";
import Pagination from "../components/pagination";
import { useAuth } from "../auth";

// TODO: for some reason the picture data is stale from react-query

const BoardAdd: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IPost>();

  const queryClient = useQueryClient();
  const { data: board } = useQuery(
    ["boards", id],
    () => fetch<IBoard>(`community/boards/${id}`),
    { suspense: true }
  );
  const [photos, setPhotos] = React.useState<string[]>([]);
  const postMutation = useMutation({
    mutationFn: (post: IPost) =>
      fetch<IPost>(
        `community/boards/${id}`,
        withOptions("PUT", { ...post, photos })
      ),
    onSettled: (_) => queryClient.invalidateQueries(["boards", id]),
  });
  const postDeletion = useMutation({
    mutationFn: (post: IPost) =>
      fetch<IPost>(`community/boards/${id}/${post._id}`, withOptions("DELETE")),
    onSettled: (_) => queryClient.invalidateQueries(["boards", id]),
  });

  const del = async () => {
    await fetch(`community/boards/${id}`, withOptions("DELETE", {}));
    navigate("/boards");
  };

  return (
    <>
      <div className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center mb-4">
        <h1 className="title m-0">
          <Link className="is-hidden-touch" to="/boards">
            Boards
          </Link>
          <span className="is-hidden-touch"> {">"} </span>
          {board?.name}
        </h1>
        {auth.authenticated && auth.user?._id == board?.author._id && (
          <button
            className="button is-danger"
            onClick={del}
            aria-label="Delete board"
          >
            Delete
          </button>
        )}
      </div>
      <Pagination
        url={(page) => `community/boards/${id}?page=${page}`}
        resource={(page) => ["boards", id, "posts", page]}
        className="is-flex is-flex-direction-row is-flex-wrap-wrap"
      >
        {(post: IPost, i) => (
          <div key={i} className="columns" style={{ width: "100%" }}>
            <div className="column is-one-quarter is-flex is-flex-direction-row is-align-items-center is-size-5 has-text-weight-medium">
              <figure className="image is-64x64 mr-2">
                <img
                  style={{ objectFit: "cover", height: "100%", width: "100%" }}
                  src={post.author.avatar}
                  alt={`${post.author.username}'s profile picture`}
                />
              </figure>
              <Link to={`/users/${post.author._id}`} className="mr-2">
                {post.author.username}
              </Link>
              wrote
            </div>
            <div className="column">
              <article className="message" style={{ width: "100%" }}>
                <div className="is-flex is-flex-direction-row">
                  <div className="message-body" style={{ width: "100%" }}>
                    {post.message}

                    {auth.authenticated &&
                      auth.user?._id == post?.author._id && (
                        <button
                          style={{ float: "right" }}
                          className="delete"
                          onClick={(_) => postDeletion.mutate(post)}
                          aria-label="Delete post"
                        />
                      )}
                  </div>
                </div>
                {post.photos.length > 0 && (
                  <div className="p-4">
                    <ImageGroup>
                      <ul
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(12rem, 1fr))",
                          gridGap: "1rem",
                        }}
                      >
                        {post.photos.map((src, i) => (
                          <li
                            style={{ position: "relative", paddingTop: "66%" }}
                            key={i}
                          >
                            <Image
                              src={src}
                              alt={`Post's image number ${i}`}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </ImageGroup>
                  </div>
                )}
              </article>
            </div>
          </div>
        )}
      </Pagination>
      {auth.authenticated && (
        <div className="columns" style={{ width: "100%" }}>
          <div className="column is-one-quarter is-flex is-flex-direction-row is-align-items-center is-size-5 has-text-weight-medium">
            <figure className="image is-64x64 mr-2">
              <img
                style={{ objectFit: "cover", height: "100%", width: "100%" }}
                src={auth.user.avatar}
                alt={`${auth.user.username}'s profile picture`}
              />
            </figure>
          </div>
          <div className="column">
            <form
              onSubmit={handleSubmit((post) => {
                postMutation.mutate(post);
                reset();
                setPhotos([]);
              })}
            >
              <div className="field">
                <label htmlFor="message" className="label">
                  New post
                </label>
                <div className="control">
                  <textarea
                    className="input"
                    type="text"
                    disabled={postMutation.isLoading}
                    style={{ minHeight: "8rem" }}
                    {...register("message", { required: true })}
                  />
                </div>
                {errors.message && (
                  <span className="help is-danger">
                    A post message is required
                  </span>
                )}
              </div>
              <PicturesList
                pictures={photos}
                editable={true}
                select={(_) => {}}
                remove={(i) => setPhotos(photos.filter((_, j) => i != j))}
                add={(url) => setPhotos((pics) => [...pics, url])}
              />
              <div className="field">
                <div className="control">
                  <button
                    className="button is-link"
                    disabled={postMutation.isLoading}
                  >
                    Post
                  </button>
                </div>
              </div>
              {postMutation.error && (
                <span className="help is-danger">
                  Unexpected error while posting: {postMutation.error}
                </span>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BoardAdd;

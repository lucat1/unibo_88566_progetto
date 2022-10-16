import * as React from "react";
import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom";
import fetch, { withOptions } from 'shared/fetch'
import type { IBoard } from "shared/models/board";

import { useAuth } from "../auth";

const BoardAdd: React.FC = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  if (!auth.authenticated) navigate("/", { replace: true });

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<null | string>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IBoard & { post: string }>();
  const newBoard = async ({ name, post }: IBoard & { post: string }) => {
    setLoading(true)
    setError(false)
    try {
      const { _id } = await fetch<IBoard>(
        "community/boards",
        withOptions("PUT", { name })
      );
      await fetch<IBoard>(
        `community/boards/${_id}`,
        withOptions("PUT", { message: post })
      );
      navigate(`/boards/${_id}`);
    } catch (err: any) {
      setError(err.message || "An error occoured while creating the board");
    }
    setLoading(false)
  }
  return (
    <>
      <h1 className="title">New Board</h1>
      <form onSubmit={handleSubmit(newBoard)}>
        <div className="field">
          <label htmlFor="name" className="label">
            Title
          </label>
          <div className="control">
            <input
              className="input"
              type="text"
              id="name"
              disabled={loading}
              {...register("name", { required: true })}
            />
          </div>
          {errors.name && (
            <span className="help is-danger">A title is required</span>
          )}
        </div>
        <div className="field">
          <label htmlFor="post" className="label">
            First post
          </label>
          <div className="control">
            <textarea
              className="input"
              type="text"
              id="post"
              disabled={loading}
              style={{ minHeight: '8rem' }}
              {...register("post", { required: true })}
            />
          </div>
          {errors.post && (
            <span className="help is-danger">A first post is required</span>
          )}
        </div>
        {error && (
          <span className="help is-danger">
            {error}
          </span>
        )}
        <div className="field">
          <div className="control">
            <button className="button is-link" disabled={loading}>
              Create
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default BoardAdd;

import * as React from "react";
import { useForm } from "react-hook-form";
import { animalTypes } from "shared/pets";

import { useAuth } from "../auth";

export interface PetsProps {
  favourites: string[];
  id: string;
  update: (favourites: string[]) => void;
  isLoading: boolean;
}

const Favourites: React.FC<PetsProps> = ({
  favourites,
  id,
  update,
  isLoading,
}) => {
  const [{ authenticated, user }] = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<{ pet: string }>({ defaultValues: { pet: "Cat" } });

  const customOnAdd = ({ pet }: { pet: string }) => {
    update([...favourites, pet] as any);
  };

  return (
    <div className="is-flex is-flex-direction-column my-6">
      {((authenticated && user!._id == id) || favourites.length > 0) && (
        <h2 className="title my-3">
          {authenticated && user!._id == id ? "My" : "Their"} favorite animals
        </h2>
      )}
      {favourites.length > 0 && (
        <>
          {favourites.map((pet, i) => (
            <div
              key={i}
              className="is-flex is-flex-direction-row is-justify-content-space-between"
            >
              <h4 className="subtitle is-6">{pet}</h4>
              <button
                className="delete"
                aria-label={`Remove favourite animal: ${pet}`}
                onClick={(_) => update(favourites.filter((_, j) => j != i))}
              ></button>
            </div>
          ))}
        </>
      )}
      {authenticated && user!._id == id && (
        <>
          <h3 className="subtitle my-3">Add a new favourite animal</h3>
          <form onSubmit={handleSubmit(customOnAdd)}>
            <div className="is-flex is-flex-direction-column">
              <div className="select mt-4">
                <select
                  className="input"
                  placeholder="Animal type"
                  aria-label="Animal type"
                  id="type"
                  disabled={isLoading}
                  {...register("pet", { required: true })}
                >
                  {animalTypes.map((type, i) => (
                    <option key={i} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {formErrors.pet && (
                  <span className="help is-danger">
                    An animal typology like chimp, dog, etc is required
                  </span>
                )}
              </div>

              <div
                className="mt-4 is-flex is-justify-content-end"
                style={{ width: "100%" }}
              >
                <button className="button is-success" disabled={isLoading}>
                  Add
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Favourites;

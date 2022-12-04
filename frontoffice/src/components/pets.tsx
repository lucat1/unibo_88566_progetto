import * as React from "react";
import { useForm } from "react-hook-form";
import { animalTypes } from "shared/pets";
import type { IUserPet } from "shared/models/user";

import { useAuth } from "../auth";

export interface PetsProps {
  pets: IUserPet[];
  id: string;
  update: (pets: IUserPet[]) => void;
  isLoading: boolean;
}

const Pets: React.FC<PetsProps> = ({ pets, id, update, isLoading }) => {
  const [{ authenticated, user }] = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<IUserPet>({ defaultValues: { type: "Cat" } });

  const customOnAdd = (pet: IUserPet) => {
    update([...pets, pet] as any);
  };

  return (
    <div className="is-flex is-flex-direction-column my-6">
      {pets.length > 0 && (
        <>
          <h2 className="title my-3">
            {authenticated && user!._id == id ? "My" : "Their"} pets
          </h2>
          {pets.map((pet, i) => (
            <div
              key={i}
              className="is-flex is-flex-direction-row is-justify-content-space-between"
            >
              <h4 className="subtitle is-6">{pet.name}</h4>
              <span className="subtitle is-6">{pet.type}</span>
              <span className="subtitle is-6">
                {pet.sex} - {pet.age} years old
              </span>
              <button
                className="delete"
                aria-label="Remove pet"
                onClick={(_) => update(pets.filter((_, j) => j != i))}
              ></button>
            </div>
          ))}
        </>
      )}
      {authenticated && user!._id == id && (
        <>
          <h3 className="subtitle my-3">Add a new pet</h3>
          <form onSubmit={handleSubmit(customOnAdd)}>
            <div className="is-flex is-flex-direction-column">
              <div>
                <input
                  className="input"
                  placeholder="Name"
                  aria-label="Name"
                  type="text"
                  id="name"
                  disabled={isLoading}
                  {...register("name", { required: true })}
                />
                {formErrors.name && (
                  <span className="help is-danger">A pet name is required</span>
                )}
              </div>
              <div className="select mt-4">
                <select
                  className="input"
                  placeholder="Animal type"
                  aria-label="Animal type"
                  id="type"
                  disabled={isLoading}
                  {...register("type", { required: true })}
                >
                  {animalTypes.map((type, i) => (
                    <option key={i} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {formErrors.type && (
                  <span className="help is-danger">
                    An animal type like chimp, dog, etc is required
                  </span>
                )}
              </div>
              <div className="select mt-4">
                <select
                  className="input"
                  placeholder="Animal sex"
                  aria-label="Animal sex"
                  id="sex"
                  disabled={isLoading}
                  {...register("sex", { required: true })}
                >
                  <option value="male">not given</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                </select>

                {formErrors.sex && (
                  <span className="help is-danger">
                    The animal sex must be described
                  </span>
                )}
              </div>
              <div className="mt-4">
                <input
                  type="number"
                  increment="1"
                  className="input"
                  placeholder="Animal age (in years)"
                  aria-label="Animal age (in years)"
                  id="age"
                  disabled={isLoading}
                  {...register("age", {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                  })}
                />

                {formErrors.sex && (
                  <span className="help is-danger">
                    The animal age must be provided
                  </span>
                )}
              </div>

              <div
                className="mt-4 is-flex is-justify-content-end"
                style={{ width: "100%" }}
              >
                <button className="button is-success" disabled={isLoading}>
                  Save
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Pets;

import * as React from 'react'
import { useForm, Controller } from "react-hook-form";
import type { IUserPet } from 'shared/models/user'

import { useAuth } from "../auth";
import SelectCategory from './select-category';

export interface PetsProps {
  pets: IUserPet[]
  id: string
  update: (pets: IUserPet[]) => void
  isLoading: boolean
}

const Pets: React.FC<PetsProps> = ({ pets, id, update, isLoading }) => {
  const [{ authenticated, user }] = useAuth();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<IUserPet>();

  const customOnAdd = (pet: IUserPet) => {
    update([...pets, pet] as any)
  }

  return (
    <div className="is-flex is-flex-direction-column my-6">
      {pets.length > 0 && (
        <>
          <h2 className="title my-3">{authenticated && user!._id == id ? 'My' : 'Their'} pets</h2>
          {pets.map((pet, i) => (
            <div key={i} className="is-flex is-flex-direction-row is-justify-content-space-between">
              <h4 className='subtitle is-6'>{pet.name}</h4>
              <span className='subtitle is-6'>{pet.type}</span>
              <button className="delete" onClick={_ => update(pets.filter((_, j) => j != i))}></button>
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
              <div className='mt-4'>
                <input
                  className="input"
                  placeholder="Animal type"
                  aria-label="Animal type"
                  type="text"
                  id="type"
                  disabled={isLoading}
                  {...register("type", { required: true })}
                />
                {formErrors.type && (
                  <span className="help is-danger">An animal type like chip, dog, etc is required</span>
                )}
              </div>

              <div className="mt-4 is-flex is-justify-content-end" style={{ width: '100%' }}>
                <button className="button is-success" disabled={isLoading}>
                  Save
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default Pets

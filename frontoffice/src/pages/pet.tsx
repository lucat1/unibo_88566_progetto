import * as React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import fetch from "shared/fetch";
import type { IPet } from "shared/models/pet";

import useCart from "../cart";
import Pictures from "../components/pictures";

const Pet: React.FC = () => {
  const { id } = useParams();
  const { data: pet } = useQuery(
    ["pet", id],
    () => fetch<IPet>(`store/pets/${id}`),
    {
      suspense: true,
    }
  );
  const [cart, addToCart] = useCart();
  return (
    <>
      <main className="columns">
        <section className="column is-one-third">
          <Pictures pictures={pet?.photos || []} />
        </section>
        <section className="column">
          <h1 className="has-text-weight-bold is-size-2 my-4">{pet?.name}</h1>
          <span className="is-size-5">{pet?.description}</span>
          <h2 className="has-text-weight-bold is-size-4 mt-4">Price</h2>$
          {pet?.price.toFixed(2)}
          <div className="is-flex">
            {pet?.category && (
              <div className="mr-6">
                <h2 className="has-text-weight-bold is-size-4 mt-4">
                  Category
                </h2>
                {pet.category.name}
              </div>
            )}
            {pet?.subcategory && (
              <div>
                <h2 className="has-text-weight-bold is-size-4 mt-4">
                  Subcategory
                </h2>
                {pet.subcategory.name}
              </div>
            )}
          </div>
          <div className="my-3 is-flex is-justify-content-end">
            <button
              disabled={cart.some((i) => i.product._id == pet._id)}
              className="button is-primary"
              onClick={(_) => addToCart(pet!, 1)}
            >
              Buy
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Pet;

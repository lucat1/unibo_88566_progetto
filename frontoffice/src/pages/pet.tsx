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
      <div className="columns">
        <section className="column is-one-third">
          <Pictures pictures={pet?.photos || []} />
        </section>
        <section className="column">
          <h1 className="has-text-weight-bold is-size-2 my-4">{pet?.name}</h1>
          <span className="is-size-5">{pet?.description}</span>
          <p className="has-text-weight-bold is-size-4 mt-4">Price</p>$
          {pet?.price ? pet.price.toFixed(2) : "No price"}
          <p className="has-text-weight-bold is-size-4 mt-4">In store</p>
          {(pet?.stock || 0) > 0 ? pet?.stock : "Out of stock"}
          <div className="is-flex">
            {pet?.category && (
              <div className="mr-6">
                <p className="has-text-weight-bold is-size-4 mt-4">Category</p>
                {pet.category.name}
              </div>
            )}
            {pet?.subcategory && (
              <div>
                <p className="has-text-weight-bold is-size-4 mt-4">
                  Subcategory
                </p>
                {pet.subcategory.name}
              </div>
            )}
          </div>
          <div className="my-3 is-flex is-justify-content-end">
            <button
              disabled={!pet?.price}
              className="button is-info"
              onClick={(_) => addToCart("pet", pet!, 1)}
            >
              Add to cart
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Pet;

import * as React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import fetch from "shared/fetch";
import type { IService } from "shared/models/service";
import type { IStore } from "shared/models/store";

import useCart from "../cart";
import Pictures from "../components/pictures";
import Map from "../components/map";

const Service: React.FC = () => {
  const { id } = useParams();
  const { data: service } = useQuery(
    ["service", id],
    () => fetch<IService>(`store/services/${id}`),
    {
      suspense: true,
    }
  );
  const { data: store } = useQuery(
    ["store", id],
    () => fetch<IStore>(`store/stores/${service?.store}`),
    {
      suspense: true,
    }
  );
  const [_, addToCart] = useCart();
  return (
    <>
      <main className="columns">
        <section className="column is-one-third">
          <Pictures pictures={service?.photos || []} />
        </section>
        <section className="column">
          <h1 className="has-text-weight-bold is-size-2 my-4">
            {service?.name}
          </h1>
          <span className="is-size-5">{service?.description}</span>
          <h2 className="has-text-weight-bold is-size-4 mt-4">Price</h2>$
          {service?.price.toFixed(2)}
          <h2 className="has-text-weight-bold is-size-4 mt-4">Store</h2>
          {store?.name}
          <Map lat={store?.location[0]} lng={store?.location[1]} />
          <div className="my-3 is-flex is-justify-content-end">
            <button
              className="button is-primary"
              // onClick={(_) => addToCart("service", service!, 1)}
            >
              Reserve
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Service;

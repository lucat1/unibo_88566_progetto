import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import fetch, { withOptions, Error } from "shared/fetch";
import type { IOrder } from "shared/models/order";

const Order: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order } = useQuery(
    ["order", id],
    () => fetch<IOrder>(`store/orders/${id}`),
    {
      suspense: true,
    }
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const del = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await fetch(`store/orders/${id}`, withOptions("DELETE"));
      navigate("/orders");
    } catch (err) {
      setError(
        "Error while deleting: " +
          ((err as Error<any>).message || "Unknown error")
      );
    }
    setLoading(false);
  };

  return (
    <div className="is-flex is-flex-direction-column">
      <div className="is-flex is-justify-content-space-between my-4">
        <h1 className="title mb-0">Order #{order?._id}</h1>
        <button className="button is-danger" disabled={loading} onClick={del}>
          Delete
        </button>
      </div>
      <table className="table">
        <thead>
          <tr role="row">
            <th>
              <abbr title="Position">Pos</abbr>
            </th>
            <th>
              <abbr title="Product image">Image</abbr>
            </th>
            <th>
              <abbr title="Product name">Name</abbr>
            </th>
            <th>
              <abbr title="Product unitary price">Price</abbr>
            </th>
            <th>Amount</th>
            <th>
              <abbr title="Local total">L. Tot</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {order?.items.map((item, i) => (
            <tr key={i} role="row">
              <th>{i + 1}</th>
              <td>
                <img
                  style={{ width: "1.5rem", height: "1.5rem" }}
                  alt={`${(item.pet || item.product)!.name}'s ${
                    item.pet ? "pet" : "product"
                  } image`}
                  src={(item.product || item.pet)!.photos[0]}
                />
              </td>
              <td>{(item.product || item.pet)!.name}</td>
              <td>${(item.product || item.pet)!.price.toFixed(2)}</td>
              <td>{item.amount}</td>
              <td>
                ${(item.amount * (item.product || item.pet)!.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="has-text-weight-bold is-size-4 my-2">
        Total: $
        {order?.items
          .reduce((prev, i) => prev + (i.product || i.pet)!.price * i.amount, 0)
          .toFixed(2)}
      </h2>
    </main>
  );
};

export default Order;

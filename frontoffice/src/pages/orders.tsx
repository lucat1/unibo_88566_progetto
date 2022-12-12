import * as React from "react";
import { Link } from "react-router-dom";
import type { IOrder } from "shared/models/order";
import Pagination from "../components/pagination";

const Ordes: React.FC = () => {
  return (
    <>
      <h1 className="title">Orders</h1>
      <Pagination
        className="table"
        style={{ width: "100%" }}
        ele="table"
        child="tbody"
        url={(page) => `store/orders?page=${page}`}
        resource={(page) => ["orders", page]}
        pre={
          <thead>
            <tr role="row">
              <th>Index</th>
              <th>
                <abbr title="Number of items">N. items</abbr>
              </th>
              <th>Products</th>
              <th>Total</th>
              <th>
                <abbr title="Date of purchase">Date</abbr>
              </th>
            </tr>
          </thead>
        }
      >
        {(ord: IOrder, i) => (
          <tr key={i} role="row">
            <th>
              <Link to={`/orders/${ord._id}`}>{i + 1}</Link>
            </th>
            <td>{ord.items.length}</td>
            <td>
              {ord.items.map((i) => (i.product || i.pet)!.name).join(", ")}
            </td>
            <td>
              $
              {ord.items.reduce(
                (prev, i) => prev + (i.product || i.pet)!.price * i.amount,
                0
              )}
            </td>
            <td>{new Date(ord.date).toLocaleDateString("en-UK")}</td>
          </tr>
        )}
      </Pagination>
    </>
  );
};

export default Ordes;

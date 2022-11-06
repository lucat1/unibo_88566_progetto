import * as React from 'react'
import { useForm } from "react-hook-form";
import fetch, { withOptions } from "shared/fetch";
import type { IShipping } from 'shared/models/order';

import { useAuth } from '../auth';
import useCart from '../cart'

const Cart: React.FC = () => {
  const [auth] = useAuth()
  const [items, _, del, clear] = useCart()
  const [order, setOrder] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IShipping>();
  const total = React.useMemo(() => items.reduce((prev, item) => prev + (item.product.price * item.amount), 0), [items])
  const checkout = async (shipping: any) => {
    setLoading(true)
    setError(null);
    try {
      const { _id } = await fetch<{ _id: string }>(
        "store/orders",
        withOptions("PUT", { shipping, items: items.map(({ product, amount }) => ({ amount, product: product._id })) })
      );

      setOrder(_id);
      clear();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false)
  }
  return (
    order ? (
      <div className="is-flex is-flex-direction-column is-align-items-center is-justify-content-center">
        <h1 className="has-text-weight-bold is-size-5 my-2">Checkout succeeded</h1>
        <h3 className="has-text-weight-bold is-size-6 my-2">Order ID: {order}</h3>
      </div>
    ) : (
      <main className="is-flex is-flex-direction-column">
        <table className="table">
          <thead>
            <tr>
              <th><abbr title="Position">Pos</abbr></th>
              <th><abbr title="Product image">Image</abbr></th>
              <th><abbr title="Product name">Name</abbr></th>
              <th><abbr title="Product unitary price">Price</abbr></th>
              <th>Amount</th>
              <th><abbr title="Delete">Del</abbr></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <th>{i + 1}</th>
                <td><img style={{ width: '1.5rem', height: '1.5rem' }} alt={`${item.product.name}'s product image`} src={item.product.photos[0]} /></td>
                <td>{item.product.name}</td>
                <td>{item.product.price.toFixed(2)}</td>
                <td>${item.amount}</td>
                <td><button className="delete" onClick={_ => del(item.product)}></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="has-text-weight-bold is-size-4 my-2">Total: ${total.toFixed(2)}</h2>
        {total > 0 && (
          <>
            <h3 className="has-text-weight-bold is-size-5 my-2">Shipping information</h3>
            <form onSubmit={handleSubmit(checkout)}>
              <section className="columns">
                <div className="column">
                  <label htmlFor="firstName" className="label">
                    First name
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      id="firstName"
                      disabled={loading}
                      {...register("firstName", { required: true })}
                    />
                  </div>
                  {errors.firstName && (
                    <span className="help is-danger">A first name is required</span>
                  )}
                </div>
                <div className="column">
                  <label htmlFor="lastName" className="label">
                    Last name
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      id="lastName"
                      disabled={loading}
                      {...register("lastName", { required: true })}
                    />
                  </div>
                  {errors.lastName && (
                    <span className="help is-danger">A last name is required</span>
                  )}
                </div>
              </section>
              <section className="columns">
                <div className="column">
                  <label htmlFor="address" className="label">
                    Address
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      id="address"
                      disabled={loading}
                      {...register("address", { required: true })}
                    />
                  </div>
                  {errors.address && (
                    <span className="help is-danger">Shipping address is required</span>
                  )}
                </div>
                <div className="column">
                  <label htmlFor="phone" className="label">
                    Phone number
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
                      id="phone"
                      disabled={loading}
                      {...register("phone", { required: true, valueAsNumber: true })}
                    />
                  </div>
                  {errors.phone && (
                    <span className="help is-danger">Phone is required or format is invalid</span>
                  )}
                </div>
              </section>
              {error && (
                <span className="help is-danger">
                  {error}
                </span>
              )}
              <section className="is-flex is-justify-content-end">
                <div className="control">
                  <button className="button is-link" disabled={loading || !auth.authenticated}>
                    Checkout
                  </button>
                </div>
              </section>
            </form>
          </>
        )}
      </main>)
  )
}

export default Cart

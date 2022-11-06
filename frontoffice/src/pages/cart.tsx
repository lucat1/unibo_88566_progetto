import * as React from 'react'
import { useForm } from "react-hook-form";

import useCart from '../cart'

interface FormData {
  name: string
  surname: string
  address: string
  phone: number
}

const Cart: React.FC = () => {
  const [items] = useCart()
  const [checkedout, setCheckedout] = React.useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const checkout = (_: any) => setCheckedout(true)
  return (
    checkedout ? (
      <div className="is-flex is-align-items-center is-justify-content-center">
        <h1 className="has-text-weight-bold is-size-5 my-2">Checkout succeeded</h1>
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
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="has-text-weight-bold is-size-4 my-2">Total: ${items.reduce((prev, item) => prev + (item.product.price * item.amount), 0).toFixed(2)}</h2>
        <h3 className="has-text-weight-bold is-size-5 my-2">Shipping information</h3>
        <form onSubmit={handleSubmit(checkout)}>
          <section className="columns">
            <div className="column">
              <label htmlFor="name" className="label">
                Name
              </label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="name"
                />
              </div>
            </div>
            <div className="column">
              <label htmlFor="surname" className="label">
                Surname
              </label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  id="surname"
                />
              </div>
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
                />
              </div>
            </div>
            <div className="column">
              <label htmlFor="phone" className="label">
                Phone number
              </label>
              <div className="control">
                <input
                  className="input"
                  type="phone"
                  id="phone"
                />
              </div>
            </div>
          </section>
          <section className="is-flex is-justify-content-end">
            <div className="control">
              <button className="button is-link">
                Checkout
              </button>
            </div>
          </section>
        </form>
      </main>)
  )
}

export default Cart

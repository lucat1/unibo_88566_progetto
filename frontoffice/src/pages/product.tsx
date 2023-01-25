import * as React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import fetch from "shared/fetch";
import type { IProduct } from "shared/models/product";

import useCart from "../cart";
import Pictures from "../components/pictures";

const Product: React.FC = () => {
  const { id } = useParams();
  const { data: product } = useQuery(
    ["product", id],
    () => fetch<IProduct>(`store/products/${id}`),
    {
      suspense: true,
    }
  );
  const [_, addToCart] = useCart();
  return (
    <>
      <div className="columns">
        <section className="column is-one-third">
          <Pictures
            pictures={product?.photos || []}
            picturesAlt={
              product?.photos.map(
                (_, i) => `Picture of ${product?.name} #${i}`
              ) || []
            }
          />
        </section>
        <section className="column">
          <h1 className="has-text-weight-bold is-size-2 my-4">
            {product?.name}
          </h1>
          <span className="is-size-5">{product?.description}</span>
          <p className="has-text-weight-bold is-size-4 mt-4">Price</p>$
          {product?.price.toFixed(2)}
          <p className="has-text-weight-bold is-size-4 mt-4">In store</p>
          {(product?.stock || 0) > 0 ? product?.stock : "Out of stock"}
          <div className="is-flex">
            {product?.category && (
              <div className="mr-6">
                <p className="has-text-weight-bold is-size-4 mt-4">Category</p>
                {product.category.name}
              </div>
            )}
            {product?.subcategory && (
              <div>
                <p className="has-text-weight-bold is-size-4 mt-4">
                  Subcategory
                </p>
                {product.subcategory.name}
              </div>
            )}
          </div>
          <div className="my-3 is-flex is-justify-content-end">
            <button
              className="button is-info"
              onClick={(_) => addToCart("product", product!, 1)}
            >
              Add to cart
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Product;

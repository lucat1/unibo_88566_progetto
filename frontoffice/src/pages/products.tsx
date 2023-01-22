import * as React from "react";
import { Link } from "react-router-dom";
import type { IProduct } from "shared/models/product";
import Pagination from "../components/pagination";

const Products: React.FC = () => {
  return (
    <>
      <h1 className="title">Products</h1>
      <Pagination
        url={(page) => `store/products?page=${page}`}
        resource={(page) => ["products", page]}
        className="is-flex is-flex-direction-row is-flex-wrap-wrap"
      >
        {(prod: IProduct, i) => (
          <div
            key={i}
            className="card m-4"
            style={{ display: "block", width: "100%", maxWidth: "24rem" }}
          >
            <Link to={`/products/${prod._id}`}>
              {prod.photos.length > 0 && (
                <div className="card-image">
                  <figure className="image is-square">
                    <img
                      style={{ objectFit: "cover" }}
                      src={prod.photos[0]}
                      alt={`${prod.name} main image`}
                    />
                  </figure>
                </div>
              )}
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-4">{prod.name}</p>
                  </div>
                </div>
                <div className="content">
                  <p>
                    {prod.description.slice(0, 147) + "..." ||
                      "No description provided"}
                  </p>
                </div>
              </div>
            </Link>
            {(prod.category || prod.subcategory) && (
              <footer className="card-footer">
                {prod.category && (
                  <div className="card-footer-item">{prod.category.name}</div>
                )}
                {prod.subcategory && (
                  <div className="card-footer-item">
                    {prod.subcategory.name}
                  </div>
                )}
              </footer>
            )}
          </div>
        )}
      </Pagination>
    </>
  );
};

export default Products;

import * as React from "react";
import { Link } from 'react-router-dom'
import { useQuery } from "@tanstack/react-query";
import fetch, { withOptions } from "shared/fetch";
import type { IProduct } from "shared/models/product";
import Pagination from '../components/pagination'

const Store: React.FC = () => {
  return (
    <>
      <h1>Store</h1>
      <Pagination url="store/products" resource={['products']}    >
        {(prod: IProduct, i) => (
          <Link
            key={i}
            to={`/store/${prod._id}`}
            className="m-4">
            <div className="card"
              style={{ width: "100%", "max-width": "24rem" }}
            >
              {prod.photos.length > 0 && <div className="card-image"><figure className="image is-square">
                <img style={{ objectFit: 'cover' }} src={prod.photos[0]} alt={`${prod.name} main image`} />
              </figure></div>}
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-4">{prod.name}</p>
                  </div>
                </div>
                <div className="content">
                  <p>{prod.description || 'No description provided'}</p>
                </div>
              </div>
              {(prod.category || prod.subcategory) && (<footer className="card-footer">
                {prod.category && <Link className="card-footer-item" to={`/categories/${prod.category._id}`}>{prod.category.name}</Link>}
                {prod.subcategory && <Link className="card-footer-item" to={`/subcategories/${prod.subcategory._id}`}>{prod.subcategory.name}</Link>}
              </footer>)}
            </div>
          </Link>
        )}
      </Pagination>
    </>
  );
};

export default Store;

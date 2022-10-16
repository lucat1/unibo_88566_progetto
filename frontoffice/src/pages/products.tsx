import * as React from "react";
import { Link } from 'react-router-dom'
import type { IProduct } from "shared/models/product";
import Pagination from '../components/pagination'

const Products: React.FC = () => {
  return (
    <>
      <h1 className="title">Products</h1>
      <Pagination url="store/products" resource={['products']}
        className="is-flex is-flex-direction-row is-flex-wrap-wrap"
      >
        {(prod: IProduct, i) => (
          <Link
            key={i}
            to={`/products/${prod._id}`}
            className="m-4"
            style={{ display: 'block', width: "100%", maxWidth: "24rem" }}>
            <div className="card">
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

export default Products;

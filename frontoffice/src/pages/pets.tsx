import * as React from "react";
import { Link } from "react-router-dom";
import type { IPet } from "shared/models/pet";
import Pagination from "../components/pagination";

const Pets: React.FC = () => {
  return (
    <>
      <h1 className="title">Pets</h1>
      <Pagination
        url={(page) => `store/pets?page=${page}`}
        resource={(page) => ["pets", page]}
        className="is-flex is-flex-direction-row is-flex-wrap-wrap"
      >
        {(pet: IPet, i) => (
          <div
            key={i}
            className="card m-4"
            style={{ display: "block", width: "100%", maxWidth: "24rem" }}
          >
            <Link to={`/pets/${pet._id}`}>
              {pet.photos.length > 0 && (
                <div className="card-image">
                  <figure className="image is-square">
                    <img
                      style={{ objectFit: "cover" }}
                      src={pet.photos[0]}
                      alt={`${pet.name} main image`}
                    />
                  </figure>
                </div>
              )}
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-4">{pet.name}</p>
                  </div>
                </div>
                <div className="content">
                  <p>
                    {pet.description.slice(0, 147) + "..." ||
                      "No description provided"}
                  </p>
                </div>
              </div>
            </Link>
            {(pet.category || pet.subcategory) && (
              <footer className="card-footer">
                {pet.category && (
                  <div className="card-footer-item">{pet.category.name}</div>
                )}
                {pet.subcategory && (
                  <div className="card-footer-item">{pet.subcategory.name}</div>
                )}
              </footer>
            )}
          </div>
        )}
      </Pagination>
    </>
  );
};

export default Pets;

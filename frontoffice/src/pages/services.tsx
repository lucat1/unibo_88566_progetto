import * as React from "react";
import { Link } from "react-router-dom";
import type { IService } from "shared/models/service";
import type { IStore } from "shared/models/store";
import Pagination from "../components/pagination";
import SelectStore from "../components/select-store";
import SelectInterval from "../components/select-interval";

const Services: React.FC = () => {
  const [id, setId] = React.useState(0);
  const [store, setStore] = React.useState<IStore | undefined>(undefined);
  const [dateTimeRange, setDateTimeRange] = React.useState<string[]>([
    new Date().toISOString(),
    new Date().toISOString(),
  ]);

  return (
    <>
      <h1 className="title m-0">Services</h1>
      <div className="columns my-2">
        <div className="column">
          <SelectStore
            selected={store}
            onSelect={(s) => {
              setStore(s);
              setId(id + 1);
            }}
          />
        </div>
        <div className="column">
          <SelectInterval
            selected={dateTimeRange!}
            onSelect={(dtr) => {
              setDateTimeRange(dtr);
              setId(id + 1);
            }}
          />
        </div>
      </div>
      {!store ? (
        <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center my-6">
          Please, select a store where the service will be held first.
        </div>
      ) : (
        <Pagination
          url={(page) =>
            `store/services?page=${page}&location=${
              store ? store._id : ""
            }&from=${dateTimeRange[0] || ""}&to=${dateTimeRange[1] || ""}`
          }
          resource={(page) => [
            "services",
            page,
            dateTimeRange[0],
            dateTimeRange[1],
          ]}
          className="is-flex is-flex-direction-row is-flex-wrap-wrap"
          id={id.toString()}
        >
          {(serv: IService, i) => (
            <div
              key={i}
              className="card m-4"
              style={{ display: "block", width: "100%", maxWidth: "24rem" }}
            >
              <Link to={`/services/${serv._id}`}>
                {serv.photos.length > 0 && (
                  <div className="card-image">
                    <figure className="image is-square">
                      <img
                        style={{ objectFit: "cover" }}
                        src={serv.photos[0]}
                        alt={`${serv.name} main image`}
                      />
                    </figure>
                  </div>
                )}
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="title is-4">{serv.name}</p>
                    </div>
                  </div>
                  <div className="content">
                    <p>
                      {serv.description?.slice(0, 147) + "..." ||
                        "No description provided"}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </Pagination>
      )}
    </>
  );
};

export default Services;

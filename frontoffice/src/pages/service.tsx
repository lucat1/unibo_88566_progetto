import * as React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import fetch, { withOptions } from "shared/fetch";
import type { IService, ICalendar, IInterval } from "shared/models/service";
import type { IStore } from "shared/models/store";
import type { IAppointment } from "shared/models/appointment";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import Pictures from "../components/pictures";
import GeoMap from "../components/map";
import Pagination from "../components/pagination";
import SelectTimeSlot from "../components/select-timeslot";

const Service: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [{ authenticated }] = useAuth();
  const queryClient = useQueryClient();
  const { data: service } = useQuery(
    ["service", id],
    () => fetch<IService>(`store/services/${id}`),
    {
      suspense: true,
    }
  );
  const { data: store } = useQuery(
    ["store", id],
    () => fetch<IStore>(`store/stores/${service?.store}`),
    {
      suspense: true,
    }
  );
  const bookMutation = useMutation({
    mutationFn: (booking) => {
      fetch("store/appointments/", withOptions("PUT", booking));
    },
    onSettled: (_) => queryClient.invalidateQueries(["service", id]),
  });
  const [toBeBooked, setToBeBooked] = React.useState<string | null>(null);
  async function deleteAppointment(appointment: any) {
    await fetch(`store/appointments/${appointment}`, { method: "DELETE" });
    navigate(".");
  }

  return (
    <>
      <div className="columns">
        <section className="column is-one-quarter">
          <Pictures
            pictures={service?.photos || []}
            picturesAlt={
              service?.photos.map(
                (_, i) => `Picture of ${service?.name} #${i}`
              ) || []
            }
          />
        </section>
        <section className="column is-three-quarters">
          <h1 className="has-text-weight-bold is-size-2 my-4">
            {service?.name}
          </h1>
          <span className="is-size-5">{service?.description}</span>
          <p className="has-text-weight-bold is-size-4 mt-4">Price</p>$
          {service?.price.toFixed(2)}
          <p className="has-text-weight-bold is-size-4 mt-4">
            Store: {store?.name}
          </p>
          <GeoMap lat={store?.location[0]} lng={store?.location[1]} />
          <h2 className="has-text-weight-bold is-size-4 mt-4">
            Disponibilities
          </h2>
          {(service?.disponibilities?.length ?? 0) > 0 ? (
            <div className="menu my-4">
              {service?.disponibilities?.map((disponibility) => {
                return (
                  <SelectTimeSlot
                    disponibility={disponibility}
                    bookMutation={bookMutation}
                    service_id={service._id}
                  />
                );
              })}
            </div>
          ) : (
            <p>No disponibilities at the moment.</p>
          )}
          <h2 className="has-text-weight-bold is-size-4 mt-4">
            My Appointments
          </h2>
          {authenticated ? (
            <Pagination
              url={(page) =>
                `store/appointments/?service=${id}&page=${page}&sort=minutes&order=1&mine=true`
              }
              resource={(page): any[] => ["services", id, "appointments", page]}
              className="is-flex is-flex-direction-row is-flex-wrap-wrap"
            >
              {(appointment: IAppointment, i) => (
                <div className="card m-4" key={i}>
                  <div className="card-content">
                    <div className="content">
                      {appointment.calendar},{" "}
                      {new Date(appointment.minutes).toLocaleString("en-US")}
                    </div>
                  </div>
                  <footer className="card-footer">
                    <button
                      className="card-footer-item button is-danger"
                      aria-label="Remove appointment"
                      onClick={(_) => deleteAppointment(appointment._id)}
                    >
                      Delete
                    </button>
                  </footer>
                </div>
              )}
            </Pagination>
          ) : (
            <p>Log in to view your appointments.</p>
          )}
        </section>
      </div>
    </>
  );
};

export default Service;

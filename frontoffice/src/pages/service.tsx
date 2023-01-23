import * as React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AppointmentPicker,
  AppointmentAttributesType,
} from "react-appointment-picker";
import fetch from "shared/fetch";
import type { IService, ICalendar, IInterval } from "shared/models/service";
import type { IStore } from "shared/models/store";
import type { IAppointment } from "shared/models/appointment";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import Pictures from "../components/pictures";
import GeoMap from "../components/map";
import Pagination from "../components/pagination";

function initialMinutes(disponibility: ICalendar): number {
  let minutes = Math.min(
    ...disponibility.intervals.map((interval) => interval.from[0])
  );
  if (minutes == Infinity) minutes = 0;
  return minutes;
}

function initialDate(disponibility: ICalendar): Date {
  let res = new Date();
  res.setHours(0, initialMinutes(disponibility), 0, 0);
  return res;
}

function removeAppointmentCallback(i: number) {
  return ({ day, number, _, __ }, removeCb) => {
    (document.getElementById("reserve-" + i) as HTMLButtonElement).disabled =
      true;
    removeCb(day, number);
  };
}

const DAYS_IN_A_WEEK = 7,
  MINUTES_IN_A_PERIOD = 15,
  COLUMNS = 10,
  slots = (
    intervals: IInterval[],
    date: Date,
    initialMinutes: number,
    size: number
  ) => {
    let res: AppointmentAttributesType[] = [],
      number = 0;
    for (let i = 0; i < intervals.length; ++i) {
      let interval = intervals[i];
      while (initialMinutes + MINUTES_IN_A_PERIOD <= interval.from[0]) {
        res.push(null);
        initialMinutes += MINUTES_IN_A_PERIOD;
      }
      let periods = Math.floor(size / MINUTES_IN_A_PERIOD),
        appointments = Math.floor(
          (interval.to[0] - interval.from[0]) / (periods * MINUTES_IN_A_PERIOD)
        );

      for (let j = 0; j < appointments; ++j) {
        date.setHours(0, initialMinutes, 0, 0);
        res.push({
          id: date.toISOString(),
          number: ++number,
          periods: periods,
        });
        initialMinutes += MINUTES_IN_A_PERIOD * periods;
      }
    }
    if (!res.length) res = [null];
    return res;
  },
  dayOfTheWeek = (date: Date) => date.getDay() % DAYS_IN_A_WEEK,
  getDayAppointments = (disp: ICalendar, date: Date) =>
    slots(
      disp.intervals.filter(
        (interval) => interval.dayOfWeek == dayOfTheWeek(date)
      ),
      date,
      initialMinutes(disp),
      disp.slotDuration ?? 60
    ).map((slot) => {
      if (disp.reservations.find((x) => x.toString() == (slot?.id as string)))
        slot!.isReserved = true;
      return slot;
    }),
  disponibilityToAppointmentAttributesType = (disponibility: ICalendar) =>
    Array.from({ length: COLUMNS }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    }).map((d) => getDayAppointments(disponibility, d));

const Service: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [{ authenticated }] = useAuth();
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
  const [selectedDates, setSelectedDates] = React.useState(
    new Map<number, Date>()
  );

  function addAppointmentCallback(i: number) {
    return ({ addedAppointment: { day, number, time, id }, addCb }) => {
      (document.getElementById("reserve-" + i) as HTMLButtonElement).disabled =
        false;
      const d = new Date();
      d.setDate(day);
      d.setTime(time);
      selectedDates.set(i, d);
      setSelectedDates(selectedDates);
      addCb(day, number, time, id);
    };
  }

  async function reserveAppointment(calendar: string, from: Date) {
    await fetch("store/appointments/", {
      method: "PUT",
      body: JSON.stringify({
        service: id,
        calendar,
        from,
      }),
    });
    navigate("..");
  }

  async function deleteAppointment(appointment: any) {
    await fetch(`store/appointments/${appointment}`, { method: "DELETE" });
    navigate(".");
  }

  return (
    <>
      <div className="columns">
        <section className="column is-one-third">
          <Pictures pictures={service?.photos || []} editable={false} />
        </section>
        <section className="column">
          <h1 className="has-text-weight-bold is-size-2 my-4">
            {service?.name}
          </h1>
          <span className="is-size-5">{service?.description}</span>
          <p className="has-text-weight-bold is-size-4 mt-4">Price</p>$
          {service?.price.toFixed(2)}
          <p className="has-text-weight-bold is-size-4 mt-4">Store</p>
          {store?.name}
          <GeoMap lat={store?.location[0]} lng={store?.location[1]} />
          <h2 className="has-text-weight-bold is-size-4 mt-4">
            Disponibilities
          </h2>
          {(service?.disponibilities?.length ?? 0) > 0 ? (
            <div className="menu my-4">
              {service?.disponibilities?.map((disponibility, i) => (
                <div key={i} className="card my-4">
                  <div className="card-content">
                    {disponibility.name
                      ? disponibility.name
                      : "Unnamed disponibility"}{" "}
                    ({disponibility.slotDuration ?? 60} minutes slots)
                    <AppointmentPicker
                      addAppointmentCallback={addAppointmentCallback(i)}
                      removeAppointmentCallback={removeAppointmentCallback(i)}
                      initialDay={initialDate(disponibility)}
                      visible
                      continuous
                      local={"en-UK"}
                      days={disponibilityToAppointmentAttributesType(
                        disponibility
                      )}
                      maxReservableAppointments={1}
                    />
                    {authenticated ? (
                      <div>
                        <button
                          id={"reserve-" + i}
                          disabled
                          className="button is-info my-2"
                          aria-label="Add appointment"
                          onClick={async (_) =>
                            await reserveAppointment(
                              disponibility.name,
                              selectedDates.get(i)!
                            )
                          }
                        >
                          Reserve
                        </button>
                      </div>
                    ) : (
                      <p>Only logged in users can make reservations.</p>
                    )}
                  </div>
                </div>
              ))}
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

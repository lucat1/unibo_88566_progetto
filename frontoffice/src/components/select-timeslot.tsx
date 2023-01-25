import * as React from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ICalendar, IInterval } from "shared/models/service";
import {
  AppointmentPicker,
  AppointmentAttributesType,
} from "react-appointment-picker";
import { APPOINTMENTS_FORESIGHT } from "../pages/services";
import { useAuth } from "../auth";

export interface SelectTimeSlotProps {
  disponibility: ICalendar;
  bookMutation: UseMutationResult<unknown, unknown, void, unknown>;
  service_id: string;
}

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

const DAYS_IN_A_WEEK = 7,
  MINUTES_IN_A_PERIOD = 15,
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
    Array.from({ length: 1 + APPOINTMENTS_FORESIGHT }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    }).map((d) => getDayAppointments(disponibility, d));

const SelectTimeSlot: React.FC<SelectTimeSlotProps> = ({
  disponibility,
  bookMutation,
  service_id,
}) => {
  const [{ authenticated }] = useAuth();
  const [toBeBooked, setToBeBooked] = React.useState<string | null>(null);
  return (
    <>
      <div className="card my-4">
        <header className="card-header">
          <p className="card-header-title">
            {disponibility.name ? disponibility.name : "Unnamed disponibility"}{" "}
            ({disponibility.slotDuration ?? 60} minutes slots)
          </p>
        </header>
        <div className="card-content" style={{ overflow: "scroll" }}>
          <div style={{ width: "fit-content" }}>
            <AppointmentPicker
              addAppointmentCallback={({
                addedAppointment: { day, number, time, id },
                addCb,
              }) => {
                setToBeBooked(id as string);
                addCb(day, number, time, id);
              }}
              removeAppointmentCallback={({ day, number }, removeCb) => {
                setToBeBooked(null);
                removeCb(day, number);
              }}
              initialDay={initialDate(disponibility)}
              visible
              continuous
              local={"en-UK"}
              days={disponibilityToAppointmentAttributesType(disponibility)}
              maxReservableAppointments={1}
            />
          </div>
          {authenticated ? (
            <div>
              <button
                className="button is-info my-2"
                disabled={!toBeBooked}
                aria-label="Add appointment"
                onClick={async (e) => {
                  e.preventDefault();
                  bookMutation.mutate({
                    service: service_id,
                    calendar: disponibility.name,
                    from: toBeBooked,
                  });
                  setToBeBooked(null);
                }}
              >
                Reserve
              </button>
            </div>
          ) : (
            <p>Only logged in users can make reservations.</p>
          )}
          {bookMutation.error && (
            <span className="help is-danger">
              Unexpected error while booking
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default SelectTimeSlot;

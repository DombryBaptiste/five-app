import type { EventInput } from "@fullcalendar/core/index.js";
import { Timestamp } from "firebase/firestore";

export type AvailabilityEvent = {
  start: Timestamp;
  end: Timestamp;
  userId: string | undefined;
};

export function eventInputToAvailabilityEvent(event: EventInput, userId: string | undefined): AvailabilityEvent {
    return {
      start: Timestamp.fromDate(event.start as Date),
      end: Timestamp.fromDate(event.end as Date),
      userId: userId,
    };
  }

export function availabilityEventToEventInput(event: AvailabilityEvent, firebaseId: string,): EventInput {
    return {
      title: "Disponible",
      start: event.start.toDate(),
      end: event.end.toDate(),
      backgroundColor: "#22c55e",
      borderColor: "#22c55e",
      id: firebaseId,
    };
  }
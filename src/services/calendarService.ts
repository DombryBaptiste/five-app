import type { EventInput } from "@fullcalendar/core/index.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import authService from "./authService";

export type AvailabilityEvent = {
  start: Timestamp;
  end: Timestamp;
  userId: string | undefined;
  //eventId: string | undefined;
};

class CalendarService {
  private readonly AVAILABILITIES_TABLE = "availabilities";

  async addDispo(event: EventInput): Promise<string> {
    const send = this.EventInputToAvailabilityEvent(event);

    const docRef = await addDoc(
      collection(db, this.AVAILABILITIES_TABLE),
      send,
    );

    return docRef.id;
  }

  async deleteDispo(eventId: string) {
    await deleteDoc(doc(db, this.AVAILABILITIES_TABLE, eventId));
  }

  async getDispo(): Promise<EventInput[]> {
    const q = query(
      collection(db, this.AVAILABILITIES_TABLE),
      where("userId", "==", authService.getCurrentUserId()),
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const dataId = doc.id;
      const data = doc.data() as AvailabilityEvent;
      return this.AvailabilityEventToEventInput(data, dataId);
    });
  }

  private EventInputToAvailabilityEvent(event: EventInput): AvailabilityEvent {
    return {
      start: Timestamp.fromDate(event.start as Date),
      end: Timestamp.fromDate(event.end as Date),
      userId: authService.getCurrentUserId(),
      //eventId: event.id
    };
  }

  private AvailabilityEventToEventInput(
    event: AvailabilityEvent,
    firebaseId: string,
  ): EventInput {
    return {
      title: "Disponible",
      start: event.start.toDate(),
      end: event.end.toDate(),
      backgroundColor: "#22c55e",
      borderColor: "#22c55e",
      id: firebaseId,
    };
  }
}

export default new CalendarService();

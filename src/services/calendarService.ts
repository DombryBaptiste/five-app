import type { EventInput } from "@fullcalendar/core/index.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import authService from "./authService";
import { availabilityEventToEventInput, eventInputToAvailabilityEvent, type AvailabilityEvent } from "../type/AvailabilityEvent";


class CalendarService {
  private readonly AVAILABILITIES_TABLE = "availabilities";

  async addDispo(event: EventInput): Promise<string> {
    const send = eventInputToAvailabilityEvent(event, authService.getCurrentUserId());

    const docRef = await addDoc(
      collection(db, this.AVAILABILITIES_TABLE),
      send,
    );

    return docRef.id;
  }

  async deleteDispo(eventId: string) {
    await deleteDoc(doc(db, this.AVAILABILITIES_TABLE, eventId));
  }

  async getDispoCurrentUser(): Promise<EventInput[]> {
    const q = query(
      collection(db, this.AVAILABILITIES_TABLE),
      where("userId", "==", authService.getCurrentUserId()),
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const dataId = doc.id;
      const data = doc.data() as AvailabilityEvent;
      return availabilityEventToEventInput(data, dataId);
    });
  }

}

export default new CalendarService();

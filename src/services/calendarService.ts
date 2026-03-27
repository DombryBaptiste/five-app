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
import {
  availabilityEventToEventInput,
  eventInputToAvailabilityEvent,
  type AvailabilityEvent,
} from "../type/AvailabilityEvent";
import type { GlobalAvailabilityEvent } from "../type/GlobalAvailabilityEvent";
import { GetStartDateForFilter } from "../utils/CalendarGlobalUtils";

class CalendarService {
  private readonly AVAILABILITIES_TABLE = "availabilities";

  async addDispo(event: EventInput): Promise<string> {
    const userInfos = authService.getCurrentUserInfos();
    const send = eventInputToAvailabilityEvent(
      event,
      userInfos.userId,
      userInfos.userName,
    );

    const docRef = await addDoc(
      collection(db, this.AVAILABILITIES_TABLE),
      send,
    );

    return docRef.id;
  }

  async deleteDispo(eventId: string) {
    await deleteDoc(doc(db, this.AVAILABILITIES_TABLE, eventId));
  }

  async getDispos(onlyCurrentUser: boolean = true): Promise<EventInput[]> {
    let q;
    if (onlyCurrentUser) {
      const userInfos = authService.getCurrentUserInfos();

      q = query(
        collection(db, this.AVAILABILITIES_TABLE),
        where("userId", "==", userInfos.userId),
      );
    } else {
      q = query(
        collection(db, this.AVAILABILITIES_TABLE),
        
      );
    }

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const dataId = doc.id;
      const data = doc.data() as AvailabilityEvent;

      return availabilityEventToEventInput(data, dataId);
    });
  }

  async getGlobalDispos(): Promise<GlobalAvailabilityEvent[]> {
    const startOfWeek = GetStartDateForFilter();

    const q = query(
      collection(db, this.AVAILABILITIES_TABLE),
      where("start", ">=", startOfWeek)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as AvailabilityEvent;

      return {
        eventId: doc.id,
        userId: data.userId,
        userName: data.userName,
        start: data.start.toDate(),
        end: data.end.toDate(),
      };
    });
  }
}

export default new CalendarService();

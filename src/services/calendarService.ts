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
import {
  availabilityEventToEventInput,
  eventInputToAvailabilityEvent,
  type AvailabilityEvent,
} from "../type/AvailabilityEvent";
import type { GlobalAvailabilityEvent } from "../type/GlobalAvailabilityEvent";
import type { UserInfos } from "../type/UserInfos";
import type { CreateEventPayload } from "../type/CreateEventPaylod";

class CalendarService {
  private readonly AVAILABILITIES_TABLE = "availabilities";
  private readonly EVENT_TABLE = "events";

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
      q = query(collection(db, this.AVAILABILITIES_TABLE));
    }

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const dataId = doc.id;
      const data = doc.data() as AvailabilityEvent;

      return availabilityEventToEventInput(data, dataId);
    });
  }

  async getGlobalDispos(
    start: Date,
    end: Date,
  ): Promise<GlobalAvailabilityEvent[]> {
    const startTs = Timestamp.fromDate(start);
    const endTs = Timestamp.fromDate(end);

    const q = query(
      collection(db, this.AVAILABILITIES_TABLE),
      where("start", "<", endTs),
      where("end", ">", startTs),
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

  async getUserDispo(
    date: string,
    startHour: string,
    endHour: string,
  ): Promise<UserInfos[]> {
    const requestedStart = Timestamp.fromDate(
      new Date(`${date}T${startHour}:00`),
    );
    const requestedEnd = Timestamp.fromDate(new Date(`${date}T${endHour}:00`));

    const q = query(
      collection(db, this.AVAILABILITIES_TABLE),
      where("start", "<=", requestedStart),
      where("end", ">=", requestedEnd),
    );

    const snapshot = await getDocs(q);

    const usersMap = new Map<string, UserInfos>();

    snapshot.docs.forEach((doc) => {
      const data = doc.data();

      if (!usersMap.has(data.userId)) {
        usersMap.set(data.userId, {
          userId: data.userId,
          userName: data.userName,
        });
      }
    });

    return Array.from(usersMap.values());
  }

  async createEvent(event: CreateEventPayload) {
    const docRef = await addDoc(collection(db, this.EVENT_TABLE), {
      date: event.date,
      startDate: Timestamp.fromDate(new Date(event.startDate)),
      endDate: Timestamp.fromDate(new Date(event.endDate)),
      playerIds: event.playerIds,
    });

    return docRef.id;
  }

  async getEventCreated(start: Date, end: Date): Promise<EventInput[]> {
    const startTs = Timestamp.fromDate(start);
    const endTs = Timestamp.fromDate(end);

    const q = query(
      collection(db, this.EVENT_TABLE),
      where("startDate", "<", endTs),
      where("endDate", ">", startTs),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        title: "FIVE",
        backgroundColor: "#c21f1f",
        borderColor: "#c21f1f",
        start: data.startDate.toDate(),
        end: data.endDate.toDate(),
      } as EventInput;
    });
  }
}

export default new CalendarService();

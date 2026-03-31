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
import type { Dayjs } from "dayjs";

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
    date: Dayjs,
    startHour: Dayjs,
    endHour: Dayjs,
  ): Promise<UserInfos[]> {
    const requestedStart = Timestamp.fromDate(
      date
        .hour(startHour.hour())
        .minute(startHour.minute())
        .second(0)
        .millisecond(0)
        .toDate(),
    );

    const requestedEnd = Timestamp.fromDate(
      date
        .hour(endHour.hour())
        .minute(endHour.minute())
        .second(0)
        .millisecond(0)
        .toDate(),
    );

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
}

export default new CalendarService();

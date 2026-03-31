import { addDoc, collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import type { CreateEventPayload } from "../type/CreateEventPaylod";
import { db } from "../config/firebase";
import type { EventInput } from "@fullcalendar/core/index.js";

export type EventFirestore = {
  date: string;
  startHour: Timestamp;
  endHour: Timestamp;
  isBooked: boolean;
  place: string;
  playerIds: string[];
};

export const EVENT_FIELDS = {
  date: "date",
  startHour: "startHour",
  endHour: "endHour",
  isBooked: "isBooked",
  place: "place",
  playerIds: "playerIds",
} as const;

class EventService {
  private readonly EVENT_TABLE = "events";

  async createEvent(event: CreateEventPayload): Promise<string> {
    const docRef = await addDoc(
      collection(db, this.EVENT_TABLE),
      this.CreateEventPayloadToFirestore(event),
    );

    return docRef.id;
  }

  async getEventCreated(start: Date, end: Date): Promise<EventInput[]> {
    const startTs = Timestamp.fromDate(start);
    const endTs = Timestamp.fromDate(end);

    const q = query(
      collection(db, this.EVENT_TABLE),
      where(EVENT_FIELDS.startHour, "<", endTs),
      where(EVENT_FIELDS.endHour, ">", startTs),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data() as EventFirestore;

      return {
        id: doc.id,
        title: "FIVE",
        backgroundColor: "#c21f1f",
        borderColor: "#c21f1f",
        start: data.startHour.toDate(),
        end: data.endHour.toDate(),
      } as EventInput;
    });
  }

  private CreateEventPayloadToFirestore(
    event: CreateEventPayload,
  ): EventFirestore {
    return {
      date: event.date.toISOString(),
      startHour: Timestamp.fromDate(event.startHour.toDate()),
      endHour: Timestamp.fromDate(event.endHour.toDate()),
      isBooked: event.isBooked,
      place: event.place,
      playerIds: event.playerIds,
    };
  }
}

export default new EventService();

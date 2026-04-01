import { addDoc, collection, getDocs, query, Timestamp, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import type { CreateEventPayload } from "../type/CreateEventPaylod";
import { db } from "../config/firebase";
import type { EventInput } from "@fullcalendar/core/index.js";

/**
 * Structure d'un événement stocké dans Firestore
 */
export type EventFirestore = {
  date: string;
  startHour: Timestamp;
  endHour: Timestamp;
  isBooked: boolean;
  place: string;
  playerIds: string[];
};

/**
 * Champs utilisés pour les requêtes Firestore
 */
export const EVENT_FIELDS = {
  date: "date",
  startHour: "startHour",
  endHour: "endHour",
  isBooked: "isBooked",
  place: "place",
  playerIds: "playerIds",
} as const;

class EventService {
  /**
   * Nom de la collection Firestore pour les événements
   */
  private readonly EVENT_TABLE = "events";

  /**
   * Crée un nouvel événement dans Firestore
   * @param event Les données de l'événement à créer
   * @returns L'id du document créé
   */
  async createEvent(event: CreateEventPayload): Promise<string> {
    const docRef = await addDoc(
      collection(db, this.EVENT_TABLE),
      this.CreateEventPayloadToFirestore(event),
    );
    return docRef.id;
  }

  /**
   * Récupère les événements créés entre deux dates
   * @param start Date de début
   * @param end Date de fin
   * @returns Liste des événements (EventInput[])
   */
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
        extendedProps: {
          type: "created",
          place: data.place,
          isBooked: data.isBooked,
          playerIds: data.playerIds,
          startHour: data.startHour.toDate(),
          endHour: data.endHour.toDate(),
          date: data.date,
        },
      } as EventInput;
    });
  }

  /**
   * Met à jour un événement existant dans Firestore
   * @param id L'id du document Firebase à mettre à jour
   * @param event Les nouvelles données de l'événement (CreateEventPayload)
   */
  async updateEvent(id: string, event: CreateEventPayload): Promise<void> {
    const ref = doc(db, this.EVENT_TABLE, id);
    await updateDoc(ref, this.CreateEventPayloadToFirestore(event));
  }

  /**
   * Supprime un événement de Firestore
   * @param id L'id du document Firebase à supprimer
   */
  async deleteEvent(id: string): Promise<void> {
    const ref = doc(db, this.EVENT_TABLE, id);
    await deleteDoc(ref);
  }

  /**
   * Convertit un CreateEventPayload en EventFirestore (pour Firestore)
   * @param event Les données de l'événement
   * @returns L'objet formaté pour Firestore
   */
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

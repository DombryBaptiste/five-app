import { Dayjs } from "dayjs";

export type CreateEventPayload = {
  date: Dayjs;
  startHour: Dayjs;
  endHour: Dayjs;
  isBooked: boolean;
  place: string;
  playerIds: string[];
};
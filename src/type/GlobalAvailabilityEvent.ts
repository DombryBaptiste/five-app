export type GlobalAvailabilityEvent = {
  eventId: string | undefined;
  userId: string | null | undefined;
  userName: string | null | undefined;
  start: Date;
  end: Date;
};

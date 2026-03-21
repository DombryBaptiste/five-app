export type GlobalAvailabilityEvent = {
  eventId: string | undefined;
  userId: string | undefined;
  userName: string | null | undefined;
  start: Date;
  end: Date;
};

export type AggregatedSlot = {
  start: Date;
  end: Date;
  availableUsers: (string | null | undefined)[];
  unavailableUsers: (string | null | undefined)[];
  availableCount: number;
  totalUsers: number;
};
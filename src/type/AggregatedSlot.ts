import type { UserInfos } from "./UserInfos";

export type AggregatedSlot = {
  start: Date;
  end: Date;
  availableUsers: (UserInfos | undefined)[];
  unavailableUsers: (UserInfos| undefined)[];
  availableCount: number;
  totalUsers: number;
};
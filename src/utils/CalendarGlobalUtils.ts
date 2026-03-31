import type { EventInput } from "@fullcalendar/core/index.js";
import type { AggregatedSlot } from "../type/AggregatedSlot";
import type { GlobalAvailabilityEvent } from "../type/GlobalAvailabilityEvent";
import type { UserInfos } from "../type/UserInfos";

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function buildAggregatedSlots(
  availabilities: GlobalAvailabilityEvent[],
  slotMinutes = 30
): AggregatedSlot[] {
  if (availabilities.length === 0) return [];
  
  const users: UserInfos[] = Array.from(
  new Map(
    availabilities
      .filter((a) => a.userId && a.userName)
      .map((a) => [
        a.userId!,
        {
          userId: a.userId!,
          userName: a.userName!,
        },
      ])
  ).values()
);

  const minStart = new Date(
    Math.min(...availabilities.map((a) => a.start.getTime()))
  );
  const maxEnd = new Date(
    Math.max(...availabilities.map((a) => a.end.getTime()))
  );

  minStart.setSeconds(0, 0);
  minStart.setMinutes(minStart.getMinutes() - (minStart.getMinutes() % slotMinutes));

  const slots: AggregatedSlot[] = [];
  let current = new Date(minStart);

  while (current < maxEnd) {
    const slotStart = new Date(current);
    const slotEnd = addMinutes(slotStart, slotMinutes);

    const availableUsers = users
      .filter((user) =>
        availabilities.some(
          (a) =>
            a.userId === user.userId &&
            a.start <= slotStart &&
            a.end >= slotEnd
        )
      )

    const unavailableUsers = users.filter(
      (user) => !availableUsers.some((availableUser) => availableUser.userId === user.userId)
    );

    slots.push({
      start: slotStart,
      end: slotEnd,
      availableUsers,
      unavailableUsers,
      availableCount: availableUsers.length,
      totalUsers: users.length,
    });

    current = slotEnd;
  }

  return slots;
}

function getGreenColor(count: number, total: number = 10): string {
  if (count === 0) return "#f3f4f6";

  const ratio = count / total;

  if (ratio <= 0.2) return "#dcfce7"; // 1-2 joueurs
  if (ratio <= 0.4) return "#86efac"; // 3-4 joueurs
  if (ratio <= 0.6) return "#4ade80"; // 5-6 joueurs
  if (ratio <= 0.8) return "#22c55e"; // 7-8 joueurs
  return "#15803d"; // 9-10 joueurs
}

export function aggregatedSlotsToEvents(slots: AggregatedSlot[]): EventInput[] {
  return slots.map((slot, index) => ({
    id: `slot-${index}`,
    title: `${slot.availableCount}/${slot.totalUsers}`,
    start: slot.start,
    end: slot.end,
    backgroundColor: getGreenColor(slot.availableCount, slot.totalUsers),
    borderColor: getGreenColor(slot.availableCount, slot.totalUsers),
    extendedProps: {
      type: "availability",
      availableUsers: slot.availableUsers,
      unavailableUsers: slot.unavailableUsers,
      availableCount: slot.availableCount,
      totalUsers: slot.totalUsers,
    },
  }));
}

export function formatBestSlot(best: AggregatedSlot): string {
  const startDate = best.start.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });

  const startTime = best.start.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = best.end.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${best.availableCount}/${best.totalUsers} disponibles — ${startDate} de ${startTime} à ${endTime}`;
}

export function GetStartDateForFilter(): Date
{
  const now = new Date();

  const startOfWeek = new Date(now);
  const day = now.getDay(); // 0 = dimanche, 1 = lundi...

  const diff = day === 0 ? -6 : 1 - day; // gestion dimanche
  startOfWeek.setDate(now.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
}

export type FormattedCalendarData = {
  calendarEvents: EventInput[];
  bestSlots: string[];
};

export function formatGlobalDispos(
  events: GlobalAvailabilityEvent[],
  slotDurationMinutes = 60,
): FormattedCalendarData {
  const aggregatedSlots = buildAggregatedSlots(events, slotDurationMinutes);
  const calendarEvents = aggregatedSlotsToEvents(aggregatedSlots);

  const bestSlots =
    aggregatedSlots.length > 0
      ? (() => {
          const maxAvailableCount = Math.max(
            ...aggregatedSlots.map((slot) => slot.availableCount),
          );

          return aggregatedSlots
            .filter((slot) => slot.availableCount === maxAvailableCount)
            .map(formatBestSlot);
        })()
      : ["Aucun créneau trouvé"];

  return {
    calendarEvents,
    bestSlots,
  };
}
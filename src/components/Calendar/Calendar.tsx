import FullCalendar from "@fullcalendar/react";
import frLocale from "@fullcalendar/core/locales/fr";
import { useEffect, useState } from "react";
import type { DateSelectArg, EventClickArg, EventInput } from "@fullcalendar/core/index.js";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type CalendarProps = {
    events: EventInput[];
    isSelectable?: boolean;
    allDaySlot?: boolean;
    onEventClick?: (event: EventClickArg) => void;
    onSelectClick?: (info: DateSelectArg) => void;
    onDatesSet?: (arg: { start: Date; end: Date }) => void;
}

export default function Calendar({ events, onEventClick, onSelectClick, isSelectable = false, allDaySlot = false, onDatesSet }: CalendarProps) {
    const MIN_TIME = "12:00:00";
    const MAX_TIME = "24:00:00";
    const SLOT_DURATION = "01:00:00";
    const SCROLL_TIME = "12:00:00";
    const LOCAL = frLocale;
    const PLUGINS = [timeGridPlugin, interactionPlugin];
    const LONG_PRESS_DELAY = 200;
    const SLOT_LABEL_INTERVAL = "01:00";

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
        };
    
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    return (
        <>
            <FullCalendar
                plugins={PLUGINS}
                slotMinTime={MIN_TIME}
                slotMaxTime={MAX_TIME}
                slotDuration={SLOT_DURATION}
                locale={LOCAL}
                height="auto"
                scrollTime={SCROLL_TIME}
                initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
                key={isMobile ? "mobile" : "desktop"}
                longPressDelay={LONG_PRESS_DELAY}
                selectLongPressDelay={LONG_PRESS_DELAY}
                events={events}
                eventClick={onEventClick}
                select={onSelectClick}
                selectable={isSelectable}
                selectMirror={isSelectable}
                allDaySlot={allDaySlot}
                slotLabelInterval={SLOT_LABEL_INTERVAL}
                datesSet={onDatesSet}
            />
        </>
    )
}
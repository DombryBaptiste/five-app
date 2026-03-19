import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  DateSelectArg,
  EventInput,
  EventClickArg,
} from "@fullcalendar/core";
import "./CalendarPage.css";
import { useNavigate } from "react-router-dom";
import frLocale from "@fullcalendar/core/locales/fr";
import Button from "@mui/material/Button"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"


export default function CalendarPage() {
  const MIN_TIME = "12:00:00";
  const MAX_TIME = "24:00:00";
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (info: DateSelectArg) => {
    const newEvent: EventInput = {
      id: crypto.randomUUID(),
      title: "Disponible",
      start: info.start,
      end: info.end,
      backgroundColor: "#22c55e",
      borderColor: "#22c55e",
    };

    setEvents((prev) => [...prev, newEvent]);
    info.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventId = clickInfo.event.id;

    if (window.confirm("Supprimer cette disponibilité ?")) {
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    }
  };

  return (
    <div className="calendar-page">
        <div className="header">
            <Button variant="contained" color="success" startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
                Retour
            </Button>
        </div>

      <div className="calendar-card">
        <h1 className="header-title">Mes disponibilités</h1>
        <p className="calendar-subtitle">
          Glissez pour ajouter une disponibilité. Cliquez pour supprimer.
        </p>

        <div className="calendar-wrapper">
          <FullCalendar
            key={isMobile ? "mobile" : "desktop"}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
            locale={frLocale}
            selectable
            selectMirror
            longPressDelay={200}
            selectLongPressDelay={200}
            select={handleSelect}
            eventClick={handleEventClick}
            events={events}
            slotMinTime={MIN_TIME}
            slotMaxTime={MAX_TIME}
            scrollTime="12:00:00"
            height="auto"
          />
        </div>
      </div>
    </div>
  );
}

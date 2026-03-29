/* eslint-disable @typescript-eslint/no-unused-vars */
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
import calendarService from "../../services/calendarService";
import toastService from "../../services/toastService";
import Calendar from "../../components/Calendar/Calendar";


export default function CalendarPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await calendarService.getDispos(true);
        setEvents(data);
      } catch (error) {
        console.log("Erreur", error)
      }
    };

    loadEvents();
  }, []);


  const handleSelect = async (info: DateSelectArg) => {
    const newEvent: EventInput = {
      id: crypto.randomUUID(),
      title: "Disponible",
      start: info.start,
      end: info.end,
      backgroundColor: "#22c55e",
      borderColor: "#22c55e",
    };
    console.log("New event to add:", newEvent);

    const returnId = await calendarService.addDispo(newEvent);

    setEvents((prev) => [
      ...prev, 
      { ...newEvent, id: returnId }
    ]);
    info.view.calendar.unselect();

    toastService.success("La disponiblité a bien été ajoutée.")
  };

  const handleEventClick = async (clickInfo: EventClickArg) => {
    console.log("Event clicked:", clickInfo.event);
    const eventId = clickInfo.event.id;
    await calendarService.deleteDispo(eventId)
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
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
          {events.length > 0 && (
            <Calendar events={events} onEventClick={handleEventClick} onSelectClick={handleSelect} isSelectable={true} />
          )}
        </div>
      </div>
    </div>
  );
}

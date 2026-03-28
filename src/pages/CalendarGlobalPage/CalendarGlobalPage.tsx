/* eslint-disable @typescript-eslint/no-unused-vars */
import FullCalendar from "@fullcalendar/react";
import frLocale from "@fullcalendar/core/locales/fr";
import { useEffect, useState } from "react";
import type { EventInput } from "@fullcalendar/core/index.js";
import calendarService from "../../services/calendarService";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  aggregatedSlotsToEvents,
  buildAggregatedSlots,
  formatBestSlot,
} from "../../utils/CalendarGlobalUtils";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useNavigate } from "react-router-dom";
import "./CalendarGlobalPage.css"
import EventModal from "../../modals/EventModal/EventModal";
import CreateEventModal from "../../modals/CreateEventModal/CreateEventModal";

export default function CalendarGlobalPage() {
  const MIN_TIME = "12:00:00";
  const MAX_TIME = "24:00:00";

  const navigate = useNavigate();
  
  const [events, setEvents] = useState<EventInput[]>([]);
  const [bestSlots, setBestSlots] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedEvent, setSelectedEvent] = useState<EventInput>();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCreate, setisOpenCreate] = useState(false);

  const handleEventClick = (info: EventInput) => {
    getPlayersFromEvent(info)
    setSelectedEvent({
      title: info.event.title,
      availableUsers: info.event.extendedProps.availableUsers ?? [],
      unavailableUsers: info.event.extendedProps.unavailableUsers ?? [],
      availableCount: info.event.extendedProps.availableCount ?? 0,
      totalUsers: info.event.extendedProps.totalUsers ?? 0,
    });
    setIsOpen(true);
  };

  const getPlayersFromEvent = (event: EventInput | undefined) => {
    if(event)
    console.log(event.event);
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const hasOpenModal = isOpen || isOpenCreate;

    if (hasOpenModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, isOpenCreate]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await calendarService.getGlobalDispos();
        const aggregatedSlots = buildAggregatedSlots(data, 60);
        const calendarEvents = aggregatedSlotsToEvents(aggregatedSlots);

        setEvents(calendarEvents);

        if (aggregatedSlots.length > 0) {
          const maxAvailableCount = Math.max(
            ...aggregatedSlots.map((slot) => slot.availableCount),
          );

          const bestSlots = aggregatedSlots.filter(
            (slot) => slot.availableCount === maxAvailableCount,
          );

          setBestSlots(bestSlots.map(formatBestSlot));
        } else {
          setBestSlots(["Aucun créneau trouvé"]);
        }
      } catch (error) {
        console.log("Erreur", error);
      }
    };

    loadEvents();
  }, []);

  return (
    <>
    <div className="calendar-global-page">
      <div className="header">
        <Button
          variant="contained"
          color="success"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Retour
        </Button>
        <Button 
        variant="contained"
        color="success"
        onClick={() => setisOpenCreate(true)}>Créer l'evenement</Button>
      </div>

      <div className="calendar-global-card">
        <h1 className="header-title">Disponibilités globales</h1>
        <p className="calendar-subtitle">
          Vue agrégée des disponibilités avec intensité de couleur selon le
          nombre de personnes disponibles.
        </p>

        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
            locale={frLocale}
            events={events}
            slotMinTime={MIN_TIME}
            slotMaxTime={MAX_TIME}
            scrollTime="12:00:00"
            height="auto"
            allDaySlot={false}
            eventClick={handleEventClick}
          />
        </div>

        <div className="best-slots-section">
          <h2 className="best-slots-title">Meilleurs créneaux</h2>

          {bestSlots.length === 0 ? (
            <p className="best-slots-empty">Aucun créneau trouvé.</p>
          ) : (
            <ul className="best-slots-list">
              {bestSlots.map((slot, index) => (
                <li key={`${slot}-${index}`} className="best-slot-item">
                  <span className="best-slot-text">{slot}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>

    <EventModal 
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      event={selectedEvent}
      isMobile={isMobile}/>

    <CreateEventModal
      isOpen={isOpenCreate}
      onClose={() => setisOpenCreate(false)}
      isMobile={false}
      onCreate={(data) => {console.log("event creé", data)}}
      />
    </>
  );
}

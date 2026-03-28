/* eslint-disable @typescript-eslint/no-unused-vars */
import FullCalendar from "@fullcalendar/react";
import frLocale from "@fullcalendar/core/locales/fr";
import { useCallback, useEffect, useState } from "react";
import type { EventInput } from "@fullcalendar/core/index.js";
import calendarService from "../../services/calendarService";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatGlobalDispos } from "../../utils/CalendarGlobalUtils";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import "./CalendarGlobalPage.css";
import EventModal from "../../modals/EventModal/EventModal";
import CreateEventModal from "../../modals/CreateEventModal/CreateEventModal";
import type { CreateEventPayload } from "../../type/CreateEventPaylod";
import authService from "../../services/authService";

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
  const [createdEvent, setCreatedEvent] = useState<EventInput[]>([]);
  const [currentRange, setCurrentRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const handleEventClick = (info: EventInput) => {
    setSelectedEvent({
      title: info.event.title,
      availableUsers: info.event.extendedProps.availableUsers ?? [],
      unavailableUsers: info.event.extendedProps.unavailableUsers ?? [],
      availableCount: info.event.extendedProps.availableCount ?? 0,
      totalUsers: info.event.extendedProps.totalUsers ?? 0,
    });
    setIsOpen(true);
  };

  const loadEvent = useCallback(async (range: { start: Date; end: Date }) => {
    const globalDispos = await calendarService.getGlobalDispos(
      range.start,
      range.end,
    );

    const { calendarEvents, bestSlots } = formatGlobalDispos(globalDispos, 60);

    const eventCreatedFiltered = await calendarService.getEventCreated(
      range.start,
      range.end,
    );

    setEvents(calendarEvents);
    setBestSlots(bestSlots);
    setCreatedEvent(eventCreatedFiltered);
  }, []);

  const handleCreateEvent = async (createEvent: CreateEventPayload) => {
    await calendarService.createEvent(createEvent);

    if (currentRange) {
      await loadEvent(currentRange);
    }
  };

  const handleDatesSet = (dateInfo: { start: Date; end: Date }) => {
    setCurrentRange({
      start: dateInfo.start,
      end: dateInfo.end,
    });
  };

  useEffect(() => {
    if (!currentRange) return;

    const fetchData = async () => {
      await loadEvent(currentRange);
    };

    fetchData();
  }, [currentRange, loadEvent]);

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
          {authService.isCurrentUserAdmin() && (
            <Button
              variant="contained"
              color="success"
              onClick={() => setisOpenCreate(true)}
            >
              Créer l'evenement
            </Button>
          )}
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
              events={[...events, ...createdEvent]}
              datesSet={handleDatesSet}
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
        isMobile={isMobile}
      />

      <CreateEventModal
        isOpen={isOpenCreate}
        onClose={() => setisOpenCreate(false)}
        isMobile={false}
        onCreate={handleCreateEvent}
      />
    </>
  );
}

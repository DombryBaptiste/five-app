import { useCallback, useEffect, useState } from "react";
import type { EventClickArg, EventInput } from "@fullcalendar/core/index.js";
import calendarService from "../../services/calendarService";
import { formatGlobalDispos } from "../../utils/CalendarGlobalUtils";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import "./CalendarGlobalPage.css";
import EventModal from "../../modals/EventModal/EventModal";
import CreateEventModal from "../../modals/CreateEventModal/CreateEventModal";
import type { CreateEventPayload } from "../../type/CreateEventPaylod";
import authService from "../../services/authService";
import Calendar from "../../components/Calendar/Calendar";
import eventService from "../../services/eventService";

export default function CalendarGlobalPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventInput[]>([]);
  const [bestSlots, setBestSlots] = useState<string[]>([]);
  const [selectedAvailabilityEvent, setSelectedAvailabilityEvent] = useState<EventInput>();
  const [selectedCreatedEvent, setSelectedCreatedEvent] = useState<EventInput>();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCreate, setisOpenCreate] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "update" | null>(null);
  const [createdEvent, setCreatedEvent] = useState<EventInput[]>([]);
  const [currentRange, setCurrentRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const handleEventClick = (info: EventClickArg) => {
    const type = info.event.extendedProps.type;
    if (type === "created") {
      openEventCreated(info);
    } else {
      openEvent(info);
    }
  };

  const openEvent = (info: EventInput) => {
    setSelectedAvailabilityEvent({
      title: info.event.title,
      availableUsers: info.event.extendedProps.availableUsers ?? [],
      unavailableUsers: info.event.extendedProps.unavailableUsers ?? [],
      availableCount: info.event.extendedProps.availableCount ?? 0,
      totalUsers: info.event.extendedProps.totalUsers ?? 0,
    });

    setIsOpen(true);
  };

  const openEventCreated = (info: EventClickArg) => {
    setSelectedCreatedEvent({
      eventId: info.event.id,
      title: info.event.title,
      place: info.event.extendedProps.place ?? "",
      date: info.event.extendedProps.date ?? new Date(),
      startHour: info.event.extendedProps.startHour ?? new Date(),
      endHour: info.event.extendedProps.endHour ?? new Date(),
      isBooked: info.event.extendedProps.isBooked ?? false,
      playerIds: info.event.extendedProps.playerIds ?? [],
    });
    console.log(info.event);
    console.log(info.event.id);
    console.log(selectedCreatedEvent);

    handleOpenCreateUpdateModal("update");
  };

  const loadEvent = useCallback(async (range: { start: Date; end: Date }) => {
    const globalDispos = await calendarService.getGlobalDispos(
      range.start,
      range.end,
    );

    const { calendarEvents, bestSlots } = formatGlobalDispos(globalDispos, 60);

    const eventCreatedFiltered = await eventService.getEventCreated(
      range.start,
      range.end,
    );

    setEvents(calendarEvents);
    setBestSlots(bestSlots);
    setCreatedEvent(eventCreatedFiltered);
  }, []);

  const handleCreateEvent = async (createEvent: CreateEventPayload) => {
    await eventService.createEvent(createEvent);

    if (currentRange) {
      await loadEvent(currentRange);
    }
  };

  const handleUpdateEvent = async (id: string, updateEvent: CreateEventPayload) => {
    await eventService.updateEvent(id, updateEvent);

    if (currentRange) {
      await loadEvent(currentRange);
    }
  }

  const handleDeleteEvent = async (id: string) => {
    await eventService.deleteEvent(id);

    if (currentRange) {
      await loadEvent(currentRange);
    }
  }

  const handleDatesSet = (dateInfo: { start: Date; end: Date }) => {
    setCurrentRange({
      start: dateInfo.start,
      end: dateInfo.end,
    });
  };

  const handleOpenCreateUpdateModal = (mode: "create" | "update") => {
    setModalMode(mode);
    setisOpenCreate(true);
  };

  const handleCloseCreateUpdateModal = () => {
    setModalMode(null);
    setisOpenCreate(false);
  }

  useEffect(() => {
    if (!currentRange) return;

    const fetchData = async () => {
      await loadEvent(currentRange);
    };

    fetchData();
  }, [currentRange, loadEvent]);

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

  const getEvents = () => {
    return [...events, ...createdEvent];
  };

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
              onClick={() => handleOpenCreateUpdateModal("create")}
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
            <Calendar
              events={getEvents()}
              onEventClick={handleEventClick}
              onDatesSet={handleDatesSet}
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
        event={selectedAvailabilityEvent}
      />

      <CreateEventModal
        isOpen={isOpenCreate}
        onClose={() => handleCloseCreateUpdateModal()}
        isMobile={false}
        onCreate={handleCreateEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        event={selectedCreatedEvent}
        create={modalMode === "create"}
      />
    </>
  );
}

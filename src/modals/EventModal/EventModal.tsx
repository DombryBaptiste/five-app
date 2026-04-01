import type { EventInput } from "@fullcalendar/core/index.js";
import "./EventModal.css";
import type { UserInfos } from "../../type/UserInfos";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  event: EventInput | undefined;
};


export default function EventModal({ isOpen, onClose, event }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!event) return null;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={`event-modal ${isMobile ? "event-modal--mobile" : "event-modal--desktop"}`}>
        <div className="event-modal__header">
          <h3 className="event-modal__title">{event.title}</h3>
          <button
            type="button"
            className="event-modal__close"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
          >
            ×
          </button>
        </div>

        <p className="event-modal__count">
          <strong>
            {event.availableCount}/{event.totalUsers}
          </strong>{" "}
          disponibles
        </p>

        <div className="event-modal__section">
          <h4 className="event-modal__section-title">Disponibles</h4>
          <ul className="event-modal__list">
            {event.availableUsers.length ? (
              event.availableUsers.map((u: UserInfos) => (
                <li
                  key={u.userId}
                  className="event-modal__item event-modal__item--available"
                >
                  {u.userName}
                </li>
              ))
            ) : (
              <li className="event-modal__empty">Aucun</li>
            )}
          </ul>
        </div>

        <div className="event-modal__section">
          <h4 className="event-modal__section-title">Indisponibles</h4>
          <ul className="event-modal__list">
            {event.unavailableUsers.length ? (
              event.unavailableUsers.map((u: UserInfos) => (
                <li
                  key={u.userId}
                  className="event-modal__item event-modal__item--unavailable"
                >
                  {u.userName}
                </li>
              ))
            ) : (
              <li className="event-modal__empty">Aucun</li>
            )}
          </ul>
        </div>

        <div className="event-modal__footer">
          <button
            type="button"
            className="event-modal__button"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </Box>
    </Modal>
  );
}

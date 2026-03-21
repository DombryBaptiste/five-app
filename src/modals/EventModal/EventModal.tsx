import type { EventInput } from "@fullcalendar/core/index.js";
import Modal from "react-modal";
import "./EventModal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  event: EventInput | undefined;
  isMobile: boolean;
};

export default function EventModal({
  isOpen,
  onClose,
  event,
  isMobile,
}: Props) {
  if (!event) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Détail de l'événement"
      className={`event-modal ${isMobile ? "event-modal--mobile" : "event-modal--desktop"}`}
      overlayClassName="event-modal-overlay"
    >
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
            event.availableUsers.map((u: string) => (
              <li key={u} className="event-modal__item event-modal__item--available">
                {u}
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
            event.unavailableUsers.map((u: string) => (
              <li key={u} className="event-modal__item event-modal__item--unavailable">
                {u}
              </li>
            ))
          ) : (
            <li className="event-modal__empty">Aucun</li>
          )}
        </ul>
      </div>

      <div className="event-modal__footer">
        <button type="button" className="event-modal__button" onClick={onClose}>
          Fermer
        </button>
      </div>
    </Modal>
  );
}
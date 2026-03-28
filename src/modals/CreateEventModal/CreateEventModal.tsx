import { useEffect, useState } from "react";
import Modal from "react-modal";
import "./CreateEventModal.css";
import type { UserInfos } from "../../type/UserInfos";
import calendarService from "../../services/calendarService";
import type { CreateEventPayload } from "../../type/CreateEventPaylod";



type Props = {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  onCreate: (data: CreateEventPayload) => void;
};

export default function CreateEventModal({
  isOpen,
  onClose,
  isMobile,
  onCreate,
}: Props) {
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [dispoPlayers, setDispoPlayers] = useState<UserInfos[]>([]);

  const availableHours = Array.from({ length: 12 }, (_, index) => {
    const hour = index + 12; // de 12 à 23
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const resetForm = () => {
    setDate("");
    setStartHour("");
    setEndHour("");
    setDispoPlayers([]);
    setSelectedPlayerIds([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChangeStartHour = (value: string) => {
    setStartHour(value);

    if (!value) {
      setEndHour("");
      return;
    }

    const hourNumber = Number(value.split(":")[0]);
    const nextHour = (hourNumber + 1) % 24;

    setEndHour(`${nextHour.toString().padStart(2, "0")}:00`);
  };

  useEffect(() => {
    if (!isOpen || !startHour || !endHour || !date) return;

    const fetchUsers = async () => {
      try {
        const users = await calendarService.getUserDispo(date, startHour, endHour);
        setDispoPlayers(users);
      } catch (error) {
        console.error("Erreur lors du chargement des joueurs disponibles :", error);
        setDispoPlayers([]);
      }
    };

    fetchUsers();
  }, [isOpen, startHour, endHour, date]);

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const buildIsoDateTime = (selectedDate: string, selectedHour: string) => {
    return `${selectedDate}T${selectedHour}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !startHour || !endHour) {
      return;
    }

    const startDate = buildIsoDateTime(date, startHour);
    const endDate = buildIsoDateTime(date, endHour);

    if (startDate >= endDate) {
      alert("L'heure de fin doit être après l'heure de début.");
      return;
    }

    onCreate({
      date,
      startDate,
      endDate,
      playerIds: selectedPlayerIds,
    });

    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Créer un événement"
      className={`create-event-modal ${isMobile ? "create-event-modal--mobile" : "create-event-modal--desktop"}`}
      overlayClassName="create-event-modal-overlay"
    >
      <div className="create-event-modal__header">
        <h3 className="create-event-modal__title">Créer un event</h3>
        <button
          type="button"
          className="create-event-modal__close"
          onClick={handleClose}
          aria-label="Fermer la fenêtre"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="create-event-modal__form">
        <div className="create-event-modal__section">
          <label htmlFor="event-date" className="create-event-modal__label">
            Date
          </label>
          <input
            id="event-date"
            type="date"
            className="create-event-modal__input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="create-event-modal__row">
          <div className="create-event-modal__section">
            <label htmlFor="event-start-hour" className="create-event-modal__label">
              Heure début
            </label>
            <select
              id="event-start-hour"
              className="create-event-modal__input"
              value={startHour}
              onChange={(e) => handleChangeStartHour(e.target.value)}
              required
            >
              <option value="">Sélectionner une heure</option>
              {availableHours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>

          <div className="create-event-modal__section">
            <label htmlFor="event-end-hour" className="create-event-modal__label">
              Heure fin
            </label>
            <input
              id="event-end-hour"
              type="text"
              className="create-event-modal__input"
              value={endHour}
              readOnly
            />
          </div>
        </div>

        <div className="create-event-modal__section">
          <div className="create-event-modal__players-header">
            <label className="create-event-modal__label">
              Joueurs disponibles
            </label>
            <span className="create-event-modal__count">
              {selectedPlayerIds.length} sélectionné(s)
            </span>
          </div>

          <div className="create-event-modal__players-list">
            {dispoPlayers.length > 0 ? (
              dispoPlayers.map((player) => {
                const checked = selectedPlayerIds.includes(player.userId);

                return (
                  <label
                    key={player.userId}
                    className={`create-event-modal__player ${checked ? "create-event-modal__player--selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePlayer(player.userId)}
                      className="create-event-modal__checkbox"
                    />
                    <span>{player.userName}</span>
                  </label>
                );
              })
            ) : (
              <div className="create-event-modal__empty">
                Aucun joueur disponible.
              </div>
            )}
          </div>
        </div>

        <div className="create-event-modal__footer">
          <button
            type="button"
            className="create-event-modal__button create-event-modal__button--secondary"
            onClick={handleClose}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="create-event-modal__button create-event-modal__button--primary"
          >
            Créer
          </button>
        </div>
      </form>
    </Modal>
  );
}
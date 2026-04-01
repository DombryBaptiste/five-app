import { useEffect, useEffectEvent, useMemo, useState } from "react";
import Modal from "@mui/material/Modal";
import "./CreateEventModal.css";
import type { UserInfos } from "../../type/UserInfos";
import calendarService from "../../services/calendarService";
import type { CreateEventPayload } from "../../type/CreateEventPaylod";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CustomDatePicker from "../../components/DatePicker/CustomDatePicker";
import type { Dayjs } from "dayjs";
import Box from "@mui/material/Box";
import CustomTimePicker from "../../components/TimePicker/CustomTimePicker";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import type { EventInput } from "@fullcalendar/core/index.js";
import authService from "../../services/authService";
import dayjs from "dayjs";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  onCreate: (data: CreateEventPayload) => void;
  event: EventInput | undefined
  create: boolean;
};

export default function CreateEventModal({ isOpen, onClose, onCreate, event, create }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const [date, setDate] = useState<Dayjs | null>(null);
  const [startHour, setStartHour] = useState<Dayjs | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [place, setPlace] = useState("");
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [dispoPlayers, setDispoPlayers] = useState<UserInfos[]>([]);

  const placeList: string[] = ["Le temple du foot", "Le five", "Autre lieu"];
  const endHour = useMemo(() => {
    return startHour ? startHour.add(1, "hour") : null;
  }, [startHour]);
  const isAdmin = authService.isCurrentUserAdmin();
  const titleModal = create ? "Créer un événement" : "Information sur l'événement";

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsBooked(checked);

    if (!checked) {
      setPlace("");
    }
  };

  const fillForm = useEffectEvent((event: EventInput | undefined) => {
    if (!event) return;

    setDate(event.date ? dayjs(event.date as string | Date) : null);
    setStartHour(event.startHour ? dayjs(event.startHour) : null);
    setIsBooked(event.isBooked ?? false);
    setPlace(event.place ?? "");
    setSelectedPlayerIds(event.playerIds ?? []);
  })

  useEffect(() => {
    if(event) {
      fillForm(event);
    }
  }, [event])

  const resetForm = () => {
    setDate(null);
    setStartHour(null);
    setDispoPlayers([]);
    setSelectedPlayerIds([]);
    setIsBooked(false);
    setPlace("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !startHour || !endHour || !date) return;

    const fetchUsers = async () => {
      try {
        const users = await calendarService.getUserDispo(
          date,
          startHour,
          endHour,
        );
        setDispoPlayers(users);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des joueurs disponibles :",
          error,
        );
        setDispoPlayers([]);
      }
    };

    fetchUsers();
  }, [isOpen, startHour, endHour, date]);

  const handleCheckPlayer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const playerId = e.target.value;
    const checked = e.target.checked;

    setSelectedPlayerIds((prev) =>
      checked ? [...prev, playerId] : prev.filter((id) => id !== playerId),
    );
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!date || !startHour || !endHour) {
      return;
    }

    const startDateTime = date
      .hour(startHour.hour())
      .minute(startHour.minute())
      .second(0)
      .millisecond(0);

    const endDateTime = date
      .hour(endHour.hour())
      .minute(endHour.minute())
      .second(0)
      .millisecond(0);

    const created: CreateEventPayload = {
      date: date.startOf("day"),
      startHour: startDateTime,
      endHour: endDateTime,
      isBooked: isBooked,
      place: place,
      playerIds: selectedPlayerIds,
    };

    onCreate(created);

    resetForm();
    onClose();
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={`box-modal${isMobile ? " box-modal--mobile" : ""}`}>
          <h2 className="modal-title">{titleModal}</h2>
          <FormGroup className="form-group">
            <CustomDatePicker
              label="Date de l'événement"
              onChange={setDate}
              value={date}
              disabled={!isAdmin}
            />
            <div className="hour-pickers">
              <CustomTimePicker
                label="Heure de début"
                onChange={setStartHour}
                value={startHour}
                disabled={!isAdmin}
              />
              <CustomTimePicker
                label="Heure de fin"
                value={endHour}
                disabled={true}
              />
            </div>
            <div className="booking-wrapper">
              <FormControlLabel
                control={<Checkbox checked={isBooked} onChange={handleCheck} disabled={!isAdmin}/>}
                label="Réservé ?"
              />
              <FormControl className="place-control">
                <InputLabel id="place-label">Lieu de l'événement</InputLabel>
                <Select
                  labelId="place-label"
                  value={place}
                  label="Lieu de l'événement"
                  onChange={(e) => setPlace(e.target.value)}
                  disabled={!isBooked || !isAdmin}
                >
                  {placeList.map((placeOption) => (
                    <MenuItem key={placeOption} value={placeOption}>
                      {placeOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="players-header">
              <span>Joueurs disponibles</span>
              <span>{selectedPlayerIds.length} sélectionné(s)</span>
            </div>

            <div className="players-body">
              {dispoPlayers.length === 0 ? (
                <div className="empty">Aucun joueur disponible.</div>
              ) : (
                dispoPlayers.map((player) => (
                  <FormControlLabel
                    key={player.userId}
                    control={
                      <Checkbox
                        color="success"
                        onChange={handleCheckPlayer}
                        value={player.userId}
                        checked={selectedPlayerIds.includes(player.userId)}
                        disabled={!isAdmin}
                      />
                    }
                    label={player.userName}
                  />
                ))
              )}
            </div>
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Créer l'événement
            </Button>
          </FormGroup>
        </Box>
      </Modal>
    </>
  );
}

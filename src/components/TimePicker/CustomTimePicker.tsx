import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from "dayjs";

type Props = {
    label: string;
    disabled?: boolean;
    onChange?: (value: Dayjs | null) => void;
    value: Dayjs | null;
}

export default function CustomTimePicker({ label, disabled = false, onChange, value }: Props) {
    const MIN_TIME: Dayjs = dayjs().hour(12).minute(0).second(0);
    const MAX_TIME: Dayjs = dayjs().hour(23).minute(59).second(59);
    const STEP = 60;
  return (
    <>
        <TimePicker
            label={label}
            disabled={disabled}
            onChange={onChange}
            value={value}
            minTime={MIN_TIME}
            maxTime={MAX_TIME}
            minutesStep={STEP}
        />
    </>
  );
}
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { DateView } from "@mui/x-date-pickers/models";
import type { Dayjs } from "dayjs";

type Props = {
  label: string;
  value: Dayjs | null;
  view?: DateView[];
  onChange: (value: Dayjs | null) => void;
};

export default function CustomDatePicker({ label, value, view, onChange }: Props) {
  const VIEWS: DateView[] = view || ["day", "month", "year"];

  return (
    <DatePicker
      label={label}
      views={VIEWS}
      value={value}
      onChange={onChange}
      reduceAnimations
      slotProps={{
        textField: {
          fullWidth: true,
        },
      }}
    />
  );
}
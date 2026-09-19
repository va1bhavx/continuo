import { useEffect, useState } from "react";
import { useSettings } from "../hooks/useSettings";

export default function LiveClock() {
  const [time, setTime] = useState(new Date());
  const { settings } = useSettings();

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formattedDate = time.toLocaleDateString(undefined, dateOptions);

  // Format time based on user settings
  const formattedTime = time.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: settings.clockShowSeconds ? "2-digit" : undefined,
    hour12: !settings.clock24Hour,
  });

  return (
    <div className="text-left text-shadow-legible">
      <p className="text-3xl font-bold tracking-tight text-text-primary">
        {formattedTime}
      </p>
      <p className="text-xs text-text-secondary mt-0.5">{formattedDate}</p>
    </div>
  );
}

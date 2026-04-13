import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// TODO: Update this to your actual presentation date
const TARGET_DATE = new Date("2026-05-01T14:00:00");

function getTimeLeft(): TimeLeft {
  const diff = TARGET_DATE.getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isOver = Object.values(timeLeft).every((v) => v === 0);

  if (isOver) {
    return <div className="countdown-over">It's Go Time.</div>;
  }

  return (
    <div className="countdown">
      <div className="countdown-segments">
        <div className="segment">
          <span className="number">{pad(timeLeft.days)}</span>
          <span className="label">days</span>
        </div>
        <span className="separator">:</span>
        <div className="segment">
          <span className="number">{pad(timeLeft.hours)}</span>
          <span className="label">hours</span>
        </div>
        <span className="separator">:</span>
        <div className="segment">
          <span className="number">{pad(timeLeft.minutes)}</span>
          <span className="label">min</span>
        </div>
        <span className="separator">:</span>
        <div className="segment">
          <span className="number">{pad(timeLeft.seconds)}</span>
          <span className="label">sec</span>
        </div>
      </div>
    </div>
  );
}

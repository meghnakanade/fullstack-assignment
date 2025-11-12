import { useEffect, useState } from "react";

interface CountdownTimerProps {
  deadline: string; // ISO timestamp string (e.g., "2025-12-31T23:59:59Z")
}

export default function CountdownTimer({ deadline }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime(); // ✅ number
      const end = new Date(deadline).getTime(); // ✅ number
      const diff = end - now; // ✅ now valid arithmetic

      if (diff <= 0) {
        setTimeLeft("Time’s up!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        setTimeLeft("Time’s up!");
        return;
      }

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
    };

    updateCountdown(); // run immediately
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return <p>{timeLeft}</p>;
}

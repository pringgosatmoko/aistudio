
import React, { useState, useEffect } from 'react';

const Countdown: React.FC<{ expiryDate: string | null }> = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!expiryDate) {
      setTimeLeft('No Active Plan');
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(expiryDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft('Expired');
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1">Time Remaining</div>
      <div className="text-sm font-mono text-blue-400 font-bold">{timeLeft}</div>
    </div>
  );
};

export default Countdown;

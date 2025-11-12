import React from "react";
import CountdownForm from "../pages/CountDownForm";
import dayjs from "dayjs";

interface CountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  countdown: { name: string; deadline: string };
  onSubmit: (payload: { name: string; deadline: string }) => void;
}

const CountdownModal: React.FC<CountdownModalProps> = ({
  isOpen,
  onClose,
  countdown,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Edit Countdown</h2>
        <CountdownForm
          name={countdown.name}
          deadline={dayjs(countdown.deadline)}
          onSubmit={(data) =>
            onSubmit({ name: data.name, deadline: data.deadline.toISOString() })
          }
        />
      </div>
    </div>
  );
};

export default CountdownModal;

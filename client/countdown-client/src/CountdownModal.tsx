import React, { useState } from "react";

interface CountdownModalProps {
  onSubmit: (payload: { name: string; deadline: string }) => void;
}

const CountdownModal: React.FC<CountdownModalProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, deadline });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        placeholder="Deadline"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CountdownModal;

const handleModalSubmit = (payload: { name: string; deadline: string }) => {
  // Handle the submission logic here
  console.log(payload);
};

const initialData = {}; // Initialize countdown with initialData or an empty object

<CountdownModal onSubmit={handleModalSubmit} initialData={initialData} />;

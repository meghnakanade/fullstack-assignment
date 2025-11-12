import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export default function CountDownForm({
  name = "",
  deadline = dayjs(),
  onSubmit,
}: {
  name?: string;
  deadline?: Dayjs;
  onSubmit: (data: { name: string; deadline: Dayjs }) => void;
}) {
  const [nameInput, setName] = useState(name);
  const [deadlineInput, setDeadline] = useState(deadline);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDeadline = dayjs(deadlineInput).format("YYYY-MM-DD");
    onSubmit({ name: nameInput, deadline: dayjs(formattedDeadline) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={nameInput} onChange={(e) => setName(e.target.value)} />
      <input
        value={deadlineInput.format("YYYY-MM-DD HH:mm:ss")}
        onChange={(newValue) => setDeadline(dayjs(newValue))}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

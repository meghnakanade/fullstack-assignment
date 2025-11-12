import React, { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function CountdownForm() {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState(dayjs()); // default now

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Convert to backend format: "YYYY-MM-DD HH:mm:ss"
    const formattedDeadline = deadline.format("YYYY-MM-DD HH:mm:ss");

    const payload = {
      name,
      deadline: formattedDeadline,
    };

    console.log("Submitting:", payload);

    const res = await fetch("http://localhost:3000/countdowns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Countdown created!");
    } else {
      alert("Error creating countdown");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ maxWidth: 300 }}>
          <TextField
            label="Countdown Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
                  <DateTimePicker
                    
            label="Select Deadline"
            value={deadline}
            onChange={(newValue) => setDeadline(newValue)}
            ampm={false} // 24-hour format
            renderInput={(params) => <TextField {...params} />}
          />
          <Button type="submit" variant="contained">
            Create Countdown
          </Button>
        </Stack>
      </form>
    </LocalizationProvider>
  );
}

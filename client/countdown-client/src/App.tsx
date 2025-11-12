import { useEffect, useState } from "react";
import "./App.css";
import CountdownTimer from "./pages/CountDownTimer";
import CountDownForm from "./pages/CountDownForm";
import { Button, Stack } from "@mui/material";
type CountDown = {
  id: number;
  name: string;
  deadline: Date;
};

function App() {
  const [countdowns, setCountdowns] = useState<CountDown[]>([]);
  useEffect(() => {
    console.log("getting counters");
    fetch("http://localhost:3000/countdowns")
      .then((res) => res.json())
      .then((counters) => {
        console.log("counters", counters);
        // @ts-ignore
        setCountdowns(counters);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <CountDownForm />

      <h1>counters currently set</h1>
      {countdowns.map((countdown) => (
        <Stack
          key={countdown.id}
          flexDirection="row"
          sx={{
            maxHeight: "40vh",
            overflowY: "auto",
            mb: 2,
            alignItems: "center",
            gap: 2,
          }}
        >
          <h2>{countdown.name}</h2>
          <CountdownTimer deadline={countdown.deadline.toString()} />
          <Button variant="outlined">Edit</Button>
          <Button variant="outlined" color="error">
            Delete
          </Button>
        </Stack>
      ))}
    </>
  );
}

export default App;

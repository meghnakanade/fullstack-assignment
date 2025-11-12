import { useEffect, useState } from "react";
import "./App.css";
import CountdownTimer from "./pages/CountDownTimer";
import {
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Divider,
  Paper,
} from "@mui/material";
import { AccessTime as TimeIcon, Add as AddIcon } from "@mui/icons-material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

type CountDown = {
  id: number;
  name: string;
  deadline: string;
};

function App() {
  const [countdowns, setCountdowns] = useState<CountDown[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nameInput, setName] = useState("");
  const [deadlineInput, setDeadline] = useState<Dayjs>(dayjs());

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ✅ Fetch countdowns
  useEffect(() => {
    fetch("http://localhost:3000/countdowns")
      .then((res) => res.json())
      .then((data) => setCountdowns(data))
      .catch(console.error);
  }, []);

  const resetForm = () => {
    setName("");
    setDeadline(dayjs());
    setIsEditing(false);
    setEditingId(null);
  };

  // ✅ Submit (create or update)
  const handleSubmit = async () => {
    const url = isEditing
      ? `http://localhost:3000/countdowns?id=${editingId}`
      : "http://localhost:3000/countdowns";
    const method = isEditing ? "PUT" : "POST";

    const payload = {
      name: nameInput,
      deadline: deadlineInput.format("YYYY-MM-DD HH:mm:ss"),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await fetch("http://localhost:3000/countdowns").then(
          (r) => r.json()
        );
        setCountdowns(updated);
        setIsModalOpen(false);
        resetForm();
      } else {
        alert("Request failed");
      }
    } catch (err) {
      console.error("Error submitting countdown:", err);
    }
  };

  // ✅ Delete countdown
  const handleDelete = async (id: number) => {
    const res = await fetch(`http://localhost:3000/countdowns?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) setCountdowns(countdowns.filter((c) => c.id !== id));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: isMobile ? 2 : 4, bgcolor: "#f9fafc", minHeight: "100vh" }}>
        {/* Header */}
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile ? "flex-start" : "center"}
          spacing={isMobile ? 2 : 0}
          gap={1}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 600,
              color: "#1a237e",
            }}
          >
            <TimeIcon sx={{ fontSize: isMobile ? 28 : 36, color: "#3949ab" }} />
            Countdown List
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            sx={{
              bgcolor: "#3949ab",
              "&:hover": { bgcolor: "#303f9f" },
              fontWeight: 500,
            }}
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            Add New
          </Button>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Countdown list */}
        <Stack spacing={2} sx={{ maxHeight: "75vh", overflowY: "auto", pb: 2 }}>
          {countdowns.length === 0 && (
            <Typography color="text.secondary" align="center">
              No countdowns yet — click “Add New” to create one.
            </Typography>
          )}
          {countdowns.map((countdown) => (
            <Paper
              key={countdown.id}
              elevation={2}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "flex-start" : "center",
                justifyContent: "space-between",
                borderRadius: 2,
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {countdown.name}
                </Typography>
                <CountdownTimer deadline={countdown.deadline} />
              </Box>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: isMobile ? 1 : 0, flexWrap: "wrap" }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(true);
                    setEditingId(countdown.id);
                    setName(countdown.name);
                    setDeadline(dayjs(countdown.deadline));
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(countdown.id)}
                >
                  Delete
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>

        {/* Modal Form */}
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 3,
              p: isMobile ? 3 : 4,
              width: isMobile ? "90%" : 400,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={600} align="center">
                {isEditing ? "Edit Countdown" : "Create Countdown"}
              </Typography>
              <TextField
                label="Name"
                variant="outlined"
                value={nameInput}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <DateTimePicker
                label="Deadline"
                value={deadlineInput}
                onChange={(newValue) => newValue && setDeadline(newValue)}
                ampm={false}
                sx={{ width: "100%" }}
                slotProps={{
                  textField: { fullWidth: true },
                  popper: {
                    disablePortal: true,
                    modifiers: [
                      {
                        name: "preventOverflow",
                        options: {
                          altAxis: true,
                          tether: true,
                          boundary: "window",
                        },
                      },
                    ],
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: isEditing ? "#ffb300" : "#43a047",
                  "&:hover": { bgcolor: isEditing ? "#ffa000" : "#388e3c" },
                  fontWeight: 500,
                }}
                onClick={handleSubmit}
              >
                {isEditing ? "Update" : "Create"}
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
}

export default App;

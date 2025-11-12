const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres", // your db user
  host: "localhost",
  database: "countdown-db",
  password: "iammeghnak",
  port: 5432,
});

app.use(cors());
app.use(express.json());

app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/countdowns", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM countdowns.countdowns");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching countdowns");
  }
});

app.post("/countdowns", async (req, res) => {
  console.log("req.body", req.body);
  try {
    await pool.query(
      `INSERT INTO countdowns.countdowns (name, deadline) VALUES ('${req.body.name}', '${req.body.deadline}')`
    );
    res.status(201).send("Countdown created");
  } catch (err) {
    console.error(err);
  }
});

app.put("/countdowns", async (req, res) => {
  console.log("put request received for ID:", req.query.id);
  const { name, deadline } = req.body;
  const id = req.query.id;
  try {
    await pool.query(
      `UPDATE countdowns.countdowns
       SET name = $1, deadline = $2
       WHERE id = $3`,
      [name, deadline, id] // ✅ safely passed as parameters
    );

    res.send(`Update countdown with ID ${req.query.id}`);
  } catch (err) {
    console.error(err);
  }
});

app.delete("/countdowns", async (req, res) => {
  console.log("delete request received for ID:", req.query.id);
  try {
    await pool.query(
      `DELETE FROM countdowns.countdowns WHERE id=${req.query.id}`
    );
    res.send(`Delete countdown with ID ${req.query.id}`);
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
// postgresql://postgres:iammeghnak@localhost:5432/countdown-db

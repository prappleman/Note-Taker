const express = require("express");
const fs = require("fs").promises; // Use fs.promises for asynchronous file operations
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3002;
const dataFilePath = "./Develop/db/db.json";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/Develop/public", express.static(path.join(__dirname, "/Develop/public")));

let data = [];

// Load initial data from the file (async operation)
fs.readFile(dataFilePath, "utf8")
  .then((fileData) => (data = JSON.parse(fileData)))
  .catch((err) => console.error("Error reading data file:", err));

// HTML Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "/Develop/public/index.html")));
app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "/Develop/public/notes.html")));

// API Routes
app.get("/api/notes", (req, res) => res.json(data));

app.get("/api/notes/:id", (req, res) => {
  // Find and return a note by its ID
  res.json(data.find((note) => note.id === req.params.id));
});

app.post("/api/notes", async (req, res) => {
  // Create a new note with a unique ID
  const newNote = { ...req.body, id: data.length.toString() };
  data.push(newNote);

  try {
    // Write the updated data to the file (async operation)
    await fs.writeFile(dataFilePath, JSON.stringify(data));
    res.json(data);
  } catch (err) {
    console.error("Error writing data to file:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  // Remove a note by its ID
  data = data.filter((note) => note.id !== req.params.id);

  try {
    // Write the updated data to the file (async operation)
    await fs.writeFile(dataFilePath, JSON.stringify(data));
    res.json(data);
  } catch (err) {
    console.error("Error writing data to file:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log("App listening on PORT " + PORT));

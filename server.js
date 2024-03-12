const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "/Develop/public")));

// HTML Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/Develop/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/Develop/public/notes.html"));
});

// API Routes
const data = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));

app.get("/api/notes", (req, res) => {
  res.json(data);
});

app.get("/api/notes/:id", (req, res) => {
  res.json(data[Number(req.params.id)]);
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  const uniqueId = data.length.toString();
  newNote.id = uniqueId;
  data.push(newNote);

  fs.writeFileSync("./Develop/db/db.json", JSON.stringify(data), (err) => {
    if (err) throw err;
  });

  res.json(data);
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  let newId = 0;

  console.log(`Deleting note with id ${noteId}`);
  data = data.filter((currentNote) => currentNote.id !== noteId);

  for (const currentNote of data) {
    currentNote.id = newId.toString();
    newId++;
  }

  fs.writeFileSync("./Develop/db/db.json", JSON.stringify(data));
  res.json(data);
});

app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});

const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./Develop/db/db.json');
const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './Develop/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './Develop/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './Develop/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.json(notes.slice(1));
});

function createNewNote(noteText, notesArray) {
    const newNote = noteText;
    if (!Array.isArray(notesArray))
    notesArray = [];

if (notesArray.length === 0)
    notesArray.push(0);

body.id = notesArray[0];
notesArray[0]++;

notesArray.push(newNote);
fs.writeFileSync(
    path.join(__dirname, './Develop/db/db.json'),
    JSON.stringify(notesArray, null, 2)
);
return newNote;
}

// GET request for notes
app.get('/api/notes', (req, res) => {
  const newNote = createNewNote(req.noteText, notes);
  res.json(newNote)
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

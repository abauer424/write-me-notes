const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const util = require('util');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/style', (req, res) =>
  res.sendFile(path.join(__dirname, './public/assets/css/styles.css'))
);

// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, './public/index.html'))
// );
const readFile = util.promisify(fs.readFile)


function getNotes() {
 return readNotes().then(rawNotes => {
    let array = []
    try {
     array=array.concat(JSON.parse (rawNotes)) 
    } catch (error) {
      array=[]
    }
    return array
  })
}
// GET request for notes
app.get('/api/notes', (req, res) => {
  const newNote = createNewNote(req.noteText, notes);
  res.json(newNote)
  getNotes().then(notes => res.json(notes))
  .then(notes => console.log(notes))
});

app.post('/api/notes', (req, res) => {
  const newNote = createNewNote(req.body, allNotes);
  res.json(newNote);
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

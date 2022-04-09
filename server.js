const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./Develop/db/db.json');
const PORT = 3001;
const util = require('util');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./Develop/public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './Develop/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './Develop/public/notes.html'))
);

// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, './Develop/public/notes.html'))
// );
const readFile = util.promisify(fs.readFile)

function readNotes(){
return readFile('./Develop/db/db.json', 'utf-8')

}
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
  // const newNote = createNewNote(req.noteText, notes);
  // res.json(newNote)
  getNotes().then(notes => res.json(notes))
  // .then(notes => console.log(notes))
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

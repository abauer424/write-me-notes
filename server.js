const { v4: uuidv4 } = require('uuid');
const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const util = require('util');
const { receiveMessageOnPort } = require('worker_threads');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./public'));

// delivers home page tested
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);
// delivers notes page tested
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);


// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, './public/index.html'))
// );
const readFile = util.promisify(fs.readFile)
function readNotes(){
  return readFile('./db/db.json', 'utf-8')
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
const writeFile = util.promisify(fs.writeFile)
function writeNotes(notesArray){
  return writeFile('./db/db.json', JSON.stringify(notesArray))
}

// GET request for notes
app.get('/api/notes', (req, res) => {
 return getNotes().then(notes => {
   res.json(notes)
 }).catch(err => res.status(500).json(err))
});

app.post('/api/notes', async (req, res) => {
  var note =  {
    id:uuidv4(),
    title:req.body.title,
    text:req.body.text,
  }
  try {
    const notesArray = await getNotes();
    const newNotesArray = notesArray.concat(note);
    writeNotes(newNotesArray);
    return res.json({
      msg: "success",
    });
  } catch (err) {
    return res.status(500).json(err);
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
  
    const {title, text} = req.body;

    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuid.v4()
    };

    notes.push(newNote);

    const noteString = JSON.stringify(notes, null, 4)

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          fs.writeFile(
            './db/db.json',
            noteString,
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
    });
  
    const response = {
        status: 'success',
        body: newNote,
    };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
});

app.delete('/api/notes/:id', (req, res) => {
  const NOTES = JSON.parse(fs.readFileSync('./db/db.json'));
  const deleteNote = NOTES.filter((removeNote) => removeNote.id !== req.params.id);
  fs.writeFileSync('./db/db.json', JSON.stringify(deleteNote));
  res.json(deleteNote);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.listen(PORT, () => 
    console.log(`Example app listening at http://localhost:${PORT}`)
);
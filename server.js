const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid')
const fs = require('fs');
const notes = [];

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('/api/notes/:id', (req, res) => {
    console.log('hello')
    // Reads db.json file and returns the content as JSON
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        console.log(data);
        res.status(200).send(data);
    });
    const id = parseInt(req.params.id);
    const note = notes.find(note => note.id === id);

    if (note) {
        res.json(note);
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
});

app.post('/api/notes', (req, res) => {
    try {
        const newNote = req.body;
        newNote.id = uuid();

        // Reads existing notes from the db.json file
        const existingNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

        // Adds new not to existing notes
        existingNotes.push(newNote);

        // Writes updated notes back to db.json file
        fs.writeFileSync('./db/db.json', JSON.stringify(existingNotes));

        res.status(201).json(newNote);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Failed to create note' });
    }
    const { content } = req.body;
    const id = notes.length + 1;
    const note = { id, content };
    notes.push(note);
    res.status(201).json(note);
});

app.delete('/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    const index = notes.findIndex(note => note.id === noteId);

    if (index === -1) {
        return res.status(404).json({ message: 'Note not found' });
    }
    notes.splice(index, 1);
    return res.status(204).send();
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.listen(PORT, () => {
    const PORT = process.env.PORT || 3001;
    console.log(`Server is running on port ${PORT}`);

});
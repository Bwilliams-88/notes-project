const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid')
const fs = require('fs');
const notes = [];

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('/api/notes/', (req, res) => {
    
    // Reads db.json file and returns the content as JSON
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        
        res.status(200).send(data);
    });

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
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const existingNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const notes = existingNotes.filter(note => note.id !== noteId);

    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    return res.status(204).send();
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.listen(PORT, () => {
    const PORT = process.env.PORT || 3001;
    console.log(`Server is running on port ${PORT}`);

});
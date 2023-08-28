const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid')
const fs = require('fs');


const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(_dirname, './public/index.html'))
);

app.get('/api/notes', (req, res) => {
    // Reads db.json file and returns the content as JSON
    fs.readFile('db.json', 'urf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        try {
            const notes = JSON.parse(data);
            res.json(notes);
        } catch (parseError) {
            console.log(parseError);
            res.status(500).json({ error: 'Error parsing JSON data' });
        }
    });
});

app.post('/api/notes', (req, res) => {
    try {
        const newNote = req.body;
        newNote.id = uuid();

        // Reads existing notes from the db.json file
        const existingNotes = JSON.parse(fs.readFileSync('db.json', 'utf8'));

        // Adds new not to existing notes
        existingNotes.push(newNote);

        // Writes updated notes back to db.json file
        fs.writeFileSync('db.json', JSON.stringify(existingNotes));

        res.status(201).json(newNote);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Failed to create note' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
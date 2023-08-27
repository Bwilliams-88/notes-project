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

app.get('./api/notes', (req, res) => {
    res.json(`${req.method} request received to get notes`);
    console.info(`${req.method} request received to get notes`);
});

app.post('./api/notes', (req, res) => {
    console.info(`${req.method} request received to add a new note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            review_id: uuid(),
        };

        const noteString = JSON.stringify(newNote);

        fs.writeFile(`./db/${newNote}.json`, noteString, (err) => 
        err
            ? console.error(err)
            : console.log(`${newNote} has been added to your notes`
            ))
    

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
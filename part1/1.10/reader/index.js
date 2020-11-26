const express = require('express');
const fs = require('fs')
const path = require('path');
const { createBrotliCompress } = require('zlib');

const app = express();

const port = 3000;

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'logs.txt')

app.get('/', (req, res) => {
    res.set('Content-type', 'text/plain');
    let file = undefined
    try{
    file = fs.readFileSync(filePath)
    } catch(e) {
        console.log(e.message)
    }
    if (file) res.send(file);
    else {
        res.send('Server running... but file was not found');
    }
})

app.listen(port, () => console.log(`Server listening to port ${port}`))

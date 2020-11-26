const express = require('express');
const fs = require('fs')
const path = require('path');
const { createBrotliCompress } = require('zlib');

const app = express();

const port = 3000;

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePathLogs = path.join(directory, 'logs.txt')
const filePathPongs = path.join(directory, 'pongs.txt')

app.get('/', (req, res) => {
    res.set('Content-type', 'text/plain');
    let fileLogs = undefined
    let filePongs = undefined
    try {
        fileLogs = fs.readFileSync(filePathLogs)
    } catch (e) {
        console.log(e.message)
    }
    try {
        filePongs = fs.readFileSync(filePathPongs)
    } catch (e) {
        console.log(e.message)
    }
    if(filePongs) {
        fileLogs = fileLogs + '\n' + filePongs
    }
    if (fileLogs) res.send(fileLogs);

    else {
        res.send('Server running... but file was not found');
    }
})

app.listen(port, () => console.log(`Server listening to port ${port}`))

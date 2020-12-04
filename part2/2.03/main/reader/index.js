const express = require('express');
const fs = require('fs')
const path = require('path');
const axios = require('axios');

const app = express();

const port = 3000;

const API_URL='http://pingpong-svc'
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePathLogs = path.join(directory, 'logs.txt')
const fetchPongsHttp = async () => {
    try {
        const response = await axios.get(API_URL + '/getpongs');
        return response.data
    } catch (e) {
        console.log(e.message);
    }
}

app.get('/', async (req, res) => {
    res.set('Content-type', 'text/plain');
    let fileLogs = undefined
    const filePongs = await fetchPongsHttp();
    console.log(filePongs);
    try {
        fileLogs = fs.readFileSync(filePathLogs)
    } catch (e) {
        console.log(e.message)
    }

    if (filePongs) {
        fileLogs = fileLogs + '\n' + filePongs
    }
    if (fileLogs) res.send(fileLogs);

    else {
        res.send('Server running... but file was not found');
    }
})

app.listen(port, () => console.log(`Server listening to port ${port}`))

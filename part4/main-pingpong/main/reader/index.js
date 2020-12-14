const express = require('express');
const fs = require('fs')
const path = require('path');
const axios = require('axios');
require('dotenv')

const app = express();

const port = 3000;

const message = process.env.MESSAGE
const API_URL='http://pingpong-svc'
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePathLogs = path.join(directory, 'logs.txt')
const fetchPongsHttp = async () => {
    try {
        response = await axios.get(API_URL + '/getpongs');
        return response.data
    } catch (e) {
        console.log('error in fetching pongs: ', e.message);
    }
}
app.get('/healtz', async(req, res) => {
    const filePongs = await fetchPongsHttp();

    if(filePongs) return res.send(200)

    return res.send(404);
})

app.get('/', async (req, res) => {
    res.set('Content-type', 'text/plain');
    let fileLogs = undefined
    const filePongs = await fetchPongsHttp();
    try {
        fileLogs = fs.readFileSync(filePathLogs)
    } catch (e) {
        console.log(e.message)
    }

    if (filePongs) {
        fileLogs = fileLogs + '\n' + filePongs
    }
    if(message) fileLogs = message + '\n' + fileLogs
    if (fileLogs) res.send(fileLogs);

    else {
        res.send(message + 'Server running... but data was not found');
    }
})





app.listen(port, () => console.log(`Server listening to port ${port}`))

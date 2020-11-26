const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const paths = require('./utils/filepath');
const app = express();
app.use('/public', express.static(__dirname + '/public'));
const port = 3000;
const API_URL_PHOTOS = 'https://picsum.photos/1200'

let imageFound = false

const fetchImageFromWeb = async () => {
    const response = await axios.get(API_URL_PHOTOS, { responseType: 'stream' })
    response.data.pipe(fs.createWriteStream('./files/image.jpeg'))
    imageFound = true;
}
const fetchLogs = () => {
    let response = undefined
    try {
        response = fs.readFileSync(paths.pathLogs)
    } catch (e) {
        console.log('logs error: ', e.message)
    }
    return response
}

const fetchPongs = () => {
    let response = undefined
    try {
        response = fs.readFileSync(paths.pathPongs)
    } catch (e) {
        console.log('logs error: ', e.message)
    }
    return response
}

const fetchImage = () => {
    let response = undefined
    try {
        response = fs.readFileSync('./files/image.jpeg')
    } catch (e) {
        fetchImageFromWeb();
        console.log('logs error: ', e.message)
    }
    return response
}

app.get('/', async (req, res) => {
    let fileLogs = fetchLogs();
    const filePongs = fetchPongs();
    const fileImage = fetchImage();
    // if (filePongs) {
    //     fileLogs = fileLogs + '\n' + filePongs
    // }
    // if (fileImage) {
    //     res.sendFile(path.join(__dirname + '/index.html'));
    // }
    // if (fileLogs) res.send('/index.html', {root: __dirname });

    res.sendFile(path.join(__dirname + '/index.html'));
    // res.send('Server running... but file was not found');
})

app.listen(port, () => console.log(`Server listening to port ${port}`))

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');

const paths = require('./utils/filepath');
const app = express();
app.use('/files', express.static(__dirname + '/files'));
const port = 3000;
const API_URL_PHOTOS = 'https://picsum.photos/1200'


schedule.scheduleJob('* * 0 * * *', function () {
    console.log('fetching new image for today :)');
    fetchImageFromWeb();
});

const fetchImageFromWeb = async () => {
    const response = await axios.get(API_URL_PHOTOS, { responseType: 'stream' })
    response.data.pipe(fs.createWriteStream(paths.pathImage))
}

const fetchImage = () => {
    let response = undefined
    try {
        response = fs.readFileSync(paths.pathImage)
    } catch (e) {
        fetchImageFromWeb();
        console.log('logs error: ', e.message)
    }
    return response
}

app.get('/', async (req, res) => {
    const fileImage = fetchImage();

    res.sendFile(path.join(__dirname + '/index.html'));
    // res.send('Server running... but file was not found');
})

app.listen(port, () => console.log(`Server listening to port ${port}`))

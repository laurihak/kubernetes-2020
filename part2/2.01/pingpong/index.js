const express = require('express');
const app = express();

// const { savePongsToFile } = require('./pong.js');

const port = 3000;


let numberOfGets = 0
app.get('/', (req, res) => {
    res.set('text/plain');
    numberOfGets++
    // savePongsToFile(numberOfGets);
    console.log('someone fetched /pingpong')
    res.send('number of gets: ' + numberOfGets);
})

app.get('/getpongs', (req, res) => {
    res.set('text/plain');
    console.log('someone fetched /pingpong/getpongs')
    res.send('number of gets: ' + numberOfGets);
})
app.listen(port, () => console.log(`Server listening to port ${port}`))

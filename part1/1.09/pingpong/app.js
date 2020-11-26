const express = require('express');
const app = express();

const port = 3000;

let numberOfGets = 0
app.get('/', (req, res) => {
    numberOfGets++
    res.send('pong: ' + numberOfGets);
})

app.listen(port, () => console.log(`Server listening to port ${port}`))

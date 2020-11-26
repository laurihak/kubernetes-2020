const express = require('express');
const rnd = require('./crypto')
const app = express();

const port = 3000;
setInterval(() => rnd('console'), 5000);

app.get('/', (req, res) => {
    res.send('Server running...');
})
app.get('/info', (req, res) => {
    console.log('someone fetched info...')
    res.send(rnd());
})

app.listen(port, () => console.log(`Server listening to port ${port}`))

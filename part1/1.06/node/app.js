const express = require('express');

const port = 3000;
const app = express();

app.get('/', (req, res) => {
    res.send('Server is responding to get request')
})

app.listen(port, () => console.log(`Server listening to port ${port}`))

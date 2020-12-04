const { response } = require('express');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const { fetchImage } = require('./utils/fetcher')

app.use('/image', express.static('./files/image.jpeg'));


fetchImage();

let todos =
    [
        {
            content: 'Eating',
            type: 'todo'
        },
        {
            content: 'Sleeping',
            type: 'todo'
        },
        {
            content: 'Coding',
            type: 'todo'
        }
    ]


app.get('/todos', async (req, res) => {
    console.log('fetching todos')
    response.writeHead(200,{ 'Content-Type': 'application/json' })

    res.json(todos);
})

app.post('/todos', (req, res) => {
    const body = req.body;
    console.log('body now', body);

    if(body.content.length < 1  || body.content.length > 140) {
        console.log('error, too long or too short content');
        return res.status(400).json({
            error: 'content missing'
        })
    }
    else if (todos.find(todo => todo.content === body.content)) {
        console.log('same todo as you have added before')
        return res.status(409).send('You cannot add duplicate');
    }


    const todo = {
        content: body.content,
        type: body.type
    }
    try{
        todos = todos.concat(todo);
    } catch (e) {
        console.log('adding todo error: ', e.message)
        res.status(204).send('error adding todo');
    }
    res.status(201).send('todo created')
})

app.get('/', async (req, res) => {

    res.send('server is running');
})

app.listen(port, () => console.log(`Server listening to port ${port}`))

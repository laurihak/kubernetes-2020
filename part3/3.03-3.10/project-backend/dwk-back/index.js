const { response } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require("knex")({
  client: "pg",
  connection: {
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST || "postgres-svc",
    port: process.env.POSTGRES_PORT || 5432,
  },
});

const app = express();
app.use(cors());
app.use(bodyParser.json());



app.use(
  morgan(" :method :url :status :res[content-length] - :response-time ms")
);
const port = 3001;

const { fetchImage } = require("./utils/fetcher");

app.use("/api/image", express.static("./files/image.jpeg"));

fetchImage();

const makeTable = () => {
  return knex.schema
    .hasTable("todos")
    .then((exists) => {
      if (!exists) {
        return knex.schema
          .createTable("todos", (table) => {
            table.increments("id").primary();
            table.string("type");
            table.string("content");
          })
          .catch();
      }
    })
    .catch();
};

const getTodos = (request, response) => {
  makeTable().catch((e) => e);
  return knex("todos")
    .select("*")
    .then()
    .catch();
};

const postTodo = (todo) => {
  makeTable().catch((e) => e);
  return knex("todos")
    .insert(todo)
    .then()
    .catch();
};

app.get("/api/todos", async (request, response) => {
  const result = await getTodos().catch((e) => e);
  if (result) {
    response.json(result);
    return;
  }
  response.status(404).json([]);
  return;
});

app.post("/api/todos", (request, response) => {
  const body = request.body;
  if (body.content.length < 1) {
    return response.status(400).json({
      error: "Content too short",
    });
  } else if (body.content.length > 140) {
    return response.status(400).json({
      error: "Content too long",
    });
  }
  const todo = {
    content: body.content,
    type: body.type,
  };
  postTodo(todo)
    .then(response.status(201).send("todo created"))
    .catch((e) => e);
});

app.get("/api", (req, res) => {
  res.status(200).send("server is running, at api/");
});

app.get("/", (req, res) => {
  res.status(200).send("server is running");
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(port, () => console.log(`Server listening to port ${port}`));

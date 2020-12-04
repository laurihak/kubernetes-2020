const { response } = require("express");
const express = require("express");
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

const port = 3001;

const { fetchImage } = require("./utils/fetcher");

app.use("/image", express.static("./files/image.jpeg"));

fetchImage();

const makeTable = () => {
  console.log("attempting to make a table");
  return knex.schema
    .hasTable("todos")
    .then((exists) => {
      if (!exists) {
        console.log("table does not exist, making it now");
        return knex.schema
          .createTable("todos", (table) => {
            table.increments("id").primary();
            table.string("type");
            table.string("content");
          })
          .then(() => console.log("succesfully made the table"))
          .catch((e) => console.log("error in making table: ", e.message));
      }
    })
    .catch((e) => console.log("error in testing table: ", e.message));
};

const getTodos = (request, response) => {
  makeTable().catch((e) => console.log(e.message));
  return knex("todos")
    .select("*")
    .then((content) => {
      console.log("fetching todos from db");
      return content;
    })
    .catch((e) => console.log("fetching todos error: ", e.message));
};

const postTodo = (todo) => {
  makeTable().catch((e) => console.log(e.message));
  return knex("todos")
    .insert(todo)
    .then(() => console.log("inserted succesfuly"))
    .catch((e) => console.log("error inserting :", e.message));
};

app.get("/todos", async (req, res) => {
  console.log("fetching todos");
  const result = await getTodos()
  if (result) {
    res.json(result);
    return;
  }
  res.json([]);
  return;
});

app.post("/todos", (req, res) => {
  const body = req.body;
  console.log("body now", body);

  if (body.content.length < 1 || body.content.length > 140) {
    console.log("error, too long or too short content");
    return res.status(400).json({
      error: "content missing",
    });
  }
  const todo = {
    content: body.content,
    type: body.type,
  };
  postTodo(todo)
    .then(res.status(201).send("todo created"))
    .catch((e) => {
      console.log("adding todo error: ", e.message);
      res.status(204).send("error adding todo");
    });
});

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => console.log(`Server listening to port ${port}`));

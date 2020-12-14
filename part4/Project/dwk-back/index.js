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

const NATS = require("nats");
const nc = NATS.connect({
  url: process.env.NATS_URL || "nats://my-nats:4222",
  json: true,
});

nc.on("error", (error) => {
  console.log(error.message);
});
nc.on("connect", () => {
  console.log(`Client connected to nats: ${nc.url} `);
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

const testConnection = async (request, response) => {
  try {
    return knex("connection").select("*");
  } catch (e) {}
};

const getTodos = async (request, response) => {
  try {
    return await knex("todos").select("*");
  } catch (e) {}
};

const postTodo = async (todo) => {
  try {
    return await knex("todos").insert(todo);
  } catch (e) {}
};

const putTodo = async (id, done) => {
  try {
    return await knex("todos").where({ id: id }).update({ done: done });
  } catch (e) {}
};

const deleteTodo = async (id) => {
  try {
    return await knex("todos").where({ id: id }).delete();
  } catch (e) {
    console.log(e);
  }
};

app.get("/api/todos", async (request, response) => {
  const result = await getTodos();
  if (result) {
    return response.json(result);
  }
  return response.status(404).json([]);
});

app.post("/api/todos", async (request, response) => {
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
    done: false,
  };
  const todoPub = { method: "POST", ...todo };
  await publishTodo(todoPub);
  await postTodo(todo);
  return response.status(200).send("Todo created");
});

app.put("/api/todos/:id", async (request, response) => {
  const id = request.params.id;
  const todo = request.body;
  try {
    await putTodo(id, todo.done);
    const todoPub = { method: "PUT", ...todo };
    await publishTodo(todoPub);
    return response.status(200).send("Todo updated");
  } catch (e) {
    return response.status(400);
  }
});

app.delete("/api/todos/:id", async (request, response) => {
  const id = request.params.id;
  const todo = request.body;
  console.log("this is the body", request.body);
  try {
    await deleteTodo(id);
    const todoPub = { method: "DELETE", ...todo };
    await publishTodo(todoPub);
    return response.status(200).send("message deleted");
  } catch (e) {
    return response.status(400);
  }
});

const publishTodo = async (todoPub) => {
  nc.publish("todo_data", todoPub, () => {
    console.log("msg processed!");
  });
  return;
};

app.get("/api", (request, response) => {
  response.status(200).send("server is running, at api/");
});

app.get("/api/healtz", async (request, respond) => {
  try {
    const result = await testConnection();
    if (result) {
      return respond.status(200).json(result);
    }
    return respond.status(500);
  } catch (e) {
    return respond.status(500);
  }
});

app.get("/", (request, response) => {
  response.status(200).send("server is running");
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(port, () => console.log(`Server listening to port ${port}`));

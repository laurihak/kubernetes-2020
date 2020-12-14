const express = require("express");
const app = express();
const knex = require("knex")({
  client: "pg",
  connection: {
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST || "postgres-svc",
    port: process.env.PORT || 5432,
  },
});

const port = 3000;
let numberOfGets = undefined;

const getPongs = (request, response) => {
  let returnValue = 0;
  return knex("pongs")
    .select("value")
    .first()
    .then((value) => {
      console.log("value now", value);
      return value;
    })
    .catch((e) => console.log("fetching pongs error: ", e.message));
};


const updatePong = (request, response) => {
  return knex("pongs")
    .update({ value: numberOfGets })
    .then(() => console.log("updated pongs"))
    .catch((e) => console.log("updating error: ", e.message));
};

const fetchInitialValue = async () => {
  if (!numberOfGets) {
    const result = await getPongs();
    console.log('fetching initial value and this is the value: ', result)
    if (result) numberOfGets = result.value;
    else {
      numberOfGets = 0
    }
  }
};


app.get("/pingpong", async (req, res) => {
  await fetchInitialValue()
  console.log("someone fetched /pingpong");
  numberOfGets++;
  updatePong();
  res.send("number of gets: " + numberOfGets);
});

app.get("/getpongs", async (req, res) => {
  await fetchInitialValue()
  const response = await getPongs();
  if (response) {
    res.status(200).send("number of gets: " + response.value);
  }
  res.status(404).send("number of gets: value not found");
});
app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});
app.listen(port, () => console.log(`Server listening to port ${port}`));

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

const getPongs = async (request, response) => {
  await makeTable()
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

const makeTable = () => {
  console.log("attempting to make a table");
  return knex.schema
    .hasTable("pongs")
    .then((exists) => {
      if (!exists) {
        console.log("table does not exist, making it now");
        return knex.schema
          .createTable("pongs", (table) => {
            table.increments("id").primary();
            table.integer("value");
          })
          .then(() => {
            return knex("pongs")
              .insert({value: 0 })
              .then(() => console.log('inserting value now'))
              .catch((e) =>
                console.log("error inserting initvalue: ", e.message)
              );
          })
          .catch((e) => console.log("error in making table: ", e.message));
      }
    })
    .catch((e) => console.log("error in testing table: ", e.message));
};

const updatePong = async (request, response) => {
  await makeTable()
  return knex("pongs")
    .update({ value: numberOfGets })
    .then(() => console.log("updated pongs"))
    .catch((e) => console.log("updating error: ", e.message));
};

const fetchInitialValue = async () => {
  await makeTable()
  if (!numberOfGets) {
    const result = await getPongs();
    console.log('fetching initial value and this is the value: ', result)
    if (result) numberOfGets = result.value;
    else {
      numberOfGets = 0
    }
  }
};


app.get("/", async (req, res) => {
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
    res.send("number of gets: " + response.value);
  }
  res.send("number of gets: value not found");
});
app.listen(port, () => console.log(`Server listening to port ${port}`));

const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");

const databasePath = path.join(__dirname, "todoApplication.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/users/:userDetails/", async (request, response) => {
  const { userDetails } = request.params;
  const { username, password } = userDetails;
  const getUserQuery = `
    SELECT
      password
    FROM
      users
    WHERE
      username = ${username};`;
  const pw = await database.get(getTodoQuery);
  if (pw === password) {
    response.send("true");
  }
});

app.post("/users/", async (request, response) => {
  const { username, password } = request.body;
  const postTodoQuery = `
  INSERT INTO
    users (username, password)
  VALUES
    (${username}, '${password}');`;
  await database.run(postTodoQuery);
  response.send("user account created successfully");
});

module.exports = app;

const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");

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

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  console.log(password); // Ensure this line is within the route handler
  const secretKey = "yourSecretKey";
  const token = jwt.sign({ username: username }, secretKey, {
    expiresIn: "1h",
  });
  const getUserQuery = `
    SELECT
      password
    FROM
      users
    WHERE
      username = ?;
  `;
  const pw = await database.get(getUserQuery, [username]);
  console.log(pw);
  if (pw && pw.password === password) {
    console.log("true");
    response.json({ token });
  } else {
    console.log("false");
    response.send("Username and password did not match");
  }
});

app.post("/register/", async (request, response) => {
  const { username, password } = request.body;
  const InsertUserQuery = `
    INSERT INTO
    users (username, password)
    VALUES
    ('${username}', '${password}');
  `;
  await database.run(InsertUserQuery); // Use the correct query variable
  response.send("User account created successfully");
});

module.exports = app;

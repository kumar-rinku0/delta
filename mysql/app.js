const exp = require("constants");
const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.set("view engine", path.join(__dirname, "views"));
app.set(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "mydb",
  password: "pretence",
});

app.get("/", (req, res) => {
  let q = "SELECT * FROM students";
  try {
    connection.query(q, (err, results) => {
      if (err) throw err;
      res.status(200).render("home.ejs", { res: results });
    });
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).send("server error!!");
  }
});

app.get("/create", (req, res) => {
  res.render("create.ejs");
});

app.get("/delete/:id", (req, res) => {
  const { id } = req.params;
  res.render("delete.ejs", { id });
});

app.post("/delete", (req, res) => {
  const { id, password } = req.body;
  let q1 = `SELECT * FROM students WHERE id='${id}'`;
  let q2 = `DELETE FROM students WHERE id='${id}'`;
  try {
    connection.query(q1, (err, result) => {
      if (err) throw err;
      if (result[0].password.trim() != password.trim()) {
        res.send("incorrect password");
      } else {
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/");
        });
      }
    });
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).send("server error!!");
  }
});

app.post("/create", (req, res) => {
  const { username, password, email } = req.body;
  let q = `INSERT INTO studentS (id, usename, email, password) VALUES (?, ?, ?, ?)`;
  let array = [uuidv4().substring(0, 10), username, email, password];
  try {
    connection.query(q, array, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.status(200).redirect("/");
    });
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).send("server error!!");
  }
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log("server is listing on :", PORT);
});

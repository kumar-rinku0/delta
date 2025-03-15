import express from "express";
const app = express();
const port = 8000;

app.get("/api/status", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

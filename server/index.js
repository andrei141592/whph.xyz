const express = require("express");

const cors = require("cors");

const monk = require("monk");

const Filter = require("bad-words");

const rateLimit = require("express-rate-limit");

const app = express();

const db = monk(process.env.MONGO_URI || "localhost/meower");

const mews = db.get("mews");

const filter = new Filter();

const limiter = rateLimit({
  windowMs: 30 * 1000,
  max: 1,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Meower!",
  });
});

app.get("/mews", (req, res) => {
  mews
    .find() //if you don't pass anything, will just return everything
    .then((mews) => {
      res.json(mews);
    });
});

function isValidMews(mew) {
  return (
    mew.name &&
    mew.name.toString().trim() !== "" &&
    mew.content &&
    mew.content.toString().trim() !== ""
  );
}

app.use(limiter);

app.post("/mews", (req, res) => {
  if (isValidMews(req.body)) {
    const mew = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
      created: new Date(),
    };
    mews.insert(mew).then((createdMew) => {
      res.json(createdMew);
    });
  } else {
    res.status(422);
    res.json({
      message: "Hey! Name and Content are required!",
    });
  }
});

app.listen(5000, () => {
  console.log("Listening on http://localhost:5000");
});

console.log("Hello world!");

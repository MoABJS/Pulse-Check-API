import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<h1>You are a Dead Man, unless you ping!!!</h1>`);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});

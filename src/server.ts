import express from "express";
import Routes from "./routes/monitorsRoutes";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use("/", Routes);

app.get("/", (req, res) => {
  res.send(`<h1>You are a Dead Man, unless you ping!!!</h1>`);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});

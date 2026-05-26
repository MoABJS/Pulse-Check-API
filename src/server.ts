import express from "express";
import Routes from "./routes/monitorRoutes";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use("/", Routes);

app.get("/", (req, res) => {
  res.json({ message: "You are a dead man, unless you ping!!!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});

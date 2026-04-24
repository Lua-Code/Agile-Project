import express from "express";
import cors from "cors";

const app = express();

//Middlewarte stuff
app.use(cors());
app.use(express.json()); 

//Route stuff
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
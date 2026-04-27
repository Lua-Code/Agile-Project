import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

//Middlewarte stuff
app.use(cors());
app.use(express.json()); 

//Route stuff
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
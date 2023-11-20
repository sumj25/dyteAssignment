import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import route from "./routes/LogRoute.js";
import handleErrors from "./errorMiddleware.js"


const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
app.use(handleErrors);


const PORT = process.env.PORT || 8000;
const URL = process.env.MONGOURL;
const server = http.createServer(app);
const io = new Server(server);

mongoose
  .connect(URL)
  .then(() => {
    console.log("DB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

io.on("connection", (socket) => {
  console.log("A client connected");

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});
app.use("/api", route);

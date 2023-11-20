import express from "express";
import { create, getAll, getOne } from "../controller/LogController.js";

const route = express.Router();

route.post("/create", create);
route.get("/getall", getAll);
route.get("/getOne", getOne);

export default route;

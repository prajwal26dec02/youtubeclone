import express from "express";

import { login } from "../controllers/auth.js";
import {
  updateChannelData,
  getAllChannels,
  updatePoints,
} from "../controllers/channel.js";

const routes = express.Router();

routes.post("/login", login);
routes.patch("/update/:id", updateChannelData);
routes.get("/getAllChannels", getAllChannels);
routes.patch("/updatePoints/:id", updatePoints);

export default routes;

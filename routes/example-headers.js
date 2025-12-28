import express from "express";
import { getExampleHeaders } from "../controllers/example-headers.js";


const router = express.Router();

router.route("/")
  .get(getExampleHeaders)

export default router;

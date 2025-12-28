import express from "express";
import path from "path";

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 8000;
const TODOS_PATH = process.env.TODOS_PATH || path.join(__dirname, "data", "todos.json");
// const TODOS_PATH = process.env.TODOS_PATH || __dirname + "/data/todos.json";

import todos from "./routes/todos.js";
import exampleHeaders from "./routes/example-headers.js";
import { getConn, initDb } from "./utils/db.js";
// Body parser
app.use(express.json());

// Attaches db connection to req object
app.use(async (req, res, next) => {
  req.dbConn = await getConn();
  next();
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ================== ROUTES ===================

app.get("/", async (req, res) => {
  res.json({
    message: "Welcome to Todo List API",
    version: "1.0.0",
  });
});

app.use("/todos", todos);
app.use("/headers-example", exampleHeaders);

app.listen(PORT, async () => {
  await initDb();
  console.log(`Server is running on port ${PORT}...`);
});

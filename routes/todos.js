import express from "express";
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from "../controllers/todos.js";

const router = express.Router();

router.route("/")
  .get(getTodos)
  .post(createTodo);
router.route("/:id")
  .get(getTodo)
  .put(updateTodo)
  .delete(deleteTodo)

export default router;

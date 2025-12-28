import { getNextId, readTodos, writeTodos } from "../utils/todosStorage.js";
import path from "path";
const __dirname = path.resolve();
const TODOS_PATH = process.env.TODOS_PATH || path.join(__dirname, "data", "todos.json");

// {baseUrl}/todos
// {baseUrl}/todos?completed=true
// {baseUrl}/todos?completed=false
export const getTodos = async (req, res) => {
  try {
    const { completed } = req.query;

    const todosArr = await readTodos(TODOS_PATH);
    let filterdArr = todosArr;
    if (completed !== undefined) {
      filterdArr = todosArr.filter((todo) => String(todo.completed) === completed);
    }
    res.status(200).json({ msg: "success", data: filterdArr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, data: null });
  }
};

// {baseUrl}/todos/1
export const getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const intId = parseInt(id);
    if (isNaN(intId)) throw new Error("Invalid id, please use an integer.");
    const todos = await readTodos(TODOS_PATH);
    const todo = todos.find((t) => t.id === intId);
    if (!todo) {
      res.status(404).json({ success: false, data: {} });
    } else {
      res.status(200).json({ success: true, data: todo });
    }
  } catch (error) {
    res.status(500).json({ success: false, data: error.message });
  }
};

// {baseUrl}/todos/1
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const intId = parseInt(id);
    if (isNaN(intId)) throw new Error("Invalid id, please use an integer.");
    const todos = await readTodos(TODOS_PATH);
    const todo = todos.find((t) => t.id === intId);
    if (!todo) {
      res.status(404).json({ success: false, data: {} });
    } else {
      todo.title = body.title || todo.title;
      todo.description = body.description || todo.description;
      todo.completed = body.completed || todo.completed;
      todo.updated_at = new Date();
      await writeTodos(todos, TODOS_PATH);
      res.status(200).json({ success: true, data: todo });
    }
  } catch (error) {
    res.status(500).json({ success: false, data: error.message });
  }
};



// {baseUrl}/todos/1
export const deleteTodo =  async (req, res) => {
  try {
    const { id } = req.params;
    const intId = parseInt(id);
    if (isNaN(intId)) throw new Error("Invalid id, please use an integer.");
    const todos = await readTodos(TODOS_PATH);
    const todo = todos.find((t) => t.id === intId);
    if (!todo) {
      res.status(404).json({ success: false, data: {} });
    } else {
      const indexToDelete = todos.findIndex((t) => t.id === intId);
      todos.splice(indexToDelete, 1);
      await writeTodos(todos, TODOS_PATH);
      res.status(200).json({ success: true, data: {} });
    }
  } catch (error) {
    res.status(500).json({ success: false, data: error.message });
  }
};

// Create todo
export const createTodo = async (req, res) => {
  try {
    const todos = await readTodos(TODOS_PATH);

    const isCompleted = req.body.completed === "true";

    const newTodo = {
      title: req.body.title || "default todo",
      description: req.body.description || "",
      completed: isCompleted,
      id: getNextId(todos),
      created_at: new Date(),
      updated_at: new Date(),
    };
    todos.push(newTodo);
    await writeTodos(todos, TODOS_PATH);
    res.status(201).json({ msg: "success", data: req.body });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, data: null });
  }
};


// {baseUrl}/todos
// {baseUrl}/todos?completed=true
// {baseUrl}/todos?completed=false
export const getTodos = async (req, res) => {
  try {
    const { completed } = req.query;

    let results;
    if (completed !== undefined) {
      const isCompleted = completed === "true";
      results = await req.dbConn.query("SELECT * FROM todos WHERE completed = ?", isCompleted);
    }

    results = await req.dbConn.query("SELECT * FROM todos;");
    const todosArr = results[0];
    res.status(200).json({ msg: "success", data: todosArr });
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
    // const todos = await readTodos(TODOS_PATH);
    // const todo = todos.find((t) => t.id === intId);

    const results = await req.dbConn.query('SELECT * FROM todos WHERE id = ?', [intId]);
    const todo = results[0]

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
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const intId = parseInt(id);
    if (isNaN(intId)) throw new Error("Invalid id, please use an integer.");
    const resultsSelect = await req.dbConn.query("SELECT * FROM todos WHERE id = ?", [intId]);
    const todo = resultsSelect[0][0];
    console.log("todo", todo);
    if (!todo) {
      res
        .status(404)
        .json({ success: false, data: {}, message: `todo with the id of ${id} not found` });
    } else {
      const resultsDel = await req.dbConn.query("DELETE FROM todos WHERE id = ?", [todo.id]);
      console.log(resultsDel);
      res.status(200).json({ success: true, data: {} });
    }
  } catch (error) {
    res.status(500).json({ success: false, data: error.message });
  }
};

// Create todo
export const createTodo = async (req, res) => {
  try {
    const isCompleted = req.body.completed === "true" || req.body.completed === true;

    const now = new Date();

    const newTodo = {
      title: req.body.title || "default todo",
      description: req.body.description || "",
      completed: isCompleted,
      created_at: now,
      updated_at: now,
    };

    const result = await req.dbConn.query(
      "INSERT INTO todos (title, description, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      [
        newTodo.title,
        newTodo.description,
        newTodo.completed,
        newTodo.created_at,
        newTodo.updated_at,
      ]
    );

    const todo = await req.dbConn.query("SELECT * FROM todos WHERE id = ?", [result[0].insertId]);
    res.status(201).json({ msg: "success", data: todo[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, data: null });
  }
};



// {baseUrl}/todos/1
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const intId = parseInt(id);
    if (isNaN(intId)) throw new Error("Invalid id, please use an integer.");
    const results = await req.dbConn.query("SELECT * FROM todos WHERE id = ?", [intId]);
    const todo = results[0][0];
    if (!todo) {
      res
        .status(404)
        .json({ success: false, data: {}, message: `todo with the id of ${id} not found` });
    } else {
      // Build update query dynamically based on provided fields
      const updates = [];
      const params = [];

      if (body.title !== undefined) {
        updates.push("title = ?");
        params.push(body.title);
      }
      if (body.description !== undefined) {
        updates.push("description = ?");
        params.push(body.description);
      }
      if (body.completed !== undefined) {
        updates.push("completed = ?");
        // params.push(body.completed === true || body.completed === 'true' ? 1 : 0);
        params.push(body.completed === true || body.completed === "true");
      }

      // Always update updated_at
      updates.push("updated_at = ?");
      params.push(new Date());
      params.push(intId); // For WHERE clause

      const updateQuery = `UPDATE todos SET ${updates.join(", ")} WHERE id = ?`;
      await req.dbConn.query(updateQuery, params);

      // Fetch updated todo
      const updateResult = await req.dbConn.query("SELECT * FROM todos WHERE id = ?", [intId]);
      const todo = updateResult[0]

      res.status(200).json({ success: true, data: todo });
    }
  } catch (error) {
    res.status(500).json({ success: false, data: error.message });
  }
};
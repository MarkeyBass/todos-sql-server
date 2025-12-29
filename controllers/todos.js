// {baseUrl}/todos
// {baseUrl}/todos?completed=true
// {baseUrl}/todos?completed=false
export const getTodos = async (req, res) => {
  try {
    const { completed } = req.query;

    let results;
    let isCompleted;

    if (completed === "true") {
      isCompleted = true;
    } else if (completed === "false") {
      isCompleted = false;
    }

    // const isCompleted = completed === "true" ? true : completed === "false" ? false : undefined;

    if (completed !== undefined) {
      results = await req.dbConn.query("SELECT * FROM todos WHERE completed = ?;", isCompleted);
    } else {
      results = await req.dbConn.query("SELECT * FROM todos;");
    }

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

    const results = await req.dbConn.query("SELECT * FROM todos WHERE id = ?", [intId]);
    const todo = results[0][0];

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

    const results = await req.dbConn.query("SELECT * FROM todos WHERE id = ?", [intId]);
    const todo = results[0][0];
    if (!todo) {
      res
        .status(404)
        .json({ success: false, data: {}, message: `todo with the id of ${intId} not found` });
    } else {

      // Flow example:
      // ==============
      // const str = "UPDATE todos SET title = ?, completed = ?, updated_at = ? WHERE id = ?"
      // let updateQueryArr = ["title = ?", "completed = ?", "updated_at = ?"];
      // let updateQuery = "UPDATE todos SET" + updateQueryArr.join(", ") + "WHERE id = ?";
      // let sqlQueryParams = ["walk the dog" , true, new Date(), id];

      //// Build update query dynamically based on provided fields
      const updateQueryArr = [];
      const sqlQueryParams = [];

      if (body.title !== undefined) {
        updateQueryArr.push("title = ?");
        sqlQueryParams.push(body.title);
      }
      if (body.description !== undefined) {
        updateQueryArr.push("description = ?");
        sqlQueryParams.push(body.description);
      }
      if (body.completed !== undefined) {
        updateQueryArr.push("completed = ?");
        // sqlQueryParams.push(body.completed);
        sqlQueryParams.push(body.completed === true || body.completed === "true");
      }
      updateQueryArr.push("updated_at = ? ");
      sqlQueryParams.push(new Date());

      const updateQuery = `UPDATE todos SET ${updateQueryArr.join(", ")} WHERE id = ?`;
      sqlQueryParams.push(intId);

      await req.dbConn.query(updateQuery, sqlQueryParams);
      const updatedResults = await req.dbConn.query("SELECT * FROM todos WHERE id = ?", [intId]);
      const updatedTodo = updatedResults[0][0];
      res.status(200).json({ success: true, data: updatedTodo });
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
    const results = await req.dbConn.query("SELECT * FROM todos WHERE id = ?", [intId]);
    const todo = results[0][0];
    if (!todo) {
      res.status(404).json({ success: false, data: {}, message: `Todo with id ${id} not found` });
    } else {
      const resultsDel = await req.dbConn.query("DELETE FROM todos WHERE id = ?", [intId]);
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

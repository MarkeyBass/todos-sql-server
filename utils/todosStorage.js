import fs from "fs/promises";

// ==================== UTILITY FUNCTIONS ====================

export const getNextId = (todos) => {
  if (!todos || todos.length === 0) {
    return 1;
  }
  let maxValue = 0;
  todos.forEach((todo) => {
    if (todo.id > maxValue) {
      maxValue = todo.id;
    }
  });
  return maxValue + 1;
};

async function fileExists(filePath) {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Read todos from JSON file
 * @returns {Array} Array of todo objects
 */
export const readTodos = async (path) => {
  if (!(await fileExists(path))) {
    return [];
  }
  try {
    const data = await fs.readFile(path, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file is corrupted or empty, return empty array
    return [];
  }
};

/**
 * Write todos to JSON file
 * @param {Array} todos - Array of todo objects
 */
export const writeTodos = async (todos, path) => {
  await fs.writeFile(path, JSON.stringify(todos, null, 2), "utf8");
};
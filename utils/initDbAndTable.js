import mysql from "mysql2/promise"

export async function initDb() {
  const initConnection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 3306,
  });

  const CREATE_DB_QUERY = `CREATE DATABASE IF NOT EXISTS todos;`;
  const CREATE_TABLE_QUERY = `
      
      CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at DATETIME,
        updated_at DATETIME
      )
    `;

  await initConnection.query("USE todos;");
  await initConnection.query(CREATE_DB_QUERY);
  await initConnection.query(CREATE_TABLE_QUERY);
}

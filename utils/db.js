import mysql from "mysql2/promise";

export async function initDb() {
  const initConnection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 3306,
  });

  const CREATE_DB_QUERY = `CREATE DATABASE IF NOT EXISTS todos;`;

  const USE_DB_QUERY = "USE todos;";

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

  await initConnection.query(CREATE_DB_QUERY);
  await initConnection.query(USE_DB_QUERY);
  await initConnection.query(CREATE_TABLE_QUERY);

  await initConnection.end();
}

// import mysql from "mysql2/promise";
// // import dotenv from 'dotenv';

// // dotenv.config({ path: ".env" });

// const DB_CONFIG = {
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "root",
//   database: process.env.DB_NAME || "mydb",
//   port: process.env.DB_PORT || 3306,
// };

// // Module-level connection (singleton pattern)
// // For production, consider using connection pooling instead
// let connection = null;

// export async function getConn() {
//   if (connection) return connection;
//   else {
//     const dbConnection = await mysql.createConnection({
//       host: "localhost",
//       user: "root",
//       password: "root",
//       port: 3306,
//       database: "todos",
//     });
//     return dbConnection;
//   }
// }

// /**
//  * Close the MySQL connection
//  */
// export async function closeConnection() {
//   if (connection) {
//     await connection.end();
//     connection = null;
//     console.log('MySQL connection closed.');
//   }
// }

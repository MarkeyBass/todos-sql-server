import mysql from "mysql2/promise";
// import { getConn } from "../utils/initDbAndTable.js";

export async function createConn(req, res, next) {
  const dbConnection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 3306,
    database: "todos",
  });

  req.dbConn = dbConnection;
  // req.dbConn = await getConn();

  next();
}

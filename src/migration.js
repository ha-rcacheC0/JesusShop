const dbloader = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const db = dbloader(path.resolve(__dirname, "../database.db"));

const schema = fs.readFileSync(path.resolve(__dirname, "./schema.sql"), "utf8");

db.exec(schema);

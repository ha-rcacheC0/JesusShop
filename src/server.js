const dbloader = require("better-sqlite3");
const path = require("path");
const express = require("express");

const db = dbloader(path.resolve(__dirname, "../database.db"));

const app = express();
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "./public")));

// user's form table

app.post("/api/users", (req, res) => {
  // 1. Authorization
  if (!req.body.email || !req.body.contactReason) {
    res.sendStatus(400);
    return;
  }
  // 2. Input validation - sanatization

  // 3. Main operation
  try {
    const data = db
      .prepare(
        "INSERT INTO users (firstName, lastName, email, phone, contactReason) VALUES ($firstName, $lastName, $email, $phone, $contactReason)"
      )
      .run({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        contactReason: req.body.contactReason,
      });

    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(data.lastInsertRowid);
    // 4. Send response
    res.send(user);
  } catch (error) {
    if (error.code == "SQLITE_CONSTRAINT_UNIQUE") {
      res.sendStatus(400);
    } else {
      console.log(error);
      res.sendStatus(500);
    }
  }
});

app.get("/api/users", (req, res) => {
  // 1. Authorization

  // 2. Input validation - sanatization

  // 3. Main operation
  try {
    const data = db.prepare("SELECT * FROM users").all();

    if (!data) {
      throw { code: "NOT_FOUND" };
    }

    // 4. Send response
    res.send(data);
  } catch (error) {
    if (error.code == "NOT_FOUND") {
      res.sendStatus(404);
    } else {
      console.log(error);
      res.sendStatus(500);
    }
  }
});

app.get("/api/users/:id", (req, res) => {
  // authorization

  // input validation - sanitzation
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.sendStatus(400);
    return;
  }

  // main operation
  try {
    const data = db.prepare("SELECT * FROM users WHERE id = ?").get(id);

    if (!data) {
      throw { code: "NOT_FOUND" };
    }

    // Send response
    res.send(data);
  } catch (error) {
    if (error.code == "NOT_FOUND") {
      res.sendStatus(404);
    } else {
      console.log(error);
      res.sendStatus(500);
    }
  }
});

app.put("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // 1. Authorization
  if (isNaN(id)) {
    res.sendStatus(400);
    return;
  }
  // 2. Input validation - sanatization

  // 3. Main operation
  try {
    const result = db
      .prepare(
        `
        UPDATE users
        SET firstName = $firstName, lastName = $lastName, email = $email, phone = $phone, contactReason = $contactReason
        WHERE id = $id
      `
      )
      .run({
        id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        contactReason: req.body.contactReason,
      });

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);

    if (result.changes === 0) {
      res.sendStatus(404); // user not found
      return;
    }
    // 4. Send response
    res.send(user);
  } catch (error) {
    if (error.code == "SQLITE_CONSTRAINT_UNIQUE") {
      res.sendStatus(400);
    } else {
      console.log(error);
      res.sendStatus(500);
    }
  }
});

app.delete("/api/users/:id", (req, res) => {
  // authorization

  // input validation - sanitzation
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.sendStatus(400);
    return;
  }

  // main operation
  try {
    const data = db.prepare("DELETE FROM users WHERE id = ?").run(id);

    if (data.changes === 0) {
      throw { code: "NOT_FOUND" };
    }

    // Send response
    res.send(data);
  } catch (error) {
    if (error.code == "NOT_FOUND") {
      res.sendStatus(404);
    } else {
      console.log(error);
      res.sendStatus(500);
    }
  }
});

// products

app.post("/api/products", (req, res) => {
  const { gender, color, price, category, imageURL } = req.body;

  const result = db
    .prepare(
      "INSERT INTO products (gender, color, price, category, imageURL) VALUES (?, ?, ?, ?, ?)"
    )
    .run(gender, color, price, category, imageURL);

  res.json({ id: result.lastInsertRowid });
});

// app.get("/api/products", (req, res) => {
//   const products = db.prepare("SELECT * FROM products").all();

//   res.json(products);
// });

app.get("/api/products", (req, res) => {
  // 1. Authorization

  // 2. Input validation - sanatization

  // 3. Main operation
  try {
    const data = db.prepare("SELECT * FROM products").all();

    if (!data) {
      throw { code: "NOT_FOUND" };
    }

    // 4. Send response
    res.send(data);
  } catch (error) {
    if (error.code == "NOT_FOUND") {
      res.sendStatus(404);
    } else {
      console.log(error);
      res.sendStatus(500);
    }
  }
});

app.listen(3001);

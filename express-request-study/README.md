# Express Request Object - Complete Guide

## Table of Contents
1. [Introduction](#introduction)
2. [req.params](#reqparams)
3. [req.query](#reqquery)
4. [req.body](#reqbody)
5. [req.headers](#reqheaders)
6. [Complete Examples](#complete-examples)
7. [Best Practices](#best-practices)
8. [Common Mistakes](#common-mistakes)

---

## Introduction

The Express `req` (request) object contains information about the HTTP request. It has several properties that allow you to access different parts of the request:

- **req.params** - Route parameters (from URL path)
- **req.query** - Query string parameters (from URL query string)
- **req.body** - Request body data (from POST/PUT requests)
- **req.headers** - HTTP headers (from request headers)

---

## req.params

### What is req.params?

`req.params` contains route parameters extracted from the URL path. These are defined in your route using `:parameterName`.

### Route Definition

```javascript
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  res.json({ userId });
});
```

### Examples

#### Single Parameter

```javascript
// Route: GET /users/:id
// URL: GET /users/123
app.get("/users/:id", (req, res) => {
  console.log(req.params);        // { id: '123' }
  console.log(req.params.id);     // '123'
  
  res.json({
    message: `User ID: ${req.params.id}`
  });
});
```

#### Multiple Parameters

```javascript
// Route: GET /users/:userId/posts/:postId
// URL: GET /users/123/posts/456
app.get("/users/:userId/posts/:postId", (req, res) => {
  console.log(req.params);              // { userId: '123', postId: '456' }
  console.log(req.params.userId);       // '123'
  console.log(req.params.postId);       // '456'
  
  res.json({
    userId: req.params.userId,
    postId: req.params.postId
  });
});
```

#### Parameter with Type Conversion

```javascript
// Route: GET /todos/:id
// URL: GET /todos/123
app.get("/todos/:id", (req, res) => {
  // req.params.id is always a string
  const id = parseInt(req.params.id);  // Convert to number
  
  if (isNaN(id)) {
    return res.status(400).json({
      error: "Invalid ID format"
    });
  }
  
  res.json({ id });
});
```

### Key Points

- ✅ Parameters are always **strings**
- ✅ Parameter names must match route definition exactly
- ✅ Use `parseInt()` or `Number()` to convert to numbers
- ✅ Parameters are extracted from the URL path

---

## req.query

### What is req.query?

`req.query` contains query string parameters from the URL. These are the key-value pairs after the `?` in the URL.

### Examples

#### Single Query Parameter

```javascript
// URL: GET /search?q=javascript
app.get("/search", (req, res) => {
  console.log(req.query);        // { q: 'javascript' }
  console.log(req.query.q);      // 'javascript'
  
  res.json({
    searchTerm: req.query.q
  });
});
```

#### Multiple Query Parameters

```javascript
// URL: GET /products?category=electronics&price=100&sort=asc
app.get("/products", (req, res) => {
  console.log(req.query);
  // {
  //   category: 'electronics',
  //   price: '100',
  //   sort: 'asc'
  // }
  
  const { category, price, sort } = req.query;
  
  res.json({
    category,
    price: parseInt(price),  // Convert to number
    sort
  });
});
```

#### Optional Query Parameters

```javascript
// URL: GET /todos?completed=true
// URL: GET /todos (no query params)
app.get("/todos", (req, res) => {
  const { completed } = req.query;
  
  let filteredTodos = todos;
  
  // Check if parameter exists
  if (completed !== undefined) {
    const isCompleted = completed === "true";
    filteredTodos = todos.filter(todo => todo.completed === isCompleted);
  }
  
  res.json(filteredTodos);
});
```

#### Array Query Parameters

```javascript
// URL: GET /tags?tags=javascript&tags=nodejs&tags=express
app.get("/tags", (req, res) => {
  console.log(req.query.tags);  // ['javascript', 'nodejs', 'express']
  
  // Or as string if single value
  // URL: GET /tags?tags=javascript
  // req.query.tags would be 'javascript'
  
  const tags = Array.isArray(req.query.tags) 
    ? req.query.tags 
    : [req.query.tags].filter(Boolean);
  
  res.json({ tags });
});
```

#### Boolean Query Parameters

```javascript
// URL: GET /api/data?includeDeleted=true
app.get("/api/data", (req, res) => {
  const { includeDeleted } = req.query;
  
  // Query params are always strings
  const shouldInclude = includeDeleted === "true";
  
  res.json({
    includeDeleted: shouldInclude
  });
});
```

### Key Points

- ✅ Query parameters are always **strings**
- ✅ Use `parseInt()` or `Number()` to convert to numbers
- ✅ Use `=== "true"` to convert to boolean
- ✅ Parameters are optional (can be undefined)
- ✅ Multiple values create arrays

---

## req.body

### What is req.body?

`req.body` contains data from the request body. This is typically used for POST, PUT, and PATCH requests. **You need middleware to parse the body** (like `express.json()`).

### Setup Required

```javascript
import express from "express";

const app = express();

// Middleware to parse JSON bodies - This is what we use in rest APIs
app.use(express.json());

// Middleware to parse URL-encoded bodies - Less common in modern applications
app.use(express.urlencoded({ extended: true }));
```

### Examples

#### POST Request with JSON Body

```javascript
// POST /users
// Body: { "name": "John", "email": "john@example.com" }
app.post("/users", (req, res) => {
  console.log(req.body);
  // {
  //   name: 'John',
  //   email: 'john@example.com'
  // }
  
  const { name, email } = req.body;
  
  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({
      error: "Name and email are required"
    });
  }
  
  res.status(201).json({
    message: "User created",
    user: { name, email }
  });
});
```

#### PUT Request with Partial Data

```javascript
// PUT /todos/:id
// Body: { "title": "Updated title", "completed": true }
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  
  // Only update provided fields
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (completed !== undefined) updates.completed = completed;
  
  res.json({
    message: "Todo updated",
    id,
    updates
  });
});
```

#### Nested Objects in Body

```javascript
// POST /users
// Body: {
//   "name": "John",
//   "address": {
//     "street": "123 Main St",
//     "city": "New York"
//   }
// }
app.post("/users", (req, res) => {
  const { name, address } = req.body;
  
  console.log(address.street);  // '123 Main St'
  console.log(address.city);    // 'New York'
  
  res.json({ name, address });
});
```

#### Array in Body

```javascript
// POST /todos/batch
// Body: {
//   "todos": [
//     { "title": "Todo 1" },
//     { "title": "Todo 2" }
//   ]
// }
app.post("/todos/batch", (req, res) => {
  const { todos } = req.body;
  
  if (!Array.isArray(todos)) {
    return res.status(400).json({
      error: "todos must be an array"
    });
  }
  
  res.json({
    message: `Created ${todos.length} todos`,
    todos
  });
});
```

### Key Points

- ✅ Requires middleware: `app.use(express.json())`
- ✅ Only available for POST, PUT, PATCH requests
- ✅ Data types are preserved (numbers, booleans, objects, arrays)
- ✅ Always validate and sanitize input
- ✅ Check for required fields

---

## req.headers

### What is req.headers?

`req.headers` contains HTTP headers sent by the client. Headers are case-insensitive, but Express normalizes them to lowercase.

### Examples

#### Accessing Headers

```javascript
app.get("/api/data", (req, res) => {
  // Headers are normalized to lowercase
  console.log(req.headers);
  // {
  //   'content-type': 'application/json',
  //   'authorization': 'Bearer token123',
  //   'user-agent': 'Mozilla/5.0...',
  //   'accept': 'application/json'
  // }
  
  // Access specific headers
  const authHeader = req.headers.authorization;
  const contentType = req.headers['content-type'];
  
  res.json({ authHeader, contentType });
});
```

#### Authorization Header

```javascript
// GET /api/protected
// Headers: Authorization: Bearer token123
app.get("/api/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      error: "Authorization header required"
    });
  }
  
  // Extract token from "Bearer token123"
  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({
      error: "Invalid authorization format"
    });
  }
  
  res.json({
    message: "Access granted",
    token
  });
});
```

#### Content-Type Header

```javascript
app.post("/api/data", (req, res) => {
  const contentType = req.headers['content-type'];
  
  if (contentType !== 'application/json') {
    return res.status(400).json({
      error: "Content-Type must be application/json"
    });
  }
  
  res.json({ message: "Data received" });
});
```

#### Custom Headers

```javascript
// GET /api/data
// Headers: X-API-Key: secret123
app.get("/api/data", (req, res) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      error: "API key required"
    });
  }
  
  if (apiKey !== 'secret123') {
    return res.status(403).json({
      error: "Invalid API key"
    });
  }
  
  res.json({ message: "Data accessed" });
});
```

#### User-Agent Header

```javascript
app.get("/api/info", (req, res) => {
  const userAgent = req.headers['user-agent'];
  
  // Detect browser/device
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
  
  res.json({
    userAgent,
    isMobile
  });
});
```

#### Accept Header

```javascript
app.get("/api/data", (req, res) => {
  const accept = req.headers.accept;
  
  // Check if client accepts JSON
  if (accept && accept.includes('application/json')) {
    res.json({ data: "JSON response" });
  } else {
    res.send("Plain text response");
  }
});
```

### Key Points

- ✅ Headers are **case-insensitive** (normalized to lowercase)
- ✅ Use lowercase when accessing: `req.headers.authorization`
- ✅ Custom headers use `x-` prefix (convention)
- ✅ Always validate and sanitize header values
- ✅ Some headers are set automatically by browsers

---

## Complete Examples

### Example 1: Todo API with All Request Properties

```javascript
import express from "express";

const app = express();
app.use(express.json());

// GET /todos?completed=true&limit=10
app.get("/todos", (req, res) => {
  const { completed, limit } = req.query;  // Query parameters
  const authToken = req.headers.authorization;  // Header
  
  // Filter logic
  let filteredTodos = todos;
  
  if (completed !== undefined) {
    filteredTodos = filteredTodos.filter(
      todo => todo.completed === (completed === "true")
    );
  }
  
  if (limit) {
    filteredTodos = filteredTodos.slice(0, parseInt(limit));
  }
  
  res.json({
    todos: filteredTodos,
    count: filteredTodos.length
  });
});

// GET /todos/:id
app.get("/todos/:id", (req, res) => {
  const { id } = req.params;  // Route parameter
  const todoId = parseInt(id);
  
  const todo = todos.find(t => t.id === todoId);
  
  if (!todo) {
    return res.status(404).json({
      error: `Todo not found with ID ${id}`
    });
  }
  
  res.json(todo);
});

// POST /todos
app.post("/todos", (req, res) => {
  const { title, description, completed } = req.body;  // Request body
  const userId = req.headers['x-user-id'];  // Custom header
  
  if (!title) {
    return res.status(400).json({
      error: "Title is required"
    });
  }
  
  const newTodo = {
    id: todos.length + 1,
    title,
    description: description || null,
    completed: completed || false,
    userId: userId || null
  };
  
  todos.push(newTodo);
  
  res.status(201).json(newTodo);
});

// PUT /todos/:id
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;  // Route parameter
  const { title, description, completed } = req.body;  // Request body
  const todoId = parseInt(id);
  
  const todoIndex = todos.findIndex(t => t.id === todoId);
  
  if (todoIndex === -1) {
    return res.status(404).json({
      error: `Todo not found with ID ${id}`
    });
  }
  
  // Update only provided fields
  if (title !== undefined) todos[todoIndex].title = title;
  if (description !== undefined) todos[todoIndex].description = description;
  if (completed !== undefined) todos[todoIndex].completed = completed;
  
  res.json(todos[todoIndex]);
});

app.listen(3000);
```

### Example 2: User Authentication

```javascript
import express from "express";

const app = express();
app.use(express.json());

// POST /login
// Body: { "email": "user@example.com", "password": "password123" }
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required"
    });
  }
  
  // Simulate authentication
  if (email === "user@example.com" && password === "password123") {
    const token = "jwt-token-here";
    
    res.json({
      success: true,
      token
    });
  } else {
    res.status(401).json({
      error: "Invalid credentials"
    });
  }
});

// GET /profile
// Headers: Authorization: Bearer jwt-token-here
app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authorization header required"
    });
  }
  
  const token = authHeader.split(" ")[1];
  
  // Validate token (simplified)
  if (token === "jwt-token-here") {
    res.json({
      user: {
        id: 1,
        email: "user@example.com",
        name: "John Doe"
      }
    });
  } else {
    res.status(401).json({
      error: "Invalid token"
    });
  }
});
```

---

## Best Practices

### 1. Always Validate Input

```javascript
// ❌ BAD - No validation
app.post("/users", (req, res) => {
  const { email } = req.body;
  // What if email is undefined or invalid?
});

// ✅ GOOD - Validate input
app.post("/users", (req, res) => {
  const { email, name } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({
      error: "Email and name are required"
    });
  }
  
  if (!email.includes("@")) {
    return res.status(400).json({
      error: "Invalid email format"
    });
  }
});
```

### 2. Convert Types When Needed

```javascript
// ❌ BAD - Using string as number
app.get("/todos/:id", (req, res) => {
  const id = req.params.id;  // This is a string!
  // Comparing string to number won't work correctly
});

// ✅ GOOD - Convert to number
app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({
      error: "Invalid ID format"
    });
  }
});
```

### 3. Use Destructuring

```javascript
// ❌ BAD - Verbose
const title = req.body.title;
const description = req.body.description;
const completed = req.body.completed;

// ✅ GOOD - Clean and readable
const { title, description, completed } = req.body;
```

### 4. Handle Optional Parameters

```javascript
// ✅ GOOD - Check for undefined
app.get("/todos", (req, res) => {
  const { completed, limit } = req.query;
  
  let filteredTodos = todos;
  
  // Only filter if parameter exists
  if (completed !== undefined) {
    filteredTodos = filteredTodos.filter(
      todo => todo.completed === (completed === "true")
    );
  }
  
  // Only limit if parameter exists
  if (limit) {
    filteredTodos = filteredTodos.slice(0, parseInt(limit));
  }
  
  res.json(filteredTodos);
});
```

### 5. Sanitize Header Values

```javascript
// ✅ GOOD - Sanitize and validate headers
app.get("/api/data", (req, res) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: "API key required" });
  }
  
  // Sanitize: remove whitespace, convert to lowercase
  const sanitizedKey = apiKey.trim().toLowerCase();
  
  // Validate
  if (sanitizedKey.length < 10) {
    return res.status(400).json({ error: "Invalid API key format" });
  }
  
  res.json({ message: "Access granted" });
});
```

---

## Common Mistakes

### Mistake 1: Forgetting to Parse Numbers

```javascript
// ❌ WRONG
app.get("/todos/:id", (req, res) => {
  const id = req.params.id;  // String: "123"
  const todo = todos.find(t => t.id === id);  // Won't match!
});

// ✅ CORRECT
app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);  // Number: 123
  const todo = todos.find(t => t.id === id);  // Matches!
});
```

### Mistake 2: Not Checking for Undefined

```javascript
// ❌ WRONG
app.get("/todos", (req, res) => {
  const completed = req.query.completed;
  const isCompleted = completed === "true";  // Error if completed is undefined
});

// ✅ CORRECT
app.get("/todos", (req, res) => {
  const { completed } = req.query;
  
  if (completed !== undefined) {
    const isCompleted = completed === "true";
    // Use isCompleted
  }
});
```

### Mistake 3: Forgetting express.json() Middleware

```javascript
// ❌ WRONG - req.body will be undefined
const app = express();
// Missing: app.use(express.json());

app.post("/users", (req, res) => {
  console.log(req.body);  // undefined!
});

// ✅ CORRECT
const app = express();
app.use(express.json());  // Required for req.body

app.post("/users", (req, res) => {
  console.log(req.body);  // Works!
});
```

### Mistake 4: Case Sensitivity in Headers

```javascript
// ❌ WRONG - Headers are lowercase
const authHeader = req.headers.Authorization;  // undefined

// ✅ CORRECT - Use lowercase
const authHeader = req.headers.authorization;  // Works!
```

### Mistake 5: Not Validating Required Fields

```javascript
// ❌ WRONG - No validation
app.post("/users", (req, res) => {
  const { email, name } = req.body;
  // What if email or name is missing?
  createUser(email, name);
});

// ✅ CORRECT - Validate first
app.post("/users", (req, res) => {
  const { email, name } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({
      error: "Email and name are required"
    });
  }
  
  createUser(email, name);
});
```

---

## Summary

| Property | Source | Type | When to Use |
|----------|--------|------|-------------|
| `req.params` | URL path (`:id`) | String | Route parameters (IDs, slugs) |
| `req.query` | Query string (`?key=value`) | String | Filters, pagination, search |
| `req.body` | Request body | Any (JSON) | POST/PUT data, form submissions |
| `req.headers` | HTTP headers | String | Authentication, content type, custom headers |

### Quick Reference

```javascript
// Route: GET /users/:id/posts?page=1&limit=10
// Headers: Authorization: Bearer token123
// Body: { "title": "New Post" }

app.get("/users/:id/posts", (req, res) => {
  // Route parameter
  const userId = parseInt(req.params.id);  // "123" -> 123
  
  // Query parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Headers
  const token = req.headers.authorization;
  
  // Body (for POST/PUT)
  // const { title } = req.body;
});
```

---

## Additional Resources

- [Express Request Object Documentation](https://expressjs.com/en/api.html#req)
- [HTTP Headers Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [URL Parameters Guide](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL)


const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'todos.json');

// Load todos from file
const readTodos = () => {
   const data = fs.readFileSync(DATA_FILE);
   return JSON.parse(data);
};

// Write todos to file
const writeTodos = (todos) => {
   fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
};

// 1. Get all todo
app.get('/api/todos', (req, res) => {
   const todos = readTodos();
   res.json(todos);
});

// 2. Get a single todo by ID
app.get('/api/todos/:id', (req, res) => {
   const todos = readTodos();
   const todo = todos.find(t => t.id === parseInt(req.params.id));
   if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
   }
   res.json(todo);
});

// 3. Create a new todo
app.post('/api/todos', (req, res) => {
   const todos = readTodos();
   const newTodo = {
      id: todos.length ? todos[todos.length - 1].id + 1 : 1,
      topic: req.body.topic,
      task: req.body.task,
      priority: req.body.priority || 'Medium',
      status: req.body.status || 'Pending',
      dateline: req.body.dateline || null
   };
   todos.push(newTodo);
   writeTodos(todos);
   res.status(201).json(newTodo);
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
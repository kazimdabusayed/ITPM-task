const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'todos.json');

// Load todos from file
const readTodos = () => {
   const data = fs.readFileSync(DATA_FILE, 'utf-8');
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
   const {topic, task, priority, status, deadline} = req.body;

   if (!topic || !task) {
		return res.status(400).json({
			error: 'Topic and task are required',
		});
	}

   const newTodo = {
      id: todos.length ? todos[todos.length - 1].id + 1 : 1,
      topic,
      task,
      priority: priority || 'Medium',
      status: status || 'Pending',
      deadline: deadline || null
   };
   todos.push(newTodo);
   writeTodos(todos);
   res.status(201).json(newTodo);
});

// 4. Update todo
app.put('/api/todos/:id', (req, res) => {
   const todos = readTodos();
   const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
   if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
   }
   todos[todoIndex] = { ...todos[todoIndex], ...req.body };
   writeTodos(todos);
   res.json(todos[todoIndex]);
});

// 5. Delete todo
app.delete('/api/todos/:id', (req, res) => {
	let todos = readTodos();
	const idToMatch = parseInt(req.params.id);
	const todoExists = todos.some((t) => t.id === idToMatch);

	if (!todoExists) {
		return res.status(404).json({ error: 'Todo not found' });
	}

	const updatedTodos = todos.filter((t) => t.id !== idToMatch);
	writeTodos(updatedTodos);
	res.json({ message: 'Todo deleted successfully' });
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
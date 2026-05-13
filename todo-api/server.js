const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;
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
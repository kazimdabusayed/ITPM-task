const express = require('express');
const app = express();
const port = 5000;

const students = [
   { id: 1, name: 'Arafat', age: 21, major: 'Computer Science' },
   { id: 2, name: 'Ryhan', age: 22, major: 'Mathematics' },
   { id: 3, name: 'Plabon', age: 20, major: 'Physics' }
];

app.get('/students', (req, res) => {
   res.json(students);
});

app.get('/student/:id', (req, res) => {
   const studentId = parseInt(req.params.id);
   const student = students.find(s => s.id === studentId);

   if (!student) {
      return res.status(404).json({ message: `Student ID ${studentId} not found` });
   }
   res.json(student);
});


app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
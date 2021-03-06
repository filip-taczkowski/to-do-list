const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [
  {id: 1, name: 'Shopping'},
  {id: 2, name: 'Go out with a dog'},
];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    console.log(`New task found: ${task}`);
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  
  socket.on('removeTask', (index) => {
    console.log(`Task ${index} has been removed`);
    tasks.splice(index, 1);
    socket.broadcast.emit('removeTask', index);
  });
})

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
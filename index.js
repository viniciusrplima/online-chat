
const express = require('express');
const socketio = require('socket.io');
const path = require('path');

const PORT = 3000;
let connections = [];
const app = express();

app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());

const server = app.listen(3000, err => {
    if(err) {
        console.log(err);
    }
    else {
        console.log(`Server runnning on port ${PORT}`);
    }
})

const io = socketio.listen(server);

io.on('connection', socket => {
    connections.push({
        id: socket.id
    });

    console.log(`${socket.id} connected`);

    socket.on('newpost', post => {
        // Notify all users except who sent the message
        notifyAllWithException('newpost', post, socket.id);
    });

    socket.on('disconnect', () => {
        connections = connections.filter(connection => {
            return connection.id != socket.id;
        });
        console.log(`${socket.id} disconnected`);
    });

});

function notifyAllWithException(message, data, exceptID) {
    connections.forEach(connection => {
        if(connection.id != exceptID) {
            io.to(connection.id).emit(message, data);
        }
    });
}
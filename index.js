const express = require('express');
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());

const path = require('path'); 
const socketIO = require('socket.io');

const http = require('http');

const publicPath = path.join(__dirname, "./public"); 

app.use(express.static(publicPath));

const server = http.createServer(app);
const io = socketIO(server);


const { generateMessage } = require('./public/message');

io.on('connection', (socket) => {
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message));
        callback('Server take it');
    })    
})

const userRouter = require('./routes/user.routes');
app.use('/', userRouter);

const start = () => {
    try {
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start();

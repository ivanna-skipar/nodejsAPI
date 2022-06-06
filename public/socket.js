const socket = io();

socket.on('connect', () => {
    console.log('socket.js file');
    console.log(`connected to server`);
}); 

socket.on('disconnect', () => {
    console.log(`disconnected from server`)
});


socket.on('newMessage', (message) => {
    console.log('newMessage: ', message)
});

socket.emit('createMessage', {
    message: 'Some text'
}, function (message) {
    console.log(message)
});
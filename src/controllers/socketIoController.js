import 'dotenv/config';
import connection from '../config/connectDB.js';

const sendMessageAdmin = (io) => {
    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('data-server', (msg) => {
            io.emit('data-server', msg);
        });

        socket.on('data-server_2', (msg) => {
            // If msg is already a string (JSON), emit as is
            // If it's an object, stringify it
            const message = typeof msg === 'string' ? msg : JSON.stringify(msg);
            io.emit('data-server_2', message);
        });

        socket.on('data-server-5', (msg) => {
            io.emit('data-server-5', msg);
        });

        socket.on('data-server-3', (msg) => {
            io.emit('data-server-3', msg);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
} 

export default {
    sendMessageAdmin,
}
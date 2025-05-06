import { Server } from 'socket.io';
import getDBConnection from './database.js';

export default async function initializeSocket(server) {
    const db = await getDBConnection('MSH_CONTACTAPP');

    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });

    // Map to store active users: { username: socket.id }
    const users = new Map();

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Handle login
        socket.on('login', (username) => {
            console.log(`${username} logged in`);
            users.set(username, socket.id); // store the user

            // Optional: Broadcast user joined
            socket.broadcast.emit('user_joined', username);
        });

        socket.on('send_message', async (data) => {
            io.emit('receive_message', data);

            try {
                const { text, sender, receiver, timestamp } = data;
                await db.collection('Chat').insertOne({ text, sender, receiver, timestamp: new Date(timestamp), IsAccessible: true });
            } catch (err) {
                console.error('Failed to save chat:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);

            // Remove from users map
            for (let [user, id] of users.entries()) {
                if (id === socket.id) {
                    users.delete(user);
                    console.log(`${user} removed from active users`);
                    break;
                }
            }
        });
    });

    console.log("Socket.io initialized");
}
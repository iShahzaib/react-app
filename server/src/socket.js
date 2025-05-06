import { Server } from 'socket.io';

export default function initializeSocket(server) {
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

        socket.on('send_message', (data) => {
            io.emit('receive_message', data);
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
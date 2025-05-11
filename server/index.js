import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import initializeSocket from './src/socket.js';
import noauthRouter from './src/noauth.js';
import router from './src/route.js';

const PORT = 9000;

const app = express();
app.use(cors());
app.use(express.json()); // <-- This parses JSON request bodies

const server = http.createServer(app);

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

// app.use('/', (req, res) => {
//     console.log('Hello world!');
//     res.send('Hello from route.js!');
// })

// const insertDoc = async (data) => {
//     const db = await getDBConnection('MSH_CONTACTAPP');
//     db.collection('Schema').insertMany(data);
// };
// insertDoc();

app.use('/api/noauth', noauthRouter);

app.use('/api', authenticateToken, router);

initializeSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
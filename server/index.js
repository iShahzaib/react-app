import 'dotenv/config';
import express from 'express';
import mongodb from 'mongodb';
import http from 'http';
import getDBConnection from './src/database.js';
import cors from 'cors';
import initializeSocket from './src/socket.js';

const PORT = 9000;

const app = express();
app.use(cors());
app.use(express.json()); // <-- This parses JSON request bodies

const server = http.createServer(app);

app.use('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const db = await getDBConnection('MSH_CONTACTAPP');

        const users = await db.collection('User').findOne({ username, password, IsAccessible: true });

        res.status(201).json(users);
    } catch (err) {
        console.error("Error in user registration:", err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

app.use('/api/getdocdata', async (req, res) => {
    try {
        const collectionName = req.query.collection;

        const db = await getDBConnection('MSH_CONTACTAPP');

        const data = await db.collection(collectionName).find({ IsAccessible: true }).toArray();

        res.status(201).json(data);
    } catch (err) {
        console.error("Error in get api:", err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

app.use('/api/adddocdata', async (req, res) => {
    try {
        const { collection, data } = req.body;

        const db = await getDBConnection('MSH_CONTACTAPP');

        const existingUser = await db.collection(collection).findOne({ email: data.email, IsAccessible: true });
        if (existingUser) {
            return res.status(201).json({ message: 'Email already exists.' });
        }

        data['IsAccessible'] = true;
        const result = await db.collection(collection).insertOne(data);

        res.status(201).json(result);
    } catch (err) {
        console.error("Error in add api:", err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

app.use('/api/updatedocdata', async (req, res) => {
    try {
        const { collection, data } = req.body;

        const db = await getDBConnection('MSH_CONTACTAPP');

        const documentID = mongodb.ObjectId.createFromHexString(data._id);
        delete data._id;

        const result = await db.collection(collection).updateOne({ _id: documentID }, { $set: data });

        res.status(201).json(result);
    } catch (err) {
        console.error("Error in update api:", err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

app.use('/api/deletedocdata', async (req, res) => {
    try {
        const { collection, data } = req.body;

        const db = await getDBConnection('MSH_CONTACTAPP');

        const documentID = mongodb.ObjectId.createFromHexString(data._id);

        const result = await db.collection(collection).updateOne({ _id: documentID }, { $set: { IsAccessible: false } });

        res.status(201).json(result);
    } catch (err) {
        console.error("Error in delete api:", err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

app.use('/api/getchats', async (req, res) => {
    try {
        const { participants } = req.body;

        const db = await getDBConnection('MSH_CONTACTAPP');

        // const messages = await db.collection('Chat').find({ sender: { $in: participants } }).toArray();
        const messages = await db.collection('Chat').find({
            $or: [
                { sender: participants[0], receiver: participants[1] },
                { sender: participants[1], receiver: participants[0] }
            ],
            IsAccessible: true
        }).sort({ timestamp: 1 }).toArray();

        res.json(messages);
    } catch (error) {
        console.error('Failed to get chats:', error);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

initializeSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
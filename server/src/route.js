import mongodb from 'mongodb';
import express from 'express';
import getDBConnection from './database.js';

const router = express.Router();

router.get('/getdocdata', async (req, res) => {
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

router.post('/adddocdata', async (req, res) => {
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

router.post('/updatedocdata', async (req, res) => {
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

router.post('/deletedocdata', async (req, res) => {
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

router.get('/getchats', async (req, res) => {
    try {
        const participants = req.query.participants || req.query['participants[]'];

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

export default router;
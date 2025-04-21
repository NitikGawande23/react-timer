// /api/saveSession.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    const { startTime, endTime, duration, name } = req.body;

    if (!cachedClient) {
      cachedClient = await MongoClient.connect(uri);
    }

    const db = cachedClient.db('react-timer');
    const sessions = db.collection('sessions');

    await sessions.insertOne({
      name,
      startTime,
      endTime,
      duration,
      createdAt: new Date()
    });

    res.status(200).json({ message: 'Session saved!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}

// /api/saveSession.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

export default async function handler(req, res) {
  console.log("API hit: /api/saveSession");

  if (req.method !== 'POST') {
    console.log("Invalid request method:", req.method);
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    const { startTime, endTime, duration, name } = req.body;
    console.log("Request body:", { startTime, endTime, duration, name });

    if (!cachedClient) {
      console.log("Connecting to MongoDB...");
      cachedClient = await MongoClient.connect(uri);
      console.log("MongoDB connected.");
    }

    const db = cachedClient.db('timerDB');
    const sessions = db.collection('sessions');

    const result = await sessions.insertOne({
      name,
      startTime,
      endTime,
      duration,
      createdAt: new Date()
    });

    console.log("Inserted document ID:", result.insertedId);

    res.status(200).json({ message: 'Session saved!' });
  } catch (error) {
    console.error("Error saving session:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}

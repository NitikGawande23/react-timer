import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

export default async function handler(req, res) {
  console.log("🟢 API hit: /api/saveSession");

  if (req.method !== 'POST') {
    console.log("❌ Invalid request method:", req.method);
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    const { startTime, endTime, duration, name } = req.body;

    console.log("📦 Request body received:");
    console.log("   🧑 Task name      :", name);
    console.log("   ⏱️ Start time     :", startTime);
    console.log("   ⏲️ End time       :", endTime);
    console.log("   ⌛ Duration (sent):", duration);

    const durationInSeconds = Math.floor(Number(duration));
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (!cachedClient) {
      console.log("🔌 Connecting to MongoDB...");
      cachedClient = await MongoClient.connect(uri);
      console.log("✅ MongoDB connected.");
    } else {
      console.log("♻️ Reusing cached MongoDB client.");
    }

    const db = cachedClient.db('timerDB');
    const sessions = db.collection('sessions');

    console.log("📤 Sending data to MongoDB...");
    const result = await sessions.insertOne({
      name,
      startTime: start,
      endTime: end,
      durationInSeconds,
      createdAt: new Date()
    });

    console.log("✅ Data sent to MongoDB successfully.");
    console.log("🆔 Inserted Document ID:", result.insertedId);

    const completedAt = new Date().toLocaleString();
    console.log(`✅ Task completed:
    - Task: ${name}
    - Duration: ${durationInSeconds} seconds
    - Completed At: ${completedAt}
    - Stored in MongoDB ✅
    `);

    res.status(200).json({ message: 'Session saved!' });
  } catch (error) {
    console.error("🚨 Error saving session:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}





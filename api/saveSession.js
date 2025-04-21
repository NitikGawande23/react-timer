// /api/saveSession.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedClient = null;

// Helper function to convert duration string to seconds
function convertToSeconds(durationStr) {
  const regex = /(?:(\d+)\s*hours?)?\s*(?:(\d+)\s*minutes?)?\s*(?:(\d+)\s*seconds?)?/i;
  const match = durationStr.match(regex);

  if (!match) return 0;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}

export default async function handler(req, res) {
  console.log("🟢 API hit: /api/saveSession");

  if (req.method !== 'POST') {
    console.log("❌ Invalid request method:", req.method);
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    const { startTime, endTime, duration, name } = req.body;

    const durationInSeconds = convertToSeconds(duration);

    console.log("📦 Request body received:");
    console.log("   🧑 Task name      :", name);
    console.log("   ⏱️ Start time     :", startTime);
    console.log("   ⏲️ End time       :", endTime);
    console.log("   ⌛ Duration        :", duration);
    console.log("   ⏳ Duration (sec) :", durationInSeconds);

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
      startTime,
      endTime,
      duration,
      durationInSeconds,
      createdAt: new Date()
    });

    console.log("✅ Data sent to MongoDB successfully.");
    console.log("🆔 Inserted Document ID:", result.insertedId);

    const completedAt = new Date().toLocaleString();
    console.log("✅ Task completed!");
    console.log(`📝 Summary:
    - Task: ${name}
    - Duration: ${duration} (${durationInSeconds} seconds)
    - Completed At: ${completedAt}
    - Stored in MongoDB
    `);

    res.status(200).json({ message: 'Session saved!' });
  } catch (error) {
    console.error("🚨 Error saving session:", error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}



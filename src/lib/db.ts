import mongoose from "mongoose";

type MongoGlobal = typeof globalThis & {
  mongooseCache?: { connection: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};
const g = globalThis as MongoGlobal;
const cache = g.mongooseCache ?? (g.mongooseCache = { connection: null, promise: null });

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing. Add it to .env.local");
  if (cache.connection) return cache.connection;
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 7000 });
  }
  try {
    cache.connection = await cache.promise;
    return cache.connection;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
}

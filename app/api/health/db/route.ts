import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  const startTime = Date.now();
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          status: 'error',
          connected: false,
          message: 'MONGODB_URI environment variable is missing.',
          latencyMs: 0,
        },
        { status: 500 }
      );
    }

    await connectToDatabase();
    const state = mongoose.connection.readyState;

    // 1 = connected, 2 = connecting
    if (state !== 1) {
      return NextResponse.json(
        {
          status: 'disconnected',
          connected: false,
          state,
          message: 'Database is not in connected state.',
          latencyMs: Date.now() - startTime,
        },
        { status: 503 }
      );
    }

    // Ping the admin database to verify active roundtrip
    const adminDb = mongoose.connection.db?.admin();
    await adminDb?.ping();
    const latencyMs = Date.now() - startTime;

    const collections = await mongoose.connection.db?.listCollections().toArray();
    const collectionNames = collections?.map((c) => c.name) || [];

    return NextResponse.json({
      status: 'healthy',
      connected: true,
      latencyMs,
      host: mongoose.connection.host || 'MongoDB Atlas Cluster',
      databaseName: mongoose.connection.name || 'portfolio',
      collectionsCount: collectionNames.length,
      collections: collectionNames,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error('Database connection check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        connected: false,
        latencyMs,
        message: error.message || 'Failed to establish connection to MongoDB Atlas.',
      },
      { status: 500 }
    );
  }
}

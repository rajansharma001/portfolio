import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { AdminAuthModel } from '@/models/AdminAuth';
import { verifyRequestAuth, verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!verifyRequestAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { currentPassword, newPassword } = body;

    if (!currentPassword || typeof currentPassword !== 'string') {
      return NextResponse.json({ error: 'Current password is required.' }, { status: 400 });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
    }

    await connectToDatabase();
    let auth = await AdminAuthModel.findOne({ key: 'admin_credentials' });

    if (!auth) {
      // Create initial if missing
      const defaultCreds = hashPassword(process.env.ADMIN_PASSWORD || 'admin');
      auth = await AdminAuthModel.create({
        key: 'admin_credentials',
        email: 'email.rajan001@gmail.com',
        passwordHash: defaultCreds.hash,
        salt: defaultCreds.salt,
        lastUpdated: new Date().toISOString(),
      });
    }

    // Verify current password in constant time
    const isValid = verifyPassword(currentPassword, auth.passwordHash, auth.salt);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password does not match.' }, { status: 400 });
    }

    // Generate fresh cryptographic salt & hash for new password
    const { hash: newHash, salt: newSalt } = hashPassword(newPassword);

    auth.passwordHash = newHash;
    auth.salt = newSalt;
    auth.email = 'email.rajan001@gmail.com';
    auth.lastUpdated = new Date().toISOString();

    await auth.save();

    return NextResponse.json({
      success: true,
      message: 'Admin password successfully updated and securely hashed in MongoDB Atlas.',
    });
  } catch (error: any) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update password' }, { status: 500 });
  }
}

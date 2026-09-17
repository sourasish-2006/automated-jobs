import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

import { getCurrentUserId } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const userId = await getCurrentUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const notifs = db.notifications.filter(n => n.userId === userId);
  return NextResponse.json({
    success: true,
    notifications: notifs,
    unreadCount: notifs.filter(n => !n.isRead).length
  });
}

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await request.json();
  const notif = db.notifications.find(n => n.id === id && n.userId === userId);
  if (notif) {
    notif.isRead = true;
  }
  return NextResponse.json({ success: true });
}

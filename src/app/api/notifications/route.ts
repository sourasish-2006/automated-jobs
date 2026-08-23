import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const userId = 'user_alex_chen';
  const notifs = db.notifications.filter(n => n.userId === userId);
  return NextResponse.json({
    success: true,
    notifications: notifs,
    unreadCount: notifs.filter(n => !n.isRead).length
  });
}

export async function POST(request: Request) {
  const userId = 'user_alex_chen';
  const { id } = await request.json();
  const notif = db.notifications.find(n => n.id === id && n.userId === userId);
  if (notif) {
    notif.isRead = true;
  }
  return NextResponse.json({ success: true });
}

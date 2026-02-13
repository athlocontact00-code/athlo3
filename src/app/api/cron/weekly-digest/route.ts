import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Generate and send weekly digest emails
  // 1. Fetch all active users
  // 2. For each user, compile weekly summary
  // 3. Send digest email via email provider

  return NextResponse.json({
    status: 'ok',
    task: 'weekly-digest',
    timestamp: new Date().toISOString(),
    message: 'Weekly digest generation triggered',
  });
}

import { NextResponse } from 'next/server';
import { db } from '../../../lib/store';

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, job } = body;

  const app = db.get(userId);
  if (!app) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const logEntry = {
    id: 'log-' + Date.now(),
    jobTitle: job.title,
    company: job.company,
    dateApplied: new Date().toLocaleDateString(),
    status: 'Applied'
  };

  const currentLog = app.workLog || [];
  const updates = { workLog: [logEntry, ...currentLog] };
  
  db.update(userId, updates);

  return NextResponse.json({ success: true, log: logEntry });
}

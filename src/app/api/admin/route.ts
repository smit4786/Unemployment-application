import { NextResponse } from 'next/server';
import { db } from '../../../lib/store';

export async function GET() {
  return NextResponse.json(db.getAll());
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id, action } = body;

  const app = db.get(id);
  if (!app) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  let updates: any = {};
  
  if (action === 'approve') {
    // Advance logic
    // 0 -> 1 -> 2 -> 3
    const nextStep = Math.min(app.step + 1, 3);
    updates.step = nextStep;
    
    // Update labels based on step
    if (nextStep === 1) {
        updates.status = 'Under Review';
        updates.progress = 33;
        updates.notifications = [...app.notifications, { id: Date.now(), message: 'Your application is now being reviewed.', date: new Date().toLocaleString(), type: 'info' }];
    } else if (nextStep === 2) {
        updates.status = 'Determination Pending';
        updates.progress = 66;
        updates.notifications = [...app.notifications, { id: Date.now(), message: 'We are making a determination on your eligibility.', date: new Date().toLocaleString(), type: 'info' }];
    } else if (nextStep === 3) {
        updates.status = 'Payment Issued';
        updates.progress = 100;
        updates.notifications = [...app.notifications, { id: Date.now(), message: 'Payment authorized.', date: new Date().toLocaleString(), type: 'success' }];
    }
  }

  const updatedApp = db.update(id, updates);
  return NextResponse.json(updatedApp);
}

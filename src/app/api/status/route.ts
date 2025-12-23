import { NextResponse } from 'next/server';
import { db } from '../../../lib/store';

// Generate a random ID like MN-2024-XXX
function generateId() {
  return 'MN-2024-' + Math.floor(Math.random() * 10000);
}

export async function GET(request: Request) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get ID from URL query param if we wanted, or just default mock
  // For simplicity, we'll try to get the 'MN-2024-555' or the most recent one
  // But strictly following the user dashboard logic, it just calls /api/status without params often.
  // The dashboard page might need to pass an ID if we want to support multiple.
  // For now, let's just return the seeded 555 one or the first one found.
  
  const allCallback = db.getAll();
  // Return the main seeded one for the default dashboard view
  const mainApp = db.get('MN-2024-555') || allCallback[0];

  if (!mainApp) {
      return NextResponse.json({ error: 'No application found' }, { status: 404 });
  }

  return NextResponse.json(mainApp);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newId = generateId();

  const newApp: any = {
    id: newId,
    firstName: body.firstName,
    lastName: body.lastName,
    submittedAt: new Date().toISOString(),
    status: 'Submitted',
    step: 0,
    progress: 10,
    estimatedCompletion: '10-14 business days',
    week: 'N/A',
    notifications: [
       { id: Date.now(), message: 'Application Received', date: new Date().toLocaleString(), type: 'success' }
    ]
  };

  db.add(newApp);

  return NextResponse.json({ 
    success: true, 
    id: newId,
    message: 'Application successfully saved to MN Unemployment Database'
  });
}

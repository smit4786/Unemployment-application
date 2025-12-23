import { Snackbar, Alert } from '@mui/material';

// Interface for simulation purposes
export interface NotificationAttempt {
  type: 'sms' | 'email';
  recipient: string;
  message: string;
}

// Mock function to simulate sending notifications
export const sendMockNotification = async (attempt: NotificationAttempt): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log(`[MOCK NOTIFICATION] Sent ${attempt.type.toUpperCase()} to ${attempt.recipient}: ${attempt.message}`);
  return true;
};

// Hook or utility could go here if we had more complex state

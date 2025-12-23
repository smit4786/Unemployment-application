'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Card, CardContent, Alert } from '@mui/material';
import { useAuth } from '../../../lib/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    // Simulate auth check
    if (password.length < 4) {
        setError('Password must be at least 4 characters.');
        return;
    }
    
    login(email);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      minHeight: '80vh', 
      alignItems: 'center',
      bgcolor: 'grey.50'
    }}>
      <Card elevation={4} sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold" textAlign="center">
            Sign In
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Access your Minnesota Unemployment Account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address / Username"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="For demo, use any password > 3 chars"
            />
            
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              size="large" 
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Need an account? <a href="/apply" style={{ color: '#1976d2' }}>Apply for Benefits</a>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

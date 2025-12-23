'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Chip, LinearProgress, Alert
} from '@mui/material';

export default function AdminPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/admin');
      const data = await res.json();
      // Sort by date desc
      setApplications(data.sort((a: any, b: any) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      ));
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id: string, currentStep: number) => {
    const res = await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'approve' })
    });

    if (res.ok) {
       fetchApplications(); // Refresh list
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Paid')) return 'success';
    if (status.includes('Submitted')) return 'default';
    return 'primary';
  };

  if (loading) return <LinearProgress />;

  return (
    <Box maxWidth="xl" mx="auto" px={4}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>

      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Applications</Typography>
          
          {applications.length === 0 ? (
            <Alert severity="info">No applications found.</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                     <TableCell>ID</TableCell>
                     <TableCell>Name</TableCell>
                     <TableCell>Submitted</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell>Progress</TableCell>
                     <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                   {applications.map((app) => (
                     <TableRow key={app.id}>
                       <TableCell>{app.id}</TableCell>
                       <TableCell>{app.firstName} {app.lastName}</TableCell>
                       <TableCell>{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                       <TableCell>
                         <Chip 
                           label={app.status} 
                           color={getStatusColor(app.status) as any} 
                           size="small" 
                         />
                       </TableCell>
                       <TableCell>{app.progress}%</TableCell>
                       <TableCell>
                         <Button 
                           variant="contained" 
                           size="small" 
                           onClick={() => handleApprove(app.id, app.step)}
                           disabled={app.step >= 3}
                         >
                           {app.step === 0 ? 'Review' : 
                            app.step === 1 ? 'Determine' : 
                            app.step === 2 ? 'Authorize Pay' : 'Completed'}
                         </Button>
                       </TableCell>
                     </TableRow>
                   ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

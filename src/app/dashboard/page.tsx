'use client';

import { useSearchParams } from 'next/navigation';
import { Box, Typography, Grid, Card, CardContent, LinearProgress, List, ListItem, ListItemIcon, ListItemText, Chip, Alert, Snackbar, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HistoryIcon from '@mui/icons-material/History';
import ArticleIcon from '@mui/icons-material/Article';
import WorkIcon from '@mui/icons-material/Work';
import { useEffect, useState, Suspense } from 'react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const [showToast, setShowToast] = useState(false);

  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for new application toast
    if (searchParams.get('newApplication') === 'true') {
      setShowToast(true);
    }

    // 2. Fetch mock data
    const fetchData = async () => {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        setStatusData(data);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (loading) {
     return <LinearProgress />;
  }

  if (!statusData) {
    return <Alert severity="error">Failed to load application data.</Alert>;
  }

  return (
    <Box>
      <Snackbar open={showToast} autoHideDuration={6000} onClose={() => setShowToast(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setShowToast(false)}>
          Application Submitted Successfully! Confirmation email sent.
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        My Dashboard
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '2fr 1fr' }, gap: 4 }}>
        {/* Main Status Tracker */}
        <Box>
          <Card elevation={3} sx={{ mb: 4 }}>
             <CardContent>
               <Typography variant="h6" gutterBottom>Application Status (ID: {statusData.id})</Typography>
               <Box sx={{ position: 'relative', my: 4, mx: 2 }}>
                 <LinearProgress variant="determinate" value={statusData.progress} sx={{ height: 10, borderRadius: 5 }} />
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                   <Typography variant="caption" fontWeight={statusData.step >= 0 ? "bold" : "normal"} color={statusData.step >= 0 ? "primary" : "text.secondary"}>Submitted</Typography>
                   <Typography variant="caption" fontWeight={statusData.step >= 1 ? "bold" : "normal"} color={statusData.step >= 1 ? "primary" : "text.secondary"}>Reviewing</Typography>
                   <Typography variant="caption" fontWeight={statusData.step >= 2 ? "bold" : "normal"} color={statusData.step >= 2 ? "primary" : "text.secondary"}>Determine</Typography>
                   <Typography variant="caption" fontWeight={statusData.step >= 3 ? "bold" : "normal"} color={statusData.step >= 3 ? "primary" : "text.secondary"}>Paid</Typography>
                 </Box>
               </Box>
               <Alert severity="info" icon={<PendingActionsIcon />}>
                 Your application is currently <strong>{statusData.status}</strong>. Estimated completion: {statusData.estimatedCompletion}.
               </Alert>
             </CardContent>
          </Card>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Weekly Activities</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                     {searchParams.get('claimFiled') === 'true' ? 'Latest Request' : 'Action Required'}
                  </Typography>
                  <Typography variant="h6">Request Benefit Payment</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>For week of {statusData.week}</Typography>
                  
                  {searchParams.get('claimFiled') === 'true' ? (
                     <Chip label="Processing" color="info" size="small" icon={<PendingActionsIcon />} />
                  ) : (
                     <Chip label="Overdue" color="error" size="small" />
                  )}
                  
                  {/* Only show button if not filed yet */}
                  {searchParams.get('claimFiled') !== 'true' && (
                     <Box sx={{ mt: 2 }}>
                       <Button 
                         variant="outlined" 
                         size="small" 
                         fullWidth 
                         component="a" 
                         href="/weekly-request"
                       >
                         Start Request
                       </Button>
                     </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
            <Box>
              <Card variant="outlined">
                 <CardContent>
                   <Typography color="text.secondary" gutterBottom>Next Step</Typography>
                   <Typography variant="h6">Submit Work Search</Typography>
                   <Typography variant="body2" sx={{ mb: 2 }}>Log your job applications</Typography>
                   <Chip label="Due Friday" color="warning" size="small" />
                 </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>

        {/* Gamified Sidebar - Profile Strength */}
        <Box>
          <Card sx={{ bgcolor: 'secondary.main', color: 'white', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Profile Strength</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                  <Typography variant="h4" fontWeight="bold">80%</Typography>
                </Box>
                <Typography variant="body2">You're almost there! Complete your profile to speed up processing.</Typography>
              </Box>
              <LinearProgress variant="determinate" value={80} sx={{ bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} />
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Job Applications</Typography>
              {statusData.workLog && statusData.workLog.length > 0 ? (
                <List dense>
                   {statusData.workLog.map((log: any) => (
                      <ListItem key={log.id}>
                         <ListItemIcon><WorkIcon color="primary" /></ListItemIcon>
                         <ListItemText 
                           primary={log.jobTitle} 
                           secondary={`${log.company} • ${log.dateApplied}`} 
                         />
                      </ListItem>
                   ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No applications logged yet.
                  <br />
                  <a href="/work-search" style={{ color: '#003865' }}>Find Jobs Now</a>
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Notifications</Typography>
              <List dense>
                {statusData.notifications.map((notif: any) => (
                  <ListItem key={notif.id}>
                    <ListItemIcon>
                      {notif.type === 'success' ? <CheckCircleIcon color="success" /> : 
                       notif.type === 'info' ? <ArticleIcon color="primary" /> : <HistoryIcon />}
                    </ListItemIcon>
                    <ListItemText primary={notif.message} secondary={notif.date} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LinearProgress />}>
      <DashboardContent />
    </Suspense>
  );
}

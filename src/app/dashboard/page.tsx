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

      {/* Hero Welcome */}
      <Box sx={{ mb: 6, textAlign: 'center', py: 4, background: 'linear-gradient(135deg, rgba(0,56,101,0.05) 0%, rgba(120,190,32,0.1) 100%)', borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="800" color="primary">
          Welcome back, {statusData.firstName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Here is the current status of your benefits and weekly activities.
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '2fr 1fr' }, gap: 4 }}>
        {/* Main Status Tracker */}
        <Box>
          <Card elevation={0} sx={{ mb: 4, border: '1px solid', borderColor: 'divider' }}>
             <CardContent sx={{ p: 4 }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">Application Bundle: {statusData.id}</Typography>
                  <Chip label={statusData.status} color="primary" variant="outlined" />
               </Box>
               
               <Box sx={{ position: 'relative', my: 5, mx: 2 }}>
                 <LinearProgress variant="determinate" value={statusData.progress} sx={{ height: 12, borderRadius: 6, bgcolor: 'grey.100' }} />
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                   {['Submitted', 'Reviewing', 'Determine', 'Paid'].map((stepLabel, index) => (
                     <Typography 
                      key={stepLabel}
                      variant="caption" 
                      fontWeight={statusData.step >= index ? "bold" : "normal"} 
                      color={statusData.step >= index ? "primary" : "text.secondary"}
                     >
                       {stepLabel}
                     </Typography>
                   ))}
                 </Box>
               </Box>
               
               <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                 <PendingActionsIcon color="action" />
                 <Typography variant="body2">
                    Estimated completion: <strong>{statusData.estimatedCompletion}</strong>
                 </Typography>
               </Box>
             </CardContent>
          </Card>

          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>Action Center</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <Card variant="outlined" sx={{ height: '100%', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' } }}>
                <CardContent>
                  <Typography color="text.secondary" variant="overline" letterSpacing={1}>Weekly Request</Typography>
                  <Typography variant="h6" gutterBottom fontWeight="bold">Benefit Payment</Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>Week of {statusData.week}</Typography>
                  
                  {searchParams.get('claimFiled') === 'true' ? (
                     <Chip label="Processing" color="info" size="small" icon={<PendingActionsIcon />} sx={{ borderRadius: 1 }} />
                  ) : (
                     <Chip label="Action Required" color="error" size="small" sx={{ borderRadius: 1 }} />
                  )}
                  
                  {/* Only show button if not filed yet */}
                  {searchParams.get('claimFiled') !== 'true' && (
                     <Box sx={{ mt: 3 }}>
                       <Button 
                         variant="contained" 
                         fullWidth 
                         component="a" 
                         href="/weekly-request"
                         disableElevation
                       >
                         Start Request
                       </Button>
                     </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
            <Box>
              <Card variant="outlined" sx={{ height: '100%', transition: 'all 0.2s', '&:hover': { borderColor: 'secondary.main', transform: 'translateY(-2px)' } }}>
                 <CardContent>
                   <Typography color="text.secondary" variant="overline" letterSpacing={1}>Next Task</Typography>
                   <Typography variant="h6" gutterBottom fontWeight="bold">Work Search</Typography>
                   <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>Log your job applications</Typography>
                   <Chip label="Due Friday" color="warning" size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                 </CardContent>
              </Card>
            </Box>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">Recent Job Applications</Typography>
              <Card variant="outlined">
                {statusData.workLog && statusData.workLog.length > 0 ? (
                  <List>
                     {statusData.workLog.map((log: any, i: number) => (
                        <ListItem key={log.id} divider={i !== statusData.workLog.length - 1}>
                           <ListItemIcon><WorkIcon color="primary" /></ListItemIcon>
                           <ListItemText 
                             primary={<Typography fontWeight="600">{log.jobTitle}</Typography>} 
                             secondary={`${log.company} • ${log.dateApplied}`} 
                           />
                           <Chip label="Applied" size="small" />
                        </ListItem>
                     ))}
                  </List>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      No applications logged yet.
                    </Typography>
                    <Button variant="text" href="/work-search">Find Jobs Now</Button>
                  </Box>
                )}
            </Card>
          </Box>
        </Box>

        {/* Gamified Sidebar - Profile Strength */}
        <Box>
          <Card sx={{ 
            bgcolor: 'secondary.main', 
            color: 'white', 
            mb: 3, 
            background: 'linear-gradient(135deg, #78BE20 0%, #5da010 100%)',
            boxShadow: '0 8px 20px rgba(120, 190, 32, 0.4)'
          }}>
            <CardContent>
              <Typography variant="overline" sx={{ opacity: 0.8 }}>Profile Strength</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
                <Typography variant="h3" fontWeight="bold">80%</Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>Complete your profile to speed up processing.</Typography>
              <LinearProgress variant="determinate" value={80} sx={{ bgcolor: 'rgba(255,255,255,0.3)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} />
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ bgcolor: 'transparent' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">Notifications</Typography>
              <List dense sx={{ bgcolor: 'background.paper', borderRadius: 3 }}>
                {statusData.notifications.map((notif: any, i: number) => (
                  <ListItem key={notif.id} divider={i !== statusData.notifications.length - 1}>
                    <ListItemIcon>
                      {notif.type === 'success' ? <CheckCircleIcon color="success" /> : 
                       notif.type === 'info' ? <ArticleIcon color="primary" /> : <HistoryIcon />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={<Typography variant="body2" fontWeight="500">{notif.message}</Typography>} 
                      secondary={notif.date} 
                    />
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

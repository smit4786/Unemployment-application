'use client';

import { useState } from 'react';
import { 
  Typography, Button, Container, Grid, Card, CardContent, Box, Stack, 
  Chip, TextField, InputAdornment, ToggleButtonGroup, ToggleButton, 
  CircularProgress, Fade, Paper, Alert, Snackbar
} from '@mui/material';
import Link from 'next/link';
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Image from 'next/image';

import { searchJobs, Job } from '../lib/linkedin';
import { INDUSTRIES, POPULAR_LOCATIONS } from './work-search/page';

export default function Home() {
  const [mode, setMode] = useState<'jobs' | 'benefits'>('jobs');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Minnesota');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '' });

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      // Default to 50 mile radius
      const results = await searchJobs(query, location, 'week', 'any', '50');
      setJobs(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    // Check if user is logged in? We don't have auth context here easily without importing hook.
    // For homepage preview, we'll just show a toast or redirect.
    // Ideally, "Apply" should take them to the full work-search page detail or open the url?
    // Let's redirect to work-search with query params or open URL if available.
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 8, md: 12 }, 
          pb: { xs: 8, md: 12 }, 
          background: 'radial-gradient(circle at 50% 30%, rgba(200, 225, 255, 0.4) 0%, rgba(244, 247, 250, 0) 70%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          
          <Stack alignItems="center" spacing={3} textAlign="center" mb={6}>
            <Image src="/logo.png" alt="NorthStar Logo" width={80} height={80} style={{ marginBottom: 16 }} />
            
            <Typography variant="h1" sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '2.5rem', md: '4rem' },
              background: 'linear-gradient(135deg, #003865 0%, #0055a5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              NorthStar Works
            </Typography>
            
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mb: 4 }}>
              Navigating your career journey with powerful job search tools and essential unemployment safety nets.
            </Typography>

            {/* Mode Toggle */}
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(e, val) => val && setMode(val)}
              sx={{ 
                bgcolor: 'white', 
                p: 0.5, 
                borderRadius: 4, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                mb: 4
              }}
            >
              <ToggleButton value="jobs" sx={{ px: 4, py: 1.5, borderRadius: 3, textTransform: 'none', fontWeight: 600 }}>
                <WorkIcon sx={{ mr: 1, fontSize: 20 }} /> Find a Job
              </ToggleButton>
              <ToggleButton value="benefits" sx={{ px: 4, py: 1.5, borderRadius: 3, textTransform: 'none', fontWeight: 600 }}>
                <VerifiedUserIcon sx={{ mr: 1, fontSize: 20 }} /> Get Benefits
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Job Search Mode */}
            {mode === 'jobs' && (
              <Fade in>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    borderRadius: 4, 
                    display: 'flex', 
                    gap: 2, 
                    flexDirection: { xs: 'column', md: 'row' },
                    width: '100%',
                    maxWidth: 800,
                    boxShadow: '0 8px 30px rgba(0,56,101,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  <TextField 
                    fullWidth 
                    placeholder="Job title, keywords, or company"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                      sx: { borderRadius: 3, bgcolor: '#f8fafc' }
                    }}
                    variant="outlined"
                    sx={{ flex: 1.5 }}
                  />
                  <TextField 
                    fullWidth 
                    placeholder="City, state, or zip"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><LocationOnIcon color="action" /></InputAdornment>,
                      sx: { borderRadius: 3, bgcolor: '#f8fafc' }
                    }}
                    variant="outlined"
                    sx={{ flex: 1 }}
                  />
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={handleSearch}
                    disabled={loading}
                    sx={{ 
                      borderRadius: 3, 
                      px: 4, 
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #003865 0%, #0055a5 100%)',
                      boxShadow: '0 4px 15px rgba(0,56,101,0.2)'
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                  </Button>
                </Paper>
              </Fade>
            )}

            {/* Benefits Mode */}
            {mode === 'benefits' && (
              <Fade in>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    borderRadius: 4, 
                    width: '100%',
                    maxWidth: 800,
                    boxShadow: '0 8px 30px rgba(0,56,101,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <Typography variant="h6" fontWeight="700">Minnesota Unemployment Insurance</Typography>
                  <Typography color="text.secondary">
                    Secure, reliable financial support while you search for your next opportunity.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mt={2}>
                    <Button 
                      variant="contained" 
                      size="large" 
                      component={Link} 
                      href="/eligibility"
                      sx={{ borderRadius: 3, py: 1.5, bgcolor: '#003865' }}
                    >
                      Check Eligibility
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large" 
                      component={Link} 
                      href="/auth/login"
                      sx={{ borderRadius: 3, py: 1.5 }}
                    >
                      Log In to Manage
                    </Button>
                  </Stack>
                </Paper>
              </Fade>
            )}
            
          </Stack>

          {/* Job Results Preview (Only on Search) */}
          {mode === 'jobs' && searched && (
            <Box mt={6} maxWidth="lg" mx="auto">
              <Typography variant="h5" fontWeight="700" mb={3} textAlign="left">
                {jobs.length > 0 ? 'Top Opportunities' : loading ? 'Searching...' : 'No jobs found'}
              </Typography>
              
              <Grid container spacing={3}>
                {jobs.slice(0, 6).map((job) => (
                   <Grid size={{ xs: 12, md: 6 }} key={job.id}>
                     <Card sx={{ 
                       height: '100%', 
                       borderRadius: 3, 
                       border: '1px solid rgba(0,0,0,0.05)',
                       transition: 'all 0.2s',
                       '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }
                     }}>
                       <CardContent>
                         <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="h6" fontWeight="bold" noWrap>{job.title}</Typography>
                            {job.postedDate && (
                              <Chip label={job.postedDate} size="small" icon={<AccessTimeIcon />} sx={{ bgcolor: '#f0f7ff' }} />
                            )}
                         </Box>
                         <Typography color="text.secondary" fontWeight="500" gutterBottom>{job.company}</Typography>
                         <Stack direction="row" spacing={1} mb={2}>
                           <Chip label={job.location} size="small" icon={<LocationOnIcon />} variant="outlined" />
                           {job.salary && <Chip label={job.salary} size="small" color="success" variant="outlined" />}
                         </Stack>
                         <Button 
                           variant="outlined" 
                           fullWidth 
                           endIcon={<ArrowForwardIcon />}
                           component={Link}
                           href={`/work-search`}
                           sx={{ borderRadius: 2 }}
                         >
                           View Details & Apply
                         </Button>
                       </CardContent>
                     </Card>
                   </Grid>
                ))}
              </Grid>
              
              {jobs.length > 0 && (
                 <Box textAlign="center" mt={4}>
                   <Button 
                     component={Link} 
                     href="/work-search" 
                     variant="contained" 
                     size="large"
                     endIcon={<ArrowForwardIcon />}
                     sx={{ borderRadius: 3, bgcolor: '#003865' }}
                   >
                     View All Jobs
                   </Button>
                 </Box>
              )}
            </Box>
          )}

        </Container>
      </Box>

      {/* Services Grid (Always visible at bottom) */}
      <Box sx={{ py: 10, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" fontWeight="800" sx={{ mb: 1 }}>How We Help</Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8 }}>Comprehensive support for every stage</Typography>
          
          <Grid container spacing={4}>
            {[
              { title: 'Job Search', desc: 'Real-time job listings from top employers across Minnesota.', icon: <WorkIcon fontSize="large" />, color: '#003865' },
              { title: 'Resume Builder', desc: 'AI-powered resume parsing and content suggestions.', icon: <TrendingUpIcon fontSize="large" />, color: '#78BE20' },
              { title: 'Benefits Support', desc: 'Easy eligibility checking and weekly benefit requests.', icon: <VerifiedUserIcon fontSize="large" />, color: '#336699' }
            ].map((feature, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Card sx={{ height: '100%', borderRadius: 4, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ 
                      width: 80, height: 80, mx: 'auto', mb: 3, borderRadius: '50%', 
                      bgcolor: `${feature.color}15`, color: feature.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" fontWeight="700" gutterBottom>{feature.title}</Typography>
                    <Typography color="text.secondary">{feature.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity="info">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}

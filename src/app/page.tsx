'use client';

import { useState, useEffect } from 'react';
import { 
  Typography, Button, Container, Grid, Card, CardContent, Box, Stack, 
  Chip, TextField, InputAdornment, ToggleButtonGroup, ToggleButton, 
  CircularProgress, Fade, Paper, Alert, Snackbar, Autocomplete,
  FormControl, Select, MenuItem, Collapse, Divider, Badge
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

// Icons
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FolderIcon from '@mui/icons-material/Folder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// Data & Libs
import { searchJobs, Job } from '../lib/linkedin';
import { INDUSTRIES, POPULAR_LOCATIONS } from './work-search/page';

export default function Home() {
  const [mode, setMode] = useState<'jobs' | 'benefits'>('jobs');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Minnesota');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  // Filters
  const [dateFilter, setDateFilter] = useState('week');
  const [workType, setWorkType] = useState('any');
  const [industry, setIndustry] = useState('all');
  const [radius, setRadius] = useState('50');
  const [experienceLevel, setExperienceLevel] = useState('any');

  // AI Suggestions
  const [jobSuggestions, setJobSuggestions] = useState<string[]>([]);
  const [relatedJobs, setRelatedJobs] = useState<string[]>([]);
  const [alternativeJobs, setAlternativeJobs] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' as 'info' | 'success' | 'error' });

  // Debounced AI job suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setJobSuggestions([]);
        setRelatedJobs([]);
        setAlternativeJobs([]);
        return;
      }
      
      try {
        const res = await fetch(`/api/v1/suggest-jobs?query=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setJobSuggestions(data.suggestions || []);
          setRelatedJobs(data.related || []);
          setAlternativeJobs(data.alternatives || []);
        }
      } catch (err) {
        console.error('Suggestion fetch failed:', err);
      }
    };
    
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const searchQuery = industry !== 'all' 
        ? `${query} ${INDUSTRIES.find(i => i.value === industry)?.label.replace(/[^a-zA-Z ]/g, '') || ''}`.trim()
        : query;
        
      const results = await searchJobs(searchQuery, location, dateFilter, workType, radius, experienceLevel);
      setJobs(results);
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: 'Search failed. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getDashboardUrl = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('l', location);
    if (dateFilter) params.set('d', dateFilter);
    if (workType) params.set('w', workType);
    if (industry) params.set('i', industry);
    if (radius) params.set('r', radius);
    if (experienceLevel) params.set('exp', experienceLevel);
    return `/work-search?${params.toString()}`;
  };

  const getPostingStyle = (postedDate: string) => {
    const lower = postedDate.toLowerCase();
    if (lower.includes('hour') || lower.includes('today') || lower.includes('just')) {
      return { 
        bg: 'linear-gradient(135deg, #00C853 0%, #00E676 100%)', 
        color: 'white',
        label: '🔥 ' + postedDate
      };
    } else if (lower.includes('1 day') || lower.includes('yesterday')) {
      return { 
        bg: 'linear-gradient(135deg, #FF9100 0%, #FFB300 100%)', 
        color: 'white',
        label: postedDate
      };
    }
    return { bg: '#f5f5f5', color: '#666', label: postedDate };
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 6, md: 10 }, 
          pb: { xs: 8, md: 12 }, 
          background: 'radial-gradient(circle at 50% 30%, rgba(200, 225, 255, 0.4) 0%, rgba(244, 247, 250, 0) 70%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          
          <Stack alignItems="center" spacing={2} textAlign="center" mb={6}>
            <Image src="/logo.png" alt="NorthStar Logo" width={60} height={60} style={{ marginBottom: 8 }} />
            
            <Typography variant="h1" sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #003865 0%, #0055a5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5
            }}>
              NorthStar Works
            </Typography>
            
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mb: 3 }}>
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
                <Card 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    width: '100%',
                    maxWidth: 1000,
                    boxShadow: '0 10px 40px rgba(0,56,101,0.1)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    textAlign: 'left'
                  }}
                >
                  <form onSubmit={handleSearch}>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                      <TextField 
                        fullWidth 
                        placeholder="Job title, company, or keywords..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        variant="outlined"
                        sx={{
                          flex: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: '#f8f9fa',
                            '&:hover': { bgcolor: '#f0f2f5' },
                            '&.Mui-focused': { bgcolor: 'white' }
                          }
                        }}
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><WorkIcon sx={{ color: '#003865' }} /></InputAdornment>,
                        }}
                      />
                      <Autocomplete
                        freeSolo
                        options={POPULAR_LOCATIONS}
                        value={location}
                        onChange={(e, newValue) => setLocation(newValue || '')}
                        onInputChange={(e, newValue) => setLocation(newValue)}
                        sx={{ flex: 1.5 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="City, State, or Country"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                bgcolor: '#f8f9fa',
                                '&:hover': { bgcolor: '#f0f2f5' },
                                '&.Mui-focused': { bgcolor: 'white' }
                              }
                            }}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <InputAdornment position="start"><LocationOnIcon sx={{ color: '#78BE20' }} /></InputAdornment>
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      <Button 
                        variant="contained" 
                        size="large" 
                        type="submit" 
                        disabled={loading}
                        startIcon={<RocketLaunchIcon />}
                        sx={{ 
                          minWidth: 160,
                          borderRadius: 2,
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #003865 0%, #0055a5 100%)',
                          boxShadow: '0 4px 15px rgba(0,56,101,0.3)',
                          '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(0,56,101,0.4)' }
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                      </Button>
                    </Box>

                    {/* Filter Controls */}
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                      {/* Date Filter */}
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                          📅 Posted Within
                        </Typography>
                        <ToggleButtonGroup
                          value={dateFilter}
                          exclusive
                          onChange={(e, val) => val && setDateFilter(val)}
                          size="small"
                          sx={{
                            '& .MuiToggleButton-root': { borderRadius: 2, px: 2, textTransform: 'none', fontWeight: 600 }
                          }}
                        >
                          <ToggleButton value="today">Today</ToggleButton>
                          <ToggleButton value="3days">3 Days</ToggleButton>
                          <ToggleButton value="week">Week</ToggleButton>
                          <ToggleButton value="month">Month</ToggleButton>
                        </ToggleButtonGroup>
                      </Box>

                      {/* Work Type Filter */}
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                          🏢 Work Type
                        </Typography>
                        <ToggleButtonGroup
                          value={workType}
                          exclusive
                          onChange={(e, val) => val && setWorkType(val)}
                          size="small"
                          sx={{
                            '& .MuiToggleButton-root': { borderRadius: 2, px: 2, textTransform: 'none', fontWeight: 600 }
                          }}
                        >
                          <ToggleButton value="any">All</ToggleButton>
                          <ToggleButton value="remote">🏠 Remote</ToggleButton>
                          <ToggleButton value="hybrid">🔄 Hybrid</ToggleButton>
                          <ToggleButton value="onsite">🏢 On-site</ToggleButton>
                        </ToggleButtonGroup>
                      </Box>

                      {/* Industry Filter */}
                      <Box sx={{ minWidth: 160 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                          🏭 Industry
                        </Typography>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            sx={{ borderRadius: 2, bgcolor: industry !== 'all' ? '#e0f2f1' : 'transparent' }}
                          >
                            {INDUSTRIES.map((ind) => (
                              <MenuItem key={ind.value} value={ind.value}>{ind.label}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>

                      {/* Distance Filter */}
                      <Box sx={{ minWidth: 120 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                          📏 Distance
                        </Typography>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={radius}
                            onChange={(e) => setRadius(e.target.value)}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="5">5 miles</MenuItem>
                            <MenuItem value="10">10 miles</MenuItem>
                            <MenuItem value="25">25 miles</MenuItem>
                            <MenuItem value="50">50 miles</MenuItem>
                            <MenuItem value="100">100 miles</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      {/* Experience Level Filter */}
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 600 }}>
                          🎓 Experience
                        </Typography>
                        <ToggleButtonGroup
                          value={experienceLevel}
                          exclusive
                          onChange={(e, val) => val && setExperienceLevel(val)}
                          size="small"
                          sx={{
                            '& .MuiToggleButton-root': {
                              borderRadius: 2,
                              px: 2,
                              fontWeight: 600,
                              textTransform: 'none',
                              border: '1px solid rgba(0,0,0,0.12)',
                              '&.Mui-selected': {
                                background: 'linear-gradient(135deg, #003865 0%, #0055a5 100%)',
                                color: 'white',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #002a4d 0%, #003865 100%)',
                                }
                              }
                            }
                          }}
                        >
                          <ToggleButton value="any">All</ToggleButton>
                          <ToggleButton value="entry">Entry</ToggleButton>
                          <ToggleButton value="mid">Mid</ToggleButton>
                          <ToggleButton value="senior">Senior</ToggleButton>
                        </ToggleButtonGroup>
                      </Box>
                    </Box>

                    {/* AI Job Suggestions chips */}
                    {(jobSuggestions.length > 0 || relatedJobs.length > 0 || alternativeJobs.length > 0) && (
                      <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: showSuggestions ? 1 : 0 }}>
                          <Typography variant="caption" color="primary" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            ✨ AI Job Assistance
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => setShowSuggestions(!showSuggestions)}
                            endIcon={showSuggestions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            sx={{ minWidth: 'auto', color: '#666' }}
                          >
                            {showSuggestions ? 'Hide' : 'Show Suggestions'}
                          </Button>
                        </Box>
                        
                        <Collapse in={showSuggestions}>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                            {jobSuggestions.map((s, idx) => (
                              <Chip 
                                key={`s-${idx}`} 
                                label={s} 
                                size="small" 
                                onClick={() => { setQuery(s); handleSearch(); }}
                                sx={{ bgcolor: 'white', border: '1px solid #003865', color: '#003865', cursor: 'pointer', mb: 1 }}
                              />
                            ))}
                            {alternativeJobs.map((a, idx) => (
                              <Chip 
                                key={`a-${idx}`} 
                                label={a} 
                                size="small" 
                                color="secondary"
                                variant="outlined"
                                onClick={() => { setQuery(a); handleSearch(); }}
                                sx={{ mb: 1 }}
                              />
                            ))}
                          </Stack>
                        </Collapse>
                      </Box>
                    )}
                  </form>
                </Card>
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

          {/* Job Results Section */}
          {mode === 'jobs' && searched && (
            <Box mt={4} maxWidth="lg" mx="auto">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="800">
                  {loading ? 'Searching...' : jobs.length > 0 ? `Results (${jobs.length})` : 'No jobs found'}
                </Typography>
                {jobs.length > 0 && (
                   <Button component={Link} href={getDashboardUrl()} endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 700 }}>
                     Enter Full Dashboard
                   </Button>
                )}
              </Box>
              
              <Grid container spacing={3}>
                {jobs.slice(0, 8).map((job) => {
                   const style = getPostingStyle(job.postedDate);
                   return (
                     <Grid size={{ xs: 12, md: 6 }} key={job.id}>
                       <Card sx={{ 
                         height: '100%', 
                         borderRadius: 3, 
                         border: '1px solid rgba(0,0,0,0.08)',
                         transition: 'all 0.2s',
                         '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }
                       }}>
                         <CardContent sx={{ p: 3 }}>
                           <Box display="flex" justifyContent="space-between" mb={1.5} alignItems="flex-start">
                              <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.3, color: '#003865' }}>{job.title}</Typography>
                              <Chip 
                                label={style.label} 
                                size="small" 
                                sx={{ 
                                  background: style.bg, 
                                  color: style.color, 
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem' 
                                }} 
                              />
                           </Box>
                           
                           <Box display="flex" alignItems="center" gap={1} mb={2}>
                              <Typography color="primary" fontWeight="700" variant="body2">{job.company}</Typography>
                              <Typography color="text.disabled">|</Typography>
                              <Typography color="text.secondary" variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <LocationOnIcon sx={{ fontSize: 16 }} /> {job.location}
                              </Typography>
                           </Box>

                           <Stack direction="row" spacing={1} mb={3} flexWrap="wrap" useFlexGap>
                             {job.salary && <Chip label={job.salary} size="small" color="success" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700 }} />}
                             {job.jobType && <Chip label={job.jobType} size="small" variant="outlined" sx={{ fontWeight: 600 }} />}
                             {job.workFromHome && <Chip label="🏠 Remote" size="small" variant="outlined" sx={{ fontWeight: 600, bgcolor: '#f0f7ff' }} />}
                           </Stack>

                           <Stack direction="row" spacing={2}>
                             <Button 
                               variant="contained" 
                               fullWidth 
                               endIcon={<OpenInNewIcon />}
                               component="a"
                               href={job.url || '#'}
                               target="_blank"
                               rel="noopener noreferrer"
                               sx={{ 
                                 borderRadius: 2, 
                                 py: 1.2, 
                                 fontWeight: 700,
                                 background: 'linear-gradient(135deg, #78BE20 0%, #5da010 100%)',
                                 '&:hover': { background: 'linear-gradient(135deg, #5da010 0%, #4a8a0d 100%)' }
                               }}
                             >
                               Apply
                             </Button>
                             <Button 
                               variant="outlined" 
                               fullWidth 
                               component={Link}
                               href={getDashboardUrl()}
                               sx={{ 
                                 borderRadius: 2, 
                                 py: 1.2, 
                                 fontWeight: 700,
                                 borderColor: '#003865',
                                 color: '#003865',
                                 '&:hover': { bgcolor: 'rgba(0,56,101,0.05)', borderColor: '#002a4d' }
                               }}
                             >
                               Track
                             </Button>
                           </Stack>
                         </CardContent>
                       </Card>
                     </Grid>
                   );
                })}
              </Grid>
            </Box>
          )}

        </Container>
      </Box>

      {/* Benefits Content (Specific to Benefits mode if needed, or global) */}
      <Box sx={{ py: 10, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" fontWeight="800" sx={{ mb: 1 }}>Serving Minnesota's Workforce</Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8 }}>The unified platform for every step of your professional path.</Typography>
          
          <Grid container spacing={4}>
            {[
              { title: 'Powerful Search', desc: 'Real-time job listings from top employers across Minnesota and beyond.', icon: <SearchIcon fontSize="large" />, color: '#003865' },
              { title: 'Career Acceleration', icon: <TrendingUpIcon fontSize="large" />, desc: 'AI-assisted resume insights and personalized job market suggestions.', color: '#78BE20' },
              { title: 'Secure Benefits', icon: <VerifiedUserIcon fontSize="large" />, desc: 'Reliable unemployment insurance management and weekly requests.', color: '#336699' }
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

      {searched && mode === 'jobs' && (
        <Box sx={{ py: 8, textAlign: 'center' }}>
           <Typography variant="h4" fontWeight="800" gutterBottom>Ready for the full experience?</Typography>
           <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
             Log in to track your applications, earn points, and get personalized AI follow-up suggestions for every job.
           </Typography>
           <Button variant="contained" size="large" component={Link} href={getDashboardUrl()} sx={{ px: 6, py: 2, borderRadius: 4, fontSize: '1.1rem', fontWeight: 800 }}>
             Open Career Dashboard
           </Button>
        </Box>
      )}
      
      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} sx={{ width: '100%', borderRadius: 3, fontWeight: 600 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

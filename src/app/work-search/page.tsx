'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Card, CardContent, Chip, 
  InputAdornment, Snackbar, Alert, Collapse, Divider,
  Stack, Paper, Skeleton, Fade, Grow, ToggleButtonGroup, ToggleButton, Autocomplete
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { searchJobs, applyToJob, Job } from '../../lib/linkedin';
import { useAuth } from '../../lib/auth';

// Points per application
const POINTS_PER_APPLICATION = 25;
const WEEKLY_GOAL = 5;

// Popular location suggestions (global support via Google Jobs)
const POPULAR_LOCATIONS = [
  // Minnesota (default focus)
  'Minnesota, USA',
  'Minneapolis, MN',
  'Saint Paul, MN',
  'Rochester, MN',
  'Duluth, MN',
  // Major US Cities
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'San Francisco, CA',
  'Seattle, WA',
  'Denver, CO',
  'Austin, TX',
  'Boston, MA',
  'Miami, FL',
  'Atlanta, GA',
  'Dallas, TX',
  'Remote USA',
  // International
  'Toronto, Canada',
  'Vancouver, Canada',
  'London, UK',
  'Berlin, Germany',
  'Amsterdam, Netherlands',
  'Dublin, Ireland',
  'Sydney, Australia',
  'Singapore',
  'Tokyo, Japan',
  'Remote Worldwide',
];

export default function WorkSearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Minnesota');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{open: boolean, message: string, severity: 'success' | 'info'}>({open: false, message: '', severity: 'success'});
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  
  // Filters
  const [dateFilter, setDateFilter] = useState('week');
  const [workType, setWorkType] = useState('any');
  
  // Application tracking & rewards
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [weeklyApps, setWeeklyApps] = useState(0);
  
  // Job title suggestions
  const [jobSuggestions, setJobSuggestions] = useState<string[]>([]);
  const [relatedJobs, setRelatedJobs] = useState<string[]>([]);
  const [alternativeJobs, setAlternativeJobs] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('jobApplications');
    if (saved) {
      const data = JSON.parse(saved);
      setAppliedJobs(data.appliedJobs || []);
      setTotalPoints(data.totalPoints || 0);
      setWeeklyApps(data.weeklyApps || 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jobApplications', JSON.stringify({
      appliedJobs, totalPoints, weeklyApps,
      lastUpdated: new Date().toISOString()
    }));
  }, [appliedJobs, totalPoints, weeklyApps]);

  // Fetch AI job suggestions when query changes
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await searchJobs(query, location, dateFilter, workType);
      setJobs(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job: Job) => {
    if (!user) return;
    
    if (appliedJobs.includes(job.id)) {
      setToast({ open: true, message: `Already logged!`, severity: 'info' });
      return;
    }

    await applyToJob(job.id, user.id, job);
    
    setAppliedJobs(prev => [...prev, job.id]);
    setTotalPoints(prev => prev + POINTS_PER_APPLICATION);
    setWeeklyApps(prev => prev + 1);

    const weeklyProgress = weeklyApps + 1;
    let message = `🎯 +${POINTS_PER_APPLICATION} points! Application logged.`;
    
    if (weeklyProgress === WEEKLY_GOAL) {
      message = `🏆 WEEKLY GOAL! +50 BONUS points!`;
      setTotalPoints(prev => prev + 50);
    }
    
    setToast({ open: true, message, severity: 'success' });
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
    <Box maxWidth="lg" mx="auto" sx={{ pb: 4 }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #003865 0%, #0066cc 50%, #78BE20 100%)',
        borderRadius: 4,
        p: 4,
        mb: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          position: 'absolute', 
          right: -50, 
          top: -50, 
          width: 200, 
          height: 200, 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.1)' 
        }} />
        <Box sx={{ 
          position: 'absolute', 
          right: 50, 
          bottom: -80, 
          width: 160, 
          height: 160, 
          borderRadius: '50%', 
          background: 'rgba(120,190,32,0.2)' 
        }} />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" fontWeight="800" gutterBottom sx={{ 
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            Find Your Next Opportunity
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, maxWidth: 600 }}>
            Search jobs, apply, and earn rewards. Every application gets you closer to your goals.
          </Typography>
          
          {/* Stats Row */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Paper sx={{ 
              px: 3, py: 1.5, 
              borderRadius: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <EmojiEventsIcon sx={{ fontSize: 32, color: '#FFD700' }} />
              <Box>
                <Typography variant="h5" fontWeight="bold" color="white">{totalPoints}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Total Points</Typography>
              </Box>
            </Paper>
            
            <Paper sx={{ 
              px: 3, py: 1.5, 
              borderRadius: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <TrendingUpIcon sx={{ fontSize: 32, color: '#78BE20' }} />
              <Box>
                <Typography variant="h5" fontWeight="bold" color="white">{weeklyApps}/{WEEKLY_GOAL}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Weekly Goal</Typography>
              </Box>
            </Paper>
            
            <Paper sx={{ 
              px: 3, py: 1.5, 
              borderRadius: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              {[...Array(WEEKLY_GOAL)].map((_, i) => (
                <StarIcon 
                  key={i} 
                  sx={{ 
                    color: i < weeklyApps ? '#FFD700' : 'rgba(255,255,255,0.3)',
                    fontSize: 28,
                    transition: 'all 0.3s',
                    transform: i < weeklyApps ? 'scale(1.1)' : 'scale(1)'
                  }} 
                />
              ))}
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Search Bar */}
      <Card 
        elevation={0} 
        sx={{ 
          mb: 4, 
          p: 3, 
          borderRadius: 3,
          border: '2px solid #e0e0e0',
          transition: 'all 0.3s',
          '&:focus-within': {
            borderColor: '#003865',
            boxShadow: '0 0 0 4px rgba(0,56,101,0.1)'
          }
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
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="City, State, Country (e.g. London, UK)"
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
              sx={{
                '& .MuiAutocomplete-listbox': {
                  fontSize: '0.9rem'
                }
              }}
            />
            <Button 
              variant="contained" 
              size="large" 
              type="submit" 
              disabled={loading}
              startIcon={<RocketLaunchIcon />}
              sx={{ 
                minWidth: 180,
                borderRadius: 2,
                py: 1.8,
                fontWeight: 700,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #003865 0%, #0055a5 100%)',
                boxShadow: '0 4px 15px rgba(0,56,101,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #002a4d 0%, #003865 100%)',
                  boxShadow: '0 6px 20px rgba(0,56,101,0.4)',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Searching...' : 'Search Jobs'}
            </Button>
          </Box>

          {/* Filter Controls */}
          <Box sx={{ mt: 3, display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
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
                  '& .MuiToggleButton-root': {
                    borderRadius: 2,
                    px: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    '&.Mui-selected': {
                      background: 'linear-gradient(135deg, #78BE20 0%, #5da010 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5da010 0%, #4a8a0d 100%)',
                      }
                    }
                  }
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
                  '& .MuiToggleButton-root': {
                    borderRadius: 2,
                    px: 2,
                    fontWeight: 600,
                    textTransform: 'none',
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
                <ToggleButton value="remote">🏠 Remote</ToggleButton>
                <ToggleButton value="hybrid">🔄 Hybrid</ToggleButton>
                <ToggleButton value="onsite">🏢 On-site</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* AI Job Suggestions */}
          {(jobSuggestions.length > 0 || relatedJobs.length > 0 || alternativeJobs.length > 0) && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" color="primary" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                ✨ AI Suggestions
              </Typography>
              
              {jobSuggestions.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Try searching for:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {jobSuggestions.map((s, i) => (
                      <Chip 
                        key={i}
                        label={s}
                        size="small"
                        onClick={() => setQuery(s)}
                        sx={{ 
                          cursor: 'pointer',
                          bgcolor: 'white',
                          border: '1px solid #78BE20',
                          '&:hover': { bgcolor: '#78BE20', color: 'white' }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {relatedJobs.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Related roles:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {relatedJobs.map((s, i) => (
                      <Chip 
                        key={i}
                        label={s}
                        size="small"
                        variant="outlined"
                        onClick={() => setQuery(s)}
                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#e3f2fd' } }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {alternativeJobs.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    🔄 Career alternatives:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {alternativeJobs.map((s, i) => (
                      <Chip 
                        key={i}
                        label={s}
                        size="small"
                        variant="outlined"
                        onClick={() => setQuery(s)}
                        sx={{ cursor: 'pointer', borderStyle: 'dashed', '&:hover': { bgcolor: '#fff3e0' } }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          )}
        </form>
      </Card>

      {/* Results Count */}
      {jobs.length > 0 && (
        <Fade in>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight="600">
              {jobs.length} Jobs Found
            </Typography>
            <Chip 
              icon={<AccessTimeIcon />} 
              label="Posted this week" 
              size="small" 
              sx={{ 
                background: 'linear-gradient(135deg, #78BE20 0%, #5da010 100%)',
                color: 'white',
                fontWeight: 600
              }} 
            />
          </Box>
        </Fade>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {[1,2,3].map(i => (
            <Card key={i} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rounded" width={64} height={64} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="40%" />
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Skeleton variant="rounded" width={80} height={24} />
                    <Skeleton variant="rounded" width={100} height={24} />
                  </Box>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Job Cards */}
      <Box sx={{ display: 'grid', gap: 2 }}>
        {jobs.map((job, index) => {
          const hasApplied = appliedJobs.includes(job.id);
          const postingStyle = getPostingStyle(job.postedDate);
          
          return (
            <Grow in key={job.id} timeout={300 + index * 100}>
              <Card 
                variant="outlined" 
                sx={{ 
                  borderRadius: 3,
                  border: hasApplied ? '2px solid #78BE20' : '1px solid #e0e0e0',
                  bgcolor: hasApplied ? 'rgba(120,190,32,0.03)' : 'white',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    borderColor: hasApplied ? '#78BE20' : '#003865',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Applied Badge */}
                  {hasApplied && (
                    <Chip 
                      icon={<CheckCircleOutlineIcon />}
                      label="✓ Application Logged" 
                      sx={{ 
                        mb: 2,
                        background: 'linear-gradient(135deg, #78BE20 0%, #5da010 100%)',
                        color: 'white',
                        fontWeight: 600
                      }} 
                    />
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                      {/* Company Logo */}
                      {job.logoUrl ? (
                        <Box 
                          component="img" 
                          src={job.logoUrl} 
                          alt={job.company} 
                          sx={{ 
                            width: 64, height: 64, 
                            borderRadius: 2, 
                            objectFit: 'contain', 
                            bgcolor: 'white', 
                            p: 1, 
                            border: '1px solid #eee',
                            flexShrink: 0
                          }} 
                        />
                      ) : (
                        <Box sx={{ 
                          width: 64, height: 64, 
                          borderRadius: 2, 
                          background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <WorkIcon sx={{ color: '#999', fontSize: 28 }} />
                        </Box>
                      )}
                      
                      {/* Job Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="h6" 
                          fontWeight="700"
                          sx={{ 
                            color: '#003865',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {job.title}
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="600" color="text.secondary">
                          {job.company}
                        </Typography>
                        
                        {/* Tags */}
                        <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
                          <Chip 
                            label={postingStyle.label}
                            size="small" 
                            sx={{ 
                              background: postingStyle.bg,
                              color: postingStyle.color,
                              fontWeight: 600
                            }}
                          />
                          <Chip 
                            icon={<LocationOnIcon />}
                            label={job.location} 
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: '#ddd' }}
                          />
                          {job.salary && (
                            <Chip 
                              icon={<AttachMoneyIcon />}
                              label={job.salary} 
                              size="small"
                              sx={{ 
                                background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                                color: '#2E7D32',
                                fontWeight: 600,
                                border: '1px solid #A5D6A7'
                              }}
                            />
                          )}
                          {job.jobType && (
                            <Chip label={job.jobType} size="small" variant="outlined" sx={{ borderColor: '#ddd' }} />
                          )}
                          {job.workFromHome && (
                            <Chip 
                              icon={<HomeWorkIcon />}
                              label="Remote" 
                              size="small"
                              sx={{ 
                                background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                                color: '#1565C0',
                                fontWeight: 600,
                                border: '1px solid #90CAF9'
                              }}
                            />
                          )}
                        </Stack>

                        {job.via && (
                          <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                            {job.via}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ textAlign: 'center', flexShrink: 0 }}>
                      {!hasApplied && (
                        <Chip 
                          icon={<StarIcon sx={{ color: '#FFD700 !important' }} />}
                          label={`+${POINTS_PER_APPLICATION} pts`}
                          sx={{ 
                            mb: 1.5,
                            background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
                            color: '#F57C00',
                            fontWeight: 700,
                            border: '1px solid #FFE082'
                          }}
                        />
                      )}
                      <Button 
                        variant="contained" 
                        component="a"
                        href={job.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleApply(job)}
                        disabled={hasApplied}
                        endIcon={<OpenInNewIcon />}
                        sx={{ 
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          fontWeight: 700,
                          background: hasApplied 
                            ? 'linear-gradient(135deg, #78BE20 0%, #5da010 100%)'
                            : 'linear-gradient(135deg, #003865 0%, #0055a5 100%)',
                          boxShadow: hasApplied ? 'none' : '0 4px 12px rgba(0,56,101,0.25)',
                          '&:hover': {
                            background: hasApplied 
                              ? 'linear-gradient(135deg, #78BE20 0%, #5da010 100%)'
                              : 'linear-gradient(135deg, #002a4d 0%, #003865 100%)',
                            transform: hasApplied ? 'none' : 'translateY(-1px)'
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        {hasApplied ? 'Applied ✓' : 'Apply Now'}
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                        endIcon={expandedJob === job.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        sx={{ mt: 1, color: '#666' }}
                      >
                        Details
                      </Button>
                    </Box>
                  </Box>

                  {/* Expandable Details */}
                  <Collapse in={expandedJob === job.id}>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ 
                      display: 'grid', 
                      gap: 3, 
                      gridTemplateColumns: { md: '1fr 1fr' },
                      bgcolor: '#fafafa',
                      borderRadius: 2,
                      p: 3
                    }}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="700" color="primary" gutterBottom>
                          📋 Job Description
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                          {job.description}
                        </Typography>
                      </Box>

                      <Box>
                        {job.qualifications && job.qualifications.length > 0 && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" fontWeight="700" color="primary" gutterBottom>
                              ✅ Qualifications
                            </Typography>
                            {job.qualifications.map((qual, i) => (
                              <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start' }}>
                                <CheckCircleOutlineIcon fontSize="small" sx={{ color: '#78BE20', mt: 0.3 }} />
                                <Typography variant="body2" color="text.secondary">{qual}</Typography>
                              </Box>
                            ))}
                          </Box>
                        )}

                        {job.benefits && job.benefits.length > 0 && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" fontWeight="700" color="primary" gutterBottom>
                              🎁 Benefits
                            </Typography>
                            {job.benefits.map((benefit, i) => (
                              <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start' }}>
                                <CheckCircleOutlineIcon fontSize="small" sx={{ color: '#FFB300', mt: 0.3 }} />
                                <Typography variant="body2" color="text.secondary">{benefit}</Typography>
                              </Box>
                            ))}
                          </Box>
                        )}

                        {job.applySources && job.applySources.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" fontWeight="700" color="primary" gutterBottom>
                              🔗 Apply via
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                              {job.applySources.map((source, i) => (
                                <Chip key={i} label={source} size="small" variant="outlined" />
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Grow>
          );
        })}
        
        {!loading && jobs.length === 0 && (
          <Card sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '2px dashed #e0e0e0' }}>
            <WorkIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No jobs found</Typography>
            <Typography color="text.disabled">Try different keywords or location</Typography>
          </Card>
        )}
      </Box>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={() => setToast({...toast, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={toast.severity} 
          variant="filled" 
          sx={{ 
            fontSize: '1.1rem', 
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

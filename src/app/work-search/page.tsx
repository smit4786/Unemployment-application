'use client';

import { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Card, CardContent, Chip, 
  InputAdornment, LinearProgress, Snackbar, Alert 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { searchJobs, applyToJob, Job } from '../../lib/linkedin';
import { useAuth } from '../../lib/auth';

export default function WorkSearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('MN');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);
  const [toast, setToast] = useState<{open: boolean, message: string}>({open: false, message: ''});

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await searchJobs(query, location);
      setJobs(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job: Job) => {
    if (!user) return;
    setApplying(job.id);
    
    await applyToJob(job.id, user.id, job);
    
    setApplying(null);
    setToast({
      open: true, 
      message: `Successfully applied to ${job.title} at ${job.company}. This has been logged for your weekly audit.`
    });
  };

  return (
    <Box maxWidth="lg" mx="auto">
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Job Search & Activity Log
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Search for jobs using our integrated LinkedIn tool. Applications submitted via "Easy Apply" are automatically logged for your work search requirements.
      </Typography>

      {/* Search Bar */}
      <Card elevation={3} sx={{ mb: 4, p: 2 }}>
        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
            <TextField 
              fullWidth 
              placeholder="Job Title or Keyword"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><WorkIcon color="action" /></InputAdornment>,
              }}
            />
            <TextField 
              fullWidth 
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LocationOnIcon color="action" /></InputAdornment>,
              }}
            />
            <Button 
              variant="contained" 
              size="large" 
              type="submit" 
              disabled={loading}
              sx={{ minWidth: 150 }}
            >
              {loading ? 'Searching...' : 'Find Jobs'}
            </Button>
          </Box>
        </form>
      </Card>

      {/* Results */}
      {loading && <LinearProgress sx={{ mb: 3 }} />}

      <Box sx={{ display: 'grid', gap: 2 }}>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} variant="outlined" sx={{ '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(0,56,101,0.02)' } }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" color="primary">{job.title}</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">{job.company}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">{job.location}</Typography>
                    <Typography variant="body2" color="text.secondary">•</Typography>
                    <Typography variant="body2" color="text.secondary">Posted {job.postedDate}</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  {job.easyApply && (
                    <Chip 
                      label="Easy Apply" 
                      color="primary" 
                      size="small" 
                      variant="outlined" 
                      sx={{ mb: 1, display: 'block' }} 
                    />
                  )}
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => handleApply(job)}
                    disabled={!!applying}
                  >
                    {applying === job.id ? 'Applying...' : 'Apply Now'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          !loading && <Typography align="center" color="text.secondary">No jobs found. Try different keywords.</Typography>
        )}
      </Box>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={() => setToast({...toast, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}

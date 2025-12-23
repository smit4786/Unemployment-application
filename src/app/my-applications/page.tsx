'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Chip, Button, IconButton,
  Select, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Tabs, Tab, Tooltip, Fade, Skeleton, Avatar, FormControl, LinearProgress,
  Snackbar, Alert, CircularProgress
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GoogleIcon from '@mui/icons-material/Google';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import {
  JobApplication,
  getApplications,
  updateApplication,
  deleteApplication,
  getApplicationStats,
  getDaysSinceApplied,
  STATUS_LABELS,
  STATUS_COLORS,
} from '../../lib/applications';

export default function MyApplicationsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [editModal, setEditModal] = useState<JobApplication | null>(null);
  const [followUpModal, setFollowUpModal] = useState<JobApplication | null>(null);
  const [toast, setToast] = useState<{open: boolean, message: string, severity: 'success' | 'error' | 'info'}>({open: false, message: '', severity: 'success'});
  
  // Follow-up generation state
  const [resumeText, setResumeText] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState<{subject: string, body: string} | null>(null);
  const [generatedLinkedIn, setGeneratedLinkedIn] = useState('');
  const [generating, setGenerating] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    setLoading(true);
    setTimeout(() => {
      const apps = getApplications();
      setApplications(apps);
      setLoading(false);
    }, 300);
  };

  const stats = getApplicationStats();

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(a => a.status === filter);

  const handleStatusChange = (app: JobApplication, newStatus: JobApplication['status']) => {
    updateApplication(app.id, { status: newStatus });
    loadApplications();
    setToast({ open: true, message: `Status updated to ${STATUS_LABELS[newStatus]}`, severity: 'success' });
  };

  const handleDelete = (app: JobApplication) => {
    if (confirm(`Remove "${app.title}" at ${app.company} from your applications?`)) {
      deleteApplication(app.id);
      loadApplications();
      setToast({ open: true, message: 'Application removed', severity: 'info' });
    }
  };

  const handleSaveNotes = () => {
    if (editModal) {
      updateApplication(editModal.id, { 
        notes: editModal.notes,
        contactName: editModal.contactName,
        contactEmail: editModal.contactEmail,
        contactLinkedIn: editModal.contactLinkedIn,
      });
      setEditModal(null);
      loadApplications();
      setToast({ open: true, message: 'Notes saved', severity: 'success' });
    }
  };

  const handleGenerateFollowUp = async () => {
    if (!followUpModal) return;
    
    setGenerating(true);
    try {
      const res = await fetch('/api/v1/generate-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: followUpModal.title,
          company: followUpModal.company,
          jobDescription: followUpModal.description,
          resumeText: resumeText,
          contactName: followUpModal.contactName,
          contactEmail: followUpModal.contactEmail,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setGeneratedEmail(data.email);
        setGeneratedLinkedIn(data.linkedinMessage);
      } else {
        throw new Error('Failed to generate');
      }
    } catch (err) {
      setToast({ open: true, message: 'Failed to generate follow-up. Check API key.', severity: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setToast({ open: true, message: `${type} copied to clipboard!`, severity: 'success' });
  };

  const handleSendEmail = async () => {
    if (!generatedEmail || !followUpModal?.contactEmail) return;
    
    // If authenticated with Gmail, send directly
    if (session?.accessToken) {
      setSendingEmail(true);
      try {
        const res = await fetch('/api/gmail/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken: session.accessToken,
            to: followUpModal.contactEmail,
            subject: generatedEmail.subject,
            body: generatedEmail.body,
          }),
        });
        
        if (res.ok) {
          updateApplication(followUpModal.id, { 
            followUpSent: true, 
            followUpSentAt: new Date().toISOString(),
            status: 'following_up'
          });
          loadApplications();
          setFollowUpModal(null);
          setGeneratedEmail(null);
          setToast({ open: true, message: '✅ Email sent via Gmail!', severity: 'success' });
        } else {
          const error = await res.json();
          throw new Error(error.details || 'Failed to send');
        }
      } catch (err: any) {
        setToast({ open: true, message: `Failed to send: ${err.message}`, severity: 'error' });
      } finally {
        setSendingEmail(false);
      }
    } else {
      // Fallback to mailto:
      const mailtoLink = `mailto:${followUpModal.contactEmail}?subject=${encodeURIComponent(generatedEmail.subject)}&body=${encodeURIComponent(generatedEmail.body)}`;
      window.open(mailtoLink, '_blank');
      
      updateApplication(followUpModal.id, { 
        followUpSent: true, 
        followUpSentAt: new Date().toISOString(),
        status: 'following_up'
      });
      loadApplications();
      setFollowUpModal(null);
      setGeneratedEmail(null);
      setToast({ open: true, message: 'Email client opened! Follow-up marked.', severity: 'success' });
    }
  };

  const handleConnectGmail = () => {
    signIn('google', { callbackUrl: '/my-applications' });
  };

  const getStatusGradient = (status: string) => {
    const gradients: Record<string, string> = {
      applied: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
      following_up: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
      interviewing: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
      offer: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
      rejected: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
      withdrawn: 'linear-gradient(135deg, #9E9E9E 0%, #757575 100%)',
    };
    return gradients[status] || gradients.applied;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Hero Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #003865 0%, #0066cc 50%, #78BE20 100%)',
        pt: 4, pb: 6,
        px: 3,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', right: -80, top: -80, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <Box sx={{ position: 'absolute', right: 100, bottom: -60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(120,190,32,0.15)' }} />
        <Box sx={{ position: 'absolute', left: -40, bottom: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        
        <Box maxWidth="lg" mx="auto" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Link href="/work-search" passHref>
              <Button 
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  color: 'white', 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  px: 2,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' }
                }}
              >
                Back to Job Search
              </Button>
            </Link>
            
            <Link href="/work-search" passHref>
              <Button 
                variant="contained"
                startIcon={<WorkIcon />}
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 2,
                  fontWeight: 600,
                  '&:hover': { background: 'rgba(255,255,255,0.3)' }
                }}
              >
                Find More Jobs
              </Button>
            </Link>
          </Box>

          {/* Title */}
          <Typography variant="h3" fontWeight="800" color="white" sx={{ mb: 1, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            My Applications
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4 }}>
            Track your progress and never miss a follow-up
          </Typography>

          {/* Stats Cards - Glassmorphism style */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2 }}>
            {[
              { label: 'Total', value: stats.total, gradient: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)' },
              { label: 'Applied', value: stats.applied, gradient: 'linear-gradient(135deg, rgba(33,150,243,0.3) 0%, rgba(33,150,243,0.15) 100%)' },
              { label: 'Following Up', value: stats.followingUp, gradient: 'linear-gradient(135deg, rgba(255,152,0,0.3) 0%, rgba(255,152,0,0.15) 100%)' },
              { label: 'Interviewing', value: stats.interviewing, gradient: 'linear-gradient(135deg, rgba(156,39,176,0.3) 0%, rgba(156,39,176,0.15) 100%)' },
              { label: 'Offers', value: stats.offers, gradient: 'linear-gradient(135deg, rgba(76,175,80,0.3) 0%, rgba(76,175,80,0.15) 100%)' },
            ].map((stat, i) => (
              <Card 
                key={i}
                sx={{ 
                  p: 2.5, 
                  borderRadius: 3, 
                  background: stat.gradient,
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }
                }}
              >
                <Typography variant="h2" fontWeight="800" color="white" sx={{ lineHeight: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, mt: 0.5 }}>
                  {stat.label}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box maxWidth="lg" mx="auto" sx={{ px: 3, mt: -3, position: 'relative', zIndex: 2 }}>
        {/* Filter Card */}
        <Card sx={{ 
          borderRadius: 3, 
          mb: 3, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'visible'
        }}>
          <Tabs 
            value={filter} 
            onChange={(e, val) => setFilter(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              '& .MuiTab-root': { 
                fontWeight: 600, 
                textTransform: 'none',
                fontSize: '0.95rem',
                minHeight: 56,
                transition: 'all 0.2s'
              },
              '& .Mui-selected': { color: '#003865 !important' },
              '& .MuiTabs-indicator': { 
                height: 3, 
                borderRadius: '3px 3px 0 0',
                background: 'linear-gradient(90deg, #003865, #78BE20)'
              }
            }}
          >
            <Tab label={`All (${stats.total})`} value="all" />
            <Tab label={`Applied (${stats.applied})`} value="applied" />
            <Tab label={`Following Up (${stats.followingUp})`} value="following_up" />
            <Tab label={`Interviewing (${stats.interviewing})`} value="interviewing" />
            <Tab label={`Offers (${stats.offers})`} value="offer" />
          </Tabs>
        </Card>

        {/* Applications List */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[1,2,3].map(i => (
              <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: 3 }} />
            ))}
          </Box>
        ) : filteredApps.length === 0 ? (
          <Card sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: 4, 
            border: '2px dashed #e0e0e0',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
          }}>
            <Box sx={{ 
              width: 80, height: 80, 
              borderRadius: '50%', 
              bgcolor: '#f5f5f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mx: 'auto', mb: 3
            }}>
              <WorkIcon sx={{ fontSize: 40, color: '#bbb' }} />
            </Box>
            <Typography variant="h5" fontWeight="700" color="text.secondary" gutterBottom>
              {filter === 'all' ? 'No applications yet' : `No ${STATUS_LABELS[filter as JobApplication['status']]} applications`}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              Start tracking your job applications by applying to jobs in the Job Search
            </Typography>
            <Link href="/work-search" passHref>
              <Button 
                variant="contained" 
                size="large"
                startIcon={<WorkIcon />}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #003865 0%, #0055a5 100%)',
                  boxShadow: '0 4px 15px rgba(0,56,101,0.3)',
                }}
              >
                Start Job Search
              </Button>
            </Link>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 4 }}>
            {filteredApps.map((app, index) => {
              const daysSince = getDaysSinceApplied(app.appliedAt);
              const needsFollowUp = daysSince >= 7 && !app.followUpSent && app.status === 'applied';
              
              return (
                <Fade in key={app.id} timeout={200 + index * 50}>
                  <Card sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: needsFollowUp ? '0 0 0 2px #FF9800, 0 4px 20px rgba(255,152,0,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { 
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    {/* Status indicator bar */}
                    <Box sx={{ height: 4, background: getStatusGradient(app.status) }} />
                    
                    <CardContent sx={{ p: 3 }}>
                      {needsFollowUp && (
                        <Chip 
                          icon={<ScheduleIcon />}
                          label="⏰ Time to follow up!" 
                          size="small"
                          sx={{ 
                            mb: 2, 
                            background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                            color: '#E65100',
                            fontWeight: 700,
                            border: '1px solid #FFB74D',
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.7 }
                            }
                          }} 
                        />
                      )}
                      
                      <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                        {/* Logo */}
                        <Avatar 
                          src={app.logoUrl || undefined}
                          variant="rounded"
                          sx={{ 
                            width: 64, height: 64, 
                            bgcolor: app.logoUrl ? 'white' : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                            border: '1px solid #eee',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                          }}
                        >
                          {!app.logoUrl && <WorkIcon sx={{ color: '#999', fontSize: 28 }} />}
                        </Avatar>
                        
                        {/* Job Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1 }}>
                            <Box>
                              <Typography variant="h6" fontWeight="700" color="#1a1a2e" sx={{ lineHeight: 1.3 }}>
                                {app.title}
                              </Typography>
                              <Typography variant="subtitle1" color="text.secondary" fontWeight="500">
                                {app.company}
                              </Typography>
                            </Box>
                            
                            {/* Status Select */}
                            <FormControl size="small">
                              <Select
                                value={app.status}
                                onChange={(e) => handleStatusChange(app, e.target.value as JobApplication['status'])}
                                sx={{ 
                                  borderRadius: 2,
                                  fontWeight: 600,
                                  fontSize: '0.85rem',
                                  minWidth: 140,
                                  background: getStatusGradient(app.status),
                                  color: 'white',
                                  '& .MuiSelect-icon': { color: 'white' },
                                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                  '&:hover': { opacity: 0.9 }
                                }}
                              >
                                <MenuItem value="applied">Applied</MenuItem>
                                <MenuItem value="following_up">Following Up</MenuItem>
                                <MenuItem value="interviewing">Interviewing</MenuItem>
                                <MenuItem value="offer">Offer Received</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
                                <MenuItem value="withdrawn">Withdrawn</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                          
                          {/* Tags */}
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: app.notes ? 1.5 : 0 }}>
                            <Chip 
                              icon={<LocationOnIcon sx={{ fontSize: 16 }} />} 
                              label={app.location} 
                              size="small" 
                              sx={{ bgcolor: '#f5f5f5', fontWeight: 500 }}
                            />
                            <Chip 
                              icon={<AccessTimeIcon sx={{ fontSize: 16 }} />} 
                              label={daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince}d ago`}
                              size="small"
                              sx={{ bgcolor: '#f5f5f5', fontWeight: 500 }}
                            />
                            {app.salary && (
                              <Chip 
                                label={app.salary} 
                                size="small" 
                                sx={{ 
                                  background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)', 
                                  color: '#2E7D32',
                                  fontWeight: 600 
                                }} 
                              />
                            )}
                            {app.followUpSent && (
                              <Chip 
                                icon={<CheckCircleIcon sx={{ fontSize: 16 }} />} 
                                label="Followed up" 
                                size="small" 
                                sx={{ 
                                  background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', 
                                  color: '#1565C0',
                                  fontWeight: 600 
                                }} 
                              />
                            )}
                          </Box>
                          
                          {/* Notes preview */}
                          {app.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ 
                              mt: 1, 
                              p: 1.5, 
                              bgcolor: '#fafafa', 
                              borderRadius: 2,
                              borderLeft: '3px solid #78BE20'
                            }}>
                              📝 {app.notes.substring(0, 120)}{app.notes.length > 120 ? '...' : ''}
                            </Typography>
                          )}
                        </Box>
                        
                        {/* Actions */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<EmailIcon />}
                            onClick={() => setFollowUpModal(app)}
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              px: 2,
                              background: 'linear-gradient(135deg, #78BE20 0%, #5da010 100%)',
                              boxShadow: '0 2px 8px rgba(120,190,32,0.3)',
                              '&:hover': { boxShadow: '0 4px 12px rgba(120,190,32,0.4)' }
                            }}
                          >
                            Follow Up
                          </Button>
                          
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title="Edit notes" arrow>
                              <IconButton 
                                size="small" 
                                onClick={() => setEditModal(app)}
                                sx={{ 
                                  bgcolor: '#f5f5f5', 
                                  '&:hover': { bgcolor: '#e0e0e0' } 
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {app.url && (
                              <Tooltip title="View job posting" arrow>
                                <IconButton 
                                  size="small" 
                                  component="a" 
                                  href={app.url} 
                                  target="_blank"
                                  sx={{ 
                                    bgcolor: '#f5f5f5', 
                                    '&:hover': { bgcolor: '#e0e0e0' } 
                                  }}
                                >
                                  <OpenInNewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Remove" arrow>
                              <IconButton 
                                size="small" 
                                onClick={() => handleDelete(app)} 
                                sx={{ 
                                  bgcolor: '#fff5f5', 
                                  color: '#F44336',
                                  '&:hover': { bgcolor: '#ffebee' } 
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Edit Notes Modal */}
      <Dialog 
        open={!!editModal} 
        onClose={() => setEditModal(null)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          ✏️ Edit Application Details
        </DialogTitle>
        <DialogContent>
          {editModal && (
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Card sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight="600" color="primary">
                  {editModal.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {editModal.company}
                </Typography>
              </Card>
              
              <TextField
                label="Contact Name"
                value={editModal.contactName || ''}
                onChange={(e) => setEditModal({ ...editModal, contactName: e.target.value })}
                fullWidth
                placeholder="e.g., John Smith (Hiring Manager)"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              <TextField
                label="Contact Email"
                value={editModal.contactEmail || ''}
                onChange={(e) => setEditModal({ ...editModal, contactEmail: e.target.value })}
                fullWidth
                placeholder="e.g., john.smith@company.com"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              <TextField
                label="LinkedIn Profile URL"
                value={editModal.contactLinkedIn || ''}
                onChange={(e) => setEditModal({ ...editModal, contactLinkedIn: e.target.value })}
                fullWidth
                placeholder="e.g., https://linkedin.com/in/johnsmith"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              
              <TextField
                label="Notes"
                value={editModal.notes || ''}
                onChange={(e) => setEditModal({ ...editModal, notes: e.target.value })}
                fullWidth
                multiline
                rows={4}
                placeholder="Add any notes about this application..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={() => setEditModal(null)} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveNotes}
            sx={{ 
              borderRadius: 2, 
              px: 3,
              background: 'linear-gradient(135deg, #003865 0%, #0055a5 100%)'
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Follow-Up Modal */}
      <Dialog 
        open={!!followUpModal} 
        onClose={() => { setFollowUpModal(null); setGeneratedEmail(null); setGeneratedLinkedIn(''); }} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >

        {followUpModal && (
          <>
            <DialogTitle sx={{ 
              pb: 2, 
              pt: 2.5,
              px: 3,
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'linear-gradient(135deg, #003865 0%, #0055a5 100%)',
              color: 'white'
            }}>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Follow-Up Assistant
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Generate personalized messages for {followUpModal.company}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              
              {/* Job Summary Card */}
              <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: '#f8f9fa', mt: 1 }}>
                <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>{followUpModal.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{followUpModal.company}</Typography>
                    </Box>
                    <Chip 
                      label={STATUS_LABELS[followUpModal.status]} 
                      size="small"
                      sx={{ 
                        bgcolor: STATUS_COLORS[followUpModal.status] + '20',
                        color: STATUS_COLORS[followUpModal.status],
                        fontWeight: 600,
                        borderRadius: 1
                      }} 
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Contact Info Inputs */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Contact Name (Optional)"
                    value={followUpModal.contactName || ''}
                    onChange={(e) => setFollowUpModal({ ...followUpModal, contactName: e.target.value })}
                    fullWidth
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  <TextField
                    label="Contact Email"
                    value={followUpModal.contactEmail || ''}
                    onChange={(e) => setFollowUpModal({ ...followUpModal, contactEmail: e.target.value })}
                    fullWidth
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>
                
                {/* Resume Input */}
                <Box>
                  <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 600, color: 'text.secondary' }}>
                    RESUME CONTEXT (Optional)
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<AutoAwesomeIcon />}
                      sx={{ 
                        borderRadius: 2, 
                        flex: 1, 
                        borderColor: '#e0e0e0',
                        color: 'text.primary',
                        textTransform: 'none',
                        '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(25, 118, 210, 0.04)' }
                      }}
                    >
                      Upload Resume (PDF)
                      <input
                        type="file"
                        hidden
                        accept=".pdf"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            
                            setGenerating(true);
                            setToast({ open: true, message: 'Parsing resume...', severity: 'info' });
                            
                            try {
                              const res = await fetch('/api/v1/parse-resume', {
                                method: 'POST',
                                body: formData
                              });
                              
                              if (res.ok) {
                                const data = await res.json();
                                setResumeText(data.text);
                                setToast({ open: true, message: 'Resume parsed! You can now edit the text below.', severity: 'success' });
                              } else {
                                throw new Error('Failed to parse PDF');
                              }
                            } catch (err) {
                              setToast({ open: true, message: 'Failed to parse resume PDF.', severity: 'error' });
                            } finally {
                              setGenerating(false);
                            }
                          }
                        }}
                      />
                    </Button>
                  </Box>

                  <TextField
                    placeholder="Or paste your resume text here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    size="small"
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
                        bgcolor: '#fafafa',
                        fontSize: '0.875rem'
                      } 
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    * We extract text locally to generate the email. Your resume is not stored.
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGenerateFollowUp}
                  disabled={generating}
                  startIcon={generating ? null : <AutoAwesomeIcon />}
                  sx={{
                    alignSelf: 'center',
                    borderRadius: 3,
                    px: 5,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #78BE20 0%, #5da010 100%)',
                    boxShadow: '0 4px 15px rgba(120,190,32,0.3)',
                    '&:hover': { boxShadow: '0 6px 20px rgba(120,190,32,0.4)' }
                  }}
                >
                  {generating ? '✨ Generating...' : 'Generate with AI'}
                </Button>
                
                {generating && <LinearProgress sx={{ borderRadius: 1 }} />}
                
                {/* Generated Content */}
                {generatedEmail && (
                  <Fade in>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 2,
                      mt: 2,
                      p: 3,
                      bgcolor: '#f8fafc',
                      borderRadius: 3,
                      border: '1px solid #e0e0e0'
                    }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon color="primary" />
                        <Typography variant="h6" color="primary.main" fontWeight={700}>
                          Generated Email
                        </Typography>
                      </Box>
                      
                      <TextField
                        label="Subject Line"
                        value={generatedEmail.subject}
                        onChange={(e) => setGeneratedEmail({ ...generatedEmail, subject: e.target.value })}
                        fullWidth
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                      />
                      
                      <TextField
                        label="Email Body"
                        value={generatedEmail.body}
                        onChange={(e) => setGeneratedEmail({ ...generatedEmail, body: e.target.value })}
                        fullWidth
                        multiline
                        rows={8}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                      />
                      
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        {session?.accessToken ? (
                          <Button
                            variant="contained"
                            startIcon={sendingEmail ? <CircularProgress size={18} color="inherit" /> : <EmailIcon />}
                            onClick={handleSendEmail}
                            disabled={!followUpModal.contactEmail || sendingEmail}
                            sx={{ 
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #4285F4 0%, #1a73e8 100%)',
                              fontWeight: 600
                            }}
                          >
                            {sendingEmail ? 'Sending...' : 'Send via Gmail'}
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="contained"
                              startIcon={<GoogleIcon />}
                              onClick={handleConnectGmail}
                              sx={{ 
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #EA4335 0%, #FBBC04 50%, #34A853 100%)',
                                fontWeight: 600
                              }}
                            >
                              Connect Gmail
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<EmailIcon />}
                              onClick={handleSendEmail}
                              disabled={!followUpModal.contactEmail}
                              sx={{ borderRadius: 2 }}
                            >
                              Open in Email Client
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outlined"
                          startIcon={<ContentCopyIcon />}
                          onClick={() => handleCopyToClipboard(generatedEmail.body, 'Email')}
                          sx={{ borderRadius: 2 }}
                        >
                          Copy Email
                        </Button>
                      </Box>
                    </Box>
                  </Fade>
                )}
                
                {generatedLinkedIn && (
                  <Fade in>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 2,
                      mt: 2,
                      p: 3,
                      bgcolor: '#f0f7ff',
                      borderRadius: 3,
                      border: '1px solid #bbdefb'
                    }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <LinkedInIcon color="primary" />
                        <Typography variant="h6" color="primary.main" fontWeight={700}>
                          LinkedIn Message
                        </Typography>
                      </Box>
                      
                      <TextField
                        label="Message Body"
                        value={generatedLinkedIn}
                        onChange={(e) => setGeneratedLinkedIn(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
                      />
                      
                      <Button
                        variant="outlined"
                        startIcon={<ContentCopyIcon />}
                        onClick={() => handleCopyToClipboard(generatedLinkedIn, 'LinkedIn Message')}
                        sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
                      >
                        Copy Message
                      </Button>
                    </Box>
                  </Fade>
                )}

            </DialogContent>
            <DialogActions sx={{ p: 2.5, borderTop: '1px solid #e0e0e0' }}>
              <Button 
                onClick={() => { setFollowUpModal(null); setGeneratedEmail(null); setGeneratedLinkedIn(''); }}
                sx={{ borderRadius: 2 }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={toast.severity} 
          variant="filled" 
          sx={{ 
            fontWeight: 600, 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

'use client';

import { Typography, Button, Container, Grid, Card, CardContent, Box, Stack, Chip } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: 12, pb: 12, 
          textAlign: 'center', 
          background: 'radial-gradient(circle at 50% 50%, rgba(200, 225, 255, 0.4) 0%, rgba(244, 247, 250, 0) 70%)',
          mx: -2
        }}
      >
        <Container maxWidth="md">
          <Chip label="Official MN Service" color="primary" variant="outlined" size="small" sx={{ mb: 2, fontWeight: 600 }} />
          <Typography variant="h1" gutterBottom sx={{ lineHeight: 1.1, mb: 3 }}>
             Modern Support for <br/> Minnesota's Workforce
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
            Fast, secure, and reliable unemployment insurance services aimed at getting you back on your feet.
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 8 }}>
            <Button variant="contained" size="large" component={Link} href="/eligibility">
              Check Eligibility
            </Button>
            <Button variant="outlined" size="large" component={Link} href="/auth/login">
              Log In to Account
            </Button>
          </Stack>

          {/* Abstract Dashboard Preview */}
          <Box 
            sx={{ 
              height: 300, 
              width: '100%', 
              maxWidth: 800,
              mx: 'auto',
              bgcolor: 'background.paper',
              borderRadius: 4,
              boxShadow: '0 20px 60px -10px rgba(0, 56, 101, 0.15)',
              border: '1px solid rgba(0,0,0,0.05)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
             <Typography variant="h6" color="primary.light">Interactive Platform Simulation</Typography>
             {/* Decorative circles */}
             <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, bgcolor: 'secondary.light', borderRadius: '50%', opacity: 0.1 }} />
             <Box sx={{ position: 'absolute', bottom: -20, left: -20, width: 150, height: 150, bgcolor: 'primary.main', borderRadius: '50%', opacity: 0.05 }} />
          </Box>
        </Container>
      </Box>

      {/* Features Grid */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>Everything you need</Typography>
          
          <Grid container spacing={4}>
            {[
              { title: 'Easy Eligibility', desc: 'Determine if you qualify in minutes with our guided wizard.', color: '#003865' },
              { title: 'Weekly Requests', desc: 'File for benefits weekly with a streamlined, error-free process.', color: '#78BE20' },
              { title: 'Job Search', desc: 'Find and log job applications directly within the portal.', color: '#336699' }
            ].map((feature, i) => (
              <Grid key={i} size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
                  <CardContent sx={{ p: 4, textAlign: 'left' }}>
                    <Box sx={{ width: 50, height: 50, bgcolor: feature.color, borderRadius: 3, mb: 3, opacity: 0.1 }} />
                    <Typography variant="h4" gutterBottom>{feature.title}</Typography>
                    <Typography color="text.secondary">{feature.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: 10, bgcolor: 'primary.main', borderRadius: 4, color: 'white', textAlign: 'center', mb: 4 }}>
        <Container maxWidth="sm">
          <Typography variant="h3" gutterBottom color="white">Ready to start?</Typography>
          <Typography variant="body1" paragraph sx={{ opacity: 0.9, mb: 4 }}>
             Create an account or log in to manage your benefits.
          </Typography>
          <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }} href="/apply">
            Start Application
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

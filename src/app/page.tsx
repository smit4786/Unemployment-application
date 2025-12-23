'use client';

import { Box, Typography, Button, Card, CardContent, CardActions } from '@mui/material';
import NextLink from 'next/link';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 8, 
        bgcolor: 'primary.main', 
        color: 'white',
        borderRadius: 4,
        mb: 6,
        px: 2
      }}>
        <Typography variant="h2" gutterBottom>
          Minnesota Unemployment Insurance
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Temporary partial wage replacement for MN workers
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            component={NextLink} 
            href="/apply"
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Apply for Benefits
          </Button>
          <Button 
            variant="outlined" 
            sx={{ 
              color: 'white', 
              borderColor: 'white', 
              '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' },
              px: 4, 
              py: 1.5,
              fontSize: '1.1rem'
            }}
            component={NextLink} 
            href="/eligibility"
          >
            Check Eligibility
          </Button>
        </Box>
      </Box>

      {/* Quick Info Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr 1fr' }, gap: 4 }}>
        <Box>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="div" gutterBottom>
                Am I Eligible?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review requirements regarding past earnings, reason for separation, and availability to work.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button size="small" component={NextLink} href="/eligibility">Use Checker Tool</Button>
            </CardActions>
          </Card>
        </Box>

        <Box>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <DescriptionIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="div" gutterBottom>
                What You Need
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gather your SSN, Driver's License/ID, and employment history for the last 18 months before applying.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button size="small" component={NextLink} href="/faq">View Full Checklist</Button>
            </CardActions>
          </Card>
        </Box>

        <Box>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <HelpOutlineIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="div" gutterBottom>
                Help & FAQ
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Find answers to common questions about weekly requests, benefit amounts, and tax information.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button size="small" component={NextLink} href="/faq">Visit Help Center</Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

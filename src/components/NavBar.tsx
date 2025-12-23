'use client';

import { AppBar, Toolbar, Typography, Container, Box, Button, Chip, Avatar } from "@mui/material";
import Link from "next/link";
import { useAuth } from "../lib/auth";

export default function NavBar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            MN Unemployment Services
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button color="inherit" component={Link} href="/">Home</Button>
            
            {/* Public Links */}
            {!isAuthenticated && (
              <>
                 <Button color="inherit" component={Link} href="/eligibility">Eligibility</Button>
                 <Button color="inherit" component={Link} href="/apply">Apply</Button>
                 <Button color="inherit" component={Link} href="/auth/login">Log In</Button>
              </>
            )}

            {/* Private Links */}
            {isAuthenticated && (
              <>
                <Button color="inherit" component={Link} href="/dashboard">Dashboard</Button>
                <Button color="inherit" component={Link} href="/weekly-request">Request Benefit</Button>
                <Button color="inherit" component={Link} href="/work-search">Job Search</Button>
                
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, bgcolor: 'rgba(255,255,255,0.15)', px: 2, py: 0.5, borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    Welcome, {user?.name.split(' ')[0]}
                  </Typography>
                  <Button color="inherit" size="small" onClick={logout} sx={{ minWidth: 0, p: 0.5 }}>
                     Logout
                  </Button>
                </Box>
              </>
            )}
            
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

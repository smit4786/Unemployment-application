'use client';

import { AppBar, Toolbar, Typography, Container, Box, Button, Chip, Avatar } from "@mui/material";
import Link from "next/link";
import { useAuth } from "../lib/auth";
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0}
      sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
           {/* Logo Placeholder - simplified text for now */}
           <Box sx={{ 
             width: 40, height: 40, bgcolor: 'primary.main', borderRadius: '50%', 
             display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' 
           }}>mn</Box>
           <Typography variant="h6" color="primary" fontWeight="800" sx={{ letterSpacing: '-0.5px' }}>
             Unemployment Insurance
           </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button 
              color={pathname === '/' ? 'primary' : 'inherit'} 
              component={Link} 
              href="/"
              variant={pathname === '/' ? 'contained' : 'text'}
            >
              Home
            </Button>
            
            {!isAuthenticated && (
              <>
                <Button color={pathname === '/eligibility' ? 'primary' : 'inherit'} component={Link} href="/eligibility">Check Eligibility</Button>
                <Button color={pathname === '/apply' ? 'primary' : 'inherit'} component={Link} href="/apply">Apply Now</Button>
              </>
            )}

            {isAuthenticated && (
              <>
                <Button color={pathname === '/dashboard' ? 'primary' : 'inherit'} component={Link} href="/dashboard">Dashboard</Button>
                <Button color={pathname === '/weekly-request' ? 'primary' : 'inherit'} component={Link} href="/weekly-request">Request Benefit</Button>
                <Button color={pathname === '/work-search' ? 'primary' : 'inherit'} component={Link} href="/work-search">Job Search</Button>
                
                <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.875rem' }}>
                    {user?.name.charAt(0)}
                  </Avatar>
                  <Button 
                    variant="outlined" 
                    color="inherit" 
                    size="small" 
                    onClick={logout}
                    sx={{ borderColor: 'rgba(0,0,0,0.1)', minWidth: 0, px: 2 }}
                  >
                    Log Out
                  </Button>
                </Box>
              </>
            )}

            {!isAuthenticated && (
              <Button 
                variant="outlined" 
                color="primary" 
                component={Link} 
                href="/auth/login"
                sx={{ ml: 2 }}
              >
                Log In
              </Button>
            )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

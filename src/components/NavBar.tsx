'use client';

import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme, useMediaQuery } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Link from "next/link";
import { useAuth } from "../lib/auth";
import { usePathname } from 'next/navigation';
import { useState } from "react";

export default function NavBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { label: 'Home', href: '/', show: true },
    { label: 'Check Eligibility', href: '/eligibility', show: !isAuthenticated },
    { label: 'Apply Now', href: '/apply', show: !isAuthenticated },
    { label: 'Dashboard', href: '/dashboard', show: isAuthenticated },
    { label: 'Request Benefit', href: '/weekly-request', show: isAuthenticated },
    { label: 'Job Search', href: '/work-search', show: isAuthenticated },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MN Unemployment
      </Typography>
      <List>
        {navLinks.filter(link => link.show).map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={Link} href={item.href} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && (
           <ListItem disablePadding>
             <ListItemButton onClick={logout} sx={{ textAlign: 'center', color: 'error.main' }}>
               <ListItemText primary="Log Out" />
             </ListItemButton>
           </ListItem>
        )}
        {!isAuthenticated && (
           <ListItem disablePadding>
             <ListItemButton component={Link} href="/auth/login" sx={{ textAlign: 'center', color: 'primary.main' }}>
               <ListItemText primary="Log In" />
             </ListItemButton>
           </ListItem>
        )}
      </List>
    </Box>
  );

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
           <IconButton
             color="inherit"
             aria-label="open drawer"
             edge="start"
             onClick={handleDrawerToggle}
             sx={{ mr: 2, display: { md: 'none' } }}
           >
             <MenuIcon />
           </IconButton>

           <Box sx={{ 
             width: 40, height: 40, bgcolor: 'primary.main', borderRadius: '50%', 
             display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' 
           }}>mn</Box>
           <Typography variant="h6" color="primary" fontWeight="800" sx={{ letterSpacing: '-0.5px' }}>
             Unemployment Insurance
           </Typography>
        </Box>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
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
      
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </AppBar>
  );
}

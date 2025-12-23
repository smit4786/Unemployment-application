import type { Metadata } from "next";
import ThemeRegistry from "../ThemeRegistry";
import { Container, Box, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import { AuthProvider } from "../lib/auth";
import { AuthProvider as NextAuthProvider } from "../components/AuthProvider";

export const metadata: Metadata = {
  title: "NorthStar Works | Career & Benefit Services",
  description: "Minnesota's unified platform for unemployment benefits and career advancement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NextAuthProvider>
          <ThemeRegistry>
            <AuthProvider>
              <NavBar />
              <Box component="main" sx={{ flexGrow: 1, py: 4, px: 2 }}>
                <Container maxWidth="lg">
                  {children}
                </Container>
              </Box>
              <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, mt: 'auto', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <Container maxWidth="lg">
                  <Typography variant="body2" color="text.secondary" align="center">
                    © {new Date().getFullYear()} Minnesota Unemployment Services Simulation. Not an official government site.
                  </Typography>
                </Container>
              </Box>
            </AuthProvider>
          </ThemeRegistry>
        </NextAuthProvider>
      </body>
    </html>
  );
}

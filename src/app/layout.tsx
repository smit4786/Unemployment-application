import type { Metadata } from "next";
import ThemeRegistry from "../ThemeRegistry";
import { Container, Box, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import { AuthProvider } from "../lib/auth";

export const metadata: Metadata = {
  title: "MN Unemployment Insurance",
  description: "Apply for unemployment benefits in Minnesota",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
      </body>
    </html>
  );
}

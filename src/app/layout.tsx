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
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <NavBar />
              <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Container maxWidth="lg">
                  {children}
                </Container>
              </Box>
              <Box component="footer" sx={{ bgcolor: '#eee', py: 3, mt: 'auto' }}>
                <Container maxWidth="lg">
                  <Typography variant="body2" color="text.secondary" align="center">
                    © {new Date().getFullYear()} Minnesota Unemployment Services Simulation. Not an official government site.
                  </Typography>
                </Container>
              </Box>
            </Box>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}

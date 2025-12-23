'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, Typography, Stepper, Step, StepLabel, Button, Card, CardContent, 
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Alert, Stack 
} from '@mui/material';

const steps = ['Work & Earnings', 'Job Search', 'Review'];

export default function WeeklyRequestPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [answers, setAnswers] = useState({
    worked: '',
    hours: '',
    earnings: '',
    lookedForWork: '',
    ableToWork: ''
  });

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      await handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, I'd update the global store here via an API route
    // For now, let's assume the dashboard will pick up a query param
    router.push('/dashboard?claimFiled=true');
  };

  return (
    <Box maxWidth="md" mx="auto">
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Request Benefit Payment
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Week of Dec 15 - Dec 21
      </Typography>

      <Stepper activeStep={activeStep} sx={{ my: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card variant="outlined">
        <CardContent sx={{ p: 4 }}>
          
          {activeStep === 0 && (
            <Stack spacing={4}>
              <FormControl>
                <FormLabel id="worked-label" sx={{ color: 'text.primary', fontSize: '1.1rem', mb: 1 }}>
                  Did you work or perform services (paid or unpaid) during the week?
                </FormLabel>
                <RadioGroup name="worked" value={answers.worked} onChange={handleChange}>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>

              {answers.worked === 'yes' && (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                   <TextField 
                     label="Hours Worked" 
                     name="hours" 
                     type="number" 
                     value={answers.hours} 
                     onChange={handleChange} 
                     helperText="Total hours for the week"
                   />
                   <TextField 
                     label="Gross Earnings ($)" 
                     name="earnings" 
                     type="number" 
                     value={answers.earnings} 
                     onChange={handleChange} 
                     helperText="Before taxes"
                   />
                </Box>
              )}
            </Stack>
          )}

          {activeStep === 1 && (
            <Stack spacing={4}>
               <FormControl>
                <FormLabel sx={{ color: 'text.primary', fontSize: '1.1rem', mb: 1 }}>
                  Did you look for work this week?
                </FormLabel>
                <RadioGroup name="lookedForWork" value={answers.lookedForWork} onChange={handleChange}>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel sx={{ color: 'text.primary', fontSize: '1.1rem', mb: 1 }}>
                  Were you able and available for work?
                </FormLabel>
                <RadioGroup name="ableToWork" value={answers.ableToWork} onChange={handleChange}>
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Stack>
          )}

          {activeStep === 2 && (
             <Box>
               <Typography variant="h6" gutterBottom>Review & Certify</Typography>
               <Alert severity="warning" sx={{ mb: 3 }}>
                 Warning: Providing false information to obtain benefits is fraud and can result in penalties and prosecution.
               </Alert>
               
               <Stack spacing={2} sx={{ mb: 4 }}>
                 <Typography><strong>Worked:</strong> {answers.worked === 'yes' ? `Yes (${answers.hours} hrs, $${answers.earnings})` : 'No'}</Typography>
                 <Typography><strong>Looked for work:</strong> {answers.lookedForWork === 'yes' ? 'Yes' : 'No'}</Typography>
                 <Typography><strong>Able & Available:</strong> {answers.ableToWork === 'yes' ? 'Yes' : 'No'}</Typography>
               </Stack>

               <Typography variant="body2">
                 By clicking "Submit Request", I certify that the information I provided is true and correct.
               </Typography>
             </Box>
          )}

        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 3 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={handleNext} variant="contained" size="large" disabled={loading}>
          {activeStep === steps.length - 1 ? (loading ? 'Submitting...' : 'Submit Request') : 'Next'}
        </Button>
      </Box>
    </Box>
  );
}

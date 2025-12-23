"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
} from "@mui/material";
import NextLink from "next/link";

export default function EligibilityPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<"eligible" | "ineligible" | null>(null);

  const questions = [
    {
      id: "residency",
      label: "Did you work in Minnesota during the last 18 months?",
    },
    {
      id: "separation",
      label:
        "Are you unemployed or working reduced hours through no fault of your own?",
    },
    {
      id: "availability",
      label: "Are you able and available to work immediately?",
    },
    {
      id: "earnings",
      label: "Did you earn at least $4,000 in your base period?",
      helper:
        "The base period is typically the first 4 of the last 5 completed calendar quarters.",
    },
  ];

  const handleAnswerChange = (value: string) => {
    const currentQ = questions[step];
    setAnswers({ ...answers, [currentQ.id]: value });
  };

  const handleNext = () => {
    const currentQ = questions[step];
    const value = answers[currentQ.id];

    if (value === 'no') {
      setResult('ineligible');
    } else if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResult('eligible');
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <Box maxWidth="md" mx="auto">
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Eligibility Checker
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary" mb={4}>
        Answer a few simple questions to see if you might qualify for Minnesota
        Unemployment Insurance benefits.
      </Typography>

      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {result === null ? (
            <FormControl component="fieldset" fullWidth>
              <FormLabel
                component="legend"
                sx={{
                  fontSize: "1.25rem",
                  color: "text.primary",
                  mb: 2,
                  fontWeight: 500,
                }}
              >
                {questions[step].label}
              </FormLabel>
              {questions[step].helper && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {questions[step].helper}
                </Typography>
              )}
              <RadioGroup
                row
                name={questions[step].id}
                value={answers[questions[step].id] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>

              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={!answers[questions[step].id]}
                >
                  {step === questions.length - 1 ? "Check Eligibility" : "Next"}
                </Button>
              </Box>
            </FormControl>
          ) : result === "eligible" ? (
            <Box textAlign="center">
              <Alert severity="success" sx={{ mb: 3, fontSize: "1.1rem" }}>
                Based on your answers, you likely qualify for benefits!
              </Alert>
              <Typography paragraph>
                The next step is to submit your official application.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={NextLink}
                href="/apply"
              >
                Start Application
              </Button>
              <Button color="inherit" onClick={reset} sx={{ ml: 2 }}>
                Start Over
              </Button>
            </Box>
          ) : (
            <Box textAlign="center">
              <Alert severity="warning" sx={{ mb: 3, fontSize: "1.1rem" }}>
                You may not meet the standard eligibility requirements.
              </Alert>
              <Typography paragraph>
                However, every situation is unique. You still have the right to
                apply and have an official determination made.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                component={NextLink}
                href="/apply"
              >
                Apply Anyway
              </Button>
              <Button color="inherit" onClick={reset} sx={{ ml: 2 }}>
                Check Again
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {result === null && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Question {step + 1} of {questions.length}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

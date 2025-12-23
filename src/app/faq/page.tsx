'use client';

import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Container } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NextLink from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      question: 'When should I apply for benefits?',
      answer: 'You should apply for benefits as soon as you become unemployed or your hours are reduced. Your claim is effective the Sunday of the week you apply. Waiting to apply can result in a loss of benefits.',
    },
    {
      question: 'How do I request benefit payments?',
      answer: 'You must request a benefit payment each week you wish to receive benefits. You can do this online through your account. You will report your eligibility and any earnings for that specific week.',
    },
    {
      question: 'What information do I need to apply?',
      answer: 'You will need your Social Security number, Driver\'s License or State ID, and employment history for the last 18 months (including employer names, addresses, dates worked, and gross wages).',
    },
    {
      question: 'How much will I receive?',
      answer: 'Your weekly benefit amount is approx 50% of your average weekly wage during your base period, up to a state maximum. You will receive a Determination of Benefit Account with the exact amount after applying.',
    },
    {
      question: 'Do I have to look for work?',
      answer: 'Yes. You must actively seek suitable employment each week you claim benefits and keep a record of your work search activities.',
    },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 4 }}>
          Common questions about the Minnesota Unemployment Insurance program.
        </Typography>

        {faqs.map((faq, index) => (
          <Accordion key={index} elevation={2} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="500">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2">
            Need more help? Visit the official <NextLink href="https://www.uimn.org" target="_blank" style={{ color: '#003865', fontWeight: 'bold' }}>uimn.org</NextLink> website.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

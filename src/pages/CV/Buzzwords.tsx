import { Box, Divider, Typography } from '@mui/material';

const buzzwords = [
  'TypeScript',
  'JavaScript',
  'React',
  'Node.js',
  'GoLang',
  'AWS',
  'Electron',
  'Kubernetes',
  'Docker',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'GraphQL',
  'REST',
  'CI/CD',
  'TDD',
  'Microservices',
  'Serverless',
  'Machine Learning',
  'AI',
  'Telegram',
  'Chatbots',
  'WEB3',
  'Blockchain',
  'TON',
];
export const Buzzwords = () => {
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Typography variant="h5" letterSpacing="-0.05em" fontWeight="700">
        BUZZWORDS
      </Typography>
      <Divider variant="fullWidth" sx={{ backgroundColor: '#000', mt: '-4px' }} />
      <Box
        sx={{
          py: 2,
        }}
      >
        Tech stack (in not a particular order): {buzzwords.join(', ')}
      </Box>
    </Box>
  );
};
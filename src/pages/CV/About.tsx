import { Box, Typography } from '@mui/material';

export const About = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="body1">
        A software engineer with over ten years of experience in creating scalable, high-performing software solutions,
        specialising in AI technologies, cloud computing, and proficient in Typescript, and GoLang. Leading the design
        and implementation of innovative projects across a range of sizes, from small startups to major corporations.
        Skilled at both individual work and contributing within a team, ensuring a cohesive and cooperative atmosphere
      </Typography>
    </Box>
  );
};

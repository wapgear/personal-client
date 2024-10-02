import { Box, Divider, Typography } from '@mui/material';
import { List, ListItem } from './shared.tsx';

const employmentList = [
  {
    position: 'Senior Software Engineer',
    company: 'TheGuarantors',
    location: 'New York, NY, USA',
    date: '06/2018 - Present',
    description: 'Fintech | Real Estate | Insurtech',
    isContractor: true,
    details: [
      'Leading the development of several UI Kit iterations, resulting in a more consistent and user-friendly UI, and reducing the time required to implement new features up to 70%.',
      'Optimized performance of various CI/CD pipelines, reducing build times up to 80%.',
    ],
  },
  {
    position: 'Senior Software Engineer',
    company: 'Workflow',
    location: 'Welsh, UK',
    date: '-',
    description: 'Creative | Collaboration | Productivity | AI',
    isContractor: true,
    details: [
      'Architecting and transiting WEB Application to the MacOS and Windows Desktop Application.',
      'Developing a screen recording feature for both Browser and Desktop Applications.',
    ],
  },
  {
    position: 'Software Engineer',
    company: 'Teemly',
    location: 'USA',
    date: '06/2018 - Present',
    description: 'Project Managment | Productivity | Collaboration',
    isContractor: true,
    details: ['Leading the transition of the WEB Application to the MacOS and Windows Desktop Application.'],
  },
  {
    position: 'Software Engineer',
    company: 'Freelancer',
    location: 'Worldwide',
    date: '06/2015 - 06/2018',
    isContractor: true,
    details: [
      'Developed a custom CRM system for a small business.',
      'Developed a custom CMS system for a small business.',
    ],
  },
  {
    position: 'Software Engineer',
    company: 'uCoz',
    location: 'Rostov-on-Don, Russia',
    date: '12/2015 - 03/2016',
    details: [
      'Participated in early development of browser Tycoon game',
      'Developed a custom CMS system for a small business.',
    ],
  },
];

export const Employment = () => {
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Typography variant="h5" letterSpacing="-0.05em" fontWeight="700">
        EMPLOYMENT
      </Typography>
      <Divider variant="fullWidth" sx={{ backgroundColor: '#000', mt: '-4px' }} />
      <List>
        {employmentList.map(({ details, ...employment }) => (
          <ListItem key={employment.position} {...employment}>
            {details.map((detail) => (
              <Typography variant="body1">{detail}</Typography>
            ))}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

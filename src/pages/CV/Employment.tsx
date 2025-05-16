import { Box, Divider, Typography } from '@mui/material';
import { List, ListItem } from './shared.tsx';

const employmentList = [
  // {
  //   position: 'Senior Software Engineer',
  //   company: 'Strata K.K.',
  //   location: 'Tokyo, Japan',
  //   date: '06/2018 - Present',
  //   description: 'Outstaffing to TheGuarantors',
  //   isContractor: true,
  //   details: [
  //     'Being out-staffed to TheGuarantors, a New York-based fintech company.',
  //     'Worked on various projects for Tokyo-based Strata K.K. (Covid-19 tracking projects, etc.)',
  //   ],
  // },
  {
    position: 'Senior Software Engineer',
    company: 'Strata K.K.',
    location: 'Tokyo, Japan',
    date: '10/2018 - Present',
    description: 'Fintech | Real Estate | Insurtech',
    isContractor: true,
    details: [
      'Leading the development of several UI Kit iterations, resulting in a more consistent and user-friendly UI, and reducing the time required to implement new features up to 70%.',
      'Being important part of the teams that developed most revenue-generating features as LG, SDR, DSDR products.',
      'Worked on Renters Insurance project automation that helped company to take a place in the market and gain huge user base.',
      'Optimized performance of various CI/CD pipelines, reducing build times up to 80%.',
    ],
  },
  {
    position: 'Senior Software Engineer',
    company: 'Reisetopia GmbH',
    location: 'Berlin, Germany',
    date: '07/2019 - 02/2024',
    description: 'Luxury Travel | Hotel Engine | Travel Blog',
    isContractor: true,
    details: [
      'Modified the existing hotel search engine to optimize search results and improve user experience.',
      'Optimized network requests, reducing load times up to 70%.',
      'Developed various UI features for Hotels / Flights & Trains modules of the application that generates most of the revenue.',
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
    date: '-',
    description: 'Project Managment | Productivity | Collaboration',
    isContractor: true,
    details: ['Leading the transition of the WEB Application to the MacOS and Windows Desktop Application.'],
  },
  {
    position: 'Software Engineer',
    company: 'KimeurLabs',
    location: 'Los Angeles, CA, USA',
    date: '06/2016 - 06/2018',
    isContractor: true,
    details: [
      'Build a frontend part of EasyJenkins - a Jenkins CI/CD server with a user-friendly UI.',
      'Build an Uber-like mobile-first application for students that allows them to find a tutor.',
      'Was responsible for the development of the frontend part of variuous Dasbhoard applications',
    ],
  },
  {
    position: 'Software Engineer',
    company: 'Self-Employed',
    location: 'Worldwide',
    date: '06/2015 - Present',
    isContractor: true,
    details: [
      'Done many various projects as a contractor. Responsibilities include Frontend, Backend, DevOps, and ElectronJS development.',
      'Help to fix and improve the existing projects.',
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
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" fontWeight="700">
        EMPLOYMENT
      </Typography>
      <Divider variant="fullWidth" sx={{ backgroundColor: '#000' }} />
      <List>
        {employmentList.map(({ details, ...employment }) => (
          <ListItem key={employment.position + employment.company} {...employment}>
            {details.map((detail) => (
              <Typography variant="body1" key={detail + employment.position + employment.company}>
                {detail}
              </Typography>
            ))}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

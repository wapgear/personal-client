import { Box, Button, Theme, Typography, useMediaQuery, Grid } from '@mui/material';

import { Actions, AvatarContainer, InfoContainer, Social } from './Landing.styles';
import { useCallback } from 'react';

import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { UpworkIcon } from '../../components/customIcons/Upwork.icon';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();
  const onContactMe = useCallback(() => {
    window.open('mailto:work@izmailov.dev');
  }, []);

  const onMyCV = useCallback(() => {
    navigate('/cv');
  }, [navigate]);

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      <Grid container spacing={6} justifyContent="center" alignItems="center">
        <Grid size={{ xs: 12, sm: 4 }} order={isMobile ? 1 : 0}>
          <InfoContainer>
            <Typography variant="h1">
              Hi there, I'm <span>Anton</span> – Your Expert Web & Electron App Developer
            </Typography>
            <Typography variant="body1" component="p">
              With a mastery of <span>Frontend</span>, <span>Backend</span>, <span>DevOps</span> &{' '}
              <span>ElectronJS</span>, I thrive on crafting exceptional digital experiences. This platform is my
              innovation playground where I refine my skills to <span>perfection</span>.
            </Typography>
            <Typography variant="body1" component="p">
              That website is not just a regular landing. It's a <span>PLAYGROUND</span> where I try things I love:
              <br />- <span>ElectronJS</span> with using hardware things in Web Apps
              <br />- <span>Elixir</span>
              <br />- <span>Telegram Bots</span> powered by AI and not only
              <br />- <span>AI</span> tools like <span>ChatGPT</span>, <span>SD</span> and a lot more
              <br />
            </Typography>
            <Typography variant="body1" component="p">
              Got an ambitious project? Let's join forces and bring your ideas to life. Together, we'll create something{' '}
              <span>extraordinary</span>! 💡
            </Typography>
            <Actions>
              <Button variant="contained" color="primary" onClick={onContactMe}>
                Contact Me
              </Button>
              <Button variant="contained" color="primary" onClick={onMyCV}>
                My CV
              </Button>
            </Actions>
            <Social>
              <a href="https://github.com/wapgear" target="_blank" rel="noreferrer">
                <GitHubIcon color="primary" fontSize="large" />
              </a>
              <a href="https://www.upwork.com/freelancers/aizmailov" target="_blank" rel="noreferrer">
                <UpworkIcon color="primary" fontSize="large" />
              </a>
              <a href="https://t.me/wapgear" target="_blank" rel="noreferrer">
                <TelegramIcon color="primary" fontSize="large" />
              </a>
              <a href="https://www.linkedin.com/in/anton-izmailov-373540106/" target="_blank" rel="noreferrer">
                <LinkedInIcon color="primary" fontSize="large" />
              </a>
            </Social>
          </InfoContainer>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <AvatarContainer>
            <img alt="logo" src="/avatar.jpg" />
          </AvatarContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

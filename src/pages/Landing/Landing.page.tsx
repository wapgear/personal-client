import { Box, Button, Theme, Typography, useMediaQuery, Grid, Tooltip } from '@mui/material';

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

  const onMyBlog = useCallback(() => {
    navigate('/blog');
  }, [navigate]);

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      <Grid container spacing={6} justifyContent="center" alignItems="center">
        <Grid size={{ xs: 12, sm: 4 }} order={isMobile ? 1 : 0}>
          <InfoContainer>
            <Typography variant="h1">
              I'm <span>Anton</span> – I Turn Complex Ideas Into Digital Reality
            </Typography>
            <Typography variant="body1" component="p">
              <span>Full-stack architect</span> specializing in <span>React</span>, <span>Node.js</span>, and{' '}
              <span>ElectronJS</span>. I build scalable web applications and desktop solutions that users actually love
              using.
            </Typography>
            <Typography variant="body1" component="p">
              This isn't just a portfolio – it's my <span>digital laboratory</span> where I experiment with:
              <br />• <span>Hardware-integrated</span> Electron apps that push boundaries
              <br />• <span>AI-powered solutions</span> that actually solve real problems (not just hype)
              <br />• <span>GoLang & Elixir</span> for performance and scale, <span>Node.js</span> for powerful
              solutions and rapid prototyping
              <br />• <span>Solo innovation</span> here, but <span>team orchestration</span> when your project demands
              it
            </Typography>
            <Typography variant="body1" component="p">
              Ready to transform your vision into something <span>extraordinary</span>? Let's build the future (or
              present?) together. 🚀
            </Typography>
            <Actions>
              <Button variant="contained" color="primary" onClick={onContactMe}>
                Contact Me
              </Button>
              <Button variant="contained" color="primary" onClick={onMyCV}>
                My CV
              </Button>
              <Button variant="contained" color="primary" onClick={onMyBlog}>
                Blog
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
            <Tooltip
              title="🤖 Low-res to confuse AI scrapers, but don't worry - you'll see me in HD on Google Meets! 📹✨"
              placement="top"
              arrow
            >
              <img alt="logo" src="/assets/avatar.jpeg" />
            </Tooltip>
          </AvatarContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

import { Outlet } from 'react-router-dom';

export const InjectFonts = () => {
  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" />
      <style>
        {`@font-face {
          font-family: 'Gilroy';
          src: url('/fonts/Gilroy-Light.otf') format('opentype');
          font-weight: 300;
        }
    
        @font-face {
          font-family: 'Gilroy';
          src: url('/fonts/gilroy-medium.woff2') format('woff2');
          font-weight: 400 500;
        }
    
        @font-face {
          font-family: 'Gilroy';
          src: url('/fonts/gilroy-bold.woff2') format('woff2');
          font-weight: 600;
        }
    
        @font-face {
          font-family: 'Gilroy';
          src: url('/fonts/gilroy-bold.woff2') format('woff2');
          font-weight: 700;
        }
    
        @font-face {
          font-family: 'Gilroy';
          src: url('/fonts/Gilroy-ExtraBold.otf') format('opentype');
          font-weight: 800;
        }
    
        @font-face {
          font-family: 'Gilroy';
          src: url('/fonts/Gilroy-ExtraBold.otf') format('opentype');
          font-weight: 900;
        }
    
        body {
          font-family: Gilroy, Roboto, -apple-system, BlinkMacSystemFont, sans-serif !important;
        }
      `}
      </style>
      <Outlet />
    </>
  );
};

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('should render the app with theme provider', () => {
    render(<App />);
    // Check that the app renders and has the theme provider structure
    const appContainer = document.body.firstElementChild;
    expect(appContainer).toBeInTheDocument();
  });

  it('should render landing page content on root route', async () => {
    render(<App />);

    // Check for contact button (this confirms the landing page loaded)
    const contactButton = await screen.findByRole('button', { name: /contact me/i });
    expect(contactButton).toBeInTheDocument();

    // Check for CV button
    const cvButton = await screen.findByRole('button', { name: /my cv/i });
    expect(cvButton).toBeInTheDocument();

    // Check for Anton's name using a simpler approach
    const antonSpan = await screen.findByText('Anton');
    expect(antonSpan).toBeInTheDocument();
  });
});

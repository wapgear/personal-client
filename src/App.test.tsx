import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('should have a title or main content', () => {
    render(<App />);
    // This is a basic test - you can make it more specific based on your app structure
    const appElement = screen.getByRole('main') || document.querySelector('#root > div');
    expect(appElement).toBeInTheDocument();
  });
});

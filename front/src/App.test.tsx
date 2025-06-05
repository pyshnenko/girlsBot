import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import Events from './pages/Events';
import {darkTheme} from './App'

test('renders learn react link', () => {
  render(<Events theme={darkTheme} />);
  const linkElement = screen.getByText((new Date()).getFullYear().toString());
  expect(linkElement).toBeInTheDocument();
});

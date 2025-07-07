import React from 'react';
import { render, screen } from '@testing-library/react';
//import App from './App';
import Events from './pages/Events';
import Users from './pages/Users';
//import {darkTheme} from './App';
import { Theme, createTheme } from '@mui/material/styles';

import '@testing-library/jest-dom';
import { TextEncoder } from 'node:util';

global.TextEncoder = TextEncoder;

declare global {
    interface Window {
        Telegram: any;
    }
}

const darkTheme: Theme = createTheme({
  palette: {
    mode: 'light',
  },
});

test('renders learn react link', () => {
  render(<Events theme={darkTheme} />);
  const yearElement = screen.getByText((new Date()).getFullYear().toString());
  //expect(linkElement).toBeInTheDocument();
  expect(yearElement).toHaveTextContent('2025');
  expect(screen.getByText('10')).toBeInTheDocument();
});

test('test users page', () => {
  render(<Users theme={darkTheme} />)
  const accordeonHead = screen.getByText('Желают присоединиться')
  expect(accordeonHead).toBeInTheDocument();
})

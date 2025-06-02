import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Users from './pages/Users'
import Events from './pages/Events'
import { Theme } from '@mui/material/styles';

const darkTheme: Theme = createTheme({
  palette: {
    mode: (window as Window & typeof globalThis & {Telegram: any}).Telegram.WebApp.colorScheme,
  },
});

export default function App():React.JSX.Element {
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path='vika2/users' element={<Users theme={darkTheme} />} />
            <Route path='vika2/events' element={<Events theme={darkTheme} />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  )
}
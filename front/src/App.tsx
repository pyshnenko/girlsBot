import { BrowserRouter as Router, Routes, Route } from 'react-router';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Users from '@/pages/Users';
import Events from '@/pages/Events';
import { darkTheme } from '@/mech/consts';

export default function App(): React.JSX.Element {
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path='vika2/users' element={<Users theme={darkTheme} />} />
            <Route path='vika2/events' element={<Events />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

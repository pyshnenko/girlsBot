import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Typography } from '@mui/material';
import { month } from '@/mech/consts';
import { calendarBoxes } from '@/styles/themes';
import { createNewMonth } from '@/mech/small/helpers/smallHelpers';
import { eventStore } from '@/mech/store/event.store';

export default function CheckMonth(): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100vw',
      }}
    >
      <IconButton onClick={() => createNewMonth(-1, eventStore.activeMonth)} color='primary'>
        <ChevronLeftIcon sx={{ width: 48, height: 48, ...calendarBoxes }} />
      </IconButton>
      <Box
        sx={{
          ...calendarBoxes,
          display: 'inline-flex',
          width: '80%',
          justifyContent: 'space-evenly',
        }}
      >
        <Typography sx={{ fontSize: 'x-large' }} variant='h4'>
          {month[eventStore.activeMonth.getMonth()]}
        </Typography>
        <Typography sx={{ fontSize: 'x-large' }} variant='h4'>
          {eventStore.activeMonth.getFullYear()}
        </Typography>
      </Box>
      <IconButton onClick={() => createNewMonth(1, eventStore.activeMonth)} color='primary'>
        <ChevronRightIcon sx={{ width: 48, height: 48, ...calendarBoxes }} />
      </IconButton>
    </Box>
  );
}

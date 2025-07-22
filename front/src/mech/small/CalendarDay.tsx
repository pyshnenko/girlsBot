import React, { useState, useEffect, memo } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { eventListTypeNew, CalendarNew } from '@/types/events';
import { orange } from '@mui/material/colors';
import '@/styles/bat.scss';
import useColorGenerator from '@/hooks/useColorGenerator';
import { eventStore } from '@/mech/store/event.store';

interface PropsType {
  dayEvents: eventListTypeNew | null;
  daysYN: CalendarNew | null;
  dayOff: boolean;
  days: number;
}

export default memo(function CalendarDay(props: PropsType): React.JSX.Element {
  const { setActiveDay } = eventStore;
  const { dayEvents, daysYN, dayOff, days } = props;
  const [daysKeys, setDaysKeys] = useState<{ total: number; free: number[]; buzy: number[] }>();

  useEffect(() => {
    if (daysYN) setDaysKeys({ total: daysYN.total, free: daysYN.free, buzy: daysYN.buzy });
    else setDaysKeys({ total: -1, free: [], buzy: [] });
  }, [daysYN]);

  const themeCreatorGenerator = useColorGenerator();
  const themeCreator = themeCreatorGenerator(daysKeys);

  return (
    <Box onClick={() => setActiveDay(days)} sx={themeCreator}>
      <Box
        sx={{
          position: 'absolute',
          borderRadius: '50%',
          width: 100 / 7 + 'vw',
          height: 100 / 7 + 'vw',
          zIndex: -1,
          opacity: 0.75,
        }}
      />
      <Box>
        <Box
          sx={{
            width: 100 / 8 + 'vw',
            height: 100 / 25 + 'vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {dayEvents && (
            <Avatar
              sx={{
                width: 12,
                height: 12,
                bgcolor: orange[300],
                fontSize: 9,
                position: 'relative',
                left: '1px',
                top: '-1px',
              }}
            >
              {' '}
            </Avatar>
          )}
        </Box>
        <Typography
          sx={{ width: 100 / 8 + 'vw', height: 100 / 18 + 'vw' }}
          textAlign={'center'}
          color={dayOff ? 'red' : 'auto'}
        >
          {days > 0 ? days : ''}
        </Typography>
        <Box sx={{ width: 100 / 8 + 'vw', height: 100 / 25 + 'vw' }} />
      </Box>
    </Box>
  );
});

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, Button } from '@mui/material';
import { eventListTypeNew, CalendarNew } from '@/types/events';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import KudagoCard from '@/mech/small/KudagoCard';
import { dayEventsStyles } from '@/mech/small/helpers/styles';
import { YoNevent, YoNDay } from '@/mech/small/helpers/YoNfunc';
import UserTablesIndicator from '@/mech/small/helpers/UserTablesIndicator';
import { eventStore } from '@/mech/store/event.store';

interface PropsType {
  dayList: CalendarNew | null;
  events: eventListTypeNew | null;
}

export default function DayEventsForm(props: PropsType): React.JSX.Element {
  const { activeMonth, activeDay, setActiveDay } = eventStore;
  const { dayList, events } = props;

  const [realDate, setRealDate] = useState<Date>(new Date());
  const [kudagoCardActive, setKudagoCardActive] = useState<boolean>(false);

  useEffect(() => {
    const realDateBuf = new Date(activeMonth);
    realDateBuf.setDate(activeDay);
    setRealDate(realDateBuf);
    //console.log(events);
  }, [activeDay, activeMonth]);

  return (
    <Box sx={dayEventsStyles.totalBox(activeDay)}>
      <Box onClick={() => setActiveDay(-1)} sx={dayEventsStyles.backStyle} />
      <Paper elevation={3} sx={{ position: 'relative', zIndex: 101, padding: 2 }}>
        <Typography textAlign={'center'}>{realDate.toLocaleDateString('ru')}</Typography>
        {events ? (
          <Paper
            elevation={6}
            sx={{ margin: 2, padding: 2, wordBreak: 'break-all', maxWidth: '95vw' }}
          >
            <Typography>{events.namestring}</Typography>
            <Typography>{new Date(events.dateevent).toLocaleDateString()}</Typography>
            <Typography>{events.place || 'Где-то'}</Typography>
            <Typography>{events.linc || ''}</Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
              <IconButton onClick={() => YoNevent(events.id, true)} color='success'>
                <CheckIcon />
              </IconButton>
              <IconButton onClick={() => YoNevent(events.id, false)} color='error'>
                <CloseIcon />
              </IconButton>
            </Box>
            <UserTablesIndicator mapTable={events} />
          </Paper>
        ) : (
          <Typography textAlign={'center'}>Событий не планировалось</Typography>
        )}
        <Paper
          elevation={3}
          sx={{ padding: 2, margin: '4px 0', display: 'flex', flexDirection: 'column' }}
        >
          {dayList && <UserTablesIndicator mapTable={{ buzy: dayList.buzy, free: dayList.free }} />}
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Button
              onClick={() => YoNDay(activeDay, true, activeMonth)}
              sx={{ margin: 1 }}
              variant='outlined'
              color='success'
              startIcon={<CheckIcon />}
            >
              Я свободна
            </Button>
            <Button
              onClick={() => YoNDay(activeDay, false, activeMonth)}
              sx={{ margin: 1 }}
              variant='outlined'
              color='error'
              endIcon={<CloseIcon />}
            >
              Я занята
            </Button>
          </Box>
        </Paper>
        <Button
          variant='contained'
          sx={{ margin: 2 }}
          onClick={async () => setKudagoCardActive(true)}
        >
          Посмотреть события в городе в этот день
        </Button>
      </Paper>
      {kudagoCardActive && <KudagoCard date={realDate} setActive={setKudagoCardActive} />}
    </Box>
  );
}

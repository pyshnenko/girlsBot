import { useEffect } from 'react';
import { Box, Table, TableBody, Typography } from '@mui/material';
import http from '@/mech/api/http';
import api from '@/mech/api/api';
import DayEventsForm from '@/mech/small/DayEventsForm';
import CheckMonth from '@/mech/small/CheckMonth';
import image1 from '@/assets/image1.jpg';
import { calendarBoxes } from '@/styles/themes';
import { WeakDays } from '@/pages/helpers/eventFuncs';
import { themeBat } from '@/pages/helpers/styles/event';
import event from '@/pages/helpers/styles/event';
import WeekDays from '@/mech/small/WeekDays';
import TGtype from '@/types/tg';
import { observer } from 'mobx-react-lite';
import { eventStore } from '@/mech/store/event.store';

declare global {
  interface Window {
    Telegram: TGtype;
  }
}

const Events = observer(() => {
  const tg = window?.Telegram?.WebApp;

  const { daysFoB, eventsDB, loading, activeDay, listName, setMyId } = eventStore;

  useEffect(() => {
    const uri: URL = new URL(window.location.href);
    const id: string | null = uri.searchParams.get('id');
    const group: string | null = uri.searchParams.get('group');
    if (group) api.setGroup(Number(group));
    if (id) {
      http.set(id);
      setMyId(Number(id));
    }
    eventStore.setActiveMonth(new Date());
    if (tg)
      tg.SecondaryButton.show()
        .onClick(() => {
          tg.sendData(JSON.stringify({ do: 'close' }));
        })
        .setParams({
          text: `Закрыть`,
        });
  }, []);

  return (
    <Box sx={event.basic}>
      <img
        style={{ position: 'fixed', zIndex: -1, top: 0, left: 0, height: '100vh', opacity: 0.8 }}
        src={image1}
      />
      {loading && (
        <Box sx={event.loading}>
          <div style={{ zIndex: 204 }} className='bat'></div>
          <Box sx={{ ...themeBat, zIndex: 199, backgroundColor: 'white', opacity: 0.75 }} />
        </Box>
      )}
      <DayEventsForm
        {...{
          dayList: daysFoB?.get(activeDay) || null,
          events: eventsDB?.get(activeDay) || null,
        }}
      />
      {listName && (
        <Typography textAlign={'center'} variant='h3' fontSize={'larger'} sx={calendarBoxes}>
          {`${listName.name} (id:${listName.id})`}
        </Typography>
      )}
      <CheckMonth />
      <Table>
        <TableBody>
          {WeakDays(eventStore.activeMonth).map((item: number[], index: number) => {
            return (
              <WeekDays
                key={`${item[0]} - ${index}`}
                {...{
                  day: item,
                }}
              />
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
});

export default Events;

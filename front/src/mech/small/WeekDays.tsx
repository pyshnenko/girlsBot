import React, { memo } from 'react';
import { TableRow, TableCell } from '@mui/material';
import CalendarDay from '@/mech/small/CalendarDay';
import { eventListTypeNew, CalendarNew } from '@/types/events';
import { eventStore } from '@/mech/store/event.store';

interface Props {
  day: number[];
}

export default memo(function WeekDays(props: Props): React.JSX.Element {
  const { eventsDB, daysFoB } = eventStore;
  const { day } = props;

  return (
    <TableRow>
      {day.map((days: number, index: number) => {
        const dayEvents: eventListTypeNew | null = eventsDB?.get(days) || null;
        const daysYN: CalendarNew | null = daysFoB?.get(days) || null;
        return (
          <TableCell sx={{ padding: 0, border: 'none' }} key={`day-${day}-${index}`}>
            <CalendarDay
              {...{
                dayEvents,
                daysYN,
                days,
                dayOff: index >= 5,
              }}
            />
          </TableCell>
        );
      })}
    </TableRow>
  );
});

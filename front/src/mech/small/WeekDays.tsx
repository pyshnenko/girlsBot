import React, {memo} from "react";
import { TableRow, TableCell } from "@mui/material";
import CalendarDay from "./CalendarDay";
import { TGFrom } from "../../types/users";
import { eventListTypeNew, CalendarNew } from "../../types/events";

interface Props {
    day: number[],
    eventsDB?: Map<number, eventListTypeNew>,
    daysFoB?: Map<number, CalendarNew|null>,
    usersDB?: Map<number, TGFrom>,
    myId?: number,
    setActiveDay: (n: number)=>void
}

export default memo(function WeekDays(props: Props): React.JSX.Element {

    const {day, eventsDB, daysFoB, usersDB, myId, setActiveDay} = props;

    return (<TableRow>
        {day.map((days: number, index: number) => {
            const dayEvents: eventListTypeNew|null = eventsDB?.get(days) || null;
            const daysYN: CalendarNew|null = daysFoB?.get(days) || null;
            return (
                <TableCell sx={{padding: 0, border: 'none'}} key={`day-${day}-${index}`}>
                    <CalendarDay {...{dayEvents, daysYN, usersDB, days, dayOff: index>=5, setActiveDay, myId: myId||0}}/>
                </TableCell>
            )
        })}
    </TableRow>)
})
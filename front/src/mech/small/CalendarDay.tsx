import React from "react";
import { Box, Typography } from "@mui/material";
import { Calendar } from "../../types/events";

interface PropsType {
    dayEvents: Calendar[],
    dayOff: boolean,
    days: number
}

export default function CalendarDay(props: PropsType): React.JSX.Element {

    const {dayEvents, dayOff, days} = props

    return (
        <Box sx={{padding: 2, borderRadius: '50%', backgroundColor: dayEvents.length ? '#7bf2da' : 'auto'}}>
            <Typography textAlign={'center'} color={dayOff ? 'red' : 'black'}>
                {days>0?days:''}
            </Typography>
        </Box>
    )
}
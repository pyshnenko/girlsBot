import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { Calendar, EventListType } from "../../types/events";
import { green, pink } from '@mui/material/colors';
import { TGFrom } from "../../types/users";

interface PropsType {
    dayEvents: EventListType|null,
    daysYN: Calendar|null,
    usersDB: Map<number, TGFrom>|undefined,
    dayOff: boolean,
    days: number,
    setActiveDay: (n: number)=>void,
    myId: number
}

export default function CalendarDay(props: PropsType): React.JSX.Element {

    const {dayEvents, daysYN, usersDB, dayOff, days, setActiveDay, myId} = props

    return (
        <Box onClick={()=>setActiveDay(days)} sx={{
            border: '1px solid #e6e6e6', 
            width: 100/7+'vw', 
            height: 100/7+'vw', 
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Box sx={{position: 'absolute', borderRadius: '50%', backgroundColor: dayEvents ? '#7bf2da' : 'auto', width: 100/7+'vw', height: 100/7+'vw', zIndex: -1, opacity: 0.75}} />
            <Box sx={calendarStyle}>
                {daysYN&&usersDB&&Object.keys(daysYN).map((item: any)=>{if (item!=='id' && item!=='evtDate' && item!=='day' && item!=='free' && item!=='daypart' && daysYN[item]===1) {
                    const user: TGFrom|null = usersDB.get(Number(item.slice(2)))||null
                    return (
                        <Avatar key={user?.id} sx={{width: 12, height: 12, bgcolor:green[user?.id===myId ? 700 : 300], fontSize: 9}}>{user?.first_name?.slice(0,1)}{user?.last_name?.slice(0,1)}</Avatar>
                    )}
                })}
            </Box>
            <Typography sx={{width: 100/21+'vw'}} textAlign={'center'} color={dayOff ? 'red' : 'auto'}>
                {days>0?days:''}
            </Typography>
            <Box sx={calendarStyle}>
                {daysYN&&usersDB&&Object.keys(daysYN).map((item: any)=>{if (item!=='id' && item!=='evtDate' && item!=='day' && item!=='free' && item!=='daypart' && daysYN[item]===2) {
                    const user: TGFrom|null = usersDB.get(Number(item.slice(2)))||null
                    return (
                        <Avatar key={user?.id} sx={{width: 12, height: 12, bgcolor:pink[user?.id===myId ? 700 : 300], fontSize: 9}}>{user?.first_name?.slice(0,1)}{user?.last_name?.slice(0,1)}</Avatar>
                    )}
                })}
            </Box>
        </Box>
    )
}

const calendarStyle = {
    width: 100/21+'vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
}
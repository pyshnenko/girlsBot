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
    days: number
}

export default function CalendarDay(props: PropsType): React.JSX.Element {

    const {dayEvents, daysYN, usersDB, dayOff, days} = props

    return (
        <Box sx={{
            border: '1px solid #e6e6e6', 
            width: 100/7+'vw', 
            height: 100/7+'vw', 
            backgroundColor: dayEvents ? '#7bf2da' : 'auto',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Box sx={{width: 100/21+'vw'}}>
                {daysYN&&usersDB&&Object.keys(daysYN).map((item: any)=>{if (item!=='id' && item!=='evtDate' && item!=='day' && item!=='free' && item!=='daypart' && daysYN[item]===1) {
                    console.log(item)
                    const user: TGFrom|null = usersDB.get(Number(item.slice(2)))||null
                    return (
                        <Avatar sx={{width: 12, height: 12, bgcolor:green[500], fontSize: 9}}>{user?.first_name?.slice(0,1)}{user?.last_name?.slice(0,1)}</Avatar>
                    )}
                })}
            </Box>
            <Typography sx={{width: 100/21+'vw'}} textAlign={'center'} color={dayOff ? 'red' : 'auto'}>
                {days>0?days:''}
            </Typography>
            <Box sx={{width: 100/21+'vw'}}>
                {daysYN&&usersDB&&Object.keys(daysYN).map((item: any)=>{if (item!=='id' && item!=='evtDate' && item!=='day' && item!=='free' && item!=='daypart' && daysYN[item]===2) {
                    console.log(item)
                    const user: TGFrom|null = usersDB.get(Number(item.slice(2)))||null
                    return (
                        <Avatar sx={{width: 12, height: 12, bgcolor:pink[500], fontSize: 9}}>{user?.first_name?.slice(0,1)}{user?.last_name?.slice(0,1)}</Avatar>
                    )}
                })}
            </Box>
        </Box>
    )
}
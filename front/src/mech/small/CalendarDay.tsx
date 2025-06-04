import React, {useState, useEffect} from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { Calendar, EventListType } from "../../types/events";
import { green, pink, orange } from '@mui/material/colors';
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

    const [daysKeys, setDaysKeys] = useState<{ln: number, free: (string)[], buzy: (string)[]}>()

    useEffect(()=>{
        if (daysYN) setDaysKeys(daysYNObjectKeys(daysYN))
    }, [daysYN])

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
            <Box sx={{position: 'absolute', borderRadius: '50%', backgroundColor: (daysKeys&&(daysKeys?.free.length===daysKeys?.ln) && daysKeys?.ln!==0) ? '#7bf2da' : 'auto', width: 100/7+'vw', height: 100/7+'vw', zIndex: -1, opacity: 0.75}} />
            <Box sx={calendarStyle}>
                {daysKeys&&usersDB&&daysKeys.free.map((item: any)=>{{
                    const user: TGFrom|null = usersDB.get(Number(item.slice(2)))||null
                    return (
                        <Avatar key={user?.id} sx={{width: 12, height: 12, bgcolor:green[user?.id===myId ? 700 : 300], fontSize: 9}}>{user?.first_name?.slice(0,1)}{user?.last_name?.slice(0,1)}</Avatar>
                    )}
                })}
            </Box>
            <Box>
                <Box sx={{width: 100/21+'vw', height: 100/21+'vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{dayEvents&&<Avatar sx={{width: 12, height: 12, bgcolor:orange[300], fontSize: 9}} > </Avatar>}</Box>
                <Typography sx={{width: 100/21+'vw', height: 100/21+'vw'}} textAlign={'center'} color={dayOff ? 'red' : 'auto'}>
                    {days>0?days:''}
                </Typography>
                <Box sx={{width: 100/21+'vw', height: 100/21+'vw'}} />
            </Box>
            <Box sx={calendarStyle}>
                {daysKeys&&usersDB&&daysKeys.buzy.map((item: any)=>{{
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

const daysYNObjectKeys = (evt:Calendar):{ln: number, free: (string)[], buzy: (string)[]} => {
    let keys: (string)[] = Object.keys(evt).filter((item: string)=>{
        if (item!=='id' && item.includes(`id`)) return item as string
    })
    console.log(keys)
    console.log({ln: keys.length, free: keys.filter((item:any)=>(evt[item]===1)), buzy: keys.filter((item:any)=>(evt[item]===2))})
    return {ln: keys.length, free: keys.filter((item:any)=>(evt[item]===1)), buzy: keys.filter((item:any)=>(evt[item]===2))}
}
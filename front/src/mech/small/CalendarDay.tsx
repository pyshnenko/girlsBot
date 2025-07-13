import React, {useState, useEffect, memo, useMemo} from "react";
import { Box, Typography, Avatar, createTheme, Theme } from "@mui/material";
import { Calendar, EventListType, eventListTypeNew, CalendarNew } from "../../types/events";
import { green, pink, orange } from '@mui/material/colors';
import { TGFrom } from "../../types/users";
import '../../styles/bat.scss';
import useColorGenerator from "../../hooks/useColorGenerator";

interface PropsType {
    dayEvents: eventListTypeNew|null,
    daysYN: CalendarNew|null,
    usersDB: Map<number, TGFrom>|undefined,
    dayOff: boolean,
    days: number,
    setActiveDay: (n: number)=>void,
    myId: number
}

export default memo(function CalendarDay(props: PropsType): React.JSX.Element {

    const {dayEvents, daysYN, usersDB, dayOff, days, setActiveDay, myId} = props

    const [daysKeys, setDaysKeys] = useState<{total: number, free: number[], buzy: number[]}>()

    useEffect(()=>{
        if (daysYN) setDaysKeys({total: daysYN.total, free: daysYN.free, buzy: daysYN.buzy})
        else setDaysKeys({total:-1, free: [], buzy: []})
    }, [daysYN])

    const themeCreatorGenerator = useColorGenerator();
    const themeCreator = themeCreatorGenerator(daysKeys)

    return (
        <Box onClick={()=>setActiveDay(days)} sx={themeCreator}>
            <Box sx={{position: 'absolute', borderRadius: '50%', width: 100/7+'vw', height: 100/7+'vw', zIndex: -1, opacity: 0.75}} />
            <Box>
                <Box sx={{width: 100/8+'vw', height: 100/25+'vw', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                    {dayEvents&&<Avatar sx={{width: 12, height: 12, bgcolor:orange[300], fontSize: 9, position: 'relative', left: '1px', top: '-1px'}} > </Avatar>}
                </Box>
                <Typography sx={{width: 100/8+'vw', height: 100/18+'vw'}} textAlign={'center'} color={dayOff ? 'red' : 'auto'}>
                    {days>0?days:''}
                </Typography>
                <Box sx={{width: 100/8+'vw', height: 100/25+'vw'}} />
            </Box>
        </Box>
    )
})
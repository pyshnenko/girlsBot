import React, {useState, useEffect, memo} from "react";
import { Box, Typography, Avatar, createTheme, Theme } from "@mui/material";
import { Calendar, EventListType } from "../../types/events";
import { green, pink, orange } from '@mui/material/colors';
import { TGFrom } from "../../types/users";
import '../../styles/bat.scss';
import { calendarBoxes } from "../../styles/themes";

interface PropsType {
    dayEvents: EventListType|null,
    daysYN: Calendar|null,
    usersDB: Map<number, TGFrom>|undefined,
    dayOff: boolean,
    days: number,
    setActiveDay: (n: number)=>void,
    myId: number
}

export default memo(function CalendarDay(props: PropsType): React.JSX.Element {

    const {dayEvents, daysYN, usersDB, dayOff, days, setActiveDay, myId} = props

    const [daysKeys, setDaysKeys] = useState<{ln: number, free: (string)[], buzy: (string)[]}>()

    useEffect(()=>{
        if (daysYN) setDaysKeys(daysYNObjectKeys(daysYN))
        else setDaysKeys({ln:-1, free: [], buzy: []})
    }, [daysYN])

    const themeCreator = () => {
        if (daysKeys===undefined || daysKeys.ln===-1)
            return  {
            borderBottom: 'none',
            width: (100/8)+'vw', 
            height: 100/8+'vw', 
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            ...calendarBoxes
        }
        else if (daysKeys.ln===daysKeys.free.length) return {
            borderBottom: 'none',
            width: (100/8)+'vw', 
            height: 100/8+'vw', 
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            ...calendarBoxes,
            backgroundColor: 'rgb(77 157 195/0.8)'
        }
        else return {
            borderBottom: 'none',
            width: (100/8)+'vw', 
            height: 100/8+'vw', 
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            ...calendarBoxes,
            backgroundColor: `rgb(${colorGenerator(daysKeys).r} ${colorGenerator(daysKeys).g} ${colorGenerator(daysKeys).b} /0.8)`
        }
    }

    const colorGenerator = (daysKeys: {ln: number, free: (string)[], buzy: (string)[]}) => {
        switch (Math.floor((((daysKeys.free.length-daysKeys.buzy.length)+daysKeys.ln)/(2*daysKeys.ln)*100)/25)*25) {
            case 0: return rgbColor['0%']
            case 25: return rgbColor['25%']
            case 50: return rgbColor['50%']
            case 75: return rgbColor['75%']
            case 100: return rgbColor['100%']
            default: return rgbColor['50%']
        }
    }

    return (
        <Box onClick={()=>setActiveDay(days)} sx={themeCreator()}>
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
    return {ln: keys.length, free: keys.filter((item:any)=>(evt[item]===1)), buzy: keys.filter((item:any)=>(evt[item]===2))}
}

const rgbColor = {
    '100%': {r: 25, g: 154, b:82},
    '75%': {r: 121, g:191, b:112},
    '50%': {r: 252, g:241, b:152},
    '25%': {r: 253, g:189, b:147},
    '0%': {r: 253, g:163, b:144}
}
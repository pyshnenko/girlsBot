import React, {useState, useEffect} from "react";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import { EventListType, Calendar } from "../../types/events";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { TGFrom } from "../../types/users";
import api from "../api/api";

interface PropsType {
    activeDay: number,
    setActiveDay: (n: number)=>void,
    usersDB: Map<number, TGFrom>|undefined,
    dayList: Calendar|null,
    events: EventListType|null,
    activeMonth: Date
}

export default function DayEventsForm(props: PropsType): React.JSX.Element {
    
    const {dayList, activeDay, activeMonth, setActiveDay, events, usersDB} = props

    const [realDate, setRealDate] = useState<Date>(new Date());

    useEffect(()=>{
        let realDateBuf = new Date(activeMonth);
        realDateBuf.setDate(activeDay)
        setRealDate(realDateBuf)
        console.log(events)
        if (events)
        console.log(Object.keys(events||{}).filter((item: any)=>{return (item.includes('id') && (events[item]===1))}))
    }, [activeDay])

    const YoNevent = async (id: number, result: boolean) => {
        try{
            await api.events.YorN(id, result)
            setActiveDay(-1)
        } catch(e: any) {

        }
    }

    return (
        <Box sx={{position: 'absolute', top: 0, left: 0, zIndex: 100, width: '100vw', height: '100vh', display: activeDay===-1?'none':'flex', justifyContent:'center', alignItems: 'center'}}>
            <Box onClick={()=>setActiveDay(-1)} sx={{width: '100vw', height: '100vh', backgroundColor: 'white', opacity: 0.85, position: 'absolute', top: 0, left: 0, zIndex: 99}} />
            <Paper elevation={3} sx={{position: 'relative', zIndex: 101, padding: 2}}>
                <Typography>{realDate.toLocaleDateString('ru')}</Typography>
                {events ? <Paper elevation={6} sx={{margin: 2, padding: 2}}>                    
                    <Typography>{events.namestring}</Typography>
                    <Box sx={{width: '100%', display:'flex', justifyContent: 'space-around'}}>
                        <IconButton onClick={()=>YoNevent(events.id, true)} color="success"><CheckIcon /></IconButton>
                        <IconButton onClick={()=>YoNevent(events.id, false)} color="error"><CloseIcon /></IconButton>
                    </Box>
                    {events&&Object.keys(events||{}).filter((item: any)=>{return (item.includes('id') && (events[item]===1))}).map((item: string)=>
                        <Typography color="success" key={item}>{usersDB?.get(Number(item.slice(2)))?.first_name}</Typography>)}
                </Paper>:<Typography>Событий не планировалось</Typography>}
            </Paper>

        </Box>
    )
}
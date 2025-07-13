import React, {useEffect, useState} from "react";
import { TGFrom } from "../types/users";
import { Box, Table, TableBody, Typography } from "@mui/material";
import http from "../mech/api/http";
import api from "../mech/api/api";
import {eventListTypeNew, CalendarNew} from '../types/events';
import DayEventsForm from "../mech/small/DayEventsForm";
import CheckMonth from "../mech/small/CheckMonth";
import image1 from '../image/image1.jpg'
import { calendarBoxes } from "../styles/themes";
import { PropsType } from "./helpers/types/eventPageTypes";
import { updData, WeakDays } from "./helpers/eventFuncs";
import { themeBat } from "./helpers/styles/event";
import event from "./helpers/styles/event";
import WeekDays from "../mech/small/WeekDays";

declare global {
    interface Window {
        Telegram: any;
    }
}

export default function Events(props: PropsType):React.JSX.Element {

    const {theme} = props;

    const tg = window?.Telegram?.WebApp;  

    const [activeMonth, setActiveMonth] = useState<Date>(new Date());
    const [daysFoB, setDaysFoB] = useState<Map<number, CalendarNew|null>>();
    const [eventsDB, setEventsDB] = useState<Map<number, eventListTypeNew>>();
    const [usersDB, setUsersDB] = useState<Map<number, TGFrom>>();
    const [myId, setMyId] = useState<number>(0);
    const [activeDay, setActiveDay] = useState<number>(-1);
    const [listName, setListName] = useState<{name: string, id: number}|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{        
        const uri: URL = new URL(window.location.href);
        const id: string|null = uri.searchParams.get('id');
        const group: string|null = uri.searchParams.get('group');
        if (group) api.setGroup(Number(group))
        if (id) {
            http.set(id);
            setMyId(Number(id));
        }
        setActiveMonth(new Date())
        if (tg)
            tg.SecondaryButton
                .show()
                .onClick(()=>{
                    tg.sendData(JSON.stringify({do: 'close'}))
                })
                .setParams({
                text: `Закрыть`
            })

    }, [])

    useEffect(()=>{
        if (http.get() && activeDay===-1) updData(activeMonth, {setDaysFoB, setEventsDB, setListName, setLoading, setUsersDB})
    }, [activeMonth, activeDay])

    useEffect(()=>{
        console.log(daysFoB)
    }, [daysFoB])

    return (
        <Box sx={event.basic}>
            <img style={{position: 'fixed', zIndex: -1, top: 0, left: 0, height: '100vh', opacity: 0.8}} src={image1} />
            {loading&&<Box sx={event.loading}>
                <div style={{zIndex:204}} className="bat"></div>
                <Box sx={{...themeBat, zIndex: 199, backgroundColor: 'white', opacity: 0.75}} />
            </Box>}
            <DayEventsForm {...{activeDay, setActiveDay, usersDB, dayList: daysFoB?.get(activeDay)||null, events: eventsDB?.get(activeDay)||null, activeMonth}} />
            {listName&&<Typography textAlign={'center'} variant="h3" fontSize={'larger'} sx={calendarBoxes}>
                {`${listName.name} (id:${listName.id})`}
            </Typography>}
            <CheckMonth {...{activeMonth, setActiveMonth}}/>
            <Table>
                <TableBody>
                    {WeakDays(activeMonth).map((item: number[])=>{
                        return (<WeekDays key={item[0]} {...{
                            day: item,
                            eventsDB,
                            daysFoB,
                            usersDB,
                            myId,
                            setActiveDay
                        }} />)
                    })}
                </TableBody>
            </Table>
        </Box>
    )
}
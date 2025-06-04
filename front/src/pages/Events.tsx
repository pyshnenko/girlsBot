import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { TGFrom } from "../types/users";
import { Box, Table, TableBody, TableRow, TableCell, Typography, IconButton } from "@mui/material";
import { Theme } from '@mui/material/styles';
import http from "../mech/api/http";
import api from "../mech/api/api";
import { month } from "../mech/consts";
import {Calendar, CalendarAPI, EventListType} from '../types/events';
import CalendarDay from "../mech/small/CalendarDay";
import DayEventsForm from "../mech/small/DayEventsForm";
import CheckMonth from "../mech/small/CheckMonth";

interface PropsType {
    theme: Theme
}

interface APIReq {
    calendar: CalendarAPI[],
    users: TGFrom[],
    events: EventListType[]
}

declare global {
    interface Window {
        Telegram: any;
    }
}

export default function Events(props: PropsType):React.JSX.Element {

    const {theme} = props;

    const tg = window?.Telegram?.WebApp;  

    const [activeMonth, setActiveMonth] = useState<Date>(new Date());
    const [daysFoB, setDaysFoB] = useState<Map<number, Calendar>>();
    const [eventsDB, setEventsDB] = useState<Map<number, EventListType>>();
    const [usersDB, setUsersDB] = useState<Map<number, TGFrom>>();
    const [myId, setMyId] = useState<number>(0);
    const [activeDay, setActiveDay] = useState<number>(-1);

    useEffect(()=>{
        
        const uri: URL = new URL(window.location.href);
        const id: string|null = uri.searchParams.get('id');
        if (id) {
            http.set(id);
            setMyId(Number(id));
        }
        setActiveMonth(new Date())

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
        if (http.get() && activeDay===-1) updData()
    }, [activeMonth, activeDay])

    useEffect(()=>{
        console.log(daysFoB)
    }, [daysFoB])

    const updData = async () => {
        console.log(activeMonth)
        const year = activeMonth.getFullYear();
        const month = activeMonth.getMonth()+1;
        const apiData:APIReq = (await api.calendar.get(Number(new Date(`${year}-${month}-01`)), Number(new Date(`${month === 12 ? year+1 : year}-${(month+1)%12+1}-01`))))
            .data as APIReq
        console.log(apiData)
        let days = new Map<number, Calendar>()
        let events = new Map<number, EventListType>()
        let users = new Map<number, TGFrom>()
        apiData.calendar.forEach((item: CalendarAPI)=>{days.set((new Date(item.evtDate)).getDate(), {...item, evtDate: new Date(item.evtDate)})})
        apiData.events.forEach((item: EventListType)=>{events.set((new Date(item.dateevent)).getDate(), item)})
        apiData.users.forEach((items: TGFrom)=>{users.set(items.id, items)})
        setDaysFoB(days)
        setEventsDB(events)
        setUsersDB(users)
    }

    return (
        <Box>
            <DayEventsForm {...{activeDay, setActiveDay, usersDB, dayList: daysFoB?.get(activeDay)||null, events: eventsDB?.get(activeDay)||null, activeMonth}} />
            <CheckMonth {...{activeMonth, setActiveMonth}}/>
            <Table>
                <TableBody>
                    {WeakDays(activeMonth).map((item: number[])=>{
                        return (<TableRow key={`day-${item[0]}`}>
                            {item.map((days: number, index: number) => {
                                const dayEvents: EventListType|null = eventsDB?.get(days) || null;
                                const daysYN: Calendar|null = daysFoB?.get(days) || null;
                                return (
                                    <TableCell sx={{padding: 0}} key={`day-${item[0]}-${index}`}>
                                        <CalendarDay {...{dayEvents, daysYN, usersDB, days, dayOff: index>=5, setActiveDay, myId}}/>
                                    </TableCell>
                                )
                            })}
                        </TableRow>)
                    })}
                </TableBody>
            </Table>
        </Box>
    )
}

const WeakDays = (startDate: Date):number[][] => {
    let extArr: number[][] = [[]];
    const year: number = startDate.getFullYear();
    const month: number = startDate.getMonth() + 1;
    const firsDayOfMonth: Date = new Date(`${year}-${month}-01`);
    for (let i = 0; i<(firsDayOfMonth.getDay()===0?7:firsDayOfMonth.getDay())-1; i++) 
        extArr[0].push(-1)
    let i = 1;
    for (let j = 0; j<7; j++) {
        for (let z = 0; z<10; z++) {
            const date = new Date(`${year}-${month}-${i}`)
            if (!Number(date)||(date.getMonth() === month)) {
                if (extArr[j].length) for (let x = extArr[j].length; x<7; x++) extArr[j].push(-1)
    console.log(extArr)
                return extArr
            }
            else {
                extArr[j].push(i);
                i++;
                if (date.getDay() === 0) break;
            }
        }
        extArr.push([])
    }
    console.log(extArr)
    return extArr
}
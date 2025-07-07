import React, {useEffect, useState} from "react";
import { TGFrom } from "../types/users";
import { Box, Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { Theme } from '@mui/material/styles';
import http from "../mech/api/http";
import api from "../mech/api/api";
import {Calendar, CalendarAPI, EventListType} from '../types/events';
import DayEventsForm from "../mech/small/DayEventsForm";
import CalendarDay from "../mech/small/CalendarDay";
import CheckMonth from "../mech/small/CheckMonth";
import image1 from '../image/image1.jpg'
import { calendarBoxes } from "../styles/themes";

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
    const [daysFoB, setDaysFoB] = useState<Map<number, Calendar|null>>();
    const [eventsDB, setEventsDB] = useState<Map<number, EventListType>>();
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
        if (http.get() && activeDay===-1) updData()
    }, [activeMonth, activeDay])

    useEffect(()=>{
        console.log(daysFoB)
    }, [daysFoB])

    const updData = async () => {
        setLoading(true)
        let days = new Map<number, Calendar|null>();
        //for (let i = 1; i<32; i++) days.set(i, null)
        let events = new Map<number, EventListType>()
        let users = new Map<number, TGFrom>()
        setDaysFoB(days)
        setEventsDB(events)
        const year = activeMonth.getFullYear();
        const month = activeMonth.getMonth()+1;
        const apiData:APIReq = (await api.calendar.get(Number(new Date(`${year}-${month}-01`)), Number(new Date(`${month === 12 ? year+1 : year}-${(month)%12+1}-01`))))
            .data as APIReq
        console.log(apiData)
        apiData.calendar.forEach((item: CalendarAPI)=>{days.set((new Date(item.evtDate)).getDate(), {...item, evtDate: new Date(item.evtDate)})})
        apiData.events.forEach((item: EventListType)=>{events.set((new Date(item.dateevent)).getDate(), item)})
        apiData.users.forEach((items: TGFrom)=>{users.set(items.id, items)})
        setDaysFoB(days)
        setEventsDB(events)
        setUsersDB(users)
        setLoading(false)
        if (apiData.users.length) setListName({name: apiData.users[0].name, id: apiData.users[0].Id})
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <img style={{position: 'fixed', zIndex: -1, top: 0, left: 0, height: '100vh', opacity: 0.8}} src={image1} />
            {loading&&<Box sx={{...themeBat, zIndex:203, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{zIndex:204}} className="bat"></div>
                <Box sx={{...themeBat, zIndex: 199, backgroundColor: 'white', opacity: 0.75}} />
            </Box>}
            <DayEventsForm {...{activeDay, setActiveDay, usersDB, dayList: daysFoB?.get(activeDay)||null, events: eventsDB?.get(activeDay)||null, activeMonth}} />
            {listName&&<Typography textAlign={'center'} variant="h3" fontSize={'larger'} sx={calendarBoxes}>{`${listName.name} (id:${listName.id})`}</Typography>}
            <CheckMonth {...{activeMonth, setActiveMonth}}/>
            <Table>
                <TableBody>
                    {WeakDays(activeMonth).map((item: number[])=>{
                        return (<TableRow key={`day-${item[0]}`}>
                            {item.map((days: number, index: number) => {
                                const dayEvents: EventListType|null = eventsDB?.get(days) || null;
                                const daysYN: Calendar|null = daysFoB?.get(days) || null;
                                return (
                                    <TableCell sx={{padding: 0, border: 'none'}} key={`day-${item[0]}-${index}`}>
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
    return extArr
}

const themeBat = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh'
}
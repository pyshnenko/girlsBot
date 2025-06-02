import React, {useEffect, useState} from "react";
import { TGFrom } from "../types/users";
import { Box, Table, TableBody, TableRow, TableCell, Typography, IconButton } from "@mui/material";
import { Theme } from '@mui/material/styles';
import http from "../mech/api/http";
import api from "../mech/api/api";
import { month } from "../mech/consts";
import {Calendar, CalendarAPI} from '../types/events';
import CalendarDay from "../mech/small/CalendarDay";

interface PropsType {
    theme: Theme
}

interface APIReq {
    calendar: CalendarAPI[],
    users: TGFrom[]
}

declare global {
    interface Window {
        Telegram: any;
    }
}

export default function Events(props: PropsType):React.JSX.Element {

    const {theme} = props;

    const tg = window?.Telegram?.WebApp;  

    const [events, setEvents] = useState<Calendar[]>([]);
    const [myId, setMyId] = useState<Number>(0);

    useEffect(()=>{
        
        const uri: URL = new URL(window.location.href);
        const id: string|null = uri.searchParams.get('id');
        if (id) {
            http.set(id);
            setMyId(Number(id));
        }
        updData();

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
        console.log(events)
    }, [events])

    const updData = async () => {
        const year = (new Date()).getFullYear();
        const month = (new Date()).getMonth()+1;
        const apiData:APIReq = (await api.calendar.get(Number(new Date(`${year}-${month}-01`)), Number(new Date(`${month === 11 ? year+1 : year}-${(month+1)%12}-01`))))
            .data as APIReq
        console.log(apiData)
        setEvents(apiData.calendar.map((item: CalendarAPI)=>{ return {...item, evtDate: new Date(item.evtDate)}}))
    }

    return (
        <Box>
            <Typography>{month[(new Date()).getMonth()]}</Typography>
            <Table>
                <TableBody>
                    {WeakDays(new Date()).map((item: number[])=>{
                        return (<TableRow key={`day-${item[0]}`}>
                            {item.map((days: number, index: number) => {
                                const dayEvents: Calendar[] = events.filter((item: Calendar)=>item.evtDate?.getDate()===days)
                                return (
                                    <TableCell sx={{padding: 0}} key={`day-${item[0]}-${index}`}>
                                        <CalendarDay {...{dayEvents, days, dayOff: index>=5}}/>
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
                for (let x = extArr[j].length; x<7; x++) extArr[j].push(-1)
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
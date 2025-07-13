import { TGFrom } from "../../types/users";
import { eventListTypeNew, CalendarApiNew, CalendarNew } from "../../types/events";
import api from "../../mech/api/api";
import { APIReq } from "./types/eventPageTypes";

interface FuncSettersType {
    setLoading: (b: boolean)=>void,
    setDaysFoB: (b: Map<number, CalendarNew|null>)=>void,
    setEventsDB: (b: Map<number, eventListTypeNew>)=>void,
    setUsersDB: (b: Map<number, TGFrom>)=>void,
    setListName: (b: {name: string, id: number}|null)=>void
}

export const updData = async (activeMonth: Date, setters: FuncSettersType) => {
    const {setLoading, setDaysFoB, setEventsDB, setUsersDB, setListName} = setters
    setLoading(true)
    let days = new Map<number, CalendarNew|null>();
    let events = new Map<number, eventListTypeNew>()
    let users = new Map<number, TGFrom>()
    setDaysFoB(days)
    setEventsDB(events)
    const year = activeMonth.getFullYear();
    const month = activeMonth.getMonth()+1;
    const apiData:APIReq = (await api.calendar.get(Number(new Date(`${year}-${month}-01`)), Number(new Date(`${month === 12 ? year+1 : year}-${(month)%12+1}-01`))))
        .data as APIReq
    console.log(apiData)
    apiData.calendar.forEach((item: CalendarApiNew)=>{days.set((new Date(item.evtDate)).getDate(), {...item, evtDate: new Date(item.evtDate)})})
    apiData.events.forEach((item: eventListTypeNew)=>{events.set((new Date(item.dateevent)).getDate(), item)})
    apiData.users.forEach((items: TGFrom)=>{users.set(items.id, items)})
    setDaysFoB(days)
    setEventsDB(events)
    setUsersDB(users)
    setLoading(false)
    if (apiData.users.length) setListName({name: apiData.users[0].name, id: apiData.users[0].Id})
}

export const WeakDays = (startDate: Date):number[][] => {
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
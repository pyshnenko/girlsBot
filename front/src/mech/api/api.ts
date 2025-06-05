import { TGFrom } from "../../types/users";
import { loginApi, privateApi, getApi, deleteApi } from "./http";

let group: number = 0;

const users = () => {
    return getApi(`/users?id=${group}`)
}

const usersDel = (id: number|string) => {
    return deleteApi('/users', id, group)
}

const userUPD = (id: number|string, newData: TGFrom) => {
    return privateApi().put('/users/'+group, {...newData, tgid: newData.id})
}

const getCalendar = (from: number, to: number) => {
    return getApi(`/calendar?from=${from}&to=${to}&id=${group}`)
}

const YNEvent = (id: number, result: boolean) => {
    return privateApi().put(`/eventsYN/${group}?req=${result}&evtId=${id}`)
}

const YNday = (freeDays: number[], busyDays: number[]) => {
    return privateApi().post('/calendar/'+group, {freeDays, busyDays})
}

export default {
    users: {
        get: users,
        delete: usersDel,
        upd: userUPD
    },
    calendar: {
        get: getCalendar,
        YNday
    },
    events: {
        YorN: YNEvent
    },
    setGroup: (n: number)=>{group=n}
}
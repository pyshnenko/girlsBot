import { TGFrom } from "../../types/users";
import { loginApi, privateApi, getApi, deleteApi } from "./http";

const users = () => {
    return getApi('/users')
}

const usersDel = (id: number|string) => {
    return deleteApi('/users', id)
}

const userUPD = (id: number|string, newData: TGFrom) => {
    return privateApi().put('/users/'+id, {...newData, tgid: newData.id})
}

const getCalendar = (from: number, to: number) => {
    return getApi(`/calendar?from=${from}&to=${to}`)
}

const YNEvent = (id: number, result: boolean) => {
    return privateApi().put(`/eventsYN/${id}?req=${result}`)
}

const YNday = (freeDays: number[], busyDays: number[]) => {
    return privateApi().post('/calendar', {freeDays, busyDays})
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
    }
}
export interface CalendarAPI {
    id: number,
    evtDate: string,
    day: number,
    [key: `id${number}`]: 1|2|null
}

export interface Calendar {
    id: number,
    evtDate: Date,
    day: number,
    [key: `id${number}`]: 1|2|null
}
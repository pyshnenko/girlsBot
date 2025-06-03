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
    [key: `id${number}`]: 1|2|0|null
}

export interface EventListType {
    id: number,
    authorID: number,
    namestring: string,
    dateevent: string,
    place: string,
    linc: string,
    [key: `id${number}`]: 1|2|0|null
}
export interface eventListType {
    id: number,
    authorID: number,
    namestring: string,
    dateevent: string,
    place: string,
    linc: string,
    [key: `id${number}`]: 1|2|null
}

export interface calendar {
    id: number,
    evtDate: string,
    day: number,
    [key: `id${number}`]: 1|2|null
}
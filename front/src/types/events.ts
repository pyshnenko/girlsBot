export interface CalendarAPI {
  id: number;
  evtDate: string;
  day: number;
  [key: `id${number}`]: 1 | 2 | null;
}

export interface Calendar {
  id: number;
  evtDate: Date;
  day: number;
  [key: `id${number}`]: 1 | 2 | 0 | null;
}

export interface CalendarNew {
  id: number;
  evtDate: Date;
  total: number;
  groupId: number;
  buzy: number[];
  free: number[];
}

export interface CalendarApiNew {
  id: number;
  evtDate: string;
  total: number;
  groupId: number;
  buzy: number[];
  free: number[];
}

export interface EventListType {
  id: number;
  authorID: number;
  namestring: string;
  dateevent: string;
  place: string;
  linc: string;
  [key: `id${number}`]: 1 | 2 | 0 | null;
}

export interface eventListTypeNew {
  id: number;
  authorID: number;
  namestring: string;
  dateevent: string;
  place: string;
  linc: string;
  free: number[];
  buzy: number[];
}

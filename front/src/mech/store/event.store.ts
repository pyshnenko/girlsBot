import { makeAutoObservable } from 'mobx';
import { CalendarNew } from '@/types/events';
import updData from './helpers/updData';
import { eventListTypeNew } from '@/types/events';
import { TGFrom } from '@/types/users';
import http from '../api/http';

interface FuncSettersType {
  setLoading: (b: boolean) => void;
  setDaysFoB: (b: Map<number, CalendarNew | null>) => void;
  setEventsDB: (b: Map<number, eventListTypeNew>) => void;
  setUsersDB: (b: Map<number, TGFrom>) => void;
  setListName: (b: { name: string; id: number } | null) => void;
}

class Store {
  activeMonth: Date = new Date();
  daysFoB: Map<number, CalendarNew | null> = new Map();
  eventsDB: Map<number, eventListTypeNew> = new Map();
  usersDB: Map<number, TGFrom> = new Map();
  loading: boolean = true;
  activeDay: number = -1;
  listName: { name: string; id: number } | null = null;
  myId: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  //@action
  setActiveMonth = (d: Date) => {
    this.activeMonth = d;
    if (http.get() && this.activeDay === -1) this._updData();
  };

  setDaysFoB = (m: Map<number, CalendarNew | null>) => {
    this.daysFoB = m;
  };

  _updData = () => {
    updData(this.activeMonth, this as FuncSettersType);
  };

  setEventsDB = (m: Map<number, eventListTypeNew>) => {
    this.eventsDB = m;
  };

  setUsersDB = (m: Map<number, TGFrom>) => {
    this.usersDB = m;
  };

  setLoading = (b: boolean) => {
    this.loading = b;
  };

  setActiveDay = (n: number) => {
    this.activeDay = n;
    if (http.get() && this.activeDay === -1) this._updData();
  };

  setListName = (f: { name: string; id: number } | null) => {
    this.listName = f;
  };

  setMyId = (n: number) => {
    this.myId = n;
  };
}

export const eventStore = new Store();

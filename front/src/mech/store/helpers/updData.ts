import { TGFrom } from '@/types/users';
import { eventListTypeNew, CalendarApiNew, CalendarNew } from '@/types/events';
import api from '@/mech/api/api';
import { APIReq } from '@/types/eventPageTypes';

interface FuncSettersType {
  setLoading: (b: boolean) => void;
  setDaysFoB: (b: Map<number, CalendarNew | null>) => void;
  setEventsDB: (b: Map<number, eventListTypeNew>) => void;
  setUsersDB: (b: Map<number, TGFrom>) => void;
  setListName: (b: { name: string; id: number } | null) => void;
}

export default async (activeMonth: Date, setters: FuncSettersType) => {
  const { setLoading, setDaysFoB, setEventsDB, setUsersDB, setListName } = setters;
  setLoading(true);
  const days = new Map<number, CalendarNew | null>();
  const events = new Map<number, eventListTypeNew>();
  const users = new Map<number, TGFrom>();
  setDaysFoB(days);
  setEventsDB(events);
  const year = activeMonth.getFullYear();
  const month = activeMonth.getMonth() + 1;
  const apiData: APIReq = (
    await api.calendar.get(
      Number(new Date(`${year}-${month}-01`)),
      Number(new Date(`${month === 12 ? year + 1 : year}-${(month % 12) + 1}-01`)),
    )
  ).data as APIReq;
  console.log(apiData);
  apiData.calendar.forEach((item: CalendarApiNew) => {
    days.set(new Date(item.evtDate).getDate(), { ...item, evtDate: new Date(item.evtDate) });
  });
  apiData.events.forEach((item: eventListTypeNew) => {
    events.set(new Date(item.dateevent).getDate(), item);
  });
  apiData.users.forEach((items: TGFrom) => {
    users.set(items.id, items);
  });
  setDaysFoB(days);
  setEventsDB(events);
  setUsersDB(users);
  setLoading(false);
  if (apiData.users.length) setListName({ name: apiData.users[0].name, id: apiData.users[0].Id });
};

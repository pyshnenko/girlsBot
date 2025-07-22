import api from '@/mech/api/api';
import { eventStore } from '@/mech/store/event.store';

export const YoNevent = async (id: number, result: boolean) => {
  try {
    await api.events.YorN(id, result);
    eventStore.setActiveDay(-1);
  } catch (e) {
    console.log(e);
  }
};

export const YoNDay = async (day: number, result: boolean, activeMonth: Date) => {
  try {
    const realDate = new Date(activeMonth);
    realDate.setDate(day);
    await api.calendar.YNday(result ? [Number(realDate)] : [], result ? [] : [Number(realDate)]);
    eventStore.setActiveDay(-1);
  } catch (e) {
    console.log('YoNDay');
    console.log(e);
  }
};

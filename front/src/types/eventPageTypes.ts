import { Theme } from '@mui/material/styles';
import { CalendarApiNew, eventListTypeNew } from '@/types/events';
import { TGFrom } from '@/types/users';
export interface PropsType {
  theme: Theme;
}

export interface APIReq {
  calendar: CalendarApiNew[];
  users: TGFrom[];
  events: eventListTypeNew[];
}

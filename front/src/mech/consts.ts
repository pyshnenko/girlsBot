import { Theme, createTheme } from '@mui/material';
import TGtype from '@/types/tg';

export const month: string[] = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const darkTheme: Theme = createTheme({
  palette: {
    mode: (window as Window & typeof globalThis & { Telegram: TGtype }).Telegram?.WebApp
      .colorScheme,
  },
});

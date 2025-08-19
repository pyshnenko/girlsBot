/**
 * Модуль для работы с пользовательскими данными, календарём и событиями.
 * Все функции используют группу (id группы) для запросов, заданную через setGroup().
 */
import { TGFrom } from '@/types/users';
import { privateApi, getApi, deleteApi, kudagoAPI } from './http';

let group: number = 0;

/**
 * Получает список пользователей текущей группы.
 * @returns Результат GET-запроса /users?id={group}
 */
const users = () => {
  return getApi(`/users?id=${group}`);
};

/**
 * Удаляет пользователя по ID в текущей группе.
 * @param id Идентификатор удаляемого пользователя
 * @returns Результат DELETE-запроса /users/{id} в группе
 */
const usersDel = (id: number | string) => {
  return deleteApi('/users', id, group);
};

/**
 * Обновляет данные пользователя в текущей группе.
 * @param newData Новые данные пользователя (тип TGFrom)
 * @returns Результат PUT-запроса /users/{group} с преобразованным объектом
 *          (tgid заменяет id из входных данных)
 */
const userUPD = (newData: TGFrom) => {
  return privateApi().put('/users/' + group, { ...newData, tgid: newData.id });
};

/**
 * Получает события календаря за указанный период.
 * @param from Начальная дата периода (timestamp)
 * @param to Конечная дата периода (timestamp)
 * @returns Результат GET-запроса /calendar?from=...&to=...&id={group}
 */
const getCalendar = (from: number, to: number) => {
  return getApi(`/calendar?from=${from}&to=${to}&id=${group}`);
};

/**
 * Обновляет статус участия в событии.
 * @param id Идентификатор события
 * @param result Статус участия (true - да, false - нет)
 * @returns Результат PUT-запроса /eventsYN/{group}?req={result}&evtId={id}
 */
const YNEvent = (id: number, result: boolean) => {
  return privateApi().put(`/eventsYN/${group}?req=${result}&evtId=${id}`);
};

/**
 * Отправляет информацию о свободных/занятых днях.
 * @param freeDays Массив timestamp'ов свободных дней
 * @param busyDays Массив timestamp'ов занятых дней
 * @returns Результат POST-запроса /calendar/{group} с данными
 */
const YNday = (freeDays: number[], busyDays: number[]) => {
  return privateApi().post('/calendar/' + group, { freeDays, busyDays });
};

/**
 * Получает события из внешнего API Kudago за указанный период.
 * @param from Начальная дата (Date)
 * @param to Конечная дата (Date)
 * @returns Результат GET-запроса к Kudago с конвертированными датами в секундах
 */
const kudaGoEvents = (from: Date, to: Date) => {
  return kudagoAPI(
    `/kudago/events/?from=${Math.floor(Number(from) / 1000)}&to=${Math.floor(Number(to) / 1000)}`,
  );
};

export default {
  users: {
    /**
     * Получить список пользователей
     */
    get: users,

    /**
     * Удалить пользователя по ID
     */
    delete: usersDel,

    /**
     * Обновить данные пользователя
     */
    upd: userUPD,
  },

  calendar: {
    /**
     * Получить события календаря
     */
    get: getCalendar,

    /**
     * Отправить информацию о доступности
     */
    YNday,
  },

  events: {
    /**
     * Обновить статус участия в событии
     */
    YorN: YNEvent,
  },

  /**
   * Установить текущую группу
   * @param n Новый идентификатор группы
   */
  setGroup: (n: number) => {
    group = n;
  },

  kudago: {
    /**
     * Получить события из Kudago
     */
    getEvents: kudaGoEvents,
  },
};

/**
 * Модуль для работы с API приложения.
 * 
 * @module api
 */

import axios from 'axios';

/**
 * Базовый URL для всех запросов к API.
 */
const baseURL = String(import.meta.env.VITE_BASEURL);

/**
 * Заголовки для JSON-запросов.
 */
const jsonHeader = {
  'Content-type': 'application/json',
};

/**
 * Хранит токен авторизации.
 */
let token: string = '';

/**
 * Создает экземпляр axios для публичных запросов (без авторизации).
 * 
 * @returns {AxiosInstance} Экземпляр axios с базовым URL и заголовками JSON.
 */
export const loginApi = () =>
  axios.create({
    baseURL,
    headers: jsonHeader,
  });

/**
 * Создает экземпляр axios для приватных запросов (требует авторизации).
 * 
 * @returns {AxiosInstance} Экземпляр axios с базовым URL, заголовками JSON и Bearer-токеном.
 */
export const privateApi = () =>
  axios.create({
    baseURL,
    headers: {
      ...jsonHeader,
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * Выполняет GET-запрос к указанному URI с авторизацией.
 * 
 * @param {string} uri - Путь к ресурсу API.
 * @returns {AxiosPromise} Промис с результатом запроса.
 */
export const getApi = (uri: string) =>
  axios.get(baseURL + uri, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * Выполняет GET-запрос к KudaGo API (без авторизации).
 * 
 * @param {string} uri - Путь к ресурсу KudaGo.
 * @returns {AxiosPromise} Промис с результатом запроса.
 */
export const kudagoAPI = (uri: string) => axios.get(baseURL + uri);

/**
 * Выполняет DELETE-запрос с параметрами id и group.
 * 
 * @param {string} uri - Путь к ресурсу API.
 * @param {number | string} id - Идентификатор пользователя (tgId).
 * @param {number} group - Групповой идентификатор.
 * @returns {AxiosPromise} Промис с результатом запроса.
 */
export const deleteApi = (uri: string, id: number | string, group: number) =>
  axios.delete(baseURL + uri + '/' + group + '?tgId=' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * Устанавливает токен авторизации.
 * 
 * @param {string} str - Новый токен.
 */
const setToken = (str: string) => {
  token = str;
};

/**
 * Получает текущий токен авторизации.
 * 
 * @returns {string} Текущий токен.
 */
const getToken = (): string => {
  return token;
};

export default { set: setToken, get: getToken };


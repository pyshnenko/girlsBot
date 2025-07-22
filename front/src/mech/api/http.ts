import axios from 'axios';

const baseURL = String(import.meta.env.VITE_BASEURL);
const jsonHeader = {
  'Content-type': 'application/json',
};

let token: string = '';

export const loginApi = () =>
  axios.create({
    baseURL,
    headers: jsonHeader,
  });

export const privateApi = () =>
  axios.create({
    baseURL,
    headers: {
      ...jsonHeader,
      Authorization: `Bearer ${token}`,
    },
  });

export const getApi = (uri: string) =>
  axios.get(baseURL + uri, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const kudagoAPI = (uri: string) => axios.get(baseURL + uri);

export const deleteApi = (uri: string, id: number | string, group: number) =>
  axios.delete(baseURL + uri + '/' + group + '?tgId=' + id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const setToken = (str: string) => {
  token = str;
};
const getToken = (): string => {
  return token;
};

export default { set: setToken, get: getToken };

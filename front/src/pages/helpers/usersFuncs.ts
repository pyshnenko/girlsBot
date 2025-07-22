import api from '@/mech/api/api';
import { AxiosResponse, AxiosError } from 'axios';
import { TGFrom } from '@/types/users';
import http from '@/mech/api/http';

export const updData = (
  setUsersList: (t: TGFrom[]) => void,
  setAdminsNum: (v: { nums: number; myId: number }) => void,
) => {
  api.users
    .get()
    .then((res: AxiosResponse) => {
      console.log(res.data);
      setUsersList(res.data as TGFrom[]);
      setAdminsNum({
        nums: (res.data as TGFrom[]).filter((item: TGFrom) => item.admin).length,
        myId: Number(http.get()),
      });
    })
    .catch((e: AxiosError) => console.log(e));
};

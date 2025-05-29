import { TGFrom } from "../../types/users";
import { loginApi, privateApi, getApi, deleteApi } from "./http";

const users = () => {
    return getApi('/users')
}

const usersDel = (id: number|string) => {
    return deleteApi('/users', id)
}

const userUPD = (id: number|string, newData: TGFrom) => {
    return privateApi().put('/users/'+id, {...newData, tgid: newData.id})
}

export default {
    users: {
        get: users,
        delete: usersDel,
        upd: userUPD
    }
}
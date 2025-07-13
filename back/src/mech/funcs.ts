import { TGCheck } from "@/types/tgTypes";
import sql from "@/mech/sql";

export async function checkAuth(tok: string, admin: boolean = false): Promise<{code: number, tg?: TGCheck, id?: number}> {
    const userId: number = Number(tok?.slice(7) || 0)
        if (!userId) return {code: 401}
        else {
            const sqlCheck: boolean|TGCheck = await sql.user.check(userId);
            console.log(sqlCheck)
            if (sqlCheck === false) return {code: 401}
            else if (sqlCheck !== true && !sqlCheck.admin) return admin ? {code: 403} : {code: 200, tg: sqlCheck, id: userId}
            else {
                return sqlCheck===true ? {code: 200, id: userId} :{code: 200, tg: sqlCheck, id: userId}
            }
        }
}
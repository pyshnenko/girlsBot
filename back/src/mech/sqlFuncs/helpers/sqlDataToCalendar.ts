import { DaysAttributesExp, DaysAttributes } from "@/types/sql";
import sql from "@/mech/sql";

export default async function sqdDataToCalendar(SQLData: DaysAttributes[]): Promise<DaysAttributesExp[]> {
    let dataMap: Map<string, DaysAttributesExp> = new Map();
    if (SQLData.length === 0) return []
    const total = await sql.group.totalUser(SQLData[0].groupId)||0
    SQLData.forEach((item: DaysAttributes) => {
        let bufObj: DaysAttributesExp|undefined = dataMap.get(item.evtDate);
        if (bufObj) {
            if (item.free) bufObj.free.push(item.tgId)
            else bufObj.buzy.push(item.tgId)
        } else {
            bufObj = {
                id: item.id,
                evtDate: item.evtDate,
                groupId: item.groupId,
                total,
                buzy: item.free ? [] : [item.tgId],
                free: item.free ? [item.tgId] : []
            }
        }
        dataMap.set(item.evtDate, bufObj)
    })
    return [...dataMap.values()]
}
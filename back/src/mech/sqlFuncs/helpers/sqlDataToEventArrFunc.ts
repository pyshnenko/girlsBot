import { eventListTypeNew } from "@/types/sql";

export default function sqlDataToEventArrFunc(resultSQL: any[]): eventListTypeNew[] {
    const result: Map<number, eventListTypeNew> = new Map();
    resultSQL.map((item: any)=>{
        let bufArr = result.get(item?.id||0);
        if (bufArr && item?.id) {
            if (item['eventListAgr.res'] === 1) 
                bufArr.free.push(item['eventListAgr.tgId'])
            if (item['eventListAgr.res'] === 0) 
                bufArr.buzy.push(item['eventListAgr.tgId'])
            result.set(item.id, bufArr)
        }
        else {
            let freeArr: number[] = item['eventListAgr.res'] === 1 ? 
                [item['eventListAgr.tgId']]:[]
            let buzyArr: number[] = item['eventListAgr.res'] === 0 ? 
                [item['eventListAgr.tgId']]:[]
            let bufObj: eventListTypeNew ={
                id: item.id,
                authorID: item.authorID,
                namestring: item.namestring,
                dateevent: item.dateevent,
                place: item.place,
                linc: item.linc,
                free: freeArr,
                buzy: buzyArr
            }
            result.set(item.id, bufObj)
        }
    })
    return [...result.values()]
}
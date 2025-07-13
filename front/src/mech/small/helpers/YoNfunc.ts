import api from "../../api/api"

export const YoNevent = async (id: number, result: boolean, setActiveDay: (n: number)=>void) => {
    try{
        await api.events.YorN(id, result)
        setActiveDay(-1)
    } catch(e: any) {

    }
}

export const YoNDay = async (day: number, result: boolean, activeMonth: Date, setActiveDay: (n: number)=>void) => {
    try{
        let realDate = new Date(activeMonth)
        realDate.setDate(day)
        await api.calendar.YNday(result?[Number(realDate)]:[], result?[]:[Number(realDate)])
        setActiveDay(-1)
    } catch(e: any) {
        console.log('YoNDay')
        console.log(e)
    }
}
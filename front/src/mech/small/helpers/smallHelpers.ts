export const createNewMonth = (step: -1|1, activeMonth: Date, setActiveMonth: (d: Date)=>void) => {
    let bufDate: Date = new Date(activeMonth)
    let month: number = bufDate.getMonth() + step;
    while(month < 0) month+=12;
    if (step===-1 && month===11) bufDate.setFullYear(bufDate.getFullYear()-1)
    if (step===1 && month===0) bufDate.setFullYear(bufDate.getFullYear()+1)
    bufDate.setMonth(month%12)
    setActiveMonth(bufDate)
}
export const WeakDays = (startDate: Date): number[][] => {
  const extArr: number[][] = [[]];
  const year: number = startDate.getFullYear();
  const month: number = startDate.getMonth() + 1;
  const firsDayOfMonth: Date = new Date(`${year}-${month}-01`);
  for (let i = 0; i < (firsDayOfMonth.getDay() === 0 ? 7 : firsDayOfMonth.getDay()) - 1; i++)
    extArr[0].push(-1);
  let i = 1;
  for (let j = 0; j < 7; j++) {
    for (let z = 0; z < 10; z++) {
      const date = new Date(`${year}-${month}-${i}`);
      if (!Number(date) || date.getMonth() === month) {
        if (extArr[j].length) for (let x = extArr[j].length; x < 7; x++) extArr[j].push(-1);
        return extArr;
      } else {
        extArr[j].push(i);
        i++;
        if (date.getDay() === 0) break;
      }
    }
    extArr.push([]);
  }
  return extArr;
};

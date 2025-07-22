import { calendarBoxes } from '@/styles/themes';

export default function useColorGenerator() {
  const rgbColor = {
    '100%': { r: 25, g: 154, b: 82 },
    '75%': { r: 121, g: 191, b: 112 },
    '50%': { r: 252, g: 241, b: 152 },
    '25%': { r: 253, g: 189, b: 147 },
    '0%': { r: 253, g: 163, b: 144 },
  };

  const colorGenerator = (daysKeys: { total: number; free: number[]; buzy: number[] }) => {
    switch (
      Math.floor(
        (((daysKeys.free.length - daysKeys.buzy.length + daysKeys.total) / (2 * daysKeys.total)) *
          100) /
          25,
      ) * 25
    ) {
      case 0:
        return rgbColor['0%'];
      case 25:
        return rgbColor['25%'];
      case 50:
        return rgbColor['50%'];
      case 75:
        return rgbColor['75%'];
      case 100:
        return rgbColor['100%'];
      default:
        return rgbColor['50%'];
    }
  };

  return (daysKeys?: { total: number; free: number[]; buzy: number[] }) => {
    if (daysKeys === undefined || daysKeys.total === -1)
      return {
        borderBottom: 'none',
        width: 100 / 8 + 'vw',
        height: 100 / 8 + 'vw',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        ...calendarBoxes,
      };
    else if (daysKeys.total === daysKeys.free.length)
      return {
        borderBottom: 'none',
        width: 100 / 8 + 'vw',
        height: 100 / 8 + 'vw',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        ...calendarBoxes,
        backgroundColor: 'rgb(77 157 195/0.8)',
      };
    else
      return {
        borderBottom: 'none',
        width: 100 / 8 + 'vw',
        height: 100 / 8 + 'vw',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        ...calendarBoxes,
        backgroundColor: `rgb(${colorGenerator(daysKeys).r} ${colorGenerator(daysKeys).g} ${colorGenerator(daysKeys).b} /0.8)`,
      };
  };
}

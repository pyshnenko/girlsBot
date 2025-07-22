const baseColors = {
  good: '#c6efce',
  bad: '#ffc7ce',
};

const totalBox = (activeDay: number) => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
    width: '100vw',
    height: '100vh',
    display: activeDay === -1 ? 'none' : 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
};

const textBackColor = (green: boolean) => {
  return {
    backgroundColor: green ? baseColors.good : baseColors.bad,
    padding: 1,
    boxShadow: '0 0 3px ' + green ? baseColors.good : baseColors.bad,
  };
};

export const dayEventsStyles = {
  totalBox,
  backStyle: {
    width: '100vw',
    height: '100vh',
    backgroundColor: 'white',
    opacity: 0.85,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 99,
  },
  textBackColor,
};

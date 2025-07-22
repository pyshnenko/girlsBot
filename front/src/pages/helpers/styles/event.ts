export const themeBat = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
};

export default {
  basic: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  img: { position: 'fixed', zIndex: -1, top: 0, left: 0, height: '100vh', opacity: 0.8 },
  loading: {
    ...themeBat,
    zIndex: 203,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

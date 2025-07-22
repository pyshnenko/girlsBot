import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '@/mech/api/api';
import { KudaEvent, KudaEventsList } from '@/types/kudago';
import '@/styles/bat.scss';

interface Props {
  date: Date;
  setActive: (b: boolean) => void;
}

export default function KudagoCard(props: Props): React.JSX.Element {
  const { date, setActive } = props;

  const [data, setData] = useState<KudaEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    update();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const update = async () => {
    try {
      const apiResult: KudaEventsList = (
        await api.kudago.getEvents(date, new Date(Number(date) + 24 * 60 * 60 * 1000))
      ).data;
      setData(apiResult.results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        ...theme,
        zIndex: 200,
        display: 'flex',
      }}
    >
      {loading && (
        <Box
          sx={{
            ...theme,
            zIndex: 203,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className='bat'></div>
        </Box>
      )}
      <Box
        sx={{ ...theme, zIndex: 199, backgroundColor: 'white', opacity: 0.75 }}
        onClick={() => setActive(false)}
      />
      <IconButton
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 205,
          zoom: 1.5,
          borderRadius: 0,
          opacity: 0.85,
          borderBottomLeftRadius: '50%',
          backgroundColor: 'gray',
        }}
        onClick={() => setActive(false)}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ zIndex: 202 }}>
        {data.length > 0 &&
          data.map((item: KudaEvent) => (
            <Paper key={item.id} sx={{ margin: 2, maxWidth: '450px' }}>
              <Card>
                <CardMedia
                  sx={{ height: '180px' }}
                  image={item.images[0].image}
                  title={item.short_title}
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    {item.short_title}
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                    {item.title}
                  </Typography>
                </CardContent>
                <CardActions>
                  <a href={item.site_url}>
                    <Button size='small'>Открыть</Button>
                  </a>
                </CardActions>
              </Card>
            </Paper>
          ))}
      </Box>
    </Box>
  );
}

const theme = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
};

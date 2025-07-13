import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Typography } from '@mui/material';
import { month } from '../consts';
import { calendarBoxes } from '../../styles/themes';
import { createNewMonth } from './helpers/smallHelpers';

interface PropsType {
    activeMonth: Date,
    setActiveMonth: (d: Date)=>void
}

export default function CheckMonth(props: PropsType): React.JSX.Element {

    const {activeMonth, setActiveMonth} = props;

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100vw'}}>
            <IconButton onClick={()=>createNewMonth(-1, activeMonth, setActiveMonth)} color='primary'><ChevronLeftIcon sx={{width: 48, height: 48, ...calendarBoxes}} /></IconButton>
            <Box sx={{...calendarBoxes, display: 'inline-flex', width: '80%', justifyContent: 'space-evenly'}}>
                <Typography sx={{fontSize: 'x-large'}} variant='h4'>{month[activeMonth.getMonth()]}</Typography>
                <Typography sx={{fontSize: 'x-large'}} variant='h4'>{activeMonth.getFullYear()}</Typography>
            </Box>
            <IconButton onClick={()=>createNewMonth(1, activeMonth, setActiveMonth)} color='primary'><ChevronRightIcon sx={{width: 48, height: 48, ...calendarBoxes}} /></IconButton>
        </Box>
    )
}
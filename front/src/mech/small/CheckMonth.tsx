import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, IconButton, Typography } from '@mui/material';
import { month } from '../consts';

interface PropsType {
    activeMonth: Date,
    setActiveMonth: (d: Date)=>void
}

export default function CheckMonth(props: PropsType): React.JSX.Element {

    const {activeMonth, setActiveMonth} = props;

    const createNewMonth = (step: -1|1) => {
        let bufDate: Date = new Date(activeMonth)
        let month: number = bufDate.getMonth() + step;
        while(month < 0) month+=12;
        if (step===-1 && month===11) bufDate.setFullYear(bufDate.getFullYear()-1)
        if (step===1 && month===0) bufDate.setFullYear(bufDate.getFullYear()+1)
        bufDate.setMonth(month%12)
        setActiveMonth(bufDate)
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <IconButton onClick={()=>createNewMonth(-1)} color='primary'><ChevronLeftIcon sx={{width: 48, height: 48}} /></IconButton>
            <Typography variant='h4'>{month[activeMonth.getMonth()]}</Typography>
            <Typography variant='h4'>{activeMonth.getFullYear()}</Typography>
            <IconButton onClick={()=>createNewMonth(1)} color='primary'><ChevronRightIcon sx={{width: 48, height: 48}} /></IconButton>
        </Box>
    )
}
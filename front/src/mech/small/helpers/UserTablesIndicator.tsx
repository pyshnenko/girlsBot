import React from "react";
import { Box, Typography } from "@mui/material";
import { dayEventsStyles } from "./styles";
import { TGFrom } from "../../../types/users";

export default function UserTablesIndicator(props: {mapTable?: {buzy: number[], free: number[]}, usersDB?: Map<number, TGFrom>}): React.JSX.Element {

    const {mapTable, usersDB} = props;

    return (<Box sx={{display: 'flex'}}>
        <Box sx={{width: '50%', borderRadius: 1}}>
            {mapTable&&mapTable.free.map((item: number)=>
            <Typography sx={dayEventsStyles.textBackColor(true)} key={item} color="success">{usersDB?.get(item)?.first_name}</Typography>)}
        </Box>
        <Box sx={{width: '50%', borderRadius: 1, textAlign: 'right'}}>
            {mapTable&&mapTable.buzy.map((item: number)=>
            <Typography sx={dayEventsStyles.textBackColor(false)} key={item} color="error">{usersDB?.get(item)?.first_name}</Typography>)}
        </Box>
    </Box>)
}
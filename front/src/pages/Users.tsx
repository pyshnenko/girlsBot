import React, {useEffect, useState} from "react";
import { Box, Theme, Typography, 
    Accordion, AccordionSummary, AccordionDetails, 
    Paper, TableContainer, Table, 
    TableRow, TableHead, TableCell, 
    TableBody, IconButton } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import api from "../mech/api/api";
import http from "../mech/api/http";
import { AxiosResponse, AxiosError } from "axios";
import { TGFrom } from "../types/users";

interface PropsType {
    theme: Theme
}

declare global {
    interface Window {
        Telegram: any;
    }
}

export default function Users(props: PropsType):React.JSX.Element {

    const {theme} = props;

    const tg = window?.Telegram?.WebApp;  

    const [usersList, setUsersList] = useState<TGFrom[]>([])

    const admColor: {adm: string, user: string} = 
        theme.palette.mode==='dark'?{
            adm: 'dimgray',
            user: ''
        }:{
            adm: 'lavender',
            user: 'white'
        }
    
    useEffect(()=>{
        const uri: URL = new URL(window.location.href);
        const id: string|null = uri.searchParams.get('id');
        if (id) http.set(id);
        updData();

        tg.SecondaryButton
            .show()
            .onClick(()=>{
                tg.sendData(JSON.stringify({do: 'close'}))
            })
            .setParams({
            text: `Закрыть`
        })
    },[])

    const updData = () => {
        api.users.get().then((res: AxiosResponse)=>{
            console.log(res.data)
            setUsersList(res.data as TGFrom[])
        }).catch((e:AxiosError)=>console.log(e))
    }

    return (
        <div className={'header'}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography>Пользователи</Typography>
                </AccordionSummary>
                <AccordionDetails>
                        <TableContainer component={Paper}>
                        <Table size="small" aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{padding: 1}}>Пользователь</TableCell>
                              <TableCell sx={{padding: 1}}>Действие</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                    {usersList.map((item: TGFrom) => {if (item.register) return (
                              <TableRow
                                color="error"
                                key={item.id}
                                sx={{backgroundColor: item.is_admin?admColor.adm:admColor.user}}
                              >
                                <TableCell sx={{padding: 1}}>{item.username+'\n'+item.first_name+'\n'+item.last_name}</TableCell>
                                <TableCell sx={{padding: 0}}>                              
                                    <IconButton sx={{margin: 0}} color="success" onClick={()=>{
                                        tg.sendData(JSON.stringify({do: 'upd', id: item.id, is_admin: !item.is_admin}))
                                    }}>{item.is_admin?<ArrowDownwardIcon />:<ArrowUpwardIcon />}</IconButton>
                                    <IconButton sx={{margin: 0}} color="error" onClick={async ()=>{
                                        await api.users.delete(item.id);
                                        updData();
                                    }}><DeleteIcon /></IconButton>      
                                </TableCell>
                              </TableRow>
                    )})}
                    </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
            </Accordion><Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography>Желают присоединиться</Typography>
                </AccordionSummary>
                <AccordionDetails>
                        <TableContainer component={Paper}>
                        <Table size="small" aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{padding: 1}}>Пользователь</TableCell>
                              <TableCell sx={{padding: 1, textAlign: 'center'}}>Действие</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                    {usersList.map((item: TGFrom) => {if (!item.register) return (
                              <TableRow
                                key={item.id}
                                sx={{backgroundColor: admColor.user}}
                                >
                                <TableCell sx={{padding: 1}}>
                                    <Typography>{item.username}</Typography>
                                    <Typography>{item.first_name}</Typography>
                                    <Typography>{item.last_name}</Typography>
                                </TableCell>
                                <TableCell sx={{padding: 1}}>
                                    <IconButton sx={{margin: 1}} color="success" onClick={async ()=>{
                                        await api.users.upd(item.id, {...item, register: true})
                                        updData();
                                    }}><CheckIcon /></IconButton>
                                    <IconButton color="error" onClick={async ()=>{
                                        await api.users.delete(item.id);
                                        updData();
                                    }}><DeleteIcon /></IconButton>
                                </TableCell>
                              </TableRow>
                    )})}
                    </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
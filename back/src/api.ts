import express, { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { checkAuth } from '@/mech/funcs';
import sql from '@/mech/sql';
import { TGFrom, TGCheck } from "./types/tgTypes";
import axios from "axios";
import baseURL from "@/consts/baseURL";
import expressWinston from "express-winston";
import {logger} from "@/winston/logger";

const app: Express = express();

export default app;

const options = {
  swaggerOptions: {
    url: baseURL.swagger,
    swaggerOptions: {
      validatorUrl : null
    }
  }
}

app.use('/girls/docs', swaggerUi.serve, swaggerUi.setup(null, options));

app.use(express.json());

app.use(expressWinston.logger(logger))

app.get('/girls/api/events', async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '');
    if (code.code === 200) {
        if (req.query?.group) {
            const from: Date = new Date(Number(req.query?.from));
            const to: Date = new Date(Number(req.query?.to));
            const group = Number(req.query?.group);
            if (from.toJSON()&&to.toJSON()) {
                const resp = await sql.event.getEvent(group, from, to);
                res.json(resp)
            }
            else if (from.toJSON()) {
                const resp = await sql.event.getEvent(group, from);
                res.status(200).json(resp)
            }
            else res.sendStatus(418)
        }
        else res.sendStatus(400)
    }
    else res.sendStatus(code.code)
})

app.post('/girls/api/events/:id', async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (code.id && req.body?.name && req.body?.date && req.body.place && req.body.link) {
            const resp = await sql.event.addEvent(code.id, req.body.name, new Date(req.body.date), req.body.place, req.body.link, Number(req.params['id']));
            res.json(resp)
        }
        else res.sendStatus(418);
    }
    else res.sendStatus(code.code)
})

app.put('/girls/api/events/:id', async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (Number(req.params['id']) && req.body?.name && req.body?.date && req.body.place && req.body.link) {
            await sql.event.updEvent(req.body.id, req.body.name, new Date(req.body.date), req.body.place, req.body.link, Number(req.params['id']))
            res.json(true)
        }
        else res.sendStatus(418);
    }
    else res.sendStatus(code.code)
})

app.put('/girls/api/eventsYN/:id', async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '');
    if (code.code === 200) {
        if (req.query.req && Number(req.params['id'])) {
            await sql.event.YNEvent(Number(req.query?.evtId), req.query?.req === 'true' ? 1 : req.query.req === 'false' ? 2 : null, code.id||0, Number(req.params['id']))
            res.json(true)
        }
        else res.sendStatus(418);
    }
    else res.sendStatus(code.code)
})

app.delete('/girls/api/events/:id', async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '', true);
    if (code.code === 200) {
        await sql.event.delEvent(Number(req.query?.id), Number(req.params['id']))
        res.json(true)
    }
    else res.sendStatus(code.code)
})

app.get("/girls/api/calendar", async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '');
    if (code.code === 200) {
        const from: Date = new Date(Number(req.query.from))
        const to: Date = new Date(Number(req.query.to))
        if (from.toJSON() && to.toJSON())
            res.json({
                calendar: await sql.calendar.getCalendar(from, to, Number(req.query?.id)),
                users: await sql.user.userSearch({}, Number(req.query?.id)),
                events: await sql.event.getEvent(Number(req.query?.id), from, to)
            })
        else res.sendStatus(418)
    }
    else res.sendStatus(code.code)
})

app.post("/girls/api/calendar/:id", async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '');
    if (code.code === 200) {
        if (Array.isArray(req.body.freeDays) && Array.isArray(req.body.busyDays)){
            await sql.calendar.setCalendar(req.body.freeDays, code.id||0, 1, Number(req.params['id']))
            await sql.calendar.setCalendar(req.body.busyDays, code.id||0, 2, Number(req.params['id']))
            res.json(true)
        }
        else res.sendStatus(418)
    }
    else res.sendStatus(code.code)
})

app.post("/girls/api/users/:id", async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (req.body?.tgid && (req.body?.is_admin || req.body.is_admin === false)) {
            const tgData: TGFrom = req.body;
            const admin: boolean = req.body?.is_admin;
            const id: number = req.body.tgid;
            const name: string = req.body.name;
            const group: number = Number(req.params['id']);
            const result = await sql.user.userAdd({id: group, name}, id, admin, req.body?.register || false, tgData);
            res.json(result)
        }
        else res.sendStatus(418)
    }
})

app.get("/girls/api/users", async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '');
    if (code.code === 200) {
        const result = await sql.user.userSearch({}, Number(req.query?.id))
        res.json(result)
    }
    else res.sendStatus(code.code)
})

app.delete("/girls/api/users/:id", async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '', true);
    if (code.code === 200) {
        const result = await sql.user.delUser(Number(req.query?.tgId), Number(req.params['id']))
        res.json(result)
    }
})

app.put("/girls/api/users/:tgid", async (req: Request, res: Response) => {
    const code = await checkAuth(req.headers.authorization || '', true);
    if (code.code === 200) {
        console.log(req.body)
        if (req.body?.tgid && (req.body?.admin || req.body.admin === false || req.body.admin === 0)) {
            const tgData: TGFrom = req.body;
            const admin: boolean = req.body.admin;
            const id: number = req.body.tgid;
            const group: number = Number(req.params['tgid']);
            const name: string = req.body.name;
            const result = await sql.user.userAdd({id: group, name}, id, admin, req.body?.register || false, tgData);
            res.json(result)
        }
        else res.sendStatus(418)
    }
})

app.get("/girls/api/kudago/events", async (req: Request, res: Response) => {
    if (Number(req.query?.from) && Number(req.query?.to)) {
        try {
            const result = await axios.get(baseURL.createKudagoReq(
                Math.floor(Number(req.query?.from)), 
                Math.floor(Number(req.query?.to))));
            res.json(result.data)
        } catch (e) {
            res.sendStatus(500)
        }
    }
    else res.sendStatus(400)
})

app.get("/girls/api/sqlCheck", async (req: Request, res: Response) => {
    const userId: number = Number(req.headers.authorization?.slice(7) || 0)
    if (!userId) res.sendStatus(401)
    else {
        const sqlCheck: boolean|TGCheck = await sql.user.userCheck(userId);
        if (sqlCheck === false) res.sendStatus(401)
        else if (sqlCheck !== true && !sqlCheck.admin) res.sendStatus(403)
        else res.json(sqlCheck)
    }
})

app.get("/girls/api/startCheck", (req: Request, res: Response) => {res.sendStatus(200)})
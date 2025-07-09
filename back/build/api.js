"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const funcs_1 = require("@/mech/funcs");
const sql_1 = __importDefault(require("@/mech/sql"));
const axios_1 = __importDefault(require("axios"));
const baseURL_1 = __importDefault(require("@/consts/baseURL"));
const express_winston_1 = __importDefault(require("express-winston"));
const logger_1 = require("@/winston/logger");
const app = (0, express_1.default)();
exports.default = app;
const options = {
    swaggerOptions: {
        url: baseURL_1.default.swagger,
        swaggerOptions: {
            validatorUrl: null
        }
    }
};
app.use('/girls/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(null, options));
app.use(express_1.default.json());
app.use(express_winston_1.default.logger(logger_1.logger));
app.get('/girls/api/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '');
    if (code.code === 200) {
        if ((_a = req.query) === null || _a === void 0 ? void 0 : _a.group) {
            const from = new Date(Number((_b = req.query) === null || _b === void 0 ? void 0 : _b.from));
            const to = new Date(Number((_c = req.query) === null || _c === void 0 ? void 0 : _c.to));
            const group = Number((_d = req.query) === null || _d === void 0 ? void 0 : _d.group);
            if (from.toJSON() && to.toJSON()) {
                const resp = yield sql_1.default.event.getEvent(group, from, to);
                console.log(resp);
                res.json(resp);
            }
            else if (from.toJSON()) {
                const resp = yield sql_1.default.event.getEvent(group, from);
                console.log('fff');
                console.log(resp);
                res.status(200).json(resp);
            }
            else
                res.sendStatus(418);
        }
        else
            res.sendStatus(400);
    }
    else
        res.sendStatus(code.code);
}));
app.post('/girls/api/events/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (code.id && ((_a = req.body) === null || _a === void 0 ? void 0 : _a.name) && ((_b = req.body) === null || _b === void 0 ? void 0 : _b.date) && req.body.place && req.body.link) {
            const resp = yield sql_1.default.event.addEvent(code.id, req.body.name, new Date(req.body.date), req.body.place, req.body.link, Number(req.params['id']));
            res.json(resp);
        }
        else
            res.sendStatus(418);
    }
    else
        res.sendStatus(code.code);
}));
app.put('/girls/api/events/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (Number(req.params['id']) && ((_a = req.body) === null || _a === void 0 ? void 0 : _a.name) && ((_b = req.body) === null || _b === void 0 ? void 0 : _b.date) && req.body.place && req.body.link) {
            yield sql_1.default.event.updEvent(req.body.id, req.body.name, new Date(req.body.date), req.body.place, req.body.link, Number(req.params['id']));
            res.json(true);
        }
        else
            res.sendStatus(418);
    }
    else
        res.sendStatus(code.code);
}));
app.put('/girls/api/eventsYN/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '');
    if (code.code === 200) {
        if (req.query.req && Number(req.params['id'])) {
            yield sql_1.default.event.YNEvent(Number((_a = req.query) === null || _a === void 0 ? void 0 : _a.evtId), ((_b = req.query) === null || _b === void 0 ? void 0 : _b.req) === 'true' ? 1 : req.query.req === 'false' ? 2 : null, code.id || 0, Number(req.params['id']));
            res.json(true);
        }
        else
            res.sendStatus(418);
    }
    else
        res.sendStatus(code.code);
}));
app.delete('/girls/api/events/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        yield sql_1.default.event.delEvent(Number((_a = req.query) === null || _a === void 0 ? void 0 : _a.id), Number(req.params['id']));
        res.json(true);
    }
    else
        res.sendStatus(code.code);
}));
app.get("/girls/api/calendar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '');
    if (code.code === 200) {
        const from = new Date(Number(req.query.from));
        const to = new Date(Number(req.query.to));
        if (from.toJSON() && to.toJSON())
            res.json({
                calendar: yield sql_1.default.calendar.getCalendar(from, to, Number((_a = req.query) === null || _a === void 0 ? void 0 : _a.id)),
                users: yield sql_1.default.user.userSearch({}, Number((_b = req.query) === null || _b === void 0 ? void 0 : _b.id)),
                events: yield sql_1.default.event.getEvent(Number((_c = req.query) === null || _c === void 0 ? void 0 : _c.id), from, to)
            });
        else
            res.sendStatus(418);
    }
    else
        res.sendStatus(code.code);
}));
app.post("/girls/api/calendar/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '');
    if (code.code === 200) {
        if (Array.isArray(req.body.freeDays) && Array.isArray(req.body.busyDays)) {
            console.log(req.body.freeDays);
            yield sql_1.default.calendar.setCalendar(req.body.freeDays, code.id || 0, 1, Number(req.params['id']));
            yield sql_1.default.calendar.setCalendar(req.body.busyDays, code.id || 0, 2, Number(req.params['id']));
            res.json(true);
        }
        else
            res.sendStatus(418);
    }
    else
        res.sendStatus(code.code);
}));
app.post("/girls/api/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        if (((_a = req.body) === null || _a === void 0 ? void 0 : _a.tgid) && (((_b = req.body) === null || _b === void 0 ? void 0 : _b.is_admin) || req.body.is_admin === false)) {
            const tgData = req.body;
            const admin = (_c = req.body) === null || _c === void 0 ? void 0 : _c.is_admin;
            const id = req.body.tgid;
            const name = req.body.name;
            const group = Number(req.params['id']);
            const result = yield sql_1.default.user.userAdd({ id: group, name }, id, admin, ((_d = req.body) === null || _d === void 0 ? void 0 : _d.register) || false, tgData);
            res.json(result);
        }
        else
            res.sendStatus(418);
    }
}));
app.get("/girls/api/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '');
    if (code.code === 200) {
        const result = yield sql_1.default.user.userSearch({}, Number((_a = req.query) === null || _a === void 0 ? void 0 : _a.id));
        res.json(result);
    }
    else
        res.sendStatus(code.code);
}));
app.delete("/girls/api/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        const result = yield sql_1.default.user.delUser(Number((_a = req.query) === null || _a === void 0 ? void 0 : _a.tgId), Number(req.params['id']));
        res.json(result);
    }
}));
app.put("/girls/api/users/:tgid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const code = yield (0, funcs_1.checkAuth)(req.headers.authorization || '', true);
    if (code.code === 200) {
        console.log(req.body);
        if (((_a = req.body) === null || _a === void 0 ? void 0 : _a.tgid) && (((_b = req.body) === null || _b === void 0 ? void 0 : _b.admin) || req.body.admin === false || req.body.admin === 0)) {
            const tgData = req.body;
            const admin = req.body.admin;
            const id = req.body.tgid;
            const group = Number(req.params['tgid']);
            const name = req.body.name;
            const result = yield sql_1.default.user.userAdd({ id: group, name }, id, admin, ((_c = req.body) === null || _c === void 0 ? void 0 : _c.register) || false, tgData);
            res.json(result);
        }
        else
            res.sendStatus(418);
    }
}));
app.get("/girls/api/kudago/events", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (Number((_a = req.query) === null || _a === void 0 ? void 0 : _a.from) && Number((_b = req.query) === null || _b === void 0 ? void 0 : _b.to)) {
        try {
            const result = yield axios_1.default.get(baseURL_1.default.createKudagoReq(Math.floor(Number((_c = req.query) === null || _c === void 0 ? void 0 : _c.from)), Math.floor(Number((_d = req.query) === null || _d === void 0 ? void 0 : _d.to))));
            res.json(result.data);
        }
        catch (e) {
            res.sendStatus(500);
        }
    }
    else
        res.sendStatus(400);
}));
app.get("/girls/api/sqlCheck", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = Number(((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.slice(7)) || 0);
    if (!userId)
        res.sendStatus(401);
    else {
        const sqlCheck = yield sql_1.default.user.userCheck(userId);
        if (sqlCheck === false)
            res.sendStatus(401);
        else if (sqlCheck !== true && !sqlCheck.admin)
            res.sendStatus(403);
        else
            res.json(sqlCheck);
    }
}));
app.get("/girls/api/startCheck", (req, res) => { res.sendStatus(200); });

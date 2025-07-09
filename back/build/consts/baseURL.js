"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlUrl = '';
const kudagoURL = "https://kudago.com/public-api/v1.4/";
const swagger = 'https://spamigor.ru/demoFiles/girlsEvents/swagger.json';
const createKudagoReq = (from, to) => {
    const uri = `events/?fields=id,images,dates,title,short_title,place,price,description,site_url&` +
        `location=msk&` +
        `actual_since=${from}&` +
        `actual_until=${to}&` + `
        categories=festival,concert&` +
        `page_size=100`;
    return uri;
};
const botEventURLcreator = (id, group) => {
    return `https://spamigor.ru/vika2/events?id=${id}&group=${group}`;
};
const botUsersURLcreator = (id, group) => {
    return `https://spamigor.ru/vika2/users?id=${id}&group=${group}`;
};
exports.default = {
    sql: sqlUrl,
    kudago: kudagoURL,
    swagger,
    createKudagoReq,
    botPages: {
        event: botEventURLcreator,
        users: botUsersURLcreator
    }
};

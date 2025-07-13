const sqlUrl: string = '';

const kudagoURL: string = "https://kudago.com/public-api/v1.4/";

const swagger: string = 'https://spamigor.ru/demoFiles/girlsEvents/swagger.json';

const createKudagoReq = (from: number, to: number): string => {
    const uri: string = kudagoURL +
        `events/?fields=id,images,dates,title,short_title,place,price,description,site_url&`+
        `location=msk&`+
        `actual_since=${from}&`+
        `actual_until=${to}&`+`
        categories=festival,concert&`+
        `page_size=100`;
    return uri
}

const botEventURLcreator = (id: number|string, group: number|string) => {
    return `https://spamigor.ru/vika2/events?id=${id}&group=${group}`
}

const botUsersURLcreator = (id: number|string, group: number|string) => {
    return `https://spamigor.ru/vika2/users?id=${id}&group=${group}`
}

export default {
    sql: sqlUrl,
    kudago: kudagoURL,
    swagger,
    createKudagoReq,
    botPages: {
        event: botEventURLcreator,
        users: botUsersURLcreator
    }
}
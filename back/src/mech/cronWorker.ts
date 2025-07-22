import { Sequelize, Model, Op, fn, col } from 'sequelize';
import sequelize from '@/mech/sqlFuncs/helpers/seqInit';
import SQLinitModels from "@/models/init-models";
import { Telegraf } from 'telegraf';

const SQLInit = new SQLinitModels(sequelize);
const EventList = SQLInit.initEvent();
const EventListAgr = SQLInit.initEventAgr();
const GroupsList = SQLInit.initGroups();

interface ResultItem {
  id: number;
  namestring: string;
  place: string;
  linc: string;
  'Group.name': string;
  'Aggregation.tgId': number;
}

EventList.belongsTo(GroupsList, {
  foreignKey: 'groupID', // Имя столбца внешнего ключа в EventList
  as: 'Group', // Псевдоним для связи (используется в include)
});

GroupsList.hasMany(EventList, {
  foreignKey: 'groupID',
  as: 'EventLists',
});

EventList.hasOne(EventListAgr, {
  foreignKey: 'id',
  as: 'Aggregation',
});

EventListAgr.belongsTo(EventList, {
  foreignKey: 'id',
  as: 'EventList'
});

export default async function testJoinSQLFunc(bot: Telegraf, date: string) {
    try {
        const result = ((await EventList.findAll({
            where: {
                dateevent: date,//(new Date("2025-08-14 03:00:00")).toISOString(), // Преобразуем дату в формат YYYY-MM-DD,
                '$Aggregation.tgId$': {[Op.ne]: null}
            },
            attributes: [
                [fn('DISTINCT', col('eventList.id')), 'id'],
                'namestring', 
                'place', 
                'linc'
            ],
            raw: true,
            include: [
                {
                    model: GroupsList,
                    attributes: ['name'],
                    required: false, // LEFT JOIN
                    as: 'Group', // Используем псевдоним ассоциации
                    where: {},
                },
                {
                    model: EventListAgr,
                    attributes: ['tgId'],
                    required: false, // Сделаем INNER JOIN через required: true
                    as: 'Aggregation', // Используем псевдоним ассоциации
                    where: { res: true },
                },
            ],
        })) as any[]) as ResultItem[];
        result.map((item: ResultItem) => {
            bot.telegram.sendMessage(item['Aggregation.tgId']||0, `НАПОМИНАНИЕ!!!!\n`+
                `от группы ${item['Group.name']}\n\n`+
                `завтра: "${item.namestring}"\n`+
                `место: ${item.place}\n\n` +
                item.linc
            )
        })
    } catch (error) {
        console.error('Error executing join query:', error);
    }
}
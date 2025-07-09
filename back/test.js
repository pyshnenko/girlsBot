import * as dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from "sequelize";

sequelize-auto -h "spamigor.ru" -d "vikaGirls" -u "spamigor" -p 3306 -x "anton12101994A!" -o "./models" -t "ActiveTable" -e "mysql"

const sequelize = new Sequelize({
    database: 'vikaGirls',
    dialect: "mysql",
    username: String(process.env.SQLLOGIN),
    password: String(process.env.SQLPASS),
    host: String(process.env.SQLHOST),
    define: {
        timestamps: false
    }
});

class ActiveTable extends Model {}

ActiveTable.init({
        tgId: {type: Sequelize.BIGINT},
        groupId: {type: Sequelize.INT}
    }, 
    {
        sequelize,
        modelName: "ActiveTable2"
    }
)

sequelize.sync().then(result=>{
    console.log(result);
})
.catch(err=> console.log(err));
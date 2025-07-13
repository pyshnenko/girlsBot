import { Sequelize } from "sequelize";

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

export default sequelize;
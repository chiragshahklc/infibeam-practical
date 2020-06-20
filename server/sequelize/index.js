import { Sequelize, DataTypes } from "sequelize"

const orm = new Sequelize({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: "mariadb",
    dialectOptions: {
        connectionTimeout: 1000,
    },
    logging: false,
    define: {
        freezeTableName: true,
        timestamps: false,
    },
})

const Servers = orm.define("servers", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    model: {
        type: DataTypes.STRING(80),
        allowNull: false,
    },
    ramCapicity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ramType: {
        type: DataTypes.STRING(80),
        allowNull: true,
    },
    hddCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    hddCapicity: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    hddType: {
        type: DataTypes.STRING(80),
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING(80),
        allowNull: true,
    },
    price: {
        type: DataTypes.STRING(80),
        allowNull: true,
    },
})

export default {
    Servers,
}

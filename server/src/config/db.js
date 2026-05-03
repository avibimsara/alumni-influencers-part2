import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false, // Disable logging; set to console.log to see SQL queries       
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to MySQL database");
        await sequelize.sync({ alter: true }); // Sync models with the database
    } catch (error) {
        console.error("Error connecting to MySQL database:", error);
        process.exit(1);
    }
};

export { sequelize, connectDB };
const { config } = require("dotenv");

config();
//Configuración de ambiente considerando usuario, contraseña, base de datos y puerta

module.exports = {
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
};

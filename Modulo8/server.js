const db = require("./app/models");
const userController = require("./app/controllers/user.controller");
const bootcampController = require("./app/controllers/bootcamp.controller");
const userRoutes = require("./app/routes/user.routes");
const bootcampRoutes = require("./app/routes/bootcamp.routes");
const express = require("express");
const cors = require("cors");
const { HTTPError } = require("./app/utils/errors");

const SERVER_PORT = 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes);
app.use("/api", bootcampRoutes);

app.use((err, req, res, next) => {
  if (err instanceof HTTPError) {
    return res.status(err.code).send({ message: err.message });
  }
  return res.status(500).send("Error Servidor");
});


db.sequelize
  .sync({
    force: true,
  })
  .then(() => {
    console.log("Base de datos eliminada y sincronizando nuevamente");
    app.listen(SERVER_PORT, () =>
      console.log("Puerto del Servidor:   ", SERVER_PORT)
    );
  });

const Bootcamp = require("../models/bootcamp.model");
const User = require("../models/user.model");

/* Se solicita:
En la carpeta controllers posee los controladores tanto para el usuario (user.controller.js),
como para el Bootcamp (bootcamp.controller.js).
*/

async function createBootcamp(body) {
  try {
    const bootcamp = await Bootcamp.create(body);
    console.log(
      `El usuario creado: ${JSON.stringify(
        bootcamp.dataValues,
        null,
        2
      )}`
    );
    return bootcamp;
  } catch (error) {
    throw error;
  }
}

async function addUser(bootcampId, userId) {
  try {
    
    const user = await User.findByPk(userId, { logging: false });
    const bootcamp = await Bootcamp.findByPk(bootcampId, { logging: false });
    await bootcamp.addUser(user, { logging: false });
    console.log(`\nEl usuario agregado con ID=${userId} al Bootcamp con ID=${bootcampId}\n`);
  } catch (error) {
    throw error;
  }
}

async function findById(id) {
  try {
    const bootcamp = await Bootcamp.findByPk(id, {
      include: {
        association: "users",
        through: {
          attributes: [],
        },
      },
    });

    console.log(
      `El Bootcamp encontrado tiene un id=${id}: ${JSON.stringify(
        bootcamp.dataValues,
        null,
        2
      )}`
    );
  } catch (error) {
    throw error;
  }
}

async function findAll() {
  try {
    const bootcamps = await Bootcamp.findAll({
      include: {
        association: "users",
        through: {
          attributes: [],
        },
      },
    });

    console.log(`Los Bootcamps encontrados son: `);
    for (const bootcamp of bootcamps) {
      console.log(`${JSON.stringify(bootcamp.dataValues, null, 2)}`);
    }
    
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createBootcamp,
  addUser,
  findById,
  findAll,
};

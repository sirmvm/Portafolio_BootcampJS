const User = require("../models/user.model");

/* Se solicita:
En la carpeta controllers posee los controladores tanto para el usuario (user.controller.js),
como para el Bootcamp (bootcamp.controller.js).
*/

async function createUser(body) {
  try {
    const user = await User.create(body);
    console.log(`El usuario credo: ${JSON.stringify(user.dataValues, null, 2)}`);
    return user;
  } catch (error) {
    throw error;
  }
}

async function findUserById(id) {
  try {
    const user = await User.findByPk(id, {
      include: {
        association: "bootcamps",
        through: {
          attributes: [],
        },
      },
    });
    console.log(
      `El usuario creado tiene el ID=${id}: ${JSON.stringify(
        user.dataValues,
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
    const users = await User.findAll({
      include: {
        association: "bootcamps",
        through: {
          attributes: [],
        },
      },
    });
    console.log(`Los usuarios encontrados son los siguientes: ||`);
    for (const user of users) {
      console.log(`${JSON.stringify(user.dataValues, null, 2)},`);
    }
    console.log(`||`);
  } catch (error) {
    throw error;
  }
}

async function updateUserById(id, body) {
  try {
    const [_, [user]] = await User.update(body, {
      where: { id },
      returning: true,
    });
    console.log(
      `El usuario atualizado tiene un ID=${id}: ${JSON.stringify(
        user.dataValues,
        null,
        2
      )}`
    );
  } catch (error) {
    throw error;
  }
}

async function deleteUserById(id) {
  try {
    await User.destroy({ where: { id }, returning: true });
    console.log(`Usuario eliminado tiene un ID=${id}`);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  findUserById,
  findAll,
  updateUserById,
  deleteUserById,
};

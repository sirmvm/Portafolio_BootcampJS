const sequelize = require("./app/models");
const User = require("./app/models/user.model");
const Bootcamp = require("./app/models/bootcamp.model");
const {
  createUser,
  findUserById,
  findAll: findAllUsers,
  deleteUserById,
  updateUserById,
} = require("./app/controllers/user.controller");
const {
  createBootcamp,
  addUser,
  findAll: findAllBootcamps,
  findById,
} = require("./app/controllers/bootcamp.controller");
const { USERS, BOOTCAMPS, BOOTCAMP_USERS } = require("./data");

(async function () {
  try {
    
    User.associate({ Bootcamp });
    Bootcamp.associate({ User });

    //Para elimina las tablas y crearlas nuevamente
    await sequelize.drop();
    await sequelize.sync();
    console.log("Conectado a la base de datos");

    const usersMap = new Map();
    const bootcampsMap = new Map();

    // Creación de usuarios
    for (const user of USERS) {
      const u = await createUser(user);
      usersMap.set(`${u.firstName} ${u.lastName}`, u.id);
    }

    //Creación de los Bootcamps
    for (const bootcamp of BOOTCAMPS) {
      const b = await createBootcamp(bootcamp);
      bootcampsMap.set(b.title, b.id);
    }

    //Usuario - Bootcamps
    for (const bootcamp of BOOTCAMPS) {
      const bootcampId = bootcampsMap.get(bootcamp.title);
      for (const user of BOOTCAMP_USERS[bootcamp.title]) {
        const userId = usersMap.get(user);
        await addUser(bootcampId, userId);
      }
    }

    await findById(1);
    await findAllBootcamps(); 
    await findUserById(1);
    await findAllUsers(); 

    // Se solicita actualizar el usuario según su id; por ejemplo: actualizar el usuario con id=1 por Pedro
    await updateUserById(1, { firstName: "Pedro", lastName: "Sánchez" });

    // Se solicita eliminar un usuario por id; por ejemplo: el usuario con id=1.
    await deleteUserById(1);
  } catch (error) {
    console.log(error.message);
  }
})();

//Desconectar de la BD
process.on("Salir", async () => {
  try {
    await sequelize.close();
    console.log("Desconectado de la base de datos");
  } catch (error) {
    console.log("Error desconectando de la base de datos: ", error.message);
  }
});

const db = require("../models");
const { HTTPError } = require("../utils/errors");
const User = db.users;
const Bootcamp = db.bootcamps;

//Controlador de Bootcamp


exports.createBootcamp = async (req, res, next) => {
  try {
    
    const { title, cue, description } = req.body;
    if (!title || !cue || !description) {
      throw new HTTPError(400, "Los campos son necesarios");
    }

    const bootcamp = await Bootcamp.create({
      title,
      cue,
      description,
    });

    return res.status(201).send(bootcamp);
  } catch (err) {
    next(err);
  }
};

exports.findById = async (req, res, next) => {
  try {
    
    const { id } = req.params;

    const bootcamp = await Bootcamp.findByPk(id, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstName", "lastName"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).send(bootcamp);
  } catch (err) {
    next(err);
  }
};

exports.addUser = async (req, res, next) => {
  try {
    
    const { bootcampId, userId } = req.body;

    if (!bootcampId || !userId) {
      throw new HTTPError(400, "Campos necesario");
    }

    const bootcamp = await Bootcamp.findByPk(bootcampId);

    if (!bootcamp) {
      throw new HTTPError(404, "No se encuentra el bootcamp");
    }
    const user = await User.findByPk(userId);

    if (!user) {
      throw new HTTPError(404, "No se encuentra el usuario");
    }
    bootcamp.addUser(user);
    return res
      .status(201)
      .send(
        `Usuario con ID = ${user.id} al Bootcamp con ID = ${bootcamp.id} agregado`
      );
  } catch (err) {
    next(err);
  }
};


exports.findAll = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstName", "lastName"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).send(bootcamps);
  } catch (err) {
    next(err);
  }
};

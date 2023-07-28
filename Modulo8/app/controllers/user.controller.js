const { SECRET } = require("../config/auth.config");
const db = require("../models");
const { HTTPError } = require("../utils/errors");
const User = db.users;
const Bootcamp = db.bootcamps;

// Controlador Usuario

exports.createUser = async (req, res, next) => {
  try {
    
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      throw new HTTPError(400, "Campos necesarios");
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    return res.status(201).send(user);
  } catch (err) {
    next(err);
  }
};

exports.signInUser = async (req, res, next) => {
  try {
    
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new HTTPError(404, "Usuario no existe");
    }

    const passwordMatches = User.validatePassword(password, user.password);

    if (!passwordMatches) {
      throw new HTTPError(401, "Contraseña incorrecta o no existe");
    }

    
    const {
      dataValues: { password: userPassword, ...rest },
    } = user;

    
    const userWithoutPass = { ...rest };
    userWithoutPass.accessToken = User.generateToken(
      { id: user.id, email: user.email },
      "1d"
    );

    return res.status(200).send(userWithoutPass);
  } catch (err) {
    next(err);
  }
};


exports.findUserById = async (req, res, next) => {
  try {
    
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Bootcamp,
          as: "bootcamps",
          attributes: ["id", "title"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!user) {
      throw new HTTPError(404, "Usuario no encontrado");
    }

    return res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};


exports.updateUserById = async (req, res, next) => {
  try {
    
    const { id } = req.params;

    
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      throw new HTTPError(400, "Campos necesarios");
    }

    const user = await User.update(
      {
        firstName,
        lastName,
      },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUserById = async (req, res, next) => {
  try {
    
    const { id } = req.params;

    const user = await User.destroy({
      where: {
        id,
      },
    });

    return res
      .status(200)
      .send(`El usuario: ${JSON.stringify(user, null, 4)} ha sido eliminado`);
  } catch (err) {
    next(err);
  }
};


exports.findAll = async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Bootcamp,
          as: "bootcamps",
          attributes: ["id", "title"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    return res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};






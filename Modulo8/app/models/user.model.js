const { SALT, SECRET } = require("../config/auth.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      firstName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Campos necesario",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Campo necesario",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Campo necesario",
          },
          isEmail: {
            args: true,
            msg: "Correo invalido",
          },
        },
        unique: {
          args: true,
          msg: "Email actualizado con exito",
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Campos necesario",
          },
          min: {
            args: [8],
            msg: "Mínimo 8 caracteres de contraseña",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, SALT);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, SALT);
          }
        },
      },
    }
  );


  User.validatePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
  };

  User.generateToken = (content, lifetime) => {
    return jwt.sign(content, SECRET, {
      expiresIn: lifetime,
    });
  };

  return User;
};

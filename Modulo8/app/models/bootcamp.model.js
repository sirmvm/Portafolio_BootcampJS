module.exports = (sequelize, DataTypes) => {
  const Bootcamp = sequelize.define('bootcamp', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Campo necesario"
        },
      },
    },
    cue: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "Campo necesario, minimo 5 y máximo 20"
        },
        isInt: {
          args: true,
          msg: "El numero debe ser entero"
        },
        max: 20,
        min: 5,
      },
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Campo necesario"
        },
      },
    }

  })

  return Bootcamp
}
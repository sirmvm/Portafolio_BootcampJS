const { Model, Sequelize } = require("sequelize");
const sequelize = require("./");
//Modelo del bootcamp

class Bootcamp extends Model {
  static associate(models) {
    this.belongsToMany(models.User, {
      through: "user_bootcamp",
      foreignKey: "bootcamp_id",
      otherKey: "user_id",
      as: "users",
    });
  }
}


Bootcamp.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cue: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        
        min: 10,
        max: 20,
      },
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "bootcamps",
    modelName: "Bootcamp",
  }
);

module.exports = Bootcamp;

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      models.User.hasMany(models.Post, {foreignKey: "user_id"})
      models.User.hasMany(models.Comment, {foreignKey: "user_id"}),
      models.User.hasMany(models.Like, {foreignKey: "user_id"})

    }
  }
  User.init({
    email: DataTypes.STRING,
    nickname: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
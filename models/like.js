'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Like.belongsTo(models.User, {foreignKey: "user_id"}),
      models.Like.belongsTo(models.Post, {foreignKey: "post_id"})
    }
  }
  Like.init({
    done: {
      type: DataTypes.INTEGER
    },
    post_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  },{
    sequelize,
    modelName: 'Like',
    timestamps: false
  });
  return Like;
};
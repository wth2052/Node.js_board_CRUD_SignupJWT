'use strict';
const {
  Model
} = require('sequelize');
const db = require('../models');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      models.Comment.belongsTo(models.User, {foreignKey: "user_id"}),
      models.Comment.belongsTo(models.Post, {foreignKey: "post_id"})// 작성자가 한명임 
      //Post모델에 id_pk 특성을 추가
    }
  }
  Comment.init({
    nickname: DataTypes.STRING,
    content: DataTypes.STRING,
    password: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};
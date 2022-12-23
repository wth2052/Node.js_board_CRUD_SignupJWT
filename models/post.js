'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Post.belongsTo(models.User, {foreignKey: "user_id"}), // 사용자는 단 하나의 닉네임을 가질 수 있음
      models.Post.hasMany(models.Comment, {foreignKey: "post_id"}), // 사용자는 여러개의 댓글을 가질 수 있음
      models.Post.hasMany(models.Like, {foreignKey: "post_id"})
      models.User.hasMany(models.Like, {foreignKey: "user_id"})
    }
  }
  Post.init({
    user: DataTypes.STRING,
    password: DataTypes.STRING,
    title: DataTypes.STRING,
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    content: DataTypes.STRING,
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(db) {
      Comment.belongsTo(db.Post, { foreignKey: 'Postid_pk', targetKey: 'id' }); // 작성자가 한명임 
      //Post모델에 id_pk 특성을 추가
      // db.Post.hasMany(Comment);
    }
  }
  Comment.init({
    nickname: DataTypes.STRING,
    content: DataTypes.STRING,
    password: DataTypes.STRING,
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Comment',
  });

  return Comment;
};
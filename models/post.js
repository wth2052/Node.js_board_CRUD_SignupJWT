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
    static associate(db) {
      db.Post.hasMany(db.Comment, { foreignKey: 'Commentid_pk', sourceKey: 'id'});   // 사용자는 여러개의 댓글을 가질 수 있음
      //Post모델에 id_pk 특성을 추가
      // db.Comment.belongsTo(db.Post);
    }
  }
  Post.init({
    user: DataTypes.STRING,
    password: DataTypes.STRING,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
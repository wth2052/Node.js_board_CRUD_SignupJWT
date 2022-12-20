
const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);  

const commentSchema = new mongoose.Schema({
  nickname : String,
  content : String,
  password : String,
  commentid : Number,
  createdAt : Date
},
// {
//   usePushEach: true
// }
);
  
const postsSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
      },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    comments: [commentSchema]
  },
  {
    timestamps: true
  });
  postsSchema.plugin(autoIncrement.plugin, {
    model: 'Posts',
    field: 'postsId',
    startAt: 1, //시작
    increment: 1 // 증가
});

// 몽고디비 컬렉션과 스키마 연결하는 모델 생성
module.exports = mongoose.model("Comment", commentSchema);
module.exports = mongoose.model("Posts", postsSchema);


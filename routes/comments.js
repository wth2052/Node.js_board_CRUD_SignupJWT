// /routes/comments.js
const express = require("express")
const { QueryTypes } = require('sequelize');
const router = express.Router()
const { Comment } = require('../models')
const authMiddleware = require("../middlewares/auth-middleware.js");
//GET 댓글 조회 완성
router.get("/:postsId", async (req, res) => {
  const { postsId } = req.params;
  const getAllComments = await Posts.find({ postsId: Number(postsId)});
  res.json({ getAllComments })
})

//POST 댓글 작성 완성
router.post("/:id",authMiddleware, async (req, res, next) => {
  // const { id } = req.params;
  // const {nickname, password,content} = req.body
  // const post = await Post.findById (id)
  //   if(nickname, content, password){
  //       post.comments.push({
  //       nickname, 
  //       content, 
  //       password,
  //       id,
  //       createdAt: new Date()
  //   });
  //     const result = await post.save();
  //     console.log(result)
  //     return res.status(200).send({message: "댓글 작성 성공!"});
  //   }
  const {id} = req.params;
  const user_id = req.user;
  console.log(user_id)
  const {nickname, password, content} = req.body;
  await Comment.create({nickname, password, content,post_id:id, user_id})
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    })

    if(!content || !nickname || !password){
        return res.status(400).json({success: false, errorMessage:"내용이나 작성자가 입력되지 않았습니다. 다시한번 확인해주세요."});
      }
  
});


// Comment 수정
router.patch("/:postsId/:_id", async (req, res) => {
  const {postsId,_id} = req.params;
  console.log(postsId)
  const {password, content} = req.body    //코멘트 아이디
  const posts = await Posts.find({ postsId : postsId, "comments._id": _id});
  // //하나는 postsId를 하나는 password를 쭉 돌아 나온 결과를 새로운 배열로써 반환해줌.
  // const commentIds = posts.map((post) => post.commentId); 
  // // [1, 2, 3, 4, 5, 6, 7]
  // const commentsPws = posts.map((post) => post.password);
  try {
      await Posts.updateOne(
      { postsId : postsId, "comments._id": _id},
      { $set: {"comments.$.content": content} });
      return res.status(200).send({message: "수정에 성공했습니다."});
  } catch (error) {
      return res.status(400).send({message: "수정에 실패했습니다."});
  }
});

// Comment 삭제
router.delete("/:postsId/:_id", async (req, res) => {
  const {postsId,_id} = req.params;
  console.log(_id) 
  const find = await Posts.find ({postsId: postsId})
  console.log(find)
  try {
    
  await Posts.updateOne(
    { postsId: postsId},
        {$pull: {comments: {_id: _id}}},
      res.status(200).send({message:"삭제됐음"}))
    } catch (error) {
      return res.status(400).send({});
  }
});


module.exports = router;
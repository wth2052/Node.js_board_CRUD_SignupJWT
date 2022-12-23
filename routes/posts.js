
// /routes/posts.js
const express = require("express")
const router = express.Router()
const { Post } = require('../models')
const authMiddleware = require("../middlewares/auth-middleware");
const { Comment, Like } = require("../models");

// 게시물 작성 POST
    router.post("/", authMiddleware, async (req, res) => {
    const {user, password, title, content, post_id} = req.body
    const user_id = req.decoded.userId;
      try {
          await Post.create({user, password, title, content, user_id})
          return res.status(201).send({success: true,Message: '게시물 작성에 성공했습니다.'})
      } catch (err){ 
        if(!user || !password || !title || !content){
          res.status(400).json({success: false, errorMessage:"데이터 형식이 올바르지 않습니다. 빈곳이 없는지 다시한번 확인해주세요."})
          return;
        }
      }
});


//게시글 조회 GET
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({ 
    attributes: ['id', 'user', 'title', 'content', 'likes', 'user_id'],
    order: [['likes', 'DESC']],});
    res.json({posts});
  }
  catch (err){
    res.status(400).json({errorMessage:"게시글 조회에 실패하였습니다."})
    console.log(err)
  }
})

//게시글 상세조회 GET
router.get("/:post_id", async (req, res) => {
  const { post_id } = req.params;

  const data = await Post.findOne({
    where: { id: post_id },
    attributes: ["id", "title", "content", "likes"],
    include: [{
        model: Comment,
        attributes: ["id", "content", "createdAt"],
        separate: true,
        order: [["createdAt", "DESC"]]
    }]
});

  res.status(200).json({ data });
});

//게시글 수정 PUT
// 발생할수 있는 상황 : 비밀번호 불일치, 비밀번호 입력안함, 비밀번호 일치
router.put("/:id", authMiddleware,async (req, res) => {
  const { id } = req.params;
  const { password, title, content } = req.body;

  const posts = await Post.findAll();
  const ids = posts.map((post) => post.id); 
  const postsPws = posts.map((post) => post.password);
  console.log(ids, postsPws)
  for(let i=0; i< ids.length; i++){
    if(ids[i] === Number(id) && postsPws[i] === password) {
      await Post.upcreatedAt({title: title, content: content}, {where:{id}})
      res.json({ success: true, Message: '수정에 성공하였습니다.' });
    } else if (ids[i] === Number(id) && postsPws[i] != password){ 
      return res.json({ success: false, Message: '비밀번호가 일치하지 않습니다.' });
  } else if (!password){
      return res.json({success: false, msg: "비밀번호를 입력해주세요." })
    }
  }
})

//게시글 삭제 DELETE
router.delete("/:id", authMiddleware,async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const posts = await Post.findAll();
  const ids = posts.map((post) => post.id); 
  const postsPws = posts.map((post) => post.password);
  for(let i=0; i< ids.length; i++){
    if(ids[i] === Number(id) && postsPws[i] === password) {
      await Post.destroy({where:{id}})
      res.json({ success: true, Message: '삭제에 성공하였습니다.' });
    } else if (ids[i] === Number(id) && postsPws[i] != password){ 
      return res.json({ success: false, Message: '비밀번호가 일치하지 않습니다.' });
  } else if (!password){
      return res.json({success: false, msg: "비밀번호를 입력해주세요." })
    }
  }
})


//게시글 좋아요 POST
router.post("/:post_id/likes", authMiddleware, async (req, res) => {
  try {
      const { post_id } = req.params;
      const user_id = req.decoded.userId;
      const post = Post.findOne({
          where: { id: post_id }
      })
      if (!post) {
          return res.status(404).json({
              msg: "게시글이 존재하지 않습니다."
          });
      }

      const likes = await Post.findOne({
          where: { id: post_id },
          attributes: ["likes"]
      });

      const check_like = await Like.findOne({
          where: {
              post_id: post_id,
              user_id: user_id
          }
      })

      if (check_like === null) {
          Like.create({ done: 1, post_id, user_id });
          Post.update({
              likes: likes.likes + 1
          }, {
              where: { id: post_id }
          });
          return res.status(201).json({
              msg: "좋아요를 눌렀습니다."
          });
      }

      if (check_like.done === 0) {
          Like.update(
              {
                  done: 1
              }, {
              where: {
                  post_id: post_id,
                  user_id: user_id
              }
          });
          Post.update({
              likes: likes.likes + 1
          }, {
              where: { id: post_id }
          });
          return res.status(200).json({
              msg: "좋아요를 눌렀습니다."
          });
      } else {
          Like.update(
              {
                  done: 0
              }, {
              where: {
                  post_id: post_id,
                  user_id: user_id
              }
          });
          Post.update({
              likes: likes.likes - 1
          }, {
              where: { id: post_id }
          });
          return res.status(200).json({
              msg: "좋아요를 취소했습니다."
          });
      }
  } catch (error) {
      console.log(error);
      res.status(400).json({
          msg: "게시글 좋아요 요청이 실패했습니다."
      });
  }
});



module.exports = router;

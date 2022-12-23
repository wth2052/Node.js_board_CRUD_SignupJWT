// /routes/comments.js
const express = require("express")
const router = express.Router()
const { Comment, Post } = require('../models')
const authMiddleware = require("../middlewares/auth-middleware.js");


//댓글 조회 GET
router.get("/:postsId", async (req, res) => {
  const { postsId } = req.params;
  const getAllComments = await Posts.find({ postsId: Number(postsId)});
  res.json({ getAllComments })
})

//댓글 작성 POST
router.post("/:id",authMiddleware, async (req, res, next) => {
  const {id} = req.params;
  const user_id = req.decoded.userId;
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


//댓글 수정 PUT
router.put("/:post_id/:comment_id", authMiddleware, async (req, res) => {
  try {
    const { post_id, comment_id } = req.params;
    const { content } = req.body;
    const user_id = req.decoded.userId;
    if (!content || content === "") {
      return res.status(412).json({
          msg: "댓글 작성 형식이 올바르지 않습니다."
      });
  }

  const post = await Post.findOne({
      where: { id: post_id }
  })

  if (!post) {
      return res.status(404).json({
          msg: "해당하는 게시글이 존재하지 않습니다."
      });
  }

  const check_comment = await Comment.findOne({
      where: { id: comment_id },
      attributes: ["id", "user_id"]
  })

  if (!check_comment) {
      return res.status(404).json({
          msg: "해당하는 댓글이 존재하지 않습니다."
      });
  }

  if (check_comment.user_id !== user_id) {
      return res.status(403).json({
          msg: "자기가 작성하지 않은 댓글은 수정할 수 없습니다."
      });
  }

  await Comment.update({
      content
  }, {
      where: { id: comment_id }
  });

  res.status(200).json({
      msg: "댓글 내용이 수정되었습니다."
  })
} catch (error) {
  console.log(error);
  res.status(400).json({
      msg: "댓글 수정에 실패하였습니다."
  });
}
});

//댓글 삭제 DELETE
router.delete("/:post_id/:comment_id",authMiddleware, async (req, res) =>   {  
try {
  const { post_id, comment_id } = req.params;
  const user_id = req.decoded.userId;

  const post = await Post.findOne({
      where: { id: post_id }
  })

  if (!post) {
      return res.status(404).json({
          msg: "해당하는 게시글이 존재하지 않습니다"
      });
  }

  const check_comment = await Comment.findOne({
      where: { id: comment_id },
      attributes: ["id", "user_id"]
  })

  if (!check_comment) {
      return res.status(404).json({
          msg: "해당하는 댓글이 존재하지 않습니다"
      });
  }
  console.log("안녕?",check_comment.user_id)
  console.log("hello?",user_id)
  if (check_comment.user_id !== user_id) {
      return res.status(403).json({
          msg: "자기가 작성하지 않은 댓글은 삭제할 수 없습니다."
      });
  }

  await Comment.destroy({
      where: { id: comment_id }
  });

  res.status(200).json({
      msg: "댓글이 삭제되었습니다."
  });
} catch (error) {
  console.log(error);
  res.status(400).json({
      msg: "댓글 삭제에 실패했습니다."
  });
}
})


module.exports = router;
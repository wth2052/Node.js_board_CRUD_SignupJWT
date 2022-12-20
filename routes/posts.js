// /routes/posts.js
const express = require("express")
const router = express.Router()
const Posts = require("../schemas/posts.js")
const authMiddleware = require("../middlewares/auth-middleware");
// 게시물 작성 POST
    router.post("/", authMiddleware, async (req, res) => {
    const {user, password, title, content} = req.body
    //빈칸에 대한 if 요청, try catch 사용
      try {
          await Posts.create({user, password, title, content})
          return res.status(201).send({success: true,Message: '게시물 작성에 성공했습니다.'})
      } catch (err){ 
        if(!user || !password || !title || !content){
          res.status(400).json({success: false, errorMessage:"데이터 형식이 올바르지 않습니다. 빈곳이 없는지 다시한번 확인해주세요."})
          return;
        }
      }
});


//GET 게시글 조회 완성
router.get("/", async (req, res) => {
  const getAllPosts = await Posts.find();
  res.json({ getAllPosts })
})

//GET 게시글 상세조회 완성
router.get("/:postsId", async (req, res) => {
  const { postsId } = req.params;
  const getOnePosts = await Posts.find({ postsId: Number(postsId) });
  res.status(200).json(getOnePosts);
})



//PUT 게시글 수정 완성
// 발생할수 있는 상황 : 비밀번호 불일치, 비밀번호 입력안함, 비밀번호 일치
router.put("/:postsId/", authMiddleware, async (req, res) => {
  const { postsId } = req.params;
  const { password, title, content } = req.body;
  // find 메소드 : 제공되는 조건을 만족하는 첫번째 엘리먼트 값을 리턴하는 함수
  // map함수는 callbackFunction을 실행한 결과를 가지고 새로운 배열을 만들 때 사용한다.
  // map 함수는 파라미터가 하나만 있을 때는 주변 괄호를 생략할 수 있다.
  //이때 posts 변수는 동기적으로 Posts에 있는 스키마를 토대로 자료를 검색함
  //const Posts = require("../schemas/posts.js")
  const posts = await Posts.find();
  //하나는 postsId를 하나는 password를 쭉 돌아 나온 결과를 새로운 배열로써 반환해줌.
  const postsIds = posts.map((post) => post.postsId); 
  // [1, 2, 3, 4, 5, 6, 7]
  const postsPws = posts.map((post) => post.password);
  // ['123456', '123456', '123456', '123456123', '123456123', '123456123', '123456123']
  console.log(postsIds, postsPws)
  // for문으로 postids 갯수만큼 도는데
  // postsIds의 i번째 값과 postsId (api 주소에 있는 게시글 번호)와 비교한다.(주소창에 3을 입력시 i는 1 2 3 돌아 도착)
  for(let i=0; i< postsIds.length; i++){
    // 이때 postIds[i](for문의 i번째 postsId값)과 req.body에 담긴 postsId의 값과 일치하고
    // postsPws[i](for문의 i번째 password값)과 req.body에 담긴 password값과 일치할 경우
    if(postsIds[i] === Number(postsId) && postsPws[i] === password) {
      //Posts에 있는 자료를 postsId를 토대로 title contet값을 입력한 값으로 바꿔준다. 이때 작업은 동기적으로 처리한다.
      await Posts.updateOne({ postsId: Number(postsId)}, { $set: {title, content} })
      // console.log(postsIds[i],Number(postsId),postsPws[i],password)
      //값을 바꾼뒤 json으로 success true와 수정에 성공하였다는 응답을 반환한다.
      res.json({ success: true, Message: '수정에 성공하였습니다.' });
      //비밀번호가 일치하지 않을 시에 대한 처리
      //postsId[i]와 postsId는 맞지만, postsPws[i]와 password가 일치하지 않을 경우
    } else if (postsIds[i] === Number(postsId) && postsPws[i] != password){ 
      //success false를 반환하고, 비밀번호가 일치하지 않는다는 응답을 반환한다.
      return res.json({ success: false, Message: '비밀번호가 일치하지 않습니다.' });
      //비밀번호를 입력하지 않을 시에 대한 처리
      //비밀번호가 비었을 시
      //success false를 반환하고, 비밀번호가 입력되지 않았으니 입력해달라는 응답을 반환한다.
  } else if (!password){
      return res.json({success: false, msg: "비밀번호를 입력해주세요." })
    }
  }
})

//DELETE 삭제 함수 완성
router.delete("/:postsId/", authMiddleware,async (req, res) => {
  const { postsId } = req.params;
  const { password } = req.body;
    //const Posts = require("../schemas/posts.js")
    const posts = await Posts.find();
    //하나는 postsId를 하나는 password를 쭉 돌아 나온 결과를 새로운 배열로써 반환해줌.
    const postsIds = posts.map((post) => post.postsId); 
    // [1, 2, 3, 4, 5, 6, 7]
    const postsPws = posts.map((post) => post.password);
    // ['123456', '123456', '123456', '123456123', '123456123', '123456123', '123456123']
  // for문으로 postids 갯수만큼 도는데
  // postsIds의 i번째 값과 postsId (api 주소에 있는 게시글 번호)와 비교한다.(3을 입력시 i는 1 2 3 돌아 도착)
  for(let i=0; i< postsIds.length; i++){
    // 이때 postIds[i](for문의 i번째 postsId값)과 req.body에 담긴 postsId의 값과 일치하고
    // postsPws[i](for문의 i번째 password값)과 req.body에 담긴 password값과 일치할 경우
    if(postsIds[i] === Number(postsId) && postsPws[i] === password) {
      //Posts에 있는 자료를 postsId를 토대로 title contet값을 입력한 값으로 바꿔준다. 이때 작업은 동기적으로 처리한다.
    await Posts.deleteOne({ postsId });
      res.json({ result: "success", Message: '삭제에 성공하였습니다.' });
      //비밀번호가 일치하지 않을 시에 대한 처리
      //postsId[i]와 postsId는 맞지만, postsPws[i]와 password가 일치하지 않을 경우
    } else if (postsIds[i] === Number(postsId) && postsPws[i] != password){ 
      //success false를 반환하고, 비밀번호가 일치하지 않는다는 응답을 반환한다.
      return res.json({ success: false, Message: '비밀번호가 일치하지 않습니다.' });
      //비밀번호를 입력하지 않을 시에 대한 처리
      //비밀번호가 비었을 시
      //success false를 반환하고, 비밀번호가 입력되지 않았으니 입력해달라는 응답을 반환한다.
  } else if (!password){
      return res.json({success: false, msg: "비밀번호를 입력해주세요." })
    }
  }
});





module.exports = router;

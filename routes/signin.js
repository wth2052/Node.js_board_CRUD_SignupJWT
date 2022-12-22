const express = require("express");
const CryptoJS = require("crypto-js"); 
//비번 암호화
//로그인 시 게시글로 가야함 = Posts router
const jwt = require("jsonwebtoken");  
const session = require("express-session")  
const router = express.Router();


const tokenRouter = require('./token');
const app = express();
const env = process.env;

app.use('/', tokenRouter);
require('dotenv').config({path: '../../.env'});

//토큰을 받아주는 함수
// setUserToken = (res, userId) => {
//     const token = jwt.sign({ userId: user.userId }, "customized-secret-key")
// res.cookie(
//    'token', token
//   );
// }
//로그인
const { Op } = require("sequelize");
const { User } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
// const passportConfig = { usernameField: 'userId', passwordField: 'password' };

  // //토큰을 통해 회원 인증
  // jwt.verify(token,JWT_ACCESS_SECRET,(err,encode)=>{
  //     if(err) console.error(err);
  //     else {
  //         console.log(encode);
  //     }
  // });

router.post("/", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await User.findOne({
      where: {
        email,
      },
      
    });
    console.log(user)
    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses 
    const existPw = user.password;
    console.log(existPw)
    const decryptedPw = CryptoJS.AES.decrypt(existPw,process.env.keyForDecrypt);
    const originPw = decryptedPw.toString(CryptoJS.enc.Utf8);

    if (originPw != password) {
        res.status(400).send({errorMessage: '닉네임 또는 비밀번호를 확인해주세요'});
        return;
    } else {
      //if문 전부 통과했다면 정보가 정확하다는 얘기
      //id라는 쿠키에 token 부여후 
        const token = jwt.sign({ nickname : user.nickname,userId:user.id},process.env.JWT_ACCESS_SECRET, { expiresIn: '5m'});
        res.cookie('id', token, {
      httpOnly: true
    });
    res.send ({token});
    console.log(req.headers.cookie)
    if(!req.headers.cookie){
      res.status(401).send({errorMessage: "로그인이 필요합니다."})
      return
    }
}

  });
  
  module.exports = router;


      // setUserToken(res, req.userId);
    // res.redirect('/');
    // setUserToken = (res, user)=> {
    // const token = jwt.sign(user, secret);
    //   res.cookie('token', token) //클라이언트에 쿠키로 전달한다.
    // }
    // console.log(token);
  //토큰 전달 작성중, 비밀번호가 맞았다면-
    // user.confirmPassword(req.body.password,(err, isMatch)=>{
    //   // 에러에 대한 예외처리, 발생시 400을 반환하며 서버에 err를 전달한다.
    //   if(err) return res.status(400).send(err);
    //   res.cookie("x_auth", user.token)
    // })

    // 무작정 토큰 보내버리기~ 니 로그인 성공~
    // res.send({
    //   token: token, 
    // });

  //   const token = jwt.sign({id: user.userId}, env.JWT_ACCESS_SECRET ,{ expiresIn: '5m'})
    
  //   res.cookie('id', token, {
  //     httpOnly: true
  //   });
  //   res.send('로그인에 성공하였습니다.');
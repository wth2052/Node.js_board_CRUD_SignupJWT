const express = require("express");
//비번 암호화
//로그인 시 게시글로 가야함 = Posts router
const jwt = require("jsonwebtoken");    
const router = express.Router();
const { status } = require("express/lib/response");
const { hash } = require("bcrypt");
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const tokenRouter = require('./token');
const app = express();
app.use('/token', tokenRouter);
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
// const passportConfig = { usernameField: 'userId', passwordField: 'password' };
router.post("/", async (req, res) => {
    
    const { email, password } = req.body;
  
    const user = await User.findOne({
      where: {
        email,
      },
    });
  
    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
    if (!user || password !== user.password) {
      res.status(400).send({
        errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
      });
      return;
    }
    const token = jwt.sign({userId: user.userId}, process.env.JWT_SECRET )
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

    // 무작정 토큰 보내버리기~
    res.send({
      token: jwt.sign({ userId: user.userId }, "customized-secret-key"),
    });
  });
  module.exports = router;
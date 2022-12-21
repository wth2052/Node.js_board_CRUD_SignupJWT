const express = require("express");
const CryptoJS = require("crypto-js"); 
//비번 암호화
//로그인 시 게시글로 가야함 = Posts router

const jwt = require("jsonwebtoken");    
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { status } = require("express/lib/response");
const { hash } = require("bcrypt");

const app = express();
const signinRouter = require('./signin');
app.use('/signin', signinRouter);
require('dotenv').config({path: '../../.env'});
const env = process.env;
// 회원가입
const { Op } = require("sequelize");
const { User } = require("../models");


router.post("/", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;

//닉네임 표현식 확인 3자이상, 알파벳 대소문자, 숫자만 허용
    const correct_nickname = /^[a-zA-Z0-9]{3,10}$/ //닉네임 정규표현식
    if (!(correct_nickname.test(nickname))) {
        res.status(400).send({
            errorMessage: "닉네임은 최소 3자이상, 알파벳 대소문자, 숫자로만 구성되어야 합니다."
        });
        return; 
    }
//비밀번호 4자 이상 확인 로직
    if (password.length < 4) {
        res.status(400).send({
            errorMessage: "비밀번호는 안전을 위해 4자 이상으로 만들어주세요."
        });
        return; 
    }

//비밀번호와 닉네임과 같은 경우 가입 불허 로직
    if (password === nickname){
        res.status(400).send({
            errorMessage: "안전을 위해 비밀번호와 닉네임은 다르게 구성해주세요."
    });
    return; 
    }



// 패스워드 확인 로직
  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

// 현재 아래 코드는 시퀼라이즈로 구현되어있음, 시퀼라이즈와 몽고디비의 문법 차이는 수정되어 있으나
// 게시판같은 경우는 수정을 요함.
  // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findAll({
    where: {
      [Op.or]: [{ email }, { nickname } ],
    },
  });
  if (existsUsers.length) {
    res.status(400).send({
      errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
    });
    return;
  }

  await User.create({ email, nickname, password });
  res.status(201).send({});
});

  module.exports = router;


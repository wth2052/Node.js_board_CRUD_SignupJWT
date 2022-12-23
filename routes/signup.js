const express = require("express");
const CryptoJS = require("crypto-js");    
const router = express.Router();
const app = express();
const signinRouter = require('./signin');
app.use('/signin', signinRouter);
require('dotenv').config({path: '../../.env'});

//Sequelize 변수 정의
const { Op } = require("sequelize");
const { User } = require("../models");

// 회원가입 POST
router.post("/", async (req, res) => {
  const { email, nickname, pwd, confirmPassword } = req.body;

//닉네임 정규표현식 확인 3자이상, 알파벳 대소문자, 숫자만 허용
    const correct_nickname = /^[a-zA-Z0-9]{3,10}$/ 
    if (!(correct_nickname.test(nickname))) {
        res.status(400).send({
            errorMessage: "닉네임은 최소 3자이상, 알파벳 대소문자, 숫자로만 구성되어야 합니다."
        });
        return; 
    }
//비밀번호 4자 이상 확인
    if (pwd.length < 4) {
        res.status(400).send({
            errorMessage: "비밀번호는 안전을 위해 4자 이상으로 만들어주세요."
        });
        return; 
    }

//비밀번호와 닉네임과 같은 경우 가입 불허
    if (pwd === nickname){
        res.status(400).send({
            errorMessage: "안전을 위해 비밀번호와 닉네임은 다르게 구성해주세요."
    });
    return; 
    }

// 패스워드 확인
  if (pwd !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }
//이메일 닉네임 중복검사
  const existsUsers = await User.findAll({
    where: {
      [Op.or]: [{ email }, { nickname } ],
    },
  });
  console.log("★",existsUsers)
  if (existsUsers.length) {
    res.status(400).send({
      errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
    });
    return;
  }
  const password = CryptoJS.AES.encrypt(pwd, process.env.keyForDecrypt).toString();
  await User.create({ email, nickname, password });
  res.status(201).send({});
});

  module.exports = router;


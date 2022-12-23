const express = require("express");
const CryptoJS = require("crypto-js"); 
const jwt = require("jsonwebtoken");    
const router = express.Router();
const app = express();
require('dotenv').config({path: '../../.env'});


//로그인 POST
const { User } = require("../models");
router.post("/",  async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
      
    });
    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses 
    const existPw = user.password;
    console.log(existPw)
    const decryptedPw = CryptoJS.AES.decrypt(existPw,process.env.keyForDecrypt);
    const originPw = decryptedPw.toString(CryptoJS.enc.Utf8);

    if (originPw != password) {
        res.status(400).send({errorMessage: '닉네임 또는 비밀번호를 확인해주세요'});
        return;
    } else { 
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
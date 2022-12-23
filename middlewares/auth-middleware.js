// middlewares/auth-middleware.js
require('dotenv').config({path: '../../.env'});
const jwt = require("jsonwebtoken");

const { User } = require("../models");

module.exports = (req, res, next) => {
  const token = req.headers.cookie.split('=')[1];
  req.decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  user_id = req.headers.cookie.split('=');

  if (!user_id) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }

  try {
    // 복호화 및 검증
    const { userId } = jwt.verify(user_id[1], process.env.JWT_ACCESS_SECRET);
    console.log(jwt,"##",userId);

    User.findByPk(userId).then((user) => {
      console.log(user);
      req.user = user;
      console.log("this is middleware",user);
      next(); 
    });

  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }

};
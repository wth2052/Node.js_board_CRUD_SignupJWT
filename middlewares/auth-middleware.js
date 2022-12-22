// middlewares/auth-middleware.js
require('dotenv').config({path: '../../.env'});
const env = process.env;
const jwt = require("jsonwebtoken");

const { User } = require("../models");

module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  // console.log(req.headers);
  const token = req.headers.cookie.split('=')[1];
  console.log("규렬 민섭 만세",token)
  req.decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  console.log("규렬 민섭 만세",req.decoded)
  user_id = req.headers.cookie.split('=');
  //user_[1] = 토큰 번호

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

    User.findByPk(userId).then((user) => { // {}오브젝트형태로 담아준다는 뜻
      console.log(user);
      req.user = user;
      console.log("this is middleware",user);
      next(); //다음 미들웨어로 가라
    });
        // {
    //     _id: new ObjectId("63a00e128f4d233303428503"),
    //     email: 'qwe',
    //     nickname: 'qwe',
    //     password: 'qwe',
    //     __v: 0
    //   }
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }

  
      //시크릿키가 일치 안할시 서버가 꺼지게 됨, 그러므로 try catch를 이용해 이 코드들의 에러를 catch해준다.
};
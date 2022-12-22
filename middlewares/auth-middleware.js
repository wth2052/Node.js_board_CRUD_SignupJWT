// middlewares/auth-middleware.js
require('dotenv').config({path: '../../.env'});
const env = process.env;
const jwt = require("jsonwebtoken");

const { User } = require("../models");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
    //헤더에 담긴 데이터를 Authorization이라는 변수에 담아 가져온다
    //  authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2EwMDQ5NTdjZmY1MzJiYTFiYTYxNGIiLCJpYXQiOjE2NzE0MzIzNDJ9.vLnFWe_5M3SvEmzjrDffa9k1tyTKjtNu3rP1Sz9uMdA', 
    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2EwMDQ5NTdjZmY1MzJiYTFiYTYxNGIiLCJpYXQiOjE2NzE0MzI0MzN9.7aDt0HuWWY1r-092zDtcQeLLzpdTGbsao5k6bo305Ro
  const [authType, authToken] = (authorization || "").split(" ");//결과값을 배열로 담아줘.
//띄어쓰기를 기준으로 값을 분할해라, 분할한 값을 두개로 나눠 담아라
    //authType: Bearer
    //authToken: 실제 JWT값이 들어옴
  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }

  try {
    // 복호화 및 검증
    const { userId } = jwt.verify(authToken, "customized-secret-key");
    User.findByPk(userId).then((user) => { // {}오브젝트형태로 담아준다는 뜻
      res.locals.user = user;
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
  res.locals.userId = userId;
  next();
  
      //시크릿키가 일치 안할시 서버가 꺼지게 됨, 그러므로 try catch를 이용해 이 코드들의 에러를 catch해준다.
};
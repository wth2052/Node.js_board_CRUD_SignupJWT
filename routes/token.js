const express = require("express")
const router = express.Router()
const SECRET_KEY = `HangHae99`;
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
async function main() {
    const token = jwt.sign({ myPayloadData: 1234 }, //jwt를 이용해서 payload 설정하는 부분
        SECRET_KEY,
        {       expiresIn: "6h"}
        ); // jwt를 이용해서 암호화를 하기 위한 비밀키
        setTimeout(() =>{
            console.log(token);
    
    
            const decodeToken = jwt.decode(token); // jwt의 Payload를 확인하기 위해서 사용
            console.log(decodeToken) //{ myPayloadData: 1234, iat: 1671419122 }
            
            const verifyToken = jwt.verify(token, SECRET_KEY); // 비밀키가 일치해야함
            console.log(verifyToken); //{ myPayloadData: 1234, iat: 1671419188 } 이 값은 검증되었음을 의미함.
        }, 1500); // 수명이 1s인 jwt에게 1.5초뒤 값을 검증하라고 시키면?
        //TokenExpiredError: jwt expired 오류 출력.
    
    }
    main()

    
let tokenObject = {}; // Refresh Token을 저장할 Object

router.get("/set-token/:id", (req, res) => {
  const id = req.params.id;
  const accessToken = createAccessToken(id);
  //id를 기반으로 서버에 접근을 할때 확인하기 위한 데이터
  const refreshToken = createRefreshToken();
  //인증받은 사용자가 맞는지 검증을 하기위한 토큰을 발급

  tokenObject[refreshToken] = id; // Refresh Token을 가지고 해당 유저의 정보를 서버에 저장합니다.
  res.cookie('accessToken', accessToken); // Access Token을 Cookie에 전달한다.
  res.cookie('refreshToken', refreshToken); // Refresh Token을 Cookie에 전달한다.

  return res.status(200).send({ "message": "Token이 정상적으로 발급되었습니다." });
})

// Access Token을 생성합니다.
function createAccessToken(id) {
  const accessToken = jwt.sign(
    { id: id }, // JWT 데이터
    SECRET_KEY, // 비밀키
    { expiresIn: '30s' }) // Access Token이 10초 뒤에 만료되도록 설정합니다.

  return accessToken; 
}

// Refresh Token을 생성합니다.
function createRefreshToken() {
  const refreshToken = jwt.sign(
    {}, // JWT 데이터
    SECRET_KEY, // 비밀키
    { expiresIn: '7d' }) // Refresh Token이 7일 뒤에 만료되도록 설정합니다.
//길게 설정해도 되는이유 어차피 서버에서 검증해서 사용되기 때문에 길게 해도 무방
// AccessToken을 재발급 하기 위해 사용됨 수명을 무제한으로는 하지 말기.
  return refreshToken;
}


router.get("/get-token", (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  //현재 가지고있는 쿠키를 할당.

  if (!refreshToken) return res.status(400).json({ "message": "Refresh Token이 존재하지 않습니다." });
  if (!accessToken) return res.status(400).json({ "message": "Access Token이 존재하지 않습니다." });

  const isAccessTokenValidate = validateAccessToken(accessToken);
  const isRefreshTokenValidate = validateRefreshToken(refreshToken);
//만료 검증
  if (!isRefreshTokenValidate) return res.status(419).json({ "message": "Refresh Token이 만료되었습니다." });


  //AcccessToken 지정한 아이디 값을 가지고 와서
  //Refresh Token이 인증도 되었고 비밀키도 정상적이고 만료시간도 정상인데 서버에 해당하는 id값이 존재하지 않을 경우
  // = 탈취당했을때 Refresh Token을 서버에서 강제로 만료시킬수 있음.
  // 서버가 고의적으로 해당하는 토큰 자체를 만료시킨다거나
  // 저장소에 가지고 있었던 토큰이 유실되었을때에는
  // 74번째 줄 419를 return하게된다.
  if (!isAccessTokenValidate) {
    const accessTokenId = tokenObject[refreshToken];
    if (!accessTokenId) return res.status(419).json({ "message": "Refresh Token의 정보가 서버에 존재하지 않습니다." });
    
    const newAccessToken = createAccessToken(accessTokenId);
    res.cookie('accessToken', newAccessToken);
    return res.json({ "message": "Access Token을 새롭게 발급하였습니다." });
  }
 
  const { id } = getAccessTokenPayload(accessToken);
	return res.json({ "message": `${id}의 Payload를 가진 Token이 성공적으로 인증되었습니다.` });
})


// Access Token을 검증합니다.
function validateAccessToken(accessToken) {
  try {
    jwt.verify(accessToken, SECRET_KEY); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}
// 검증 통과시 true 실패시 false를 반환
// Refresh Token을 검증합니다.
// 오류 2가지, jwt토큰과 비밀키가 일치하지 않을때, 만료기간이 지나 jwt의 효력이 존재하지 않을때
// 검증 자체가 어떤것을 목적으로 하는지에 대해서도 확인하면 좋음
function validateRefreshToken(refreshToken) {
  try {
    jwt.verify(refreshToken, SECRET_KEY); // JWT를 검증합니다.
    return true;
  } catch (error) {
    return false;
  }
}

// Access Token의 Payload를 가져옵니다.
function getAccessTokenPayload(accessToken) {
  try {
    const payload = jwt.verify(accessToken, SECRET_KEY); // JWT에서 Payload를 가져옵니다.
    return payload;
  } catch (error) {
    return null;
  }
}


module.exports = router;
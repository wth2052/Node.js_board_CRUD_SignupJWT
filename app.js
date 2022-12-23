//router 가져오기
const connect = require("./schemas/index.js");
connect();
const cors = require("cors")
// CORS(Cross-Origin Resource Sharing)란
// 자신이 속하지 않은 다른 도메인, 다른 프로토콜, 혹은 다른 포트에 있는 리소스를 요청하는 cross-origin HTTP 요청 방식
// https://surprisecomputer.tistory.com/32
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;
const signupRouter = require('./routes/signup');
const commentRouter = require('./routes/comments');
const signinRouter = require('./routes/signin');
const postRouter = require('./routes/posts');
const router = express.Router();
require('dotenv').config({path: '../../.env'});

// requestMiddleWare, 요청 URL과 요청한 시간을 console.log에 띄워준다.
const requestMiddleware = (req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
}
app.use(cookieParser());
app.use(cors());
app.use(express.static("static"))
app.use(express.json());
app.use(requestMiddleware);
app.use('/auth', signupRouter);
app.use('/login', signinRouter);
app.use('/post', postRouter)
app.use('/comment', commentRouter);
app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));


app.listen(port, () => {

  console.log(`%c ________________________________________
 Server is already running on port ${port}
 ----------------------------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`, "font-family:monospace")

});
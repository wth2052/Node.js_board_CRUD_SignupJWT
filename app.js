const express = require('express');
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
app.use(express.static("static"))
app.use(express.json());
app.use(requestMiddleware);
app.use('/signup', signupRouter);
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
const mongoose = require("mongoose")

//몽고디비와 연결
const connect = () => {
  mongoose
    //몽고디비:로컬주소/데이터베이스이름
    .connect("mongodb://127.0.0.1:27017/sparta_board",{ ignoreUndefined: true })
    //만약 에러가 발생을 한다면 -> 에러값을 err에 받아서 console.log로 출력
    .catch(err => console.log(err))
}
//몽구스로 연결 이후 에러가 발생을 한다면
mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err)
})
mongoose.set("strictQuery", true)
module.exports = connect;


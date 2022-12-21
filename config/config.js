require('dotenv').config();
const env = process.env;

const test2 = process.env.ENVTEST;
console.log('test2', test2);

const development = {
  username: env.MYSQL_USERNAME,
  //env.MYSQL_USERNAME은 불러오고자 하는 데이터의 키값이므로 자유롭게 이름설정이 가능하다.
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  };
const production = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  //port: env.MYSQL_PORT
};
  
const test = {
  username: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE_TEST,
  host: env.MYSQL_HOST,
  dialect: "mysql",
  //port: env.MYSQL_PORT
};

  module.exports = { development, production, test };

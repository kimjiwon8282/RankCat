require('dotenv').config();

module.exports = { //네이버 검색광고 api
  accessLicense: process.env.ACCESS_LICENSE,
  secretKey: process.env.SECRET_KEY,
  customerId: process.env.CUSTOMER_ID,
  proxyURL: 'https://cors-anywhere.herokuapp.com/', // 필요에 따라 변경 가능
};

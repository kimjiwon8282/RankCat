require('dotenv').config();

module.exports = {
  accessLicense: process.env.ACCESS_LICENSE,
  secretKey: process.env.SECRET_KEY,
  customerId: process.env.CUSTOMER_ID,
  proxyURL: 'https://cors-anywhere.herokuapp.com/', // 필요에 따라 변경 가능
};

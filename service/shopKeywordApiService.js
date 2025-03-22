// service/shopKeywordApiService.js
const axios = require('axios');
require('dotenv').config();

async function fetchShopKeywordInsight({ startDate, endDate, timeUnit, category, keywords }) {
  // 요청 바디 구성
  const body = {
    startDate: startDate || '2017-08-01',
    endDate: endDate || '2017-09-30',
    timeUnit: timeUnit || 'month',
    // category는 문자열로 전달 (예: "50000000")
    category: category || '50000000',
    // keyword는 객체 배열 형태로 전달
    keyword: keywords || [
      { name: "패션의류/정장", param: ["정장"] },
      { name: "패션의류/비즈니스 캐주얼", param: ["비즈니스 캐주얼"] }
    ],
    device: '',  // 빈 문자열: 모든 기기
    gender: '',
    ages: []
  };

  try {
    const response = await axios.post(
      'https://openapi.naver.com/v1/datalab/shopping/category/keywords',
      body,
      {
        headers: {
          'X-Naver-Client-Id': process.env.CLIENT_ID,
          'X-Naver-Client-Secret': process.env.CLIENT_SECRET,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (err) {
    console.error('Error in fetchShopKeywordInsight:', err.message);
    throw err;
  }
}

module.exports = { fetchShopKeywordInsight };

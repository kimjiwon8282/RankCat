const axios = require('axios');
require('dotenv').config();

async function fetchShoppingInsight({ startDate, endDate, timeUnit }) {
  // API 요청 바디 구성
  const body = {
    startDate: startDate || '2023-01-01',
    endDate: endDate || '2023-03-01',
    timeUnit: timeUnit || 'month',
    category: [
      {
        name: '쌈채소',
        param: ['50002211']  // 실제 쌈채소 카테고리 코드
      }
    ],
    device: '',
    gender: '',   // 성별 조건이 없으면 빈 문자열
    ages: []      // 연령대 조건이 없으면 빈 배열
  };

  try {
    const response = await axios.post(
      'https://openapi.naver.com/v1/datalab/shopping/categories',
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
    console.error('Error in fetchShoppingInsight:', err.message);
    throw err;
  }
}

module.exports = { fetchShoppingInsight };

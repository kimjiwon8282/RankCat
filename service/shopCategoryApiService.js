const axios = require('axios');
require('dotenv').config();

async function fetchShoppingInsight({ startDate, endDate, timeUnit, categoryName, categoryCode }) {
  // API 요청 바디 구성 (categoryName과 categoryCode를 동적으로 사용)
  const body = {
    startDate: startDate || '2023-01-01',
    endDate: endDate || '2023-03-01',
    timeUnit: timeUnit || 'month',
    category: [
      {
        name: categoryName,
        param: [categoryCode ]  
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
    console.error('Error in fetchShoppingInsight: - 쇼핑인사이트 키워드 api호출 오류', err.message);
    throw err;
  }
}

module.exports = { fetchShoppingInsight };

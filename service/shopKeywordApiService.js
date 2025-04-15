const axios = require('axios');
require('dotenv').config();

async function fetchShopKeywordInsight({ startDate, endDate, timeUnit, category, keywords }) {
  // 기본 테스트용 요청 바디 구성: 시작일, 종료일, timeUnit, 카테고리(쌈채소: "50002211") 및 키워드
  const body = {
    startDate: startDate || '2025-03-01',
    endDate: endDate || '2025-04-10',
    timeUnit: timeUnit || 'month',
    category: category || '50002211',
    keyword: keywords || [
      { name: "채소/쌈채소", param: ["쌈채소"] },
      { name: "채소/샐러드야채", param: ["샐러드야채"] },
      { name: "채소/바질키우기", param: ["바질키우기"] },
      { name: "채소/샐러드채소", param: ["샐러드채소"] },
      { name: "채소/쌈야채", param: ["쌈야채"] }
    ],   
    device: '',   // 모든 기기를 포함
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

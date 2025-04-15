const express = require('express');
const router = express.Router();
const { fetchShopKeywordInsight } = require('../service/shopKeywordApiService');

router.get('/keyword', (req, res) => {
  res.render('insightKeyword', { data: null, error: null });
});

router.post('/keyword', async (req, res) => {
  try {
    // 폼에서 전달된 값: startDate, endDate, timeUnit, category, keywords
    const { startDate, endDate, timeUnit, category,keywords } = req.body;
    // 기본 테스트용으로, 만약 category가 없으면 "쌈채소"의 카테고리번호 "50002211"을 사용
    // const selectedCategory = category || '50002211';
    // // 키워드가 없으면 기본값으로 "쌈채소" 관련 키워드를 사용 (예: name, param 값 모두 "쌈채소")
    // const keywords = req.body.keywords || [
    //   { name: "채소/쌈채소", param: ["쌈채소"] }
    // ];

    const data = await fetchShopKeywordInsight({ startDate, endDate, timeUnit, category, keywords });
    res.render('insightKeywordResults', { data, error: null });
  } catch (error) {
    console.error('[POST /insight/keyword] Error:', error.message);
    res.render('insightKeyword', { data: null, error: 'API 호출 중 오류가 발생했습니다.' });
  }
});

module.exports = router;

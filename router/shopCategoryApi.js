const express = require('express');
const router = express.Router();
const { fetchShoppingInsight } = require('../service/shopCategoryApiService');

// 쇼핑인사이트 API 테스트용 폼 렌더링
router.get('/category', (req, res) => {
  res.render('insightCategory', { data: null, error: null });
});

// 폼 제출 시 API 호출
router.post('/category', async (req, res) => {
  try {
    const { startDate, endDate, timeUnit } = req.body;
    const data = await fetchShoppingInsight({ startDate, endDate, timeUnit });
    res.render('insightCategoryResults', { data, error: null });
  } catch (error) {
    console.error('[POST /insight/category] Error:', error.message);
    res.render('insightCategory', { data: null, error: 'API 호출 중 오류가 발생했습니다.' });
  }
});

module.exports = router;

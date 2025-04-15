const express = require('express');
const router = express.Router();
const { fetchShoppingInsight } = require('../service/shopCategoryApiService');
const path = require('path');
const fs = require('fs');

// 쇼핑인사이트 API 테스트용 폼 렌더링
router.get('/category', (req, res) => {
  res.render('insightCategory', { data: null, error: null });
});

router.post('/category', async (req, res) => {
  try {
    const { startDate, endDate, timeUnit, categoryName, categoryCode } = req.body;
    if (!categoryName || !categoryCode) {
      throw new Error("카테고리 정보가 누락되었습니다.");
    }
    const data = await fetchShoppingInsight({ startDate, endDate, timeUnit, categoryName, categoryCode });
    res.render('insightCategoryResults', { data, error: null });
  } catch (error) {
    console.error('[POST /insight/category] Error:', error.message);
    res.render('insightCategory', { data: null, error: 'API 호출 중 오류가 발생했습니다.' });
  }
});

router.get('/category-data', (req, res) => {
  const jsonPath = path.join(__dirname, '../public/files/categoryData.json');
  fs.readFile(jsonPath, 'utf-8', (err, data) => {
    if (err) {
      console.error('JSON 파일 읽기 오류:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        res.status(500).json({ error: 'JSON 파싱 오류' });
      }
    }
  });
});


module.exports = router;

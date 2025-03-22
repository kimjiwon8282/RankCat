const express = require('express');
const router = express.Router();
const {fetchShopKeywordInsight} = require('../service/shopKeywordApiService');

router.get('/keyword',(req,res)=>{
    res.render('insightKeyword', { data: null, error: null });
});

router.post('/keyword',async(req,res)=>{
    try {
        // 폼에서 전달된 값: startDate, endDate, timeUnit, category, (옵션으로 keywords)
        const { startDate, endDate, timeUnit, category } = req.body;
        // 폼에 키워드 항목이 있다면 req.body.keywords를 사용하고, 없으면 기본값 사용
        const keywords = req.body.keywords; 
        const data = await fetchShopKeywordInsight({ startDate, endDate, timeUnit, category, keywords });
        res.render('insightKeywordResults', { data, error: null });
      }catch(error){
        console.error('[POST /insight/keyword] Error',erroer.message);
        res.render('insightKeyword', { data: null, error: 'API 호출 중 오류가 발생했습니다.' });
    }
});

module.exports = router;
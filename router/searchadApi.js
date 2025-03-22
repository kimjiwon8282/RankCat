const express = require('express');
const router = express.Router();
const { fetchKeyword } = require('../service/searchApiService');

// 메인 화면(검색 폼) GET
router.get('/keyword', (req, res) => {
  // 에러 메시지 등을 전달할 수도 있음. 지금은 단순 렌더만
  res.render('searchKeyword', { error: null });
});

// 검색 폼 제출 (POST) -> 결과 페이지 렌더링링
router.post('/keyword', async (req, res) => {
  const { keyword } = req.body;

  if (!keyword) {
    return res.render('searchKeyword', { error: '키워드를 입력하세요.' });
  }

  try {
    // 네이버 검색 광고 API 호출
    const data = await fetchKeyword(keyword);

    // views/results.ejs 렌더링
    // data.keywordList를 EJS에서 사용할 수 있도록 넘겨줌
    res.render('keywordResults', {
      keywordList: data.keywordList || [],
      error: null,
    });
  } catch (error) {
    console.error('[POST /keyword] Error:', error.message);
    // 에러 시 index.ejs로 돌아가서 에러 메시지 표시
    res.render('searchKeyword', { error: '서버 에러 발생. 콘솔 로그를 확인하세요.' });
  }
});

module.exports = router;

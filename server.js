// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// EJS 템플릿 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 폼 데이터 파싱 (POST body)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 필요하다면 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));

const keywordRouter = require('./router/searchadApi');
const InsightCategoryRouter = require('./router/shopCategoryApi');
const InsightKeywordRouter = require('./router/shopKeywordApi')

// 홈 라우트 추가
app.get('/', (req, res) => {
  res.render('home', { error: null });
});

app.use('/', keywordRouter);
app.use('/insight',InsightCategoryRouter); // 쇼핑인사이트 카테고리 관련 라우터는 /insight 경로에 매핑
app.use('/insight',InsightKeywordRouter); // 쇼핑 인사이트 키워드 관련 라우터는 /insight경로에 매핑핑

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

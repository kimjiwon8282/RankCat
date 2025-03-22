const crypto = require('crypto');
const fetch = require('node-fetch');
const { accessLicense, secretKey, customerId } = require('../config/api'); // proxyURL 제거

function createSignature(secretKey, timestamp, method, apiUrl) {
  const message = `${timestamp}.${method}.${apiUrl}`;
  return crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('base64');
}

async function fetchKeyword(keywords) {
  try {
    const method = 'GET';
    const apiUrl = '/keywordstool';
    const timestamp = Date.now().toString();

    // 시그니처 생성
    const signature = createSignature(secretKey, timestamp, method, apiUrl);

    // 프록시 없이 직접 호출 (proxyURL 제거)
    const requestUrl = `https://api.naver.com/keywordstool?hintKeywords=${encodeURIComponent(
      keywords
    )}&showDetail=1`;

    const response = await fetch(requestUrl, {
      method,
      headers: {
        'X-Timestamp': timestamp,
        'X-API-KEY': accessLicense,
        'X-CUSTOMER': customerId,
        'X-Signature': signature,
        // 서버 사이드 호출에서는 Origin, X-Requested-With 헤더는 필요 없을 수 있음.
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[fetchKeyword] Error Response: ${errorText}`);
      throw new Error(`네이버 API 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response Data:", data); // 응답 데이터 확인
    return data;
  } catch (error) {
    console.error('[fetchKeyword] Error:', error.message);
    throw error;
  }
}

module.exports = {
  fetchKeyword,
};

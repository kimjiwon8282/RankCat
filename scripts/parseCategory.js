// scripts/parseCategory.js
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// 1) XLS 파일 경로 지정
const xlsFilePath = path.join(__dirname, '../public/files/category_file.xls');
// 2) JSON 결과를 저장할 경로
const jsonFilePath = path.join(__dirname, '../public/files/categoryData.json');

try {
  // 3) XLS 파일 읽기
  const workbook = XLSX.readFile(xlsFilePath);
  // 4) 첫 번째 시트만 사용한다고 가정
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // 5) 시트 내용을 JSON으로 변환
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  // 6) JSON 파일로 저장
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');
  console.log(`XLS -> JSON 변환 완료: ${jsonFilePath}`);
} catch (error) {
  console.error('XLS 파싱 에러:', error.message);
}

let categoryData = [];

// 검색 버튼, 입력 필드 참조
const categorySearchInput = document.getElementById('categorySearch');
const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', () => {
  const rawInput = categorySearchInput.value;
  const searchTerm = rawInput.replace(/\s+/g, '');
  if (!searchTerm) return;
  searchCategory(searchTerm);
});

function searchCategory(searchTerm) {
  // 1) 카테고리 데이터에서 검색어가 포함된 항목 찾기
  //    (여기서는 예시로 "포함"을 기준으로 함. 정확 일치로 바꾸려면 includes -> ===로 수정)
  const matched = categoryData.find(item =>
    (item.세분류 && item.세분류 === searchTerm) ||
    (item.소분류 && item.소분류 === searchTerm) ||
    (item.중분류 && item.중분류 === searchTerm) ||
    (item.대분류 && item.대분류 === searchTerm)
  );
  
  if (!matched) {
    alert(`"${searchTerm}"에 해당하는 카테고리를 찾을 수 없습니다.`);
    return;
  }
  
  // 2) 대/중/소/세 분류 값 설정
  //    - 먼저 대분류 드롭다운을 설정 후 populateMidCategory 호출
  largeCategorySelect.value = matched.대분류 || '';
  populateMidCategory(matched.대분류);

  // 중분류 설정 후 populateSmallCategory 호출
  midCategorySelect.value = matched.중분류 || '';
  if (matched.중분류) {
    populateSmallCategory(matched.대분류, matched.중분류);
  }

  // 소분류 설정 후 populateSubCategory 호출
  if (matched.소분류) {
    smallCategorySelect.value = matched.소분류;
    populateSubCategory(matched.대분류, matched.중분류, matched.소분류);
  }

  // 세분류가 있으면 설정
  if (matched.세분류) {
    subCategorySelect.value = matched.세분류;
  }
  
  // 3) 카테고리번호, 카테고리명 설정
  //    - 세분류가 있으면 matched.세분류, 없으면 소분류 or 중분류를 넣도록 판단
  categoryCodeInput.value = matched.카테고리번호;
  if (matched.세분류) {
    categoryNameInput.value = matched.세분류;
  } else if (matched.소분류) {
    categoryNameInput.value = matched.소분류;
  } else if (matched.중분류) {
    categoryNameInput.value = matched.중분류;
  } else {
    categoryNameInput.value = matched.대분류;
  }
  
  // 검색 결과로 자동으로 드롭다운이 세팅됨
}


// 서버에서 미리 파싱된 JSON 데이터를 로드합니다.
async function loadCategoryData() {
  try {
    const response = await fetch('/insight/category-data');
    categoryData = await response.json();
    populateLargeCategory();
  } catch (error) {
    console.error('카테고리 데이터 로드 에러:', error);
  }
}

// HTML 요소 참조
const largeCategorySelect = document.getElementById('largeCategory');
const midCategorySelect = document.getElementById('midCategory');
const smallCategorySelect = document.getElementById('smallCategory');
const subCategorySelect = document.getElementById('subCategory');
const categoryCodeInput = document.getElementById('categoryCode');
const categoryNameInput = document.getElementById('categoryName');

// 대분류 목록 채우기
function populateLargeCategory() {
  const largeSet = [...new Set(categoryData.map(item => item.대분류))];
  largeSet.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    largeCategorySelect.appendChild(option);
  });
}

// 중분류 목록 채우기
function populateMidCategory(selectedLarge) {
  midCategorySelect.innerHTML = '<option value="">선택하세요</option>';
  smallCategorySelect.innerHTML = '<option value="">선택하세요</option>';
  subCategorySelect.innerHTML = '<option value="">선택하세요</option>';
  const filtered = categoryData.filter(item => item.대분류 === selectedLarge);
  const midSet = [...new Set(filtered.map(item => item.중분류))];
  midSet.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    midCategorySelect.appendChild(option);
  });
}

// 소분류 목록 채우기
function populateSmallCategory(selectedLarge, selectedMid) {
  smallCategorySelect.innerHTML = '<option value="">선택하세요</option>';
  subCategorySelect.innerHTML = '<option value="">선택하세요</option>';
  const filtered = categoryData.filter(item =>
    item.대분류 === selectedLarge && item.중분류 === selectedMid
  );
  const smallSet = [...new Set(filtered.map(item => item.소분류).filter(v => v))];
  smallSet.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    smallCategorySelect.appendChild(option);
  });
  
  // 소분류가 없는 경우: 바로 카테고리번호 결정
  if (smallSet.length === 0) {
    const matched = categoryData.find(item =>
      item.대분류 === selectedLarge && item.중분류 === selectedMid
    );
    if (matched) {
      categoryCodeInput.value = matched.카테고리번호;
      categoryNameInput.value = matched.중분류;
    }
  }
}

// 세분류 목록 채우기 (있는 경우)
function populateSubCategory(selectedLarge, selectedMid, selectedSmall) {
  subCategorySelect.innerHTML = '<option value="">선택하세요</option>';
  const filtered = categoryData.filter(item =>
    item.대분류 === selectedLarge &&
    item.중분류 === selectedMid &&
    item.소분류 === selectedSmall &&
    item.세분류 && item.세분류.trim() !== ''
  );
  const subSet = [...new Set(filtered.map(item => item.세분류))];
  subSet.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    subCategorySelect.appendChild(option);
  });
  
  // 세분류 옵션이 없는 경우: 바로 카테고리번호 결정
  if (subSet.length === 0) {
    const matched = categoryData.find(item =>
      item.대분류 === selectedLarge &&
      item.중분류 === selectedMid &&
      item.소분류 === selectedSmall
    );
    if (matched) {
      categoryCodeInput.value = matched.카테고리번호;
      categoryNameInput.value = matched.소분류;
    }
  }
}

// 이벤트 리스너 등록
largeCategorySelect.addEventListener('change', (e) => {
  const selectedLarge = e.target.value;
  if (selectedLarge) {
    populateMidCategory(selectedLarge);
  }
  categoryCodeInput.value = '';
  categoryNameInput.value = '';
});

midCategorySelect.addEventListener('change', (e) => {
  const selectedLarge = largeCategorySelect.value;
  const selectedMid = e.target.value;
  if (selectedMid) {
    populateSmallCategory(selectedLarge, selectedMid);
  }
  if (smallCategorySelect.options.length <= 1) {
    const matched = categoryData.find(item =>
      item.대분류 === selectedLarge && item.중분류 === selectedMid
    );
    if (matched) {
      categoryCodeInput.value = matched.카테고리번호;
      categoryNameInput.value = matched.중분류;
    }
  } else {
    categoryCodeInput.value = '';
    categoryNameInput.value = '';
  }
});

smallCategorySelect.addEventListener('change', (e) => {
  const selectedLarge = largeCategorySelect.value;
  const selectedMid = midCategorySelect.value;
  const selectedSmall = e.target.value;
  // 소분류 선택 후, 세분류 목록을 채웁니다.
  populateSubCategory(selectedLarge, selectedMid, selectedSmall);
  // 만약 세분류 드롭다운에 옵션이 없으면, 바로 카테고리번호 설정
  if (subCategorySelect.options.length <= 1) {
    const matched = categoryData.find(item =>
      item.대분류 === selectedLarge &&
      item.중분류 === selectedMid &&
      item.소분류 === selectedSmall
    );
    if (matched) {
      categoryCodeInput.value = matched.카테고리번호;
      categoryNameInput.value = matched.소분류;
    }
  } else {
    categoryCodeInput.value = '';
    categoryNameInput.value = '';
  }
});

subCategorySelect.addEventListener('change', (e) => {
  const selectedLarge = largeCategorySelect.value;
  const selectedMid = midCategorySelect.value;
  const selectedSmall = smallCategorySelect.value;
  const selectedSub = e.target.value;
  const matched = categoryData.find(item =>
    item.대분류 === selectedLarge &&
    item.중분류 === selectedMid &&
    item.소분류 === selectedSmall &&
    item.세분류 === selectedSub
  );
  if (matched) {
    categoryCodeInput.value = matched.카테고리번호;
    categoryNameInput.value = matched.세분류;
  }
});

// 조회 기간 및 시간 단위 관련 기존 코드 (변경 없음)
function formatDate(date) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}

function updateDates() {
  const period = document.getElementById('period').value;
  const today = new Date();
  let startDate;
  switch (period) {
    case '1month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      break;
    case '3months':
      startDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
      break;
    case '6months':
      startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
      break;
    case '1year':
      startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      break;
    default:
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  }
  document.getElementById('startDate').value = formatDate(startDate);
  document.getElementById('endDate').value = formatDate(today);
}

document.getElementById('period').addEventListener('change', updateDates);
updateDates();

// 초기 로드 시 카테고리 데이터 가져오기
loadCategoryData();

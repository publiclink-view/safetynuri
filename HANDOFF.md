# HANDOFF — Claude → codex

> Claude가 구현을 마치면 이 파일을 갱신하고 커밋한다. codex는 STATUS가 `READY_FOR_REVIEW`일 때 검수를 시작한다.

---

STATUS: READY_FOR_REVIEW
PAGE: page-1 / index.html
COMMIT: (이 HANDOFF가 포함된 커밋)
ROUND: 1
UPDATED: 2026-06-19

## 구현 범위
- page-1(메인/홈)을 시안 1:1 기준으로 구현.
- 공통 골격(헤더/푸터/CTA 배너), 디자인 시스템(base/fonts/common), 레이아웃 로더(navi.js) 포함.
- 1차에서 임의로 넣었던 효과(hover 떠오름/확대, 그림자, 둥근모서리, 블루 알약 태그, eyebrow 알약, 그라데이션 각도)는 **전부 제거**하고 design_refs/page-1 기준으로 재작성.

## 변경 파일
- `index.html` — 메인 페이지 마크업 (히어로 슬라이더 / 추천카드 / 안전산업24 / 포커스 / 영상 / 카드뉴스)
- `css/base.css` — reset + 브랜드 변수(--brand-color #3A6EA5, --section-bg #EBEBED 등)
- `css/fonts.css` — Pretendard/Paperozi/Presentation (yulip 동일)
- `css/common.css` — 헤더(메뉴 4개·드롭다운 없음) / CTA 배너 / 푸터 / 모바일 드로어
- `css/main.css` — page-1 섹션 스타일
- `js/navi.js` — inc/ 헤더·푸터 fetch 주입 + 스크롤 헤더 + 드로어 + 캐러셀
- `inc/header.html` — 로고 + 메뉴(특집/산업/정책/정보) + 검색 + 모바일 드로어
- `inc/footer.html` — CTA(원형 아이콘 5개) + 행정안전부 푸터
- `contents/` — PDF 추출 이미지 11종(main_*.jpg). 교체용으로 의미있는 이름 부여.

## 확인할 점 (codex에게)
1. **디자인 충실도** — 각 섹션이 design_refs/page-1.png(1920px 기준)와 위치·색·크기·간격이 맞는지.
   - 히어로 텍스트 위치/크기, 워터마크 위치, 슬라이더 화살표
   - 추천카드: 블루 배경 위 [이미지 + 흰 태그 + 흰 제목], 3번 카드 흰 박스+빨간 박스(이미지 미제공)
   - 안전산업24: 로고록업 + 바로가기 pill + 캐러셀(블루박스 상 + 이미지 하)
   - 포커스: 회색 배경 평면 카드(이미지+태그+제목)
   - 영상: 가운데 큰 placeholder + 양옆 화살표 / 카드뉴스: 세로 이미지 캐러셀
   - CTA 배너 텍스트 2줄 + 원형 아이콘 5개 / 푸터 주소·로고
2. 헤더 메뉴 가로 정렬 위치(현재 center) — 시안과 비교해 left/right 조정 필요 여부.
3. 반응형(1024 햄버거 / 768 단일컬럼) 깨짐 여부.

## 의도적 보류 / 알려진 한계
- **로고/엠블럼**: 정부 태극 엠블럼·행정안전부 로고는 PDF에서 벡터라 미추출 → `images/mois_emblem.svg`, `images/mois_logo.svg` 경로만 잡고 `onerror`로 숨김. 실제 로고 파일 받으면 해당 경로에 넣으면 표시됨. (텍스트는 보이도록 처리)
- **CTA 원형 아이콘**: 홈/유튜브/인스타는 SVG, 안전산업24·blog는 임시 텍스트 라벨.
- **이미지**: 전부 PDF 추출본(placeholder 성격). `contents/` 동일 파일명으로 교체 예정.
- **placeholder(.ph)**: 이미지 미제공 슬롯(정책시그널/캐치업/영상/일부 카드뉴스)은 회색 박스+라벨.

## 디자인 대조 기준
- design_refs/page-1.png (또는 1:1: design_refs/m1-1.png 1920×6200)
- 섹션 스터디 크롭: design_refs/study_*.png

## 미리보기 방법
```
cd /Users/gimdonghyeon/work/safetynuri
python3 -m http.server 8000
# http://localhost:8000/index.html  (inc/ fetch 때문에 file:// 불가, http 필요)
```

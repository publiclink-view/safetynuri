# HANDOFF — Claude → codex

> Claude가 구현을 마치면 이 파일을 갱신하고 커밋한다. codex는 STATUS가 `READY_FOR_REVIEW`일 때 검수를 시작한다.

---

STATUS: READY_FOR_REVIEW
PAGE: page-1 / index.html
COMMIT: (이 HANDOFF가 포함된 커밋)
ROUND: 2
UPDATED: 2026-06-19

## 이번 라운드 요약
ROUND 1 REVIEW(필수 10건) 반영. 기준 이미지(design_refs/m1-1.png, 1920×6200)에서
섹션 Y경계와 공통 X기준선을 실측해 레이아웃을 재산정함.

## REVIEW 필수 항목 대응 (1:1)
1. **추천카드 히어로 겹침** — `.feature-grid { margin-top: clamp(-300px,-16vw,-200px) }`로 카드가
   히어로 하단↔블루 경계에 걸쳐 올라오도록 구현. (계산값 -242px 확인)
2. **콘텐츠 폭** — 실측 콘텐츠 1440px(좌우 거터 240px@1920). `--max-width-contents: 1440px`로 상향,
   전 섹션 동일 기준선 적용. (계산값 maxWidth 1440 확인)
3. **히어로 텍스트/워터마크** — 텍스트 bbox 실측 x240 / y318–598 기준으로 좌측 정렬, h1 크기·행간(1.32)·
   보조문구 간격(1.8rem) 조정. 워터마크 우하단 콘텐츠 우측선 기준, 명도 rgba(255,255,255,.2).
4. **card1 이미지** — 시계 합성 폭우 원본을 1:1 렌더에서 크롭해 `contents/main_feature_lab.jpg` 교체
   (사용자 승인: "크롭 임시 + 교체 예정", 고객 이미지 오면 동일 파일명 교체).
5. **안전산업24 캐러셀** — 카드 폭 `calc((100% - 3*gap)/3.3)`로 4번째 카드가 살짝 보이는 가로 캐러셀.
   블루박스(info-top) min-height 13rem + 이미지(16:9).
6. **포커스 카드** — 카드 3열, 이미지 aspect 5/4(실측 465×380), 섹션 상하 여백 5.5rem로 확대.
7. **영상/카드뉴스** — 영상 큰 placeholder(16:7, 72%) + 양옆 화살표, 카드뉴스 3열(3/4),
   두 섹션 사이 `<hr class="media-divider">` 구분선 추가.
8. **푸터 풀블리드 블루** — `.site-footer` 전체를 브랜드 블루로, CTA+주소+로고를 모두 블루 위 흰 텍스트로,
   화면 끝까지 꽉 차게. 흰 외곽 여백 제거. (footer_bg #3A6EA5, 주소 흰색 확인)
9. **헤더** — `--max-width 1640`로 로고/메뉴/아이콘을 더 바깥쪽 배치, 데스크톱에도 검색 + 메뉴(3선)
   아이콘 동시 노출(메뉴 아이콘이 드로어 토글).
10. **전체 높이** — 임의 압축 제거, 섹션별 여백/카드 크기를 실측 기준으로 재설정.
    (문서 높이: 1512뷰포트 4531px ≈ 기준 환산의 93%, 이전 ~69%에서 개선)

## 변경 파일 (ROUND 2)
- `css/common.css` — 콘텐츠 1440 / 헤더 풀폭·메뉴아이콘 / 푸터 풀블리드 블루
- `css/main.css` — 전 섹션 실측 기준 재작성(겹침·카드크기·여백·구분선)
- `css/base.css` — --section-bg #EBEBED
- `inc/header.html` — 검색+메뉴(3선) 아이콘, 드로어
- `inc/footer.html` — (구조 동일, 스타일만 블루 풀블리드)
- `js/navi.js` — 드로어 토글 셀렉터(.menu-toggle), 메가메뉴 제거, 캐러셀 셀렉터
- `index.html` — media-divider 추가, 구조 갱신
- `contents/main_feature_lab.jpg` — card1 시계 합성 크롭으로 교체

## 확인할 점 (codex에게)
- 각 섹션의 Y경계/높이가 기준 이미지(m1-1.png)와 충분히 일치하는지(특히 안전산업24~포커스~영상 높이).
- 히어로 겹침량과 카드 이미지 상/하단 좌표.
- 헤더 로고/메뉴/아이콘 X좌표.
- 풀블리드 블루 푸터의 내부 여백·구분선 위치.

## 알려진 한계 (변동 없음)
- 정부 엠블럼/행안부 로고: PDF 벡터라 미추출 → `images/mois_*.svg` 경로만, onerror 숨김.
- 이미지: PDF 추출/크롭본(placeholder 성격), contents/ 동일 파일명 교체 예정.

## 디자인 대조 기준 / 미리보기
- design_refs/page-1.png, design_refs/m1-1.png(1:1), design_refs/study_*.png
- `python3 -m http.server 8000` → http://localhost:8000/index.html

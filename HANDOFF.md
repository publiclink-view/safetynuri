# 다음 세션 인수인계

UPDATED: 2026-06-20

BRANCH: `main`

BASE COMMIT: `951b1b2`

NEXT: 헤더 가운데 메뉴의 중앙 정렬 방식부터 재검토

## 다음 세션 시작 지점

헤더 작업부터 이어간다. 첫 작업은 가운데 대메뉴(`특집·산업·정책·정보`)의 중앙 정렬 방식 재검토다.

현재 헤더 상태:

- 공통 헤더는 `inc/header.html`, 스타일은 `css/common.css`, 동작은 `js/common.js`
- 대메뉴 4개와 서브메뉴 12개가 입력되어 있음
- 대메뉴 영역에 호버·키보드 포커스하면 헤더 아래 전체 배경판이 펼쳐짐
- 배경판은 헤더와 같은 `#000b12`, 상단 border 없음, 높이는 약 `12.5rem`
- 서브메뉴 시작점은 각 대메뉴의 시작점과 일치하도록 배치
- 펼침 영역에서 대메뉴 제목은 반복 노출하지 않음
- 산업 메뉴 2개는 `이 제품, 이 기술➊/➋` 뒤에 `<br>` 적용
- 참고한 동작·정렬 방식: `https://publiclink-view.github.io/snbizplaza/`
- 모바일은 햄버거 버튼으로 전체 메뉴를 여는 구조

다음 세션에서는 먼저 `git status --short`를 확인하고, 현재 변경사항을 보존한 채 `inc/header.html`과 `css/common.css` 위주로 작업한다.

## 현재 구현 상태

- `index.html` 메인 페이지 구현 완료
- 1920px 기준 전체 높이 6200px 확인
- 390px 모바일에서 가로 넘침과 깨진 이미지 없음
- 히어로 2개 슬라이드와 좌우 이동 기능 구현
- 안전산업24 캐러셀은 3개 카드와 네 번째 카드 일부가 보이는 구조
- 안전산업24 하단 15% 그라데이션과 하단 경계선 적용
- 기본 폰트는 기존 `css/fonts.css`의 Pretendard 사용
- CSS 치수는 주로 `rem`, 경계선과 미디어쿼리 기준은 `px` 사용

## 현재 구조

```text
css/
├── fonts.css      # 제공받은 폰트 선언, Pretendard 기본
├── base.css       # 변수, reset, 전역 타이포그래피
├── common.css     # 헤더, 푸터, 공통 요소
└── main.css       # 메인 페이지 전용
contents/          # 호별·시기별로 교체되는 콘텐츠 이미지
images/            # 로고, 아이콘, 공통 배경 등 기본 디자인 자산
js/
└── main.js        # 히어로와 캐러셀 동작
index.html
```

`images/`는 현재 빈 폴더이며 `.gitkeep`으로 유지한다. 콘텐츠 이미지는 모두 `contents/`에서 불러온다.

## 다음 세션 1: 헤더·푸터 분리

현재 `index.html` 안에 있는 아래 영역을 공통 파일로 분리한다.

- `<header class="site-header">` → `inc/header.html`
- `<footer class="site-footer">` → `inc/footer.html`

분리 후 확인할 사항:

1. 정적 HTML 환경에서 공통 파일을 불러오는 방식을 먼저 결정한다.
2. 서브페이지를 루트에 두면 CSS·JS·이미지 경로를 일관되게 유지하기 쉽다.
3. 공통 동작이 추가되면 `js/common.js`를 만들고, 메인 전용 동작은 `js/main.js`에 남긴다.
4. 헤더와 푸터 스타일은 계속 `css/common.css`에서 관리한다.
5. 분리 전후 1920px·모바일 렌더가 동일한지 확인한다.

정적 서버 실행 예시:

```bash
python3 -m http.server 4173
```

## 다음 세션 2: 서브페이지 구현

| PDF | 구현 파일 | 내용 |
|---|---|---|
| page-2 | `feature-storm.html` | 특집 1: 극한 폭우 시나리오 |
| page-3 | `feature-solution.html` | 특집 2: 호우 대응 기술 |
| page-4 | `interview.html` | 전문가 대담·인터뷰 |
| page-5 | `insight.html` | 통계 인포그래픽 |
| page-6 | `news.html` | 재난안전산업 뉴스 |

첫 서브페이지를 만들 때 `css/sub.css`를 추가한다. 공통 상세 레이아웃은 `sub.css`에 두고, 특정 페이지에만 필요한 스타일은 페이지명 주석 아래에 모은다.

서브페이지 작업 순서:

1. `design_refs/page-2.png`와 원본 PDF를 기준으로 공통 상세 레이아웃을 정의한다.
2. 분리한 헤더·푸터를 연결한다.
3. 1920px 데스크톱을 먼저 맞춘다.
4. 실제 브라우저 렌더를 기준 이미지와 비교한다.
5. 데스크톱 확정 후 태블릿·모바일 반응형을 적용한다.
6. 한 페이지를 검수·커밋한 뒤 다음 페이지로 이동한다.

## 유지해야 할 디자인 기준

- 원본 PDF와 `design_refs/page-*.png`가 최우선 기준
- 메인 기준 이미지는 `design_refs/m1-1.png` (`1920 × 6200`)
- 콘텐츠 최대 폭은 `90rem`이며 1920px에서 좌우 여백은 각각 `15rem`
- 읽기 쉬운 일반 CSS와 `rem` 단위를 우선 사용
- `css/fonts.css`는 교체하거나 재작성하지 않음
- JavaScript에서 시각 스타일을 직접 지정하지 않음
- 콘텐츠 이미지는 `contents/`, 공통 디자인 자산은 `images/`에 저장

## Git 주의사항

다음 세션 시작 시 `git status --short`를 먼저 확인하고, 작업한 파일만 선별해 스테이징한다.

최근 완료 커밋:

- `af58b5e` — 메인 웹진 페이지 재구현
- `a8dd79a` — 이미지 자산 폴더 구조 정리

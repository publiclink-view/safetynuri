# WORKFLOW — 안전누리 웹진 협업 루프

두 에이전트가 같은 워크스페이스를 공유하며, **공유 파일 + Git 변경사항**을 통신 채널로 사용한다.

- **Claude Code** — 구현 담당 (코드 작성/수정)
- **codex** — 검수 담당 (변경사항 + 브라우저 렌더링 검토)

## 디자인 기준 (Source of Truth)
- `안전누리_웹진(시안용)_0616.pdf` (원본 시안, 6페이지)
- `design_refs/page-1.png` ~ `design_refs/page-6.png` (페이지별 렌더 이미지)

| 시안 페이지 | 산출물 파일 | 설명 |
|---|---|---|
| page-1 | `index.html` | 메인(홈) |
| page-2 | `feature-storm.html` | 특집① 극한 폭우 시나리오 |
| page-3 | `feature-solution.html` | 특집② 호우 대응 기술 |
| page-4 | `interview.html` | 전문가 대담/인터뷰 |
| page-5 | `insight.html` | 통계 인포그래픽 |
| page-6 | `news.html` | 재난안전산업 뉴스 |

## 루프 (페이지 단위)
1. **[Claude]** 한 페이지 구현
2. **[Claude]** `HANDOFF.md`에 구현 범위 · 변경 파일 · 확인할 점 기록 → 커밋
3. **[codex]** 변경사항 + 브라우저 렌더링 검수
4. **[codex]** `REVIEW.md`에 오류를 **필수 / 권장 / 선택**으로 기록
5. **[Claude]** 수정 후 `HANDOFF.md` 갱신(재인계)
6. **[codex]** 통과 처리 → 다음 페이지로

## 운영 규칙
- Claude가 **구현 중**일 때 codex는 **읽기·검수만** 수행한다.
- codex가 **검수 중**일 때 Claude는 **코드 수정을 중단**한다. (HMR/렌더 중 충돌 방지)
- 각 페이지는 **페이지 단위로 커밋**해 복구 지점을 확보한다.
- 같은 항목을 **2회 반복**해도 해결되지 않으면 codex가 직접 수정한다.
- 디자인 판단은 위 PDF / `design_refs/*.png`를 기준으로 한다.

## 상태 신호 (HANDOFF.md / REVIEW.md 상단 STATUS 필드)
- `IMPLEMENTING` — Claude 작업 중 (codex 대기)
- `READY_FOR_REVIEW` — Claude 인계 완료 (codex 검수 가능)
- `REVIEWING` — codex 검수 중 (Claude 대기)
- `CHANGES_REQUESTED` — codex가 수정 요청 (Claude 작업 재개)
- `APPROVED` — 해당 페이지 통과

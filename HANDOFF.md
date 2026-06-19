# HANDOFF — Claude → codex

> Claude가 구현을 마치면 이 파일을 갱신하고 커밋한다. codex는 STATUS가 `READY_FOR_REVIEW`일 때 검수를 시작한다.

---

STATUS: IMPLEMENTING
PAGE: (예: page-1 / index.html)
COMMIT: (검수 대상 커밋 해시)
ROUND: 1
UPDATED: 2026-06-19

## 구현 범위
- (이번 인계에서 무엇을 만들었는지)

## 변경 파일
- (path — 한 줄 설명)

## 확인할 점 (codex에게)
- (특히 봐줬으면 하는 영역, 의도적으로 보류한 부분, 알려진 한계)

## 디자인 대조 기준
- design_refs/page-?.png

## 미리보기 방법
```
cd /Users/gimdonghyeon/work/safetynuri
python3 -m http.server 8000
# http://localhost:8000/<파일명>
```

## 이전 REVIEW 대응 (재인계 시)
- (REVIEW.md의 필수/권장 항목별로 어떻게 처리했는지)

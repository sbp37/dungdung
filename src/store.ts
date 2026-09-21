export type ThoughtKind = 'float' | 'task' | 'worry' | 'junk' | 'memo'

export interface Thought {
  id: string
  text: string
  kind: ThoughtKind
  createdAt: number
  resolvedAt?: number
}

export interface Piece {
  id: string
  fromId: string
  text: string
  done: boolean
  createdAt: number
}

export interface DungState {
  thoughts: Thought[]
  pieces: Piece[]
  crushed: number
  sealed: number
  slain: number
  muted: boolean
}

export const EMPTY: DungState = {
  thoughts: [],
  pieces: [],
  crushed: 0,
  sealed: 0,
  slain: 0,
  muted: false,
}

const KEY = 'dungdung-save-v1'

export function load(): DungState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const s = JSON.parse(raw) as DungState
    return { ...EMPTY, ...s }
  } catch {
    return EMPTY
  }
}

export function save(s: DungState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* 저장 실패해도 앱은 돌아가야 함 */
  }
}

export function uid() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
}

const WORRY_HINTS = [
  '걱정',
  '혹시',
  '어쩌',
  '어떡',
  '불안',
  '망하',
  '실패',
  '까?',
  '려나',
  '이럴',
  '안 되면',
  '까봐',
]
const TASK_HINTS = [
  '해야',
  '하기',
  '사야',
  '사기',
  '보내',
  '연락',
  '예약',
  '결제',
  '제출',
  '정리',
  '청소',
  '준비',
  '만들',
  '운동',
  '쓰기',
  '끝내',
  '확인',
  '세탁',
  '배송',
  '신청',
  '가야',
  '반납',
  '챙겨',
]

// 규칙 기반 첫 추정 — 사용자가 3버튼으로 바로 고칠 수 있음. 정답보다 빠름이 목적.
export function guessKind(text: string): Exclude<ThoughtKind, 'float' | 'memo'> {
  const t = text.toLowerCase()
  if (WORRY_HINTS.some((h) => t.includes(h))) return 'worry'
  if (TASK_HINTS.some((h) => t.includes(h))) return 'task'
  return 'junk'
}

// 며칠 방치됐는지 — 미뤄몬 변신용
export function daysOld(ts: number, now = Date.now()) {
  return Math.floor((now - ts) / 86400000)
}

export function spriteFor(t: Thought): string {
  // 며칠 방치된 미해결 잡념은 미뤄몬으로 살찐다
  if ((t.kind === 'float' || t.kind === 'task') && daysOld(t.createdAt) >= 2) return 'lazy'
  if (t.kind === 'float') {
    const g = guessKind(t.text)
    return g === 'worry' ? 'seer' : g === 'task' ? 'brick' : 'puff'
  }
  return { worry: 'seer', task: 'brick', junk: 'junk', memo: 'memo', float: 'puff' }[t.kind]
}

// 미처치 조각도 하루 넘기면 미뤄몬
export function pieceSprite(p: Piece): string {
  return daysOld(p.createdAt) >= 1 ? 'lazy' : 'spark'
}

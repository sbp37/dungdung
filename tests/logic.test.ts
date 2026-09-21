import { describe, expect, it } from 'vitest'
import { daysOld, guessKind, spriteFor, type Thought } from '../src/store'

describe('guessKind', () => {
  it('추측/걱정 문구는 worry', () => {
    expect(guessKind('발표 망하면 어떡하지')).toBe('worry')
    expect(guessKind('혹시 안 될까봐 걱정')).toBe('worry')
    expect(guessKind('내일 비 오려나')).toBe('worry')
  })

  it('행동 동사 포함은 task', () => {
    expect(guessKind('커피 원두 사야 됨')).toBe('task')
    expect(guessKind('세미나 자료 준비')).toBe('task')
    expect(guessKind('민수한테 연락하기')).toBe('task')
  })

  it('나머지는 junk', () => {
    expect(guessKind('그냥 멍')).toBe('junk')
    expect(guessKind('점심 뭐 먹지')).toBe('junk')
  })
})

describe('spriteFor', () => {
  const base: Thought = { id: 'a', text: 'x', kind: 'task', createdAt: Date.now() }

  it('할일이 하루 지나면 미뤄몬으로', () => {
    expect(spriteFor({ ...base, createdAt: Date.now() - 86400000 * 2 })).toBe('lazy')
    expect(spriteFor(base)).toBe('brick')
  })

  it('float은 추정 결과를 힌트로 씀', () => {
    expect(spriteFor({ ...base, kind: 'float', text: '혹시 망하면' })).toBe('seer')
    expect(spriteFor({ ...base, kind: 'float', text: '밀린 빨래 해야' })).toBe('brick')
    expect(spriteFor({ ...base, kind: 'float', text: '멍' })).toBe('puff')
  })
})

describe('daysOld', () => {
  it('날짜 계산', () => {
    const now = Date.now()
    expect(daysOld(now)).toBe(0)
    expect(daysOld(now - 86400000 * 3, now)).toBe(3)
  })
})

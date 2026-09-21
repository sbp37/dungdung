import { useEffect, useMemo, useState } from 'react'
import { BoxDrawer } from './components/BoxDrawer'
import { Dump } from './components/Dump'
import { JudgeSheet, PieceSheet } from './components/JudgeSheet'
import { Room } from './components/Room'
import { SplitModal } from './components/SplitModal'
import { TodayCard } from './components/TodayCard'
import { Pixel } from './Pixel'
import { setMuted, sfx } from './sound'
import { DungState, EMPTY, Piece, Thought, load, save, uid } from './store'

interface Toast {
  msg: string
  undo?: () => void
}

export default function App() {
  const [state, setState] = useState<DungState>(load)
  const [view, setView] = useState<'room' | 'dump'>(() =>
    load().thoughts.some((t) => !t.resolvedAt) || load().pieces.some((p) => !p.done) ? 'room' : 'dump',
  )
  const [judging, setJudging] = useState<Thought | null>(null)
  const [splitting, setSplitting] = useState<Thought | null>(null)
  const [sparking, setSparking] = useState<Piece | null>(null)
  const [boxOpen, setBoxOpen] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => save(state), [state])
  useEffect(() => setMuted(state.muted), [state.muted])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), toast.undo ? 4200 : 2400)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = (msg: string, undo?: () => void) => setToast({ msg, undo })

  const floats = useMemo(() => state.thoughts.filter((t) => t.kind === 'float'), [state])
  const worries = useMemo(() => state.thoughts.filter((t) => t.kind === 'worry'), [state])
  const memos = useMemo(() => state.thoughts.filter((t) => t.kind === 'memo'), [state])
  const sparks = useMemo(() => state.pieces.filter((p) => !p.done), [state])

  const total = state.thoughts.length + state.pieces.length
  const cleared =
    state.thoughts.filter((t) => t.resolvedAt).length + state.pieces.filter((p) => p.done).length
  const light = total ? Math.round((cleared / total) * 100) : 100

  const addDump = (lines: string[]) => {
    sfx.pop()
    setState((s) => ({
      ...s,
      thoughts: [
        ...s.thoughts,
        ...lines.map((text) => ({ id: uid(), text, kind: 'float' as const, createdAt: Date.now() })),
      ],
    }))
    setView('room')
  }

  const resolveThought = (id: string, kind: 'worry' | 'junk' | 'memo') => {
    const undo = () =>
      setState((s) => ({
        ...s,
        thoughts: s.thoughts.map((t) =>
          t.id === id ? { ...t, kind: 'float' as const, resolvedAt: undefined } : t,
        ),
        sealed: s.sealed - (kind === 'worry' ? 1 : 0),
        crushed: s.crushed - (kind === 'junk' ? 1 : 0),
      }))
    setState((s) => ({
      ...s,
      thoughts: s.thoughts.map((t) => (t.id === id ? { ...t, kind, resolvedAt: Date.now() } : t)),
      sealed: s.sealed + (kind === 'worry' ? 1 : 0),
      crushed: s.crushed + (kind === 'junk' ? 1 : 0),
    }))
    setJudging(null)
    if (kind === 'memo') showToast('기억 상자에 넣어둠.', undo)
    else if (kind === 'junk') showToast('분쇄됨.', undo)
    else showToast('봉인됨. 예언 상자로.', undo)
  }

  const splitThought = (id: string, pieces: string[]) => {
    sfx.pop()
    const ids = pieces.map(() => uid())
    setState((s) => ({
      ...s,
      thoughts: s.thoughts.map((t) =>
        t.id === id ? { ...t, kind: 'task' as const, resolvedAt: Date.now() } : t,
      ),
      pieces: [
        ...s.pieces,
        ...pieces.map((text, i) => ({
          id: ids[i],
          fromId: id,
          text,
          done: false,
          createdAt: Date.now(),
        })),
      ],
    }))
    setSplitting(null)
    showToast('쪼개짐. 번개몬으로 변했다.', () =>
      setState((s) => ({
        ...s,
        thoughts: s.thoughts.map((t) =>
          t.id === id ? { ...t, kind: 'float' as const, resolvedAt: undefined } : t,
        ),
        pieces: s.pieces.filter((p) => !ids.includes(p.id)),
      })),
    )
  }

  const doPiece = (id: string) => {
    setState((s) => ({
      ...s,
      pieces: s.pieces.map((p) => (p.id === id ? { ...p, done: true } : p)),
      slain: s.slain + 1,
    }))
    setSparking(null)
    showToast('처치 완료. 가벼워졌다.', () =>
      setState((s) => ({
        ...s,
        pieces: s.pieces.map((p) => (p.id === id ? { ...p, done: false } : p)),
        slain: s.slain - 1,
      })),
    )
  }

  const unseal = (id: string) => {
    setState((s) => ({
      ...s,
      thoughts: s.thoughts.map((t) =>
        t.id === id ? { ...t, kind: 'float' as const, resolvedAt: undefined } : t,
      ),
    }))
    showToast('꺼냄. 다시 둥둥 떠다님.')
  }

  const crushFromBox = (id: string) => {
    sfx.crush()
    setState((s) => ({
      ...s,
      thoughts: s.thoughts.map((t) => (t.id === id ? { ...t, kind: 'junk' as const } : t)),
      crushed: s.crushed + 1,
    }))
    showToast('봉인된 채로 통째로 분쇄됨. 깔끔.', () =>
      setState((s) => ({
        ...s,
        thoughts: s.thoughts.map((t) => (t.id === id ? { ...t, kind: 'worry' as const } : t)),
        crushed: s.crushed - 1,
      })),
    )
  }

  const dropMemo = (id: string) => {
    const memo = state.thoughts.find((t) => t.id === id)
    setState((s) => ({ ...s, thoughts: s.thoughts.filter((t) => t.id !== id) }))
    if (memo)
      showToast('기억 상자에서 버림.', () => setState((s) => ({ ...s, thoughts: [...s.thoughts, memo] })))
  }

  const toggleMute = () => setState((s) => ({ ...s, muted: !s.muted }))

  const resetAll = () => {
    if (!window.confirm('진짜 다 지워? 몬스터도 상자도 싹 없어짐.')) return
    setState(EMPTY)
    setJudging(null)
    setSplitting(null)
    setSparking(null)
    setBoxOpen(false)
    setView('dump')
    showToast('다 지웠음. 머리 완전 빔.')
  }

  const boxCount = worries.length + memos.length

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <Pixel name="puff" size={2} />
          <span className="brand-name">둥둥</span>
          <span className="brand-sub">잡념 처치소</span>
        </div>
        <div className="top-actions">
          <button
            className="icon-btn"
            onClick={toggleMute}
            title={state.muted ? '소리 켜기' : '소리 끄기'}
            aria-label={state.muted ? '소리 켜기' : '소리 끄기'}
          >
            <Pixel name={state.muted ? 'soundoff' : 'soundon'} size={2} />
          </button>
          <button className="icon-btn" onClick={() => setBoxOpen(true)} title="상자" aria-label="상자 열기">
            <Pixel name="box" size={2} />
            {boxCount > 0 && <span className="badge">{boxCount}</span>}
          </button>
          <button className="btn btn-small" onClick={() => setView('dump')}>
            + 쏟기
          </button>
        </div>
      </header>

      <div className="meter">
        <span className="meter-label">머리 가벼움</span>
        <div className="meter-track">
          <div className="meter-fill" style={{ width: `${light}%` }} />
        </div>
        <span className="meter-pct">{light}%</span>
      </div>

      {toast && (
        <div className="toast">
          <span>{toast.msg}</span>
          {toast.undo && (
            <button
              className="toast-undo"
              onClick={() => {
                toast.undo?.()
                setToast(null)
              }}
            >
              되돌리기
            </button>
          )}
        </div>
      )}

      <main className="main">
        {view === 'dump' ? (
          <Dump onDump={addDump} onClose={() => setView('room')} />
        ) : (
          <>
            <Room floats={floats} sparks={sparks} onJudge={setJudging} onSpark={setSparking} />
            <TodayCard pieces={sparks} remaining={floats.length} onSpark={setSparking} />
            <p className="foot-note">
              처치 {state.crushed + state.slain}마리 · 봉인 {state.sealed}개 — 남은 건 내일 또 둥둥 떠다님.
              몬스터라 원래 그럼.
            </p>
            <button className="link foot-reset" onClick={resetAll}>
              다 지우기
            </button>
          </>
        )}
      </main>

      {judging && (
        <JudgeSheet
          thought={judging}
          onResolve={(kind) =>
            kind === 'task' ? (setSplitting(judging), setJudging(null)) : resolveThought(judging.id, kind)
          }
          onSplit={() => (setSplitting(judging), setJudging(null))}
          onClose={() => setJudging(null)}
        />
      )}
      {splitting && (
        <SplitModal
          thought={splitting}
          onSplit={(ps) => splitThought(splitting.id, ps)}
          onClose={() => setSplitting(null)}
        />
      )}
      {sparking && (
        <PieceSheet piece={sparking} onDone={() => doPiece(sparking.id)} onClose={() => setSparking(null)} />
      )}
      {boxOpen && (
        <BoxDrawer
          worries={worries}
          memos={memos}
          onUnseal={unseal}
          onCrush={crushFromBox}
          onDropMemo={dropMemo}
          onClose={() => setBoxOpen(false)}
        />
      )}
    </div>
  )
}

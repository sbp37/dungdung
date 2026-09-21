import { useEffect, useMemo, useState } from 'react'
import { BoxDrawer } from './components/BoxDrawer'
import { Dump } from './components/Dump'
import { JudgeSheet, PieceSheet } from './components/JudgeSheet'
import { Room } from './components/Room'
import { SplitModal } from './components/SplitModal'
import { TodayCard } from './components/TodayCard'
import { Pixel } from './Pixel'
import { sfx } from './sound'
import { DungState, Piece, Thought, load, save, uid } from './store'

export default function App() {
  const [state, setState] = useState<DungState>(load)
  const [view, setView] = useState<'room' | 'dump'>(() =>
    load().thoughts.some((t) => !t.resolvedAt) || load().pieces.some((p) => !p.done) ? 'room' : 'dump',
  )
  const [judging, setJudging] = useState<Thought | null>(null)
  const [splitting, setSplitting] = useState<Thought | null>(null)
  const [sparking, setSparking] = useState<Piece | null>(null)
  const [boxOpen, setBoxOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => save(state), [state])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2400)
    return () => clearTimeout(t)
  }, [toast])

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
    setState((s) => ({
      ...s,
      thoughts: s.thoughts.map((t) => (t.id === id ? { ...t, kind, resolvedAt: Date.now() } : t)),
      sealed: s.sealed + (kind === 'worry' ? 1 : 0),
      crushed: s.crushed + (kind === 'junk' ? 1 : 0),
    }))
    setJudging(null)
    if (kind === 'memo') setToast('기억 상자에 넣어둠.')
  }

  const splitThought = (id: string, pieces: string[]) => {
    sfx.pop()
    setState((s) => ({
      ...s,
      thoughts: s.thoughts.map((t) =>
        t.id === id ? { ...t, kind: 'task' as const, resolvedAt: Date.now() } : t,
      ),
      pieces: [
        ...s.pieces,
        ...pieces.map((text) => ({ id: uid(), fromId: id, text, done: false, createdAt: Date.now() })),
      ],
    }))
    setSplitting(null)
    setToast('쪼개짐. 번개몬으로 변했다.')
  }

  const doPiece = (id: string) => {
    setState((s) => ({
      ...s,
      pieces: s.pieces.map((p) => (p.id === id ? { ...p, done: true } : p)),
      slain: s.slain + 1,
    }))
    setSparking(null)
  }

  const unseal = (id: string) => {
    setState((s) => ({
      ...s,
      thoughts: s.thoughts.map((t) =>
        t.id === id ? { ...t, kind: 'float' as const, resolvedAt: undefined } : t,
      ),
    }))
    setToast('꺼냄. 다시 둥둥 떠다님.')
  }

  const crushFromBox = (id: string) => {
    sfx.crush()
    setState((s) => ({
      ...s,
      thoughts: s.thoughts.map((t) => (t.id === id ? { ...t, kind: 'junk' as const } : t)),
      crushed: s.crushed + 1,
    }))
    setToast('봉인된 채로 통째로 분쇄됨. 깔끔.')
  }

  const dropMemo = (id: string) => {
    setState((s) => ({ ...s, thoughts: s.thoughts.filter((t) => t.id !== id) }))
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
          <button className="icon-btn" onClick={() => setBoxOpen(true)} title="상자">
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

      {toast && <div className="toast">{toast}</div>}

      <main className="main">
        {view === 'dump' ? (
          <Dump onDump={addDump} hasRoom={total > 0} onClose={() => setView('room')} />
        ) : (
          <>
            <Room floats={floats} sparks={sparks} onJudge={setJudging} onSpark={setSparking} />
            <TodayCard pieces={sparks} remaining={floats.length} onSpark={setSparking} />
            <p className="foot-note">
              처치 {state.crushed + state.slain}마리 · 봉인 {state.sealed}개 — 남은 건 내일 또 둥둥 떠다님.
              몬스터라 원래 그럼.
            </p>
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

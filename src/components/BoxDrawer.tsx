import { Pixel } from '../Pixel'
import { Thought, daysOld } from '../store'

interface Props {
  worries: Thought[]
  memos: Thought[]
  onUnseal: (id: string) => void
  onCrush: (id: string) => void
  onDropMemo: (id: string) => void
  onClose: () => void
}

export function BoxDrawer({ worries, memos, onUnseal, onCrush, onDropMemo, onClose }: Props) {
  return (
    <div className="sheet-wrap" onClick={onClose}>
      <div className="sheet sheet-tall" onClick={(e) => e.stopPropagation()}>
        <div className="box-title">
          <Pixel name="box" size={3} />
          <h2>상자</h2>
        </div>

        <h3 className="box-sub">예언 상자 — 봉인된 걱정들</h3>
        {worries.length === 0 ? (
          <p className="box-empty">비어있음. 봉인된 걱정이 없다는 거.</p>
        ) : (
          <ul className="box-list">
            {worries.map((w) => (
              <li key={w.id} className="box-item">
                <Pixel name="seer" size={2} />
                <div className="box-item-body">
                  <span>{w.text}</span>
                  <span className="box-stamp">
                    봉인 {daysOld(w.resolvedAt ?? w.createdAt)}일차 · 예언 적중률 0%
                  </span>
                </div>
                <button className="chip-x" title="다시 꺼내기" onClick={() => onUnseal(w.id)}>
                  ↺
                </button>
                <button className="chip-x" title="그냥 분쇄" onClick={() => onCrush(w.id)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <h3 className="box-sub">기억 상자 — 보관한 것들</h3>
        {memos.length === 0 ? (
          <p className="box-empty">비어있음.</p>
        ) : (
          <ul className="box-list">
            {memos.map((m) => (
              <li key={m.id} className="box-item">
                <Pixel name="memo" size={2} />
                <div className="box-item-body">
                  <span>{m.text}</span>
                </div>
                <button className="chip-x" title="삭제" onClick={() => onDropMemo(m.id)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

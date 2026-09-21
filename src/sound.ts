// 아주 작은 효과음 — WebAudio 사각파 블립 몇 개. 파일 없이 코드로만.
let ctx: AudioContext | null = null
let muted = false

export function setMuted(m: boolean) {
  muted = m
}

function buzz(ms: number) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* 진동 없는 기기 */
  }
}

function ac(): AudioContext | null {
  try {
    ctx ??= new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    )()
    return ctx
  } catch {
    return null
  }
}

function blip(freq: number, dur: number, delay = 0, type: OscillatorType = 'square', vol = 0.04) {
  if (muted) return
  const a = ac()
  if (!a) return
  const t = a.currentTime + delay
  const o = a.createOscillator()
  const g = a.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(a.destination)
  o.start(t)
  o.stop(t + dur)
}

export const sfx = {
  pop() {
    blip(660, 0.08)
    blip(880, 0.07, 0.05)
  },
  crush() {
    buzz(35)
    blip(220, 0.1, 0, 'sawtooth', 0.05)
    blip(110, 0.14, 0.08, 'sawtooth', 0.05)
    blip(55, 0.12, 0.18, 'square', 0.04)
  },
  seal() {
    blip(440, 0.1)
    blip(330, 0.16, 0.1)
  },
  done() {
    buzz(20)
    blip(523, 0.08)
    blip(659, 0.08, 0.07)
    blip(784, 0.14, 0.14)
  },
}

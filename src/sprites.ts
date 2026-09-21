export interface Sprite {
  palette: Record<string, string>
  rows: string[]
}

const K = '#4a4257' // 연한 자두색 아웃라인 — ilta의 검정보다 부드럽게
const W = '#fffdf7'
const B = '#4a4257' // 눈

export const SPRITES: Record<string, Sprite> = {
  // 둥둥몬 — 판정 전의 맨얼굴 잡념. 연민트 솜뭉치
  puff: {
    palette: { K, W, B, M: '#c8ecd9', m: '#a5dcbe', P: '#ffb3a0' },
    rows: [
      '....KKKKKKKK....',
      '..KKMMMMMMMMKK..',
      '.KMMMMMMMMMMMMK.',
      'KMMmMMMMMMMMMmMK',
      'KMBWBMMMMMMBWBMK',
      'KMMMMMMMMMMMMMMK',
      'KMMMMMKKMMMMMMMK',
      '.KMMMMMKKMMMMMK.',
      '..KKMMMMMMMMKK..',
      '....KKKKKKKK....',
    ],
  },

  // 예언몬 — "~~이럴 것이다" 추측형 걱정. 라벤더 유령, 꿈꾸는 눈
  seer: {
    palette: { K, W, B, L: '#d8ccf5', l: '#bfaeec', S: '#9d86dd' },
    rows: [
      '....KKKKKKKK....',
      '..KKLLLLLLLLKK..',
      '.KLLLLSSSLLLLLK.',
      'KLLLLSLLSLLLLLLK',
      'KLLKKKLLLLKKKLLK',
      'KLLLLLLLLLLLLLLK',
      'KLLLLLLKLLLLLLLK',
      '.KLLLLLLLLLLLLK.',
      '.KLLKLLKLLKLLLK.',
      '..KKK..KK..KK...',
    ],
  },

  // 벽돌몬 — 크고 무거운 할일. 피치 벽돌, 눈썹 무거움
  brick: {
    palette: { K, W, B, P: '#ffc9a3', p: '#f4ab7c' },
    rows: [
      '..KKKKKKKKKKKK..',
      '.KPPPPPPPPPPPPK.',
      'KPPPPPPPPPPPPPPK',
      'KPPKKKPPPPKKKPPK',
      'KPPBWBPPPPBWBPPK',
      'KPPPPPPPPPPPPPPK',
      'KPpPKKKKKKKKPpPK',
      'KPPPPPPPPPPPPPPK',
      '.KPPPPPPPPPPPPK.',
      '..KKKKKKKKKKKK..',
    ],
  },

  // 찌꺼기몬 — 쓸데없는 생각 찌꺼기. 삐죽삐죽 민트
  junk: {
    palette: { K, W, B, J: '#a8e6cf', j: '#7fd4b4' },
    rows: [
      '..KK..KKKK..KK..',
      '.KJJKKJJJJKKJJK.',
      'KJJJJJJJJJJJJJJK',
      'KJBJBJJJJJBJBJJK',
      'KJJJJJJJJJJJJJJK',
      'KJJjKKJJJJKKjJJK',
      '.KJJJJJJJJJJJJK.',
      '..KJKKJJJJKKJK..',
      '....KKKKKKKK....',
    ],
  },

  // 메모몬 — 기억해둘 것. 버터색 쪽지 몬스터
  memo: {
    palette: { K, W, B, Y: '#ffe3a1', y: '#ffd97d', T: '#f5b942' },
    rows: [
      '....KKKKKKKK....',
      '..KKYYYYYYYYKK..',
      '.KYYYYYTTYYYYYK.',
      'KYYYYYTTYYYYYYYK',
      'KYBBBYYYYYBBBYYK',
      'KYYYYYYYYYYYYYYK',
      'KYYYKYYYYKYYYYYK',
      'KYYYYYYYYYYYYYYK',
      '.KYYYYYYYYYYYYK.',
      '..KKYYYYYYYYKK..',
      '....KKKKKKKK....',
    ],
  },

  // 미뤄몬 — 방치된 할일. 옆으로 퍼진 세이지, 위로 Zzz
  lazy: {
    palette: { K, W, B, S: '#cfe6b6', s: '#b4d494', Z: '#8fb7d9' },
    rows: [
      '............ZK..',
      '...KKKKKKKKKK...',
      '.KSSSSSSSSSSSSK.',
      'KSSSSSSSSSSSSSSK',
      'KSKKSSSSSSSSKKSK',
      'KSSSSSSSSSSSSSSK',
      'KSsKSSSSSSSSKsSK',
      'KKSSSSSSSSSSSSKK',
      '.KKKKKKKKKKKKKK.',
      '...KK......KK...',
    ],
  },

  // 번개몬 — 쪼갠 첫 행동 조각. 작고 빠른 버터-번개
  spark: {
    palette: { K, W, B, Y: '#ffdf6b', y: '#f5b942' },
    rows: [
      '......KKKKK.....',
      '....KKYYYYYK....',
      '...KYYYYYYYYK...',
      '..KYBBYYYBBYK...',
      '..KYYYYYYYYYK...',
      '...KKYYYYYYK....',
      '....KYYYK..KYK..',
      '.....KKK....KK..',
    ],
  },

  // 상자 — 봉인/보관함 아이콘. 종이상자
  box: {
    palette: { K, W, B, D: '#e0b183', d: '#cf9d6d', T: '#fffdf7' },
    rows: [
      '..KKKKKKKKKKKK..',
      '.KDDDDDDDDDDDDK.',
      'KDDTTTTTTTTTTDDK',
      'KDDTKDDDDDdKTDDK',
      'KDDTKDDKKDDKTDDK',
      'KDDTKDDDDDdKTDDK',
      'KDDTTTTTTTTTTDDK',
      'KDDDDDDDDDDDDDDK',
      '.KKKKKKKKKKKKKK.',
    ],
  },

  // 구름 — 방 배경 데코. 크림 하늘을 떠다니는 솜구름
  cloud: {
    palette: { K, W, C: '#eaf4fb' },
    rows: [
      '......KKKK......',
      '....KKWWWWKK....',
      '..KKWWWWWWWWKK..',
      '.KWWWWWWWWWWWWK.',
      'KCWWWWWWWWWWCWK.',
      '.KKKKKKKKKKKKKK.',
    ],
  },

  // 반짝이 — 방 배경 데코. 네모난 4점 스파클
  star: {
    palette: { K, W, Y: '#ffdf6b' },
    rows: [
      '.......KK.......',
      '......KWWK......',
      '......KWWK......',
      '...KKKWWWWKKK...',
      '..KWWYYWWYYWWK..',
      '...KKKWWWWKKK...',
      '......KWWK......',
      '......KWWK......',
      '.......KK.......',
    ],
  },

  // 풀뭉치 — 방 바닥 데코
  tuft: {
    palette: { K, G: '#8fd0a0', g: '#6cba82' },
    rows: [
      '..K...K...K.....',
      '..K..K.K..K.K...',
      '..KG.KG.G.KG.K..',
      '..KGGKGGGKGKGK..',
      '...KKKKKKKKK....',
    ],
  },

  // 소리 켜짐 — 스피커 + 파형 3줄
  soundon: {
    palette: { K, W, C: '#a98fe0' },
    rows: [
      '................',
      '....KK..........',
      '...KWK..........',
      '..KWWK.....K....',
      '.KWWWK...K..K...',
      'KWWWWK..K....K..',
      'KWWWWK..K....K..',
      'KWWWWK..K....K..',
      'KWWWWK..K....K..',
      '.KWWWK...K..K...',
      '..KWWK.....K....',
      '...KWK..........',
      '....KK..........',
      '................',
    ],
  },

  // 소리 꺼짐 — 스피커 + X
  soundoff: {
    palette: { K, W, C: '#ff9e8a' },
    rows: [
      '................',
      '....KK..........',
      '...KWK..........',
      '..KWWK..........',
      '.KWWWK..K....K..',
      'KWWWWK...K..K...',
      'KWWWWK....KK....',
      'KWWWWK....KK....',
      'KWWWWK...K..K...',
      '.KWWWK..K....K..',
      '..KWWK..........',
      '...KWK..........',
      '....KK..........',
      '................',
    ],
  },

  // 분쇄기 — 잡념 분쇄 장면에서 위에서 내려오는 톱니
  crusher: {
    palette: { K, W, B, C: '#b9c2d0', c: '#98a3b5' },
    rows: ['KKKKKKKKKKKKKKKK', 'KCCCCCCCCCCCCCCK', 'KCKKCKKCKKCKKCKK', 'KKK..KKK..KKK..K'],
  },
}

export const KIND_SPRITE: Record<string, string> = {
  float: 'puff',
  worry: 'seer',
  task: 'brick',
  junk: 'junk',
  memo: 'memo',
  stale: 'lazy',
  piece: 'spark',
}

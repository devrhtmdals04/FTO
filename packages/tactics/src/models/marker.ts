// 선수의 6가지 핵심 능력치 타입
export interface PlayerStats {
    PAC: number; // 속력
    SHO: number; // 슈팅
    PAS: number; // 패스
    DRI: number; // 드리블
    DEF: number; // 수비
    PHY: number; // 피지컬
}

// 선수 포지션 타입 (정의된 값만 허용)
export type Position = 'FW' | 'MF' | 'DF' | 'GK';

// 선수 객체의 전체 구조 타입
export interface Player {
    id: number;
    number: number;
    name: string;
    position: Position;
    stats: PlayerStats;
    x?: number; // 렌더링 시 사용할 초기 x좌표 (선택)
    y?: number; // 렌더링 시 사용할 초기 y좌표 (선택)
}

// --- 설정 상수 ---
const POSITION_COLORS: Record<Position, string> = {
    'FW': '#e74c3c', // 빨강
    'MF': '#2ecc71', // 녹색
    'DF': '#3498db', // 파랑
    'GK': '#9b59b6'  // 보라
};

const STAT_ORDER: (keyof PlayerStats)[] = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'];
const ELITE_STAT_THRESHOLD = 90; // 특성 하이라이트 기준점

const MARKER_STYLES_ID = 'fto-player-marker-styles';
const MARKER_CSS = `
/* --- 선수 마커 --- */

/* 마커의 기본 컨테이너 스타일 */
.player-marker {
    /* 절대 위치를 사용해 보드 위 자유로운 배치 가능 */
    position: absolute; 
    width: 80px;
    height: 80px;
    cursor: grab; /* 잡을 수 있다는 것을 알려주는 커서 모양 */
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.1s ease-in-out; /* 부드러운 효과를 위한 전환 */
}

/* 마커를 클릭하고 드래그할 때 (활성화 상태) */
.player-marker:active {
    cursor: grabbing; /* 잡고 있는 모양의 커서 */
    transform: scale(1.1); /* 살짝 확대하여 사용자에게 피드백 */
    z-index: 100; /* 다른 요소들보다 위에 보이도록 설정 */
}

/* 선수 번호 텍스트 스타일 */
.player-number {
    position: absolute;
    font-size: 20px;
    font-weight: bold;
    color: white;
    /* 복잡한 배경에서도 잘 보이도록 텍스트 그림자 추가 */
    text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.8);
    /* 텍스트가 마우스 이벤트를 가로채지 않도록 설정 (매우 중요!) */
    pointer-events: none; 
}


/* --- SVG 도형 스타일 --- */

/* 마커 내부의 SVG 요소 스타일 */
.player-marker svg {
    width: 100%;
    height: 100%;
    /* 마커가 입체적으로 보이도록 그림자 효과 추가 */
    filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.3));
}

/* 육각형 외부 테두리 스타일 */
.hexagon-border {
    fill: none; /* 내부는 채우지 않음 */
    stroke: rgba(255, 255, 255, 0.8); /* 흰색 반투명 테두리 */
    stroke-width: 3;
}

/* 내부 스탯 레이더(다각형) 스타일 */
.stat-radar {
    stroke: rgba(255, 255, 255, 0.5); /* 테두리 선 */
    stroke-width: 1.5;
    opacity: 0.9; /* 약간의 투명도 */
    /* fill(채우기) 색상은 TypeScript 코드에서 동적으로 설정됩니다. */
}

/* 뛰어난 능력치 하이라이트 효과 */
.elite-stat-highlight {
    fill: #f1c40f; /* 금색 계열 */
    stroke: #ffffff;
    stroke-width: 1;
    /* 'pulse' 애니메이션을 1.5초 동안 무한 반복 */
    animation: pulse 1.5s infinite;
}


/* --- 애니메이션 --- */

/* 하이라이트를 위한 'pulse' 키프레임 애니메이션 정의 */
 @keyframes pulse {
    0% {
        transform: scale(0.9);
        opacity: 0.7;
    }
    50% {
        transform: scale(1.15);
        opacity: 1;
    }
    100% {
        transform: scale(0.9);
        opacity: 0.7;
    }
}
`;

function ensureMarkerStyles() {
  if (document.getElementById(MARKER_STYLES_ID)) return;
  const style = document.createElement('style');
  style.id = MARKER_STYLES_ID;
  style.textContent = MARKER_CSS;
  document.head.appendChild(style);
}

/**
 * 선수 데이터 객체를 기반으로 육각형 SVG 마커 HTMLElement를 생성합니다.
 * @packages/engine/src/params.rs player - Player 타입의 선수 데이터 객체
 * @returns 생성된 선수 마커 div 요소 (HTMLElement)
 */
export function createPlayerMarker(player: Player): HTMLElement {
    ensureMarkerStyles();
    // 1. 마커의 기본 div 요소 생성
    const marker = document.createElement('div');
    marker.className = 'player-marker'; // CSS 클래스 적용
    marker.id = `player-${player.id}`;
    marker.style.position = 'absolute';
    marker.style.left = `${player.x || 0}px`;
    marker.style.top = `${player.y || 0}px`;
    marker.draggable = true;

    // 2. SVG 요소 및 관련 상수 정의
    const svgNS = "http://www.w3.org/2000/svg";
    const size = 80;
    const center = size / 2;
    const radius = size / 2 - 5; // 테두리를 위한 여백

    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

    // 3. SVG 내부 도형들 생성
    const radarPoints: string[] = [];
    const borderPoints: string[] = [];
    const highlightElements: SVGElement[] = [];
    
    STAT_ORDER.forEach((statKey, i) => {
        const angle = (Math.PI / 3 * i) - (Math.PI / 2); // 상단 꼭짓점부터 시작
        const statValue = player.stats[statKey] / 100;

        // 외부 테두리 좌표
        const borderX = center + radius * Math.cos(angle);
        const borderY = center + radius * Math.sin(angle);
        borderPoints.push(`${borderX},${borderY}`);

        // 내부 스탯 레이더 좌표
        const radarX = center + radius * statValue * Math.cos(angle);
        const radarY = center + radius * statValue * Math.sin(angle);
        radarPoints.push(`${radarX},${radarY}`);

        // 능력치가 기준점을 넘으면 하이라이트 요소 생성
        if (player.stats[statKey] >= ELITE_STAT_THRESHOLD) {
            const highlightCircle = document.createElementNS(svgNS, 'circle');
            highlightCircle.setAttribute('class', 'elite-stat-highlight');
            highlightCircle.setAttribute('cx', String(borderX));
            highlightCircle.setAttribute('cy', String(borderY));
            highlightCircle.setAttribute('r', '5');
            highlightElements.push(highlightCircle);
        }
    });
    
    // 4. 생성된 좌표로 폴리곤(다각형) 생성
    // 스탯 레이더 폴리곤
    const statRadar = document.createElementNS(svgNS, 'polygon');
    statRadar.setAttribute('class', 'stat-radar');
    statRadar.setAttribute('points', radarPoints.join(' '));
    statRadar.setAttribute('fill', POSITION_COLORS[player.position]);
    
    // 육각형 테두리 폴리곤
    const hexagonBorder = document.createElementNS(svgNS, 'polygon');
    hexagonBorder.setAttribute('class', 'hexagon-border');
    hexagonBorder.setAttribute('points', borderPoints.join(' '));

    // 5. 선수 번호 요소 생성
    const playerNumber = document.createElement('span');
    playerNumber.className = 'player-number';
    playerNumber.textContent = String(player.number);

    // 6. 모든 요소를 조립하여 반환
    svg.appendChild(statRadar);
    svg.appendChild(hexagonBorder);
    highlightElements.forEach(el => svg.appendChild(el)); // 하이라이트 요소 추가

    marker.appendChild(svg);
    marker.appendChild(playerNumber);

    return marker;
}

// Original content of marker.ts
export type MarkerRole = 'goalkeeper' | 'outfield';

export interface RGBAColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a?: number; // 0 ~ 1, defaults to 1
}

export interface MarkerStyle {
  readonly radius: number;
  readonly fill: RGBAColor;
  readonly stroke: RGBAColor;
  readonly strokeWidth: number;
  readonly labelColor: RGBAColor;
}

const rgba = (r: number, g: number, b: number, a?: number): RGBAColor => ({ r, g, b, a });

const BASE_MARKER: MarkerStyle = {
  radius: 10,
  fill: rgba(240, 230, 140),
  stroke: rgba(51, 51, 51),
  strokeWidth: 1.5,
  labelColor: rgba(26, 26, 26),
};

const GOALKEEPER_MARKER: MarkerStyle = {
  radius: 11,
  fill: rgba(255, 138, 43),
  stroke: rgba(72, 39, 0),
  strokeWidth: 1.5,
  labelColor: rgba(22, 22, 22),
};

export const MARKER_STYLES: Record<MarkerRole, MarkerStyle> = {
  outfield: BASE_MARKER,
  goalkeeper: GOALKEEPER_MARKER,
};

export const getMarkerStyle = (role: MarkerRole): MarkerStyle => {
  return MARKER_STYLES[role] ?? BASE_MARKER;
};

export const colorToCss = ({ r, g, b, a = 1 }: RGBAColor): string => {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
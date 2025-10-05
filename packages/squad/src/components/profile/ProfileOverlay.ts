import type { PlayerProfile, Position, Foot } from '../../types';

const overlayStyles = `
:root {
    --overlay-bg: rgba(20, 20, 30, 0.7);
    --overlay-border: rgba(255, 255, 255, 0.2);
    --text-primary: #f0f0f0;
    --text-secondary: #a0a0b0;
    --accent-color: #00aaff;
    --stat-red: #e74c3c;
    --stat-yellow: #f1c40f;
    --stat-green: #2ecc71;
}

.profile-overlay-backdrop {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
}

.profile-overlay-card {
    width: 700px;
    background: var(--overlay-bg);
    border: 1px solid var(--overlay-border);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    color: var(--text-primary);
    font-family: 'Segoe UI', system-ui, sans-serif;
    display: flex;
    flex-direction: column;
    transform: scale(0.95);
    animation: scaleUp 0.3s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.profile-header {
    padding: 24px;
    display: grid;
    grid-template-columns: 100px 1fr auto;
    gap: 20px;
    align-items: center;
    border-bottom: 1px solid var(--overlay-border);
}

.profile-photo {
    width: 100px; height: 100px;
    background: #333;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
.profile-photo img { width: 100%; height: 100%; object-fit: cover; }

.profile-identity .name { font-size: 28px; font-weight: 700; margin: 0; }
.profile-identity .info { font-size: 14px; color: var(--text-secondary); }

.profile-overall { text-align: right; }
.profile-overall .overall-value { font-size: 48px; font-weight: 800; line-height: 1; }
.profile-overall .overall-label { font-size: 14px; color: var(--text-secondary); }

.profile-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 0 24px;
    border-bottom: 1px solid var(--overlay-border);
}
.tab-button {
    padding: 12px 20px;
    border: none; background: none;
    color: var(--text-secondary);
    font-size: 16px; font-weight: 600;
    cursor: pointer;
    position: relative;
    transition: color 0.2s;
    text-align: center;
}
.tab-button:hover { color: var(--text-primary); }
.tab-button.active { color: var(--accent-color); }
.tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 20px; right: 20px;
    height: 3px;
    background: var(--accent-color);
    border-radius: 3px;
}

.profile-content {
    height: 300px;
    overflow-y: auto;
    scroll-behavior: smooth;
}

.tab-panel {
    padding: 24px;
}

.panel-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-top: 0;
    margin-bottom: 20px;
}

.stats-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0 30px;
}

.stat-item { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.stat-label { font-size: 14px; color: var(--text-secondary); width: 120px; flex-shrink: 0; }
.stat-value { font-size: 16px; font-weight: 600; }
.stat-bar-container { flex-grow: 1; height: 10px; background: rgba(0,0,0,0.2); border-radius: 3px; margin: 0 12px; }
.stat-bar { height: 100%; border-radius: 3px; }

.close-button {
    position: absolute; top: 12px; right: 12px;
    width: 30px; height: 30px;
    border: none; background: none; color: var(--text-secondary);
    font-size: 24px; cursor: pointer; line-height: 1;
}

 @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
 @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
`;

let stylesInjected = false;

function getStatColor(value: number): string {
  const colorStops = [
      { val: 0,   rgb: [231, 76, 60] },  // Red
      { val: 50,  rgb: [241, 196, 15] }, // Yellow
      { val: 100, rgb: [46, 204, 113] }  // Green
  ];

  const clampedValue = Math.max(0, Math.min(100, value));

  let startColor = colorStops[0];
  let endColor = colorStops[1];

  if (clampedValue >= 50) {
      startColor = colorStops[1];
      endColor = colorStops[2];
  }
  
  const range = endColor.val - startColor.val;
  const progress = (clampedValue - startColor.val) / range;

  const r = Math.round(startColor.rgb[0] + (endColor.rgb[0] - startColor.rgb[0]) * progress);
  const g = Math.round(startColor.rgb[1] + (endColor.rgb[1] - startColor.rgb[1]) * progress);
  const b = Math.round(startColor.rgb[2] + (endColor.rgb[2] - startColor.rgb[2]) * progress);

  return `rgb(${r}, ${g}, ${b})`;
}

export function createProfileOverlay(profile: PlayerProfile): HTMLElement {
    if (!stylesInjected) {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = overlayStyles;
        document.head.appendChild(styleSheet);
        stylesInjected = true;
    }

    const createStatItem = (label: string, value: number) => {
        const item = document.createElement('div');
        item.className = 'stat-item';
        
        const barContainer = document.createElement('div');
        barContainer.className = 'stat-bar-container';
        const bar = document.createElement('div');
        bar.className = 'stat-bar';
        const statValue100 = (value / 20) * 100;
        bar.style.width = `${statValue100}%`;
        const dynamicColor = getStatColor(statValue100);
        bar.style.backgroundColor = dynamicColor;

        barContainer.appendChild(bar);

        item.innerHTML = `<span class="stat-label">${label}</span>`;
        item.appendChild(barContainer);
        
        const valueSpan = document.createElement('span');
        valueSpan.className = 'stat-value';
        valueSpan.textContent = String(value);
        valueSpan.style.color = dynamicColor;
        item.appendChild(valueSpan);

        return item;
    };

    const backdrop = document.createElement('div');
    backdrop.className = 'profile-overlay-backdrop';

    const card = document.createElement('div');
    card.className = 'profile-overlay-card';

    const header = document.createElement('div');
    header.className = 'profile-header';
    const overall = Math.round(((profile.pace + profile.finishing + profile.passing + profile.agility + profile.tackling + profile.strength) / 6) * 5);
    header.innerHTML = `
        <div class="profile-photo">
            ${profile.photoUrl ? `<img src="${profile.photoUrl}" alt="${profile.name}">` : ''}
        </div>
        <div class="profile-identity">
            <h2 class="name">${profile.name}</h2>
            <p class="info">${profile.number ? `No. ${profile.number} | ` : ''}${profile.position} | ${profile.nationality || ''}</p>
        </div>
        <div class="profile-overall">
            <div class="overall-value">${overall}</div>
            <div class="overall-label">OVERALL</div>
        </div>
    `;
    
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'profile-tabs';
    const overallTabBtn = document.createElement('button');
    overallTabBtn.className = 'tab-button active';
    overallTabBtn.textContent = '종합';
    const physicalTabBtn = document.createElement('button');
    physicalTabBtn.className = 'tab-button';
    physicalTabBtn.textContent = '피지컬';
    const technicalTabBtn = document.createElement('button');
    technicalTabBtn.className = 'tab-button';
    technicalTabBtn.textContent = '기술';
    tabsContainer.append(overallTabBtn, physicalTabBtn, technicalTabBtn);

    const content = document.createElement('div');
    content.className = 'profile-content';

    const overallPanel = document.createElement('div');
    overallPanel.className = 'tab-panel';
    overallPanel.innerHTML = '<h3 class="panel-title">종합 능력치</h3>';
    const overallGrid = document.createElement('div');
    overallGrid.className = 'stats-grid';
    const overallStats = [
        createStatItem('Pace', profile.pace),
        createStatItem('Shooting', profile.finishing),
        createStatItem('Passing', profile.passing),
        createStatItem('Dribbling', profile.agility),
        createStatItem('Defense', profile.tackling),
        createStatItem('Physical', profile.strength)
    ];
    overallGrid.append(...overallStats);
    overallPanel.appendChild(overallGrid);

    const physicalPanel = document.createElement('div');
    physicalPanel.className = 'tab-panel';
    physicalPanel.innerHTML = '<h3 class="panel-title">피지컬 능력치</h3>';
    const physicalGrid = document.createElement('div');
    physicalGrid.className = 'stats-grid';
    const physicalStats = [
        createStatItem('Pace', profile.pace),
        createStatItem('Acceleration', profile.accel),
        createStatItem('Agility', profile.agility),
        createStatItem('Stamina', profile.stamina),
        createStatItem('Strength', profile.strength),
        createStatItem('Jumping', profile.jumping),
    ];
    physicalGrid.append(...physicalStats);
    physicalPanel.appendChild(physicalGrid);

    const technicalPanel = document.createElement('div');
    technicalPanel.className = 'tab-panel';
    technicalPanel.innerHTML = '<h3 class="panel-title">기술 능력치</h3>';
    const technicalGrid = document.createElement('div');
    technicalGrid.className = 'stats-grid';
    const technicalStats = [
        createStatItem('Finishing', profile.finishing),
        createStatItem('Shot Power', profile.shot_power),
        createStatItem('Passing', profile.passing),
        createStatItem('Vision', profile.vision),
        createStatItem('First Touch', profile.first_touch),
        createStatItem('Heading', profile.heading),
        createStatItem('Tackling', profile.tackling),
        createStatItem('Interception', profile.interception),
    ];
    technicalGrid.append(...technicalStats);
    technicalPanel.appendChild(technicalGrid);
    
    content.append(overallPanel, physicalPanel, technicalPanel);
    
    const tabButtons = [overallTabBtn, physicalTabBtn, technicalTabBtn];
    const tabPanels = [overallPanel, physicalPanel, technicalPanel];
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            tabPanels[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    content.addEventListener('scroll', () => {
        const viewportCenter = content.scrollTop + content.clientHeight / 2;
        
        let activeIndex = 0;
        let minDistance = Infinity;

        tabPanels.forEach((panel, index) => {
            const panelCenter = panel.offsetTop + panel.offsetHeight / 2;
            const distance = Math.abs(viewportCenter - panelCenter);
            if (distance < minDistance) {
                minDistance = distance;
                activeIndex = index;
            }
        });

        tabButtons.forEach((btn, i) => btn.classList.toggle('active', i === activeIndex));
    });

    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => backdrop.remove();

    card.append(header, tabsContainer, content, closeButton);
    backdrop.appendChild(card);
    
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            backdrop.remove();
        }
    });

    return backdrop;
}
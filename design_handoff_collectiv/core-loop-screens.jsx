// core-loop-screens.jsx — Collectiv Core Loop · 3 Visual Directions
// Exports to window: CPortfolioScreen, CCardDetailScreen, CMarketScreen

// ── Color tokens ──────────────────────────────────────────────────────
const cLightT = {
  bg: '#fef9f5', surface: '#fef0e8', card: '#ffffff',
  text: '#1a1210', textSec: '#6b5c52', textTer: '#aa9a90',
  border: '#f0ddd0', chipBg: '#fef0e8',
  coral: '#E76F51', coralMuted: 'rgba(231,111,81,0.1)',
  purple: '#7C3AED', purpleMuted: 'rgba(124,58,237,0.1)',
  green: '#10B981', greenMuted: 'rgba(16,185,129,0.1)',
  amber: '#f59e0b', amberMuted: 'rgba(245,158,11,0.1)',
  cardShadow: '0 2px 8px rgba(26,18,16,0.07), 0 1px 2px rgba(26,18,16,0.04)',
  tabBorder: '#f0ddd0', tabInactive: 'rgba(26,18,16,0.28)',
};
const cDarkT = {
  bg: '#0e0d0c', surface: '#1a1816', card: '#1e1c1a',
  text: '#f0eeea', textSec: '#a09890', textTer: '#6b6360',
  border: '#2a2624', chipBg: '#252220',
  coral: '#E76F51', coralMuted: 'rgba(231,111,81,0.13)',
  purple: '#7C3AED', purpleMuted: 'rgba(124,58,237,0.13)',
  green: '#10B981', greenMuted: 'rgba(16,185,129,0.13)',
  amber: '#f59e0b', amberMuted: 'rgba(245,158,11,0.13)',
  cardShadow: '0 3px 14px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.2)',
  tabBorder: '#1a1816', tabInactive: 'rgba(240,238,234,0.28)',
};

// ── Direction configs ──────────────────────────────────────────────────
const CDIR = {
  1: {
    hFont: "'DM Serif Display', serif", hWeight: 400, hSz: 25,
    cardFont: "'DM Serif Display', serif",
    uiFont: "'DM Sans', sans-serif",
    chipR: 8, boldPrice: false, social: false,
  },
  2: {
    hFont: "'Sora', sans-serif", hWeight: 700, hSz: 20,
    cardFont: "'DM Sans', sans-serif",
    uiFont: "'Sora', sans-serif",
    chipR: 999, boldPrice: false, social: true,
  },
  3: {
    hFont: "'DM Sans', sans-serif", hWeight: 800, hSz: 20,
    cardFont: "'DM Sans', sans-serif",
    uiFont: "'DM Sans', sans-serif",
    chipR: 6, boldPrice: true, social: false,
  },
};

// Marketplace cards (used in Market screen)
const CARDS = [
  { name: 'Charizard 1st Ed.', price: '$2,450', grade: 'PSA 9',   accent: '#E76F51', activity: '8 watching' },
  { name: 'Pikachu Illustrator', price: '$85k',  grade: 'CGC 8.5', accent: '#7C3AED', activity: 'Just sold ×3' },
  { name: 'Lugia Neo Genesis',  price: '$890',   grade: 'PSA 8',   accent: '#10B981', activity: '4 watching' },
  { name: 'Blastoise Base Set', price: '$1,200', grade: 'PSA 10',  accent: '#f59e0b', activity: 'Hot 🔥' },
  { name: 'Mewtwo Base Set',    price: '$450',   grade: 'PSA 7',   accent: '#E76F51', activity: '2 watching' },
  { name: 'Gengar Base Set',    price: '$320',   grade: 'Raw NM',  accent: '#7C3AED', activity: 'Price drop' },
];

// Portfolio cards — mixed status: private / showcased / market
const PORT_CARDS = [
  { name: 'Charizard 1st Ed.', status: 'market',    price: '$2,450', genre: 'Pokémon', cond: 'Near Mint',     graded: true,  grade: 'PSA 9',   accent: '#E76F51', watching: 8 },
  { name: 'Pikachu Illustrator', status: 'showcased', price: null,    genre: 'Pokémon', cond: 'Excellent',     graded: true,  grade: 'CGC 8.5', accent: '#7C3AED', watching: 0 },
  { name: 'Lugia Neo Genesis',  status: 'private',   price: null,    genre: 'Pokémon', cond: 'Good',          graded: false, grade: null,      accent: '#10B981', watching: 0 },
  { name: 'Blastoise Base Set', status: 'market',    price: '$1,200', genre: 'Pokémon', cond: 'Near Mint',     graded: true,  grade: 'PSA 10',  accent: '#f59e0b', watching: 0 },
  { name: 'Charizard V Alt Art',status: 'showcased', price: null,    genre: 'Pokémon', cond: 'Mint',          graded: false, grade: null,      accent: '#E76F51', watching: 0 },
  { name: 'Gengar Base Set',    status: 'private',   price: null,    genre: 'Magic',   cond: 'Lightly Played',graded: false, grade: null,      accent: '#7C3AED', watching: 0 },
];

// New account portfolio — 3 private cards, no grades yet
const PORT_CARDS_NEW = [
  { name: 'Charizard Base Set', status: 'private', price: null, genre: 'Pokémon', cond: 'Good',     graded: false, grade: null, accent: '#E76F51', watching: 0 },
  { name: 'Pikachu Base Set',   status: 'private', price: null, genre: 'Pokémon', cond: 'Near Mint',graded: false, grade: null, accent: '#f59e0b', watching: 0 },
  { name: 'Mewtwo Base Set',    status: 'private', price: null, genre: 'Pokémon', cond: 'Good',     graded: false, grade: null, accent: '#7C3AED', watching: 0 },
];

// ── Portfolio sub-components ─────────────────────────────────────────

const CPortfolioCardItem = ({ t, dir, card }) => {
  const d = CDIR[dir];
  const isMarket = card.status === 'market';
  const isShowcased = card.status === 'showcased';
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', background: t.card, boxShadow: t.cardShadow }}>
      <div style={{ height: 96, background: `linear-gradient(145deg, ${t.surface}, ${card.accent})`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '52%', height: '70%', background: t.bg, borderRadius: 4, opacity: 0.14 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)' }} />
        {/* Grade badge — only shown if card is graded */}
        {card.graded && (
          <div style={{ position: 'absolute', top: 5, right: 5, padding: '2px 5px', borderRadius: 4, background: 'rgba(16,185,129,0.22)', color: '#10B981', fontSize: 7, fontWeight: 700 }}>{card.grade}</div>
        )}
        {/* Status icon — always shown */}
        <div style={{ position: 'absolute', top: 5, left: 5, width: 18, height: 18, borderRadius: 4, background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>
          {card.status === 'private' ? '🔒' : card.status === 'showcased' ? '⭐' : '🏷'}
        </div>
        {/* Watching count overlay — market only */}
        {isMarket && (
          <div style={{ position: 'absolute', bottom: 4, right: 5, padding: '1.5px 5px', borderRadius: 3, background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: 7, fontWeight: 500 }}>
            {card.watching > 0 ? `${card.watching} watching` : '0 watching'}
          </div>
        )}
      </div>
      <div style={{ padding: '6px 7px 8px' }}>
        <div style={{ fontSize: 9.5, fontWeight: dir === 1 ? 400 : 600, color: t.text, fontFamily: d.cardFont, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3, marginBottom: 2 }}>{card.name}</div>
        {isMarket ? (
          <div style={{ fontSize: dir === 3 ? 12 : 11, fontWeight: 700, color: t.coral, lineHeight: 1, marginBottom: 1 }}>{card.price}</div>
        ) : (
          <div style={{ fontSize: 8.5, color: isShowcased ? t.purple : t.textTer, fontWeight: isShowcased ? 600 : 400, lineHeight: 1, marginBottom: 1 }}>
            {card.status === 'private' ? '🔒 Private' : '⭐ Showcased'}
          </div>
        )}
        <div style={{ fontSize: 7.5, color: t.textTer, lineHeight: 1 }}>{card.genre} · {card.cond}</div>
      </div>
    </div>
  );
};

const CPortfolioCardGrid = ({ t, dir, cards }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
    {cards.map((card, i) => <CPortfolioCardItem key={i} t={t} dir={dir} card={card} />)}
  </div>
);

const CCollectionSwitcher = ({ t, dir }) => {
  const d = CDIR[dir];
  return (
    <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: d.chipR === 999 ? 999 : 10, background: t.surface, border: `1px solid ${t.border}` }}>
        <span style={{ fontSize: 12, color: t.textTer }}>📁</span>
        <span style={{ fontSize: 13, fontWeight: dir === 1 ? 400 : 600, color: t.text, fontFamily: dir === 1 ? d.hFont : d.uiFont }}>My Collection</span>
        <span style={{ fontSize: 10, color: t.textTer }}>▾</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 10px', borderRadius: d.chipR === 999 ? 999 : 10, background: t.coralMuted, border: `1px solid ${t.coral}` }}>
        <span style={{ fontSize: 14, color: t.coral, fontWeight: 700, lineHeight: 1 }}>+</span>
        <span style={{ fontSize: 11, color: t.coral, fontWeight: 700, fontFamily: d.uiFont }}>Collection</span>
      </div>
      <div style={{ marginLeft: 'auto', width: 30, height: 30, borderRadius: d.chipR === 999 ? 999 : 8, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textSec, fontSize: 14, flexShrink: 0 }}>⊟</div>
    </div>
  );
};

// ── Shared sub-components ─────────────────────────────────────────────

const CStatusBar = ({ t }) => (
  <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px 8px', position: 'relative', flexShrink: 0 }}>
    <span style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: "'DM Sans', sans-serif" }}>9:41</span>
    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 110, height: 26, background: '#000', borderRadius: '0 0 14px 14px' }} />
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', opacity: 0.65 }}>
      <svg width="14" height="10" viewBox="0 0 14 10" fill={t.text}><rect x="0" y="4" width="2.5" height="6" rx="0.8"/><rect x="3.8" y="2.5" width="2.5" height="7.5" rx="0.8"/><rect x="7.6" y="0.5" width="2.5" height="9.5" rx="0.8"/><rect x="11.4" y="0" width="2.5" height="10" rx="0.8" opacity="0.3"/></svg>
      <svg width="14" height="10" viewBox="0 0 14 10" fill={t.text}><path d="M7 2C9.2 2 11.1 2.9 12.4 4.4L13.5 3.2C11.9 1.5 9.6 0.5 7 0.5C4.4 0.5 2.1 1.5 0.5 3.2L1.6 4.4C2.9 2.9 4.8 2 7 2Z"/><path d="M7 4.5C8.5 4.5 9.8 5.1 10.8 6.1L11.9 4.9C10.6 3.6 8.9 2.8 7 2.8C5.1 2.8 3.4 3.6 2.1 4.9L3.2 6.1C4.2 5.1 5.5 4.5 7 4.5Z"/><circle cx="7" cy="8.5" r="1.5"/></svg>
      <div style={{ width: 22, height: 11, borderRadius: 2.5, border: `1.5px solid ${t.text}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 2, top: 2, bottom: 2, width: '70%', background: t.text, borderRadius: 1 }} />
        <div style={{ position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)', width: 3, height: 5, background: t.text, borderRadius: '0 1px 1px 0', opacity: 0.5 }} />
      </div>
    </div>
  </div>
);

const CTabBar = ({ t, active, dir }) => {
  const d = CDIR[dir];
  const tabs = [
    { id: 'home', label: 'Home', icon: '⌂' },
    { id: 'portfolio', label: 'Portfolio', icon: '◫' },
    { id: 'market', label: 'Market', icon: '◈' },
    { id: 'social', label: 'Social', icon: '◎' },
    { id: 'map', label: 'Map', icon: '⊕' },
  ];
  return (
    <div style={{ height: 56, display: 'flex', borderTop: `1px solid ${t.tabBorder}`, background: t.bg, flexShrink: 0 }}>
      {tabs.map(tab => {
        const on = tab.id === active;
        return (
          <div key={tab.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, color: on ? t.coral : t.tabInactive, position: 'relative' }}>
            {dir === 2 && on && <div style={{ position: 'absolute', top: 0, width: 28, height: 3, borderRadius: '0 0 3px 3px', background: t.coral }} />}
            <span style={{ fontSize: 17, lineHeight: 1 }}>{tab.icon}</span>
            <span style={{ fontSize: 9, fontWeight: on ? 700 : 500, fontFamily: d.uiFont, lineHeight: 1 }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const CSearchBar = ({ t, dir }) => {
  const d = CDIR[dir];
  return (
    <div style={{ margin: '0 16px 10px', padding: '9px 14px', borderRadius: d.chipR === 999 ? 999 : 10, background: t.surface, display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${t.border}`, flexShrink: 0 }}>
      <span style={{ fontSize: 13, color: t.textTer }}>⌕</span>
      <span style={{ fontSize: 13, color: t.textTer, fontFamily: "'DM Sans', sans-serif" }}>Search cards, sets, sellers...</span>
    </div>
  );
};

const CFilterChips = ({ t, dir, chips, active = 0, showFilter = false }) => {
  const d = CDIR[dir];
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 16px 12px', overflow: 'hidden', flexShrink: 0, alignItems: 'center' }}>
      {chips.map((chip, i) => (
        <div key={chip} style={{
          padding: '5px 12px', borderRadius: d.chipR,
          background: i === active ? t.coral : t.chipBg,
          color: i === active ? '#fff' : t.textSec,
          fontSize: 11, fontWeight: 600, fontFamily: d.uiFont,
          border: `1px solid ${i === active ? t.coral : t.border}`,
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>{chip}</div>
      ))}
      {showFilter && (
        <div style={{ marginLeft: 'auto', flexShrink: 0, width: 30, height: 28, borderRadius: d.chipR === 999 ? 999 : 8, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textSec, fontSize: 14 }}>⊟</div>
      )}
    </div>
  );
};

const CCardItem = ({ t, dir, card }) => {
  const d = CDIR[dir];
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', background: t.card, boxShadow: t.cardShadow }}>
      <div style={{ height: 96, background: `linear-gradient(145deg, ${t.surface}, ${card.accent})`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '52%', height: '70%', background: t.bg, borderRadius: 4, opacity: 0.14 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)' }} />
        <div style={{ position: 'absolute', top: 5, right: 5, padding: '2px 5px', borderRadius: 4, background: 'rgba(16,185,129,0.22)', color: '#10B981', fontSize: 7, fontWeight: 700 }}>{card.grade}</div>
        {dir === 2 && <div style={{ position: 'absolute', bottom: 4, left: 4, padding: '2px 5px', borderRadius: 3, background: 'rgba(0,0,0,0.52)', color: '#fff', fontSize: 7, fontWeight: 600 }}>{card.activity}</div>}
      </div>
      <div style={{ padding: '6px 7px 8px' }}>
        <div style={{ fontSize: 9.5, fontWeight: dir === 1 ? 400 : 600, color: t.text, fontFamily: d.cardFont, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3, marginBottom: 2 }}>{card.name}</div>
        <div style={{ fontSize: dir === 3 ? 12 : 11, fontWeight: 700, color: t.coral, lineHeight: 1 }}>{card.price}</div>
        {dir === 2 && <div style={{ fontSize: 7.5, color: t.purple, fontWeight: 600, fontFamily: "'Sora', sans-serif", marginTop: 1 }}>{card.activity}</div>}
      </div>
    </div>
  );
};

const CCardGrid = ({ t, dir }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
    {CARDS.map((card, i) => <CCardItem key={i} t={t} dir={dir} card={card} />)}
  </div>
);

// ── Portfolio Screen ───────────────────────────────────────────────────
const CPortfolioScreen = ({ theme, dir, hasFriends = true }) => {
  const t = theme === 'dark' ? cDarkT : cLightT;
  const d = CDIR[dir];
  const cards = hasFriends ? PORT_CARDS : PORT_CARDS_NEW;
  const statVal  = hasFriends ? ['$14,820', '247', '12'] : ['$—', '3', '1'];
  const statLbl  = [
    dir === 3 ? 'PORTFOLIO VALUE' : dir === 2 ? 'Total Value' : 'Value',
    dir === 3 ? 'CARDS' : 'Cards',
    dir === 3 ? 'SETS' : 'Sets',
  ];
  return (
    <div style={{ width: 390, height: 780, background: t.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      <CStatusBar t={t} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 20px 10px', flexShrink: 0 }}>
        <div>
          <div style={{ font: `${d.hWeight} ${d.hSz}px/1.1 ${d.hFont}`, color: t.text }}>My Collection</div>
          {dir === 2 && <div style={{ fontSize: 11, color: t.textSec, fontFamily: "'Sora', sans-serif", marginTop: 2 }}>{hasFriends ? '@jakescollects · 127 followers' : '@jakescollects · 0 followers'}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {dir === 1 && <div style={{ width: 30, height: 30, borderRadius: 8, border: `1.5px solid ${t.coral}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.coral, fontSize: 18, fontWeight: 300 }}>+</div>}
          {dir === 2 && <div style={{ padding: '6px 14px', borderRadius: 999, background: t.coralMuted, border: `1px solid ${t.coral}`, color: t.coral, fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>+ Add</div>}
          {dir === 3 && <div style={{ padding: '6px 12px', borderRadius: 6, background: t.coral, color: '#fff', fontSize: 11, fontWeight: 700 }}>+ Add Card</div>}
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>J</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', padding: '0 20px 14px', flexShrink: 0 }}>
        {statLbl.map((lbl, i) => (
          <div key={lbl} style={{ flex: 1, textAlign: i === 0 ? 'left' : 'center', borderLeft: i > 0 ? `1px solid ${t.border}` : 'none', paddingLeft: i > 0 ? 14 : 0 }}>
            <div style={{ font: `700 ${i === 0 && d.boldPrice ? 22 : 18}px/1.1 ${i === 0 ? d.hFont : "'DM Sans', sans-serif"}`, color: i === 0 ? (hasFriends ? t.coral : t.textTer) : t.text }}>{statVal[i]}</div>
            <div style={{ fontSize: 9, color: t.textTer, fontWeight: 600, textTransform: dir === 3 ? 'uppercase' : 'none', letterSpacing: dir === 3 ? '0.5px' : 0, marginTop: 2 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Dir 1 section label */}
      {dir === 1 && <div style={{ padding: '0 20px 8px', flexShrink: 0 }}><span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: t.textTer }}>All Cards</span></div>}

      {/* Collection switcher — replaces filter chips */}
      <CCollectionSwitcher t={t} dir={dir} />

      {/* Dir 2: friends banner — with or without friends */}
      {dir === 2 && (
        hasFriends ? (
          <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', flexShrink: 0 }}>
            <div style={{ flex: 1, padding: '8px 12px', borderRadius: 999, background: t.purpleMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>👥</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.purple, fontFamily: "'Sora', sans-serif" }}>3 friends collecting</div>
                <div style={{ fontSize: 9, color: t.textTer }}>See their collections →</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', flexShrink: 0 }}>
            <div style={{ flex: 1, padding: '8px 12px', borderRadius: 999, background: t.surface, border: `1px dashed ${t.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 14 }}>👋</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: t.textSec, fontFamily: "'Sora', sans-serif" }}>Find friends on Collectiv</div>
                <div style={{ fontSize: 9, color: t.textTer }}>See what they're collecting</div>
              </div>
              <div style={{ padding: '4px 10px', borderRadius: 999, background: t.purple, color: '#fff', fontSize: 10, fontWeight: 700, fontFamily: "'Sora', sans-serif", flexShrink: 0 }}>Invite</div>
            </div>
          </div>
        )
      )}

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 12px' }}>
        <CPortfolioCardGrid t={t} dir={dir} cards={cards} />
      </div>

      <CTabBar t={t} active="portfolio" dir={dir} />
    </div>
  );
};

// ── Card Detail Screen ─────────────────────────────────────────────────
const CCardDetailScreen = ({ theme, dir, mode = 'market', photo = 'own-front', h = 780, moreOpen = false, mine = false }) => {
  const t = theme === 'dark' ? cDarkT : cLightT;
  const d = CDIR[dir];
  const imgW = d.boldPrice ? 158 : 172;
  const imgH = Math.round(imgW / 0.714);
  const isMarket = mode === 'market';
  const isShowcase = mode === 'showcased';
  const isPrivate = mode === 'private';
  const statsRows = isMarket
    ? [['Watching','8'],['Offers','3'],['Listed','Jan 2024']]
    : isShowcase
    ? [['Genre','Pokémon'],['Condition','Near Mint'],['Added','Jan 2024']]
    : [['Genre','Pokémon'],['Condition','Near Mint'],['Added','Jan 2024']];

  // ── Photo section ──────────────────────────────────────────────
  let photoSection;
  if (photo === 'own-both') {
    photoSection = (
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 14, flexShrink: 0, padding: '0 24px' }}>
        {/* Front */}
        <div style={{ flex: 1, height: 193, borderRadius: 12, background: 'linear-gradient(145deg, #fde0d2, #E76F51)', boxShadow: `0 8px 24px rgba(231,111,81,0.25), ${t.cardShadow}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 52%)' }} />
          <div style={{ position: 'absolute', top: 6, right: 6, padding: '2px 6px', borderRadius: 4, background: t.greenMuted, color: t.green, fontSize: 8, fontWeight: 700 }}>✓ PSA 9</div>
          {isMarket   && <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '3px 8px', borderRadius: 999, background: 'rgba(0,0,0,0.5)',          color: '#fff',  fontSize: 8, fontWeight: 600 }}>🔥 8 watching</div>}
          {isShowcase && <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '3px 8px', borderRadius: 999, background: 'rgba(124,58,237,0.65)', color: '#fff',  fontSize: 8, fontWeight: 600 }}>⭐ Showcased</div>}
          {isPrivate  && <div style={{ position: 'absolute', bottom: 6, left: 6, padding: '3px 8px', borderRadius: 999, background: 'rgba(0,0,0,0.5)',          color: '#fff',  fontSize: 8, fontWeight: 600 }}>🔒 Private</div>}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 0 5px', background: 'linear-gradient(to top, rgba(0,0,0,0.28), transparent)', textAlign: 'center', fontSize: 8, color: 'rgba(255,255,255,0.85)', fontWeight: 700, letterSpacing: '0.5px' }}>FRONT</div>
        </div>
        {/* Back */}
        <div style={{ flex: 1, height: 193, borderRadius: 12, background: 'linear-gradient(145deg, #dfd0c8, #b89486)', boxShadow: t.cardShadow, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 52%)' }} />
          <div style={{ position: 'absolute', inset: '14px', borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, opacity: 0.5 }}>◈</div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 0 5px', background: 'linear-gradient(to top, rgba(0,0,0,0.28), transparent)', textAlign: 'center', fontSize: 8, color: 'rgba(255,255,255,0.85)', fontWeight: 700, letterSpacing: '0.5px' }}>BACK</div>
        </div>
      </div>
    );
  } else if (photo === 'reference') {
    const refW = imgW - 18;
    const refH = Math.round(refW / 0.714);
    photoSection = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10, flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: refW, height: refH, borderRadius: 12, background: 'linear-gradient(145deg, #fde0d2, #E76F51)', boxShadow: `0 8px 24px rgba(245,158,11,0.18)`, outline: `2.5px solid ${t.amber}`, outlineOffset: 3, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '60%', height: '76%', background: t.bg, borderRadius: 6, opacity: 0.14 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 52%)' }} />
          </div>
          <div style={{ position: 'absolute', bottom: -11, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', padding: '3px 10px', borderRadius: 999, background: t.amber, display: 'flex', alignItems: 'center', gap: 4, boxShadow: `0 2px 8px rgba(245,158,11,0.4)` }}>
            <span style={{ fontSize: 8, color: '#fff' }}>🔍</span>
            <span style={{ fontSize: 8.5, fontWeight: 800, color: '#fff', letterSpacing: '0.5px', fontFamily: "'Sora', sans-serif" }}>REFERENCE PHOTO</span>
          </div>
        </div>
        <div style={{ fontSize: 10.5, color: t.textTer, marginTop: 16 }}>Added via search · Not your actual card</div>
        {isPrivate && (
          <div style={{ marginTop: 7, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 999, background: t.coralMuted, border: `1px solid ${t.coral}` }}>
            <span style={{ fontSize: 10, color: t.coral }}>📷</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: t.coral, fontFamily: "'Sora', sans-serif" }}>Add your own photo</span>
          </div>
        )}
      </div>
    );
  } else {
    // own-front — default single hero image
    photoSection = (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, flexShrink: 0 }}>
        <div style={{ width: imgW, height: imgH, borderRadius: 12, background: 'linear-gradient(145deg, #fde0d2, #E76F51)', boxShadow: `0 10px 30px rgba(231,111,81,0.25), ${t.cardShadow}`, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '60%', height: '76%', background: t.bg, borderRadius: 6, opacity: 0.14 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 52%)' }} />
          <div style={{ position: 'absolute', top: 8, right: 8, padding: '3px 8px', borderRadius: 6, background: t.greenMuted, color: t.green, fontSize: 9, fontWeight: 700 }}>✓ PSA 9</div>
          {/* Front / Back toggle — tap to flip */}
          <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', padding: 2, borderRadius: 999, background: 'rgba(0,0,0,0.52)', border: '1px solid rgba(255,255,255,0.18)' }}>
            {['Front','Back'].map((s, i) => (
              <div key={s} style={{ padding: '3px 7px', borderRadius: 999, background: i === 0 ? 'rgba(255,255,255,0.92)' : 'transparent', color: i === 0 ? '#1a1a1a' : 'rgba(255,255,255,0.75)', fontSize: 8, fontWeight: 600 }}>{s}</div>
            ))}
          </div>
          {isMarket   && <div style={{ position: 'absolute', bottom: 8, left: 8 }}><div style={{ padding: '3px 8px', borderRadius: 999, background: 'rgba(0,0,0,0.5)',          color: '#fff', fontSize: 9, fontWeight: 600 }}>🔥 8 watching</div></div>}
          {isShowcase && <div style={{ position: 'absolute', bottom: 8, left: 8 }}><div style={{ padding: '3px 8px', borderRadius: 999, background: 'rgba(124,58,237,0.65)', color: '#fff', fontSize: 9, fontWeight: 600 }}>⭐ Showcased</div></div>}
          {isPrivate  && <div style={{ position: 'absolute', bottom: 8, left: 8 }}><div style={{ padding: '3px 8px', borderRadius: 999, background: 'rgba(0,0,0,0.5)',          color: '#fff', fontSize: 9, fontWeight: 600 }}>🔒 Private</div></div>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: 390, height: h, background: t.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      <CStatusBar t={t} />

      {/* Nav bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 10px', flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: d.chipR === 999 ? '50%' : 10, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: t.text }}>←</div>
        <span style={{ fontSize: 14, fontWeight: 600, color: t.text, fontFamily: d.uiFont }}>Card Detail</span>
        <div style={{ width: 32, height: 32, borderRadius: d.chipR === 999 ? '50%' : 10, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: t.text, letterSpacing: 1 }}>···</div>
      </div>

      {/* Card image — own-front / own-both / reference */}
      {photoSection}

      {/* Info section */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 20px' }}>
        <div style={{ font: `${d.hWeight} ${Math.round(d.hSz * 1.08)}px/1.2 ${d.hFont}`, color: t.text, marginBottom: 3 }}>Charizard — 1st Ed. Base Set</div>
        <div style={{ fontSize: 12, color: t.textSec, marginBottom: 8 }}>Pokémon · Holo Rare</div>

        {/* Showcase owner line */}
        {isShowcase && <div style={{ fontSize: 11, color: t.purple, fontWeight: 600, fontFamily: "'Sora',sans-serif", marginBottom: 8 }}>{mine ? 'In your showcase' : "In @pokevault's showcase"}</div>}

        {/* Private note */}
        {isPrivate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, padding: '6px 10px', borderRadius: 8, background: t.surface, border: `1px solid ${t.border}` }}>
            <span style={{ fontSize: 11 }}>🔒</span>
            <span style={{ fontSize: 11, color: t.textSec }}>Only you can see this card</span>
          </div>
        )}

        {/* Price — market only */}
        {isMarket && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: dir === 2 ? 10 : 14 }}>
            <div style={{ fontSize: d.boldPrice ? 32 : 26, fontWeight: 700, color: t.coral, fontFamily: dir === 1 ? d.hFont : "'DM Sans',sans-serif", lineHeight: 1 }}>$2,450</div>
            <div style={{ fontSize: 11, color: t.textTer }}>+ $12 shipping</div>
            {dir === 3 && <div style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 6, background: t.amberMuted, color: t.amber, fontSize: 10, fontWeight: 700 }}>+12% 30d</div>}
          </div>
        )}

        {/* Social proof — dir 2 market (your own listing activity) */}
        {dir === 2 && isMarket && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 12px', borderRadius: 10, background: t.purpleMuted }}>
            <div style={{ display: 'flex' }}>
              {['A','M','D'].map((l, i) => (
                <div key={l} style={{ width: 20, height: 20, borderRadius: '50%', background: [t.coral, t.purple, t.green][i], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8, fontWeight: 700, marginLeft: i > 0 ? -5 : 0, border: `2px solid ${t.bg}` }}>{l}</div>
              ))}
            </div>
            <span style={{ fontSize: 11, color: t.purple, fontWeight: 600, fontFamily: "'Sora',sans-serif" }}>8 watching · 3 offers received</span>
          </div>
        )}

        {/* Social proof — dir 2 showcase */}
        {dir === 2 && isShowcase && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 12px', borderRadius: 10, background: t.purpleMuted }}>
            <div style={{ display: 'flex' }}>
              {['J','M'].map((l, i) => (
                <div key={l} style={{ width: 20, height: 20, borderRadius: '50%', background: [t.coral, t.purple][i], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8, fontWeight: 700, marginLeft: i > 0 ? -5 : 0, border: `2px solid ${t.bg}` }}>{l}</div>
              ))}
            </div>
            <span style={{ fontSize: 11, color: t.purple, fontWeight: 600, fontFamily: "'Sora',sans-serif" }}>{mine ? '2 friends also showcase this' : '2 friends have this showcased'}</span>
          </div>
        )}

        {/* Likes & comments engagement — showcase */}
        {isShowcase && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16, color: t.coral }}>♥</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: t.text, fontFamily: "'Sora',sans-serif" }}>128</span>
              <span style={{ fontSize: 11, color: t.textTer }}>likes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 15, color: t.textSec }}>💬</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: t.text, fontFamily: "'Sora',sans-serif" }}>24</span>
              <span style={{ fontSize: 11, color: t.textTer }}>comments</span>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex' }}>
              {['A','M','D','K'].map((l, i) => (
                <div key={l} style={{ width: 22, height: 22, borderRadius: '50%', background: [t.coral, t.purple, t.green, t.amber][i], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 8.5, fontWeight: 700, marginLeft: i > 0 ? -6 : 0, border: `2px solid ${t.bg}` }}>{l}</div>
              ))}
            </div>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {statsRows.map(([k, v]) => (
            <div key={k} style={{ flex: 1, padding: '8px', borderRadius: 10, background: t.surface, textAlign: 'center', border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 9, color: t.textTer, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: t.text }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Owner / Seller card */}
        {isShowcase && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, padding: '10px 12px', borderRadius: 12, background: mine ? t.purpleMuted : t.surface, border: `1px solid ${mine ? t.purple : t.border}` }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: mine ? t.purple : t.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{mine ? 'J' : 'P'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{mine ? '@jakescollects' : '@pokevault'}</div>
              <div style={{ fontSize: 10, color: t.purple, marginTop: 1 }}>{mine ? '⭐ Your showcase · Not for sale' : '⭐ Showcase · 47 cards'}</div>
            </div>
            {!mine && <span style={{ fontSize: 15, color: t.textTer }}>›</span>}
          </div>
        )}

        {/* Your listing row — market is YOUR own listing */}
        {isMarket && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, padding: '10px 12px', borderRadius: 12, background: t.coralMuted, border: `1px solid ${t.coral}` }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>J</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>@jakescollects</div>
              <div style={{ fontSize: 10, color: t.coral, marginTop: 1, fontWeight: 600 }}>🏷 Your listing · Live on Market</div>
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 999, background: t.bg, border: `1px solid ${t.coral}` }}>
              <span style={{ fontSize: 10, color: t.coral, fontWeight: 700 }}>Manage</span>
            </div>
          </div>
        )}

        {/* Your own card row */}
        {isPrivate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, padding: '10px 12px', borderRadius: 12, background: t.surface, border: `1px solid ${t.border}` }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>J</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>@jakescollects</div>
              <div style={{ fontSize: 10, color: t.textSec, marginTop: 1 }}>Your card · My Collection</div>
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 999, background: t.coralMuted, border: `1px solid ${t.coral}` }}>
              <span style={{ fontSize: 10, color: t.coral, fontWeight: 700 }}>Edit</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {isMarket && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, padding: '13px 0', borderRadius: d.chipR === 999 ? 999 : 12, border: `1.5px solid ${t.coral}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.coral, fontSize: 13, fontWeight: 700 }}>Edit Listing</div>
            <div style={{ flex: 1, padding: '13px 0', borderRadius: d.chipR === 999 ? 999 : 12, background: t.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>Mark as Sold</div>
          </div>
        )}
        {isShowcase && (
          <div style={{ display: 'flex', gap: 10 }}>
            {mine ? (
              <React.Fragment>
                <div style={{ flex: 1, padding: '13px 0', borderRadius: d.chipR === 999 ? 999 : 12, border: `1.5px solid ${t.purple}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.purple, fontSize: 13, fontWeight: 700 }}>View 24 comments</div>
                <div style={{ flex: 1, padding: '13px 0', borderRadius: d.chipR === 999 ? 999 : 12, background: t.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>Edit Showcase</div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div style={{ flex: 1, padding: '13px 0', borderRadius: d.chipR === 999 ? 999 : 12, background: t.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>👍 Like</div>
                <div style={{ flex: 1, padding: '13px 0', borderRadius: d.chipR === 999 ? 999 : 12, border: `1.5px solid ${t.purple}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.purple, fontSize: 13, fontWeight: 700 }}>💬 Comment</div>
              </React.Fragment>
            )}
          </div>
        )}
        {isPrivate && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, padding: '13px 0', borderRadius: d.chipR === 999 ? 999 : 12, border: `1.5px solid ${t.coral}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.coral, fontSize: 13, fontWeight: 700 }}>Edit Details</div>
            <div style={{ flex: 1, padding: '13px 0', borderRadius: d.chipR === 999 ? 999 : 12, background: t.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>Change Visibility</div>
          </div>
        )}
      </div>

      <CTabBar t={t} active="portfolio" dir={dir} />

      {/* ··· more action sheet (showcase) */}
      {moreOpen && (() => {
        const acts = [
          ['🔗','Share card','Copy a link to this showcase'],
          ['📋','Copy card details',null],
          ['🔖','Save to my watchlist',null],
          ['🙋','Ask owner about this card',null],
          ['🚩','Report card','Flag inappropriate content', true],
          ['🚫','Hide from my feed',null, true],
        ];
        return (
          <React.Fragment>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(14,13,12,0.42)', zIndex: 30 }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: t.bg, borderRadius: '22px 22px 0 0', zIndex: 31, boxShadow: '0 -12px 40px rgba(26,18,16,0.2)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
                <div style={{ width: 38, height: 4.5, borderRadius: 3, background: t.textTer }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 18px 14px', borderBottom: `1px solid ${t.border}` }}>
                <div style={{ width: 40, height: 56, borderRadius: 7, background: 'linear-gradient(145deg,#fde0d2,#E76F51)', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: t.text, fontFamily: "'Sora',sans-serif" }}>Charizard — 1st Ed. Base Set</div>
                  <div style={{ fontSize: 10.5, color: t.textTer, marginTop: 1 }}>In @pokevault's showcase</div>
                </div>
              </div>
              {acts.map(([i, l, s, danger], idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 18px', borderBottom: `1px solid ${t.border}`, background: danger ? 'rgba(231,111,81,0.05)' : 'transparent' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: danger ? 'rgba(231,111,81,0.1)' : t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{i}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: danger ? t.coral : t.text, fontFamily: "'Sora',sans-serif" }}>{l}</div>
                    {s && <div style={{ fontSize: 10.5, color: t.textTer, marginTop: 1 }}>{s}</div>}
                  </div>
                </div>
              ))}
              <div style={{ height: 14 }} />
            </div>
          </React.Fragment>
        );
      })()}
    </div>
  );
};

// ── Marketplace Screen ─────────────────────────────────────────────────
const CMarketScreen = ({ theme, dir }) => {
  const t = theme === 'dark' ? cDarkT : cLightT;
  const d = CDIR[dir];
  return (
    <div style={{ width: 390, height: 780, background: t.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      <CStatusBar t={t} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 20px 8px', flexShrink: 0 }}>
        <div style={{ font: `${d.hWeight} ${d.hSz}px/1.1 ${d.hFont}`, color: t.text }}>Marketplace</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {dir === 2 && (
            <div style={{ position: 'relative' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.purpleMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🔔</div>
              <div style={{ position: 'absolute', top: 1, right: 1, width: 7, height: 7, borderRadius: '50%', background: t.coral, border: `1.5px solid ${t.bg}` }} />
            </div>
          )}
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>J</div>
        </div>
      </div>

      <CSearchBar t={t} dir={dir} />

      {/* Dir 1: editorial banner */}
      {dir === 1 && (
        <div style={{ margin: '0 16px 10px', padding: '10px 14px', borderRadius: 10, background: t.coralMuted, border: `1px solid ${t.border}`, flexShrink: 0 }}>
          <div style={{ font: `400 13px/1.3 'DM Serif Display', serif`, color: t.coral }}>Featured · Pokémon 1st Edition Week</div>
          <div style={{ fontSize: 10, color: t.textSec, marginTop: 2 }}>Curated listings from verified sellers</div>
        </div>
      )}

      {/* Dir 2: For You / Following tabs */}
      {dir === 2 && (
        <div style={{ display: 'flex', gap: 4, padding: '0 16px 10px', flexShrink: 0 }}>
          {['For You', 'Following', 'Trending'].map((tab, i) => (
            <div key={tab} style={{ padding: '6px 14px', borderRadius: 999, background: i === 0 ? t.coral : 'transparent', color: i === 0 ? '#fff' : t.textSec, fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>{tab}</div>
          ))}
        </div>
      )}

      {/* Dir 3: Sort + filter row */}
      {dir === 3 && (
        <div style={{ display: 'flex', gap: 6, padding: '0 16px 10px', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 9.5, color: t.textTer, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 }}>Sort:</div>
          {['Price ↓', 'Grade', 'Recent'].map((s, i) => (
            <div key={s} style={{ padding: '4px 10px', borderRadius: 6, background: i === 0 ? t.coralMuted : t.surface, border: `1px solid ${i === 0 ? t.coral : t.border}`, color: i === 0 ? t.coral : t.textSec, fontSize: 11, fontWeight: 700 }}>{s}</div>
          ))}
          <div style={{ marginLeft: 'auto', width: 28, height: 28, borderRadius: 6, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textSec, fontSize: 13 }}>⊟</div>
        </div>
      )}

      <CFilterChips t={t} dir={dir} chips={['All', 'Pokémon', 'Magic', 'Sports', 'Yu-Gi-Oh']} showFilter={true} />

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 12px' }}>
        <CCardGrid t={t} dir={dir} />
      </div>

      <CTabBar t={t} active="market" dir={dir} />
    </div>
  );
};

// ── Social Screen ──────────────────────────────────────────────────────
const CSocialScreen = ({ theme, dir }) => {
  const t = theme === 'dark' ? cDarkT : cLightT;
  const d = CDIR[dir];
  const feed = [
    { user: 'Jake C.', av: 'J', avBg: '#E76F51', action: 'sold', card: 'Charizard 1st Ed.', price: '$2,450', grade: 'PSA 9', time: '2m ago', accent: '#E76F51', likes: 14 },
    { user: 'Maria R.', av: 'M', avBg: '#7C3AED', action: 'listed', card: 'Pikachu Illustrator', price: '$85,000', grade: 'CGC 8.5', time: '18m ago', accent: '#7C3AED', likes: 32 },
    { user: 'Alex T.', av: 'A', avBg: '#10B981', action: 'completed', card: 'Base Set', badge: '102/102 cards', time: '1h ago', accent: '#10B981', likes: 87 },
  ];
  return (
    <div style={{ width: 390, height: 780, background: t.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      <CStatusBar t={t} />
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 20px 10px', flexShrink: 0 }}>
        <div style={{ font: `${d.hWeight} ${d.hSz}px/1.1 ${d.hFont}`, color: t.text }}>{dir === 2 ? 'Community' : 'Social'}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {dir === 2 && (
            <div style={{ position: 'relative' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.purpleMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🔔</div>
              <div style={{ position: 'absolute', top: 1, right: 1, width: 7, height: 7, borderRadius: '50%', background: t.coral, border: `1.5px solid ${t.bg}` }} />
            </div>
          )}
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.coral, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>J</div>
        </div>
      </div>
      {/* Sub-nav */}
      {dir === 2 ? (
        <div style={{ display: 'flex', gap: 4, padding: '0 16px 12px', flexShrink: 0 }}>
          {['Feed', 'Groups', 'Events', 'Nearby'].map((tab, i) => (
            <div key={tab} style={{ padding: '6px 13px', borderRadius: 999, background: i === 0 ? t.coral : 'transparent', color: i === 0 ? '#fff' : t.textSec, fontSize: 12, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>{tab}</div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', borderBottom: `1px solid ${t.border}`, padding: '0 20px', marginBottom: 12, flexShrink: 0 }}>
          {['Feed', 'Groups', 'Events'].map((tab, i) => (
            <div key={tab} style={{ padding: '6px 16px 10px', fontSize: 13, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? t.coral : t.textTer, borderBottom: i === 0 ? `2px solid ${t.coral}` : '2px solid transparent', marginBottom: -1, fontFamily: d.uiFont }}>{tab}</div>
          ))}
        </div>
      )}
      {/* Feed items */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {feed.map((item, idx) => (
          <div key={idx} style={{ padding: '12px', borderRadius: 12, background: t.surface, border: `1px solid ${t.border}` }}>
            {/* Item header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: item.avBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{item.av}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text, fontFamily: d.uiFont }}>{item.user}</div>
                <div style={{ fontSize: 10, color: t.textTer }}>{item.time}</div>
              </div>
              {dir === 3 && item.action !== 'completed' && (
                <div style={{ padding: '3px 8px', borderRadius: 6, background: item.action === 'sold' ? t.greenMuted : t.coralMuted, color: item.action === 'sold' ? t.green : t.coral, fontSize: 10, fontWeight: 700 }}>{item.action === 'sold' ? 'SOLD' : 'LISTED'}</div>
              )}
            </div>
            {/* Item body */}
            {item.action === 'completed' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: t.textSec }}>Completed set</div>
                  <div style={{ font: `${dir === 1 ? '400' : '600'} 14px/1.2 ${dir === 1 ? d.hFont : d.uiFont}`, color: t.text }}>{item.card}</div>
                  <div style={{ fontSize: 11, color: item.accent, fontWeight: 600, marginTop: 2 }}>🏆 {item.badge}</div>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${t.surface}, ${item.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🎖️</div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 62, borderRadius: 6, background: `linear-gradient(145deg, ${t.surface}, ${item.accent})`, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: t.textSec }}>{item.action === 'sold' ? 'Just sold' : 'New listing'}</div>
                  <div style={{ font: `${dir === 1 ? '400' : '600'} 13px/1.2 ${dir === 1 ? d.hFont : d.uiFont}`, color: t.text }}>{item.card}</div>
                  <div style={{ fontSize: 10, color: t.textTer, marginTop: 1 }}>{item.grade}</div>
                  <div style={{ fontSize: dir === 3 ? 15 : 13, fontWeight: 700, color: t.coral, marginTop: 2 }}>{item.price}</div>
                </div>
              </div>
            )}
            {/* Reactions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, paddingTop: 8, borderTop: `1px solid ${t.border}` }}>
              {dir === 2 ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: t.coral, fontSize: 12, fontWeight: 600, fontFamily: "'Sora', sans-serif" }}>🔥 {item.likes}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: t.textSec, fontSize: 12 }}>💬 3</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: t.textSec, fontSize: 12 }}>↗ Share</div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    {['J','M'].map((l, i) => (
                      <div key={l} style={{ width: 16, height: 16, borderRadius: '50%', background: [t.coral, t.purple][i], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 7, fontWeight: 700, marginLeft: i > 0 ? -4 : 0, border: `1.5px solid ${t.bg}` }}>{l}</div>
                    ))}
                    <span style={{ fontSize: 10, color: t.textTer, marginLeft: 5 }}>+{item.likes - 2}</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 11, color: t.textSec }}>🔥 {item.likes} reactions</div>
                  <div style={{ fontSize: 11, color: t.textSec }}>💬 3 comments</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <CTabBar t={t} active="social" dir={dir} />
    </div>
  );
};

// ── Map Screen ─────────────────────────────────────────────────────────
const CMapScreen = ({ theme, dir }) => {
  const t = theme === 'dark' ? cDarkT : cLightT;
  const d = CDIR[dir];
  const stores = [
    { name: 'Card Kingdom', cats: 'Pokémon · Magic · Sports', dist: '0.3 mi', rating: '4.9', open: true, accent: t.coral },
    { name: "Collector's Cave", cats: 'Comics · Graded · Vintage', dist: '1.2 mi', rating: '4.7', open: true, accent: t.purple },
    { name: 'TCG Realm', cats: 'All Trading Cards', dist: '2.8 mi', rating: '4.5', open: false, accent: t.green },
  ];
  return (
    <div style={{ width: 390, height: 780, background: t.bg, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif" }}>
      <CStatusBar t={t} />
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 20px 10px', flexShrink: 0 }}>
        <div style={{ font: `${d.hWeight} ${d.hSz}px/1.1 ${d.hFont}`, color: t.text }}>
          {dir === 1 ? 'Nearby Stores' : dir === 2 ? 'Explore Map' : 'Find Stores'}
        </div>
        <div style={{ padding: '6px 12px', borderRadius: d.chipR === 999 ? 999 : 8, background: t.surface, border: `1px solid ${t.border}`, fontSize: 11, fontWeight: 600, color: t.textSec }}>⊟ Filter</div>
      </div>
      {/* Map */}
      <div style={{ height: 310, background: '#ddecd5', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {/* Grid */}
        {[0,1,2,3,4,5,6,7,8,9].map(i => <div key={`h${i}`} style={{ position: 'absolute', left: 0, right: 0, top: i * 31, height: 1, background: 'rgba(0,0,0,0.06)' }} />)}
        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => <div key={`v${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: i * 33, width: 1, background: 'rgba(0,0,0,0.06)' }} />)}
        {/* Roads */}
        <div style={{ position: 'absolute', top: '42%', left: 0, right: 0, height: 14, background: 'rgba(255,255,255,0.75)' }} />
        <div style={{ position: 'absolute', left: '36%', top: 0, bottom: 0, width: 11, background: 'rgba(255,255,255,0.75)' }} />
        <div style={{ position: 'absolute', left: '66%', top: 0, bottom: 0, width: 7, background: 'rgba(255,255,255,0.6)' }} />
        <div style={{ position: 'absolute', top: '68%', left: 0, right: 0, height: 8, background: 'rgba(255,255,255,0.6)' }} />
        {/* Buildings */}
        {[[55,18,55,38],[158,48,42,30],[278,10,75,48],[318,60,48,32],[28,78,42,28],[218,28,34,24],[100,58,30,22]].map(([l,tp,w,h],i) => (
          <div key={i} style={{ position: 'absolute', left: l, top: tp, width: w, height: h, background: 'rgba(0,0,0,0.07)', borderRadius: 2 }} />
        ))}
        {/* Store pins */}
        <div style={{ position: 'absolute', top: '36%', left: '29%', transform: 'translate(-50%, -100%)' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50% 50% 50% 0', background: t.coral, transform: 'rotate(-45deg)', boxShadow: '0 3px 10px rgba(231,111,81,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ transform: 'rotate(45deg)', fontSize: 13 }}>🏪</span>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '58%', left: '63%', transform: 'translate(-50%, -100%)' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50% 50% 50% 0', background: t.purple, transform: 'rotate(-45deg)', boxShadow: '0 3px 10px rgba(124,58,237,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ transform: 'rotate(45deg)', fontSize: 11 }}>🏪</span>
          </div>
        </div>
        <div style={{ position: 'absolute', top: '22%', left: '76%', transform: 'translate(-50%, -100%)' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50% 50% 50% 0', background: t.green, transform: 'rotate(-45deg)', boxShadow: '0 3px 10px rgba(16,185,129,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ transform: 'rotate(45deg)', fontSize: 10 }}>🏪</span>
          </div>
        </div>
        {/* Event pin — dir 2 */}
        {dir === 2 && (
          <div style={{ position: 'absolute', top: '72%', left: '46%', transform: 'translate(-50%, -100%)' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50% 50% 50% 0', background: t.amber, transform: 'rotate(-45deg)', boxShadow: '0 3px 10px rgba(245,158,11,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ transform: 'rotate(45deg)', fontSize: 12 }}>🎪</span>
            </div>
          </div>
        )}
        {/* User dot */}
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#2563eb', border: '3px solid #fff', boxShadow: '0 0 0 7px rgba(37,99,235,0.15)' }} />
        </div>
        {/* Dir 2: friends nearby pill */}
        {dir === 2 && (
          <div style={{ position: 'absolute', bottom: 10, left: 12, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex' }}>
              {['M','A'].map((l, i) => <div key={l} style={{ width: 18, height: 18, borderRadius: '50%', background: [t.purple, t.coral][i], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 7, fontWeight: 700, marginLeft: i > 0 ? -4 : 0, border: `1.5px solid #fff` }}>{l}</div>)}
            </div>
            <span style={{ fontSize: 11, color: t.purple, fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>2 friends nearby</span>
          </div>
        )}
        {/* Dir 3: store count chip */}
        {dir === 3 && (
          <div style={{ position: 'absolute', bottom: 10, right: 12, padding: '6px 14px', borderRadius: 8, background: t.coral, boxShadow: '0 2px 8px rgba(231,111,81,0.35)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>3 Stores</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>within 5 mi</span>
          </div>
        )}
      </div>
      {/* Store list */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: t.textTer, marginBottom: 2 }}>
          {dir === 1 ? 'Nearby' : dir === 2 ? 'Stores & Events' : `${stores.length} Stores Found`}
        </div>
        {stores.map((store, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, background: t.surface, border: `1px solid ${t.border}` }}>
            <div style={{ width: 36, height: 36, borderRadius: d.chipR === 999 ? '50%' : 10, background: store.accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏪</div>
            <div style={{ flex: 1 }}>
              <div style={{ font: `600 13px/1.2 ${dir === 1 ? d.hFont : d.uiFont}`, color: t.text }}>{store.name}</div>
              <div style={{ fontSize: 10, color: t.textTer, marginTop: 1 }}>{store.cats}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: dir === 3 ? 13 : 12, fontWeight: 700, color: t.text }}>{store.dist}</div>
              <div style={{ fontSize: 10, color: store.open ? t.green : t.textTer, fontWeight: 600 }}>{store.open ? 'Open' : 'Closed'}</div>
            </div>
          </div>
        ))}
      </div>
      <CTabBar t={t} active="map" dir={dir} />
    </div>
  );
};

Object.assign(window, { CPortfolioScreen, CCardDetailScreen, CMarketScreen, CSocialScreen, CMapScreen });

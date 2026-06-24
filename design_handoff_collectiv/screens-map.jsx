// screens-map.jsx — Collectiv · Map Tab · Direction 2 (FINAL)
// Google-Maps-style warm canvas. 3 uniform circular icon pins, NO clusters:
//   👤 Seller — the user's PROFILE AVATAR (initial); pins an approx meetup area
//   🏪 Vendor — a storefront at an exact place you can visit
//   📅 Event  — shows / meetups / breaks (hand off to Social)
// Chip model = Google Maps: Sellers / Vendors / Events, none selected by default
// → sheet CLOSED. Tap a chip → filter map + open sheet to HALF. Sheet has a
// close ✕ and can fully close. Tappable "Edmonton, AB · 25 km" = invisible radius.

// ── Tokens (match MV_/SC_) ────────────────────────────────────────────────────
const MP = {
  bg:'#fef9f5', surface:'#fef0e8', card:'#ffffff',
  text:'#1a1210', sec:'#6b5c52', ter:'#aa9a90', border:'#f0ddd0',
  coral:'#E76F51', coralM:'rgba(231,111,81,0.10)',
  purple:'#7C3AED', purpleM:'rgba(124,58,237,0.10)',
  green:'#10B981', greenM:'rgba(16,185,129,0.12)',
  amber:'#f59e0b', blue:'#2563eb',
  shadow:'0 2px 8px rgba(26,18,16,0.07),0 1px 2px rgba(26,18,16,0.04)',
  shadowUp:'0 -10px 32px rgba(26,18,16,0.14)',
  tabI:'rgba(26,18,16,0.28)',
  land:'#ece1d4', block:'#e4d7c7', street:'#f6eee4', arterial:'#ffffff',
  park:'#d6e3c8', parkEdge:'#9bb084', water:'#cedcea', waterEdge:'#bcd0e2',
  label:'#b3a293',
};
const MPS = {fontFamily:"'Sora',sans-serif"};
const MPD = {fontFamily:"'DM Sans',sans-serif"};
const CARD_THUMBS = ['#E76F51','#10B981','#2563eb','#f59e0b','#7C3AED'];
const TYPE_ACCENT = {Sellers:MP.coral, Vendors:MP.purple, Events:MP.green};

// ── Data — near Edmonton; positions are %within the map canvas ────────────────
const MP_SELLERS = [
  {id:'s1', kind:'seller', name:'Marcus Chen',   handle:'mchen_cards',   av:'M', cards:12, area:'Downtown',     dist:'2.4 km', rating:'4.9', reviews:48, color:'#E76F51', desc:'NBA & vintage hoops collector. Mostly graded singles — PSA/BGS. Happy to meet downtown or near Whyte Ave for local pickups. No shipping.', x:27, y:31},
  {id:'s2', kind:'seller', name:'Ava Rodriguez', handle:'avapulls',      av:'A', cards:7,  area:'Oliver',       dist:'5.8 km', rating:'4.8', color:'#E76F51', x:60, y:21},
  {id:'s3', kind:'seller', name:'Jordan Blake',  handle:'jblake_psa',    av:'J', cards:21, area:'Whyte Ave',    dist:'7.2 km', rating:'5.0', color:'#E76F51', x:45, y:52},
  {id:'s4', kind:'seller', name:'Priya Nair',    handle:'priya_breaks',  av:'P', cards:5,  area:'Sherwood Park',dist:'8.9 km', rating:'4.7', color:'#E76F51', x:72, y:39},
  {id:'s5', kind:'seller', name:'Diego Santos',  handle:'dsantos_rc',    av:'D', cards:9,  area:'West End',     dist:'11 km',  rating:'4.9', color:'#E76F51', x:21, y:60},
  {id:'s6', kind:'seller', name:'Kayla Brooks',  handle:'kb_collects',   av:'K', cards:14, area:'Mill Woods',   dist:'5.4 km', rating:'4.8', color:'#E76F51', x:80, y:60},
];
const MP_VENDORS = [
  {id:'v1', kind:'vendor', name:'Sportscards YEG', handle:'sportscards_yeg', listings:48, reviews:126, area:'104 St & Jasper Ave, Edmonton, AB', dist:'2.4 km', rating:'4.9', hours:'10 AM – 7 PM', open:true,  desc:'Edmonton’s go-to shop for graded singles, sealed wax, and supplies. Walk-ins welcome — on-site PSA submission every Saturday.', x:39, y:41},
  {id:'v2', kind:'vendor', name:'Graded Gems Co.', handle:'graded_gems_co',  listings:31, area:'Whyte Ave',          dist:'5.8 km', rating:'4.8', hours:'11 AM – 6 PM', open:false, x:55, y:60},
];
const MP_EVENTS = [
  {id:'e1', kind:'event', title:'Edmonton Card Show 2026', m:'JUN', d:'14', loc:'Edmonton EXPO Centre', addr:'7515 118 Ave NW, Edmonton, AB T5B 0V3', host:'Edmonton Card Collectors', dateLong:'Saturday, June 14, 2026', going:142, type:'Card Show', time:'8:00 AM – 5:00 PM', tags:['Sports','Vintage','Graded'], color:'#10B981', x:66, y:50,
   about:'Western Canada’s biggest sports-card show returns. 120+ tables, on-site PSA grading, live breaks and dealer trades all day.'},
  {id:'e2', kind:'event', title:'Trade Night Meetup', m:'JUN', d:'27', loc:'Sherwood Park Mall', going:24, type:'Meetup', time:'6:00 PM – 9:00 PM', tags:['Sports','Casual'], color:'#10B981', x:31, y:45,
   about:'Low-key weekly trade night for local collectors. Bring your binders and trade bait — all sports welcome.'},
];
const MP_BYID = {};
[...MP_SELLERS, ...MP_VENDORS, ...MP_EVENTS].forEach(p => { MP_BYID[p.id] = p; });

// ── Phone shell ───────────────────────────────────────────────────────────────
const MP_Phone = ({children, h=780}) => (
  <div style={{width:390, height:h, background:MP.bg, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative', ...MPD}}>{children}</div>
);
const MP_SB = () => (
  <div style={{height:44, display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'0 20px 8px', flexShrink:0, position:'relative', zIndex:6}}>
    <span style={{fontSize:13, fontWeight:600, color:MP.text, ...MPS}}>9:41</span>
    <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:110, height:26, background:'#000', borderRadius:'0 0 14px 14px'}}/>
    <div style={{display:'flex', gap:5, alignItems:'center', opacity:0.65}}>
      <span style={{fontSize:10, color:MP.text}}>▲▲▲</span>
      <div style={{width:22, height:11, borderRadius:2.5, border:`1.5px solid ${MP.text}`, position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', left:2, top:2, bottom:2, width:'70%', background:MP.text, borderRadius:1}}/>
      </div>
    </div>
  </div>
);
const MP_TB = () => {
  const tabs = [
    {id:'home',label:'Home',icon:'⌂'},{id:'portfolio',label:'Portfolio',icon:'◫'},
    {id:'market',label:'Market',icon:'◈'},{id:'social',label:'Social',icon:'◎'},{id:'map',label:'Map',icon:'⊕'},
  ];
  return (
    <div style={{height:56, display:'flex', borderTop:`1px solid ${MP.border}`, background:MP.bg, flexShrink:0, zIndex:6}}>
      {tabs.map(t => {
        const on = t.id === 'map';
        return (
          <div key={t.id} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, color:on?MP.coral:MP.tabI, position:'relative'}}>
            {on && <div style={{position:'absolute', top:0, width:28, height:3, borderRadius:'0 0 3px 3px', background:MP.coral}}/>}
            <span style={{fontSize:17, lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:9, fontWeight:on?700:500, ...MPS, lineHeight:1}}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── Map canvas — warm street map (geometric placeholder) ──────────────────────
const mapLabel = {fontSize:10, fontWeight:700, letterSpacing:'1.5px', color:MP.label, ...MPS, pointerEvents:'none'};
const MP_MapCanvas = ({children, dim, zoom=1}) => (
  <div style={{position:'absolute', inset:0, overflow:'hidden'}}>
    <div style={{position:'absolute', inset:0, transform:`scale(${zoom})`, transformOrigin:'62% 33%', transition:'transform .5s cubic-bezier(.3,.8,.3,1)'}}>
      <svg width="100%" height="100%" viewBox="0 0 390 680" preserveAspectRatio="xMidYMid slice" style={{position:'absolute', inset:0, display:'block'}}>
        <rect width="390" height="680" fill={MP.land}/>
        <g fill={MP.block}>
          <rect x="160" y="100" width="58" height="58"/><rect x="228" y="100" width="58" height="58"/>
          <rect x="160" y="172" width="58" height="46"/><rect x="228" y="172" width="58" height="46"/>
          <rect x="70" y="280" width="54" height="40"/><rect x="306" y="172" width="48" height="46"/>
        </g>
        <rect x="248" y="296" width="118" height="122" rx="11" fill={MP.park}/>
        <g stroke={MP.street} strokeWidth="3" strokeLinecap="round">
          <line x1="0" y1="90" x2="390" y2="90"/><line x1="0" y1="170" x2="390" y2="170"/>
          <line x1="0" y1="330" x2="390" y2="330"/><line x1="0" y1="410" x2="390" y2="410"/>
          <line x1="0" y1="470" x2="390" y2="470"/>
          <line x1="60" y1="0" x2="60" y2="680"/><line x1="228" y1="0" x2="228" y2="680"/>
          <line x1="300" y1="0" x2="300" y2="680"/><line x1="360" y1="0" x2="360" y2="680"/>
        </g>
        <g stroke={MP.arterial} strokeWidth="7" strokeLinecap="round">
          <line x1="0" y1="250" x2="390" y2="250"/><line x1="150" y1="0" x2="150" y2="680"/>
          <line x1="-20" y1="610" x2="410" y2="395"/>
        </g>
        <path d="M-20,498 C120,546 214,470 410,516 L410,700 L-20,700 Z" fill={MP.water}/>
        <path d="M-20,498 C120,546 214,470 410,516" fill="none" stroke={MP.waterEdge} strokeWidth="2"/>
      </svg>
      <div style={{position:'absolute', left:'9%', top:'13%', ...mapLabel}}>OLIVER</div>
      <div style={{position:'absolute', left:'39%', top:'25%', ...mapLabel}}>DOWNTOWN</div>
      <div style={{position:'absolute', left:'67%', top:'53%', ...mapLabel, color:MP.parkEdge}}>VICTORIA PARK</div>
      <div style={{position:'absolute', left:'25%', top:'85%', ...mapLabel, color:'#9fb4c6'}}>RIVER VALLEY</div>
    </div>
    {dim && <div style={{position:'absolute', inset:0, background:'rgba(14,13,12,0.16)', transition:'opacity .2s'}}/>}
    {children}
  </div>
);

// ── Pins — uniform circular icon pins (no clusters) ───────────────────────────
const MP_Pin = ({x, y, z=1, onClick, faded, children}) => (
  <div onClick={onClick} style={{position:'absolute', left:`${x}%`, top:`${y}%`, transform:'translate(-50%,-100%)', zIndex:z, cursor:onClick?'pointer':'default', opacity:faded?0.4:1, transition:'opacity .2s'}}>{children}</div>
);
const PinTail = ({color}) => (
  <div style={{width:0, height:0, borderLeft:'5px solid transparent', borderRight:'5px solid transparent', borderTop:`7px solid ${color}`, margin:'-1px auto 0', filter:'drop-shadow(0 2px 1px rgba(26,18,16,0.18))'}}/>
);
const PinBubble = ({color, sel, children, ring='#fff'}) => (
  <div style={{display:'flex', flexDirection:'column', alignItems:'center', transform:sel?'scale(1.16)':'none', transition:'transform .15s'}}>
    <div style={{width:sel?40:34, height:sel?40:34, borderRadius:'50%', background:color, border:`2.5px solid ${ring}`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:sel?'0 8px 18px rgba(26,18,16,0.35)':'0 3px 8px rgba(26,18,16,0.28)'}}>{children}</div>
    <PinTail color={ring}/>
  </div>
);
const SellerPin = ({s, sel}) => (
  <PinBubble color={MP.coral} sel={sel}><span style={{color:'#fff', fontSize:sel?16:13, fontWeight:800, ...MPS}}>{s.av}</span></PinBubble>
);
const VendorPin = ({sel}) => <PinBubble color={MP.purple} sel={sel}><span style={{fontSize:sel?17:14}}>🏪</span></PinBubble>;
const EventPin  = ({sel}) => <PinBubble color={MP.green}  sel={sel}><span style={{fontSize:sel?17:14}}>📅</span></PinBubble>;
const YouDot = () => (
  <div style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
    <div style={{position:'absolute', width:54, height:54, borderRadius:'50%', background:'rgba(37,99,235,0.16)'}}/>
    <div style={{width:16, height:16, borderRadius:'50%', background:MP.blue, border:'3px solid #fff', boxShadow:'0 1px 5px rgba(0,0,0,0.35)'}}/>
  </div>
);

const MP_PinLayer = ({filter=null, selected, onPin}) => {
  const showS = !filter || filter==='Sellers';
  const showV = !filter || filter==='Vendors';
  const showE = !filter || filter==='Events';
  const cb = id => onPin ? () => onPin(id) : undefined;
  return (
    <>
      <div style={{position:'absolute', left:'48%', top:'73%', transform:'translate(-50%,-50%)', zIndex:2}}><YouDot/></div>
      {showS && MP_SELLERS.map(s => (
        <MP_Pin key={s.id} x={s.x} y={s.y} z={selected===s.id?5:3} onClick={cb(s.id)} faded={selected&&selected!==s.id}><SellerPin s={s} sel={selected===s.id}/></MP_Pin>
      ))}
      {showV && MP_VENDORS.map(v => (
        <MP_Pin key={v.id} x={v.x} y={v.y} z={selected===v.id?5:3} onClick={cb(v.id)} faded={selected&&selected!==v.id}><VendorPin sel={selected===v.id}/></MP_Pin>
      ))}
      {showE && MP_EVENTS.map(e => (
        <MP_Pin key={e.id} x={e.x} y={e.y} z={selected===e.id?5:3} onClick={cb(e.id)} faded={selected&&selected!==e.id}><EventPin sel={selected===e.id}/></MP_Pin>
      ))}
    </>
  );
};

// ── Floating map controls ─────────────────────────────────────────────────────
const MP_SearchBar = ({onSearch}) => (
  <div onClick={onSearch} style={{display:'flex', alignItems:'center', gap:8, height:44, padding:'0 6px 0 14px', borderRadius:999, background:'#fff', boxShadow:'0 4px 14px rgba(26,18,16,0.14)', cursor:onSearch?'pointer':'default'}}>
    <span style={{fontSize:15, color:MP.ter}}>⌕</span>
    <span style={{flex:1, fontSize:13.5, color:MP.sec, fontWeight:500}}>Search Edmonton, AB</span>
    <div style={{width:32, height:32, borderRadius:'50%', background:MP.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:13, fontWeight:700, ...MPS}}>J</div>
  </div>
);
const MP_Chip = ({label, icon, on, accent, onClick}) => (
  <div onClick={onClick} style={{display:'flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:999, background:on?accent:'#fff', color:on?'#fff':MP.sec, fontSize:12, fontWeight:700, ...MPS, boxShadow:'0 2px 8px rgba(26,18,16,0.12)', flexShrink:0, cursor:onClick?'pointer':'default', whiteSpace:'nowrap', border:on?'none':`1px solid ${MP.border}`}}>
    <span style={{fontSize:12}}>{icon}</span>{label}
  </div>
);
const MP_Chips = ({filter=null, onChip}) => {
  const items = [['Sellers','👤'],['Vendors','🏪'],['Events','📅']];
  return (
    <div style={{display:'flex', gap:7}}>
      {items.map(([l,ic]) => <MP_Chip key={l} label={l} icon={ic} on={filter===l} accent={TYPE_ACCENT[l]} onClick={onChip?()=>onChip(l):undefined}/>)}
    </div>
  );
};
const MP_RoundBtn = ({icon, accent, onClick}) => (
  <div onClick={onClick} style={{width:44, height:44, borderRadius:'50%', background:'#fff', boxShadow:'0 4px 14px rgba(26,18,16,0.16)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:accent||MP.text, cursor:onClick?'pointer':'default'}}>{icon}</div>
);

// ── Bottom sheet ──────────────────────────────────────────────────────────────
const MP_Sheet = ({height, onHandle, onClose, children, flush}) => (
  <div style={{position:'absolute', left:0, right:0, bottom:0, height, background:MP.bg, borderRadius:flush?'0':'22px 22px 0 0', zIndex:5, display:'flex', flexDirection:'column', boxShadow:MP.shadowUp, transition:'height .3s cubic-bezier(.3,.8,.3,1)', overflow:'hidden'}}>
    <div onClick={onHandle} style={{padding:'9px 0 4px', display:'flex', justifyContent:'center', flexShrink:0, cursor:onHandle?'grab':'default'}}>
      <div style={{width:38, height:4.5, borderRadius:3, background:MP.ter}}/>
    </div>
    {onClose && (
      <div onClick={onClose} style={{position:'absolute', top:12, right:14, width:28, height:28, borderRadius:'50%', background:MP.surface, border:`1px solid ${MP.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:MP.sec, zIndex:3, cursor:'pointer'}}>✕</div>
    )}
    {children}
  </div>
);
const MP_RadiusControl = ({radius='25 km', onLoc}) => (
  <div onClick={onLoc} style={{display:'inline-flex', alignItems:'center', gap:6, marginTop:4, padding:'4px 10px 4px 9px', borderRadius:999, background:MP.surface, border:`1px solid ${MP.border}`, cursor:onLoc?'pointer':'default'}}>
    <span style={{fontSize:11}}>📍</span>
    <span style={{fontSize:11, fontWeight:600, color:MP.sec, ...MPD}}>Edmonton, AB</span>
    <span style={{width:1, height:11, background:MP.border}}/>
    <span style={{fontSize:11, fontWeight:800, color:MP.coral, ...MPS}}>{radius}</span>
    <span style={{fontSize:10, color:MP.coral}}>⇄</span>
  </div>
);
const MP_SheetHead = ({count, label, radius, onLoc}) => (
  <div style={{padding:'0 52px 10px 18px', flexShrink:0}}>
    <div style={{fontSize:16, fontWeight:800, color:MP.text, ...MPS}}>{count} {label}</div>
    <MP_RadiusControl radius={radius} onLoc={onLoc}/>
  </div>
);

// ── Shared "Visit" pill ───────────────────────────────────────────────────────
const VisitPill = ({accent, accentM}) => (
  <div style={{padding:'6px 15px', borderRadius:999, background:accentM, border:`1px solid ${accent}`, color:accent, fontSize:11, fontWeight:700, ...MPS, flexShrink:0}}>Visit</div>
);

// ── List rows — all share the Visit-pill format ───────────────────────────────
const MP_SellerRow = ({s, onClick}) => (
  <div onClick={onClick} style={{display:'flex', gap:12, alignItems:'center', padding:'11px 18px', borderBottom:`1px solid ${MP.border}`, cursor:onClick?'pointer':'default'}}>
    <div style={{width:46, height:46, borderRadius:'50%', background:MP.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:18, fontWeight:700, ...MPS, flexShrink:0, boxShadow:`0 3px 10px ${MP.coral}33`}}>{s.av}</div>
    <div style={{flex:1, minWidth:0}}>
      <div style={{display:'flex', alignItems:'center', gap:5}}>
        <span style={{fontSize:13.5, fontWeight:700, color:MP.text, ...MPS}}>{s.name}</span>
        <span style={{fontSize:10, color:MP.green}}>✓</span>
      </div>
      <div style={{fontSize:10.5, color:MP.ter, marginTop:2}}>{s.cards} cards · {s.rating}★</div>
      <div style={{fontSize:10, color:MP.sec, marginTop:2}}>📍 Meets near {s.area} · {s.dist}</div>
    </div>
    <VisitPill accent={MP.coral} accentM={MP.coralM}/>
  </div>
);
const MP_VendorRow = ({v, onClick}) => (
  <div onClick={onClick} style={{display:'flex', gap:12, alignItems:'center', padding:'11px 18px', borderBottom:`1px solid ${MP.border}`, cursor:onClick?'pointer':'default'}}>
    <div style={{width:46, height:46, borderRadius:13, background:`linear-gradient(145deg,${MP.purple},${MP.purple}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0, boxShadow:`0 3px 10px ${MP.purple}33`}}>🏪</div>
    <div style={{flex:1, minWidth:0}}>
      <div style={{display:'flex', alignItems:'center', gap:5}}>
        <span style={{fontSize:13.5, fontWeight:700, color:MP.text, ...MPS}}>{v.name}</span>
        <span style={{fontSize:10, color:MP.green}}>✓</span>
      </div>
      <div style={{fontSize:10.5, color:MP.ter, marginTop:2}}>{v.listings} listings · {v.rating}★</div>
      <div style={{fontSize:10, color:MP.sec, marginTop:2}}><span style={{color:v.open?MP.green:MP.amber, fontWeight:700}}>{v.open?'Open':'Closed'}</span> · {v.hours} · {v.dist}</div>
    </div>
    <VisitPill accent={MP.purple} accentM={MP.purpleM}/>
  </div>
);
const MP_EventRow = ({e, onClick}) => (
  <div onClick={onClick} style={{display:'flex', gap:12, alignItems:'center', padding:'11px 18px', borderBottom:`1px solid ${MP.border}`, cursor:onClick?'pointer':'default'}}>
    <div style={{width:46, borderRadius:11, overflow:'hidden', border:`1px solid ${MP.border}`, textAlign:'center', flexShrink:0}}>
      <div style={{background:e.color, color:'#fff', fontSize:8.5, fontWeight:800, padding:'3px 0', letterSpacing:'0.5px', ...MPS}}>{e.m}</div>
      <div style={{fontSize:18, fontWeight:800, color:MP.text, padding:'2px 0', ...MPS}}>{e.d}</div>
    </div>
    <div style={{flex:1, minWidth:0}}>
      <div style={{fontSize:13, fontWeight:700, color:MP.text, ...MPS, lineHeight:1.2, marginBottom:3}}>{e.title}</div>
      <div style={{fontSize:10.5, color:MP.sec, display:'flex', alignItems:'center', gap:4, marginBottom:3}}><span>📍</span><span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{e.loc}</span></div>
      <div style={{display:'flex', alignItems:'center', gap:8, fontSize:9.5, color:MP.ter}}>
        <span style={{padding:'1.5px 7px', borderRadius:999, background:MP.surface, fontWeight:700, color:MP.sec}}>{e.type}</span>
        <span>👥 {e.going} going</span>
      </div>
    </div>
    <VisitPill accent={MP.green} accentM={MP.greenM}/>
  </div>
);
const MP_RowSwitch = ({item, onClick}) => (
  item.kind==='vendor' ? <MP_VendorRow v={item} onClick={onClick}/>
  : item.kind==='event' ? <MP_EventRow e={item} onClick={onClick}/>
  : <MP_SellerRow s={item} onClick={onClick}/>
);
const MP_SheetList = ({filter='Sellers', onPin}) => {
  const items = filter==='Vendors' ? MP_VENDORS : filter==='Events' ? MP_EVENTS : MP_SELLERS;
  return <div style={{flex:1, overflow:'hidden'}}>{items.map(it => <MP_RowSwitch key={it.id} item={it} onClick={onPin?()=>onPin(it.id):undefined}/>)}</div>;
};

// ── Preview cards (pin selected) ──────────────────────────────────────────────
const MP_PreviewClose = ({onClose}) => (
  <div onClick={onClose} style={{position:'absolute', top:12, right:16, width:28, height:28, borderRadius:'50%', background:MP.surface, border:`1px solid ${MP.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:MP.sec, zIndex:2, cursor:onClose?'pointer':'default'}}>✕</div>
);
const ThumbRow = ({n=3}) => (
  <div style={{display:'flex', gap:8}}>
    {CARD_THUMBS.slice(0,n).map((a,i) => (
      <div key={i} style={{flex:1, borderRadius:10, overflow:'hidden', background:MP.card, boxShadow:MP.shadow}}>
        <div style={{height:78, background:`linear-gradient(145deg,${MP.surface},${a})`, position:'relative'}}>
          <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.2) 0%,transparent 55%)'}}/>
          <div style={{position:'absolute', left:'26%', top:'14%', right:'26%', bottom:'14%', background:MP.bg, opacity:0.16, borderRadius:3}}/>
        </div>
      </div>
    ))}
  </div>
);
const MP_SellerPreview = ({s, onClose}) => {
  const [tab, setTab] = React.useState('Listings');
  const reviews = [
    ['A','Ava Rodriguez','5.0','Smooth meetup downtown, card exactly as described. Would buy again!','2d'],
    ['D','Diego Santos','5.0','Fair price and quick to respond. Trusted local seller.','1w'],
    ['K','Kayla Brooks','4.0','Good condition, meetup was a little late but all good.','3w'],
  ];
  return (
  <div style={{position:'relative', flex:1, padding:'4px 18px 22px', display:'flex', flexDirection:'column', overflow:'hidden'}}>
    <MP_PreviewClose onClose={onClose}/>
    {/* Header */}
    <div style={{display:'flex', alignItems:'center', gap:14, paddingRight:34}}>
      <div style={{width:56, height:56, borderRadius:'50%', background:MP.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:22, fontWeight:700, ...MPS, flexShrink:0, boxShadow:`0 4px 12px ${MP.coral}33`}}>{s.av}</div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{display:'flex', alignItems:'center', gap:6}}>
          <span style={{fontSize:16, fontWeight:700, color:MP.text, ...MPS}}>{s.name}</span>
          <span style={{fontSize:12, color:MP.green}}>✓</span>
        </div>
        <div style={{fontSize:11, color:MP.ter, marginTop:2}}>@{s.handle} · {s.rating}★ ({s.reviews}) · {s.cards} cards</div>
        <div style={{display:'inline-flex', alignItems:'center', gap:5, marginTop:6, padding:'3px 9px', borderRadius:999, background:MP.coralM, color:MP.coral, fontSize:10, fontWeight:700, ...MPS}}>📍 Meets near {s.area} · {s.dist}</div>
      </div>
    </div>
    {/* Seller description */}
    <div style={{fontSize:11.5, color:MP.sec, lineHeight:1.5, marginTop:11, textWrap:'pretty'}}>{s.desc}</div>
    {/* Tabs */}
    <div style={{display:'flex', gap:24, borderBottom:`1px solid ${MP.border}`, marginTop:13, flexShrink:0}}>
      {['Listings','Reviews'].map(t => {
        const on = t===tab;
        return <div key={t} onClick={()=>setTab(t)} style={{paddingBottom:9, marginBottom:-1, borderBottom:on?`2.5px solid ${MP.coral}`:'2.5px solid transparent', color:on?MP.text:MP.ter, fontSize:12.5, fontWeight:on?800:600, ...MPS, cursor:'pointer'}}>{t==='Listings'?`Listings · ${s.cards}`:`Reviews · ${s.reviews}`}</div>;
      })}
    </div>
    {/* Tab body */}
    <div style={{flex:1, overflow:'auto', marginTop:12}}>
      {tab==='Listings' ? (
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8}}>
          {[['LeBron James','$12.5k','#E76F51'],['Luka Dončić','$4.1k','#2563eb'],['S. Curry','$1.4k','#10B981'],['Kobe','$2.1k','#f59e0b'],['Mahomes','$2.8k','#E76F51'],['Ohtani','$890','#2563eb']].map((c,i) => (
            <div key={i} style={{borderRadius:9, overflow:'hidden', background:MP.card, boxShadow:MP.shadow}}>
              <div style={{height:64, background:`linear-gradient(145deg,${MP.surface},${c[2]})`, position:'relative'}}><div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 55%)'}}/></div>
              <div style={{padding:'5px 6px 7px'}}>
                <div style={{fontSize:9.5, fontWeight:800, color:MP.coral, ...MPS}}>{c[1]}</div>
                <div style={{fontSize:8, color:MP.ter, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1}}>{c[0]}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {reviews.map((r,i) => (
            <div key={i} style={{display:'flex', gap:11, padding:'9px 0', borderBottom:`1px solid ${MP.border}`}}>
              <div style={{width:34, height:34, borderRadius:'50%', background:r[0]==='A'?MP.purple:r[0]==='D'?MP.green:MP.amber, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:13, fontWeight:700, ...MPS, flexShrink:0}}>{r[0]}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <span style={{fontSize:12, fontWeight:700, color:MP.text, ...MPS}}>{r[1]}</span>
                  <span style={{fontSize:9.5, color:MP.ter}}>{r[4]}</span>
                </div>
                <div style={{fontSize:9.5, color:MP.amber, marginTop:1}}>{'★'.repeat(Math.round(+r[2]))}<span style={{color:MP.border}}>{'★'.repeat(5-Math.round(+r[2]))}</span></div>
                <div style={{fontSize:11, color:MP.sec, lineHeight:1.45, marginTop:3}}>{r[3]}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    {/* CTA */}
    <div style={{display:'flex', gap:10, paddingTop:14, flexShrink:0}}>
      <div style={{width:50, borderRadius:999, background:MP.surface, border:`1px solid ${MP.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, color:MP.sec}}>🔖</div>
      <div style={{flex:1, padding:'14px 0', borderRadius:999, background:MP.coral, display:'flex', alignItems:'center', justifyContent:'center', gap:8, color:'#fff', fontSize:14.5, fontWeight:700, ...MPS}}><span style={{fontSize:15}}>💬</span> Message Seller</div>
    </div>
  </div>
  );
};
const MP_VendorPreview = ({v, onClose}) => {
  const [tab, setTab] = React.useState('Listings');
  const reviews = [
    ['M','Marcus Chen','5.0','Great shop, huge graded selection. Staff helped me submit to PSA on-site.','3d'],
    ['P','Priya Nair','5.0','Fair prices and legit. My go-to for sealed wax in YEG.','1w'],
    ['D','Diego Santos','4.0','Solid inventory, can get busy on weekends but worth it.','2w'],
  ];
  return (
  <div style={{position:'relative', flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
    <MP_PreviewClose onClose={onClose}/>
    {/* storefront photo + open/closed only */}
    <div style={{position:'relative', height:104, margin:'2px 0 0', background:`linear-gradient(150deg,#3a2f2a 0%,${MP.purple} 160%)`, flexShrink:0}}>
      <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:38, opacity:0.55}}>🏪</div>
      <div style={{position:'absolute', inset:0, background:'linear-gradient(to top,rgba(14,10,8,0.55) 0%,transparent 55%)'}}/>
      <div style={{position:'absolute', top:12, left:14, display:'flex', alignItems:'center', gap:6, padding:'4px 11px', borderRadius:999, background:'rgba(255,255,255,0.94)', ...MPS}}>
        <span style={{width:7, height:7, borderRadius:'50%', background:v.open?MP.green:MP.amber}}/>
        <span style={{fontSize:10.5, fontWeight:800, color:v.open?MP.green:MP.amber}}>{v.open?'Open now':'Closed'}</span>
      </div>
    </div>
    <div style={{padding:'12px 18px 22px', display:'flex', flexDirection:'column', flex:1, overflow:'hidden'}}>
      {/* name + hours far right */}
      <div style={{display:'flex', alignItems:'flex-start', gap:10, paddingRight:30}}>
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:'flex', alignItems:'center', gap:6}}>
            <span style={{fontSize:16, fontWeight:700, color:MP.text, ...MPS}}>{v.name}</span>
            <span style={{fontSize:11, color:MP.green}}>✓</span>
          </div>
          <div style={{fontSize:11, color:MP.ter, marginTop:2}}>@{v.handle} · {v.rating}★ ({v.reviews}) · {v.listings} cards</div>
          <div style={{fontSize:10.5, color:MP.sec, marginTop:5, display:'flex', alignItems:'flex-start', gap:5}}><span>📍</span><span style={{lineHeight:1.4}}>{v.area}</span></div>
        </div>
        <div style={{fontSize:10, color:MP.sec, fontWeight:700, ...MPS, textAlign:'right', flexShrink:0, paddingTop:2}}>{v.hours}</div>
      </div>
      {/* Get directions → Google Maps */}
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:7, marginTop:11, padding:'10px 0', borderRadius:10, background:MP.purpleM, border:`1px solid ${MP.purple}`, color:MP.purple, fontSize:12.5, fontWeight:700, ...MPS}}>
        <span style={{fontSize:13}}>➤</span> Get directions
      </div>
      {/* desc */}
      <div style={{fontSize:11.5, color:MP.sec, lineHeight:1.5, marginTop:11, textWrap:'pretty'}}>{v.desc}</div>
      {/* tabs */}
      <div style={{display:'flex', gap:24, borderBottom:`1px solid ${MP.border}`, marginTop:12, flexShrink:0}}>
        {['Listings','Reviews'].map(t => {
          const on = t===tab;
          return <div key={t} onClick={()=>setTab(t)} style={{paddingBottom:9, marginBottom:-1, borderBottom:on?`2.5px solid ${MP.coral}`:'2.5px solid transparent', color:on?MP.text:MP.ter, fontSize:12.5, fontWeight:on?800:600, ...MPS, cursor:'pointer'}}>{t==='Listings'?`Listings · ${v.listings}`:`Reviews · ${v.reviews}`}</div>;
        })}
      </div>
      <div style={{flex:1, overflow:'auto', marginTop:12}}>
        {tab==='Listings' ? (
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8}}>
            {[['Jordan RC','$8.2k','#E76F51'],['Wemby','$3.6k','#2563eb'],['Wembanyama','$5.1k','#10B981'],['Jokic','$1.9k','#f59e0b'],['Doncic','$4.1k','#E76F51'],['Edwards','$760','#2563eb']].map((c,i) => (
              <div key={i} style={{borderRadius:9, overflow:'hidden', background:MP.card, boxShadow:MP.shadow}}>
                <div style={{height:64, background:`linear-gradient(145deg,${MP.surface},${c[2]})`, position:'relative'}}><div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 55%)'}}/></div>
                <div style={{padding:'5px 6px 7px'}}>
                  <div style={{fontSize:9.5, fontWeight:800, color:MP.coral, ...MPS}}>{c[1]}</div>
                  <div style={{fontSize:8, color:MP.ter, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1}}>{c[0]}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {reviews.map((r,i) => (
              <div key={i} style={{display:'flex', gap:11, padding:'9px 0', borderBottom:`1px solid ${MP.border}`}}>
                <div style={{width:34, height:34, borderRadius:'50%', background:r[0]==='M'?MP.coral:r[0]==='P'?MP.blue:MP.green, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:13, fontWeight:700, ...MPS, flexShrink:0}}>{r[0]}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <span style={{fontSize:12, fontWeight:700, color:MP.text, ...MPS}}>{r[1]}</span>
                    <span style={{fontSize:9.5, color:MP.ter}}>{r[4]}</span>
                  </div>
                  <div style={{fontSize:9.5, color:MP.amber, marginTop:1}}>{'★'.repeat(Math.round(+r[2]))}<span style={{color:MP.border}}>{'★'.repeat(5-Math.round(+r[2]))}</span></div>
                  <div style={{fontSize:11, color:MP.sec, lineHeight:1.45, marginTop:3}}>{r[3]}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{paddingTop:14, display:'flex', gap:10, flexShrink:0}}>
        <div style={{width:50, borderRadius:999, background:MP.surface, border:`1px solid ${MP.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:MP.sec}}>💬</div>
        <div style={{flex:1, padding:'14px 0', borderRadius:999, background:MP.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:14.5, fontWeight:700, ...MPS}}>Visit Storefront</div>
      </div>
    </div>
  </div>
  );
};
const MP_EventPreview = ({e, onClose}) => (
  <div style={{position:'relative', flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
    <MP_PreviewClose onClose={onClose}/>
    {/* scrollable body — mirrors the event detail page */}
    <div style={{flex:1, overflow:'auto', padding:'4px 18px 16px'}}>
      {/* Poster */}
      <div style={{borderRadius:14, overflow:'hidden', position:'relative', height:120, background:`linear-gradient(160deg,#1a1210 0%,${e.color} 150%)`}}>
        <div style={{position:'absolute', inset:0, background:'linear-gradient(to top,rgba(14,10,8,0.7) 0%,transparent 60%)'}}/>
        <div style={{position:'absolute', top:10, left:12, padding:'3px 10px', borderRadius:999, background:'rgba(255,255,255,0.92)', color:'#1a1210', fontSize:9, fontWeight:800, letterSpacing:'0.4px', ...MPS}}>{e.type.toUpperCase()}</div>
        <div style={{position:'absolute', left:12, right:12, bottom:10}}>
          <div style={{fontSize:16, fontWeight:800, color:'#fff', ...MPS, lineHeight:1.15}}>{e.title}</div>
        </div>
      </div>
      {/* Date / time */}
      <div style={{display:'flex', alignItems:'center', gap:12, marginTop:13}}>
        <div style={{width:42, borderRadius:9, overflow:'hidden', border:`1px solid ${MP.border}`, textAlign:'center', flexShrink:0}}>
          <div style={{background:e.color, color:'#fff', fontSize:8, fontWeight:800, padding:'2px 0', ...MPS}}>{e.m}</div>
          <div style={{fontSize:16, fontWeight:800, color:MP.text, padding:'2px 0', ...MPS}}>{e.d}</div>
        </div>
        <div>
          <div style={{fontSize:13, fontWeight:700, color:MP.text, ...MPS}}>{e.dateLong}</div>
          <div style={{fontSize:11, color:MP.sec, marginTop:1}}>🕐 {e.time}</div>
        </div>
      </div>
      {/* Location + address + directions */}
      <div style={{display:'flex', alignItems:'center', gap:12, marginTop:11}}>
        <div style={{width:42, height:42, borderRadius:9, background:MP.surface, border:`1px solid ${MP.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0}}>📍</div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:13, fontWeight:700, color:MP.text, ...MPS}}>{e.loc}</div>
          <div style={{fontSize:11, color:MP.sec, marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{e.addr}</div>
          <div style={{fontSize:11, color:MP.purple, marginTop:2, fontWeight:600}}>Get directions →</div>
        </div>
      </div>
      {/* Interested · Going · More */}
      <div style={{display:'flex', gap:8, marginTop:13}}>
        <div style={{flex:1, padding:'11px 0', borderRadius:10, background:MP.purple, display:'flex', alignItems:'center', justifyContent:'center', gap:6, color:'#fff', fontSize:13, fontWeight:700, ...MPS, boxShadow:`0 3px 10px ${MP.purple}38`}}>★ Interested</div>
        <div style={{flex:1, padding:'11px 0', borderRadius:10, background:MP.surface, border:`1px solid ${MP.border}`, display:'flex', alignItems:'center', justifyContent:'center', gap:6, color:MP.text, fontSize:13, fontWeight:700, ...MPS}}>✓ Going</div>
        <div style={{width:46, borderRadius:10, background:MP.surface, border:`1px solid ${MP.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:MP.text, letterSpacing:1}}>···</div>
      </div>
      {/* Going row */}
      <div style={{display:'flex', alignItems:'center', gap:10, marginTop:13, padding:'9px 12px', borderRadius:12, background:MP.purpleM}}>
        <div style={{display:'flex'}}>
          {['#E76F51','#7C3AED','#10B981','#f59e0b'].map((c,i) => <div key={i} style={{width:24, height:24, borderRadius:'50%', background:c, border:`2px solid ${MP.bg}`, marginLeft:i>0?-8:0}}/>)}
        </div>
        <span style={{fontSize:11, color:MP.purple, fontWeight:700, ...MPS}}>{e.going} going · 38 interested</span>
      </div>
      {/* Genre tags */}
      <div style={{display:'flex', gap:7, marginTop:13, flexWrap:'wrap'}}>
        {e.tags.map(t => <span key={t} style={{padding:'4px 11px', borderRadius:999, background:MP.surface, border:`1px solid ${MP.border}`, fontSize:10.5, fontWeight:700, color:MP.sec, ...MPS}}>{t}</span>)}
      </div>
      {/* About */}
      <div style={{fontSize:12, fontWeight:800, color:MP.text, ...MPS, marginTop:14}}>About this event</div>
      <div style={{fontSize:11.5, color:MP.sec, lineHeight:1.55, marginTop:5, textWrap:'pretty'}}>{e.about}</div>
      {/* Host */}
      <div style={{display:'flex', alignItems:'center', gap:10, marginTop:13, padding:'10px 12px', borderRadius:12, background:MP.surface, border:`1px solid ${MP.border}`}}>
        <div style={{width:34, height:34, borderRadius:'50%', background:e.color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:13, fontWeight:700, ...MPS, flexShrink:0}}>E</div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:12, fontWeight:700, color:MP.text, ...MPS}}>Hosted by {e.host}</div>
          <div style={{fontSize:10, color:MP.ter, marginTop:1}}>2,431 members · Group</div>
        </div>
        <div style={{padding:'5px 13px', borderRadius:999, background:MP.purpleM, border:`1px solid ${MP.purple}`, color:MP.purple, fontSize:11, fontWeight:700, ...MPS}}>View</div>
      </div>
    </div>
  </div>
);
const MP_PreviewSwitch = ({item, onClose}) => (
  item.kind==='vendor' ? <MP_VendorPreview v={item} onClose={onClose}/>
  : item.kind==='event' ? <MP_EventPreview e={item} onClose={onClose}/>
  : <MP_SellerPreview s={item} onClose={onClose}/>
);

// ── Master map screen ─────────────────────────────────────────────────────────
const DETENT_H = {closed:0, half:352};
const PREVIEW_H = {seller:352, vendor:352, event:352};
const COUNTS = {Sellers:'32', Vendors:'9', Events:'7'};
const COUNT_LBL = {Sellers:'sellers nearby', Vendors:'vendors nearby', Events:'events nearby'};
const MP_MapScreen = ({
  detent='closed', filter=null, selected=null, radius='25 km', searchArea=false,
  onPin, onBg, onHandle, onClose, onChip, onCloseSheet, onRecenter, onLoc, onSearch,
}) => {
  const sel = selected ? MP_BYID[selected] : null;
  const sheetH = sel ? PREVIEW_H[sel.kind] : DETENT_H[detent];
  const full = false;
  const open = sel || detent!=='closed';
  return (
    <MP_Phone>
      <MP_SB/>
      <div onClick={onBg} style={{flex:1, position:'relative', overflow:'hidden', marginTop:-44}}>
        <div style={{position:'absolute', top:44, left:0, right:0, bottom:0}}>
          <MP_MapCanvas dim={!!sel}>
            <MP_PinLayer filter={filter} selected={selected} onPin={onPin}/>
          </MP_MapCanvas>
        </div>
        {!full && (
          <div style={{position:'absolute', top:52, left:12, right:12, zIndex:5, display:'flex', flexDirection:'column', gap:9}} onClick={e=>e.stopPropagation()}>
            <MP_SearchBar onSearch={onSearch}/>
            <MP_Chips filter={filter} onChip={onChip}/>
            {searchArea && (
              <div style={{display:'flex', justifyContent:'center', marginTop:2}}>
                <div style={{display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:999, background:MP.text, color:'#fff', fontSize:12, fontWeight:700, ...MPS, boxShadow:'0 4px 14px rgba(26,18,16,0.3)'}}><span>⟳</span> Search this area</div>
              </div>
            )}
          </div>
        )}
        {!full && (
          <div style={{position:'absolute', right:14, bottom:`calc(${typeof sheetH==='number'?sheetH+'px':sheetH} + 14px)`, zIndex:5, transition:'bottom .3s cubic-bezier(.3,.8,.3,1)'}} onClick={e=>e.stopPropagation()}>
            <MP_RoundBtn icon="◎" accent={MP.coral} onClick={onRecenter}/>
          </div>
        )}
        {open && (
          <div onClick={e=>e.stopPropagation()}>
            <MP_Sheet height={sheetH} onHandle={sel?undefined:onHandle} onClose={sel?undefined:onCloseSheet} flush={full}>
              {sel ? (
                <MP_PreviewSwitch item={sel} onClose={onClose}/>
              ) : (
                <>
                  {full && (
                    <div style={{display:'flex', justifyContent:'center', marginBottom:8, flexShrink:0}}>
                      <div onClick={onHandle} style={{display:'flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:999, background:MP.surface, border:`1px solid ${MP.border}`, fontSize:12, fontWeight:700, color:MP.sec, ...MPS, cursor:onHandle?'pointer':'default'}}>⊕ Back to map</div>
                    </div>
                  )}
                  <MP_SheetHead count={COUNTS[filter]||'0'} label={COUNT_LBL[filter]||'nearby'} radius={radius} onLoc={onLoc}/>
                  <MP_SheetList filter={filter} onPin={onPin}/>
                </>
              )}
            </MP_Sheet>
          </div>
        )}
      </div>
      <MP_TB/>
    </MP_Phone>
  );
};

// ── Search screen ─────────────────────────────────────────────────────────────
const ResultIcon = ({item}) => {
  if (item.t==='recent') return <div style={{width:42, height:42, borderRadius:'50%', background:MP.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, color:MP.sec}}>🕐</div>;
  if (item.t==='seller') return <div style={{width:42, height:42, borderRadius:'50%', background:MP.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16, fontWeight:800, ...MPS}}>{item.av}</div>;
  if (item.t==='vendor') return <div style={{width:42, height:42, borderRadius:12, background:`linear-gradient(145deg,${MP.purple},${MP.purple}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>🏪</div>;
  if (item.t==='event')  return <div style={{width:42, height:42, borderRadius:12, background:MP.green, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>📅</div>;
  return <div style={{width:42, height:42, borderRadius:'50%', background:MP.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:MP.sec}}>📍</div>;
};
const MP_SearchResults = [
  {t:'recent', title:'Mill Woods Town Centre', sub:'66 Street NW, Edmonton, AB', dist:'5.4 km', bold:'Town Centre'},
  {t:'vendor', title:'Sportscards YEG', sub:'104 St & Jasper Ave, Edmonton', dist:'2.4 km', tag:'Vendor'},
  {t:'seller', av:'K', title:'Kayla Brooks', sub:'Meets near Mill Woods', dist:'5.4 km', tag:'Seller'},
  {t:'event',  title:'Edmonton Card Show 2026', sub:'Edmonton EXPO Centre', dist:'6.6 km', tag:'Event'},
  {t:'place',  title:'Mill Woods', sub:'Edmonton, AB', dist:'5.1 km'},
  {t:'place',  title:'Mill Woods Recreation Centre', sub:'28 Avenue NW, Edmonton, AB', dist:'5.4 km'},
  {t:'place',  title:'Mill Woods Transit Centre', sub:'Edmonton, AB', dist:'5.6 km'},
];
const KB_ROWS = ['qwertyuiop','asdfghjkl','zxcvbnm'];
const MP_Keyboard = () => (
  <div style={{background:'#d3d2d6', padding:'7px 4px 6px', flexShrink:0, ...MPD}}>
    {KB_ROWS.map((row,ri) => (
      <div key={ri} style={{display:'flex', justifyContent:'center', gap:5, margin:'0 0 7px', padding:ri===1?'0 18px':ri===2?'0 4px':'0'}}>
        {ri===2 && <div style={{flex:'0 0 38px', height:38, borderRadius:5, background:'#adacb2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:'#fff'}}>⇧</div>}
        {row.split('').map(k => (
          <div key={k} style={{flex:1, height:38, maxWidth:34, borderRadius:5, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, color:MP.text, boxShadow:'0 1px 0 rgba(0,0,0,0.28)'}}>{k}</div>
        ))}
        {ri===2 && <div style={{flex:'0 0 38px', height:38, borderRadius:5, background:'#adacb2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:'#fff'}}>⌫</div>}
      </div>
    ))}
    <div style={{display:'flex', gap:5, padding:'0 1px'}}>
      <div style={{flex:'0 0 64px', height:40, borderRadius:5, background:'#adacb2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:600, color:MP.text}}>123</div>
      <div style={{flex:1, height:40, borderRadius:5, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:MP.text}}>space</div>
      <div style={{flex:'0 0 84px', height:40, borderRadius:5, background:MP.coral, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff', ...MPS}}>Search</div>
    </div>
  </div>
);
const MP_SearchScreen = ({query='Mill Woods', onBack, withKeyboard=true}) => (
  <MP_Phone>
    <MP_SB/>
    <div style={{padding:'2px 14px 12px', flexShrink:0}}>
      <div style={{display:'flex', alignItems:'center', gap:10, height:46, padding:'0 12px', borderRadius:999, background:MP.surface, border:`1px solid ${MP.border}`}}>
        <span onClick={onBack} style={{fontSize:19, color:MP.text, cursor:onBack?'pointer':'default'}}>‹</span>
        <span style={{flex:1, fontSize:15, fontWeight:600, color:MP.text, ...MPD}}>{query}<span style={{display:'inline-block', width:1.5, height:17, background:MP.coral, marginLeft:1, verticalAlign:'middle'}}/></span>
        <div style={{width:22, height:22, borderRadius:'50%', background:MP.ter, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#fff'}}>✕</div>
      </div>
    </div>
    <div style={{flex:1, overflow:'hidden'}}>
      {MP_SearchResults.map((r,i) => (
        <div key={i} style={{display:'flex', alignItems:'center', gap:13, padding:'9px 16px', borderBottom:`1px solid ${MP.border}`}}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:3, flexShrink:0, width:46}}>
            <ResultIcon item={r}/>
            <span style={{fontSize:9.5, fontWeight:700, color:MP.ter, ...MPS}}>{r.dist}</span>
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:14, color:MP.text, ...MPD, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
              <span style={{fontWeight:500}}>{r.title}</span>
              {r.tag && <span style={{marginLeft:7, padding:'1px 7px', borderRadius:999, background:r.t==='vendor'?MP.purpleM:r.t==='event'?MP.greenM:MP.coralM, color:r.t==='vendor'?MP.purple:r.t==='event'?MP.green:MP.coral, fontSize:9, fontWeight:700, ...MPS, verticalAlign:'middle'}}>{r.tag}</span>}
            </div>
            <div style={{fontSize:11.5, color:MP.ter, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{r.sub}</div>
          </div>
          <span style={{fontSize:18, color:MP.ter, transform:'rotate(-45deg)', flexShrink:0}}>↑</span>
        </div>
      ))}
    </div>
    {withKeyboard ? <MP_Keyboard/> : <MP_TB/>}
  </MP_Phone>
);

// ── Interactive shell ─────────────────────────────────────────────────────────
const RADII = ['10 km','25 km','50 km'];
const MP_MapLive = () => {
  const [detent, setDetent] = React.useState('closed');
  const [filter, setFilter] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [radIdx, setRadIdx] = React.useState(1);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const onChip = (f) => {
    setSelected(null);
    if (filter===f) { setFilter(null); setDetent('closed'); }
    else { setFilter(f); setDetent('half'); }
  };
  const onPin = (id) => { setSelected(id); setDetent(d => d==='closed'?'half':d); };
  const closePreview = () => { setSelected(null); if (!filter) setDetent('closed'); };
  if (searchOpen) return <MP_SearchScreen onBack={()=>setSearchOpen(false)} withKeyboard={false}/>;
  return (
    <MP_MapScreen
      detent={detent} filter={filter} selected={selected} radius={RADII[radIdx]}
      onPin={onPin}
      onBg={()=>{ if(selected) closePreview(); }}
      onClose={closePreview}
      onHandle={()=>setDetent('closed')}
      onCloseSheet={()=>{ setFilter(null); setDetent('closed'); setSelected(null); }}
      onChip={onChip}
      onRecenter={()=>{}}
      onLoc={()=>setRadIdx(i=>(i+1)%RADII.length)}
      onSearch={()=>setSearchOpen(true)}
    />
  );
};

// ── Export ────────────────────────────────────────────────────────────────────
Object.assign(window, {
  MP_MapScreen, MP_MapLive, MP_SearchScreen,
});

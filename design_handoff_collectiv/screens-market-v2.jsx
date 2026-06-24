// screens-market-v2.jsx — Collectiv · Market Tab · Direction 2 · REDESIGN v2
// Facebook-Marketplace-style: location-radius listings, hero carousel,
// 3-col condensed grid, genre lives in filter, Core-Loop-style listing detail.

// ── Tokens ────────────────────────────────────────────────────────────────────
const MV = {
  bg:'#fef9f5', surface:'#fef0e8', card:'#ffffff',
  text:'#1a1210', sec:'#6b5c52', ter:'#aa9a90', border:'#f0ddd0',
  coral:'#E76F51', coralM:'rgba(231,111,81,0.10)',
  purple:'#7C3AED', purpleM:'rgba(124,58,237,0.10)',
  green:'#10B981', greenM:'rgba(16,185,129,0.12)',
  amber:'#f59e0b',
  shadow:'0 2px 8px rgba(26,18,16,0.07),0 1px 2px rgba(26,18,16,0.04)',
  tabI:'rgba(26,18,16,0.28)',
};
const MVS = {fontFamily:"'Sora',sans-serif"};
const MVD = {fontFamily:"'DM Sans',sans-serif"};

// ── Listings (sports cards, near Edmonton) ────────────────────────────────────
const MV_CARDS = [
  {id:1, name:'LeBron James',    sub:"'03-04 Topps Chrome RC",  type:'Refractor Auto',  pStr:'$12,500', grade:'PSA 10', cond:'Gem Mint',  a:'#E76F51', seller:'sportscards_yeg', dist:'2.4 km',  watches:23, vendor:true},
  {id:2, name:'Mike Trout',      sub:'2011 Topps Update RC',    type:'Base Rookie',    pStr:'$3,200',  grade:'BGS 9.5',cond:'Near Mint', a:'#2563eb', seller:'vintagepulls',    dist:'4.1 km',  watches:11, vendor:false},
  {id:3, name:'Patrick Mahomes', sub:"'17 Panini Prizm RC",     type:'Silver Prizm',   pStr:'$2,800',  grade:'PSA 10', cond:'Gem Mint',  a:'#10B981', seller:'graded_gems_co',  dist:'5.8 km',  watches:18, vendor:true},
  {id:4, name:'Stephen Curry',   sub:"'09-10 Topps Chrome RC",  type:'Base Refractor', pStr:'$1,450',  grade:'PSA 9',  cond:'Mint',      a:'#E76F51', seller:'hoops_vault',     dist:'7.2 km',  watches:7,  vendor:false},
  {id:5, name:'Shohei Ohtani',   sub:'2018 Topps Update RC',    type:'Base Rookie',    pStr:'$890',    grade:'PSA 10', cond:'Gem Mint',  a:'#2563eb', seller:'pacific_cards',   dist:'8.9 km',  watches:14, vendor:false},
  {id:6, name:'Luka Dončić',     sub:"'18-19 Panini Prizm RC",  type:'Silver Prizm',   pStr:'$4,100',  grade:'PSA 10', cond:'Gem Mint',  a:'#E76F51', seller:'prizm_king',      dist:'11 km',   watches:31, vendor:true},
  {id:7, name:'Kobe Bryant',     sub:"'96-97 Topps Chrome RC",  type:'Base Rookie',    pStr:'$2,100',  grade:'PSA 8',  cond:'Near Mint', a:'#f59e0b', seller:'classic_hoops',   dist:'14 km',   watches:19, vendor:false},
  {id:8, name:'Derek Jeter',     sub:'1993 SP Foil RC',         type:'Foil Rookie',    pStr:'$980',    grade:'BGS 9',  cond:'Mint',      a:'#2563eb', seller:'vintagepulls',    dist:'17 km',   watches:9,  vendor:false},
  {id:9, name:'F. Tatis Jr.',    sub:'2019 Topps Chrome RC',    type:'Base Refractor', pStr:'$560',    grade:'PSA 10', cond:'Gem Mint',  a:'#2563eb', seller:'pacific_cards',   dist:'21 km',   watches:8,  vendor:false},
];

// ── Primitives ────────────────────────────────────────────────────────────────
const MV_Phone = ({children, h=780}) => (
  <div style={{width:390, height:h, background:MV.bg, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative', ...MVD}}>
    {children}
  </div>
);

const MV_SB = () => (
  <div style={{height:44, display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'0 20px 8px', flexShrink:0, position:'relative'}}>
    <span style={{fontSize:13, fontWeight:600, color:MV.text, ...MVS}}>9:41</span>
    <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:110, height:26, background:'#000', borderRadius:'0 0 14px 14px'}}/>
    <div style={{display:'flex', gap:5, alignItems:'center', opacity:0.65}}>
      <span style={{fontSize:10, color:MV.text}}>▲▲▲</span>
      <div style={{width:22, height:11, borderRadius:2.5, border:`1.5px solid ${MV.text}`, position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', left:2, top:2, bottom:2, width:'70%', background:MV.text, borderRadius:1}}/>
      </div>
    </div>
  </div>
);

const MV_TB = () => {
  const tabs = [
    {id:'home',label:'Home',icon:'⌂'},{id:'portfolio',label:'Portfolio',icon:'◫'},
    {id:'market',label:'Market',icon:'◈'},{id:'social',label:'Social',icon:'◎'},{id:'map',label:'Map',icon:'⊕'},
  ];
  return (
    <div style={{height:56, display:'flex', borderTop:`1px solid ${MV.border}`, background:MV.bg, flexShrink:0}}>
      {tabs.map(t => {
        const on = t.id === 'market';
        return (
          <div key={t.id} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, color:on?MV.coral:MV.tabI, position:'relative'}}>
            {on && <div style={{position:'absolute', top:0, width:28, height:3, borderRadius:'0 0 3px 3px', background:MV.coral}}/>}
            <span style={{fontSize:17, lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:9, fontWeight:on?700:500, ...MVS, lineHeight:1}}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const MV_Dim = () => <div style={{position:'absolute', inset:0, background:'rgba(14,13,12,0.55)', zIndex:10}}/>;

const MV_Sheet = ({height, children}) => (
  <div style={{position:'absolute', bottom:0, left:0, right:0, height, background:MV.bg, borderRadius:'24px 24px 0 0', zIndex:20, display:'flex', flexDirection:'column', boxShadow:'0 -12px 40px rgba(26,18,16,0.16)'}}>
    <div style={{width:36, height:4, borderRadius:2, background:MV.ter, margin:'12px auto 4px'}}/>
    {children}
  </div>
);

// ── Marketplace header — FB style: title left · message / vendor / search ────
const MV_Header = () => (
  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'2px 20px 10px', flexShrink:0}}>
    <div style={{fontSize:24, fontWeight:800, color:MV.text, ...MVS}}>Marketplace</div>
    <div style={{display:'flex', gap:8}}>
      {[
        {icon:'💬', badge:true},
        {icon:'🏪', badge:false},
        {icon:'⌕',  badge:false},
      ].map((b,i) => (
        <div key={i} style={{position:'relative'}}>
          <div style={{width:34, height:34, borderRadius:'50%', background:MV.surface, border:`1px solid ${MV.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:i===2?17:15, color:MV.text, fontWeight:i===2?700:400}}>{b.icon}</div>
          {b.badge && <div style={{position:'absolute', top:0, right:0, width:8, height:8, borderRadius:'50%', background:MV.coral, border:`1.5px solid ${MV.bg}`}}/>}
        </div>
      ))}
    </div>
  </div>
);

// ── Location row — listings near you, tappable radius ────────────────────────
const MV_LocationRow = () => (
  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px 10px', flexShrink:0}}>
    <span style={{fontSize:13, fontWeight:700, color:MV.text, ...MVS}}>Today's Picks</span>
    <div style={{width:32, height:32, borderRadius:'50%', background:MV.surface, border:`1px solid ${MV.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16}}>📍</div>
  </div>
);

// ── Hero carousel (Var-B editorial style, swipeable) ─────────────────────────
const MV_HeroCarousel = () => {
  const heroes = [MV_CARDS[0], MV_CARDS[5]];
  return (
    <div style={{flexShrink:0, paddingBottom:10}}>
      <div style={{display:'flex', gap:10, paddingLeft:16, overflow:'hidden'}}>
        {heroes.map((c,idx) => (
          <div key={c.id} style={{width: idx===0 ? 330 : 330, flexShrink:0, borderRadius:16, overflow:'hidden', background:`linear-gradient(135deg,#1a1210 0%,${c.a} 100%)`, position:'relative', height:132}}>
            <div style={{position:'absolute', inset:0, background:'linear-gradient(90deg,rgba(26,18,16,0.86) 0%,rgba(26,18,16,0.18) 100%)'}}/>
            <div style={{position:'absolute', right:14, top:10, bottom:10, width:78, borderRadius:9, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <div style={{width:'58%', height:'76%', background:'rgba(255,255,255,0.1)', borderRadius:4}}/>
            </div>
            <div style={{position:'absolute', left:16, top:13, right:104}}>
              <div style={{display:'inline-flex', alignItems:'center', gap:5, marginBottom:5}}>
                <span style={{padding:'2px 7px', borderRadius:5, background:'rgba(16,185,129,0.3)', color:MV.green, fontSize:8, fontWeight:800, letterSpacing:'0.4px', ...MVS}}>{c.cond}</span>
                <span style={{fontSize:8, fontWeight:700, letterSpacing:'0.5px', color:'rgba(255,255,255,0.6)', ...MVS}}>{c.dist} AWAY</span>
              </div>
              <div style={{fontSize:15, fontWeight:800, color:'#fff', ...MVS, lineHeight:1.2, marginBottom:2}}>{c.name}</div>
              <div style={{fontSize:9.5, color:'rgba(255,255,255,0.6)', marginBottom:1}}>{c.sub}</div>
              <div style={{fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.85)', ...MVS, marginBottom:8}}>{c.type}</div>
              <div style={{display:'flex', alignItems:'center', gap:6}}>
                <span style={{fontSize:14, fontWeight:800, color:'#fff', ...MVS}}>{c.pStr}</span>
                <div style={{padding:'2px 6px', borderRadius:4, background:'rgba(16,185,129,0.3)', color:MV.green, fontSize:8, fontWeight:700}}>{c.grade}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Carousel dots */}
      <div style={{display:'flex', gap:5, justifyContent:'center', paddingTop:8}}>
        {[0,1,2].map(i => (
          <div key={i} style={{width:i===0?16:5, height:5, borderRadius:3, background:i===0?MV.coral:MV.border}}/>
        ))}
      </div>
    </div>
  );
};

// ── Sort / filter row ─────────────────────────────────────────────────────────
const MV_SortRow = ({sort='Suggested'}) => (
  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px 10px', flexShrink:0}}>
    <span style={{fontSize:13, fontWeight:700, color:MV.text, ...MVS}}>Today's Picks</span>
    <div style={{display:'flex', alignItems:'center', gap:6}}>
      <div style={{display:'flex', alignItems:'center', gap:4, padding:'5px 11px', borderRadius:999, background:MV.coralM, border:`1px solid ${MV.coral}`}}>
        <span style={{fontSize:11, fontWeight:700, color:MV.coral, ...MVS}}>{sort}</span>
        <span style={{fontSize:9, color:MV.coral}}>▾</span>
      </div>
      <div style={{width:30, height:30, borderRadius:'50%', background:MV.surface, border:`1px solid ${MV.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:MV.sec}}>⊟</div>
      <div style={{width:30, height:30, borderRadius:'50%', background:MV.surface, border:`1px solid ${MV.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15}}>📍</div>
    </div>
  </div>
);

// ── Condensed 3-col grid item ─────────────────────────────────────────────────
const MV_GridCard = ({c}) => (
  <div style={{borderRadius:10, overflow:'hidden', background:MV.card, boxShadow:MV.shadow}}>
    <div style={{height:96, background:`linear-gradient(145deg,${MV.surface},${c.a})`, position:'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{width:'52%',height:'70%',background:MV.bg,borderRadius:4,opacity:0.14}}/>
      <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%)'}}/>
      <div style={{position:'absolute', top:5, right:5, padding:'1.5px 4px', borderRadius:3, background:'rgba(16,185,129,0.22)', color:MV.green, fontSize:7, fontWeight:700}}>{c.grade}</div>
      {c.vendor && <div style={{position:'absolute', bottom:5, left:5, padding:'1.5px 5px', borderRadius:3, background:'rgba(124,58,237,0.75)', color:'#fff', fontSize:7, fontWeight:700}}>VENDOR</div>}
    </div>
    <div style={{padding:'5px 7px 7px'}}>
      <div style={{fontSize:11, fontWeight:800, color:MV.coral, ...MVS}}>{c.pStr}</div>
      <div style={{fontSize:9, fontWeight:600, color:MV.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1}}>{c.name}</div>
      <div style={{fontSize:7.5, color:MV.ter, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1}}>{c.type}</div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:4, marginTop:2}}>
        <span style={{fontSize:7.5, fontWeight:700, color:MV.green, ...MVS}}>{c.cond}</span>
        <span style={{fontSize:7.5, color:MV.ter}}>{c.dist}</span>
      </div>
    </div>
  </div>
);

// ── Marketplace Home ──────────────────────────────────────────────────────────
const MV_Home = () => (
  <MV_Phone>
    <MV_SB/>
    <MV_Header/>
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px 8px', flexShrink:0}}>
      <span style={{fontSize:11, fontWeight:700, color:MV.ter, textTransform:'uppercase', letterSpacing:'0.8px'}}>Featured</span>
      <span style={{fontSize:11, color:MV.coral, ...MVS}}>See all →</span>
    </div>
    <MV_HeroCarousel/>
    <MV_SortRow/>
    <div style={{flex:1, overflow:'hidden', padding:'0 12px'}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6}}>
        {MV_CARDS.map(c => <MV_GridCard key={c.id} c={c}/>)}
      </div>
    </div>
    <MV_TB/>
  </MV_Phone>
);

// ── Location / radius sheet ───────────────────────────────────────────────────
const MV_LocationSheet = () => (
  <MV_Phone>
    <MV_SB/>
    <div style={{flex:1, opacity:0.3, overflow:'hidden'}}>
      <MV_Header/>
      <MV_HeroCarousel/>
      <MV_LocationRow/>
    </div>
    <MV_Dim/>
    <MV_Sheet height={430}>
      <div style={{padding:'8px 20px 22px', flex:1, display:'flex', flexDirection:'column', gap:14}}>
        <div style={{fontSize:17, fontWeight:800, color:MV.text, ...MVS}}>Location</div>
        {/* Map placeholder with radius ring */}
        <div style={{height:140, borderRadius:14, background:MV.surface, border:`1px solid ${MV.border}`, position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', backgroundImage:`repeating-linear-gradient(135deg, ${MV.border}44 0 1px, transparent 1px 10px)`}}>
          <div style={{position:'absolute', width:110, height:110, borderRadius:'50%', background:MV.coralM, border:`1.5px solid ${MV.coral}`}}/>
          <div style={{position:'absolute', width:12, height:12, borderRadius:'50%', background:MV.coral, border:`2.5px solid #fff`, boxShadow:'0 1px 4px rgba(0,0,0,0.25)'}}/>
          <div style={{position:'absolute', bottom:8, right:10, fontSize:9, color:MV.ter, fontFamily:'monospace'}}>map preview</div>
        </div>
        {/* City row */}
        <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, background:MV.surface, border:`1px solid ${MV.border}`}}>
          <span style={{fontSize:14}}>📍</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13, fontWeight:700, color:MV.text, ...MVS}}>Edmonton, AB</div>
            <div style={{fontSize:10, color:MV.ter}}>Current location</div>
          </div>
          <span style={{fontSize:11, color:MV.coral, fontWeight:700, ...MVS}}>Change</span>
        </div>
        {/* Radius slider */}
        <div>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
            <span style={{fontSize:10, fontWeight:700, color:MV.ter, textTransform:'uppercase', letterSpacing:'0.5px'}}>Radius</span>
            <span style={{fontSize:12, color:MV.coral, fontWeight:800, ...MVS}}>25 km</span>
          </div>
          <div style={{height:4, borderRadius:2, background:MV.surface, border:`1px solid ${MV.border}`, position:'relative', margin:'8px 8px 4px'}}>
            <div style={{position:'absolute', left:0, width:'25%', top:0, bottom:0, background:MV.coral, borderRadius:2}}/>
            <div style={{position:'absolute', left:'25%', top:-6, width:16, height:16, borderRadius:'50%', background:MV.coral, boxShadow:`0 0 0 2.5px ${MV.bg}, 0 1px 4px rgba(0,0,0,0.2)`, transform:'translateX(-8px)'}}/>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', padding:'0 4px'}}>
            <span style={{fontSize:9, color:MV.ter}}>1 km</span>
            <span style={{fontSize:9, color:MV.ter}}>100 km</span>
          </div>
        </div>
        <div style={{marginTop:'auto', padding:'13px', borderRadius:999, background:MV.coral, textAlign:'center', fontSize:14, fontWeight:700, color:'#fff', ...MVS}}>Apply · Show 132 Listings</div>
      </div>
    </MV_Sheet>
  </MV_Phone>
);

// ── Sort sheet — new model ────────────────────────────────────────────────────
const MV_SortSheet = () => {
  const SORTS = [
    ['Suggested',           'Active sellers & vendors prioritized', true],
    ['Price: Low to High',  'Cheapest first',                       false],
    ['Price: High to Low',  'Most valuable first',                  false],
    ['Distance: Nearest',   'Closest to you first',                 false],
    ['Date Listed: Newest', 'Most recent listings first',           false],
  ];
  return (
    <MV_Phone>
      <MV_SB/>
      <div style={{flex:1, opacity:0.3, overflow:'hidden'}}>
        <MV_Header/>
        <MV_HeroCarousel/>
        <MV_LocationRow/>
      </div>
      <MV_Dim/>
      <MV_Sheet height={350}>
        <div style={{padding:'8px 20px 24px', flex:1, display:'flex', flexDirection:'column'}}>
          <div style={{fontSize:17, fontWeight:800, color:MV.text, ...MVS, marginBottom:10}}>Sort By</div>
          {SORTS.map(([label,sub,active],i) => (
            <div key={label} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderTop:i>0?`1px solid ${MV.border}`:'none'}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13, fontWeight:active?700:500, color:active?MV.coral:MV.text, ...MVS}}>{label}</div>
                <div style={{fontSize:9.5, color:MV.ter, marginTop:1}}>{sub}</div>
              </div>
              {active && <div style={{width:20, height:20, borderRadius:'50%', background:MV.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11}}>✓</div>}
            </div>
          ))}
        </div>
      </MV_Sheet>
    </MV_Phone>
  );
};

// ── Filter sheet — genre lives here now ───────────────────────────────────────
const MV_FilterSheet = () => (
  <MV_Phone>
    <MV_SB/>
    <div style={{flex:1, opacity:0.3, overflow:'hidden'}}>
      <MV_Header/>
      <MV_HeroCarousel/>
      <MV_LocationRow/>
    </div>
    <MV_Dim/>
    <MV_Sheet height={560}>
      <div style={{padding:'8px 20px 22px', flex:1, display:'flex', flexDirection:'column', gap:14, overflow:'hidden'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{fontSize:17, fontWeight:800, color:MV.text, ...MVS}}>Filters</div>
          <span style={{fontSize:12, color:MV.coral, fontWeight:700}}>Reset All</span>
        </div>
        {[
          {label:'Genre',     opts:[['All',false],['Sports',true],['Pokémon',false],['Magic',false],['Yu-Gi-Oh!',false],['One Piece',false]]},
          {label:'Condition', opts:[['All',true],['Gem Mint',false],['Near Mint',false],['Excellent',false],['Good',false]]},
          {label:'Grade',     opts:[['Any',true],['PSA 10',false],['PSA 9',false],['BGS 9.5',false],['Ungraded',false]]},
          {label:'Seller Type', opts:[['All',true],['Vendors only',false],['Verified sellers',false]]},
        ].map(({label,opts}) => (
          <div key={label}>
            <div style={{fontSize:10, fontWeight:700, color:MV.ter, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:7}}>{label}</div>
            <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
              {opts.map(([l,a]) => (
                <div key={l} style={{padding:'5px 11px', borderRadius:999, background:a?MV.coral:MV.surface, border:`1px solid ${a?MV.coral:MV.border}`, color:a?'#fff':MV.sec, fontSize:10, fontWeight:600, ...MVS}}>{l}</div>
              ))}
            </div>
          </div>
        ))}
        {/* Price range */}
        <div>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:7}}>
            <div style={{fontSize:10, fontWeight:700, color:MV.ter, textTransform:'uppercase', letterSpacing:'0.5px'}}>Price Range</div>
            <div style={{fontSize:11, color:MV.coral, fontWeight:700}}>$0 — $15,000</div>
          </div>
          <div style={{height:4, borderRadius:2, background:MV.surface, border:`1px solid ${MV.border}`, position:'relative', margin:'8px 6px'}}>
            <div style={{position:'absolute', inset:0, background:MV.coral, borderRadius:2}}/>
            <div style={{position:'absolute', left:-6, top:-5, width:14, height:14, borderRadius:'50%', background:MV.coral, boxShadow:`0 0 0 2px ${MV.bg}`}}/>
            <div style={{position:'absolute', right:-6, top:-5, width:14, height:14, borderRadius:'50%', background:MV.coral, boxShadow:`0 0 0 2px ${MV.bg}`}}/>
          </div>
        </div>
        <div style={{marginTop:'auto', padding:'13px', borderRadius:999, background:MV.coral, textAlign:'center', fontSize:14, fontWeight:700, color:'#fff', ...MVS}}>Show 132 Listings</div>
      </div>
    </MV_Sheet>
  </MV_Phone>
);

// ── Search screens ───────────────────────────────────────────────────────────

// 1. Empty — focused search bar, Recent + Saved sections both empty
const MV_SearchEmpty = () => (
  <MV_Phone>
    <MV_SB/>
    {/* Search bar row */}
    <div style={{display:'flex', alignItems:'center', gap:10, padding:'4px 16px 14px', flexShrink:0}}>
      <div style={{flex:1, height:40, borderRadius:12, background:MV.card, border:`1.5px solid ${MV.coral}`, display:'flex', alignItems:'center', padding:'0 12px', gap:8, boxShadow:`0 0 0 3px rgba(231,111,81,0.08)`}}>
        <span style={{fontSize:14, color:MV.coral}}>⌕</span>
        <span style={{fontSize:13, color:MV.ter}}>Search cards, sellers…</span>
        <div style={{width:1.5, height:16, background:MV.coral, animation:'none'}}/>  
      </div>
      <span style={{fontSize:13, fontWeight:600, color:MV.coral, flexShrink:0, ...MVS}}>Cancel</span>
    </div>
    {/* Tab divider */}
    <div style={{display:'flex', borderBottom:`1.5px solid ${MV.border}`, flexShrink:0, marginBottom:0}}>
      {['Recent Searches','Saved Searches'].map((tab,i) => (
        <div key={tab} style={{flex:1, textAlign:'center', padding:'10px 0 9px', fontSize:12, fontWeight:700, color:i===0?MV.coral:MV.ter, borderBottom:i===0?`2px solid ${MV.coral}`:'2px solid transparent', marginBottom:-1.5}}>{tab}</div>
      ))}
    </div>
    {/* Active tab content — Recent (empty) */}
    <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, padding:'0 32px'}}>
      <span style={{fontSize:36, opacity:0.18}}>↺</span>
      <span style={{fontSize:13, fontWeight:600, color:MV.sec}}>No recent searches</span>
      <span style={{fontSize:11, color:MV.ter, textAlign:'center', lineHeight:1.6}}>Your recent searches will appear here once you start searching</span>
    </div>
    <MV_TB/>
  </MV_Phone>
);

// 2. Typing — prepopulate suggestions while typing "LeBron"
const MV_SearchTyping = () => {
  const suggestions = [
    {q:'LeBron James PSA 10',   sub:'847 listings nearby'},
    {q:'LeBron James Rookie',   sub:'212 listings nearby'},
    {q:'LeBron James Topps',    sub:'134 listings nearby'},
    {q:'LeBron James Upper Deck',sub:'89 listings nearby'},
    {q:'LeBron James Prizm',    sub:'67 listings nearby'},
  ];
  return (
    <MV_Phone>
      <MV_SB/>
      <div style={{display:'flex', alignItems:'center', gap:10, padding:'4px 16px 0', flexShrink:0}}>
        <div style={{flex:1, height:40, borderRadius:12, background:MV.card, border:`1.5px solid ${MV.coral}`, display:'flex', alignItems:'center', padding:'0 12px', gap:8, boxShadow:`0 0 0 3px rgba(231,111,81,0.08)`}}>
          <span style={{fontSize:14, color:MV.coral}}>⌕</span>
          <span style={{fontSize:13, color:MV.text, fontWeight:500}}>LeBron</span>
          <div style={{width:1.5, height:16, background:MV.coral}}/>  
          <span style={{fontSize:11, color:MV.ter, marginLeft:'auto'}}>✕</span>
        </div>
        <span style={{fontSize:13, fontWeight:600, color:MV.coral, flexShrink:0, ...MVS}}>Cancel</span>
      </div>
      {/* Suggestion list */}
      <div style={{flex:1, overflow:'hidden', marginTop:4}}>
        {suggestions.map((s,i) => (
          <div key={s.q} style={{display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderBottom:`1px solid ${MV.border}`, background:MV.card}}>
            <span style={{fontSize:15, color:MV.ter, flexShrink:0}}>⌕</span>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:13, color:MV.text}}>
                <span style={{fontWeight:700, color:MV.coral}}>LeBron</span>
                <span>{s.q.slice(6)}</span>
              </div>
              <div style={{fontSize:10, color:MV.ter, marginTop:1}}>{s.sub}</div>
            </div>
            <span style={{fontSize:12, color:MV.ter, transform:'rotate(225deg)', display:'inline-block', flexShrink:0}}>↗</span>
          </div>
        ))}
        <div style={{display:'flex', alignItems:'center', gap:12, padding:'11px 16px', background:MV.card}}>
          <span style={{fontSize:15, color:MV.coral, flexShrink:0}}>⌕</span>
          <div style={{fontSize:13, color:MV.coral, fontWeight:600}}>Search "LeBron" in all categories</div>
        </div>
      </div>
      <MV_TB/>
    </MV_Phone>
  );
};

// 3. Results — 3-col grid, no hero, results header with filter/sort/bookmark
const MV_SearchResults = () => (
  <MV_Phone>
    <MV_SB/>
    {/* Search bar */}
    <div style={{display:'flex', alignItems:'center', gap:10, padding:'4px 16px 10px', flexShrink:0}}>
      <div style={{flex:1, height:40, borderRadius:12, background:MV.surface, border:`1px solid ${MV.border}`, display:'flex', alignItems:'center', padding:'0 12px', gap:8}}>
        <span style={{fontSize:14, color:MV.ter}}>⌕</span>
        <span style={{fontSize:13, color:MV.text, fontWeight:600}}>LeBron James</span>
        <span style={{fontSize:11, color:MV.ter, marginLeft:'auto'}}>✕</span>
      </div>
      <span style={{fontSize:13, fontWeight:600, color:MV.coral, flexShrink:0, ...MVS}}>Cancel</span>
    </div>
    {/* Results header row — Sort · Filter icon · Bookmark icon */}
    <div style={{display:'flex', alignItems:'center', gap:8, padding:'0 16px 10px', flexShrink:0}}>
      <div style={{display:'flex', alignItems:'center', gap:4, padding:'5px 12px', borderRadius:999, background:MV.coralM, border:`1px solid ${MV.coral}`}}>
        <span style={{fontSize:11, fontWeight:700, color:MV.coral, ...MVS}}>Suggested</span>
        <span style={{fontSize:9, color:MV.coral}}>▾</span>
      </div>
      <div style={{width:32, height:32, borderRadius:'50%', background:MV.surface, border:`1px solid ${MV.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:MV.sec}}>⊟</div>
      <div style={{width:32, height:32, borderRadius:'50%', background:MV.surface, border:`1px solid ${MV.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:MV.sec}}>🔖</div>
    </div>
    <div style={{fontSize:11, color:MV.ter, padding:'0 16px 8px', flexShrink:0}}>143 results · within 25 km</div>
    {/* 3-col grid */}
    <div style={{flex:1, overflow:'hidden', padding:'0 12px'}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6}}>
        {MV_CARDS.map(c => <MV_GridCard key={c.id} c={c}/>)}
      </div>
    </div>
    <MV_TB/>
  </MV_Phone>
);

// ── Listing Detail — Core-Loop "Card Detail · Market" style ───────────────────
const MV_ListingDetail = ({ owner = false }) => {
  const c = MV_CARDS[0];
  const imgW = 158, imgH = Math.round(imgW / 0.714);
  return (
    <MV_Phone>
      <MV_SB/>
      {/* Nav — back + title + like / share / bookmark */}
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px 10px', flexShrink:0}}>
        <div style={{width:32, height:32, borderRadius:'50%', background:MV.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:MV.text}}>←</div>
        <span style={{fontSize:14, fontWeight:600, color:MV.text, ...MVS}}>{owner ? 'Your Listing' : 'Listing'}</span>
        <div style={{display:'flex', gap:8}}>
          {(owner
            ? [{icon:'↗',tip:'Share'},{icon:'···',tip:'More'}]
            : [{icon:'♡',tip:'Like'},{icon:'↗',tip:'Share'},{icon:'🔖',tip:'Save'}]
          ).map(b => (
            <div key={b.tip} style={{width:32, height:32, borderRadius:'50%', background:MV.surface, border:`1px solid ${MV.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:MV.text, letterSpacing:b.icon==='···'?1:0}}>{b.icon}</div>
          ))}
        </div>
      </div>
      {/* Centered card image */}
      <div style={{display:'flex', justifyContent:'center', marginBottom:16, flexShrink:0}}>
        <div style={{width:imgW, height:imgH, borderRadius:12, background:`linear-gradient(145deg,#fde0d2,${c.a})`, boxShadow:`0 10px 30px rgba(231,111,81,0.25), ${MV.shadow}`, position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{width:'60%', height:'76%', background:MV.bg, borderRadius:6, opacity:0.14}}/>
          <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 52%)'}}/>
          <div style={{position:'absolute', top:8, right:8, padding:'3px 8px', borderRadius:6, background:MV.greenM, color:MV.green, fontSize:9, fontWeight:700}}>✓ {c.grade}</div>
          <div style={{position:'absolute', bottom:8, left:8, padding:'3px 8px', borderRadius:999, background:'rgba(0,0,0,0.5)', color:'#fff', fontSize:9, fontWeight:600}}>🔥 {c.watches} watching</div>
        </div>
      </div>
      {/* Info */}
      <div style={{flex:1, overflow:'hidden', padding:'0 20px'}}>
        <div style={{fontSize:19, fontWeight:700, color:MV.text, ...MVS, lineHeight:1.2, marginBottom:3}}>{c.name} — {c.sub}</div>
        <div style={{fontSize:12, color:MV.sec, marginBottom:8}}>Sports · NBA · Rookie</div>
        {/* Price */}
        <div style={{display:'flex', alignItems:'baseline', gap:10, marginBottom:10}}>
          <div style={{fontSize:32, fontWeight:700, color:MV.coral, ...MVD, lineHeight:1}}>{c.pStr}</div>
          <div style={{fontSize:11, color:MV.ter}}>+ pickup · {c.dist} away</div>
        </div>
        {/* Social proof */}
        <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:12, padding:'8px 12px', borderRadius:10, background:MV.purpleM}}>
          <div style={{display:'flex'}}>
            {['J','M','A'].map((l,i) => (
              <div key={l} style={{width:20, height:20, borderRadius:'50%', background:[MV.coral,MV.purple,MV.green][i], display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:8, fontWeight:700, marginLeft:i>0?-5:0, border:`2px solid ${MV.bg}`}}>{l}</div>
            ))}
          </div>
          <span style={{fontSize:11, color:MV.purple, fontWeight:600, ...MVS}}>{owner ? '8 watching · 3 offers received' : '3 friends watching this card'}</span>
        </div>
        {/* Stats row */}
        <div style={{display:'flex', gap:8, marginBottom:12}}>
          {(owner
            ? [['Watching','8'],['Offers','3'],['Listed','Jun 12']]
            : [['Genre','Sports'],['Sold','24 total'],['Last Sold','$11,800']]
          ).map(([k,v]) => (
            <div key={k} style={{flex:1, padding:'8px', borderRadius:10, background:MV.surface, textAlign:'center', border:`1px solid ${MV.border}`}}>
              <div style={{fontSize:9, color:MV.ter, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.3px', marginBottom:3}}>{k}</div>
              <div style={{fontSize:10.5, fontWeight:700, color:MV.text}}>{v}</div>
            </div>
          ))}
        </div>
        {owner ? (
          <React.Fragment>
            {/* Your listing banner */}
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:12, padding:'10px 12px', borderRadius:12, background:MV.coralM, border:`1px solid ${MV.coral}`}}>
              <div style={{width:30, height:30, borderRadius:'50%', background:MV.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700, flexShrink:0}}>J</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12, fontWeight:600, color:MV.text}}>@jakescollects</div>
                <div style={{fontSize:10, color:MV.coral, marginTop:1, fontWeight:600}}>🏷 Your listing · Live on Market</div>
              </div>
            </div>
            {/* Offers received row (tappable) */}
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:14, padding:'10px 12px', borderRadius:12, background:MV.surface, border:`1px solid ${MV.border}`}}>
              <div style={{display:'flex'}}>
                {['A','M','D'].map((l,i) => (
                  <div key={l} style={{width:26, height:26, borderRadius:'50%', background:[MV.purple,MV.green,MV.amber][i], display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10, fontWeight:700, marginLeft:i>0?-7:0, border:`2px solid ${MV.bg}`}}>{l}</div>
                ))}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:12, fontWeight:700, color:MV.text, ...MVS}}>3 offers received</div>
                <div style={{fontSize:10, color:MV.ter, marginTop:1}}>Highest: $11,800 · from @avapulls</div>
              </div>
              <span style={{fontSize:15, color:MV.ter}}>›</span>
            </div>
            {/* Manage CTAs */}
            <div style={{display:'flex', gap:10}}>
              <div style={{flex:1, padding:'14px 0', borderRadius:999, border:`1.5px solid ${MV.coral}`, display:'flex', alignItems:'center', justifyContent:'center', color:MV.coral, fontSize:14, fontWeight:700, ...MVS}}>Edit Listing</div>
              <div style={{flex:1, padding:'14px 0', borderRadius:999, background:MV.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:14, fontWeight:700, ...MVS}}>Mark as Sold</div>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* Seller storefront card — tap to view shop */}
            <div style={{marginBottom:14, borderRadius:12, background:MV.surface, border:`1px solid ${MV.border}`, overflow:'hidden'}}>
              <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px'}}>
                <div style={{width:34, height:34, borderRadius:10, background:`linear-gradient(145deg,${MV.purple},${MV.purple}bb)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:15, flexShrink:0}}>🏪</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:'flex', alignItems:'center', gap:5}}>
                    <span style={{fontSize:12.5, fontWeight:700, color:MV.text, ...MVS}}>@{c.seller}</span>
                    <span style={{fontSize:10, color:MV.green}}>✓</span>
                  </div>
                  <div style={{fontSize:10, color:MV.ter, marginTop:1}}>4.9★ · 143 sales · 2.4 km away</div>
                </div>
                <div style={{padding:'7px 12px', borderRadius:999, background:MV.purpleM, border:`1px solid ${MV.purple}`, color:MV.purple, fontSize:11, fontWeight:700, ...MVS}}>View shop ›</div>
              </div>
              {/* mini storefront strip */}
              <div style={{display:'flex', gap:6, padding:'0 12px 11px'}}>
                {[MV.coral,MV.blue,MV.green,MV.amber].map((a,i) => (
                  <div key={i} style={{flex:1, height:42, borderRadius:7, background:`linear-gradient(145deg,${MV.bg},${a})`, position:'relative', overflow:'hidden'}}>
                    <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.2) 0%,transparent 55%)'}}/>
                  </div>
                ))}
              </div>
            </div>
            {/* Buyer CTA */}
            <div style={{display:'flex', gap:10}}>
              <div style={{width:52, padding:'14px 0', borderRadius:999, border:`1.5px solid ${MV.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:MV.sec, fontSize:17, ...MVS}}>🔖</div>
              <div style={{flex:1, padding:'14px 0', borderRadius:999, background:MV.coral, display:'flex', alignItems:'center', justifyContent:'center', gap:8, color:'#fff', fontSize:15, fontWeight:700, ...MVS}}>
                <span style={{fontSize:16}}>💬</span> I'm Interested
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
      <MV_TB/>
    </MV_Phone>
  );
};

// ── Chat thread — offer auto-message (FB Marketplace style) ───────────────────
const MV_ChatThread = () => {
  const c = MV_CARDS[0];
  return (
    <MV_Phone>
      <MV_SB/>
      <div style={{display:'flex', alignItems:'center', gap:10, padding:'4px 16px 10px', borderBottom:`1px solid ${MV.border}`, flexShrink:0}}>
        <span style={{fontSize:22, color:MV.text}}>‹</span>
        <div style={{width:34, height:34, borderRadius:'50%', background:MV.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:13, fontWeight:700, flexShrink:0}}>S</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13.5, fontWeight:700, color:MV.text, ...MVS}}>@{c.seller}</div>
          <div style={{fontSize:10, color:MV.green}}>● Online</div>
        </div>
        <span style={{fontSize:18, color:MV.ter}}>⋯</span>
      </div>
      <div style={{display:'flex', gap:10, padding:'9px 16px', background:MV.surface, borderBottom:`1px solid ${MV.border}`, flexShrink:0}}>
        <div style={{width:34, height:48, borderRadius:5, background:`linear-gradient(145deg,#fde0d2,${c.a})`, flexShrink:0, position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.2) 0%,transparent 55%)'}}/>
        </div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:11.5, fontWeight:700, color:MV.text, ...MVS, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.name} · {c.sub}</div>
          <div style={{fontSize:10.5, color:MV.ter}}>Asking <span style={{color:MV.coral, fontWeight:700}}>{c.pStr}</span> · {c.grade}</div>
        </div>
        <div style={{padding:'4px 10px', borderRadius:999, background:MV.coralM, border:`1px solid ${MV.coral}`, color:MV.coral, fontSize:10, fontWeight:700, flexShrink:0, alignSelf:'center'}}>View</div>
      </div>
      <div style={{flex:1, overflow:'hidden', padding:'14px 16px', display:'flex', flexDirection:'column', gap:12}}>
        <div style={{textAlign:'center', fontSize:10, color:MV.ter}}>Today · 2:34 PM</div>
        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5}}>
          <div style={{maxWidth:'80%', padding:'10px 14px', borderRadius:'16px 16px 4px 16px', background:MV.coral, color:'#fff', fontSize:12.5, lineHeight:1.5}}>
            Hi! I'm currently interested with your item. Is it still available?
          </div>
          <span style={{fontSize:9.5, color:MV.ter}}>Sent · Just now</span>
        </div>
        <div style={{textAlign:'center', padding:'8px 14px', borderRadius:8, background:MV.surface, border:`1px solid ${MV.border}`, fontSize:10.5, color:MV.sec, lineHeight:1.5}}>
          Message sent to <span style={{color:MV.coral, fontWeight:700}}>@{c.seller}</span>. They'll be notified right away.
        </div>
      </div>
      <div style={{padding:'10px 16px 22px', borderTop:`1px solid ${MV.border}`, display:'flex', gap:8, alignItems:'center', flexShrink:0}}>
        <div style={{flex:1, height:40, borderRadius:20, padding:'0 14px', background:MV.surface, border:`1px solid ${MV.border}`, display:'flex', alignItems:'center'}}>
          <span style={{fontSize:12, color:MV.ter}}>Write a message…</span>
        </div>
        <div style={{width:40, height:40, borderRadius:'50%', background:MV.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:18}}>→</div>
      </div>
    </MV_Phone>
  );
};

// ── Export ────────────────────────────────────────────────────────────────────
Object.assign(window, {
  MV_Home, MV_LocationSheet, MV_SortSheet, MV_FilterSheet,
  MV_SearchEmpty, MV_SearchTyping, MV_SearchResults,
  MV_ListingDetail, MV_ChatThread,
});

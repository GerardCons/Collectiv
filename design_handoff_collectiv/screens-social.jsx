// screens-social.jsx — Collectiv · Social Tab · Direction 2
// Community hub: Groups + Events toggle. Purple-accented (community color).

// ── Tokens ────────────────────────────────────────────────────────────────────
const SC = {
  bg:'#fef9f5', surface:'#fef0e8', card:'#ffffff',
  text:'#1a1210', sec:'#6b5c52', ter:'#aa9a90', border:'#f0ddd0',
  coral:'#E76F51', coralM:'rgba(231,111,81,0.10)',
  purple:'#7C3AED', purpleM:'rgba(124,58,237,0.10)', purpleD:'#6429c9',
  green:'#10B981', greenM:'rgba(16,185,129,0.12)',
  amber:'#f59e0b', blue:'#2563eb',
  shadow:'0 2px 8px rgba(26,18,16,0.07),0 1px 2px rgba(26,18,16,0.04)',
  tabI:'rgba(26,18,16,0.28)',
};
const SCS = {fontFamily:"'Sora',sans-serif"};
const SCD = {fontFamily:"'DM Sans',sans-serif"};

// ── Data ──────────────────────────────────────────────────────────────────────
const YOUR_GROUPS = [
  {name:'Edmonton Card Collectors', members:'2,431', avatar:'🃏', color:'#7C3AED', activity:'12 new posts today', live:false},
  {name:'PSA 10 Hunters',           members:'8,120', avatar:'💎', color:'#E76F51', activity:'5 new listings',     live:false},
  {name:'Vintage Hoops Vault',      members:'5,389', avatar:'🏀', color:'#f59e0b', activity:'Active now',         live:true},
];
const NEARBY_GROUPS = [
  {name:'YEG Sports Cards',       members:'891',   avatar:'📍', color:'#10B981', reason:'Edmonton, AB · 4 mutuals'},
  {name:'Alberta Breakers Club',  members:'1,204', avatar:'📦', color:'#2563eb', reason:'12 km away'},
];
const DISCOVER_GROUPS = [
  {name:'LeBron James Collectors', members:'14.2k', avatar:'👑', color:'#E76F51', reason:'You own 3 LeBron cards'},
  {name:'Rookie Card Investors',   members:'22.6k', avatar:'📈', color:'#7C3AED', reason:'Based on your collection'},
];
const EVENTS = [
  {title:'Edmonton Card Show 2026', m:'JUN', d:'14', loc:'Edmonton EXPO Centre', going:142, type:'Card Show', color:'#7C3AED', interested:true,  week:true},
  {title:'Friday Night Group Break', m:'JUN', d:'20', loc:'The Card Vault · Online', going:38, type:'Break',     color:'#E76F51', interested:false, week:false},
  {title:'Trade Night Meetup',       m:'JUN', d:'27', loc:'Sherwood Park Mall',     going:24, type:'Meetup',    color:'#10B981', interested:false, week:false},
];

// ── Primitives ────────────────────────────────────────────────────────────────
const SC_Phone = ({children, h=780}) => (
  <div style={{width:390, height:h, background:SC.bg, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative', ...SCD}}>{children}</div>
);

const SC_SB = () => (
  <div style={{height:44, display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'0 20px 8px', flexShrink:0, position:'relative'}}>
    <span style={{fontSize:13, fontWeight:600, color:SC.text, ...SCS}}>9:41</span>
    <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:110, height:26, background:'#000', borderRadius:'0 0 14px 14px'}}/>
    <div style={{display:'flex', gap:5, alignItems:'center', opacity:0.65}}>
      <span style={{fontSize:10, color:SC.text}}>▲▲▲</span>
      <div style={{width:22, height:11, borderRadius:2.5, border:`1.5px solid ${SC.text}`, position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', left:2, top:2, bottom:2, width:'70%', background:SC.text, borderRadius:1}}/>
      </div>
    </div>
  </div>
);

const SC_TB = () => {
  const tabs = [
    {id:'home',label:'Home',icon:'⌂'},{id:'portfolio',label:'Portfolio',icon:'◫'},
    {id:'market',label:'Market',icon:'◈'},{id:'social',label:'Social',icon:'◎'},{id:'map',label:'Map',icon:'⊕'},
  ];
  return (
    <div style={{height:56, display:'flex', borderTop:`1px solid ${SC.border}`, background:SC.bg, flexShrink:0}}>
      {tabs.map(t => {
        const on = t.id === 'social';
        return (
          <div key={t.id} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, color:on?SC.coral:SC.tabI, position:'relative'}}>
            {on && <div style={{position:'absolute', top:0, width:28, height:3, borderRadius:'0 0 3px 3px', background:SC.coral}}/>}
            <span style={{fontSize:17, lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:9, fontWeight:on?700:500, ...SCS, lineHeight:1}}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const SC_Dim = () => <div style={{position:'absolute', inset:0, background:'rgba(14,13,12,0.55)', zIndex:10}}/>;
const SC_Sheet = ({height, children}) => (
  <div style={{position:'absolute', bottom:0, left:0, right:0, height, background:SC.bg, borderRadius:'24px 24px 0 0', zIndex:20, display:'flex', flexDirection:'column', boxShadow:'0 -12px 40px rgba(26,18,16,0.16)'}}>
    <div style={{width:36, height:4, borderRadius:2, background:SC.ter, margin:'12px auto 4px'}}/>
    {children}
  </div>
);

// ── Header + toggle ───────────────────────────────────────────────────────────
// Header — "Social" title stays; Groups/Events as underline tabs; bell + create-menu top right
// Header — "Social" title + bell + person/account icon; Groups/Events segmented toggle
const SC_PersonIcon = () => (
  <div style={{width:36, height:36, borderRadius:'50%', background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', justifyContent:'center'}}>
    <div style={{position:'relative', width:20, height:20}}>
      <div style={{position:'absolute', top:1, left:'50%', transform:'translateX(-50%)', width:8, height:8, borderRadius:'50%', border:`1.6px solid ${SC.sec}`}}/>
      <div style={{position:'absolute', bottom:1, left:'50%', transform:'translateX(-50%)', width:15, height:9, borderRadius:'9px 9px 0 0', border:`1.6px solid ${SC.sec}`, borderBottom:'none'}}/>
    </div>
  </div>
);

// ── INVITE MEMBERS picker (tap “Invite members” in Create Group) ───────────
const INVITE_PEOPLE = [
  {n:'Marcus Chen',    h:'mchen_cards',   c:'#E76F51', sel:true},
  {n:'Ava Rodriguez',  h:'avapulls',      c:'#7C3AED', sel:true},
  {n:'Jordan Blake',   h:'jblake_psa',    c:'#10B981', sel:false},
  {n:'Sam Whitfield',  h:'whitfield_vtg', c:'#2563eb', sel:false},
  {n:'Priya Nair',     h:'priya_breaks',  c:'#f59e0b', sel:false},
  {n:'Diego Santos',   h:'dsantos_rc',    c:'#E76F51', sel:false},
];
const SC_InvitePicker = () => {
  const count = INVITE_PEOPLE.filter(p=>p.sel).length;
  return (
    <SC_Phone>
      <SC_SB/>
      <SC_NavHead title="Invite Members" action="Done"/>
      {/* Search */}
      <div style={{padding:'14px 16px 12px', flexShrink:0}}>
        <div style={{height:38, borderRadius:999, background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', padding:'0 14px', gap:8}}>
          <span style={{fontSize:14, color:SC.ter}}>⌕</span>
          <span style={{fontSize:13, color:SC.ter}}>Search followers…</span>
        </div>
      </div>
      <div style={{fontSize:10, fontWeight:700, color:SC.ter, textTransform:'uppercase', letterSpacing:'0.5px', padding:'0 20px 4px', flexShrink:0}}>Your Followers</div>
      {/* List */}
      <div style={{flex:1, overflow:'hidden', padding:'0 16px'}}>
        {INVITE_PEOPLE.map(p => (
          <div key={p.h} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${SC.border}`}}>
            <div style={{width:42, height:42, borderRadius:'50%', background:p.c, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:15, fontWeight:700, ...SCS, flexShrink:0}}>{p.n[0]}</div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:13.5, fontWeight:700, color:SC.text, ...SCS}}>{p.n}</div>
              <div style={{fontSize:10.5, color:SC.ter, marginTop:1}}>@{p.h}</div>
            </div>
            <div style={{width:24, height:24, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13,
              background: p.sel ? SC.purple : 'transparent',
              border: p.sel ? 'none' : `2px solid ${SC.border}`,
              color:'#fff'}}>{p.sel && '✓'}</div>
          </div>
        ))}
      </div>
      {/* Sticky invite */}
      <div style={{padding:'10px 16px 22px', borderTop:`1px solid ${SC.border}`, flexShrink:0}}>
        <div style={{padding:'14px', borderRadius:999, background:SC.purple, textAlign:'center', fontSize:15, fontWeight:700, color:'#fff', ...SCS, boxShadow:'0 4px 14px rgba(124,58,237,0.3)'}}>Invite {count} Selected</div>
      </div>
    </SC_Phone>
  );
};

// Header — page-title style ("Groups"/"Events" like Marketplace). Tap title to switch.
const SC_Header = ({active='Groups', onToggle, switching=false}) => (
  <div style={{padding:'2px 20px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0}}>
    {/* Tappable page title + switch chevron */}
    <div onClick={onToggle} style={{display:'flex', alignItems:'center', gap:9, cursor:onToggle?'pointer':'default'}}>
      <div style={{fontSize:26, fontWeight:800, color:SC.text, ...SCS, opacity:switching?0:1, transform:switching?'translateY(-7px)':'none', transition:'opacity .15s ease, transform .15s ease'}}>{active}</div>
      <div style={{width:26, height:26, borderRadius:'50%', background:SC.purpleM, display:'flex', alignItems:'center', justifyContent:'center', color:SC.purple, fontSize:13, lineHeight:1, transition:'transform .28s ease', transform:active==='Events'?'rotate(180deg)':'none'}}>⌄</div>
    </div>
    {/* + create + bell + person */}
    <div style={{display:'flex', gap:8, alignItems:'center'}}>
      <div style={{width:36, height:36, borderRadius:'50%', background:SC.purple, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, color:'#fff', fontWeight:600, boxShadow:`0 3px 10px ${SC.purple}40`}}>+</div>
      <div style={{width:36, height:36, borderRadius:'50%', background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, position:'relative'}}>
        🔔
        <div style={{position:'absolute', top:1, right:1, width:8, height:8, borderRadius:'50%', background:SC.purple, border:`1.5px solid ${SC.bg}`}}/>
      </div>
      <SC_PersonIcon/>
    </div>
  </div>
);

// Group sub-toggle — Your Groups · Near You · Discover (icon segmented)
const SC_GroupSubToggle = ({view='your', onPick}) => {
  const items = [
    {id:'your',     icon:'👥', label:'Your Groups'},
    {id:'near',     icon:'📍', label:'Near You'},
    {id:'discover', icon:'✦',  label:'Discover'},
  ];
  return (
    <div style={{display:'flex', gap:6, padding:'0 16px 12px', flexShrink:0}}>
      {items.map(it => {
        const on = it.id === view;
        return (
          <div key={it.id} onClick={()=>onPick&&onPick(it.id)} style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'8px 0', borderRadius:11, background:on?SC.purpleM:SC.surface, border:`1px solid ${on?SC.purple:SC.border}`, color:on?SC.purple:SC.sec, cursor:onPick?'pointer':'default', transition:'background .15s ease, border-color .15s ease, color .15s ease'}}>
            <span style={{fontSize:13}}>{it.icon}</span>
            <span style={{fontSize:11.5, fontWeight:700, ...SCS}}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const SC_SectionHead = ({title, sub, action}) => (
  <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:8, marginTop:2}}>
    <div>
      <div style={{fontSize:13, fontWeight:700, color:SC.text, ...SCS}}>{title}</div>
      {sub && <div style={{fontSize:10, color:SC.ter, marginTop:1}}>{sub}</div>}
    </div>
    {action && <span style={{fontSize:11, color:SC.purple, fontWeight:600, ...SCS}}>{action}</span>}
  </div>
);

// ── Group row ─────────────────────────────────────────────────────────────────
const SC_GroupRow = ({g, joined}) => (
  <div style={{display:'flex', alignItems:'center', gap:12, padding:'9px 0'}}>
    <div style={{width:46, height:46, borderRadius:13, background:`linear-gradient(145deg, ${g.color}, ${g.color}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0, boxShadow:`0 3px 10px ${g.color}33`}}>{g.avatar}</div>
    <div style={{flex:1, minWidth:0}}>
      <div style={{fontSize:13.5, fontWeight:700, color:SC.text, ...SCS, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{g.name}</div>
      <div style={{display:'flex', alignItems:'center', gap:5, marginTop:2}}>
        {g.live && <div style={{display:'flex', alignItems:'center', gap:3}}><div style={{width:5, height:5, borderRadius:'50%', background:SC.green}}/></div>}
        <span style={{fontSize:10.5, color:g.live?SC.green:SC.ter, fontWeight:g.live?700:400}}>{g.members} members · {g.activity || g.reason}</span>
      </div>
    </div>
    {joined
      ? <span style={{fontSize:20, color:SC.ter, flexShrink:0, paddingRight:2}}>›</span>
      : <div style={{padding:'5px 15px', borderRadius:999, background:SC.purple, color:'#fff', fontSize:11, fontWeight:700, ...SCS, flexShrink:0}}>Join</div>}
  </div>
);

// ── GROUPS VIEW ───────────────────────────────────────────────────────────────
const GROUP_META = {
  your:     {list:YOUR_GROUPS,     joined:true,  desc:'Groups you’ve joined'},
  near:     {list:NEARBY_GROUPS,   joined:false, desc:'Active groups around Edmonton, AB'},
  discover: {list:DISCOVER_GROUPS, joined:false, desc:'Recommended from the cards you collect'},
};
// Body only (search + sub-toggle + list) — reused by static screen + interactive shell
const GroupsBody = ({view='your', onSub}) => {
  const meta = GROUP_META[view];
  return (
    <>
      <div style={{padding:'0 16px 12px', flexShrink:0}}>
        <div style={{height:38, borderRadius:999, background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', padding:'0 14px', gap:8}}>
          <span style={{fontSize:14, color:SC.ter}}>⌕</span>
          <span style={{fontSize:13, color:SC.ter}}>Search groups…</span>
        </div>
      </div>
      <SC_GroupSubToggle view={view} onPick={onSub}/>
      <div style={{flex:1, overflow:'hidden', padding:'0 16px'}}>
        <div style={{fontSize:10.5, color:SC.ter, marginBottom:2}}>{meta.desc}</div>
        {meta.list.map(g => <SC_GroupRow key={g.name} g={g} joined={meta.joined}/>)}
      </div>
    </>
  );
};
const SC_Groups = ({view='your'}) => (
  <SC_Phone>
    <SC_SB/>
    <SC_Header active="Groups"/>
    <GroupsBody view={view}/>
    <SC_TB/>
  </SC_Phone>
);

// ── Event card · Alt A — Banner + date badge (current) ───────────────────────
const EvCardA = ({e}) => (
  <div style={{borderRadius:14, overflow:'hidden', background:SC.card, boxShadow:SC.shadow, marginBottom:12}}>
    {/* Banner */}
    <div style={{height:84, background:`linear-gradient(135deg, #1a1210 0%, ${e.color} 130%)`, position:'relative'}}>
      <div style={{position:'absolute', inset:0, background:'linear-gradient(90deg, rgba(26,18,16,0.4) 0%, transparent 100%)'}}/>
      <div style={{position:'absolute', top:10, left:12, padding:'3px 9px', borderRadius:999, background:'rgba(255,255,255,0.92)', color:'#1a1210', fontSize:9, fontWeight:800, letterSpacing:'0.4px', ...SCS}}>{e.type.toUpperCase()}</div>
      <div style={{position:'absolute', top:10, right:12, display:'flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:999, background:'rgba(0,0,0,0.4)'}}>
        <span style={{fontSize:9, color:'#fff'}}>👥</span>
        <span style={{fontSize:9.5, color:'#fff', fontWeight:600}}>{e.going} going</span>
      </div>
    </div>
    {/* Content */}
    <div style={{padding:'12px 14px', display:'flex', gap:12}}>
      {/* Date badge */}
      <div style={{width:46, borderRadius:10, overflow:'hidden', border:`1px solid ${SC.border}`, flexShrink:0, textAlign:'center', alignSelf:'flex-start'}}>
        <div style={{background:e.color, color:'#fff', fontSize:8.5, fontWeight:800, padding:'3px 0', letterSpacing:'0.5px', ...SCS}}>{e.m}</div>
        <div style={{fontSize:18, fontWeight:800, color:SC.text, padding:'3px 0', ...SCS}}>{e.d}</div>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:14, fontWeight:700, color:SC.text, ...SCS, lineHeight:1.25, marginBottom:3}}>{e.title}</div>
        <div style={{display:'flex', alignItems:'center', gap:4, fontSize:10.5, color:SC.sec, marginBottom:8}}>
          <span>📍</span><span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{e.loc}</span>
        </div>
        <div style={{display:'flex', gap:8}}>
          <div style={{flex:1, padding:'7px 0', borderRadius:999, textAlign:'center', fontSize:11.5, fontWeight:700, ...SCS,
            background: e.interested ? SC.purpleM : SC.purple,
            color:      e.interested ? SC.purple  : '#fff',
            border:     e.interested ? `1px solid ${SC.purple}` : 'none'}}>
            {e.interested ? '✓ Interested' : '★ Interested'}
          </div>
          <div style={{width:34, borderRadius:999, background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:SC.sec}}>↗</div>
        </div>
      </div>
    </div>
  </div>
);

// ── Event card · Alt B — Compact row (dense, no banner) ──────────────────────
const EvCardB = ({e}) => (
  <div style={{display:'flex', gap:12, alignItems:'center', padding:'11px 12px', borderRadius:14, background:SC.card, boxShadow:SC.shadow, marginBottom:10, borderLeft:`3px solid ${e.color}`}}>
    {/* Date column */}
    <div style={{width:44, textAlign:'center', flexShrink:0}}>
      <div style={{fontSize:9, fontWeight:800, color:e.color, letterSpacing:'0.5px', ...SCS}}>{e.m}</div>
      <div style={{fontSize:22, fontWeight:800, color:SC.text, ...SCS, lineHeight:1}}>{e.d}</div>
    </div>
    <div style={{width:1, alignSelf:'stretch', background:SC.border}}/>
    {/* Detail */}
    <div style={{flex:1, minWidth:0}}>
      <div style={{fontSize:13.5, fontWeight:700, color:SC.text, ...SCS, lineHeight:1.2, marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{e.title}</div>
      <div style={{display:'flex', alignItems:'center', gap:4, fontSize:10, color:SC.sec, marginBottom:2}}>
        <span>📍</span><span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{e.loc}</span>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:8, fontSize:9.5, color:SC.ter}}>
        <span style={{padding:'1.5px 7px', borderRadius:999, background:SC.surface, fontWeight:700, color:SC.sec}}>{e.type}</span>
        <span>👥 {e.going} going</span>
      </div>
    </div>
    {/* Interested star */}
    <div style={{width:34, height:34, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15,
      background: e.interested ? SC.purple : SC.purpleM,
      color:      e.interested ? '#fff'    : SC.purple,
      border:     e.interested ? 'none'    : `1px solid ${SC.purple}`}}>★</div>
  </div>
);

// ── Event card · Alt C — Poster (image-forward, overlaid) ────────────────────
const EvCardC = ({e}) => (
  <div style={{borderRadius:16, overflow:'hidden', position:'relative', height:158, marginBottom:12, boxShadow:SC.shadow, background:`linear-gradient(160deg, #1a1210 0%, ${e.color} 150%)`}}>
    <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(14,10,8,0.85) 0%, rgba(14,10,8,0.1) 60%)'}}/>
    {/* Top row: type + date chip */}
    <div style={{position:'absolute', top:12, left:12, right:12, display:'flex', alignItems:'flex-start', justifyContent:'space-between'}}>
      <div style={{padding:'3px 10px', borderRadius:999, background:'rgba(255,255,255,0.92)', color:'#1a1210', fontSize:9, fontWeight:800, letterSpacing:'0.4px', ...SCS}}>{e.type.toUpperCase()}</div>
      <div style={{textAlign:'center', borderRadius:9, overflow:'hidden', background:'rgba(255,255,255,0.95)', width:42}}>
        <div style={{background:e.color, color:'#fff', fontSize:8, fontWeight:800, padding:'2px 0', ...SCS}}>{e.m}</div>
        <div style={{fontSize:16, fontWeight:800, color:'#1a1210', padding:'2px 0', ...SCS}}>{e.d}</div>
      </div>
    </div>
    {/* Bottom: title + loc + cta */}
    <div style={{position:'absolute', left:14, right:14, bottom:12}}>
      <div style={{fontSize:16, fontWeight:800, color:'#fff', ...SCS, lineHeight:1.2, marginBottom:3}}>{e.title}</div>
      <div style={{display:'flex', alignItems:'center', gap:5, fontSize:10.5, color:'rgba(255,255,255,0.8)', marginBottom:9}}>
        <span>📍</span><span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{e.loc}</span>
        <span style={{opacity:0.6}}>·</span><span>👥 {e.going}</span>
      </div>
      <div style={{display:'inline-flex', padding:'7px 16px', borderRadius:999, fontSize:11.5, fontWeight:700, ...SCS,
        background: e.interested ? 'rgba(255,255,255,0.92)' : SC.purple,
        color:      e.interested ? SC.purple : '#fff'}}>
        {e.interested ? '✓ Interested' : '★ Interested'}
      </div>
    </div>
  </div>
);

const EV_CARDS = { A: EvCardA, B: EvCardB, C: EvCardC };

// ── EVENTS VIEW ───────────────────────────────────────────────────────────────
const EventsBody = ({sort='Discover', card='B', onSort}) => {
  const SORTS = ['Discover','This Week','Interested'];
  const list = sort==='This Week' ? EVENTS.filter(e=>e.week)
             : sort==='Interested' ? EVENTS.filter(e=>e.interested)
             : EVENTS;
  const Card = EV_CARDS[card];
  return (
    <>
      <div style={{padding:'0 16px 12px', flexShrink:0}}>
        <div style={{height:38, borderRadius:999, background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', padding:'0 14px', gap:8}}>
          <span style={{fontSize:14, color:SC.ter}}>⌕</span>
          <span style={{fontSize:13, color:SC.ter}}>Search events…</span>
        </div>
      </div>
      <div style={{display:'flex', gap:7, padding:'0 16px 12px', flexShrink:0}}>
        {SORTS.map(s => {
          const on = s === sort;
          const label = s === 'Discover' ? 'Discover (All)' : s;
          return <div key={s} onClick={()=>onSort&&onSort(s)} style={{padding:'6px 13px', borderRadius:999, background:on?SC.purpleM:SC.surface, border:`1px solid ${on?SC.purple:SC.border}`, color:on?SC.purple:SC.sec, fontSize:11, fontWeight:700, ...SCS, cursor:onSort?'pointer':'default', transition:'background .15s ease, border-color .15s ease, color .15s ease'}}>{label}</div>;
        })}
      </div>
      <div style={{flex:1, overflow:'hidden', padding:'0 16px'}}>
        {list.map(e => <Card key={e.title} e={e}/>)}
      </div>
    </>
  );
};
const SC_Events = ({sort='Discover', card='B'}) => (
  <SC_Phone>
    <SC_SB/>
    <SC_Header active="Events"/>
    <EventsBody sort={sort} card={card}/>
    <SC_TB/>
  </SC_Phone>
);

// ── INTERACTIVE SHELL — tap the page title to animate-toggle Groups ⇄ Events ──
const SC_Social = ({initial='groups'}) => {
  const [view, setView]   = React.useState(initial);   // 'groups' | 'events'
  const [gview, setGview] = React.useState('your');
  const [esort, setEsort] = React.useState('Discover');
  const [anim, setAnim]   = React.useState(false);
  const toggle = () => {
    if (anim) return;
    setAnim(true);
    setTimeout(() => { setView(v => v==='groups' ? 'events' : 'groups'); }, 150);
    setTimeout(() => { setAnim(false); }, 170);
  };
  return (
    <SC_Phone>
      <SC_SB/>
      <SC_Header active={view==='groups'?'Groups':'Events'} onToggle={toggle} switching={anim}/>
      <div style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden', opacity:anim?0:1, transform:anim?'translateY(10px)':'none', transition:'opacity .16s ease, transform .16s ease'}}>
        {view==='groups'
          ? <GroupsBody view={gview} onSub={setGview}/>
          : <EventsBody sort={esort} onSort={setEsort}/>}
      </div>
      <SC_TB/>
    </SC_Phone>
  );
};

// ── CREATE GROUP sheet ────────────────────────────────────────────────────────
// Shared form bits
const SC_FLabel = ({children, hint}) => (
  <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:6}}>
    <span style={{fontSize:10, fontWeight:700, color:SC.ter, textTransform:'uppercase', letterSpacing:'0.5px'}}>{children}</span>
    {hint && <span style={{fontSize:9.5, color:SC.ter}}>{hint}</span>}
  </div>
);
const SC_Input = ({value, active, icon, right}) => (
  <div style={{padding:'11px 14px', borderRadius:12, background:active?SC.card:SC.surface, border:`1.5px solid ${active?SC.purple:SC.border}`, display:'flex', alignItems:'center', gap:8, boxShadow:active?'0 0 0 3px rgba(124,58,237,0.08)':'none'}}>
    {icon && <span style={{fontSize:13}}>{icon}</span>}
    <span style={{fontSize:13, color:SC.text, fontWeight:600, flex:1}}>{value}</span>
    {active && <div style={{width:1.5, height:15, background:SC.purple}}/>}
    {right && <span style={{fontSize:11, color:SC.ter}}>{right}</span>}
  </div>
);
const SC_NavHead = ({title, action='Next'}) => (
  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'2px 16px 12px', borderBottom:`1px solid ${SC.border}`, flexShrink:0}}>
    <span style={{fontSize:20, color:SC.text, width:40}}>✕</span>
    <span style={{fontSize:15, fontWeight:800, color:SC.text, ...SCS}}>{title}</span>
    <span style={{fontSize:13, fontWeight:700, color:SC.purple, width:40, textAlign:'right', ...SCS}}>{action}</span>
  </div>
);
const GENRES = ['Any/All','Sports','Pokémon','Magic','Yu-Gi-Oh!','One Piece','Vintage'];

// ── CREATE GROUP — in-depth full screen ───────────────────────────────────────
const SC_CreateGroup = () => (
  <SC_Phone h={1000}>
    <SC_SB/>
    <SC_NavHead title="Create Group" action="Create"/>
    <div style={{flex:1, overflow:'hidden', padding:'14px 16px', display:'flex', flexDirection:'column', gap:16}}>
      {/* Cover */}
      <div style={{height:96, borderRadius:14, background:SC.purpleM, border:`1.5px dashed ${SC.purple}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, color:SC.purple}}>
        <span style={{fontSize:20}}>🖼</span>
        <span style={{fontSize:11.5, fontWeight:700, ...SCS}}>Add cover photo</span>
      </div>
      {/* Icon + name */}
      <div style={{display:'flex', gap:12, alignItems:'flex-end'}}>
        <div style={{width:56, height:56, borderRadius:15, background:SC.purpleM, border:`1.5px dashed ${SC.purple}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, color:SC.purple, flexShrink:0}}>📷</div>
        <div style={{flex:1}}>
          <SC_FLabel hint="Required">Group Name</SC_FLabel>
          <SC_Input value="Edmonton Rookie Card Investors" active/>
        </div>
      </div>
      {/* About */}
      <div>
        <SC_FLabel hint="0/250">About this group</SC_FLabel>
        <div style={{padding:'11px 14px', borderRadius:12, background:SC.surface, border:`1px solid ${SC.border}`, minHeight:54, fontSize:12.5, color:SC.sec, lineHeight:1.5}}>A community for serious rookie-card investors in the Edmonton area — share pickups, grade talk, and trade locally.</div>
      </div>
      {/* Privacy */}
      <div>
        <SC_FLabel>Privacy</SC_FLabel>
        <div style={{display:'flex', flexDirection:'column', gap:8}}>
          {[['🌐','Public','Anyone can see who\u2019s in the group and what they post.',true],
            ['🔒','Private','Only members can see who\u2019s in the group and what they post.',false]].map(([icon,l,sub,a]) => (
            <div key={l} style={{display:'flex', alignItems:'center', gap:12, padding:'11px 13px', borderRadius:12, background:a?SC.purpleM:SC.surface, border:`1.5px solid ${a?SC.purple:SC.border}`}}>
              <span style={{fontSize:17}}>{icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13, fontWeight:700, color:a?SC.purple:SC.text, ...SCS}}>{l}</div>
                <div style={{fontSize:9.5, color:SC.ter, marginTop:1, lineHeight:1.4}}>{sub}</div>
              </div>
              <div style={{width:18, height:18, borderRadius:'50%', border:`2px solid ${a?SC.purple:SC.border}`, display:'flex', alignItems:'center', justifyContent:'center'}}>{a && <div style={{width:9, height:9, borderRadius:'50%', background:SC.purple}}/>}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Location */}
      <div>
        <SC_FLabel hint="Optional">Location</SC_FLabel>
        <SC_Input value="Edmonton, AB" icon="📍" right="▾"/>
      </div>
      {/* Invite — empty state */}
      <div>
        <SC_FLabel hint="Optional">Invite members</SC_FLabel>
        <div style={{display:'flex', alignItems:'center', gap:12, padding:'13px 14px', borderRadius:12, background:SC.surface, border:`1.5px dashed ${SC.border}`}}>
          <div style={{width:38, height:38, borderRadius:'50%', background:SC.purpleM, border:`1.5px dashed ${SC.purple}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, color:SC.purple, flexShrink:0}}>+</div>
          <div style={{flex:1}}>
            <div style={{fontSize:12.5, fontWeight:700, color:SC.text, ...SCS}}>Invite members</div>
            <div style={{fontSize:10, color:SC.ter, marginTop:1}}>No one invited yet · add from your followers</div>
          </div>
          <span style={{fontSize:18, color:SC.ter}}>›</span>
        </div>
      </div>
    </div>
    <div style={{padding:'10px 16px 22px', borderTop:`1px solid ${SC.border}`, flexShrink:0}}>
      <div style={{padding:'14px', borderRadius:999, background:SC.purple, textAlign:'center', fontSize:15, fontWeight:700, color:'#fff', ...SCS, boxShadow:'0 4px 14px rgba(124,58,237,0.3)'}}>Create Group</div>
    </div>
  </SC_Phone>
);

// ── CREATE EVENT — in-depth full screen ───────────────────────────────────────
const SC_CreateEvent = () => (
  <SC_Phone h={1180}>
    <SC_SB/>
    <SC_NavHead title="Create Event" action="Publish"/>
    <div style={{flex:1, overflow:'hidden', padding:'14px 16px', display:'flex', flexDirection:'column', gap:16}}>
      {/* Cover */}
      <div style={{height:96, borderRadius:14, background:SC.purpleM, border:`1.5px dashed ${SC.purple}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, color:SC.purple}}>
        <span style={{fontSize:20}}>🖼</span>
        <span style={{fontSize:11.5, fontWeight:700, ...SCS}}>Add cover image</span>
      </div>
      {/* Title */}
      <div>
        <SC_FLabel hint="Required">Event Title</SC_FLabel>
        <SC_Input value="Summer Trade Night" active/>
      </div>
      {/* Date + Type */}
      <div style={{display:'flex', gap:10}}>
        <div style={{flex:1}}><SC_FLabel>Date</SC_FLabel><SC_Input value="Jul 18, 2026" right="📅"/></div>
        <div style={{flex:1}}><SC_FLabel>Type</SC_FLabel><SC_Input value="Meetup" right="▾"/></div>
      </div>
      {/* Time range */}
      <div>
        <SC_FLabel>Schedule</SC_FLabel>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <div style={{flex:1, padding:'11px 14px', borderRadius:12, background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div><div style={{fontSize:8, color:SC.ter, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px'}}>Start</div><span style={{fontSize:13, color:SC.text, fontWeight:700, ...SCS}}>8:00 AM</span></div>
            <span style={{fontSize:13}}>🕐</span>
          </div>
          <span style={{fontSize:13, color:SC.ter, fontWeight:700}}>–</span>
          <div style={{flex:1, padding:'11px 14px', borderRadius:12, background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div><div style={{fontSize:8, color:SC.ter, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.4px'}}>End</div><span style={{fontSize:13, color:SC.text, fontWeight:700, ...SCS}}>5:00 PM</span></div>
            <span style={{fontSize:13}}>🕔</span>
          </div>
        </div>
      </div>
      {/* Preferred genre */}
      <div>
        <SC_FLabel hint="Who it's for">Preferred Genre</SC_FLabel>
        <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {GENRES.map((g,i) => {
            const a = i===0 || i===1;
            return <div key={g} style={{padding:'6px 13px', borderRadius:999, background:a?SC.purple:SC.surface, border:`1px solid ${a?SC.purple:SC.border}`, color:a?'#fff':SC.sec, fontSize:10.5, fontWeight:600, ...SCS}}>{g}</div>;
          })}
        </div>
      </div>
      {/* Location */}
      <div>
        <SC_FLabel>Location</SC_FLabel>
        <SC_Input value="Sherwood Park Mall, AB" icon="📍"/>
      </div>
      {/* Co-hosts */}
      <div>
        <SC_FLabel hint="Optional">Co-hosts</SC_FLabel>
        <div style={{fontSize:10, color:SC.ter, marginTop:-4, marginBottom:8}}>Co-hosts can edit the event and invite people. You can only add people you follow each other with.</div>
        <div style={{display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:12, background:SC.surface, border:`1px solid ${SC.border}`, marginBottom:8}}>
          {SC_Avatar('J', SC.coral, 34)}
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:12.5, fontWeight:700, color:SC.text, ...SCS}}>You · @jakescollects</div>
            <div style={{fontSize:10, color:SC.purple, marginTop:1, fontWeight:600}}>Owner</div>
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:12, background:SC.surface, border:`1px solid ${SC.border}`, marginBottom:8}}>
          {SC_Avatar('M', SC.blue, 34)}
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:12.5, fontWeight:700, color:SC.text, ...SCS}}>Marcus Chen</div>
            <div style={{fontSize:10, color:SC.ter, marginTop:1}}>Co-host · @mchen_cards</div>
          </div>
          <span style={{fontSize:16, color:SC.ter}}>✕</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:12, background:SC.surface, border:`1.5px dashed ${SC.border}`}}>
          <div style={{width:36, height:36, borderRadius:'50%', background:SC.purpleM, border:`1.5px dashed ${SC.purple}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, color:SC.purple}}>👤⁺</div>
          <div style={{flex:1}}>
            <div style={{fontSize:12.5, fontWeight:700, color:SC.text, ...SCS}}>Add a co-host</div>
            <div style={{fontSize:10, color:SC.ter, marginTop:1}}>Search people you follow each other with</div>
          </div>
          <span style={{fontSize:16, color:SC.purple}}>›</span>
        </div>
      </div>
      {/* Description */}
      <div>
        <SC_FLabel hint="Optional">Details</SC_FLabel>
        <div style={{padding:'11px 14px', borderRadius:12, background:SC.surface, border:`1px solid ${SC.border}`, minHeight:54, fontSize:12.5, color:SC.sec, lineHeight:1.5}}>Bring your trade binders! Tables provided. Buy, sell, and trade sports cards with local collectors — all grades welcome.</div>
      </div>
    </div>
    <div style={{padding:'10px 16px 22px', borderTop:`1px solid ${SC.border}`, flexShrink:0}}>
      <div style={{padding:'14px', borderRadius:999, background:SC.purple, textAlign:'center', fontSize:15, fontWeight:700, color:'#fff', ...SCS, boxShadow:'0 4px 14px rgba(124,58,237,0.3)'}}>Publish Event</div>
    </div>
  </SC_Phone>
);

// ── EVENT DETAIL — view page (event tapped) ───────────────────────────────────
const SC_EventDetail = ({overlay=null}) => {
  const e = EVENTS[0]; // Edmonton Card Show 2026
  return (
    <SC_Phone h={1180}>
      {/* Poster header */}
      <div style={{height:208, position:'relative', background:`linear-gradient(160deg, #1a1210 0%, ${e.color} 150%)`, flexShrink:0}}>
        <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(14,10,8,0.7) 0%, transparent 55%)'}}/>
        <div style={{height:44}}/>
        <div style={{position:'absolute', top:50, left:16, right:16, display:'flex', justifyContent:'space-between'}}>
          <div style={{width:34, height:34, borderRadius:'50%', background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, color:'#fff'}}>←</div>
          <div style={{display:'flex', gap:8}}>
            <div style={{width:34, height:34, borderRadius:'50%', background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#fff'}}>✎</div>
          </div>
        </div>
        <div style={{position:'absolute', bottom:14, left:16, right:16}}>
          <div style={{display:'inline-block', padding:'3px 10px', borderRadius:999, background:'rgba(255,255,255,0.92)', color:'#1a1210', fontSize:9, fontWeight:800, letterSpacing:'0.4px', ...SCS, marginBottom:7}}>{e.type.toUpperCase()}</div>
          <div style={{fontSize:21, fontWeight:800, color:'#fff', ...SCS, lineHeight:1.15}}>{e.title}</div>
        </div>
      </div>
      <div style={{flex:1, overflow:'hidden', padding:'14px 16px', display:'flex', flexDirection:'column', gap:14}}>
        {/* Date / time / location */}
        <div style={{display:'flex', flexDirection:'column', gap:11}}>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{width:42, borderRadius:9, overflow:'hidden', border:`1px solid ${SC.border}`, textAlign:'center', flexShrink:0}}>
              <div style={{background:e.color, color:'#fff', fontSize:8, fontWeight:800, padding:'2px 0', ...SCS}}>{e.m}</div>
              <div style={{fontSize:16, fontWeight:800, color:SC.text, padding:'2px 0', ...SCS}}>{e.d}</div>
            </div>
            <div>
              <div style={{fontSize:13, fontWeight:700, color:SC.text, ...SCS}}>Saturday, June 14, 2026</div>
              <div style={{fontSize:11, color:SC.sec, marginTop:1}}>🕐 8:00 AM – 5:00 PM</div>
            </div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{width:42, height:42, borderRadius:9, background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0}}>📍</div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:13, fontWeight:700, color:SC.text, ...SCS}}>{e.loc}</div>
              <div style={{fontSize:11, color:SC.sec, marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>7515 118 Ave NW, Edmonton, AB T5B 0V3</div>
              <div style={{fontSize:11, color:SC.purple, marginTop:2, fontWeight:600}}>Get directions →</div>
            </div>
          </div>
        </div>
        {/* Interested · Going · More */}
        <div style={{display:'flex', gap:8}}>
          <div style={{flex:1, padding:'11px 0', borderRadius:10, background:SC.purple, display:'flex', alignItems:'center', justifyContent:'center', gap:6, color:'#fff', fontSize:13, fontWeight:700, ...SCS, boxShadow:`0 3px 10px ${SC.purple}38`}}>★ Interested</div>
          <div style={{flex:1, padding:'11px 0', borderRadius:10, background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', justifyContent:'center', gap:6, color:SC.text, fontSize:13, fontWeight:700, ...SCS}}>✓ Going</div>
          <div style={{width:46, borderRadius:10, background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:SC.text, letterSpacing:1}}>···</div>
        </div>
        {/* Going row */}
        <div style={{display:'flex', alignItems:'center', gap:10, padding:'11px 13px', borderRadius:12, background:SC.purpleM}}>
          <div style={{display:'flex'}}>
            {['#E76F51','#7C3AED','#10B981','#f59e0b'].map((c,i) => (
              <div key={i} style={{width:26, height:26, borderRadius:'50%', background:c, border:`2px solid ${SC.bg}`, marginLeft:i>0?-9:0}}/>
            ))}
          </div>
          <span style={{fontSize:11.5, color:SC.purple, fontWeight:700, ...SCS}}>{e.going} going · 38 interested</span>
        </div>
        {/* Genre */}
        <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {['Sports','Vintage','All grades'].map(g => (
            <div key={g} style={{padding:'4px 11px', borderRadius:999, background:SC.surface, border:`1px solid ${SC.border}`, color:SC.sec, fontSize:10, fontWeight:600, ...SCS}}>{g}</div>
          ))}
        </div>
        {/* About */}
        <div>
          <div style={{fontSize:12.5, fontWeight:700, color:SC.text, ...SCS, marginBottom:5}}>About this event</div>
          <div style={{fontSize:12, color:SC.sec, lineHeight:1.6}}>The biggest sports card show in Alberta returns. 120+ vendor tables, live group breaks, PSA on-site grading submission, and trade corners. Admission $10 at the door — kids under 12 free.</div>
        </div>
        {/* Host */}
        <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, background:SC.surface, border:`1px solid ${SC.border}`}}>
          <div style={{width:34, height:34, borderRadius:'50%', background:e.color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:13, fontWeight:700, ...SCS, flexShrink:0}}>E</div>
          <div style={{flex:1}}>
            <div style={{fontSize:12, fontWeight:700, color:SC.text, ...SCS}}>Hosted by Edmonton Card Collectors</div>
            <div style={{fontSize:10, color:SC.ter, marginTop:1}}>2,431 members · Group</div>
          </div>
          <div style={{padding:'5px 13px', borderRadius:999, background:SC.purpleM, border:`1px solid ${SC.purple}`, color:SC.purple, fontSize:11, fontWeight:700, ...SCS}}>View</div>
        </div>
        {/* Invite friends — mutual follows only */}
        <div>
          <div style={{fontSize:12.5, fontWeight:700, color:SC.text, ...SCS, marginBottom:8}}>Go with friends</div>
          <div style={{fontSize:10, color:SC.ter, marginBottom:8}}>You can invite people you follow each other with.</div>
          {[['Marcus Chen','#E76F51'],['Ava Rodriguez','#7C3AED'],['Diego Santos','#10B981']].map(([n,c],i) => (
            <div key={i} style={{display:'flex', alignItems:'center', gap:11, padding:'8px 0', borderBottom:`1px solid ${SC.border}`}}>
              {SC_Avatar(n[0], c, 36)}
              <span style={{flex:1, fontSize:13, fontWeight:600, color:SC.text, ...SCS}}>{n}</span>
              <div style={{padding:'6px 16px', borderRadius:999, background:SC.purpleM, color:SC.purple, fontSize:11.5, fontWeight:700, ...SCS}}>Invite</div>
            </div>
          ))}
          <div style={{marginTop:10, padding:'11px 0', borderRadius:12, background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontSize:12.5, fontWeight:700, color:SC.text, ...SCS}}>👤⁺ Invite friends</div>
        </div>
        {/* Suggested events */}
        <div>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
            <span style={{fontSize:12.5, fontWeight:700, color:SC.text, ...SCS}}>Suggested events</span>
            <span style={{fontSize:11.5, color:SC.purple, fontWeight:700, ...SCS}}>See all</span>
          </div>
          <div style={{display:'flex', gap:10, overflow:'hidden'}}>
            {[['JUN','27','YEG Nerd Sale 2026','#2563eb','Buy · Sell · Trade'],['JUL','12','Divine Pop-up Market','#E76F51','90+ curated vendors']].map((s,i) => (
              <div key={i} style={{width:152, flexShrink:0, borderRadius:12, background:SC.card, border:`1px solid ${SC.border}`, overflow:'hidden', boxShadow:SC.shadow}}>
                <div style={{height:78, background:`linear-gradient(150deg,#1a1210,${s[3]} 160%)`, position:'relative'}}>
                  <div style={{position:'absolute', top:8, left:8, width:34, borderRadius:7, overflow:'hidden', textAlign:'center', background:'rgba(255,255,255,0.95)'}}>
                    <div style={{background:s[3], color:'#fff', fontSize:7, fontWeight:800, padding:'1.5px 0', ...SCS}}>{s[0]}</div>
                    <div style={{fontSize:13, fontWeight:800, color:'#1a1210', ...SCS}}>{s[1]}</div>
                  </div>
                </div>
                <div style={{padding:'8px 10px 10px'}}>
                  <div style={{fontSize:11.5, fontWeight:700, color:SC.text, ...SCS, lineHeight:1.25, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{s[2]}</div>
                  <div style={{fontSize:9.5, color:SC.ter, marginTop:2}}>{s[4]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ··· event action sheet */}
      {overlay==='menu' && (() => {
        const acts = [
          ['👤','Invite people',null],
          ['↪','Share',null],
          ['📅','Add to calendar',null],
          ['🔖','Save',null],
          ['🔗','Copy event link',null],
          ['⚠','Find support or report event',null,true],
        ];
        return (
          <React.Fragment>
            <div style={{position:'absolute', inset:0, background:'rgba(14,13,12,0.4)', zIndex:30}}/>
            <div style={{position:'absolute', left:0, right:0, bottom:0, background:SC.bg, borderRadius:'22px 22px 0 0', zIndex:31, boxShadow:'0 -12px 40px rgba(26,18,16,0.2)', overflow:'hidden'}}>
              <div style={{display:'flex', justifyContent:'center', padding:'10px 0 6px'}}>
                <div style={{width:38, height:4.5, borderRadius:3, background:SC.ter}}/>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:11, padding:'8px 18px 13px', borderBottom:`1px solid ${SC.border}`}}>
                <div style={{width:40, borderRadius:9, overflow:'hidden', textAlign:'center', border:`1px solid ${SC.border}`, flexShrink:0}}>
                  <div style={{background:e.color, color:'#fff', fontSize:8, fontWeight:800, padding:'2px 0', ...SCS}}>{e.m}</div>
                  <div style={{fontSize:15, fontWeight:800, color:SC.text, padding:'1px 0', ...SCS}}>{e.d}</div>
                </div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:800, color:SC.text, ...SCS, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{e.title}</div>
                  <div style={{fontSize:10.5, color:SC.ter, marginTop:1}}>Public · {e.going} going</div>
                </div>
              </div>
              {acts.map(([ic,l,s,danger],i) => (
                <div key={i} style={{display:'flex', alignItems:'center', gap:13, padding:'12px 18px', borderBottom:`1px solid ${SC.border}`, background:danger?'rgba(231,111,81,0.05)':'transparent'}}>
                  <div style={{width:36, height:36, borderRadius:'50%', background:danger?'rgba(231,111,81,0.1)':SC.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0}}>{ic}</div>
                  <span style={{flex:1, fontSize:13.5, fontWeight:700, color:danger?SC.coral:SC.text, ...SCS}}>{l}</span>
                </div>
              ))}
              <div style={{height:14}}/>
            </div>
          </React.Fragment>
        );
      })()}
    </SC_Phone>
  );
};

// ── CREATE / MANAGE MENU sheet (replaces the + action) ───────────────────────
const SC_MenuRow = ({icon, title, sub, accent}) => (
  <div style={{display:'flex', alignItems:'center', gap:14, padding:'11px 4px'}}>
    <div style={{width:40, height:40, borderRadius:11, background:`${accent}1a`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0}}>{icon}</div>
    <div style={{flex:1, minWidth:0}}>
      <div style={{fontSize:14, fontWeight:700, color:SC.text, ...SCS}}>{title}</div>
      <div style={{fontSize:10.5, color:SC.ter, marginTop:1}}>{sub}</div>
    </div>
  </div>
);

const SC_CreateMenu = () => (
  <SC_Phone>
    <SC_SB/>
    <div style={{flex:1, opacity:0.3, overflow:'hidden'}}><SC_Header active="Groups"/></div>
    <SC_Dim/>
    <SC_Sheet height={440}>
      <div style={{padding:'10px 20px 24px', flex:1, display:'flex', flexDirection:'column', gap:14, overflow:'hidden'}}>
        {/* Manage — one group (create lives on the + icon now) */}
        <div style={{borderRadius:16, background:SC.card, border:`1px solid ${SC.border}`, padding:'4px 14px'}}>
          <SC_MenuRow icon="✉"  accent={SC.blue}   title="Invites"      sub="Send, accept and manage invites" />
          <div style={{height:1, background:SC.border}}/>
          <SC_MenuRow icon="🔔" accent={SC.amber}  title="Notifications" sub="Edit preferences for what you receive" />
          <div style={{height:1, background:SC.border}}/>
          <SC_MenuRow icon="📌" accent={SC.coral}  title="Pins"         sub="Pin favorite groups for quick access" />
          <div style={{height:1, background:SC.border}}/>
          <SC_MenuRow icon="☆"  accent={SC.purple} title="Following"    sub="Collectors and vendors you follow" />
          <div style={{height:1, background:SC.border}}/>
          <SC_MenuRow icon="🚪" accent={SC.sec}    title="Membership"   sub="Leave groups that no longer interest you" />
        </div>
      </div>
    </SC_Sheet>
  </SC_Phone>
);

// ══ GROUP SHARED BITS ════════════════════════════════════════════════════════
const SC_Avatar = (l, c, s=34) => (
  <div style={{width:s, height:s, borderRadius:'50%', background:c, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:s*0.42, fontWeight:700, ...SCS, flexShrink:0}}>{l}</div>
);
const SC_PageHead = ({title, action}) => (
  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'2px 16px 12px', borderBottom:`1px solid ${SC.border}`, flexShrink:0}}>
    <span style={{fontSize:22, color:SC.text, width:60}}>‹</span>
    <span style={{fontSize:15, fontWeight:800, color:SC.text, ...SCS}}>{title}</span>
    <span style={{fontSize:13, fontWeight:700, color:action?SC.purple:'transparent', width:60, textAlign:'right', ...SCS}}>{action||'·'}</span>
  </div>
);
const SC_Toggle = ({on}) => (
  <div style={{width:42, height:25, borderRadius:999, background:on?SC.purple:SC.border, position:'relative', flexShrink:0, transition:'background .15s ease'}}>
    <div style={{position:'absolute', top:2.5, left:on?19:2.5, width:20, height:20, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.2)', transition:'left .15s ease'}}/>
  </div>
);
// A post inside a group
const SC_GroupPost = ({l, c, name, time, text, cardColor, pinned, likes, comments}) => (
  <div style={{padding:'13px 16px', borderBottom:`1px solid ${SC.border}`}}>
    {pinned && <div style={{display:'flex', alignItems:'center', gap:5, marginBottom:8, color:SC.amber}}><span style={{fontSize:11}}>📌</span><span style={{fontSize:10, fontWeight:700, ...SCS}}>Pinned by admin</span></div>}
    <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:9}}>
      {SC_Avatar(l, c, 38)}
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:13, fontWeight:700, color:SC.text, ...SCS}}>{name}</div>
        <div style={{fontSize:10, color:SC.ter, marginTop:1}}>{time}</div>
      </div>
      <span style={{fontSize:16, color:SC.ter, letterSpacing:1}}>···</span>
    </div>
    <div style={{fontSize:13, color:SC.text, lineHeight:1.55, marginBottom:cardColor?10:0}}>{text}</div>
    {cardColor && (
      <div style={{display:'flex', gap:11, padding:'10px 12px', borderRadius:12, background:SC.card, border:`1px solid ${SC.border}`, boxShadow:SC.shadow}}>
        <div style={{width:48, height:67, borderRadius:6, background:`linear-gradient(145deg, ${SC.surface}, ${cardColor})`, position:'relative', overflow:'hidden', flexShrink:0}}>
          <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 55%)'}}/>
        </div>
        <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center'}}>
          <div style={{fontSize:12, fontWeight:700, color:SC.text, ...SCS}}>Luka Dončić — '18-19 RC</div>
          <div style={{fontSize:9.5, color:SC.ter, marginTop:1}}>Panini Prizm · PSA 10</div>
          <div style={{fontSize:13, fontWeight:800, color:SC.coral, ...SCS, marginTop:4}}>$4,100</div>
        </div>
      </div>
    )}
    <div style={{display:'flex', alignItems:'center', gap:20, marginTop:11, color:SC.ter}}>
      <span style={{fontSize:11.5, fontWeight:600}}>♡ {likes}</span>
      <span style={{fontSize:11.5, fontWeight:600}}>💬 {comments}</span>
      <span style={{fontSize:11.5, fontWeight:600}}>↗ Share</span>
    </div>
  </div>
);
const SC_GroupTabs = ({active='Discussion', onTab}) => (
  <div style={{display:'flex', gap:22, padding:'0 16px', borderBottom:`1px solid ${SC.border}`, flexShrink:0}}>
    {['Discussion','Members','Media','Events'].map(t => {
      const on = t === active;
      return <div key={t} onClick={onTab?()=>onTab(t):undefined} style={{paddingBottom:9, marginBottom:-1, borderBottom:on?`2.5px solid ${SC.purple}`:'2.5px solid transparent', color:on?SC.text:SC.ter, fontSize:12.5, fontWeight:on?800:600, ...SCS, paddingTop:11, cursor:onTab?'pointer':'default'}}>{t}</div>;
    })}
  </div>
);

// ── Group tab bodies (Members / Media / Events) ──────────────────────────────
const GROUP_MEMBERS = [
  {n:'Vault Admin',   h:'vaultadmin',  c:'#7C3AED', role:'Admin',     friend:false},
  {n:'Marcus Chen',   h:'mchen_cards', c:'#2563eb', role:'Moderator', friend:true},
  {n:'Ava Rodriguez', h:'avapulls',    c:'#E76F51', role:null,        friend:true},
  {n:'Diego Santos',  h:'dsantos_rc',  c:'#10B981', role:null,        friend:true},
  {n:'Kayla Brooks',  h:'kaylapulls',  c:'#f59e0b', role:null,        friend:false},
  {n:'Tom Becker',    h:'beckcards',   c:'#7C3AED', role:null,        friend:false},
];
const SC_GroupMembers = () => (
  <div style={{flex:1, overflow:'hidden'}}>
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px 8px'}}>
      <span style={{fontSize:12, fontWeight:800, color:SC.text, ...SCS}}>5,389 members</span>
      <div style={{display:'flex', alignItems:'center', gap:6, padding:'6px 11px', borderRadius:999, background:SC.purpleM||SC.purpleM, border:`1px solid ${SC.purple}`, color:SC.purple, fontSize:11, fontWeight:700, ...SCS}}>+ Invite</div>
    </div>
    <div style={{height:34, margin:'0 16px 6px', borderRadius:999, background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', padding:'0 13px', gap:8}}>
      <span style={{fontSize:13, color:SC.ter}}>⌕</span><span style={{fontSize:12, color:SC.ter}}>Search members…</span>
    </div>
    {GROUP_MEMBERS.map((m,i) => (
      <div key={i} style={{display:'flex', alignItems:'center', gap:12, padding:'9px 16px'}}>
        {SC_Avatar(m.n[0], m.c, 40)}
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:'flex', alignItems:'center', gap:6}}>
            <span style={{fontSize:13, fontWeight:700, color:SC.text, ...SCS}}>{m.n}</span>
            {m.role && <span style={{padding:'1.5px 7px', borderRadius:999, background:SC.purpleM, color:SC.purple, fontSize:8.5, fontWeight:800, ...SCS}}>{m.role}</span>}
          </div>
          <div style={{fontSize:10.5, color:SC.ter, marginTop:1}}>@{m.h}{m.friend && ' · Following'}</div>
        </div>
        <div style={{padding:'6px 13px', borderRadius:999, background:m.friend?SC.surface:SC.purple, border:m.friend?`1px solid ${SC.border}`:'none', color:m.friend?SC.sec:'#fff', fontSize:11, fontWeight:700, ...SCS}}>{m.friend?'Message':'Follow'}</div>
      </div>
    ))}
  </div>
);
const SC_GroupMedia = () => (
  <div style={{flex:1, overflow:'hidden'}}>
    <div style={{padding:'12px 16px 8px', fontSize:12, fontWeight:800, color:SC.text, ...SCS}}>Shared media · 248</div>
    <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:3, padding:'0 4px'}}>
      {['#E76F51','#7C3AED','#10B981','#f59e0b','#2563eb','#E76F51','#7C3AED','#10B981','#f59e0b','#2563eb','#E76F51','#7C3AED'].map((a,i) => (
        <div key={i} style={{aspectRatio:'0.74', borderRadius:8, background:`linear-gradient(145deg,${SC.surface},${a})`, position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.22) 0%,transparent 55%)'}}/>
        </div>
      ))}
    </div>
  </div>
);
const SC_GroupEventsTab = () => (
  <div style={{flex:1, overflow:'hidden', padding:'12px 16px'}}>
    <div style={{fontSize:12, fontWeight:800, color:SC.text, ...SCS, marginBottom:10}}>Upcoming · 2</div>
    {[['JUN','14','Vault Meetup · Trade Night','Sherwood Park Mall',24,'#7C3AED'],['JUN','27','Group Break — PSA 10s only','The Card Vault · Online',38,'#E76F51']].map((e,i) => (
      <div key={i} style={{display:'flex', gap:12, alignItems:'center', padding:'11px 0', borderBottom:`1px solid ${SC.border}`}}>
        <div style={{width:46, borderRadius:11, overflow:'hidden', border:`1px solid ${SC.border}`, textAlign:'center', flexShrink:0}}>
          <div style={{background:e[5], color:'#fff', fontSize:8.5, fontWeight:800, padding:'3px 0', ...SCS}}>{e[0]}</div>
          <div style={{fontSize:18, fontWeight:800, color:SC.text, padding:'2px 0', ...SCS}}>{e[1]}</div>
        </div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:13, fontWeight:700, color:SC.text, ...SCS, lineHeight:1.2}}>{e[2]}</div>
          <div style={{fontSize:10.5, color:SC.ter, marginTop:3}}>📍 {e[3]}</div>
          <div style={{fontSize:9.5, color:SC.sec, marginTop:3}}>👥 {e[4]} going</div>
        </div>
        <div style={{padding:'6px 13px', borderRadius:999, background:SC.purpleM, border:`1px solid ${SC.purple}`, color:SC.purple, fontSize:11, fontWeight:700, ...SCS}}>RSVP</div>
      </div>
    ))}
  </div>
);

// ══ GROUP DETAIL — member view (a group you're part of) ════════════════════════
const SC_GroupDetail = ({tab='Discussion', overlay=null}) => {
  const g = YOUR_GROUPS[2]; // Vintage Hoops Vault
  return (
    <SC_Phone h={900}>
      {/* Cover */}
      <div style={{height:130, position:'relative', background:`linear-gradient(150deg, #1a1210 0%, ${g.color} 150%)`, flexShrink:0}}>
        <div style={{height:44}}/>
        <div style={{position:'absolute', top:50, left:16, right:16, display:'flex', justifyContent:'space-between'}}>
          <div style={{width:34, height:34, borderRadius:'50%', background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, color:'#fff'}}>←</div>
          <div style={{display:'flex', gap:8}}>
            <div style={{width:34, height:34, borderRadius:'50%', background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:'#fff'}}>⌕</div>
            <div style={{width:34, height:34, borderRadius:'50%', background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#fff', letterSpacing:1}}>···</div>
          </div>
        </div>
      </div>
      {/* Identity */}
      <div style={{padding:'12px 16px 10px', flexShrink:0}}>
        <div style={{display:'flex', alignItems:'flex-start', gap:12, marginTop:-34}}>
          <div style={{width:62, height:62, borderRadius:16, background:`linear-gradient(145deg, ${g.color}, ${g.color}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, border:`3px solid ${SC.bg}`, flexShrink:0}}>{g.avatar}</div>
          <div style={{flex:1, paddingTop:34}}>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <div style={{padding:'5px 14px', borderRadius:999, background:SC.purpleM, border:`1px solid ${SC.purple}`, color:SC.purple, fontSize:11.5, fontWeight:700, ...SCS}}>✓ Joined</div>
              <div style={{width:34, height:34, borderRadius:'50%', background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14}}>🔔</div>
              <div style={{width:34, height:34, borderRadius:'50%', background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:SC.purple}}>+</div>
            </div>
          </div>
        </div>
        <div style={{fontSize:20, fontWeight:800, color:SC.text, ...SCS, marginTop:9}}>{g.name}</div>
        <div style={{fontSize:11, color:SC.sec, marginTop:3}}>🔒 Private group · {g.members} members</div>
        <div style={{display:'flex', alignItems:'center', gap:6, marginTop:8}}>
          <div style={{display:'flex'}}>
            {['#E76F51','#7C3AED','#10B981','#f59e0b'].map((c,i) => <div key={i} style={{width:22, height:22, borderRadius:'50%', background:c, border:`2px solid ${SC.bg}`, marginLeft:i>0?-8:0}}/>)}
          </div>
          <span style={{fontSize:10.5, color:SC.ter}}>Marcus, Ava + 5 friends are members</span>
        </div>
      </div>
      <SC_GroupTabs active={tab}/>
      {/* Body by tab */}
      {tab==='Members' ? <SC_GroupMembers/>
       : tab==='Media' ? <SC_GroupMedia/>
       : tab==='Events' ? <SC_GroupEventsTab/>
       : (
      <div style={{flex:1, overflow:'hidden'}}>
        <div style={{display:'flex', gap:10, alignItems:'center', padding:'12px 16px', borderBottom:`1px solid ${SC.border}`}}>
          {SC_Avatar('J', SC.coral, 36)}
          <div style={{flex:1, fontSize:12.5, color:SC.ter}}>Share something with the group…</div>
          <span style={{fontSize:16}}>🖼</span>
        </div>
        <SC_GroupPost pinned l="V" c={g.color} name="Vault Admin" time="Pinned · 2d" text="Welcome to the Vault! 🏀 Read the pinned rules before posting. No raw-card price shilling — graded comps only." likes="86" comments="14"/>
        <SC_GroupPost l="M" c={SC.blue} name="Marcus Chen" time="3h" text="Grail acquired. Took me two years to land a 10 of this one." cardColor={SC.coral} likes="142" comments="38"/>
      </div>
       )}
      <SC_TB/>

      {/* ··· group action sheet */}
      {overlay==='menu' && (() => {
        const acts = [
          ['📝','Manage your content',null],
          ['📥','Unfollow group',null],
          ['📌','Unpin group',null],
          ['👤','Invite',null],
          ['↪','Share',null],
          ['🔔','Manage notifications',null],
          ['⚠','Report group',null,true],
          ['🚪','Leave group',null,true],
        ];
        return (
          <React.Fragment>
            <div style={{position:'absolute', inset:0, background:'rgba(14,13,12,0.4)', zIndex:30}}/>
            <div style={{position:'absolute', left:0, right:0, bottom:0, background:SC.bg, borderRadius:'22px 22px 0 0', zIndex:31, boxShadow:'0 -12px 40px rgba(26,18,16,0.2)', overflow:'hidden'}}>
              <div style={{display:'flex', justifyContent:'center', padding:'10px 0 6px'}}>
                <div style={{width:38, height:4.5, borderRadius:3, background:SC.ter}}/>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:11, padding:'8px 18px 13px', borderBottom:`1px solid ${SC.border}`}}>
                <div style={{width:40, height:40, borderRadius:12, background:`linear-gradient(145deg, ${g.color}, ${g.color}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, flexShrink:0}}>{g.avatar}</div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:13.5, fontWeight:800, color:SC.text, ...SCS}}>{g.name}</div>
                  <div style={{fontSize:10.5, color:SC.ter, marginTop:1}}>🔒 Private · {g.members} members</div>
                </div>
              </div>
              {acts.map(([ic,l,s,danger],i) => (
                <div key={i} style={{display:'flex', alignItems:'center', gap:13, padding:'12px 18px', borderBottom:`1px solid ${SC.border}`, background:danger?'rgba(231,111,81,0.05)':'transparent'}}>
                  <div style={{width:36, height:36, borderRadius:'50%', background:danger?'rgba(231,111,81,0.1)':SC.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0}}>{ic}</div>
                  <span style={{flex:1, fontSize:13.5, fontWeight:700, color:danger?SC.coral:SC.text, ...SCS}}>{l}</span>
                </div>
              ))}
              <div style={{height:14}}/>
            </div>
          </React.Fragment>
        );
      })()}
    </SC_Phone>
  );
};

// ══ GROUP SEARCH — search within a group (tap ⌕ in group header) ════════════════
const SC_KB_ROWS = ['qwertyuiop','asdfghjkl','zxcvbnm'];
const SC_Keyboard = () => (
  <div style={{background:'#d3d2d6', padding:'7px 4px 6px', flexShrink:0, ...SCD}}>
    {SC_KB_ROWS.map((row,ri) => (
      <div key={ri} style={{display:'flex', justifyContent:'center', gap:5, marginBottom:6, paddingLeft:ri===1?18:0, paddingRight:ri===1?18:0}}>
        {ri===2 && <div style={{flex:'0 0 36px', height:38, borderRadius:5, background:'#adb3bd', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15}}>⇧</div>}
        {row.split('').map(ch => (
          <div key={ch} style={{flex:1, maxWidth:33, height:38, borderRadius:5, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#1a1210', boxShadow:'0 1px 0 rgba(0,0,0,0.28)'}}>{ch}</div>
        ))}
        {ri===2 && <div style={{flex:'0 0 36px', height:38, borderRadius:5, background:'#adb3bd', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15}}>⌫</div>}
      </div>
    ))}
    <div style={{display:'flex', gap:5, padding:'0 0 2px'}}>
      <div style={{flex:'0 0 80px', height:38, borderRadius:5, background:'#adb3bd', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600, color:'#1a1210'}}>123</div>
      <div style={{flex:1, height:38, borderRadius:5, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:'#1a1210'}}>space</div>
      <div style={{flex:'0 0 80px', height:38, borderRadius:5, background:SC.purple, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff'}}>search</div>
    </div>
  </div>
);
const SC_GroupSearch = ({query=''}) => (
  <SC_Phone>
    <SC_SB/>
    <div style={{display:'flex', alignItems:'center', gap:11, padding:'2px 16px 12px', flexShrink:0}}>
      <div style={{fontSize:21, color:SC.text}}>‹</div>
      <div style={{flex:1, height:38, borderRadius:999, background:SC.surface, border:`1px solid ${SC.border}`, display:'flex', alignItems:'center', padding:'0 14px', gap:8}}>
        <span style={{fontSize:13, color:SC.ter}}>⌕</span>
        {query
          ? <span style={{fontSize:13, color:SC.text}}>{query}<span style={{borderLeft:`1.5px solid ${SC.purple}`, marginLeft:1}}/></span>
          : <span style={{fontSize:13, color:SC.ter}}>Search in Vintage Hoops Vault</span>}
      </div>
    </div>
    <div style={{flex:1, overflow:'hidden'}}>
      {query ? (
        <React.Fragment>
          <div style={{fontSize:10.5, fontWeight:800, letterSpacing:'0.5px', color:SC.ter, textTransform:'uppercase', ...SCS, padding:'10px 16px 6px'}}>Results in this group</div>
          {[['M','Marcus Chen','posted','“Grail acquired — PSA 10 of this one”',SC.blue],['A','Ava Rodriguez','posted','“Bulk submission results: 3 tens!”',SC.coral],['V','Vault Admin','pinned','“Welcome to the Vault — read the rules”',SC.purple]].map((r,i) => (
            <div key={i} style={{display:'flex', gap:11, alignItems:'center', padding:'10px 16px', borderBottom:`1px solid ${SC.border}`}}>
              {SC_Avatar(r[0], r[4], 38)}
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:12.5, color:SC.text}}><span style={{fontWeight:700, ...SCS}}>{r[1]}</span> <span style={{color:SC.ter}}>{r[2]}</span></div>
                <div style={{fontSize:11, color:SC.sec, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{r[3]}</div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ) : (
        <div style={{padding:'14px 16px', fontSize:13, color:SC.ter}}>No recent searches</div>
      )}
    </div>
    <SC_Keyboard/>
  </SC_Phone>
);

// ══ PUBLIC GROUP — preview (Join) ⇄ just-joined state ══════════════════════════
const SC_GroupPublic = ({joined=false}) => {
  const g = YOUR_GROUPS[1]; // PSA 10 Hunters
  return (
    <SC_Phone h={joined?900:860}>
      <div style={{height:130, position:'relative', background:`linear-gradient(150deg, #1a1210 0%, ${g.color} 150%)`, flexShrink:0}}>
        <div style={{height:44}}/>
        <div style={{position:'absolute', top:50, left:16}}>
          <div style={{width:34, height:34, borderRadius:'50%', background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, color:'#fff'}}>←</div>
        </div>
      </div>
      <div style={{padding:'12px 16px 10px', flexShrink:0}}>
        <div style={{width:62, height:62, borderRadius:16, background:`linear-gradient(145deg, ${g.color}, ${g.color}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, border:`3px solid ${SC.bg}`, marginTop:-46}}>{g.avatar}</div>
        <div style={{fontSize:20, fontWeight:800, color:SC.text, ...SCS, marginTop:9}}>{g.name}</div>
        <div style={{fontSize:11, color:SC.sec, marginTop:3}}>🌐 Public group · {g.members} members · 5 posts/day</div>
      </div>
      {joined ? (
        <>
          {/* Just-joined welcome */}
          <div style={{margin:'0 16px 12px', padding:'13px 14px', borderRadius:14, background:SC.purpleM, border:`1px solid ${SC.purple}`, display:'flex', alignItems:'center', gap:11, flexShrink:0}}>
            <span style={{fontSize:22}}>🎉</span>
            <div style={{flex:1}}>
              <div style={{fontSize:13, fontWeight:800, color:SC.purple, ...SCS}}>You're in!</div>
              <div style={{fontSize:10.5, color:SC.sec, marginTop:1}}>Say hi to the group or set your notifications.</div>
            </div>
            <div style={{width:34, height:34, borderRadius:'50%', background:SC.card, border:`1px solid ${SC.purple}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14}}>🔔</div>
          </div>
          <SC_GroupTabs active="Discussion"/>
          <div style={{flex:1, overflow:'hidden'}}>
            <div style={{display:'flex', gap:10, alignItems:'center', padding:'12px 16px', borderBottom:`1px solid ${SC.border}`}}>
              {SC_Avatar('J', SC.coral, 36)}
              <div style={{flex:1, fontSize:12.5, color:SC.ter}}>Introduce yourself to the group…</div>
              <span style={{fontSize:16}}>🖼</span>
            </div>
            <SC_GroupPost l="A" c={SC.purple} name="Ava Rodriguez" time="1h" text="PSA bulk submission results are in — 3 tens! Who else is waiting on returns?" likes="64" comments="21"/>
          </div>
          <SC_TB/>
        </>
      ) : (
        <>
          {/* About + locked preview */}
          <div style={{flex:1, overflow:'hidden', padding:'0 16px'}}>
            <div style={{padding:'12px 14px', borderRadius:14, background:SC.surface, border:`1px solid ${SC.border}`, marginBottom:12}}>
              <div style={{fontSize:12, fontWeight:700, color:SC.text, ...SCS, marginBottom:5}}>About</div>
              <div style={{fontSize:12, color:SC.sec, lineHeight:1.55}}>The internet's home for PSA 10 chasers. Share your gem-mint pulls, submission results, and pop-report finds. Graded comps only.</div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:10, padding:'11px 13px', borderRadius:12, background:SC.surface, border:`1px solid ${SC.border}`, marginBottom:14}}>
              <div style={{display:'flex'}}>
                {['#E76F51','#7C3AED','#10B981'].map((c,i) => <div key={i} style={{width:24, height:24, borderRadius:'50%', background:c, border:`2px solid ${SC.bg}`, marginLeft:i>0?-8:0}}/>)}
              </div>
              <span style={{fontSize:11, color:SC.sec, fontWeight:600, ...SCS}}>4 friends are members</span>
            </div>
            {/* Locked preview */}
            <div style={{position:'relative'}}>
              <div style={{filter:'blur(3px)', opacity:0.5, pointerEvents:'none'}}>
                <SC_GroupPost l="A" c={SC.purple} name="Ava Rodriguez" time="1h" text="PSA bulk submission results are in — 3 tens!" likes="64" comments="21"/>
              </div>
              <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4}}>
                <span style={{fontSize:18}}>🔒</span>
                <span style={{fontSize:12, fontWeight:700, color:SC.sec, ...SCS}}>Join to see posts & discussions</span>
              </div>
            </div>
          </div>
          {/* Sticky Join */}
          <div style={{padding:'10px 16px 22px', borderTop:`1px solid ${SC.border}`, flexShrink:0}}>
            <div style={{padding:'14px', borderRadius:999, background:SC.purple, textAlign:'center', fontSize:15, fontWeight:700, color:'#fff', ...SCS, boxShadow:'0 4px 14px rgba(124,58,237,0.3)'}}>Join Group</div>
          </div>
        </>
      )}
    </SC_Phone>
  );
};

// ══ MENU DESTINATION: Create a Post ════════════════════════════════════════════
const SC_CreatePost = () => (
  <SC_Phone>
    <SC_SB/>
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'2px 16px 12px', borderBottom:`1px solid ${SC.border}`, flexShrink:0}}>
      <span style={{fontSize:13, fontWeight:600, color:SC.sec, ...SCS}}>Cancel</span>
      <span style={{fontSize:15, fontWeight:800, color:SC.text, ...SCS}}>Create Post</span>
      <div style={{padding:'7px 16px', borderRadius:999, background:SC.purple, color:'#fff', fontSize:12.5, fontWeight:700, ...SCS}}>Post</div>
    </div>
    <div style={{flex:1, overflow:'hidden', padding:'14px 16px'}}>
      {/* Post-to selector */}
      <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:14}}>
        {SC_Avatar('J', SC.coral, 40)}
        <div style={{flex:1}}>
          <div style={{fontSize:13, fontWeight:700, color:SC.text, ...SCS}}>Jake Morrison</div>
          <div style={{display:'inline-flex', alignItems:'center', gap:5, marginTop:3, padding:'3px 10px', borderRadius:999, background:SC.purpleM, border:`1px solid ${SC.purple}`}}>
            <span style={{fontSize:10}}>👥</span>
            <span style={{fontSize:10.5, fontWeight:700, color:SC.purple, ...SCS}}>Edmonton Card Collectors</span>
            <span style={{fontSize:9, color:SC.purple}}>▾</span>
          </div>
        </div>
      </div>
      <div style={{fontSize:15, color:SC.text, lineHeight:1.5}}>Mail day! Finally landed this Curry rookie for the PC<span style={{display:'inline-block', width:1.5, height:17, background:SC.purple, verticalAlign:'middle', marginLeft:2}}/></div>
      <div style={{display:'flex', gap:8, marginTop:16}}>
        <div style={{width:80, height:108, borderRadius:10, background:`linear-gradient(145deg, ${SC.surface}, ${SC.coral})`, position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 55%)'}}/>
        </div>
        <div style={{width:80, height:108, borderRadius:10, border:`1.5px dashed ${SC.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, color:SC.ter}}>+</div>
      </div>
    </div>
    <div style={{display:'flex', alignItems:'center', gap:18, padding:'12px 18px 22px', borderTop:`1px solid ${SC.border}`, flexShrink:0}}>
      {['🖼','🃏','◍','📊','📍'].map((i,idx) => <span key={idx} style={{fontSize:19, color:SC.purple}}>{i}</span>)}
      <span style={{marginLeft:'auto', fontSize:11, color:SC.ter}}>Showcasing 1 card</span>
    </div>
    <SC_TB/>
  </SC_Phone>
);

// ══ MENU DESTINATION: Invites ══════════════════════════════════════════════════
const SC_Invites = () => (
  <SC_Phone>
    <SC_SB/>
    <SC_PageHead title="Invites"/>
    {/* tabs */}
    <div style={{display:'flex', gap:22, padding:'12px 20px 0', flexShrink:0}}>
      {['Received','Sent'].map((t,i) => (
        <div key={t} style={{paddingBottom:9, borderBottom:i===0?`2.5px solid ${SC.purple}`:'2.5px solid transparent', color:i===0?SC.text:SC.ter, fontSize:13, fontWeight:i===0?800:600, ...SCS}}>{t} {i===0 && <span style={{color:SC.purple}}>2</span>}</div>
      ))}
    </div>
    <div style={{height:1, background:SC.border, flexShrink:0}}/>
    <div style={{flex:1, overflow:'hidden', padding:'12px 16px'}}>
      {[
        {l:'M', c:SC.blue, who:'Marcus Chen', g:'Vintage Hoops Vault', av:'🏀', ac:'#f59e0b', m:'891 members'},
        {l:'A', c:SC.purple, who:'Ava Rodriguez', g:'Rookie Card Investors', av:'📈', ac:SC.purple, m:'22.6k members'},
      ].map(inv => (
        <div key={inv.g} style={{padding:'12px 0', borderBottom:`1px solid ${SC.border}`}}>
          <div style={{display:'flex', alignItems:'center', gap:11, marginBottom:10}}>
            <div style={{width:46, height:46, borderRadius:13, background:`linear-gradient(145deg, ${inv.ac}, ${inv.ac}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:21, flexShrink:0}}>{inv.av}</div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:13.5, fontWeight:700, color:SC.text, ...SCS}}>{inv.g}</div>
              <div style={{fontSize:10.5, color:SC.ter, marginTop:1}}><span style={{fontWeight:700, color:SC.sec}}>{inv.who}</span> invited you · {inv.m}</div>
            </div>
          </div>
          <div style={{display:'flex', gap:9}}>
            <div style={{flex:1, padding:'9px', borderRadius:999, background:SC.purple, textAlign:'center', fontSize:12.5, fontWeight:700, color:'#fff', ...SCS}}>Accept</div>
            <div style={{flex:1, padding:'9px', borderRadius:999, background:SC.surface, border:`1px solid ${SC.border}`, textAlign:'center', fontSize:12.5, fontWeight:700, color:SC.sec, ...SCS}}>Decline</div>
          </div>
        </div>
      ))}
    </div>
    <SC_TB/>
  </SC_Phone>
);

// ══ MENU DESTINATION: Notifications ════════════════════════════════════════════
const SC_NotifPrefs = () => (
  <SC_Phone>
    <SC_SB/>
    <SC_PageHead title="Notifications"/>
    <div style={{flex:1, overflow:'hidden', padding:'14px 16px'}}>
      <div style={{display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:12, background:SC.surface, border:`1px solid ${SC.border}`, marginBottom:18}}>
        <div style={{flex:1}}>
          <div style={{fontSize:13, fontWeight:700, color:SC.text, ...SCS}}>Push notifications</div>
          <div style={{fontSize:10.5, color:SC.ter, marginTop:1}}>Master switch for all group activity</div>
        </div>
        <SC_Toggle on={true}/>
      </div>
      <div style={{fontSize:10, fontWeight:700, color:SC.ter, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10}}>Per Group</div>
      {[['🃏','#7C3AED','Edmonton Card Collectors','All posts'],['💎','#E76F51','PSA 10 Hunters','Highlights'],['🏀','#f59e0b','Vintage Hoops Vault','Off']].map(([av,ac,name,mode]) => (
        <div key={name} style={{display:'flex', alignItems:'center', gap:11, padding:'11px 0', borderBottom:`1px solid ${SC.border}`}}>
          <div style={{width:40, height:40, borderRadius:11, background:`linear-gradient(145deg, ${ac}, ${ac}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0}}>{av}</div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:12.5, fontWeight:700, color:SC.text, ...SCS, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{name}</div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:4, padding:'5px 11px', borderRadius:999, background:mode==='Off'?SC.surface:SC.purpleM, border:`1px solid ${mode==='Off'?SC.border:SC.purple}`}}>
            <span style={{fontSize:11, fontWeight:700, color:mode==='Off'?SC.ter:SC.purple, ...SCS}}>{mode}</span>
            <span style={{fontSize:8, color:mode==='Off'?SC.ter:SC.purple}}>▾</span>
          </div>
        </div>
      ))}
      <div style={{display:'flex', alignItems:'center', gap:12, padding:'14px 0 0'}}>
        <div style={{flex:1}}>
          <div style={{fontSize:12.5, fontWeight:700, color:SC.text, ...SCS}}>Event reminders</div>
          <div style={{fontSize:10.5, color:SC.ter, marginTop:1}}>24h before events you're going to</div>
        </div>
        <SC_Toggle on={true}/>
      </div>
    </div>
    <SC_TB/>
  </SC_Phone>
);

// ══ MENU DESTINATION: Pins ═════════════════════════════════════════════════════
const SC_Pins = () => (
  <SC_Phone>
    <SC_SB/>
    <SC_PageHead title="Pinned Groups" action="Done"/>
    <div style={{flex:1, overflow:'hidden', padding:'14px 16px'}}>
      <div style={{fontSize:11.5, color:SC.sec, lineHeight:1.5, marginBottom:16}}>Pinned groups show at the top of your Groups tab for quick access. Drag to reorder.</div>
      <div style={{fontSize:10, fontWeight:700, color:SC.ter, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8}}>Pinned</div>
      {[['🃏','#7C3AED','Edmonton Card Collectors','2,431 members'],['💎','#E76F51','PSA 10 Hunters','8,120 members']].map(([av,ac,name,m]) => (
        <div key={name} style={{display:'flex', alignItems:'center', gap:11, padding:'10px 0', borderBottom:`1px solid ${SC.border}`}}>
          <span style={{fontSize:15, color:SC.ter}}>≡</span>
          <div style={{width:40, height:40, borderRadius:11, background:`linear-gradient(145deg, ${ac}, ${ac}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0}}>{av}</div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:12.5, fontWeight:700, color:SC.text, ...SCS, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{name}</div>
            <div style={{fontSize:10, color:SC.ter, marginTop:1}}>{m}</div>
          </div>
          <span style={{fontSize:18, color:SC.amber}}>★</span>
        </div>
      ))}
      <div style={{fontSize:10, fontWeight:700, color:SC.ter, textTransform:'uppercase', letterSpacing:'0.5px', margin:'16px 0 8px'}}>Your Other Groups</div>
      {[['🏀','#f59e0b','Vintage Hoops Vault','5,389 members']].map(([av,ac,name,m]) => (
        <div key={name} style={{display:'flex', alignItems:'center', gap:11, padding:'10px 0'}}>
          <div style={{width:40, height:40, borderRadius:11, background:`linear-gradient(145deg, ${ac}, ${ac}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0, marginLeft:25}}>{av}</div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:12.5, fontWeight:700, color:SC.text, ...SCS}}>{name}</div>
            <div style={{fontSize:10, color:SC.ter, marginTop:1}}>{m}</div>
          </div>
          <span style={{fontSize:18, color:SC.ter}}>☆</span>
        </div>
      ))}
    </div>
    <SC_TB/>
  </SC_Phone>
);

// ══ MENU DESTINATION: Membership ═══════════════════════════════════════════════
const SC_Membership = () => (
  <SC_Phone>
    <SC_SB/>
    <SC_PageHead title="Membership"/>
    <div style={{flex:1, overflow:'hidden', padding:'14px 16px'}}>
      <div style={{fontSize:10, fontWeight:700, color:SC.ter, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8}}>Your Groups · 3</div>
      {[['🃏','#7C3AED','Edmonton Card Collectors','Admin','2,431 members'],['💎','#E76F51','PSA 10 Hunters','Member','8,120 members'],['🏀','#f59e0b','Vintage Hoops Vault','Member','5,389 members']].map(([av,ac,name,role,m]) => (
        <div key={name} style={{display:'flex', alignItems:'center', gap:11, padding:'12px 0', borderBottom:`1px solid ${SC.border}`}}>
          <div style={{width:44, height:44, borderRadius:12, background:`linear-gradient(145deg, ${ac}, ${ac}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0}}>{av}</div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{display:'flex', alignItems:'center', gap:6}}>
              <span style={{fontSize:12.5, fontWeight:700, color:SC.text, ...SCS, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{name}</span>
              {role==='Admin' && <span style={{padding:'1.5px 7px', borderRadius:999, background:SC.purpleM, color:SC.purple, fontSize:8.5, fontWeight:800, ...SCS}}>ADMIN</span>}
            </div>
            <div style={{fontSize:10, color:SC.ter, marginTop:2}}>{m}</div>
          </div>
          <div style={{padding:'6px 14px', borderRadius:999, background:SC.surface, border:`1px solid ${SC.border}`, fontSize:11, fontWeight:700, color:role==='Admin'?SC.ter:SC.coral, ...SCS, flexShrink:0}}>{role==='Admin'?'Manage':'Leave'}</div>
        </div>
      ))}
    </div>
    <SC_TB/>
  </SC_Phone>
);

// ── Export ────────────────────────────────────────────────────────────────────
Object.assign(window, {
  SC_Social, SC_Groups, SC_GroupSubToggle, SC_Events, SC_EventDetail,
  SC_CreateGroup, SC_CreateEvent, SC_CreateMenu, SC_InvitePicker,
  SC_GroupDetail, SC_GroupPublic, SC_GroupSearch,
  SC_CreatePost, SC_Invites, SC_NotifPrefs, SC_Pins, SC_Membership,
});

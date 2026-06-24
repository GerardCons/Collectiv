// screens-account.jsx — Collectiv · Settings · Notifications · Messages (Dir 2)
// AX_ prefix. Matches built Dir-2 language (Sora headings, DM Sans body, Coral Core).

const AX = {
  bg:'#fef9f5', surface:'#fef0e8', card:'#ffffff',
  text:'#1a1210', sec:'#6b5c52', ter:'#aa9a90', border:'#f0ddd0',
  coral:'#E76F51', coralM:'rgba(231,111,81,0.10)',
  purple:'#7C3AED', purpleM:'rgba(124,58,237,0.10)',
  green:'#10B981', greenM:'rgba(16,185,129,0.12)',
  amber:'#f59e0b', blue:'#2563eb', red:'#dc2626',
  shadow:'0 2px 8px rgba(26,18,16,0.07),0 1px 2px rgba(26,18,16,0.04)',
  tabI:'rgba(26,18,16,0.28)',
};
const AXS = {fontFamily:"'Sora',sans-serif"};
const AXD = {fontFamily:"'DM Sans',sans-serif"};

// ── Shell ─────────────────────────────────────────────────────────────────────
const AX_Phone = ({children, h=780}) => (
  <div style={{width:390, height:h, background:AX.bg, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative', ...AXD}}>{children}</div>
);
const AX_SB = () => (
  <div style={{height:44, display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'0 20px 8px', flexShrink:0, position:'relative'}}>
    <span style={{fontSize:13, fontWeight:600, color:AX.text, ...AXS}}>9:41</span>
    <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:110, height:26, background:'#000', borderRadius:'0 0 14px 14px'}}/>
    <div style={{display:'flex', gap:5, alignItems:'center', opacity:0.65}}>
      <span style={{fontSize:10, color:AX.text}}>▲▲▲</span>
      <div style={{width:22, height:11, borderRadius:2.5, border:`1.5px solid ${AX.text}`, position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', left:2, top:2, bottom:2, width:'70%', background:AX.text, borderRadius:1}}/>
      </div>
    </div>
  </div>
);
const AX_TB = ({active=''}) => {
  const tabs = [
    {id:'home',label:'Home',icon:'⌂'},{id:'portfolio',label:'Portfolio',icon:'◫'},
    {id:'market',label:'Market',icon:'◈'},{id:'social',label:'Social',icon:'◎'},{id:'map',label:'Map',icon:'⊕'},
  ];
  return (
    <div style={{height:56, display:'flex', borderTop:`1px solid ${AX.border}`, background:AX.bg, flexShrink:0}}>
      {tabs.map(t => {
        const on = t.id===active;
        return (
          <div key={t.id} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, color:on?AX.coral:AX.tabI}}>
            <span style={{fontSize:17, lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:9, fontWeight:on?700:500, ...AXS, lineHeight:1}}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
};
const AX_NavBar = ({title, right, onBack}) => (
  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'2px 14px 12px', flexShrink:0, borderBottom:`1px solid ${AX.border}`}}>
    <div onClick={onBack} style={{minWidth:50, display:'flex', alignItems:'center', gap:2, cursor:onBack?'pointer':'default'}}><span style={{fontSize:21, color:AX.text}}>‹</span></div>
    <span style={{fontSize:16, fontWeight:800, color:AX.text, ...AXS}}>{title}</span>
    <div style={{minWidth:50, display:'flex', justifyContent:'flex-end'}}>{right}</div>
  </div>
);

// ═══════════════════ SETTINGS ═══════════════════
const SetRow = ({icon, iconBg, label, value, chevron=true, danger}) => (
  <div style={{display:'flex', alignItems:'center', gap:13, padding:'12px 16px', borderBottom:`1px solid ${AX.border}`, background:AX.card}}>
    <div style={{width:30, height:30, borderRadius:8, background:iconBg||AX.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0}}>{icon}</div>
    <span style={{flex:1, fontSize:14, fontWeight:600, color:danger?AX.red:AX.text, ...AXD}}>{label}</span>
    {value && <span style={{fontSize:12.5, color:AX.ter}}>{value}</span>}
    {chevron && <span style={{fontSize:17, color:AX.ter}}>›</span>}
  </div>
);
const SecLabel = ({children}) => (
  <div style={{fontSize:10.5, fontWeight:800, letterSpacing:'0.6px', color:AX.ter, textTransform:'uppercase', ...AXS, padding:'18px 18px 8px'}}>{children}</div>
);
const AX_Settings = ({onBack}) => (
  <AX_Phone>
    <AX_SB/>
    <AX_NavBar title="Settings" onBack={onBack}/>
    <div style={{flex:1, overflow:'hidden'}}>
      {/* profile summary */}
      <div style={{display:'flex', alignItems:'center', gap:13, padding:'16px 18px', borderBottom:`1px solid ${AX.border}`}}>
        <div style={{width:52, height:52, borderRadius:'50%', background:AX.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:21, fontWeight:700, ...AXS}}>J</div>
        <div style={{flex:1}}>
          <div style={{fontSize:16, fontWeight:800, color:AX.text, ...AXS}}>Jake Morrison</div>
          <div style={{fontSize:12, color:AX.ter, marginTop:1}}>@jakescollects</div>
        </div>
      </div>
      <SecLabel>Account</SecLabel>
      <div style={{background:AX.card, borderTop:`1px solid ${AX.border}`, borderBottom:`1px solid ${AX.border}`}}>
        <SetRow icon="✎" iconBg={AX.coralM} label="Edit Profile"/>
        <SetRow icon="✉" label="Email" value="jake@email.com"/>
        <SetRow icon="🔒" label="Password"/>
        <SetRow icon="📱" label="Phone number" value="+1 (780) •••••67"/>
      </div>
      <SecLabel>Preferences</SecLabel>
      <div style={{background:AX.card, borderTop:`1px solid ${AX.border}`, borderBottom:`1px solid ${AX.border}`}}>
        <SetRow icon="🔔" iconBg={AX.coralM} label="Notifications"/>
        <SetRow icon="🛡" iconBg={AX.purpleM} label="Privacy & visibility"/>
        <SetRow icon="🎨" iconBg={AX.greenM} label="Appearance" value="Light"/>
      </div>
      <SecLabel>Support</SecLabel>
      <div style={{background:AX.card, borderTop:`1px solid ${AX.border}`, borderBottom:`1px solid ${AX.border}`}}>
        <SetRow icon="❓" label="Help & support"/>
        <SetRow icon="ⓘ" label="About Collectiv" value="v1.0"/>
      </div>
      <div style={{padding:'22px 18px'}}>
        <div style={{padding:'13px 0', borderRadius:999, background:AX.card, border:`1px solid ${AX.border}`, textAlign:'center', fontSize:14, fontWeight:700, color:AX.red, ...AXS}}>Log Out</div>
      </div>
    </div>
  </AX_Phone>
);

// ═══════════════════ NOTIFICATIONS ═══════════════════
// type → icon + accent
const NTYPE = {
  like:    {icon:'♥', c:AX.coral},
  comment: {icon:'💬', c:AX.blue},
  follow:  {icon:'＋', c:AX.purple},
  mention: {icon:'@', c:AX.blue},
  offer:   {icon:'🏷', c:AX.coral},
  drop:    {icon:'↓', c:AX.green},
  sold:    {icon:'🤝', c:AX.green},
  message: {icon:'✉', c:AX.purple},
  event:   {icon:'📅', c:AX.green},
  group:   {icon:'👥', c:AX.purple},
};
const NOTIFS = {
  Today: [
    {t:'offer',  av:'M', ac:AX.coral,  name:'Marcus Chen', txt:'sent an offer on your LeBron \'03 RC — ', strong:'$11,000', time:'8m', unread:true, thumb:'#E76F51'},
    {t:'like',   av:'A', ac:AX.purple, name:'Ava Rodriguez', txt:'liked your showcase post', time:'24m', unread:true, thumb:'#7C3AED'},
    {t:'follow', av:'J', ac:AX.amber,  name:'Jordan Blake', txt:'started following you', time:'1h', unread:true},
    {t:'message',av:'P', ac:AX.blue,   name:'pacific_cards', txt:'sent you a message', time:'2h'},
  ],
  'This week': [
    {t:'comment',av:'D', ac:AX.blue,   name:'Diego Santos', txt:'commented: “Insane centering on that one 🔥”', time:'2d', thumb:'#10B981'},
    {t:'drop',   av:'🏷', ac:AX.green, name:'Price drop', txt:'A card you’re watching dropped to ', strong:'$1,250', time:'3d', thumb:'#f59e0b', system:true},
    {t:'event',  av:'📅', ac:AX.green, name:'Edmonton Card Show', txt:'starts in 2 days — you’re going!', time:'4d', system:true},
  ],
  Earlier: [
    {t:'sold',   av:'🤝', ac:AX.green, name:'Sold!', txt:'Your Ohtani \'18 RC sold for ', strong:'$890', time:'1w', system:true, thumb:'#2563eb'},
    {t:'group',  av:'👥', ac:AX.purple,name:'PSA 10 Hunters', txt:'invited you to join the group', time:'2w', system:true},
    {t:'mention',av:'K', ac:AX.coral,  name:'Kayla Brooks', txt:'mentioned you in a post', time:'2w'},
  ],
};
const NotifRow = ({n}) => {
  const ty = NTYPE[n.t];
  return (
    <div style={{display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:`1px solid ${AX.border}`, background:n.unread?AX.coralM:'transparent'}}>
      <div style={{position:'relative', flexShrink:0}}>
        <div style={{width:44, height:44, borderRadius:n.system?12:'50%', background:n.system?AX.surface:n.ac, display:'flex', alignItems:'center', justifyContent:'center', color:n.system?AX.text:'#fff', fontSize:n.system?19:17, fontWeight:700, ...AXS}}>{n.av}</div>
        <div style={{position:'absolute', bottom:-3, right:-3, width:20, height:20, borderRadius:'50%', background:ty.c, border:`2px solid ${AX.bg}`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:9.5}}>{ty.icon}</div>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:12.5, color:AX.text, lineHeight:1.4}}>
          <span style={{fontWeight:700, ...AXS}}>{n.name}</span> {n.txt}{n.strong && <span style={{fontWeight:800, color:AX.coral, ...AXS}}>{n.strong}</span>}
        </div>
        <div style={{fontSize:10.5, color:AX.ter, marginTop:2}}>{n.time}</div>
      </div>
      {n.thumb
        ? <div style={{width:38, height:50, borderRadius:6, background:`linear-gradient(145deg,${AX.surface},${n.thumb})`, flexShrink:0, position:'relative', overflow:'hidden'}}><div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.2),transparent 55%)'}}/></div>
        : n.unread ? <div style={{width:8, height:8, borderRadius:'50%', background:AX.coral, flexShrink:0}}/> : null}
    </div>
  );
};
const AX_Notifications = ({onBack}) => (
  <AX_Phone>
    <AX_SB/>
    <AX_NavBar title="Notifications" onBack={onBack} right={<span style={{fontSize:11.5, fontWeight:700, color:AX.coral, ...AXS}}>Mark read</span>}/>
    <div style={{flex:1, overflow:'hidden'}}>
      {Object.entries(NOTIFS).map(([group, items]) => (
        <div key={group}>
          <div style={{fontSize:10.5, fontWeight:800, letterSpacing:'0.5px', color:AX.ter, textTransform:'uppercase', ...AXS, padding:'12px 16px 7px', background:AX.surface}}>{group}</div>
          {items.map((n,i) => <NotifRow key={i} n={n}/>)}
        </div>
      ))}
    </div>
    <AX_TB/>
  </AX_Phone>
);

// ═══════════════════ MESSAGES — INBOX ═══════════════════
const THREADS = [
  {av:'M', c:AX.coral,  name:'Marcus Chen', handle:'mchen_cards', online:true,  msg:'Would you take $11k for the LeBron?', time:'8m', unread:2, listing:'LeBron James · ’03 Chrome RC', listingPrice:'$12,500', listingColor:AX.coral},
  {av:'P', c:AX.blue,   name:'pacific_cards', online:true, msg:'Shipped! Tracking sent 📦', time:'2h', unread:1},
  {av:'🏪',c:AX.purple, name:'Sportscards YEG', vendor:true, online:false, msg:'We just restocked Prizm singles —', time:'5h', unread:0},
  {av:'A', c:AX.purple, name:'Ava Rodriguez', handle:'avapulls', online:false, msg:'Still available? I can meet downtown', time:'1d', unread:0, listing:'Shohei Ohtani · 2018 Update RC', listingPrice:'$340', listingColor:AX.blue},
  {av:'J', c:AX.amber,  name:'Jordan Blake', handle:'jblake_psa', online:false, msg:'Trade for your Curry rookie?', time:'2d', unread:0},
  {av:'D', c:AX.green,  name:'Diego Santos', handle:'dsantos_rc', online:false, msg:'You: I can do the meetup at noon', time:'4d', unread:0, you:true},
];
const ThreadRow = ({t, onOpen}) => (
  <div onClick={onOpen} style={{display:'flex', alignItems:'center', gap:13, padding:'12px 16px', borderBottom:`1px solid ${AX.border}`, cursor:onOpen?'pointer':'default'}}>
    <div style={{position:'relative', flexShrink:0}}>
      <div style={{width:50, height:50, borderRadius:t.vendor?14:'50%', background:t.vendor?`linear-gradient(145deg,${AX.purple},${AX.purple}bb)`:t.c, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:t.vendor?22:19, fontWeight:700, ...AXS}}>{t.av}</div>
      {t.online && <div style={{position:'absolute', bottom:1, right:1, width:13, height:13, borderRadius:'50%', background:AX.green, border:`2.5px solid ${AX.bg}`}}/>}
    </div>
    <div style={{flex:1, minWidth:0}}>
      <div style={{display:'flex', alignItems:'center', gap:6}}>
        <span style={{fontSize:14, fontWeight:t.unread?800:700, color:AX.text, ...AXS, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{t.name}</span>
        {t.vendor && <span style={{fontSize:10, color:AX.green}}>✓</span>}
      </div>
      {/* listing context chip */}
      {t.listing && (
        <div style={{display:'flex', alignItems:'center', gap:7, marginTop:4, padding:'4px 8px 4px 4px', borderRadius:8, background:AX.surface, border:`1px solid ${AX.border}`}}>
          <div style={{width:22, height:30, borderRadius:4, background:`linear-gradient(145deg,${AX.surface},${t.listingColor})`, flexShrink:0, position:'relative', overflow:'hidden'}}><div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.25),transparent 55%)'}}/></div>
          <div style={{minWidth:0, flex:1}}>
            <div style={{fontSize:9.5, fontWeight:700, color:AX.text, ...AXS, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{t.listing}</div>
            <div style={{fontSize:9, fontWeight:700, color:AX.coral, ...AXS}}>🏷 {t.listingPrice}</div>
          </div>
        </div>
      )}
      <div style={{display:'flex', alignItems:'center', gap:5, marginTop:t.listing?4:2}}>
        <span style={{fontSize:12, color:t.unread?AX.text:AX.ter, fontWeight:t.unread?600:400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{t.msg}</span>
      </div>
    </div>
    <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5, flexShrink:0}}>
      <span style={{fontSize:10.5, color:t.unread?AX.coral:AX.ter, fontWeight:t.unread?700:400}}>{t.time}</span>
      {t.unread>0 && <div style={{minWidth:18, height:18, padding:'0 5px', borderRadius:999, background:AX.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10.5, fontWeight:800, ...AXS}}>{t.unread}</div>}
    </div>
  </div>
);
const AX_Messages = ({onBack, onOpen}) => (
  <AX_Phone>
    <AX_SB/>
    <AX_NavBar title="Messages" onBack={onBack} right={<span style={{fontSize:19, color:AX.coral}}>✎</span>}/>
    <div style={{padding:'12px 16px 10px', flexShrink:0}}>
      <div style={{display:'flex', alignItems:'center', gap:9, height:40, padding:'0 14px', borderRadius:999, background:AX.surface, border:`1px solid ${AX.border}`}}>
        <span style={{fontSize:14, color:AX.ter}}>⌕</span>
        <span style={{fontSize:13, color:AX.ter}}>Search messages</span>
      </div>
    </div>
    <div style={{flex:1, overflow:'hidden'}}>
      {THREADS.map((t,i) => <ThreadRow key={i} t={t} onOpen={i===0?onOpen:undefined}/>)}
    </div>
    <AX_TB/>
  </AX_Phone>
);

// ═══════════════════ MESSAGES — CHAT ═══════════════════
const Bubble = ({me, children, time}) => (
  <div style={{display:'flex', flexDirection:'column', alignItems:me?'flex-end':'flex-start', marginBottom:10}}>
    <div style={{maxWidth:'74%', padding:'9px 13px', borderRadius:me?'16px 16px 4px 16px':'16px 16px 16px 4px', background:me?AX.coral:AX.card, color:me?'#fff':AX.text, fontSize:13.5, lineHeight:1.45, boxShadow:me?'none':AX.shadow, ...AXD}}>{children}</div>
    <span style={{fontSize:9.5, color:AX.ter, margin:'4px 4px 0'}}>{time}</span>
  </div>
);
const AX_Chat = ({onBack}) => (
  <AX_Phone>
    <AX_SB/>
    {/* header */}
    <div style={{display:'flex', alignItems:'center', gap:11, padding:'2px 14px 11px', flexShrink:0, borderBottom:`1px solid ${AX.border}`}}>
      <div onClick={onBack} style={{fontSize:21, color:AX.text, cursor:onBack?'pointer':'default'}}>‹</div>
      <div style={{position:'relative'}}>
        <div style={{width:38, height:38, borderRadius:'50%', background:AX.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:15, fontWeight:700, ...AXS}}>M</div>
        <div style={{position:'absolute', bottom:0, right:0, width:11, height:11, borderRadius:'50%', background:AX.green, border:`2px solid ${AX.bg}`}}/>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{display:'flex', alignItems:'center', gap:5}}>
          <span style={{fontSize:14, fontWeight:800, color:AX.text, ...AXS}}>Marcus Chen</span>
          <span style={{fontSize:10, color:AX.green}}>✓</span>
        </div>
        <div style={{fontSize:10.5, color:AX.green, marginTop:1}}>● Active now</div>
      </div>
      <span style={{fontSize:18, color:AX.text, letterSpacing:1}}>···</span>
    </div>
    {/* pinned listing context card (light) */}
    <div style={{display:'flex', alignItems:'center', gap:11, margin:'10px 14px 4px', padding:'9px 11px', borderRadius:14, background:AX.surface, border:`1px solid ${AX.border}`, flexShrink:0}}>
      <div style={{width:40, height:56, borderRadius:7, background:`linear-gradient(145deg,${AX.surface},${AX.coral})`, position:'relative', overflow:'hidden', flexShrink:0}}><div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.22),transparent 55%)'}}/></div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:9, fontWeight:700, color:AX.ter, letterSpacing:'0.4px', ...AXS}}>DISCUSSING</div>
        <div style={{fontSize:12.5, fontWeight:700, color:AX.text, ...AXS, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>LeBron James — '03 Chrome RC</div>
        <div style={{fontSize:11.5, fontWeight:800, color:AX.coral, ...AXS, marginTop:1}}>$12,500 · PSA 10</div>
      </div>
      <span style={{fontSize:18, color:AX.ter, flexShrink:0}}>›</span>
    </div>
    {/* thread */}
    <div style={{flex:1, overflow:'hidden', padding:'12px 14px 4px', display:'flex', flexDirection:'column'}}>
      <div style={{textAlign:'center', fontSize:10, color:AX.ter, margin:'0 0 12px'}}>TODAY</div>
      <Bubble time="9:58 AM">Hey! Saw your LeBron rookie listed — that centering is clean 👀</Bubble>
      <Bubble me time="10:02 AM">Thanks! Yeah it's a strong 10, corners are razor sharp.</Bubble>
      <Bubble time="10:03 AM">Would you take $11k? I can do an in-person meetup downtown this week.</Bubble>
      <Bubble me time="10:05 AM">Appreciate the offer — I could meet in the middle at $11.8k. Can do Saturday at the EXPO show.</Bubble>
      <Bubble time="10:06 AM">Deal if it's $11.5k. I'll bring cash 🤝</Bubble>
    </div>
    {/* input */}
    <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 14px 14px', borderTop:`1px solid ${AX.border}`, flexShrink:0}}>
      <div style={{width:38, height:38, borderRadius:'50%', background:AX.surface, border:`1px solid ${AX.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, color:AX.coral, flexShrink:0}}>+</div>
      <div style={{flex:1, height:40, padding:'0 16px', borderRadius:999, background:AX.surface, border:`1px solid ${AX.border}`, display:'flex', alignItems:'center'}}>
        <span style={{fontSize:13, color:AX.ter}}>Message…</span>
      </div>
      <div style={{width:40, height:40, borderRadius:'50%', background:AX.coral, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#fff', flexShrink:0, boxShadow:`0 3px 10px ${AX.coral}40`}}>➤</div>
    </div>
  </AX_Phone>
);

// ═══════════════════ MESSAGES — NEW MESSAGE (compose) ═══════════════════
const NEW_MSG_CONTACTS = [
  {av:'M', c:AX.coral,  name:'Marcus Chen',    handle:'mchen_cards',  online:true},
  {av:'P', c:AX.blue,   name:'pacific_cards',  vendor:true,          online:true},
  {av:'A', c:AX.purple, name:'Ava Rodriguez',  handle:'avapulls'},
  {av:'J', c:AX.amber,  name:'Jordan Blake',   handle:'jblake_psa'},
  {av:'D', c:AX.green,  name:'Diego Santos',   handle:'dsantos_rc'},
  {av:'K', c:AX.coral,  name:'Kayla Brooks',   handle:'kaylapulls'},
  {av:'🏪',c:AX.purple, name:'Sportscards YEG', vendor:true},
];
const AX_NewMessage = ({onBack}) => (
  <AX_Phone>
    <AX_SB/>
    <AX_NavBar title="New Message" onBack={onBack}
      right={<span style={{fontSize:13.5, fontWeight:700, color:AX.coral, ...AXS}}>Next</span>}/>
    {/* To: pill field */}
    <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 16px 11px', borderBottom:`1px solid ${AX.border}`, flexShrink:0}}>
      <span style={{fontSize:13, fontWeight:700, color:AX.sec, ...AXS}}>To:</span>
      <div style={{flex:1, height:38, padding:'0 14px', borderRadius:999, background:AX.surface, border:`1px solid ${AX.border}`, display:'flex', alignItems:'center'}}>
        <span style={{fontSize:13, color:AX.ter}}>Search collectors &amp; vendors…</span>
      </div>
    </div>
    <div style={{flex:1, overflow:'hidden'}}>
      <div style={{fontSize:10.5, fontWeight:800, letterSpacing:'0.5px', color:AX.ter, textTransform:'uppercase', ...AXS, padding:'13px 16px 8px', background:AX.surface}}>Recents</div>
      {NEW_MSG_CONTACTS.map((t,i) => (
        <div key={i} style={{display:'flex', alignItems:'center', gap:13, padding:'11px 16px', borderBottom:`1px solid ${AX.border}`}}>
          <div style={{position:'relative'}}>
            <div style={{width:44, height:44, borderRadius:t.vendor?13:'50%', background:t.vendor?`linear-gradient(145deg,${AX.purple},${AX.purple}bb)`:t.c, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:17, fontWeight:700, ...AXS}}>{t.av}</div>
            {t.online && <div style={{position:'absolute', bottom:0, right:0, width:11, height:11, borderRadius:'50%', background:AX.green, border:`2px solid ${AX.bg}`}}/>}
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:13.5, fontWeight:700, color:AX.text, ...AXS}}>{t.name}</div>
            {t.handle && <div style={{fontSize:11, color:AX.ter, marginTop:1}}>@{t.handle}</div>}
            {t.vendor && <div style={{fontSize:11, color:AX.green, marginTop:1}}>✓ Verified vendor</div>}
          </div>
          {/* unread indicator for recents */}
          <div style={{width:36, height:36, borderRadius:'50%', background:AX.surface, border:`1px solid ${AX.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:AX.ter}}>›</div>
        </div>
      ))}
    </div>
    <AX_TB/>
  </AX_Phone>
);

// ═══════════════════ MESSAGES — CHAT (no listing context) ═══════════════════
const AX_ChatPlain = ({onBack}) => (
  <AX_Phone>
    <AX_SB/>
    <div style={{display:'flex', alignItems:'center', gap:11, padding:'2px 14px 11px', flexShrink:0, borderBottom:`1px solid ${AX.border}`}}>
      <div onClick={onBack} style={{fontSize:21, color:AX.text, cursor:onBack?'pointer':'default'}}>‹</div>
      <div style={{position:'relative'}}>
        <div style={{width:38, height:38, borderRadius:'50%', background:AX.purple, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:15, fontWeight:700, ...AXS}}>A</div>
        <div style={{position:'absolute', bottom:0, right:0, width:11, height:11, borderRadius:'50%', background:AX.ter, border:`2px solid ${AX.bg}`}}/>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:14, fontWeight:800, color:AX.text, ...AXS}}>Ava Rodriguez</div>
        <div style={{fontSize:10.5, color:AX.ter, marginTop:1}}>Active 3h ago</div>
      </div>
      <span style={{fontSize:18, color:AX.text, letterSpacing:1}}>···</span>
    </div>
    <div style={{flex:1, overflow:'hidden', padding:'14px 14px 4px', display:'flex', flexDirection:'column'}}>
      <div style={{textAlign:'center', fontSize:10, color:AX.ter, margin:'0 0 14px'}}>YESTERDAY</div>
      <Bubble time="4:22 PM">Did you end up getting that Curry graded? 👀</Bubble>
      <Bubble me time="4:30 PM">Yeah just got it back — PSA 9! Not quite a 10 but still clean.</Bubble>
      <Bubble time="4:31 PM">Still great! Hold or sell?</Bubble>
      <Bubble me time="4:45 PM">Holding for now. Waiting to see where comps go this quarter.</Bubble>
      <div style={{textAlign:'center', fontSize:10, color:AX.ter, margin:'10px 0 14px'}}>TODAY</div>
      <Bubble time="10:14 AM">You going to the card show next weekend?</Bubble>
      <Bubble me time="10:18 AM">100%! We should meet up and check the vendor tables 🃏</Bubble>
    </div>
    <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 14px 14px', borderTop:`1px solid ${AX.border}`, flexShrink:0}}>
      <div style={{width:38, height:38, borderRadius:'50%', background:AX.surface, border:`1px solid ${AX.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, color:AX.coral, flexShrink:0}}>+</div>
      <div style={{flex:1, height:40, padding:'0 16px', borderRadius:999, background:AX.surface, border:`1px solid ${AX.border}`, display:'flex', alignItems:'center'}}>
        <span style={{fontSize:13, color:AX.ter}}>Message…</span>
      </div>
      <div style={{width:40, height:40, borderRadius:'50%', background:AX.coral, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#fff', flexShrink:0, boxShadow:`0 3px 10px ${AX.coral}40`}}>➤</div>
    </div>
  </AX_Phone>
);

// ═══════════════════ MESSAGES — GROUP CHAT ═══════════════════
const GroupBubble = ({av, c, name, children, time, me}) => (
  <div style={{display:'flex', flexDirection:'column', alignItems:me?'flex-end':'flex-start', marginBottom:10}}>
    {!me && <div style={{fontSize:10, fontWeight:700, color:c, ...AXS, marginLeft:42, marginBottom:3}}>{name}</div>}
    <div style={{display:'flex', alignItems:'flex-end', gap:7, flexDirection:me?'row-reverse':'row'}}>
      {!me && <div style={{width:30, height:30, borderRadius:'50%', background:c, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:700, ...AXS, flexShrink:0}}>{av}</div>}
      <div style={{display:'flex', flexDirection:'column', alignItems:me?'flex-end':'flex-start', gap:3}}>
        <div style={{maxWidth:218, padding:'9px 12px', borderRadius:me?'16px 16px 4px 16px':'16px 16px 16px 4px', background:me?AX.coral:AX.card, color:me?'#fff':AX.text, fontSize:13, lineHeight:1.45, boxShadow:me?'none':AX.shadow}}>{children}</div>
        <span style={{fontSize:9.5, color:AX.ter}}>{time}</span>
      </div>
    </div>
  </div>
);
const AX_GroupChat = ({onBack}) => (
  <AX_Phone>
    <AX_SB/>
    <div style={{display:'flex', alignItems:'center', gap:11, padding:'2px 14px 11px', flexShrink:0, borderBottom:`1px solid ${AX.border}`}}>
      <div onClick={onBack} style={{fontSize:21, color:AX.text, cursor:onBack?'pointer':'default'}}>‹</div>
      {/* mosaic avatar */}
      <div style={{width:40, height:40, borderRadius:13, background:AX.surface, position:'relative', flexShrink:0, overflow:'hidden'}}>
        {[AX.coral,AX.purple,AX.green,AX.amber].map((c,i) => (
          <div key={i} style={{position:'absolute', width:18, height:18, background:c, borderRadius:4, top:i<2?1:21, left:i%2===0?1:21, border:`1.5px solid ${AX.bg}`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:8, fontWeight:700}}>{'JMAD'[i]}</div>
        ))}
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:14, fontWeight:800, color:AX.text, ...AXS}}>PSA 10 Hunters</div>
        <div style={{fontSize:10.5, color:AX.ter, marginTop:1}}>Jake, Marcus, Ava +5</div>
      </div>
      <span style={{fontSize:18, color:AX.text, letterSpacing:1}}>···</span>
    </div>
    <div style={{flex:1, overflow:'hidden', padding:'14px 14px 4px', display:'flex', flexDirection:'column'}}>
      <div style={{textAlign:'center', fontSize:10, color:AX.ter, margin:'0 0 14px'}}>TODAY</div>
      <GroupBubble av="M" c={AX.coral}  name="Marcus" time="9:12 AM">Anyone heading to the EXPO show this Sunday? 🃏</GroupBubble>
      <GroupBubble av="A" c={AX.purple} name="Ava"    time="9:18 AM">I'm in! Looking for BGS 9.5s mainly</GroupBubble>
      <GroupBubble av="D" c={AX.green}  name="Diego"  time="9:20 AM">Same. Also chasing a Mahomes RPA if anyone spots one</GroupBubble>
      <GroupBubble av="J" c={AX.amber}  name="You"    time="9:22 AM" me>I'll be there at 10 AM — meet at the Sportscards YEG table first 👍</GroupBubble>
      <GroupBubble av="M" c={AX.coral}  name="Marcus" time="9:24 AM">Perfect, they always have the best graded singles at that show</GroupBubble>
    </div>
    <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 14px 14px', borderTop:`1px solid ${AX.border}`, flexShrink:0}}>
      <div style={{width:38, height:38, borderRadius:'50%', background:AX.surface, border:`1px solid ${AX.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, color:AX.coral, flexShrink:0}}>+</div>
      <div style={{flex:1, height:40, padding:'0 16px', borderRadius:999, background:AX.surface, border:`1px solid ${AX.border}`, display:'flex', alignItems:'center'}}>
        <span style={{fontSize:13, color:AX.ter}}>Message…</span>
      </div>
      <div style={{width:40, height:40, borderRadius:'50%', background:AX.coral, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#fff', flexShrink:0}}>➤</div>
    </div>
  </AX_Phone>
);

// ═══════════════════ MESSAGES — CHAT MORE (··· action sheet) ═══════════════════
const AX_ChatMore = ({onBack}) => {
  const actions = [
    {icon:'👤', label:'View Profile',          sub:'@mchen_cards · Verified',       c:AX.text},
    {icon:'🤝', label:'Create an Offer',        sub:'Propose a deal — starts the confirm flow', c:AX.coral},
    {icon:'🔔', label:'Mute Notifications',     sub:'Stop alerts for this chat',      c:AX.text},
    {icon:'🚩', label:'Report',                 sub:'Flag inappropriate behaviour',  c:AX.amber},
    {icon:'⛔', label:'Block',                  sub:"They won't be able to message you", c:AX.red, danger:true},
    {icon:'🗑', label:'Delete Conversation',    sub:'Removes chat for you only',      c:AX.red, danger:true},
  ];
  return (
    <AX_Phone>
      <AX_SB/>
      {/* chat header */}
      <div style={{display:'flex', alignItems:'center', gap:11, padding:'2px 14px 11px', flexShrink:0, borderBottom:`1px solid ${AX.border}`}}>
        <div onClick={onBack} style={{fontSize:21, color:AX.text, cursor:onBack?'pointer':'default'}}>‹</div>
        <div style={{position:'relative'}}>
          <div style={{width:38, height:38, borderRadius:'50%', background:AX.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:15, fontWeight:700, ...AXS}}>M</div>
          <div style={{position:'absolute', bottom:0, right:0, width:11, height:11, borderRadius:'50%', background:AX.green, border:`2px solid ${AX.bg}`}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:14, fontWeight:800, color:AX.text, ...AXS}}>Marcus Chen</div>
          <div style={{fontSize:10.5, color:AX.green}}>● Active now</div>
        </div>
        {/* tapped ··· highlighted */}
        <div style={{width:32, height:32, borderRadius:'50%', background:AX.coral, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:'#fff', letterSpacing:1}}>···</div>
      </div>
      {/* dim overlay */}
      <div style={{flex:1, background:'rgba(14,13,12,0.34)', display:'flex', alignItems:'flex-end'}}>
        <div style={{width:'100%', background:AX.bg, borderRadius:'22px 22px 0 0', boxShadow:'0 -10px 32px rgba(26,18,16,0.18)', overflow:'hidden'}}>
          <div style={{display:'flex', justifyContent:'center', padding:'10px 0 6px'}}>
            <div style={{width:38, height:4.5, borderRadius:3, background:AX.ter}}/>
          </div>
          {/* person header */}
          <div style={{display:'flex', alignItems:'center', gap:12, padding:'10px 18px 14px', borderBottom:`1px solid ${AX.border}`}}>
            <div style={{width:46, height:46, borderRadius:'50%', background:AX.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:18, fontWeight:700, ...AXS}}>M</div>
            <div>
              <div style={{fontSize:15, fontWeight:800, color:AX.text, ...AXS}}>Marcus Chen</div>
              <div style={{fontSize:11, color:AX.green, marginTop:1}}>✓ Verified · Active now</div>
            </div>
          </div>
          {/* action rows */}
          {actions.map(({icon,label,sub,c,danger},i) => (
            <div key={i} style={{display:'flex', alignItems:'center', gap:13, padding:'12px 18px', borderBottom:`1px solid ${AX.border}`, background:danger?'rgba(220,38,38,0.04)':'transparent'}}>
              <div style={{width:38, height:38, borderRadius:11, background:danger?'rgba(220,38,38,0.09)':AX.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0}}>{icon}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:13.5, fontWeight:700, color:c, ...AXS}}>{label}</div>
                {sub && <div style={{fontSize:11, color:AX.ter, marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{sub}</div>}
              </div>
              {!danger && <span style={{fontSize:17, color:AX.ter}}>›</span>}
            </div>
          ))}
          <div style={{height:16}}/>
        </div>
      </div>
    </AX_Phone>
  );
};

// ── Export ────────────────────────────────────────────────────────────────────
// ═══════════════════ TRANSACTION CONFIRMATION FLOW ═══════════════════
// Shared sub-components
const TXChatHeader = ({name, av, color, online}) => (
  <div style={{display:'flex', alignItems:'center', gap:11, padding:'2px 14px 11px', flexShrink:0, borderBottom:`1px solid ${AX.border}`}}>
    <div style={{fontSize:21, color:AX.text}}>‹</div>
    <div style={{position:'relative'}}>
      <div style={{width:38, height:38, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:15, fontWeight:700, ...AXS}}>{av}</div>
      {online && <div style={{position:'absolute', bottom:0, right:0, width:11, height:11, borderRadius:'50%', background:AX.green, border:`2px solid ${AX.bg}`}}/>}
    </div>
    <div style={{flex:1, minWidth:0}}>
      <div style={{display:'flex', alignItems:'center', gap:5}}>
        <span style={{fontSize:14, fontWeight:800, color:AX.text, ...AXS}}>{name}</span>
        <span style={{fontSize:10, color:AX.green}}>✓</span>
      </div>
      <div style={{fontSize:10.5, color:online?AX.green:AX.ter}}>{online?'● Active now':'Active 2h ago'}</div>
    </div>
    <span style={{fontSize:18, color:AX.text, letterSpacing:1}}>···</span>
  </div>
);
const TXPinnedCard = ({state='active', onAction, noBtn}) => {
  const cfg = {
    active:  {label:'✓ Confirm',   bg:AX.coral,  tag:'DISCUSSING',              tagC:AX.ter},
    pending: {label:'Pending…',    bg:AX.amber,  tag:'AWAITING SELLER CONFIRM', tagC:AX.amber},
    review:  {label:'Review ›',   bg:AX.green,  tag:'BUYER CONFIRMED PURCHASE',tagC:AX.green},
    done:    {label:'✓ Complete',  bg:AX.green,  tag:'TRANSFERRED',             tagC:AX.green},
  }[state];
  return (
    <div style={{display:'flex', alignItems:'center', gap:11, margin:'10px 14px 4px', padding:'9px 11px', borderRadius:14, background:AX.surface, border:`1px solid ${state!=='active'?cfg.bg:AX.border}`, flexShrink:0}}>
      <div style={{width:40, height:56, borderRadius:7, background:`linear-gradient(145deg,${AX.surface},${AX.coral})`, position:'relative', overflow:'hidden', flexShrink:0}}><div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.22),transparent 55%)'}}/></div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:8.5, fontWeight:800, color:cfg.tagC, letterSpacing:'0.5px', ...AXS}}>{cfg.tag}</div>
        <div style={{fontSize:12, fontWeight:700, color:AX.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>LeBron James — '03 Chrome RC</div>
        <div style={{fontSize:11.5, fontWeight:800, color:AX.coral, ...AXS, marginTop:1}}>$12,500 · PSA 10</div>
      </div>
      {noBtn
        ? <span style={{fontSize:18, color:AX.ter, flexShrink:0}}>›</span>
        : state==='active'
          ? <div onClick={onAction} style={{width:38, height:38, borderRadius:'50%', background:AX.coral, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, color:'#fff', flexShrink:0, cursor:'pointer', boxShadow:`0 4px 12px ${AX.coral}44`, lineHeight:1}}>✓</div>
          : <div onClick={onAction} style={{padding:'7px 13px', borderRadius:999, background:cfg.bg, color:'#fff', fontSize:11, fontWeight:700, ...AXS, flexShrink:0, cursor:'pointer', opacity:state==='pending'?0.65:1}}>{cfg.label}</div>}
    </div>
  );
};
const TXInput = () => (
  <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 14px 14px', borderTop:`1px solid ${AX.border}`, flexShrink:0}}>
    <div style={{width:38, height:38, borderRadius:'50%', background:AX.surface, border:`1px solid ${AX.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, color:AX.coral}}>+</div>
    <div style={{flex:1, height:40, padding:'0 16px', borderRadius:999, background:AX.surface, border:`1px solid ${AX.border}`, display:'flex', alignItems:'center'}}><span style={{fontSize:13, color:AX.ter}}>Message…</span></div>
    <div style={{width:40, height:40, borderRadius:'50%', background:AX.coral, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#fff'}}>➤</div>
  </div>
);
const TXSheet = ({children}) => (
  <div style={{flex:1, background:'rgba(14,13,12,0.32)', display:'flex', alignItems:'flex-end'}}>
    <div style={{width:'100%', background:AX.bg, borderRadius:'22px 22px 0 0', boxShadow:'0 -10px 32px rgba(26,18,16,0.18)'}}>
      <div style={{display:'flex', justifyContent:'center', padding:'10px 0 4px'}}>
        <div style={{width:38, height:4.5, borderRadius:3, background:AX.ter}}/>
      </div>
      {children}
    </div>
  </div>
);

// 1 — Buyer: ✓ Confirm button visible in chat
const AX_TXBuyerChat = () => (
  <AX_Phone><AX_SB/>
    <TXChatHeader name="Marcus Chen" av="M" color={AX.coral} online/>
    <TXPinnedCard state="active" noBtn/>
    <div style={{flex:1, overflow:'hidden', padding:'12px 14px 4px', display:'flex', flexDirection:'column'}}>
      <div style={{textAlign:'center', fontSize:10, color:AX.ter, margin:'0 0 12px'}}>TODAY</div>
      <Bubble me time="9:58 AM">Saw your LeBron rookie — centering is clean 👀</Bubble>
      <Bubble time="10:02 AM">Thanks! Strong 10, corners are razor sharp.</Bubble>
      <Bubble me time="10:04 AM">Would you do $11.5k? Can meetup downtown this week.</Bubble>
      <Bubble time="10:05 AM">Done at $11.5k — tap the ✓ when you're ready.</Bubble>
      <Bubble me time="10:07 AM">Deal! Confirming now 👍</Bubble>
    </div>
    <TXInput/>
  </AX_Phone>
);

// 2 — Buyer: confirm sheet (select items + price)
const TX_ITEMS = [
  {name:"LeBron James '03 Chrome RC", price:'$11,500', grade:'PSA 10', a:AX.coral, on:true},
  {name:"Kobe Bryant '96 Chrome RC",  price:'$2,100',  grade:'PSA 8',  a:AX.amber, on:false},
  {name:"Curry '09 Chrome RC",        price:'$1,450',  grade:'PSA 9',  a:AX.coral, on:false},
];
// buyer's own cards offered in a trade
const TX_TRADE_CARDS = [
  {name:"Stephen Curry '09 Chrome RC", est:'$1,450', grade:'PSA 9',  a:AX.coral, on:true},
  {name:"Ja Morant '19 Prizm RC",      est:'$620',   grade:'PSA 10', a:AX.blue,  on:true},
  {name:"Zion Williamson '19 Prizm",   est:'$540',   grade:'PSA 9',  a:AX.green, on:false},
];
const AX_TXBuyerSheet = ({mode='buy', addDialog=false}) => {
  const isBuy = mode==='buy';
  const sellerMore = [
    {name:"Kobe Bryant '96 Chrome RC", grade:'PSA 8', price:'$2,100', a:AX.amber, on:true},
    {name:"Stephen Curry '09 Chrome RC", grade:'PSA 9', price:'$1,450', a:AX.coral, on:false},
    {name:"Luka Dončić '18 Prizm RC", grade:'PSA 10', price:'$4,100', a:AX.blue, on:false},
  ];
  return (
  <AX_Phone><AX_SB/>
    <TXChatHeader name="Marcus Chen" av="M" color={AX.coral} online/>
    <TXPinnedCard state="active" noBtn/>
    <TXSheet>
      <div style={{padding:'10px 18px 10px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{fontSize:16, fontWeight:800, color:AX.text, ...AXS}}>Make an Offer</div>
        <div style={{width:28, height:28, borderRadius:'50%', background:AX.surface, border:`1px solid ${AX.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:AX.sec}}>✕</div>
      </div>
      {/* Buy / Trade segmented toggle */}
      <div style={{display:'flex', gap:6, margin:'0 18px 4px', padding:4, borderRadius:12, background:AX.surface, border:`1px solid ${AX.border}`}}>
        {[['buy','💵 Buy with cash'],['trade','🔄 Offer a trade']].map(([m,l]) => {
          const on = (m==='buy')===isBuy;
          return <div key={m} style={{flex:1, padding:'9px 0', borderRadius:9, textAlign:'center', fontSize:12, fontWeight:700, ...AXS, background:on?AX.card:'transparent', color:on?AX.coral:AX.ter, boxShadow:on?'0 1px 4px rgba(26,18,16,0.1)':'none'}}>{l}</div>;
        })}
      </div>

      {isBuy ? (
        /* ─── BUY: cash amount for the listed card ─── */
        <div style={{padding:'8px 18px 0'}}>
          <div style={{display:'flex', alignItems:'center', gap:12, padding:'10px 0'}}>
            <div style={{width:34, height:48, borderRadius:6, background:`linear-gradient(145deg,${AX.surface},${AX.coral})`, flexShrink:0}}/>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:12, fontWeight:700, color:AX.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>LeBron James '03 Chrome RC</div>
              <div style={{fontSize:10, color:AX.ter, marginTop:1}}>PSA 10 · listed $12,500</div>
            </div>
          </div>
          <div style={{marginTop:6}}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
              <span style={{fontSize:11.5, fontWeight:700, color:AX.sec, ...AXS}}>Your offer</span>
              <div style={{display:'flex', alignItems:'center', gap:5, padding:'6px 11px', borderRadius:999, background:AX.coralM, border:`1px solid ${AX.coral}`, color:AX.coral, fontSize:11, fontWeight:700, ...AXS}}><span style={{fontSize:13, lineHeight:1}}>＋</span> Add more cards</div>
            </div>
            <div style={{display:'flex', alignItems:'center', height:50, padding:'0 16px', borderRadius:12, background:AX.card, border:`1.5px solid ${AX.coral}`, gap:6}}>
              <span style={{fontSize:18, fontWeight:800, color:AX.coral, ...AXS}}>$</span>
              <span style={{fontSize:22, fontWeight:800, color:AX.text, ...AXS}}>11,500</span>
              <span style={{marginLeft:'auto', fontSize:10.5, color:AX.green, fontWeight:700}}>8% below ask</span>
            </div>
          </div>
        </div>
      ) : (
        /* ─── TRADE: offer cards from your collection (+ optional cash) ─── */
        <div style={{padding:'8px 18px 0'}}>
          <div style={{fontSize:11.5, fontWeight:700, color:AX.sec, ...AXS, marginBottom:4}}>Cards from your collection</div>
          {TX_TRADE_CARDS.map((c,i) => (
            <div key={i} style={{display:'flex', alignItems:'center', gap:12, padding:'9px 0', borderBottom:`1px solid ${AX.border}`}}>
              <div style={{width:30, height:42, borderRadius:5, background:`linear-gradient(145deg,${AX.surface},${c.a})`, flexShrink:0}}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:11.5, fontWeight:700, color:AX.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.name}</div>
                <div style={{fontSize:10, color:AX.ter, marginTop:1}}>{c.grade} · est. {c.est}</div>
              </div>
              <div style={{width:22, height:22, borderRadius:6, background:c.on?AX.coral:AX.surface, border:`2px solid ${c.on?AX.coral:AX.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                {c.on && <span style={{color:'#fff', fontSize:11, fontWeight:800}}>✓</span>}
              </div>
            </div>
          ))}
          <div style={{display:'flex', alignItems:'center', gap:8, marginTop:11}}>
            <span style={{fontSize:11.5, fontWeight:700, color:AX.sec, ...AXS}}>+ Add cash</span>
            <div style={{display:'flex', alignItems:'center', height:34, padding:'0 12px', borderRadius:999, background:AX.card, border:`1.5px solid ${AX.border}`, gap:3}}>
              <span style={{fontSize:12, fontWeight:700, color:AX.coral}}>$</span>
              <span style={{fontSize:14, fontWeight:800, color:AX.text, ...AXS}}>500</span>
            </div>
            <span style={{marginLeft:'auto', fontSize:10, color:AX.ter}}>Your side ≈ $2,570</span>
          </div>
        </div>
      )}

      <div style={{padding:'14px 18px 20px'}}>
        <div style={{padding:'13px 0', borderRadius:999, background:AX.coral, textAlign:'center', color:'#fff', fontSize:14, fontWeight:700, ...AXS, boxShadow:`0 4px 14px ${AX.coral}33`}}>{isBuy?'Send offer · $11,500':'Send trade offer →'}</div>
      </div>
    </TXSheet>
    {addDialog && (
      <React.Fragment>
        <div style={{position:'absolute', inset:0, background:'rgba(14,13,12,0.45)', zIndex:40}}/>
        <div style={{position:'absolute', left:20, right:20, top:'50%', transform:'translateY(-50%)', background:AX.bg, borderRadius:18, zIndex:41, boxShadow:'0 20px 50px rgba(26,18,16,0.3)', overflow:'hidden'}}>
          <div style={{padding:'14px 16px 10px', borderBottom:`1px solid ${AX.border}`}}>
            <div style={{fontSize:14.5, fontWeight:800, color:AX.text, ...AXS}}>Add from Marcus’s listings</div>
            <div style={{fontSize:10.5, color:AX.ter, marginTop:2}}>Bundle more cards into this offer</div>
          </div>
          {sellerMore.map((c,i) => (
            <div key={i} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 16px', borderBottom:`1px solid ${AX.border}`}}>
              <div style={{width:30, height:42, borderRadius:5, background:`linear-gradient(145deg,${AX.surface},${c.a})`, flexShrink:0}}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:11.5, fontWeight:700, color:AX.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.name}</div>
                <div style={{fontSize:10, color:AX.ter, marginTop:1}}>{c.grade} · listed {c.price}</div>
              </div>
              <div style={{width:22, height:22, borderRadius:6, background:c.on?AX.coral:AX.surface, border:`2px solid ${c.on?AX.coral:AX.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                {c.on && <span style={{color:'#fff', fontSize:11, fontWeight:800}}>✓</span>}
              </div>
            </div>
          ))}
          <div style={{display:'flex', gap:10, padding:'12px 16px 16px'}}>
            <div style={{flex:1, padding:'11px 0', borderRadius:999, background:AX.surface, border:`1px solid ${AX.border}`, textAlign:'center', fontSize:13, fontWeight:700, color:AX.sec, ...AXS}}>Cancel</div>
            <div style={{flex:1.4, padding:'11px 0', borderRadius:999, background:AX.coral, textAlign:'center', fontSize:13, fontWeight:700, color:'#fff', ...AXS}}>Add 1 card</div>
          </div>
        </div>
      </React.Fragment>
    )}
  </AX_Phone>
  );
};

// 3 — Buyer: pending (waiting for seller)
const AX_TXBuyerPending = () => (
  <AX_Phone><AX_SB/>
    <TXChatHeader name="Marcus Chen" av="M" color={AX.coral} online/>
    <TXPinnedCard state="pending"/>
    <div style={{flex:1, overflow:'hidden', padding:'12px 14px 4px', display:'flex', flexDirection:'column'}}>
      <div style={{textAlign:'center', fontSize:10, color:AX.ter, margin:'0 0 12px'}}>TODAY</div>
      <Bubble me time="10:07 AM">Deal! Confirming now 👍</Bubble>
      <div style={{margin:'10px 4px', padding:'10px 14px', borderRadius:12, background:AX.surface, border:`1px solid ${AX.border}`, fontSize:11, color:AX.sec, lineHeight:1.5, textAlign:'center'}}>
        <span style={{fontWeight:800, color:AX.amber}}>⏱ Confirmation sent</span><br/>Waiting for Marcus to verify 1 item · $11,500
      </div>
      <Bubble me time="10:08 AM">Sent my confirmation — you should get a notification now!</Bubble>
    </div>
    <TXInput/>
  </AX_Phone>
);

// 4 — Seller: sees “Review ›” on the card + notification in chat
const AX_TXSellerChat = ({kind='buy'}) => (
  <AX_Phone><AX_SB/>
    <TXChatHeader name="Jake Morrison" av="J" color={AX.coral} online/>
    <TXPinnedCard state="review"/>
    <div style={{flex:1, overflow:'hidden', padding:'12px 14px 4px', display:'flex', flexDirection:'column'}}>
      <div style={{textAlign:'center', fontSize:10, color:AX.ter, margin:'0 0 12px'}}>TODAY</div>
      {kind==='buy' ? (
        <React.Fragment>
          <Bubble time="10:04 AM">Would you do $11.5k for the LeBron + the Kobe?</Bubble>
          <Bubble me time="10:05 AM">Works for me — send the offer when ready.</Bubble>
          <Bubble time="10:07 AM">Sent! 2 cards, $11.5k total 👍</Bubble>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Bubble time="10:04 AM">Would you trade the LeBron for my Curry + Morant?</Bubble>
          <Bubble me time="10:05 AM">Maybe — send it over and I'll take a look.</Bubble>
          <Bubble time="10:07 AM">Sent a trade offer 🔄 (+ $500 on my side)</Bubble>
        </React.Fragment>
      )}
      <div style={{margin:'10px 4px', padding:'10px 14px', borderRadius:12, background:AX.greenM, border:`1px solid ${AX.green}`, fontSize:11, color:AX.sec, lineHeight:1.5, textAlign:'center'}}>
        <span style={{fontWeight:800, color:AX.green}}>🔔 {kind==='buy'?'Jake sent a purchase offer':'Jake sent a trade offer'}</span><br/>Tap <strong>Review ›</strong> on the card above to {kind==='buy'?'verify items & prices':'review the trade'}
      </div>
    </div>
    <TXInput/>
  </AX_Phone>
);

// 5 — Seller: review sheet — accept / counter / deny
const TXReviewRow = ({name, sub, val, valColor}) => (
  <div style={{display:'flex', alignItems:'center', gap:12, padding:'10px 18px', borderBottom:`1px solid ${AX.border}`}}>
    <div style={{width:32, height:46, borderRadius:6, background:`linear-gradient(145deg,${AX.surface},${AX.coral})`, flexShrink:0}}/>
    <div style={{flex:1, minWidth:0}}>
      <div style={{fontSize:12, fontWeight:700, color:AX.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{name}</div>
      <div style={{fontSize:10, color:AX.ter, marginTop:1}}>{sub}</div>
    </div>
    <div style={{fontSize:12, fontWeight:800, color:valColor||AX.coral, ...AXS, flexShrink:0}}>{val}</div>
  </div>
);
const AX_TXSellerReview = ({kind='buy'}) => (
  <AX_Phone><AX_SB/>
    <TXChatHeader name="Jake Morrison" av="J" color={AX.coral} online/>
    <TXPinnedCard state="review"/>
    <TXSheet>
      <div style={{padding:'10px 18px 8px'}}>
        <div style={{fontSize:16, fontWeight:800, color:AX.text, ...AXS}}>Review Jake's {kind==='buy'?'offer':'trade'}</div>
        <div style={{fontSize:11, color:AX.ter, marginTop:2}}>{kind==='buy'?'2 cards · offered $11,500 total':'Wants your LeBron · offers 2 cards + $500'}</div>
      </div>
      {kind==='buy' ? (
        <React.Fragment>
          <div style={{fontSize:10.5, fontWeight:800, color:AX.ter, textTransform:'uppercase', letterSpacing:'0.4px', ...AXS, padding:'8px 18px 4px', borderTop:`1px solid ${AX.border}`}}>Cards they're buying</div>
          <TXReviewRow name="LeBron James — '03 Chrome RC" sub="PSA 10 · listed $12,500" val="$10,500"/>
          <TXReviewRow name="Kobe Bryant — '96 Chrome RC" sub="PSA 8 · listed $2,100" val="$1,000"/>
          <div style={{display:'flex', alignItems:'center', gap:8, padding:'11px 18px', background:AX.surface}}>
            <span style={{fontSize:11, color:AX.sec}}>Total offer (cash):</span>
            <span style={{fontSize:16, fontWeight:800, color:AX.coral, ...AXS}}>$11,500</span>
            <span style={{marginLeft:'auto', fontSize:10, color:AX.ter}}>2 cards leave your portfolio</span>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div style={{fontSize:10.5, fontWeight:800, color:AX.ter, textTransform:'uppercase', letterSpacing:'0.4px', ...AXS, padding:'8px 18px 4px', borderTop:`1px solid ${AX.border}`}}>You give</div>
          <TXReviewRow name="LeBron James — '03 Chrome RC" sub="PSA 10 · your listing $12,500" val="–" valColor={AX.ter}/>
          <div style={{fontSize:10.5, fontWeight:800, color:AX.ter, textTransform:'uppercase', letterSpacing:'0.4px', ...AXS, padding:'8px 18px 4px'}}>You receive</div>
          <TXReviewRow name="Stephen Curry — '09 Chrome RC" sub="PSA 9 · est. $1,450" val="+" valColor={AX.green}/>
          <TXReviewRow name="Ja Morant — '19 Prizm RC" sub="PSA 10 · est. $620" val="+" valColor={AX.green}/>
          <div style={{display:'flex', alignItems:'center', gap:8, padding:'11px 18px', background:AX.surface}}>
            <span style={{fontSize:11, color:AX.sec}}>+ Cash on their side:</span>
            <span style={{fontSize:16, fontWeight:800, color:AX.green, ...AXS}}>$500</span>
            <span style={{marginLeft:'auto', fontSize:10, color:AX.ter}}>≈ $2,570 their value</span>
          </div>
        </React.Fragment>
      )}
      <div style={{padding:'12px 18px 20px', display:'flex', flexDirection:'column', gap:9}}>
        <div style={{padding:'13px 0', borderRadius:999, background:AX.green, textAlign:'center', color:'#fff', fontSize:14, fontWeight:700, ...AXS, boxShadow:`0 4px 14px ${AX.green}33`}}>{kind==='buy'?'Accept Offer':'Accept Trade'}</div>
        <div style={{display:'flex', gap:9}}>
          <div style={{flex:1, padding:'10px 0', borderRadius:999, border:`1.5px solid ${AX.border}`, textAlign:'center', fontSize:12.5, fontWeight:700, color:AX.sec, ...AXS}}>Counter</div>
          <div style={{flex:1, padding:'10px 0', borderRadius:999, border:`1.5px solid ${AX.red}`, textAlign:'center', fontSize:12.5, fontWeight:700, color:AX.red, ...AXS}}>{kind==='buy'?'Deny Offer':'Deny Trade'}</div>
        </div>
      </div>
    </TXSheet>
  </AX_Phone>
);

// 6 — Seller: double-check modal
const TXTransferLine = ({name, sub, dir}) => (
  <div style={{display:'flex', alignItems:'center', gap:11, padding:'10px 18px', borderBottom:`1px solid ${AX.border}`}}>
    <div style={{width:32, height:46, borderRadius:6, background:`linear-gradient(145deg,${AX.surface},${dir==='out'?AX.coral:AX.green})`, flexShrink:0}}/>
    <div style={{flex:1, minWidth:0}}>
      <div style={{fontSize:12, fontWeight:700, color:AX.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{name}</div>
      <div style={{fontSize:10, color:AX.ter, marginTop:1}}>{sub}</div>
    </div>
    <span style={{fontSize:9.5, fontWeight:800, color:dir==='out'?AX.coral:AX.green, ...AXS, flexShrink:0}}>{dir==='out'?'→ Jake':'→ You'}</span>
  </div>
);
const AX_TXDoubleCheck = ({kind='buy'}) => (
  <AX_Phone><AX_SB/>
    <TXChatHeader name="Jake Morrison" av="J" color={AX.coral} online/>
    <div style={{flex:1, background:'rgba(14,13,12,0.32)', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 22px'}}>
      <div style={{width:'100%', background:AX.bg, borderRadius:22, boxShadow:'0 10px 40px rgba(26,18,16,0.25)', overflow:'hidden'}}>
        <div style={{padding:'22px 18px 16px', textAlign:'center', borderBottom:`1px solid ${AX.border}`}}>
          <div style={{fontSize:34, marginBottom:8}}>🤝</div>
          <div style={{fontSize:17, fontWeight:800, color:AX.text, ...AXS}}>Confirm {kind==='buy'?'transfer':'trade'}?</div>
          <div style={{fontSize:11.5, color:AX.ter, marginTop:5, lineHeight:1.55, textWrap:'pretty'}}>{kind==='buy'?'These cards move to Jake\'s portfolio automatically — no manual re-adding needed.':'Cards swap between portfolios automatically once you both confirm.'}</div>
        </div>
        {kind==='buy' ? (
          <React.Fragment>
            <TXTransferLine name="LeBron James — '03 Chrome RC" sub="PSA 10 · $10,500" dir="out"/>
            <TXTransferLine name="Kobe Bryant — '96 Chrome RC" sub="PSA 8 · $1,000" dir="out"/>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 18px', background:AX.surface}}>
              <span style={{fontSize:11.5, fontWeight:700, color:AX.sec}}>You receive</span>
              <span style={{fontSize:15, fontWeight:800, color:AX.green, ...AXS}}>$11,500</span>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <TXTransferLine name="LeBron James — '03 Chrome RC" sub="PSA 10" dir="out"/>
            <TXTransferLine name="Stephen Curry — '09 Chrome RC" sub="PSA 9" dir="in"/>
            <TXTransferLine name="Ja Morant — '19 Prizm RC" sub="PSA 10" dir="in"/>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 18px', background:AX.surface}}>
              <span style={{fontSize:11.5, fontWeight:700, color:AX.sec}}>+ Cash to you</span>
              <span style={{fontSize:15, fontWeight:800, color:AX.green, ...AXS}}>$500</span>
            </div>
          </React.Fragment>
        )}
        <div style={{padding:'16px 18px 18px'}}>
          <div style={{padding:'13px 0', borderRadius:999, background:AX.green, textAlign:'center', color:'#fff', fontSize:14, fontWeight:700, ...AXS, marginBottom:10, boxShadow:`0 4px 14px ${AX.green}33`}}>Confirm &amp; transfer</div>
          <div style={{padding:'8px 0', textAlign:'center', fontSize:13, color:AX.ter, fontWeight:600, ...AXS}}>Cancel</div>
        </div>
      </div>
    </div>
  </AX_Phone>
);

// 7 — Transfer complete (both sides see success)
const AX_TXComplete = ({kind='buy'}) => (
  <AX_Phone><AX_SB/>
    <TXChatHeader name="Jake Morrison" av="J" color={AX.coral} online/>
    <TXPinnedCard state="done"/>
    <div style={{flex:1, overflow:'hidden', padding:'12px 14px 4px', display:'flex', flexDirection:'column'}}>
      <div style={{textAlign:'center', fontSize:10, color:AX.ter, margin:'0 0 12px'}}>TODAY</div>
      <Bubble time="10:07 AM">{kind==='buy'?'Deal! Confirming now 👍':'Trade confirmed on my end 🔄'}</Bubble>
      <Bubble me time="10:09 AM">Just got it — finalizing now!</Bubble>
      <div style={{margin:'12px 4px', padding:'14px 16px', borderRadius:14, background:AX.greenM, border:`1px solid ${AX.green}`, textAlign:'center'}}>
        <div style={{fontSize:26, marginBottom:6}}>✅</div>
        <div style={{fontSize:14, fontWeight:800, color:AX.green, ...AXS}}>{kind==='buy'?'Transfer complete!':'Trade complete!'}</div>
        <div style={{fontSize:11, color:AX.sec, marginTop:4, lineHeight:1.5}}>{kind==='buy'?'2 cards added to Jake\'s portfolio · $11,500 received':'Curry + Morant added to your portfolio · LeBron sent to Jake · +$500'}</div>
      </div>
      <Bubble me time="10:13 AM">{kind==='buy'?'Cards are yours! See you at the meetup 🤝':'Pleasure trading — enjoy the LeBron! 🤝'}</Bubble>
    </div>
    <TXInput/>
  </AX_Phone>
);

// ── COUNTER OFFER (seller proposes a new price/terms; buyer reviews) ──
const TXCounterSheet = ({kind, side}) => {
  // side: 'seller' = composing counter; 'buyer' = receiving the counter
  const composing = side==='seller';
  return (
  <AX_Phone><AX_SB/>
    <TXChatHeader name={composing?'Jake Morrison':'Marcus Chen'} av={composing?'J':'M'} color={AX.coral} online/>
    <TXPinnedCard state="review"/>
    <TXSheet>
      <div style={{padding:'10px 18px 8px'}}>
        <div style={{fontSize:16, fontWeight:800, color:AX.text, ...AXS}}>{composing?`Counter Jake's ${kind==='buy'?'offer':'trade'}`:`Marcus countered`}</div>
        <div style={{fontSize:11, color:AX.ter, marginTop:2}}>{composing?'Propose new terms — Jake can accept or counter back':'Review the new terms and respond'}</div>
      </div>
      {kind==='buy' ? (
        <React.Fragment>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 18px', borderTop:`1px solid ${AX.border}`, borderBottom:`1px solid ${AX.border}`}}>
            <div><div style={{fontSize:11, color:AX.ter}}>Their offer</div><div style={{fontSize:14, fontWeight:700, color:AX.sec, ...AXS, textDecoration:'line-through'}}>$11,500</div></div>
            <span style={{fontSize:18, color:AX.ter}}>→</span>
            <div style={{textAlign:'right'}}><div style={{fontSize:11, color:AX.coral, fontWeight:700}}>{composing?'Your counter':'Counter price'}</div><div style={{fontSize:18, fontWeight:800, color:AX.coral, ...AXS}}>$12,000</div></div>
          </div>
          {composing && (
            <div style={{display:'flex', alignItems:'center', height:48, margin:'12px 18px 0', padding:'0 16px', borderRadius:12, background:AX.card, border:`1.5px solid ${AX.coral}`, gap:6}}>
              <span style={{fontSize:16, fontWeight:800, color:AX.coral, ...AXS}}>$</span>
              <span style={{fontSize:20, fontWeight:800, color:AX.text, ...AXS}}>12,000</span>
              <span style={{marginLeft:'auto', fontSize:10, color:AX.ter}}>for 2 cards</span>
            </div>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div style={{fontSize:10.5, fontWeight:800, color:AX.ter, textTransform:'uppercase', letterSpacing:'0.4px', ...AXS, padding:'8px 18px 4px', borderTop:`1px solid ${AX.border}`}}>Adjusted terms</div>
          <TXReviewRow name="LeBron James — '03 Chrome RC" sub="PSA 10 · you give" val="–" valColor={AX.ter}/>
          <TXReviewRow name="Stephen Curry — '09 Chrome RC" sub="PSA 9 · you receive" val="+" valColor={AX.green}/>
          <TXReviewRow name="Ja Morant — '19 Prizm RC" sub="PSA 10 · you receive" val="+" valColor={AX.green}/>
          <div style={{display:'flex', alignItems:'center', gap:8, padding:'11px 18px', background:AX.surface}}>
            <span style={{fontSize:11, color:AX.sec}}>{composing?'Ask for cash:':'They ask for cash:'}</span>
            <div style={{display:'flex', alignItems:'center', height:32, padding:'0 12px', borderRadius:999, background:AX.card, border:`1.5px solid ${AX.coral}`, gap:3}}>
              <span style={{fontSize:12, fontWeight:700, color:AX.coral}}>$</span><span style={{fontSize:14, fontWeight:800, color:AX.text, ...AXS}}>900</span>
            </div>
            <span style={{marginLeft:'auto', fontSize:10, color:AX.ter}}>was $500</span>
          </div>
        </React.Fragment>
      )}
      <div style={{padding:'14px 18px 20px', display:'flex', flexDirection:'column', gap:9}}>
        {composing ? (
          <div style={{padding:'13px 0', borderRadius:999, background:AX.coral, textAlign:'center', color:'#fff', fontSize:14, fontWeight:700, ...AXS, boxShadow:`0 4px 14px ${AX.coral}33`}}>Send counter →</div>
        ) : (
          <React.Fragment>
            <div style={{padding:'13px 0', borderRadius:999, background:AX.green, textAlign:'center', color:'#fff', fontSize:14, fontWeight:700, ...AXS, boxShadow:`0 4px 14px ${AX.green}33`}}>Accept counter</div>
            <div style={{display:'flex', gap:9}}>
              <div style={{flex:1, padding:'10px 0', borderRadius:999, border:`1.5px solid ${AX.border}`, textAlign:'center', fontSize:12.5, fontWeight:700, color:AX.sec, ...AXS}}>Counter back</div>
              <div style={{flex:1, padding:'10px 0', borderRadius:999, border:`1.5px solid ${AX.red}`, textAlign:'center', fontSize:12.5, fontWeight:700, color:AX.red, ...AXS}}>Decline</div>
            </div>
          </React.Fragment>
        )}
      </div>
    </TXSheet>
  </AX_Phone>
  );
};
const AX_TXCounterSellerBuy   = () => <TXCounterSheet kind="buy"   side="seller"/>;
const AX_TXCounterSellerTrade = () => <TXCounterSheet kind="trade" side="seller"/>;
const AX_TXCounterBuyerBuy    = () => <TXCounterSheet kind="buy"   side="buyer"/>;
const AX_TXCounterBuyerTrade  = () => <TXCounterSheet kind="trade" side="buyer"/>;

// ── DENY OFFER (seller declines; buyer sees it declined) ──
const TXDenyScreen = ({kind, side}) => {
  const isSeller = side==='seller';
  const what = kind==='buy' ? 'offer' : 'trade';
  return (
  <AX_Phone><AX_SB/>
    <TXChatHeader name={isSeller?'Jake Morrison':'Marcus Chen'} av={isSeller?'J':'M'} color={AX.coral} online/>
    <TXPinnedCard state="active" noBtn/>
    <div style={{flex:1, overflow:'hidden', padding:'12px 14px 4px', display:'flex', flexDirection:'column'}}>
      <div style={{textAlign:'center', fontSize:10, color:AX.ter, margin:'0 0 12px'}}>TODAY</div>
      {kind==='buy'
        ? <Bubble time="10:07 AM">{isSeller?'Sent an offer — 2 cards for $11.5k 👍':'Would you do $11.5k for the LeBron + Kobe?'}</Bubble>
        : <Bubble time="10:07 AM">{isSeller?'Sent a trade — Curry + Morant + $500 🔄':'Trade you Curry + Morant + $500 for the LeBron?'}</Bubble>}
      <div style={{margin:'12px 4px', padding:'16px', borderRadius:14, background:'rgba(220,38,38,0.06)', border:`1px solid ${AX.red}`, textAlign:'center'}}>
        <div style={{fontSize:26, marginBottom:6}}>🚫</div>
        <div style={{fontSize:14, fontWeight:800, color:AX.red, ...AXS}}>{isSeller?`You declined this ${what}`:`${'Offer'} declined`}</div>
        <div style={{fontSize:11, color:AX.sec, marginTop:4, lineHeight:1.5, textWrap:'pretty'}}>{isSeller?`Jake has been notified. The listing stays live for other buyers.`:`Marcus declined your ${what}. The card is still listed — you can send a new ${what}.`}</div>
      </div>
      {isSeller
        ? <Bubble me time="10:08 AM">Appreciate it, but I'll pass for now 🙏</Bubble>
        : <Bubble time="10:08 AM">Appreciate it, but I'll pass for now 🙏</Bubble>}
      {!isSeller && <div style={{alignSelf:'center', marginTop:6, padding:'10px 20px', borderRadius:999, background:AX.coral, color:'#fff', fontSize:13, fontWeight:700, ...AXS}}>Send a new {what}</div>}
    </div>
    <TXInput/>
  </AX_Phone>
  );
};
const AX_TXDenySellerBuy   = () => <TXDenyScreen kind="buy"   side="seller"/>;
const AX_TXDenySellerTrade = () => <TXDenyScreen kind="trade" side="seller"/>;
const AX_TXDenyBuyerBuy    = () => <TXDenyScreen kind="buy"   side="buyer"/>;
const AX_TXDenyBuyerTrade  = () => <TXDenyScreen kind="trade" side="buyer"/>;

Object.assign(window, { AX_Settings, AX_Notifications, AX_Messages, AX_Chat, AX_NewMessage, AX_ChatPlain, AX_GroupChat, AX_ChatMore, AX_TXBuyerChat, AX_TXBuyerSheet, AX_TXBuyerPending, AX_TXSellerChat, AX_TXSellerReview, AX_TXDoubleCheck, AX_TXComplete, AX_TXCounterSellerBuy, AX_TXCounterSellerTrade, AX_TXCounterBuyerBuy, AX_TXCounterBuyerTrade, AX_TXDenySellerBuy, AX_TXDenySellerTrade, AX_TXDenyBuyerBuy, AX_TXDenyBuyerTrade });

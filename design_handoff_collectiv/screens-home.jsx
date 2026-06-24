// screens-home.jsx — Collectiv · Home Feed · Direction 2
// Twitter-style activity stream: composer on top, then feed mixing automated
// system posts (listed / showcased / sold / event / group) + manual user posts.

// ── Tokens ────────────────────────────────────────────────────────────────────
const HM = {
  bg:'#fef9f5', surface:'#fef0e8', card:'#ffffff',
  text:'#1a1210', sec:'#6b5c52', ter:'#aa9a90', border:'#f0ddd0',
  coral:'#E76F51', coralM:'rgba(231,111,81,0.10)',
  purple:'#7C3AED', purpleM:'rgba(124,58,237,0.10)',
  green:'#10B981', greenM:'rgba(16,185,129,0.12)',
  amber:'#f59e0b', amberM:'rgba(245,158,11,0.12)', blue:'#2563eb',
  shadow:'0 2px 8px rgba(26,18,16,0.06),0 1px 2px rgba(26,18,16,0.04)',
  tabI:'rgba(26,18,16,0.28)',
};
const HMS = {fontFamily:"'Sora',sans-serif"};
const HMD = {fontFamily:"'DM Sans',sans-serif"};

// ── Primitives ────────────────────────────────────────────────────────────────
const HM_Phone = ({children, h=780}) => (
  <div style={{width:390, height:h, background:HM.bg, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative', ...HMD}}>{children}</div>
);
const HM_SB = () => (
  <div style={{height:44, display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'0 20px 8px', flexShrink:0, position:'relative'}}>
    <span style={{fontSize:13, fontWeight:600, color:HM.text, ...HMS}}>9:41</span>
    <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:110, height:26, background:'#000', borderRadius:'0 0 14px 14px'}}/>
    <div style={{display:'flex', gap:5, alignItems:'center', opacity:0.65}}>
      <span style={{fontSize:10, color:HM.text}}>▲▲▲</span>
      <div style={{width:22, height:11, borderRadius:2.5, border:`1.5px solid ${HM.text}`, position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', left:2, top:2, bottom:2, width:'70%', background:HM.text, borderRadius:1}}/>
      </div>
    </div>
  </div>
);
const HM_TB = () => {
  const tabs = [
    {id:'home',label:'Home',icon:'⌂'},{id:'portfolio',label:'Portfolio',icon:'◫'},
    {id:'market',label:'Market',icon:'◈'},{id:'social',label:'Social',icon:'◎'},{id:'map',label:'Map',icon:'⊕'},
  ];
  return (
    <div style={{height:56, display:'flex', borderTop:`1px solid ${HM.border}`, background:HM.bg, flexShrink:0}}>
      {tabs.map(t => {
        const on = t.id === 'home';
        return (
          <div key={t.id} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, color:on?HM.coral:HM.tabI, position:'relative'}}>
            {on && <div style={{position:'absolute', top:0, width:28, height:3, borderRadius:'0 0 3px 3px', background:HM.coral}}/>}
            <span style={{fontSize:17, lineHeight:1}}>{t.icon}</span>
            <span style={{fontSize:9, fontWeight:on?700:500, ...HMS, lineHeight:1}}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
};
const HM_Dim = () => <div style={{position:'absolute', inset:0, background:'rgba(14,13,12,0.55)', zIndex:10}}/>;
const HM_Sheet = ({height, children}) => (
  <div style={{position:'absolute', bottom:0, left:0, right:0, height, background:HM.bg, borderRadius:'24px 24px 0 0', zIndex:20, display:'flex', flexDirection:'column', boxShadow:'0 -12px 40px rgba(26,18,16,0.16)'}}>
    <div style={{width:36, height:4, borderRadius:2, background:HM.ter, margin:'12px auto 4px'}}/>
    {children}
  </div>
);

const AV = (l, c) => (
  <div style={{width:40, height:40, borderRadius:'50%', background:c, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:15, fontWeight:700, ...HMS, flexShrink:0}}>{l}</div>
);
const cardThumb = (a, w, h, r=7) => (
  <div style={{width:w, height:h, borderRadius:r, background:`linear-gradient(145deg, ${HM.surface}, ${a})`, position:'relative', overflow:'hidden', flexShrink:0}}>
    <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 55%)'}}/>
  </div>
);

// ── Header ────────────────────────────────────────────────────────────────────
const HM_Header = () => (
  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'2px 20px 12px', flexShrink:0}}>
    <div style={{fontSize:25, fontWeight:800, color:HM.text, ...HMS, letterSpacing:'-0.5px'}}>Collectiv</div>
    <div style={{display:'flex', gap:8}}>
      <div style={{width:36, height:36, borderRadius:'50%', background:HM.surface, border:`1px solid ${HM.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, position:'relative'}}>
        🔔
        <div style={{position:'absolute', top:1, right:1, width:8, height:8, borderRadius:'50%', background:HM.coral, border:`1.5px solid ${HM.bg}`}}/>
      </div>
      <div style={{width:36, height:36, borderRadius:'50%', background:HM.surface, border:`1px solid ${HM.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16}}>✉</div>
    </div>
  </div>
);

// ── Composer (top of feed) ────────────────────────────────────────────────────
const HM_Composer = () => (
  <div style={{padding:'0 16px 12px', flexShrink:0}}>
    <div style={{display:'flex', gap:11, alignItems:'center', padding:'12px 14px', borderRadius:16, background:HM.card, boxShadow:HM.shadow}}>
      {AV('J', HM.coral)}
      <div style={{flex:1, fontSize:13.5, color:HM.ter}}>Share a pickup or post an update…</div>
    </div>
    <div style={{display:'flex', gap:7, marginTop:8}}>
      {[['🃏','Showcase'],['🖼','Photo'],['◍','GIF'],['📊','Poll']].map(([i,l]) => (
        <div key={l} style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:5, padding:'7px 0', borderRadius:999, background:HM.surface, border:`1px solid ${HM.border}`}}>
          <span style={{fontSize:12.5}}>{i}</span>
          <span style={{fontSize:10.5, fontWeight:700, color:HM.sec, ...HMS}}>{l}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Post engagement bar ───────────────────────────────────────────────────────
const HM_Actions = ({likes, comments, liked}) => (
  <div style={{display:'flex', alignItems:'center', gap:22, marginTop:11}}>
    <div style={{display:'flex', alignItems:'center', gap:6, color:liked?HM.coral:HM.ter}}>
      <span style={{fontSize:15}}>{liked?'♥':'♡'}</span><span style={{fontSize:11.5, fontWeight:600}}>{likes}</span>
    </div>
    <div style={{display:'flex', alignItems:'center', gap:6, color:HM.ter}}>
      <span style={{fontSize:14}}>💬</span><span style={{fontSize:11.5, fontWeight:600}}>{comments}</span>
    </div>
    <div style={{display:'flex', alignItems:'center', gap:6, color:HM.ter}}>
      <span style={{fontSize:14}}>↗</span><span style={{fontSize:11.5, fontWeight:600}}>Share</span>
    </div>
  </div>
);

// Post shell
const HM_Post = ({children}) => (
  <div style={{padding:'14px 16px', borderBottom:`1px solid ${HM.border}`, background:HM.bg}}>{children}</div>
);
// Author line
const HM_Author = ({l, c, name, handle, time, badge, badgeColor}) => (
  <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:10}}>
    {AV(l, c)}
    <div style={{flex:1, minWidth:0}}>
      <div style={{display:'flex', alignItems:'center', gap:6}}>
        <span style={{fontSize:13.5, fontWeight:700, color:HM.text, ...HMS}}>{name}</span>
        {badge && <span style={{padding:'1.5px 7px', borderRadius:999, background:`${badgeColor}1a`, color:badgeColor, fontSize:8.5, fontWeight:800, letterSpacing:'0.3px', ...HMS}}>{badge}</span>}
      </div>
      <div style={{fontSize:10.5, color:HM.ter, marginTop:1}}>@{handle} · {time}</div>
    </div>
    <span style={{fontSize:16, color:HM.ter, letterSpacing:1}}>···</span>
  </div>
);

// ── AUTOMATED: card listed on market ──────────────────────────────────────────
const HM_PostListed = () => (
  <HM_Post>
    <HM_Author l="M" c={HM.blue} name="Marcus Chen" handle="mchen_cards" time="12m" badge="LISTED" badgeColor={HM.coral}/>
    <div style={{fontSize:13, color:HM.text, lineHeight:1.5, marginBottom:11}}>Just listed this beauty on the marketplace 👀 Comps are climbing — won't last long.</div>
    {/* Listing preview card */}
    <div style={{display:'flex', gap:12, padding:'11px 12px', borderRadius:14, background:HM.card, border:`1px solid ${HM.border}`, boxShadow:HM.shadow}}>
      {cardThumb(HM.coral, 60, 84)}
      <div style={{flex:1, minWidth:0, display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <div style={{fontSize:13, fontWeight:700, color:HM.text, ...HMS}}>LeBron James — '03-04 RC</div>
        <div style={{fontSize:10, color:HM.ter, marginTop:1}}>Topps Chrome · PSA 10</div>
        <div style={{display:'flex', alignItems:'center', gap:8, marginTop:7}}>
          <span style={{fontSize:18, fontWeight:800, color:HM.coral, ...HMS}}>$12,500</span>
          <span style={{fontSize:9.5, color:HM.ter}}>· 2.4 km away</span>
        </div>
      </div>
      <div style={{alignSelf:'center', padding:'8px 14px', borderRadius:999, background:HM.coral, color:'#fff', fontSize:11.5, fontWeight:700, ...HMS, flexShrink:0}}>View</div>
    </div>
    <HM_Actions likes={34} comments={8} liked/>
  </HM_Post>
);

// ── MANUAL: user text + photo post ────────────────────────────────────────────
const HM_PostUser = () => (
  <HM_Post>
    <HM_Author l="A" c={HM.purple} name="Ava Rodriguez" handle="avapulls" time="38m"/>
    <div style={{fontSize:13.5, color:HM.text, lineHeight:1.55, marginBottom:11}}>Mail day! 📬 Finally pulled the trigger on this Mahomes after months of watching. The corners are insane in person. What do we think — hold or flip?</div>
    {/* Two-photo grid */}
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, borderRadius:14, overflow:'hidden'}}>
      <div style={{height:150, background:`linear-gradient(145deg, ${HM.surface}, ${HM.green})`, position:'relative'}}>
        <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 55%)'}}/>
      </div>
      <div style={{height:150, background:`linear-gradient(145deg, ${HM.surface}, ${HM.amber})`, position:'relative'}}>
        <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 55%)'}}/>
      </div>
    </div>
    <HM_Actions likes={127} comments={23} liked/>
  </HM_Post>
);

// ── AUTOMATED: card showcased ─────────────────────────────────────────────────
const HM_PostShowcase = () => (
  <HM_Post>
    <HM_Author l="J" c={HM.amber} name="Jordan Blake" handle="jblake_psa" time="1h" badge="SHOWCASED" badgeColor={HM.purple}/>
    <div style={{fontSize:13, color:HM.text, lineHeight:1.5, marginBottom:11}}>Added a new grail to my showcase ⭐ The '86 Fleer Jordan rookie. Not for sale — just had to share.</div>
    <div style={{borderRadius:16, overflow:'hidden', position:'relative', height:200, background:`linear-gradient(150deg, #1a1210 0%, ${HM.purple} 150%)`}}>
      <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
        {cardThumb('rgba(255,255,255,0.14)', 116, 162, 9)}
      </div>
      <div style={{position:'absolute', top:12, left:12, padding:'3px 10px', borderRadius:999, background:'rgba(124,58,237,0.85)', color:'#fff', fontSize:9, fontWeight:800, letterSpacing:'0.4px', ...HMS}}>⭐ SHOWCASE</div>
      <div style={{position:'absolute', bottom:12, left:12, right:12}}>
        <div style={{fontSize:14, fontWeight:800, color:'#fff', ...HMS}}>Michael Jordan — '86 Fleer RC</div>
        <div style={{fontSize:10, color:'rgba(255,255,255,0.7)', marginTop:1}}>PSA 9 · Crown jewel of the collection</div>
      </div>
    </div>
    <HM_Actions likes={418} comments={56}/>
  </HM_Post>
);

// ── AUTOMATED: transaction completed ──────────────────────────────────────────
const HM_PostSold = () => (
  <HM_Post>
    <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:11, padding:'8px 12px', borderRadius:999, background:HM.greenM, alignSelf:'flex-start', width:'fit-content'}}>
      <span style={{fontSize:13}}>🤝</span>
      <span style={{fontSize:11, fontWeight:700, color:HM.green, ...HMS}}>Deal closed on Collectiv</span>
    </div>
    <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:11}}>
      <div style={{display:'flex'}}>
        {AV('P', HM.coral)}
        <div style={{marginLeft:-12}}>{AV('S', HM.blue)}</div>
      </div>
      <div style={{fontSize:12.5, color:HM.text, lineHeight:1.45}}>
        <span style={{fontWeight:700, ...HMS}}>@pacific_cards</span> sold to <span style={{fontWeight:700, ...HMS}}>@sam_collects</span>
      </div>
    </div>
    <div style={{display:'flex', gap:12, padding:'11px 12px', borderRadius:14, background:HM.card, border:`1px solid ${HM.border}`}}>
      {cardThumb(HM.blue, 50, 70)}
      <div style={{flex:1, minWidth:0, display:'flex', flexDirection:'column', justifyContent:'center'}}>
        <div style={{fontSize:12.5, fontWeight:700, color:HM.text, ...HMS}}>Shohei Ohtani — 2018 RC</div>
        <div style={{fontSize:10, color:HM.ter, marginTop:1}}>Topps Update · PSA 10</div>
      </div>
      <div style={{alignSelf:'center', textAlign:'right'}}>
        <div style={{fontSize:9, color:HM.ter, fontWeight:600}}>SOLD FOR</div>
        <div style={{fontSize:16, fontWeight:800, color:HM.green, ...HMS}}>$890</div>
      </div>
    </div>
    <HM_Actions likes={51} comments={4}/>
  </HM_Post>
);

// ── AUTOMATED: event shared ───────────────────────────────────────────────────
const HM_PostEvent = () => (
  <HM_Post>
    <HM_Author l="E" c={HM.purple} name="Edmonton Card Collectors" handle="yeg_collectors" time="2h" badge="EVENT" badgeColor={HM.blue}/>
    <div style={{fontSize:13, color:HM.text, lineHeight:1.5, marginBottom:11}}>We're hosting again! 🎟 Tables are filling fast — grab yours before they're gone.</div>
    <div style={{display:'flex', gap:12, padding:'12px', borderRadius:14, background:HM.card, border:`1px solid ${HM.border}`, boxShadow:HM.shadow}}>
      <div style={{width:48, borderRadius:10, overflow:'hidden', border:`1px solid ${HM.border}`, textAlign:'center', flexShrink:0, alignSelf:'flex-start'}}>
        <div style={{background:HM.purple, color:'#fff', fontSize:8.5, fontWeight:800, padding:'3px 0', ...HMS}}>JUN</div>
        <div style={{fontSize:19, fontWeight:800, color:HM.text, padding:'3px 0', ...HMS}}>14</div>
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:13.5, fontWeight:700, color:HM.text, ...HMS, lineHeight:1.2}}>Edmonton Card Show 2026</div>
        <div style={{fontSize:10.5, color:HM.sec, marginTop:3}}>📍 Edmonton EXPO Centre</div>
        <div style={{fontSize:10.5, color:HM.ter, marginTop:2}}>👥 142 going · 38 interested</div>
      </div>
      <div style={{alignSelf:'center', padding:'8px 13px', borderRadius:999, background:HM.purpleM, border:`1px solid ${HM.purple}`, color:HM.purple, fontSize:11, fontWeight:700, ...HMS, flexShrink:0}}>★ Going</div>
    </div>
    <HM_Actions likes={89} comments={12}/>
  </HM_Post>
);

// ── AUTOMATED: group joined / activity ────────────────────────────────────────
const HM_PostGroup = () => (
  <HM_Post>
    <div style={{display:'flex', alignItems:'center', gap:9}}>
      <div style={{width:44, height:44, borderRadius:13, background:`linear-gradient(145deg, ${HM.coral}, ${HM.coral}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0}}>💎</div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:12.5, color:HM.text, lineHeight:1.45}}>
          <span style={{fontWeight:700, ...HMS}}>3 people you follow</span> joined <span style={{fontWeight:700, ...HMS}}>PSA 10 Hunters</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:6, marginTop:5}}>
          <div style={{display:'flex'}}>
            {['#E76F51','#7C3AED','#10B981'].map((c,i) => (
              <div key={i} style={{width:18, height:18, borderRadius:'50%', background:c, border:`2px solid ${HM.bg}`, marginLeft:i>0?-6:0}}/>
            ))}
          </div>
          <span style={{fontSize:10, color:HM.ter}}>8,120 members</span>
        </div>
      </div>
      <div style={{padding:'7px 15px', borderRadius:999, background:HM.coral, color:'#fff', fontSize:11, fontWeight:700, ...HMS, flexShrink:0}}>Join</div>
    </div>
  </HM_Post>
);

// ── HOME FEED ─────────────────────────────────────────────────────────────────
const HM_Home = () => (
  <HM_Phone>
    <HM_SB/>
    <HM_Header/>
    <div style={{flex:1, overflow:'hidden'}}>
      <HM_Composer/>
      <div style={{height:8, background:HM.surface, borderTop:`1px solid ${HM.border}`, borderBottom:`1px solid ${HM.border}`}}/>
      <HM_PostListed/>
      <HM_PostUser/>
      <HM_PostShowcase/>
      <HM_PostSold/>
      <HM_PostEvent/>
      <HM_PostGroup/>
    </div>
    <HM_TB/>
  </HM_Phone>
);

// ── COMPOSER (expanded sheet) ─────────────────────────────────────────────────
const HM_ComposerOpen = () => (
  <HM_Phone>
    <HM_SB/>
    <HM_Header/>
    <div style={{flex:1, opacity:0.3, overflow:'hidden'}}><HM_Composer/></div>
    <HM_Dim/>
    <HM_Sheet height={500}>
      <div style={{display:'flex', flexDirection:'column', flex:1, overflow:'hidden'}}>
        {/* Nav */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 16px 12px', borderBottom:`1px solid ${HM.border}`}}>
          <span style={{fontSize:13, fontWeight:600, color:HM.sec, ...HMS}}>Cancel</span>
          <span style={{fontSize:14, fontWeight:800, color:HM.text, ...HMS}}>New Post</span>
          <div style={{padding:'7px 16px', borderRadius:999, background:HM.coral, color:'#fff', fontSize:12.5, fontWeight:700, ...HMS}}>Post</div>
        </div>
        {/* Body */}
        <div style={{flex:1, padding:'14px 16px', display:'flex', gap:11, overflow:'hidden'}}>
          {AV('J', HM.coral)}
          <div style={{flex:1}}>
            <div style={{fontSize:15, color:HM.text, lineHeight:1.5}}>Mail day! Finally landed this Curry rookie<span style={{display:'inline-block', width:1.5, height:17, background:HM.coral, verticalAlign:'middle', marginLeft:2}}/></div>
            <div style={{display:'flex', gap:8, marginTop:14}}>
              {cardThumb(HM.coral, 78, 104, 10)}
              <div style={{width:78, height:104, borderRadius:10, border:`1.5px dashed ${HM.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color:HM.ter}}>+</div>
            </div>
          </div>
        </div>
        {/* Attach toolbar */}
        <div style={{display:'flex', alignItems:'center', gap:18, padding:'12px 18px 22px', borderTop:`1px solid ${HM.border}`}}>
          {['🖼','🃏','◍','📊','📍'].map((i,idx) => <span key={idx} style={{fontSize:19, color:HM.coral}}>{i}</span>)}
          <span style={{marginLeft:'auto', fontSize:11, color:HM.ter}}>Showcasing 1 card</span>
        </div>
      </div>
    </HM_Sheet>
  </HM_Phone>
);

// ── NAV BAR (full-screen secondary pages) ─────────────────────────────────────
const HM_Nav = ({title, sub, right}) => (
  <div style={{display:'flex', alignItems:'center', gap:10, padding:'2px 14px 11px', flexShrink:0, borderBottom:`1px solid ${HM.border}`}}>
    <div style={{fontSize:22, color:HM.text, width:24}}>‹</div>
    <div style={{flex:1, textAlign:'center'}}>
      <div style={{fontSize:15, fontWeight:800, color:HM.text, ...HMS}}>{title}</div>
      {sub && <div style={{fontSize:10.5, color:HM.ter, marginTop:1}}>{sub}</div>}
    </div>
    <div style={{width:24, display:'flex', justifyContent:'flex-end'}}>{right || null}</div>
  </div>
);
const HM_PersonRow = ({l, c, name, handle, state}) => (
  <div style={{display:'flex', alignItems:'center', gap:12, padding:'10px 16px'}}>
    {AV(l, c)}
    <div style={{flex:1, minWidth:0}}>
      <div style={{fontSize:13.5, fontWeight:700, color:HM.text, ...HMS}}>{name}</div>
      <div style={{fontSize:11, color:HM.ter, marginTop:1}}>@{handle}</div>
    </div>
    <div style={{padding:'7px 16px', borderRadius:999, ...(state==='following'
      ? {background:HM.surface, border:`1px solid ${HM.border}`, color:HM.sec}
      : state==='you' ? {background:'transparent', color:HM.ter}
      : {background:HM.coral, color:'#fff'}), fontSize:11.5, fontWeight:700, ...HMS}}>
      {state==='following'?'Following':state==='you'?'You':'Follow'}
    </div>
  </div>
);

// ── LIKES LIST (tap the heart / “34”) ─────────────────────────────────────────
const HM_LIKERS = [
  ['A','Ava Rodriguez','avapulls',HM.purple,'follow'],
  ['D','Diego Santos','dsantos_rc',HM.green,'following'],
  ['K','Kayla Brooks','kaylapulls',HM.coral,'follow'],
  ['S','Sam Collects','sam_collects',HM.blue,'following'],
  ['P','Pacific Cards','pacific_cards',HM.amber,'follow'],
  ['J','Jordan Blake','jblake_psa',HM.coral,'follow'],
  ['T','Tyler Nguyen','typulls',HM.purple,'following'],
  ['R','Riley Watson','rwatson','#0ea5b7','follow'],
];
const HM_Likes = () => (
  <HM_Phone>
    <HM_SB/>
    <HM_Nav title="Liked by" sub="34 people"/>
    <div style={{flex:1, overflow:'hidden'}}>
      {HM_LIKERS.map((p,i) => <HM_PersonRow key={i} l={p[0]} c={p[3]} name={p[1]} handle={p[2]} state={p[4]}/>)}
    </div>
    <HM_TB/>
  </HM_Phone>
);

// ── COMMENTS (tap the comment count) ──────────────────────────────────────────
const HM_Comment = ({l, c, name, time, text, likes, reply, indent}) => (
  <div style={{display:'flex', gap:10, padding:'11px 16px', paddingLeft:indent?52:16, borderBottom:`1px solid ${HM.border}`}}>
    <div style={{width:indent?28:34, height:indent?28:34, borderRadius:'50%', background:c, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:indent?11:13, fontWeight:700, ...HMS, flexShrink:0}}>{l}</div>
    <div style={{flex:1, minWidth:0}}>
      <div style={{display:'flex', alignItems:'center', gap:6}}>
        <span style={{fontSize:12.5, fontWeight:700, color:HM.text, ...HMS}}>{name}</span>
        <span style={{fontSize:10, color:HM.ter}}>{time}</span>
      </div>
      <div style={{fontSize:12.5, color:HM.text, lineHeight:1.5, marginTop:3}}>{text}</div>
      <div style={{display:'flex', alignItems:'center', gap:16, marginTop:6}}>
        <span style={{fontSize:10.5, fontWeight:600, color:HM.ter}}>Reply</span>
        {reply && <span style={{fontSize:10.5, fontWeight:600, color:HM.coral}}>View {reply} replies</span>}
      </div>
    </div>
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2, flexShrink:0}}>
      <span style={{fontSize:13, color:likes?HM.coral:HM.ter}}>{likes?'♥':'♡'}</span>
      {likes ? <span style={{fontSize:9.5, color:HM.ter}}>{likes}</span> : null}
    </div>
  </div>
);
const HM_Comments = () => (
  <HM_Phone>
    <HM_SB/>
    <HM_Nav title="Comments" sub="23 comments"/>
    <div style={{flex:1, overflow:'hidden'}}>
      {/* original post recap */}
      <div style={{padding:'12px 16px', borderBottom:`6px solid ${HM.surface}`}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          {AV('A', HM.purple)}
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:13, fontWeight:700, color:HM.text, ...HMS}}>Ava Rodriguez</div>
            <div style={{fontSize:10.5, color:HM.ter, marginTop:1}}>@avapulls · 38m</div>
          </div>
        </div>
        <div style={{fontSize:13, color:HM.text, lineHeight:1.5, marginTop:9}}>Mail day! 📬 Finally pulled the trigger on this Mahomes. What do we think — hold or flip?</div>
      </div>
      <HM_Comment l="D" c={HM.green} name="Diego Santos" time="24m" text="Absolute heater 🔥 hold it, comps are only going up." likes={12} reply={3}/>
      <HM_Comment l="T" c={HM.purple} name="Tyler Nguyen" time="19m" text="Flip it while it's hot imo. Demand peaks playoffs." likes={4}/>
      <HM_Comment l="K" c={HM.coral} name="Kayla Brooks" time="12m" text="Centering looks clean! Did you check the back?" indent/>
      <HM_Comment l="P" c={HM.amber} name="Pacific Cards" time="6m" text="DM me if you ever wanna move it 👀" likes={2}/>
    </div>
    {/* comment input */}
    <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderTop:`1px solid ${HM.border}`, flexShrink:0}}>
      <div style={{width:30, height:30, borderRadius:'50%', background:HM.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700, ...HMS}}>J</div>
      <div style={{flex:1, height:38, padding:'0 15px', borderRadius:999, background:HM.surface, border:`1px solid ${HM.border}`, display:'flex', alignItems:'center', fontSize:13, color:HM.ter}}>Add a comment…</div>
      <div style={{width:38, height:38, borderRadius:'50%', background:HM.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:15}}>➤</div>
    </div>
    <HM_TB/>
  </HM_Phone>
);

// ── SHARE SHEET (tap Share) ───────────────────────────────────────────────────
const HM_Share = () => (
  <HM_Phone>
    <HM_SB/><HM_Header/>
    <div style={{flex:1, opacity:0.3, overflow:'hidden'}}><HM_Composer/></div>
    <HM_Dim/>
    <HM_Sheet height={418}>
      <div style={{padding:'8px 18px 4px', fontSize:15, fontWeight:800, color:HM.text, ...HMS}}>Share post</div>
      {/* quick-send avatars */}
      <div style={{display:'flex', gap:14, overflowX:'hidden', padding:'12px 18px 16px', borderBottom:`1px solid ${HM.border}`}}>
        {[['A',HM.purple,'Ava'],['D',HM.green,'Diego'],['K',HM.coral,'Kayla'],['S',HM.blue,'Sam'],['T',HM.amber,'Tyler']].map(([l,c,n],i) => (
          <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:5, width:52, flexShrink:0}}>
            {AV(l,c)}
            <span style={{fontSize:10, color:HM.sec, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:52}}>{n}</span>
          </div>
        ))}
      </div>
      {/* action grid */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18, padding:'18px'}}>
        {[['🔗','Copy link'],['✦','Add to Story'],['↻','Repost'],['✉','Message'],['📷','Instagram'],['✕','X / Twitter'],['💬','WhatsApp'],['···','More']].map(([i,l],idx) => (
          <div key={idx} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:7}}>
            <div style={{width:50, height:50, borderRadius:'50%', background:HM.surface, border:`1px solid ${HM.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19}}>{i}</div>
            <span style={{fontSize:10, color:HM.sec, fontWeight:600, textAlign:'center', ...HMD}}>{l}</span>
          </div>
        ))}
      </div>
    </HM_Sheet>
  </HM_Phone>
);

// ── POST ··· MENU (tap top-right of a post) ───────────────────────────────────
const HM_PostMenu = () => {
  const items = [
    ['🔖','Save post','Add to your saved items',null],
    ['🚫','Not interested','See fewer posts like this',null],
    ['＋','Follow @mchen_cards','Get their posts in your feed',null],
    ['🔕','Mute @mchen_cards','Stop seeing their posts',null],
    ['🔗','Copy link',null,null],
    ['🚩','Report post','Flag for review',true],
    ['⛔','Block @mchen_cards',"They can't see or message you",true],
  ];
  return (
  <HM_Phone>
    <HM_SB/><HM_Header/>
    <div style={{flex:1, opacity:0.3, overflow:'hidden'}}><HM_Composer/></div>
    <HM_Dim/>
    <HM_Sheet height={476}>
      <div style={{display:'flex', alignItems:'center', gap:11, padding:'8px 18px 14px', borderBottom:`1px solid ${HM.border}`}}>
        {AV('M', HM.blue)}
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:13.5, fontWeight:700, color:HM.text, ...HMS}}>Marcus Chen</div>
          <div style={{fontSize:10.5, color:HM.ter, marginTop:1}}>@mchen_cards · 12m</div>
        </div>
      </div>
      {items.map(([i,l,s,danger],idx) => (
        <div key={idx} style={{display:'flex', alignItems:'center', gap:13, padding:'12px 18px', borderBottom:`1px solid ${HM.border}`, background:danger?'rgba(231,111,81,0.04)':'transparent'}}>
          <div style={{width:36, height:36, borderRadius:10, background:danger?'rgba(231,111,81,0.10)':HM.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0}}>{i}</div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:13, fontWeight:700, color:danger?HM.coral:HM.text, ...HMS}}>{l}</div>
            {s && <div style={{fontSize:10.5, color:HM.ter, marginTop:1}}>{s}</div>}
          </div>
        </div>
      ))}
    </HM_Sheet>
  </HM_Phone>
  );
};

// ── SHOWCASE COMPOSER (tap “Showcase”) ────────────────────────────────────────
const HM_GRADS = [HM.coral, HM.purple, HM.blue, HM.green, HM.amber, '#0ea5b7'];
const HM_Showcase = () => (
  <HM_Phone>
    <HM_SB/>
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 16px 12px', borderBottom:`1px solid ${HM.border}`, flexShrink:0}}>
      <span style={{fontSize:13, fontWeight:600, color:HM.sec, ...HMS}}>Cancel</span>
      <span style={{fontSize:14, fontWeight:800, color:HM.text, ...HMS}}>Showcase a Card</span>
      <div style={{padding:'7px 16px', borderRadius:999, background:HM.coral, color:'#fff', fontSize:12.5, fontWeight:700, ...HMS}}>Next</div>
    </div>
    <div style={{flex:1, overflow:'hidden', padding:'14px 16px'}}>
      <div style={{fontSize:12.5, fontWeight:700, color:HM.text, ...HMS, marginBottom:10}}>Pick from your collection</div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10}}>
        {HM_GRADS.concat(HM_GRADS.slice(0,3)).map((a,i) => (
          <div key={i} style={{position:'relative'}}>
            <div style={{width:'100%', aspectRatio:'5/7', borderRadius:10, background:`linear-gradient(145deg, ${HM.surface}, ${a})`, border:i===1?`2.5px solid ${HM.coral}`:`1px solid ${HM.border}`, position:'relative', overflow:'hidden'}}>
              <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 55%)'}}/>
            </div>
            {i===1 && <div style={{position:'absolute', top:6, right:6, width:20, height:20, borderRadius:'50%', background:HM.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:800}}>✓</div>}
          </div>
        ))}
      </div>
      <div style={{marginTop:16, padding:'12px 14px', borderRadius:14, background:HM.surface, border:`1px solid ${HM.border}`}}>
        <div style={{fontSize:11, fontWeight:700, color:HM.ter, ...HMS, marginBottom:6}}>CAPTION</div>
        <div style={{fontSize:13, color:HM.text}}>New grail added ⭐ Not for sale<span style={{display:'inline-block', width:1.5, height:15, background:HM.coral, verticalAlign:'middle', marginLeft:2}}/></div>
      </div>
    </div>
    <HM_TB/>
  </HM_Phone>
);

// ── PHOTO COMPOSER (tap “Photo”) ──────────────────────────────────────────────
const HM_Photo = () => (
  <HM_Phone>
    <HM_SB/>
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 16px 12px', borderBottom:`1px solid ${HM.border}`, flexShrink:0}}>
      <span style={{fontSize:13, fontWeight:600, color:HM.sec, ...HMS}}>Cancel</span>
      <span style={{fontSize:14, fontWeight:800, color:HM.text, ...HMS}}>New Post</span>
      <div style={{padding:'7px 16px', borderRadius:999, background:HM.coral, color:'#fff', fontSize:12.5, fontWeight:700, ...HMS}}>Post</div>
    </div>
    <div style={{flex:1, overflow:'hidden', display:'flex', flexDirection:'column'}}>
      <div style={{padding:'14px 16px', display:'flex', gap:11}}>
        {AV('J', HM.coral)}
        <div style={{flex:1}}>
          <div style={{fontSize:15, color:HM.text, lineHeight:1.5}}>Mail day haul 📬<span style={{display:'inline-block', width:1.5, height:17, background:HM.coral, verticalAlign:'middle', marginLeft:2}}/></div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginTop:12, borderRadius:12, overflow:'hidden'}}>
            <div style={{height:128, background:`linear-gradient(145deg, ${HM.surface}, ${HM.green})`, position:'relative'}}>
              <div style={{position:'absolute', top:6, right:6, width:20, height:20, borderRadius:'50%', background:'rgba(14,13,12,0.5)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11}}>✕</div>
            </div>
            <div style={{height:128, background:`linear-gradient(145deg, ${HM.surface}, ${HM.amber})`, position:'relative'}}>
              <div style={{position:'absolute', top:6, right:6, width:20, height:20, borderRadius:'50%', background:'rgba(14,13,12,0.5)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11}}>✕</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{marginTop:'auto'}}>
        {/* gallery strip */}
        <div style={{display:'flex', gap:6, padding:'10px 16px', overflowX:'hidden'}}>
          <div style={{width:64, height:64, borderRadius:10, background:HM.surface, border:`1px solid ${HM.border}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, flexShrink:0, color:HM.coral}}>
            <span style={{fontSize:18}}>📷</span><span style={{fontSize:8, fontWeight:700, ...HMS}}>Camera</span>
          </div>
          {HM_GRADS.map((a,i) => (
            <div key={i} style={{width:64, height:64, borderRadius:10, background:`linear-gradient(145deg, ${HM.surface}, ${a})`, flexShrink:0, position:'relative', border:i<2?`2px solid ${HM.coral}`:'none'}}>
              {i<2 && <div style={{position:'absolute', top:4, right:4, width:16, height:16, borderRadius:'50%', background:HM.coral, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800}}>{i+1}</div>}
            </div>
          ))}
        </div>
        <div style={{display:'flex', alignItems:'center', gap:18, padding:'10px 18px 18px', borderTop:`1px solid ${HM.border}`}}>
          {['🖼','🃏','◍','📊','📍'].map((i,idx) => <span key={idx} style={{fontSize:19, color:HM.coral}}>{i}</span>)}
          <span style={{marginLeft:'auto', fontSize:11, color:HM.ter}}>2 photos</span>
        </div>
      </div>
    </div>
  </HM_Phone>
);

// ── GIF PICKER (tap “GIF”) ────────────────────────────────────────────────────
const HM_Gif = () => (
  <HM_Phone>
    <HM_SB/><HM_Header/>
    <div style={{flex:1, opacity:0.3, overflow:'hidden'}}><HM_Composer/></div>
    <HM_Dim/>
    <HM_Sheet height={520}>
      <div style={{padding:'6px 16px 12px', borderBottom:`1px solid ${HM.border}`}}>
        <div style={{display:'flex', alignItems:'center', gap:9, height:40, padding:'0 14px', borderRadius:999, background:HM.surface, border:`1px solid ${HM.border}`}}>
          <span style={{fontSize:14, color:HM.ter}}>⌕</span>
          <span style={{flex:1, fontSize:13, color:HM.text}}>nice pull<span style={{display:'inline-block', width:1.5, height:14, background:HM.coral, verticalAlign:'middle', marginLeft:1}}/></span>
          <span style={{fontSize:10, fontWeight:700, color:HM.ter, ...HMS}}>GIF</span>
        </div>
        <div style={{display:'flex', gap:7, marginTop:10, overflowX:'hidden'}}>
          {['Trending','Nice','Wow','Money','Hype','LOL'].map((t,i) => (
            <div key={i} style={{padding:'5px 12px', borderRadius:999, background:i===0?HM.coral:HM.surface, color:i===0?'#fff':HM.sec, fontSize:11, fontWeight:700, ...HMS, border:i===0?'none':`1px solid ${HM.border}`, flexShrink:0}}>{t}</div>
          ))}
        </div>
      </div>
      <div style={{flex:1, overflow:'hidden', padding:'12px 16px'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
          {[[HM.purple,90],[HM.green,118],[HM.amber,118],[HM.blue,90],[HM.coral,104],['#0ea5b7',104]].map(([a,h],i) => (
            <div key={i} style={{height:h, borderRadius:10, background:`linear-gradient(145deg, ${HM.surface}, ${a})`, position:'relative', overflow:'hidden'}}>
              <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)'}}/>
              <div style={{position:'absolute', bottom:6, left:6, padding:'1.5px 6px', borderRadius:4, background:'rgba(14,13,12,0.55)', color:'#fff', fontSize:8, fontWeight:800, ...HMS}}>GIF</div>
            </div>
          ))}
        </div>
      </div>
    </HM_Sheet>
  </HM_Phone>
);

// ── POLL COMPOSER (tap “Poll”) ────────────────────────────────────────────────
const HM_Poll = () => (
  <HM_Phone>
    <HM_SB/>
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 16px 12px', borderBottom:`1px solid ${HM.border}`, flexShrink:0}}>
      <span style={{fontSize:13, fontWeight:600, color:HM.sec, ...HMS}}>Cancel</span>
      <span style={{fontSize:14, fontWeight:800, color:HM.text, ...HMS}}>Create Poll</span>
      <div style={{padding:'7px 16px', borderRadius:999, background:HM.coral, color:'#fff', fontSize:12.5, fontWeight:700, ...HMS}}>Post</div>
    </div>
    <div style={{flex:1, overflow:'hidden', padding:'14px 16px'}}>
      <div style={{display:'flex', gap:11, marginBottom:16}}>
        {AV('J', HM.coral)}
        <div style={{flex:1, fontSize:15, color:HM.text, lineHeight:1.4, paddingTop:8}}>Hold or flip this Mahomes?<span style={{display:'inline-block', width:1.5, height:16, background:HM.coral, verticalAlign:'middle', marginLeft:2}}/></div>
      </div>
      <div style={{fontSize:11, fontWeight:700, color:HM.ter, ...HMS, marginBottom:8}}>OPTIONS</div>
      <div style={{display:'flex', flexDirection:'column', gap:9}}>
        {['Hold 💎','Flip 💰'].map((o,i) => (
          <div key={i} style={{display:'flex', alignItems:'center', gap:10, height:46, padding:'0 14px', borderRadius:12, background:HM.card, border:`1.5px solid ${HM.coral}`, boxShadow:HM.shadow}}>
            <span style={{flex:1, fontSize:13.5, fontWeight:600, color:HM.text}}>{o}</span>
            <span style={{fontSize:14, color:HM.ter}}>✕</span>
          </div>
        ))}
        <div style={{display:'flex', alignItems:'center', gap:10, height:46, padding:'0 14px', borderRadius:12, background:HM.surface, border:`1.5px dashed ${HM.border}`, color:HM.ter}}>
          <span style={{fontSize:16}}>＋</span><span style={{fontSize:13, fontWeight:600}}>Add option</span>
        </div>
      </div>
      <div style={{marginTop:18}}>
        <div style={{fontSize:11, fontWeight:700, color:HM.ter, ...HMS, marginBottom:8}}>POLL LENGTH</div>
        <div style={{display:'flex', gap:8}}>
          {['1 day','3 days','1 week'].map((d,i) => (
            <div key={i} style={{flex:1, textAlign:'center', padding:'10px 0', borderRadius:10, background:i===1?HM.coralM:HM.surface, border:`1.5px solid ${i===1?HM.coral:HM.border}`, color:i===1?HM.coral:HM.sec, fontSize:12.5, fontWeight:700, ...HMS}}>{d}</div>
          ))}
        </div>
      </div>
    </div>
    <HM_TB/>
  </HM_Phone>
);

// ── NOTIFICATIONS (tap the bell) ──────────────────────────────────────────────
const HM_NotifRow = ({l, c, icon, iconC, text, time, thumb, unread}) => (
  <div style={{display:'flex', alignItems:'center', gap:11, padding:'12px 16px', borderBottom:`1px solid ${HM.border}`, background:unread?HM.coralM:'transparent'}}>
    <div style={{position:'relative', flexShrink:0}}>
      {AV(l, c)}
      <div style={{position:'absolute', bottom:-2, right:-2, width:18, height:18, borderRadius:'50%', background:iconC, border:`2px solid ${HM.bg}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8}}>{icon}</div>
    </div>
    <div style={{flex:1, minWidth:0}}>
      <div style={{fontSize:12.5, color:HM.text, lineHeight:1.45}}>{text}</div>
      <div style={{fontSize:10.5, color:HM.ter, marginTop:2}}>{time}</div>
    </div>
    {thumb && cardThumb(thumb, 34, 48, 6)}
  </div>
);
const HM_Notifications = () => (
  <HM_Phone>
    <HM_SB/>
    <HM_Nav title="Notifications" right={<span style={{fontSize:15}}>⚙</span>}/>
    <div style={{flex:1, overflow:'hidden'}}>
      <div style={{fontSize:10.5, fontWeight:800, letterSpacing:'0.5px', color:HM.ter, textTransform:'uppercase', ...HMS, padding:'12px 16px 7px', background:HM.surface}}>Today</div>
      <HM_NotifRow l="A" c={HM.purple} icon="♥" iconC={HM.coral} text={<span><b>Ava Rodriguez</b> and <b>32 others</b> liked your post</span>} time="12m" thumb={HM.green} unread/>
      <HM_NotifRow l="D" c={HM.green} icon="💬" iconC={HM.blue} text={<span><b>Diego Santos</b> commented: “Absolute heater 🔥”</span>} time="24m" thumb={HM.green} unread/>
      <HM_NotifRow l="K" c={HM.coral} icon="＋" iconC={HM.purple} text={<span><b>Kayla Brooks</b> started following you</span>} time="1h"/>
      <div style={{fontSize:10.5, fontWeight:800, letterSpacing:'0.5px', color:HM.ter, textTransform:'uppercase', ...HMS, padding:'12px 16px 7px', background:HM.surface}}>This week</div>
      <HM_NotifRow l="P" c={HM.amber} icon="🏷" iconC={HM.coral} text={<span><b>@pacific_cards</b> made an offer on your Ohtani — <b>$820</b></span>} time="2d" thumb={HM.blue}/>
      <HM_NotifRow l="E" c={HM.purple} icon="📅" iconC={HM.blue} text={<span><b>Edmonton Card Show</b> is in 3 days — you're going</span>} time="3d"/>
      <HM_NotifRow l="S" c={HM.blue} icon="🤝" iconC={HM.green} text={<span>Your sale to <b>@sam_collects</b> is complete</span>} time="4d" thumb={HM.coral}/>
    </div>
    <HM_TB/>
  </HM_Phone>
);

// ── Export ────────────────────────────────────────────────────────────────────
Object.assign(window, {
  HM_Home, HM_ComposerOpen,
  HM_PostListed, HM_PostUser, HM_PostShowcase, HM_PostSold, HM_PostEvent, HM_PostGroup,
  HM_Likes, HM_Comments, HM_Share, HM_PostMenu, HM_Showcase, HM_Photo, HM_Gif, HM_Poll, HM_Notifications,
});

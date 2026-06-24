// screens-profile.jsx — Collectiv · Profile (Dir 2) · v3
// own / user (other collector) / vendor storefront
// Tabs: text labels. Own+User: Showcase·Listings·Activity·Reviews. Vendor: Gallery·Listings·Reviews
// Header: action buttons → joined-groups always visible → suggested only when ▾ toggled

// ── Tokens ────────────────────────────────────────────────────────────────────
const PR = {
  bg:'#fef9f5', surface:'#fef0e8', card:'#ffffff',
  text:'#1a1210', sec:'#6b5c52', ter:'#aa9a90', border:'#f0ddd0',
  coral:'#E76F51', coralM:'rgba(231,111,81,0.10)',
  purple:'#7C3AED', purpleM:'rgba(124,58,237,0.10)',
  green:'#10B981', greenM:'rgba(16,185,129,0.12)',
  amber:'#f59e0b', blue:'#2563eb',
  shadow:'0 2px 8px rgba(26,18,16,0.07),0 1px 2px rgba(26,18,16,0.04)',
  tabI:'rgba(26,18,16,0.28)',
};
const PRS = {fontFamily:"'Sora',sans-serif"};
const PRD = {fontFamily:"'DM Sans',sans-serif"};

// ── Shell ─────────────────────────────────────────────────────────────────────
const PR_Phone = ({children}) => (
  <div style={{width:390, height:780, background:PR.bg, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative', ...PRD}}>{children}</div>
);
const PR_SB = () => (
  <div style={{height:44, display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'0 20px 8px', flexShrink:0, position:'relative'}}>
    <span style={{fontSize:13, fontWeight:600, color:PR.text, ...PRS}}>9:41</span>
    <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:110, height:26, background:'#000', borderRadius:'0 0 14px 14px'}}/>
    <div style={{display:'flex', gap:5, alignItems:'center', opacity:0.65}}>
      <span style={{fontSize:10, color:PR.text}}>▲▲▲</span>
      <div style={{width:22, height:11, borderRadius:2.5, border:`1.5px solid ${PR.text}`, position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', left:2, top:2, bottom:2, width:'70%', background:PR.text, borderRadius:1}}/>
      </div>
    </div>
  </div>
);
const PR_TB = () => {
  const tabs = [{id:'home',label:'Home',icon:'⌂'},{id:'portfolio',label:'Portfolio',icon:'◫'},{id:'market',label:'Market',icon:'◈'},{id:'social',label:'Social',icon:'◎'},{id:'map',label:'Map',icon:'⊕'}];
  return (
    <div style={{height:56, display:'flex', borderTop:`1px solid ${PR.border}`, background:PR.bg, flexShrink:0}}>
      {tabs.map(t => (
        <div key={t.id} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, color:PR.tabI}}>
          <span style={{fontSize:17, lineHeight:1}}>{t.icon}</span>
          <span style={{fontSize:9, fontWeight:500, ...PRS, lineHeight:1}}>{t.label}</span>
        </div>
      ))}
    </div>
  );
};
const cardThumb = (a, w, h, r=8) => (
  <div style={{width:w, height:h, borderRadius:r, background:`linear-gradient(145deg,${PR.surface},${a})`, position:'relative', overflow:'hidden', flexShrink:0}}>
    <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.2) 0%,transparent 55%)'}}/>
    <div style={{position:'absolute', left:'26%', top:'15%', right:'26%', bottom:'15%', background:PR.bg, opacity:0.14, borderRadius:3}}/>
  </div>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const PR_PEOPLE = {
  own:  {av:'J', color:PR.coral, name:'Jake Morrison', handle:'jakescollects', verified:false,
         bio:'Vintage hoops + modern PSA hunter. Edmonton-based. Always down to trade rookies. 🏀',
         loc:'Edmonton, AB', stats:[['247','Cards'],['1.2k','Followers'],['389','Following']]},
  user: {av:'M', color:PR.purple, name:'Marcus Chen', handle:'mchen_cards', verified:true,
         bio:'Basketball RC specialist. Grading nerd. DM for trades — I ship fast. 📦',
         loc:'Downtown, Edmonton', stats:[['184','Cards'],['3.4k','Followers'],['212','Following']]},
  vendor:{av:'🏪', color:PR.purple, name:'Sportscards YEG', handle:'sportscards_yeg', verified:true, vendor:true,
          bio:'Edmonton\'s premier card shop since 2014. Buy · Sell · Trade · On-site PSA grading.',
          loc:'104 St & Jasper Ave, Edmonton', hours:' · 10 AM – 7 PM', open:true,
          stats:[['4.9★','Rating'],['143','Cards Sold'],['48','Listings']]},
};
const PR_TABS = {
  own:    ['Showcase','Listings','Activity','Reviews'],
  user:   ['Showcase','Listings','Activity','Reviews'],
  vendor: ['Gallery','Listings','Reviews'],
};
const PR_JOINED = [['💎','PSA 10 Hunters',PR.coral],['🍁','YEG Collectors',PR.green],['🏀','Hoops Vault',PR.purple],['🎟','Card Shows',PR.blue]];
const PR_SUGGEST_ACCOUNTS = [['E','Official Ezra','45.5K followers',PR.purple],['B','Bazunes Cards','128.2K followers',PR.amber],['K','Kayla Brooks','12.1K followers',PR.green]];
const PR_SUGGEST_VENDORS  = [['🏪','Graded Gems Co.','31 listings',PR.green],['🏪','Pacific Cards','22 listings',PR.blue],['🏪','Prizm King','45 listings',PR.amber]];

// ── Avatar + Nav ──────────────────────────────────────────────────────────────
const PR_Avatar = ({p, size=84}) => (
  p.vendor
    ? <div style={{width:size, height:size, borderRadius:24, background:`linear-gradient(145deg,${PR.purple},${PR.purple}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.42, boxShadow:`0 6px 18px ${PR.purple}40`}}>{p.av}</div>
    : <div style={{width:size, height:size, borderRadius:'50%', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:size*0.4, fontWeight:700, ...PRS, boxShadow:`0 6px 18px ${p.color}40`}}>{p.av}</div>
);
const PR_Nav = ({variant, onBack, onSettings}) => (
  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'2px 16px 6px', flexShrink:0}}>
    <div onClick={onBack} style={{width:34, height:34, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, color:PR.text, cursor:onBack?'pointer':'default'}}>‹</div>
    <span style={{fontSize:13.5, fontWeight:700, color:PR.text, ...PRS}}>{variant==='own'?'Profile':`@${PR_PEOPLE[variant].handle}`}</span>
    {variant==='own'
      ? <div onClick={onSettings} style={{width:34, height:34, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, color:PR.text, cursor:onSettings?'pointer':'default'}}>⚙</div>
      : <div style={{width:34, height:34, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:PR.text, letterSpacing:1}}>···</div>}
  </div>
);

// ── Joined-groups circles (always visible, own + user only) ───────────────────
const PR_JoinedGroups = () => (
  <div style={{display:'flex', gap:14, overflow:'hidden', alignSelf:'stretch', marginTop:14}}>
    {PR_JOINED.map(([ic,n,c],i) => (
      <div key={i} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:5, width:60, flexShrink:0}}>
        <div style={{width:56, height:56, borderRadius:'50%', padding:2.5, background:`linear-gradient(135deg,${c},${PR.coral})`}}>
          <div style={{width:'100%', height:'100%', borderRadius:'50%', background:PR.bg, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div style={{width:44, height:44, borderRadius:'50%', background:`linear-gradient(145deg,${c},${c}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19}}>{ic}</div>
          </div>
        </div>
        <span style={{fontSize:8.5, fontWeight:600, color:PR.sec, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:56, textAlign:'center'}}>{n}</span>
      </div>
    ))}
  </div>
);

// ── Suggested section (dropdown only) ────────────────────────────────────────
const PR_SuggestedSection = ({variant}) => {
  const isVendor = variant==='vendor';
  const label = isVendor ? 'Suggested vendors' : 'Suggested accounts';
  const items = isVendor ? PR_SUGGEST_VENDORS : PR_SUGGEST_ACCOUNTS;
  return (
    <div style={{alignSelf:'stretch', marginTop:14}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10}}>
        <div style={{display:'flex', alignItems:'center', gap:5}}>
          <span style={{fontSize:12.5, fontWeight:800, color:PR.text, ...PRS}}>{label}</span>
          <span style={{fontSize:11, color:PR.ter}}>ⓘ</span>
        </div>
        <span style={{fontSize:11.5, fontWeight:700, color:PR.coral, ...PRS}}>View all ›</span>
      </div>
      <div style={{display:'flex', gap:9, overflow:'hidden'}}>
        {items.map(([av,n,sub,c],i) => (
          <div key={i} style={{width:128, flexShrink:0, borderRadius:14, background:PR.surface, border:`1px solid ${PR.border}`, padding:'12px 10px', position:'relative', textAlign:'center'}}>
            <span style={{position:'absolute', top:8, right:9, fontSize:10, color:PR.ter}}>✕</span>
            <div style={{width:48, height:48, borderRadius:isVendor?13:'50%', background:c, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:isVendor?20:17, fontWeight:700, ...PRS, margin:'0 auto'}}>{av}</div>
            <div style={{fontSize:11.5, fontWeight:700, color:PR.text, ...PRS, marginTop:8, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{n}</div>
            <div style={{fontSize:9.5, color:PR.ter, marginTop:1}}>{sub}</div>
            <div style={{marginTop:9, padding:'6px 0', borderRadius:999, background:PR.coral, color:'#fff', fontSize:11, fontWeight:700, ...PRS}}>{isVendor?'Visit':'Follow'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Header ────────────────────────────────────────────────────────────────────
const PR_Header = ({variant, onMessage, onEdit, onShare, dropOpen, onToggle}) => {
  const p = PR_PEOPLE[variant];
  const isVendor = variant==='vendor';
  const pill = {flex:1, padding:'11px 0', borderRadius:999, textAlign:'center', fontSize:13.5, fontWeight:700, ...PRS};
  const ghost = {...pill, background:PR.surface, border:`1px solid ${PR.border}`, color:PR.text};
  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'6px 24px 14px', flexShrink:0, textAlign:'center'}}>
      <PR_Avatar p={p}/>
      <div style={{display:'flex', alignItems:'center', gap:6, marginTop:12}}>
        <span style={{fontSize:21, fontWeight:800, color:PR.text, ...PRS, letterSpacing:'-0.3px'}}>{p.name}</span>
        {p.verified && <span style={{fontSize:14, color:PR.green}}>✓</span>}
      </div>
      <div style={{fontSize:12.5, color:PR.ter, marginTop:2}}>
        @{p.handle}
        {p.vendor && <span style={{marginLeft:8, padding:'2px 8px', borderRadius:999, background:PR.purpleM, color:PR.purple, fontSize:9, fontWeight:800, ...PRS, verticalAlign:'middle'}}>POWER VENDOR</span>}
      </div>
      <div style={{fontSize:12.5, color:PR.sec, lineHeight:1.55, marginTop:10, maxWidth:300, textWrap:'pretty'}}>{p.bio}</div>
      <div style={{display:'flex', alignItems:'center', gap:5, fontSize:11.5, color:PR.ter, marginTop:8}}>
        <span>📍</span><span>{p.loc}</span>
        {p.vendor && <><span style={{color:p.open?PR.green:PR.amber, fontWeight:700, marginLeft:4}}>{p.open?'Open':'Closed'}</span><span>{p.hours}</span></>}
      </div>
      {/* stats */}
      <div style={{display:'flex', alignItems:'center', marginTop:16, padding:'0 6px', alignSelf:'stretch'}}>
        {p.stats.map(([v,l],i) => (
          <div key={l} style={{flex:1, textAlign:'center', borderLeft:i>0?`1px solid ${PR.border}`:'none'}}>
            <div style={{fontSize:18, fontWeight:800, color:i===0?PR.coral:PR.text, ...PRS}}>{v}</div>
            <div style={{fontSize:9.5, color:PR.ter, fontWeight:600, marginTop:2, letterSpacing:'0.3px'}}>{l}</div>
          </div>
        ))}
      </div>
      {/* action buttons + dropdown toggle */}
      <div style={{display:'flex', gap:9, marginTop:18, alignSelf:'stretch'}}>
        {variant==='own' ? (
          <>
            <div onClick={onEdit} style={{...ghost, cursor:'pointer'}}>Edit Profile</div>
            <div onClick={onShare} style={{...ghost, cursor:'pointer'}}>Share Profile</div>
          </>
        ) : isVendor ? (
          <>
            <div style={{...pill, background:PR.coral, color:'#fff', boxShadow:`0 4px 12px ${PR.coral}33`}}>📍 Directions</div>
            <div onClick={onMessage} style={{...ghost, cursor:'pointer'}}>Message</div>
          </>
        ) : (
          <>
            <div style={{...pill, background:PR.coral, color:'#fff', boxShadow:`0 4px 12px ${PR.coral}33`}}>+ Follow</div>
            <div onClick={onMessage} style={{...ghost, cursor:'pointer'}}>Message</div>
          </>
        )}
        <div onClick={onToggle} style={{width:46, borderRadius:999, background:PR.surface, border:`1px solid ${PR.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:PR.text, cursor:'pointer', flexShrink:0}}>{dropOpen?'▲':'▼'}</div>
      </div>
      {/* joined-group circles — ALWAYS visible (not for vendor storefronts) */}
      {!isVendor && <PR_JoinedGroups/>}
      {/* suggested section — only when dropdown open */}
      {dropOpen && <PR_SuggestedSection variant={variant}/>}
    </div>
  );
};

// ── Tab strip (text labels) ───────────────────────────────────────────────────
const PR_TabStrip = ({tabs, active, onTab}) => (
  <div style={{display:'flex', borderBottom:`1px solid ${PR.border}`, flexShrink:0}}>
    {tabs.map(t => {
      const on = t===active;
      return (
        <div key={t} onClick={onTab?()=>onTab(t):undefined} style={{flex:1, textAlign:'center', padding:'11px 0 10px', position:'relative', cursor:onTab?'pointer':'default'}}>
          <span style={{fontSize:12, fontWeight:on?800:500, color:on?PR.text:PR.ter, ...PRS}}>{t}</span>
          {on && <div style={{position:'absolute', bottom:-1, left:0, right:0, height:2.5, background:PR.text, borderRadius:2}}/>}
        </div>
      );
    })}
  </div>
);

// ── Tab bodies ────────────────────────────────────────────────────────────────
const SHOWCASE = [['Michael Jordan — \'86 Fleer RC','PSA 9 · Crown jewel',PR.purple],['LeBron James — \'03 RC','PSA 10 · Grail',PR.coral],['Kobe Bryant — \'96 Chrome','PSA 8 · Vintage',PR.amber],['Wayne Gretzky — \'79 OPC','PSA 7 · Hometown hero',PR.blue]];
const PR_ShowcaseGrid = () => (
  <div style={{padding:'12px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, overflow:'hidden'}}>
    {SHOWCASE.map(([n,sub,c],i) => (
      <div key={i} style={{borderRadius:14, overflow:'hidden', position:'relative', height:180, background:`linear-gradient(155deg,#1a1210 0%,${c} 165%)`}}>
        <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>{cardThumb('rgba(255,255,255,0.14)', 76, 108, 7)}</div>
        <div style={{position:'absolute', top:9, left:9, padding:'2px 8px', borderRadius:999, background:'rgba(124,58,237,0.85)', color:'#fff', fontSize:8, fontWeight:800, ...PRS}}>⭐ SHOWCASE</div>
        <div style={{position:'absolute', left:10, right:10, bottom:10}}>
          <div style={{fontSize:11, fontWeight:800, color:'#fff', ...PRS, lineHeight:1.2}}>{n}</div>
          <div style={{fontSize:9, color:'rgba(255,255,255,0.7)', marginTop:2}}>{sub}</div>
        </div>
      </div>
    ))}
  </div>
);
const LISTINGS = [['LeBron James',"'03 Chrome RC",'$12,500','PSA 10','#E76F51'],['Patrick Mahomes',"'17 Prizm RC",'$2,800','PSA 10','#10B981'],['Stephen Curry',"'09 Chrome RC",'$1,450','PSA 9','#E76F51'],['Shohei Ohtani',"'18 Update RC",'$890','PSA 10','#2563eb'],['Luka Dončić',"'18 Prizm RC",'$4,100','PSA 10','#E76F51'],['Kobe Bryant',"'96 Chrome RC",'$2,100','PSA 8','#f59e0b']];
const PR_ListingsGrid = () => (
  <div style={{padding:'12px', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6}}>
    {LISTINGS.map(([n,sub,p,g,a],i) => (
      <div key={i} style={{borderRadius:10, overflow:'hidden', background:PR.card, boxShadow:PR.shadow}}>
        <div style={{height:96, background:`linear-gradient(145deg,${PR.surface},${a})`, position:'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{width:'52%', height:'70%', background:PR.bg, borderRadius:4, opacity:0.14}}/>
          <div style={{position:'absolute', top:5, right:5, padding:'2px 5px', borderRadius:4, background:'rgba(16,185,129,0.22)', color:PR.green, fontSize:7, fontWeight:700}}>{g}</div>
        </div>
        <div style={{padding:'6px 7px 8px'}}>
          <div style={{fontSize:11, fontWeight:800, color:PR.coral, ...PRS}}>{p}</div>
          <div style={{fontSize:9, fontWeight:600, color:PR.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:1}}>{n}</div>
          <div style={{fontSize:7.5, color:PR.ter}}>{sub}</div>
        </div>
      </div>
    ))}
  </div>
);
const GALLERY_COLORS = [PR.coral, PR.purple, PR.green, PR.amber, PR.blue, PR.coral, PR.purple, PR.green, PR.amber];
const PR_GalleryGrid = () => (
  <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2}}>
    {GALLERY_COLORS.map((a,i) => (
      <div key={i} style={{aspectRatio:'1', background:`linear-gradient(145deg,${PR.surface},${a})`, position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%)'}}/>
        <div style={{position:'absolute', left:'28%', top:'18%', right:'28%', bottom:'18%', background:PR.bg, opacity:0.12, borderRadius:3}}/>
        {i===0 && <div style={{position:'absolute', top:6, left:6, padding:'2px 7px', borderRadius:4, background:'rgba(0,0,0,0.45)', color:'#fff', fontSize:8, fontWeight:700}}>📷 14</div>}
      </div>
    ))}
  </div>
);
const PR_ActivityFeed = ({p}) => (
  <div>
    {[{badge:'LISTED',bc:PR.coral,txt:'Just listed a LeBron \'03 Chrome RC 👀 Comps are climbing. Looking for $12,500 OBO.',time:'12m',a:PR.coral,likes:34,comments:8},
      {badge:'SHOWCASED',bc:PR.purple,txt:'Added a new grail to my showcase ⭐ The \'86 Fleer Jordan finally arrived.',time:'1h',a:PR.purple,likes:418,comments:56}].map((post,i) => (
      <div key={i} style={{padding:'14px 16px', borderBottom:`1px solid ${PR.border}`}}>
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:9}}>
          <PR_Avatar p={p} size={34}/>
          <div style={{flex:1, minWidth:0}}>
            <div style={{display:'flex', alignItems:'center', gap:6}}>
              <span style={{fontSize:13, fontWeight:700, color:PR.text, ...PRS}}>{p.name}</span>
              <span style={{padding:'1.5px 7px', borderRadius:999, background:`${post.bc}1a`, color:post.bc, fontSize:8, fontWeight:800, ...PRS}}>{post.badge}</span>
            </div>
            <div style={{fontSize:10, color:PR.ter, marginTop:1}}>@{p.handle} · {post.time}</div>
          </div>
        </div>
        <div style={{fontSize:12.5, color:PR.text, lineHeight:1.5, marginBottom:10}}>{post.txt}</div>
        <div style={{borderRadius:12, overflow:'hidden', height:140, background:`linear-gradient(150deg,#1a1210 0%,${post.a} 150%)`, display:'flex', alignItems:'center', justifyContent:'center'}}>{cardThumb('rgba(255,255,255,0.14)', 72, 100, 7)}</div>
        <div style={{display:'flex', alignItems:'center', gap:22, marginTop:10, color:PR.ter}}>
          <span style={{fontSize:11.5, fontWeight:600}}>♡ {post.likes}</span>
          <span style={{fontSize:11.5, fontWeight:600}}>💬 {post.comments}</span>
          <span style={{fontSize:11.5, fontWeight:600}}>↗ Share</span>
        </div>
      </div>
    ))}
  </div>
);
const REVIEWS = [
  ['A','avapulls','Fast shipping, card exactly as described. Safely packaged and arrived within 3 days. Will buy again!','2d',5,PR.purple],
  ['J','jblake_psa','Smooth in-person meetup downtown. Legit graded cards, no surprises. Highly recommend.','1w',5,PR.amber],
  ['D','dsantos_rc','Great communication throughout, fair price on a Mahomes RC. Solid seller.','2w',4,PR.blue],
];
const PR_Reviews = () => {
  const [filter, setFilter] = React.useState('Relevance');
  const filters = ['Relevance','Newest','Highest','Lowest'];
  return (
    <div>
      {/* rating summary */}
      <div style={{display:'flex', alignItems:'center', gap:20, padding:'16px 20px', borderBottom:`1px solid ${PR.border}`}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:38, fontWeight:800, color:PR.text, ...PRS, lineHeight:1}}>4.9</div>
          <div style={{fontSize:12, color:PR.amber, marginTop:3, letterSpacing:1}}>★★★★★</div>
          <div style={{fontSize:9.5, color:PR.ter, marginTop:3}}>143 reviews</div>
        </div>
        <div style={{flex:1}}>
          {[['5',92],['4',6],['3',1],['2',0],['1',1]].map(([n,pct]) => (
            <div key={n} style={{display:'flex', alignItems:'center', gap:8, marginBottom:4}}>
              <span style={{fontSize:10, color:PR.ter, width:8}}>{n}</span>
              <div style={{flex:1, height:5, borderRadius:3, background:PR.surface, overflow:'hidden'}}>
                <div style={{width:`${pct}%`, height:'100%', background:PR.amber}}/>
              </div>
              <span style={{fontSize:9.5, color:PR.ter, width:22, textAlign:'right'}}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>
      {/* filter chips */}
      <div style={{display:'flex', gap:8, padding:'11px 16px', borderBottom:`1px solid ${PR.border}`, overflow:'hidden', flexShrink:0}}>
        {filters.map(f => (
          <div key={f} onClick={()=>setFilter(f)} style={{padding:'6px 14px', borderRadius:999, background:f===filter?PR.text:PR.surface, color:f===filter?'#fff':PR.sec, border:f===filter?'none':`1px solid ${PR.border}`, fontSize:11, fontWeight:700, ...PRS, flexShrink:0, cursor:'pointer', whiteSpace:'nowrap'}}>{f}</div>
        ))}
      </div>
      {/* review list */}
      {REVIEWS.map(([av,h,txt,t,stars,c],i) => (
        <div key={i} style={{padding:'14px 18px', borderBottom:`1px solid ${PR.border}`}}>
          <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
            <div style={{width:36, height:36, borderRadius:'50%', background:c, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:14, fontWeight:700, ...PRS, flexShrink:0}}>{av}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:12.5, fontWeight:700, color:PR.text, ...PRS}}>@{h}</div>
              <div style={{display:'flex', alignItems:'center', gap:6, marginTop:2}}>
                <span style={{fontSize:10, color:PR.amber}}>{'★'.repeat(stars)}<span style={{color:PR.border}}>{'★'.repeat(5-stars)}</span></span>
                <span style={{fontSize:10, color:PR.ter}}>{t} ago</span>
              </div>
            </div>
          </div>
          <div style={{fontSize:12.5, color:PR.sec, lineHeight:1.55}}>{txt}</div>
        </div>
      ))}
    </div>
  );
};
const PR_Body = ({variant, tab}) => {
  if (tab==='Listings') return <PR_ListingsGrid/>;
  if (tab==='Activity') return <PR_ActivityFeed p={PR_PEOPLE[variant]}/>;
  if (tab==='Reviews')  return <PR_Reviews/>;
  if (tab==='Gallery')  return <PR_GalleryGrid/>;
  return <PR_ShowcaseGrid/>;
};

// ── Profile screen ────────────────────────────────────────────────────────────
const PR_Profile = ({variant='own', tab, onBack, onSettings, onMessage, onTab, onEdit, onShare, dropOpen, onToggle, moreOpen=false}) => {
  const tabs = PR_TABS[variant];
  const active = tab || tabs[0];
  const p = PR_PEOPLE[variant];
  return (
    <PR_Phone>
      <PR_SB/>
      <PR_Nav variant={variant} onBack={onBack} onSettings={onSettings}/>
      <div style={{flex:1, overflow:'hidden', display:'flex', flexDirection:'column'}}>
        <div style={{flex:1, overflow:'hidden'}}>
          <PR_Header variant={variant} onMessage={onMessage} onEdit={onEdit} onShare={onShare} dropOpen={dropOpen} onToggle={onToggle}/>
          <PR_TabStrip tabs={tabs} active={active} onTab={onTab}/>
          <PR_Body variant={variant} tab={active}/>
        </div>
      </div>
      <PR_TB/>
      {moreOpen && (() => {
        const acts = [
          ['👤⁺','Follow',null],
          ['💬','Message',null],
          ['🔔','Turn on notifications',null],
          ['🔗','Share profile',null],
          ['🚫','Block',null,true],
          ['🚩','Report',null,true],
        ];
        return (
          <React.Fragment>
            <div style={{position:'absolute', inset:0, background:'rgba(14,13,12,0.42)', zIndex:30}}/>
            <div style={{position:'absolute', left:0, right:0, bottom:0, background:PR.bg, borderRadius:'22px 22px 0 0', zIndex:31, boxShadow:'0 -12px 40px rgba(26,18,16,0.2)', overflow:'hidden'}}>
              <div style={{display:'flex', justifyContent:'center', padding:'10px 0 6px'}}>
                <div style={{width:38, height:4.5, borderRadius:3, background:PR.ter}}/>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:11, padding:'8px 18px 13px', borderBottom:`1px solid ${PR.border}`}}>
                <div style={{width:40, height:40, borderRadius:'50%', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16, fontWeight:700, ...PRS, flexShrink:0}}>{p.av}</div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:13.5, fontWeight:800, color:PR.text, ...PRS}}>{p.name}</div>
                  <div style={{fontSize:10.5, color:PR.ter, marginTop:1}}>@{p.handle}</div>
                </div>
              </div>
              {acts.map(([ic,l,s,danger],i) => (
                <div key={i} style={{display:'flex', alignItems:'center', gap:13, padding:'12px 18px', borderBottom:`1px solid ${PR.border}`, background:danger?'rgba(231,111,81,0.05)':'transparent'}}>
                  <div style={{width:36, height:36, borderRadius:'50%', background:danger?'rgba(231,111,81,0.1)':PR.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0}}>{ic}</div>
                  <span style={{flex:1, fontSize:13.5, fontWeight:700, color:danger?PR.coral:PR.text, ...PRS}}>{l}</span>
                </div>
              ))}
              <div style={{height:14}}/>
            </div>
          </React.Fragment>
        );
      })()}
    </PR_Phone>
  );
};

// ── Edit Profile ──────────────────────────────────────────────────────────────
const Field = ({label, value, ph, area}) => (
  <div>
    <div style={{fontSize:10, fontWeight:700, color:PR.ter, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6}}>{label}</div>
    <div style={{padding:'11px 14px', borderRadius:area?14:999, background:PR.surface, border:`1px solid ${PR.border}`, minHeight:area?64:'auto', display:'flex', alignItems:area?'flex-start':'center'}}>
      <span style={{fontSize:13, color:value?PR.text:PR.ter, lineHeight:1.5}}>{value||ph}</span>
    </div>
  </div>
);
const PR_EditProfile = () => {
  const p = PR_PEOPLE.own;
  return (
    <PR_Phone>
      <PR_SB/>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'2px 18px 12px', flexShrink:0, borderBottom:`1px solid ${PR.border}`}}>
        <span style={{fontSize:13.5, fontWeight:600, color:PR.sec, ...PRS}}>Cancel</span>
        <span style={{fontSize:15, fontWeight:800, color:PR.text, ...PRS}}>Edit Profile</span>
        <span style={{fontSize:13.5, fontWeight:700, color:PR.coral, ...PRS}}>Save</span>
      </div>
      <div style={{flex:1, overflow:'hidden', display:'flex', flexDirection:'column'}}>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'18px 0 14px', flexShrink:0}}>
          <div style={{position:'relative'}}>
            <PR_Avatar p={p} size={80}/>
            <div style={{position:'absolute', bottom:-2, right:-2, width:28, height:28, borderRadius:'50%', background:PR.coral, border:`2.5px solid ${PR.bg}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#fff'}}>📷</div>
          </div>
          <div style={{fontSize:12, fontWeight:700, color:PR.coral, ...PRS, marginTop:10}}>Change photo</div>
        </div>
        <div style={{flex:1, overflow:'hidden', padding:'0 20px', display:'flex', flexDirection:'column', gap:14}}>
          <Field label="Name" value="Jake Morrison"/>
          <Field label="Username" value="@jakescollects"/>
          <Field label="Bio" value={p.bio} area/>
          <Field label="Location" value="Edmonton, AB"/>
          <Field label="Website" ph="Add a link"/>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0 4px', borderTop:`1px solid ${PR.border}`}}>
            <div>
              <div style={{fontSize:13, fontWeight:600, color:PR.text, ...PRS}}>Private account</div>
              <div style={{fontSize:11, color:PR.ter, marginTop:1}}>Only approved followers see your collection</div>
            </div>
            <div style={{width:44, height:26, borderRadius:999, background:PR.surface, border:`1px solid ${PR.border}`, position:'relative', flexShrink:0}}>
              <div style={{width:20, height:20, borderRadius:'50%', background:PR.ter, position:'absolute', top:3, left:3}}/>
            </div>
          </div>
        </div>
      </div>
      <PR_TB/>
    </PR_Phone>
  );
};

// ── Export ────────────────────────────────────────────────────────────────────
Object.assign(window, { PR_Profile, PR_EditProfile });

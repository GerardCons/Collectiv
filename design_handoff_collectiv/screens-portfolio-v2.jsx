// screens-portfolio-v2.jsx — Collectiv · Portfolio (Dir 2) — extracted from Portfolio Flows
// Portfolio home bg + Add Card / Add Collection / Filter flows.
// Internal helpers (k, Phone, SB, TB, Sheet, Dim, PortBg) are file-scoped; only
// the flow screens are exported to window.

// ── Design tokens — Dir 2 · Social Collector · Light ─────────────
const k = {
  bg:'#fef9f5', surface:'#fef0e8', card:'#ffffff',
  text:'#1a1210', sec:'#6b5c52', ter:'#aa9a90',
  border:'#f0ddd0',
  coral:'#E76F51', coralM:'rgba(231,111,81,0.1)',
  purple:'#7C3AED', purpleM:'rgba(124,58,237,0.1)',
  green:'#10B981', greenM:'rgba(16,185,129,0.12)',
  amber:'#f59e0b',
  shadow:'0 2px 8px rgba(26,18,16,0.07), 0 1px 2px rgba(26,18,16,0.04)',
  tabI:'rgba(26,18,16,0.28)',
};
const S2 = { fontFamily:"'Sora',sans-serif" };
const DS = { fontFamily:"'DM Sans',sans-serif" };

// ── Shared primitives ─────────────────────────────────────────────
const SB = () => (
  <div style={{height:44,display:'flex',alignItems:'flex-end',justifyContent:'space-between',padding:'0 20px 8px',position:'relative',flexShrink:0}}>
    <span style={{fontSize:13,fontWeight:600,color:k.text,...DS}}>9:41</span>
    <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:110,height:26,background:'#000',borderRadius:'0 0 14px 14px'}}/>
    <div style={{display:'flex',gap:5,alignItems:'center',opacity:0.65}}>
      <span style={{fontSize:10,color:k.text}}>▲▲▲</span>
      <div style={{width:22,height:11,borderRadius:2.5,border:`1.5px solid ${k.text}`,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',left:2,top:2,bottom:2,width:'70%',background:k.text,borderRadius:1}}/>
      </div>
    </div>
  </div>
);

const TB = ({ active='portfolio' }) => {
  const tabs = [
    {id:'home',label:'Home',icon:'⌂'},{id:'portfolio',label:'Portfolio',icon:'◫'},
    {id:'market',label:'Market',icon:'◈'},{id:'social',label:'Social',icon:'◎'},{id:'map',label:'Map',icon:'⊕'},
  ];
  return (
    <div style={{height:56,display:'flex',borderTop:`1px solid ${k.border}`,background:k.bg,flexShrink:0}}>
      {tabs.map(tab => {
        const on = tab.id === active;
        return (
          <div key={tab.id} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,color:on?k.coral:k.tabI,position:'relative'}}>
            {on && <div style={{position:'absolute',top:0,width:28,height:3,borderRadius:'0 0 3px 3px',background:k.coral}}/>}
            <span style={{fontSize:17,lineHeight:1}}>{tab.icon}</span>
            <span style={{fontSize:9,fontWeight:on?700:500,...S2,lineHeight:1}}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const Phone = ({ children, h=780 }) => (
  <div style={{width:390,height:h,background:k.bg,display:'flex',flexDirection:'column',overflow:'hidden',position:'relative',...DS}}>
    {children}
  </div>
);

const Dim = () => <div style={{position:'absolute',inset:0,background:'rgba(14,13,12,0.55)',zIndex:10}}/>;

const Sheet = ({ height, children }) => (
  <div style={{position:'absolute',bottom:0,left:0,right:0,height,background:k.bg,borderRadius:'24px 24px 0 0',zIndex:20,display:'flex',flexDirection:'column'}}>
    <div style={{width:36,height:4,borderRadius:2,background:k.ter,margin:'12px auto 4px'}}/>
    {children}
  </div>
);

// Portfolio content shown dimmed behind sheets
const PortBg = ({ dim=false }) => (
  <div style={{flex:1,display:'flex',flexDirection:'column',opacity:dim?0.25:1,pointerEvents:'none'}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'2px 20px 10px'}}>
      <div>
        <div style={{fontSize:20,fontWeight:700,color:k.text,...S2}}>My Collection</div>
        <div style={{fontSize:11,color:k.sec,...S2}}>@jakescollects · 127 followers</div>
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <div style={{padding:'6px 14px',borderRadius:999,background:k.coralM,border:`1px solid ${k.coral}`,color:k.coral,fontSize:12,fontWeight:700,...S2}}>+ Add</div>
        <div style={{width:32,height:32,borderRadius:'50%',background:k.coral,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:13,fontWeight:700}}>J</div>
      </div>
    </div>
    <div style={{display:'flex',padding:'0 20px 12px'}}>
      {[['$14,820','Total Value'],['247','Cards'],['12','Sets']].map(([v,l],i)=>(
        <div key={l} style={{flex:1,textAlign:i===0?'left':'center',borderLeft:i>0?`1px solid ${k.border}`:'none',paddingLeft:i>0?14:0}}>
          <div style={{fontSize:18,fontWeight:700,color:i===0?k.coral:k.text}}>{v}</div>
          <div style={{fontSize:9,color:k.ter,fontWeight:600,marginTop:2}}>{l}</div>
        </div>
      ))}
    </div>
    <div style={{display:'flex',gap:8,padding:'0 16px 12px'}}>
      <div style={{display:'flex',alignItems:'center',gap:7,padding:'7px 13px',borderRadius:999,background:k.surface,border:`1px solid ${k.border}`}}>
        <span style={{fontSize:12,color:k.ter}}>📁</span>
        <span style={{fontSize:13,fontWeight:600,color:k.text,...S2}}>My Collection</span>
        <span style={{fontSize:10,color:k.ter}}>▾</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:4,padding:'7px 10px',borderRadius:999,background:k.coralM,border:`1px solid ${k.coral}`}}>
        <span style={{fontSize:13,color:k.coral,fontWeight:700}}>+</span>
        <span style={{fontSize:11,color:k.coral,fontWeight:700,...S2}}>Collection</span>
      </div>
    </div>
    <div style={{padding:'0 12px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
      {[['#E76F51','PSA 9','🔒'],['#7C3AED','','⭐'],['#10B981','','🔒'],['#f59e0b','PSA 10','🏷'],['#E76F51','','⭐'],['#7C3AED','','🔒']].map(([a,g,s],i)=>(
        <div key={i} style={{borderRadius:10,overflow:'hidden',background:k.card,boxShadow:k.shadow}}>
          <div style={{height:96,background:`linear-gradient(145deg,${k.surface},${a})`,position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{width:'52%',height:'70%',background:k.bg,borderRadius:4,opacity:0.14}}/>
            {g && <div style={{position:'absolute',top:5,right:5,padding:'2px 5px',borderRadius:4,background:'rgba(16,185,129,0.22)',color:'#10B981',fontSize:7,fontWeight:700}}>{g}</div>}
            <div style={{position:'absolute',top:5,left:5,width:18,height:18,borderRadius:4,background:'rgba(0,0,0,0.38)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9}}>{s}</div>
          </div>
          <div style={{padding:'6px 7px 8px'}}>
            <div style={{fontSize:9.5,fontWeight:600,color:k.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Card {i+1}</div>
            <div style={{fontSize:7.5,color:k.ter}}>Pokémon · NM</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ══ ADD CARD FLOW ════════════════════════════════════════════════════

const AC_Scan = () => (
  <Phone>
    <SB/>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 20px 12px',flexShrink:0}}>
      <div style={{fontSize:14,color:k.sec,...S2}}>Cancel</div>
      <div style={{fontSize:15,fontWeight:700,color:k.text,...S2}}>Add Card</div>
      <div style={{fontSize:14,fontWeight:700,color:k.coral,...S2}}>Next</div>
    </div>
    <div style={{flex:1,overflow:'hidden',padding:'0 20px',display:'flex',flexDirection:'column',gap:16}}>
      <div>
        <div style={{fontSize:22,fontWeight:700,color:k.text,...S2,marginBottom:4}}>Upload Your Card</div>
        <div style={{fontSize:13,color:k.sec}}>Scan with your camera or pick from your gallery — front required, back optional.</div>
      </div>
      <div style={{display:'flex',gap:14}}>
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
          <div style={{width:'100%',aspectRatio:'3/4',borderRadius:14,border:`2px dashed ${k.coral}`,background:k.coralM,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}>
            <div style={{width:48,height:48,borderRadius:999,background:k.coralM,border:`1.5px solid ${k.coral}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>📷</div>
            <div style={{fontSize:12,fontWeight:700,color:k.coral,...S2}}>Tap to capture</div>
            <div style={{fontSize:10,color:k.coral,opacity:0.7}}>Front (required)</div>
          </div>
          <div style={{fontSize:11,fontWeight:600,color:k.coral,...S2}}>Choose from library</div>
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
          <div style={{width:'100%',aspectRatio:'3/4',borderRadius:14,border:`2px dashed ${k.border}`,background:k.surface,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}>
            <div style={{width:48,height:48,borderRadius:999,background:k.surface,border:`1px solid ${k.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,opacity:0.5}}>📷</div>
            <div style={{fontSize:12,fontWeight:600,color:k.sec,...S2}}>Tap to capture</div>
            <div style={{fontSize:10,color:k.ter}}>Back (optional)</div>
          </div>
          <div style={{fontSize:11,fontWeight:600,color:k.sec,...S2}}>Choose from library</div>
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{flex:1,height:1,background:k.border}}/>
        <div style={{fontSize:11,color:k.ter}}>or</div>
        <div style={{flex:1,height:1,background:k.border}}/>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'13px 16px',borderRadius:999,background:k.surface,border:`1px solid ${k.border}`,cursor:'pointer'}}>
        <span style={{fontSize:14}}>🔍</span>
        <span style={{fontSize:14,fontWeight:700,color:k.coral,...S2}}>Search by Name or Set</span>
        <span style={{fontSize:14,color:k.coral}}>→</span>
      </div>
    </div>
    <TB/>
  </Phone>
);



const AC_Search = () => (
  <Phone>
    <SB/>
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'4px 16px 12px',flexShrink:0}}>
      <div style={{width:32,height:32,borderRadius:'50%',background:k.surface,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:k.text,flexShrink:0}}>←</div>
      <div style={{flex:1,padding:'9px 14px',borderRadius:999,background:k.surface,border:`1.5px solid ${k.coral}`,display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:13,color:k.ter}}>⌕</span>
        <span style={{fontSize:13,color:k.text,...DS}}>Charizard</span>
        <span style={{fontSize:11,color:k.ter,marginLeft:'auto'}}>✕</span>
      </div>
    </div>
    <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.8px',textTransform:'uppercase',color:k.ter,padding:'0 20px 10px',flexShrink:0}}>12 Results Found</div>
    <div style={{flex:1,overflow:'hidden',padding:'0 16px',display:'flex',flexDirection:'column',gap:8}}>
      {[
        {name:'Charizard — 1st Edition',set:'Base Set 1999 · #4/102 · Holo Rare',accent:'#E76F51',sel:true},
        {name:'Charizard — Shadowless',set:'Base Set 1999 · #4/102 · Holo Rare',accent:'#E76F51',sel:false},
        {name:'Charizard V — Alt Art',set:"Champion's Path · #074/073 · Rainbow",accent:'#f59e0b',sel:false},
        {name:'Charizard-GX — Shiny',set:'Hidden Fates · #SV49/SV94 · Shiny',accent:'#7C3AED',sel:false},
      ].map((r,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',borderRadius:12,background:r.sel?k.coralM:k.surface,border:`1.5px solid ${r.sel?k.coral:k.border}`}}>
          <div style={{width:44,height:62,borderRadius:6,background:`linear-gradient(145deg,${k.surface},${r.accent})`,flexShrink:0,position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(255,255,255,0.2) 0%,transparent 55%)'}}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:k.text,...S2}}>{r.name}</div>
            <div style={{fontSize:10,color:k.sec,marginTop:2}}>{r.set}</div>
          </div>
          {r.sel && <div style={{width:22,height:22,borderRadius:'50%',background:k.coral,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:12,flexShrink:0}}>✓</div>}
        </div>
      ))}
    </div>
    <div style={{padding:'12px 16px',flexShrink:0}}>
      <div style={{padding:'14px',borderRadius:999,background:k.coral,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:15,fontWeight:700,...S2}}>Select This Card →</div>
    </div>
    <TB/>
  </Phone>
);

const AC_ConfirmDetails = ({ graded = false, ownPhoto = false, nameOpen = false, genreOpen = false, cardType = 'Normal' }) => (
  <Phone h={graded?1040:940}>
    <SB/>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 20px 10px',flexShrink:0}}>
      <div style={{width:32,height:32,borderRadius:'50%',background:k.surface,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:k.text}}>←</div>
      <div style={{fontSize:15,fontWeight:700,color:k.text,...S2}}>Confirm Details</div>
      <div style={{fontSize:14,fontWeight:700,color:k.coral,...S2}}>Save</div>
    </div>
    {/* Photo row */}
    {ownPhoto ? (
      <div style={{display:'flex',gap:14,justifyContent:'center',marginBottom:14,flexShrink:0}}>
        <div style={{width:104,height:146,borderRadius:12,background:'linear-gradient(145deg,#fde0d2,#E76F51)',position:'relative',overflow:'hidden',boxShadow:'0 6px 20px rgba(231,111,81,0.3)'}}>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(255,255,255,0.25) 0%,transparent 55%)'}}/>
          <div style={{position:'absolute',bottom:6,left:0,right:0,textAlign:'center',fontSize:9,color:'rgba(255,255,255,0.85)',fontWeight:700,letterSpacing:'0.5px'}}>FRONT</div>
        </div>
        <div style={{width:104,height:146,borderRadius:12,background:k.surface,border:`1.5px dashed ${k.border}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:5}}>
          <span style={{fontSize:22,color:k.ter}}>+</span>
          <span style={{fontSize:10,color:k.ter,fontWeight:600}}>Add back</span>
        </div>
      </div>
    ) : (
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:12,flexShrink:0}}>
        <div style={{position:'relative'}}>
          <div style={{width:104,height:146,borderRadius:12,background:'linear-gradient(145deg,#fde0d2,#E76F51)',position:'relative',overflow:'hidden',boxShadow:'0 6px 20px rgba(245,158,11,0.25)',outline:`2px solid ${k.amber}`,outlineOffset:3}}>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(255,255,255,0.25) 0%,transparent 55%)'}}/>
          </div>
          <div style={{position:'absolute',bottom:-10,left:'50%',transform:'translateX(-50%)',whiteSpace:'nowrap',padding:'3px 10px',borderRadius:999,background:k.amber,display:'flex',alignItems:'center',gap:4,boxShadow:'0 2px 8px rgba(245,158,11,0.4)'}}>
            <span style={{fontSize:8,color:'#fff'}}>🔍</span>
            <span style={{fontSize:8.5,fontWeight:800,color:'#fff',letterSpacing:'0.5px',...S2}}>REFERENCE PHOTO</span>
          </div>
        </div>
        <div style={{fontSize:10.5,color:k.ter,marginTop:16}}>Added via search · Not your actual card</div>
        <div style={{marginTop:7,display:'inline-flex',alignItems:'center',gap:5,padding:'6px 14px',borderRadius:999,background:k.coralM,border:`1px solid ${k.coral}`}}>
          <span style={{fontSize:10,color:k.coral}}>📷</span>
          <span style={{fontSize:11,fontWeight:700,color:k.coral,...S2}}>Add your own photo</span>
        </div>
      </div>
    )}
    <div style={{flex:1,overflow:'hidden',padding:'0 20px',display:'flex',flexDirection:'column',gap:12}}>
      {/* Card name — autofill textbox */}
      <div style={{position:'relative',zIndex:5}}>
        <div style={{fontSize:10,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:5}}>Card Name</div>
        {nameOpen ? (
          <React.Fragment>
            <div style={{padding:'10px 14px',borderRadius:12,background:k.card,border:`1.5px solid ${k.coral}`,display:'flex',alignItems:'center',gap:2,boxShadow:'0 0 0 3px rgba(231,111,81,0.1)'}}>
              <span style={{fontSize:13,color:k.text}}>Charizard 1st</span>
              <div style={{width:1.5,height:15,background:k.coral}}/>
            </div>
            <div style={{position:'absolute',top:'100%',left:0,right:0,marginTop:4,borderRadius:12,background:k.card,border:`1px solid ${k.border}`,boxShadow:'0 8px 24px rgba(26,18,16,0.14)',overflow:'hidden'}}>
              {[
                {n:'Charizard — 1st Edition Base Set',d:'Pokémon · Holo Rare',hl:true},
                {n:'Charizard — 1st Ed. Shadowless',d:'Pokémon · Holo Rare',hl:false},
                {n:'Charizard GX — 1st Print',d:'Pokémon · Shiny',hl:false},
              ].map((s)=>(
                <div key={s.n} style={{display:'flex',alignItems:'center',gap:8,padding:'9px 13px',background:s.hl?k.coralM:'transparent',borderBottom:`1px solid ${k.border}`}}>
                  <span style={{fontSize:10,color:k.ter}}>⌕</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:s.hl?700:500,color:s.hl?k.coral:k.text}}>{s.n}</div>
                    <div style={{fontSize:9.5,color:k.ter}}>{s.d}</div>
                  </div>
                </div>
              ))}
              <div style={{padding:'8px 13px',fontSize:10.5,color:k.ter,textAlign:'center'}}>Keep typing to refine…</div>
            </div>
          </React.Fragment>
        ) : (
          <div style={{padding:'10px 14px',borderRadius:12,background:k.surface,border:`1px solid ${k.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:13,color:k.text}}>Charizard — 1st Edition Base Set</span>
            <span style={{fontSize:11,color:k.ter}}>⌕</span>
          </div>
        )}
      </div>
      {/* Genre — dropdown */}
      <div style={{position:'relative',zIndex:4}}>
        <div style={{fontSize:10,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:5}}>Genre</div>
        <div style={{padding:'10px 14px',borderRadius:12,background:genreOpen?k.card:k.surface,border:`1.5px solid ${genreOpen?k.coral:k.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:genreOpen?'0 0 0 3px rgba(231,111,81,0.1)':'none'}}>
          <span style={{fontSize:13,fontWeight:600,color:k.text,...S2}}>Pokémon</span>
          <span style={{fontSize:11,color:genreOpen?k.coral:k.ter}}>{genreOpen?'▴':'▾'}</span>
        </div>
        {genreOpen && (
          <div style={{position:'absolute',top:'100%',left:0,right:0,marginTop:4,borderRadius:12,background:k.card,border:`1px solid ${k.border}`,boxShadow:'0 8px 24px rgba(26,18,16,0.14)',overflow:'hidden'}}>
            {['Pokémon','Magic: The Gathering','Sports','Yu-Gi-Oh!','One Piece'].map((g,i)=>(
              <div key={g} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 13px',background:i===0?k.coralM:'transparent',borderBottom:`1px solid ${k.border}`}}>
                <span style={{fontSize:12,fontWeight:i===0?700:500,color:i===0?k.coral:k.text}}>{g}</span>
                {i===0 && <span style={{fontSize:11,color:k.coral}}>✓</span>}
              </div>
            ))}
            <div style={{display:'flex',alignItems:'center',gap:6,padding:'9px 13px'}}>
              <span style={{fontSize:12,color:k.coral,fontWeight:700}}>+</span>
              <span style={{fontSize:12,fontWeight:700,color:k.coral,...S2}}>Add new genre</span>
            </div>
          </div>
        )}
      </div>
      {/* Condition chips */}
      <div>
        <div style={{fontSize:10,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:7}}>Condition</div>
        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          {['Mint','Near Mint','Excellent','Good','Lightly Played','Played'].map((c,i)=>(
            <div key={c} style={{padding:'5px 10px',borderRadius:999,background:i===1?k.coralM:k.surface,border:`1px solid ${i===1?k.coral:k.border}`,color:i===1?k.coral:k.sec,fontSize:10,fontWeight:600,...S2}}>{c}</div>
          ))}
        </div>
      </div>
      {/* Card Type chips */}
      <div>
        <div style={{fontSize:10,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:7}}>Card Type</div>
        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          {['Normal','Holo Foil','Reverse Holofoil','Cosmo Holofoil','Full Art','Secret Rare'].map((t)=>{
            const active = t === cardType;
            return <div key={t} style={{padding:'5px 10px',borderRadius:999,background:active?k.coralM:k.surface,border:`1px solid ${active?k.coral:k.border}`,color:active?k.coral:k.sec,fontSize:10,fontWeight:600,...S2}}>{t}</div>;
          })}
        </div>
      </div>
      {/* Visibility */}
      <div>
        <div style={{fontSize:10,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:7}}>Visibility</div>
        <div style={{display:'flex',gap:8}}>
          {[['🔒','Private',true],['⭐','Showcased',false],['🏷','Market',false]].map(([icon,label,active])=>(
            <div key={label} style={{flex:1,padding:'9px 4px',borderRadius:999,background:active?k.coralM:k.surface,border:`1.5px solid ${active?k.coral:k.border}`,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
              <span style={{fontSize:14}}>{icon}</span>
              <span style={{fontSize:9,fontWeight:700,color:active?k.coral:k.sec,...S2}}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{fontSize:10,color:k.ter,marginTop:3}}>Only you can see private cards.</div>
      </div>
      {/* Graded toggle */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'2px 0',borderTop:`1px solid ${k.border}`,paddingTop:10}}>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:k.text,...S2}}>Graded Card?</div>
          <div style={{fontSize:11,color:k.ter}}>PSA, BGS, CGC, SGC, etc.</div>
        </div>
        <div style={{width:44,height:26,borderRadius:999,background:graded?k.coral:k.surface,border:`1px solid ${graded?k.coral:k.border}`,position:'relative'}}>
          <div style={{width:20,height:20,borderRadius:'50%',background:graded?'#fff':k.ter,position:'absolute',top:3,left:graded?21:3,boxShadow:'0 1px 3px rgba(0,0,0,0.15)'}}/>
        </div>
      </div>
      {/* Grading fields — visible when toggle ON */}
      {graded && (
        <div style={{display:'flex',flexDirection:'column',gap:10,padding:'12px',borderRadius:14,background:k.surface,border:`1px solid ${k.border}`}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:7}}>Grading Company</div>
            <div style={{display:'flex',gap:6}}>
              {['PSA','BGS','CGC','SGC'].map((co,i)=>(
                <div key={co} style={{flex:1,padding:'8px 0',borderRadius:999,background:i===0?k.coral:k.bg,border:`1px solid ${i===0?k.coral:k.border}`,color:i===0?'#fff':k.sec,fontSize:11,fontWeight:700,...S2,textAlign:'center'}}>{co}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:7}}>Grade</div>
            <div style={{height:84,borderRadius:12,background:k.bg,border:`1px solid ${k.border}`,overflow:'hidden',position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:28,background:`linear-gradient(to bottom,${k.surface},transparent)`,zIndex:2,pointerEvents:'none'}}/>
              <div style={{position:'absolute',bottom:0,left:0,right:0,height:28,background:`linear-gradient(to top,${k.surface},transparent)`,zIndex:2,pointerEvents:'none'}}/>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:0}}>
                <div style={{fontSize:14,color:k.ter,padding:'4px 0',opacity:0.6}}>8</div>
                <div style={{fontSize:20,fontWeight:800,color:k.text,...S2,padding:'4px 28px',borderTop:`1px solid ${k.border}`,borderBottom:`1px solid ${k.border}`}}>9</div>
                <div style={{fontSize:14,color:k.ter,padding:'4px 0',opacity:0.6}}>10</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!graded && (
        <div>
          <div style={{fontSize:10,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:6}}>Notes (optional)</div>
          <div style={{padding:'10px 14px',borderRadius:12,background:k.surface,border:`1px solid ${k.border}`,height:56,display:'flex',alignItems:'flex-start'}}>
            <span style={{fontSize:13,color:k.ter}}>Pulled from a 1st-ed booster…</span>
          </div>
        </div>
      )}
    </div>
    <div style={{padding:'10px 20px',flexShrink:0}}>
      <div style={{padding:'13px',borderRadius:999,background:k.coral,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:15,fontWeight:700,...S2}}>Save Card</div>
    </div>
    <TB/>
  </Phone>
);

const AC_Success = () => (
  <Phone>
    <SB/>
    <div style={{margin:'4px 16px 0',padding:'10px 14px',borderRadius:12,background:k.greenM,border:`1px solid ${k.green}`,display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
      <span style={{fontSize:16,color:k.green}}>✓</span>
      <span style={{fontSize:12,fontWeight:700,color:k.green,...S2}}>Charizard 1st Ed. added to My Collection!</span>
    </div>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 20px 10px',flexShrink:0}}>
      <div>
        <div style={{fontSize:20,fontWeight:700,color:k.text,...S2}}>My Collection</div>
        <div style={{fontSize:11,color:k.sec,...S2}}>@jakescollects · 127 followers</div>
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <div style={{padding:'6px 14px',borderRadius:999,background:k.coralM,border:`1px solid ${k.coral}`,color:k.coral,fontSize:12,fontWeight:700,...S2}}>+ Add</div>
        <div style={{width:32,height:32,borderRadius:'50%',background:k.coral,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:13,fontWeight:700}}>J</div>
      </div>
    </div>
    <div style={{display:'flex',padding:'0 20px 12px',flexShrink:0}}>
      {[['$14,820','Total Value'],['248','Cards'],['12','Sets']].map(([v,l],i)=>(
        <div key={l} style={{flex:1,textAlign:i===0?'left':'center',borderLeft:i>0?`1px solid ${k.border}`:'none',paddingLeft:i>0?14:0}}>
          <div style={{fontSize:18,fontWeight:700,color:i===0?k.coral:k.text}}>{v}</div>
          <div style={{fontSize:9,color:k.ter,fontWeight:600,marginTop:2}}>{l}</div>
        </div>
      ))}
    </div>
    <div style={{display:'flex',gap:8,padding:'0 16px 12px',flexShrink:0}}>
      <div style={{display:'flex',alignItems:'center',gap:7,padding:'7px 13px',borderRadius:999,background:k.surface,border:`1px solid ${k.border}`}}>
        <span style={{fontSize:12,color:k.ter}}>📁</span>
        <span style={{fontSize:13,fontWeight:600,color:k.text,...S2}}>My Collection</span>
        <span style={{fontSize:10,color:k.ter}}>▾</span>
      </div>
    </div>
    <div style={{flex:1,overflow:'hidden',padding:'0 12px'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
        <div style={{borderRadius:10,overflow:'hidden',background:k.card,boxShadow:`0 0 0 2px ${k.coral},0 4px 14px rgba(231,111,81,0.2)`}}>
          <div style={{height:96,background:'linear-gradient(145deg,#fde0d2,#E76F51)',position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{width:'52%',height:'70%',background:k.bg,borderRadius:4,opacity:0.14}}/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%)'}}/>
            <div style={{position:'absolute',top:5,left:5,width:18,height:18,borderRadius:4,background:'rgba(0,0,0,0.38)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9}}>🔒</div>
            <div style={{position:'absolute',top:5,right:5,display:'flex',flexDirection:'column',alignItems:'flex-end',gap:2}}>
              <div style={{padding:'2px 5px',borderRadius:4,background:k.coral,color:'#fff',fontSize:7,fontWeight:700}}>NEW</div>
              <div style={{padding:'2px 5px',borderRadius:4,background:'rgba(245,158,11,0.88)',color:'#fff',fontSize:7,fontWeight:700}}>🔍 search</div>
            </div>
          </div>
          <div style={{padding:'6px 7px 8px'}}>
            <div style={{fontSize:9.5,fontWeight:600,color:k.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Charizard 1st Ed.</div>
            <div style={{fontSize:8.5,color:k.ter,marginBottom:1}}>🔒 Private</div>
            <div style={{fontSize:7.5,color:k.ter}}>Pokémon · Near Mint</div>
          </div>
        </div>
        {[['#7C3AED',''],['#10B981',''],['#f59e0b','PSA 10'],['#E76F51',''],['#7C3AED','']].map(([a,g],i)=>(
          <div key={i} style={{borderRadius:10,overflow:'hidden',background:k.card,boxShadow:k.shadow}}>
            <div style={{height:96,background:`linear-gradient(145deg,${k.surface},${a})`,position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:'52%',height:'70%',background:k.bg,borderRadius:4,opacity:0.14}}/>
              {g && <div style={{position:'absolute',top:5,right:5,padding:'2px 5px',borderRadius:4,background:'rgba(16,185,129,0.22)',color:'#10B981',fontSize:7,fontWeight:700}}>{g}</div>}
            </div>
            <div style={{padding:'6px 7px 8px'}}>
              <div style={{fontSize:9.5,fontWeight:600,color:k.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Card {i+2}</div>
              <div style={{fontSize:7.5,color:k.ter}}>Pokémon · NM</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <TB/>
  </Phone>
);

// ══ ADD COLLECTION FLOW ══════════════════════════════════════════════

const COL_Switcher = () => (
  <Phone>
    <SB/><PortBg dim={true}/><TB/><Dim/>
    <Sheet height={260}>
      <div style={{padding:'8px 20px 20px',flex:1}}>
        <div style={{fontSize:17,fontWeight:700,color:k.text,...S2,marginBottom:14}}>My Collections</div>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 0',borderBottom:`1px solid ${k.border}`}}>
          <div style={{width:36,height:36,borderRadius:10,background:k.coralM,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>📁</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:k.text,...S2}}>My Collection</div>
            <div style={{fontSize:11,color:k.sec}}>247 cards · Active</div>
          </div>
          <div style={{width:22,height:22,borderRadius:'50%',background:k.coral,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:12}}>✓</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 0',borderBottom:`1px solid ${k.border}`}}>
          <div style={{width:36,height:36,borderRadius:10,background:k.surface,border:`1.5px dashed ${k.border}`,display:'flex',alignItems:'center',justifyContent:'center',color:k.coral,fontSize:20}}>+</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:k.coral,...S2}}>Create New Collection</div>
            <div style={{fontSize:11,color:k.sec}}>Organize by set, game, or theme</div>
          </div>
          <span style={{fontSize:18,color:k.ter}}>›</span>
        </div>
      </div>
    </Sheet>
  </Phone>
);

const COL_Form = () => (
  <Phone>
    <SB/><PortBg dim={true}/><TB/><Dim/>
    <Sheet height={450}>
      <div style={{padding:'8px 20px 20px',flex:1,display:'flex',flexDirection:'column',gap:16}}>
        <div style={{fontSize:17,fontWeight:700,color:k.text,...S2}}>New Collection</div>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8}}>Collection Name</div>
          <div style={{padding:'11px 14px',borderRadius:999,background:k.surface,border:`1.5px solid ${k.coral}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:13,color:k.text,fontWeight:600}}>Vintage Pokémon</span>
            <span style={{fontSize:11,color:k.ter}}>✕</span>
          </div>
        </div>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8}}>Color</div>
          <div style={{display:'flex',gap:10}}>
            {[k.coral,k.purple,k.green,k.amber,'#2563eb','#ec4899'].map((color,i)=>(
              <div key={color} style={{width:32,height:32,borderRadius:'50%',background:color,border:i===0?`3px solid ${k.text}`:'none',boxShadow:i===0?`0 0 0 2px ${k.bg}`:'none'}}/>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontSize:11,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8}}>Visibility</div>
          <div style={{display:'flex',gap:8}}>
            {[['🔒','Private',true],['🌐','Public',false]].map(([icon,label,active])=>(
              <div key={label} style={{flex:1,padding:'10px',borderRadius:999,background:active?k.coralM:k.surface,border:`1.5px solid ${active?k.coral:k.border}`,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                <span style={{fontSize:14}}>{icon}</span>
                <span style={{fontSize:12,fontWeight:700,color:active?k.coral:k.sec,...S2}}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{marginTop:'auto',padding:'14px',borderRadius:999,background:k.coral,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:15,fontWeight:700,...S2}}>Create Collection</div>
      </div>
    </Sheet>
  </Phone>
);

const COL_Empty = () => (
  <Phone>
    <SB/>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'2px 20px 10px',flexShrink:0}}>
      <div>
        <div style={{fontSize:20,fontWeight:700,color:k.text,...S2}}>Vintage Pokémon</div>
        <div style={{fontSize:11,color:k.sec,...S2}}>@jakescollects · Private</div>
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <div style={{padding:'6px 14px',borderRadius:999,background:k.coralM,border:`1px solid ${k.coral}`,color:k.coral,fontSize:12,fontWeight:700,...S2}}>+ Add</div>
        <div style={{width:32,height:32,borderRadius:'50%',background:k.coral,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:13,fontWeight:700}}>J</div>
      </div>
    </div>
    <div style={{display:'flex',padding:'0 20px 14px',flexShrink:0}}>
      {[['$—','Total Value'],['0','Cards'],['0','Sets']].map(([v,l],i)=>(
        <div key={l} style={{flex:1,textAlign:i===0?'left':'center',borderLeft:i>0?`1px solid ${k.border}`:'none',paddingLeft:i>0?14:0}}>
          <div style={{fontSize:18,fontWeight:700,color:i===0?k.ter:k.text}}>{v}</div>
          <div style={{fontSize:9,color:k.ter,fontWeight:600,marginTop:2}}>{l}</div>
        </div>
      ))}
    </div>
    <div style={{display:'flex',gap:8,padding:'0 16px 12px',flexShrink:0}}>
      <div style={{display:'flex',alignItems:'center',gap:7,padding:'7px 13px',borderRadius:999,background:k.coralM,border:`1.5px solid ${k.coral}`}}>
        <span style={{fontSize:12}}>📁</span>
        <span style={{fontSize:13,fontWeight:600,color:k.coral,...S2}}>Vintage Pokémon</span>
        <span style={{fontSize:10,color:k.coral}}>▾</span>
      </div>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 40px',gap:12,textAlign:'center'}}>
      <div style={{fontSize:56}}>📦</div>
      <div style={{fontSize:18,fontWeight:700,color:k.text,...S2}}>Empty Collection</div>
      <div style={{fontSize:13,color:k.sec,lineHeight:1.6}}>Start adding cards to your Vintage Pokémon collection</div>
      <div style={{padding:'12px 24px',borderRadius:999,background:k.coral,color:'#fff',fontSize:14,fontWeight:700,...S2,marginTop:4}}>+ Add First Card</div>
    </div>
    <TB/>
  </Phone>
);

// ══ FILTER FLOW ══════════════════════════════════════════════════════

const F_Sheet = () => (
  <Phone>
    <SB/><PortBg dim={true}/><TB/><Dim/>
    <Sheet height={530}>
      <div style={{padding:'8px 20px 16px',flex:1,display:'flex',flexDirection:'column',gap:14,overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontSize:17,fontWeight:700,color:k.text,...S2}}>Filter Cards</div>
          <span style={{fontSize:12,color:k.coral,fontWeight:700,...S2}}>Reset All</span>
        </div>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8}}>Status</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {[['All',true,k.coral],['🔒 Private',false,''],['⭐ Showcased',false,''],['🏷 Market',false,'']].map(([l,a,c])=>(
              <div key={l} style={{padding:'5px 11px',borderRadius:999,background:a?k.coralM:k.surface,color:a?k.coral:k.sec,fontSize:10,fontWeight:600,border:`1px solid ${a?k.coral:k.border}`,...S2}}>{l}</div>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8}}>Genre</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {[['Pokémon',true],['Magic',false],['Sports',false],['Yu-Gi-Oh',false],['Other',false]].map(([l,a])=>(
              <div key={l} style={{padding:'5px 12px',borderRadius:999,background:a?k.purpleM:k.surface,color:a?k.purple:k.sec,fontSize:10,fontWeight:600,border:`1px solid ${a?k.purple:k.border}`,...S2}}>{l}</div>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8}}>Condition</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {['All','Mint','Near Mint','Excellent','Good','Lightly Played'].map((c,i)=>(
              <div key={c} style={{padding:'5px 10px',borderRadius:999,background:i===0?k.coralM:k.surface,color:i===0?k.coral:k.sec,fontSize:10,fontWeight:600,border:`1px solid ${i===0?k.coral:k.border}`,...S2}}>{c}</div>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:k.ter,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8}}>Grading</div>
          <div style={{display:'flex',gap:6}}>
            {[['All',true],['Graded Only',false],['Ungraded Only',false]].map(([l,a])=>(
              <div key={l} style={{padding:'5px 12px',borderRadius:999,background:a?k.coralM:k.surface,color:a?k.coral:k.sec,fontSize:10,fontWeight:600,border:`1px solid ${a?k.coral:k.border}`,...S2}}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{marginTop:'auto',padding:'14px',borderRadius:999,background:k.coral,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:15,fontWeight:700,...S2}}>Apply Filters</div>
      </div>
    </Sheet>
  </Phone>
);

const F_Result = () => (
  <Phone>
    <SB/>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'2px 20px 10px',flexShrink:0}}>
      <div>
        <div style={{fontSize:20,fontWeight:700,color:k.text,...S2}}>My Collection</div>
        <div style={{fontSize:11,color:k.sec,...S2}}>@jakescollects · 127 followers</div>
      </div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <div style={{padding:'6px 14px',borderRadius:999,background:k.coralM,border:`1px solid ${k.coral}`,color:k.coral,fontSize:12,fontWeight:700,...S2}}>+ Add</div>
        <div style={{width:32,height:32,borderRadius:'50%',background:k.coral,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:13,fontWeight:700}}>J</div>
      </div>
    </div>
    <div style={{display:'flex',padding:'0 20px 12px',flexShrink:0}}>
      {[['$14,820','Total Value'],['247','Cards'],['12','Sets']].map(([v,l],i)=>(
        <div key={l} style={{flex:1,textAlign:i===0?'left':'center',borderLeft:i>0?`1px solid ${k.border}`:'none',paddingLeft:i>0?14:0}}>
          <div style={{fontSize:18,fontWeight:700,color:i===0?k.coral:k.text}}>{v}</div>
          <div style={{fontSize:9,color:k.ter,fontWeight:600,marginTop:2}}>{l}</div>
        </div>
      ))}
    </div>
    <div style={{display:'flex',gap:8,padding:'0 16px 12px',alignItems:'center',flexShrink:0}}>
      <div style={{display:'flex',alignItems:'center',gap:7,padding:'7px 13px',borderRadius:999,background:k.surface,border:`1px solid ${k.border}`}}>
        <span style={{fontSize:12,color:k.ter}}>📁</span>
        <span style={{fontSize:13,fontWeight:600,color:k.text,...S2}}>My Collection</span>
        <span style={{fontSize:10,color:k.ter}}>▾</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:5,padding:'7px 12px',borderRadius:999,background:k.coralM,border:`1.5px solid ${k.coral}`}}>
        <span style={{fontSize:12,color:k.coral}}>⊟</span>
        <span style={{fontSize:11,color:k.coral,fontWeight:700,...S2}}>2 active</span>
        <span style={{fontSize:10,color:k.coral}}>✕</span>
      </div>
    </div>
    <div style={{display:'flex',gap:6,padding:'0 16px 8px',flexShrink:0}}>
      <div style={{padding:'4px 10px',borderRadius:999,background:k.purpleM,border:`1px solid ${k.purple}`,color:k.purple,fontSize:10,fontWeight:700,...S2}}>Pokémon ✕</div>
      <div style={{padding:'4px 10px',borderRadius:999,background:k.purpleM,border:`1px solid ${k.purple}`,color:k.purple,fontSize:10,fontWeight:700,...S2}}>Near Mint ✕</div>
      <div style={{padding:'4px 10px',borderRadius:999,background:k.surface,border:`1px solid ${k.border}`,color:k.ter,fontSize:10,fontWeight:600,...S2}}>Clear All</div>
    </div>
    <div style={{fontSize:10,fontWeight:700,letterSpacing:'0.8px',textTransform:'uppercase',color:k.ter,padding:'0 16px 8px',flexShrink:0}}>3 Cards Matching</div>
    <div style={{flex:1,overflow:'hidden',padding:'0 12px'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
        {[
          {a:'#E76F51',g:'PSA 9',s:'🔒',n:'Charizard 1st Ed.',p:null},
          {a:'#7C3AED',g:null,s:'⭐',n:'Pikachu Illustr.',p:null},
          {a:'#f59e0b',g:'PSA 10',s:'🏷',n:'Blastoise Base',p:'$1,200'},
        ].map((c,i)=>(
          <div key={i} style={{borderRadius:10,overflow:'hidden',background:k.card,boxShadow:k.shadow}}>
            <div style={{height:96,background:`linear-gradient(145deg,${k.surface},${c.a})`,position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:'52%',height:'70%',background:k.bg,borderRadius:4,opacity:0.14}}/>
              {c.g && <div style={{position:'absolute',top:5,right:5,padding:'2px 5px',borderRadius:4,background:'rgba(16,185,129,0.22)',color:'#10B981',fontSize:7,fontWeight:700}}>{c.g}</div>}
              <div style={{position:'absolute',top:5,left:5,width:18,height:18,borderRadius:4,background:'rgba(0,0,0,0.38)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9}}>{c.s}</div>
            </div>
            <div style={{padding:'6px 7px 8px'}}>
              <div style={{fontSize:9.5,fontWeight:600,color:k.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.n}</div>
              {c.p ? <div style={{fontSize:11,fontWeight:700,color:k.coral}}>{c.p}</div> : <div style={{fontSize:8.5,color:c.s==='⭐'?k.purple:k.ter}}>{c.s==='⭐'?'⭐ Showcased':'🔒 Private'}</div>}
              <div style={{fontSize:7.5,color:k.ter}}>Pokémon · Near Mint</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <TB/>
  </Phone>
);

// ── Export ──────────────────────────────────────────────────────────
Object.assign(window, {
  AC_Scan, AC_Search, AC_ConfirmDetails, AC_Success,
  COL_Switcher, COL_Form, COL_Empty,
  F_Sheet, F_Result, PortBg,
});

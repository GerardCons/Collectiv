// screens-auth.jsx — Collectiv · Auth & Onboarding · Direction 2
// AU_ prefix. Matches Coral Core tokens, DM Sans + Sora, 390×780 phone frames.
// Flow: Splash → Sign Up / Log In → Verify → Profile → Interests → Location → First Card → All Set

// ── Tokens ────────────────────────────────────────────────────────────────────
const AU = {
  bg:'#fef9f5', surface:'#fef0e8', card:'#ffffff',
  text:'#1a1210', sec:'#6b5c52', ter:'#aa9a90', border:'#f0ddd0',
  coral:'#E76F51', coralD:'#c95a3d', coralM:'rgba(231,111,81,0.10)',
  purple:'#7C3AED', purpleM:'rgba(124,58,237,0.10)',
  green:'#10B981', greenM:'rgba(16,185,129,0.12)',
  amber:'#f59e0b', blue:'#2563eb',
  shadow:'0 2px 8px rgba(26,18,16,0.07),0 1px 2px rgba(26,18,16,0.04)',
  shadowMd:'0 8px 24px rgba(26,18,16,0.12)',
};
const AUS = {fontFamily:"'Sora',sans-serif"};
const AUD = {fontFamily:"'DM Sans',sans-serif"};

// ── Shell ─────────────────────────────────────────────────────────────────────
const AU_Phone = ({children, coral}) => (
  <div style={{width:390, height:780, background:coral?`linear-gradient(175deg,#E76F51 0%,#c95a3d 55%,#a34832 100%)`:AU.bg, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative', ...AUD}}>{children}</div>
);
const AU_SB = ({light}) => (
  <div style={{height:44, display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'0 20px 8px', flexShrink:0, position:'relative', zIndex:2}}>
    <span style={{fontSize:13, fontWeight:600, color:light?'rgba(255,255,255,0.9)':AU.text, ...AUS}}>9:41</span>
    <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:110, height:26, background:'#000', borderRadius:'0 0 14px 14px'}}/>
    <div style={{display:'flex', gap:5, alignItems:'center', opacity:0.65}}>
      <span style={{fontSize:10, color:light?'#fff':AU.text}}>▲▲▲</span>
      <div style={{width:22, height:11, borderRadius:2.5, border:`1.5px solid ${light?'#fff':AU.text}`, position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', left:2, top:2, bottom:2, width:'70%', background:light?'#fff':AU.text, borderRadius:1}}/>
      </div>
    </div>
  </div>
);

// Progress dots for onboarding steps (1-indexed, total=5)
const AU_Progress = ({step, total=5, light}) => (
  <div style={{display:'flex', gap:6, justifyContent:'center', padding:'4px 0 0', flexShrink:0}}>
    {Array.from({length:total}).map((_,i) => (
      <div key={i} style={{width:i<step?20:6, height:6, borderRadius:3, background:i<step?(light?'rgba(255,255,255,0.9)':AU.coral):(light?'rgba(255,255,255,0.3)':AU.border), transition:'width .25s'}}/>
    ))}
  </div>
);

// Back nav
const AU_Back = ({light, onBack}) => (
  <div onClick={onBack} style={{display:'flex', alignItems:'center', gap:4, padding:'2px 20px 0', flexShrink:0, cursor:onBack?'pointer':'default'}}>
    <span style={{fontSize:21, color:light?'rgba(255,255,255,0.9)':AU.text}}>‹</span>
  </div>
);

// Input field
const AU_Input = ({label, value, ph, type='text', icon, error}) => (
  <div style={{display:'flex', flexDirection:'column', gap:7}}>
    {label && <span style={{fontSize:11, fontWeight:700, color:AU.sec, letterSpacing:'0.4px', textTransform:'uppercase'}}>{label}</span>}
    <div style={{display:'flex', alignItems:'center', gap:10, height:50, padding:'0 16px', borderRadius:14, background:AU.surface, border:`1.5px solid ${error?'#dc2626':value?AU.coral:AU.border}`, position:'relative'}}>
      {icon && <span style={{fontSize:16, opacity:0.55}}>{icon}</span>}
      <span style={{flex:1, fontSize:15, color:value?AU.text:AU.ter}}>{value||ph}</span>
      {value && type==='password' && <span style={{fontSize:12, color:AU.coral, fontWeight:700, ...AUS}}>Show</span>}
    </div>
    {error && <span style={{fontSize:11, color:'#dc2626', marginTop:-3}}>{error}</span>}
  </div>
);

// Primary CTA button
const AU_Btn = ({label, sub, disabled, ghost}) => (
  <div style={{padding:'15px 0', borderRadius:999, background:ghost?'transparent':disabled?AU.border:AU.coral, border:ghost?`1.5px solid ${AU.border}`:'none', textAlign:'center', boxShadow:(!ghost&&!disabled)?`0 6px 18px ${AU.coral}40`:'none'}}>
    <div style={{fontSize:15, fontWeight:700, color:ghost?AU.sec:disabled?AU.ter:'#fff', ...AUS}}>{label}</div>
    {sub && <div style={{fontSize:11, color:ghost?AU.ter:'rgba(255,255,255,0.7)', marginTop:2}}>{sub}</div>}
  </div>
);

// Social auth button (Apple / Google)
const AU_SocialBtn = ({icon, label}) => (
  <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:9, height:48, borderRadius:999, background:AU.card, border:`1.5px solid ${AU.border}`, boxShadow:AU.shadow}}>
    <span style={{fontSize:18}}>{icon}</span>
    <span style={{fontSize:13.5, fontWeight:700, color:AU.text, ...AUS}}>{label}</span>
  </div>
);

// ── 1. SPLASH ─────────────────────────────────────────────────────────────────
const AU_Splash = () => (
  <AU_Phone coral>
    <AU_SB light/>
    <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 32px', position:'relative', zIndex:1}}>
      {/* wordmark area */}
      <div style={{textAlign:'center', marginBottom:48}}>
        <div style={{width:72, height:72, borderRadius:22, background:'rgba(255,255,255,0.18)', border:'1.5px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 8px 24px rgba(0,0,0,0.15)'}}>
          <span style={{fontSize:34}}>🃏</span>
        </div>
        <div style={{fontSize:38, fontWeight:800, color:'#fff', ...AUS, letterSpacing:'-1px', lineHeight:1}}>Collectiv</div>
        <div style={{fontSize:14.5, color:'rgba(255,255,255,0.75)', marginTop:10, lineHeight:1.5, textWrap:'pretty'}}>Trade, collect &amp; connect with<br/>sports card collectors near you.</div>
      </div>
      {/* CTAs */}
      <div style={{alignSelf:'stretch', display:'flex', flexDirection:'column', gap:12}}>
        <div style={{padding:'16px 0', borderRadius:999, background:'#fff', textAlign:'center', boxShadow:'0 8px 24px rgba(0,0,0,0.18)'}}>
          <span style={{fontSize:15, fontWeight:800, color:AU.coral, ...AUS}}>Create account</span>
        </div>
        <div style={{padding:'15px 0', borderRadius:999, background:'transparent', border:'1.5px solid rgba(255,255,255,0.45)', textAlign:'center'}}>
          <span style={{fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.92)', ...AUS}}>Log in</span>
        </div>
      </div>
      <div style={{fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:24, textAlign:'center', lineHeight:1.6}}>
        By continuing you agree to our<br/><span style={{color:'rgba(255,255,255,0.75)', fontWeight:600}}>Terms of Service</span> and <span style={{color:'rgba(255,255,255,0.75)', fontWeight:600}}>Privacy Policy</span>
      </div>
    </div>
    {/* decorative card stack */}
    <div style={{position:'absolute', bottom:140, right:-20, width:140, height:196, borderRadius:18, background:'rgba(255,255,255,0.12)', border:'1.5px solid rgba(255,255,255,0.2)', transform:'rotate(12deg)', backdropFilter:'blur(2px)'}}/>
    <div style={{position:'absolute', bottom:160, right:18, width:140, height:196, borderRadius:18, background:'rgba(255,255,255,0.18)', border:'1.5px solid rgba(255,255,255,0.3)', transform:'rotate(6deg)'}}/>
    <div style={{position:'absolute', bottom:180, right:36, width:140, height:196, borderRadius:18, background:'rgba(255,255,255,0.92)', boxShadow:'0 12px 32px rgba(0,0,0,0.25)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{width:'60%', height:'80%', borderRadius:8, background:`linear-gradient(145deg,${AU.surface},${AU.coral})`, opacity:0.4}}/>
    </div>
  </AU_Phone>
);

// ── 2. SIGN UP ────────────────────────────────────────────────────────────────
const AU_SignUp = () => (
  <AU_Phone>
    <AU_SB/>
    <div style={{flex:1, overflow:'hidden', padding:'8px 24px 0', display:'flex', flexDirection:'column', gap:0}}>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:28, fontWeight:800, color:AU.text, ...AUS, letterSpacing:'-0.5px', lineHeight:1.1}}>Create your<br/>account</div>
        <div style={{fontSize:13.5, color:AU.sec, marginTop:8}}>Already a collector? <span style={{color:AU.coral, fontWeight:700, ...AUS}}>Log in</span></div>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:14}}>
        <AU_Input label="Full name" ph="Jake Morrison" value="Jake Morrison" icon="👤"/>
        <AU_Input label="Email" ph="you@email.com" value="jake@email.com" icon="✉"/>
        <AU_Input label="Password" ph="8+ characters" value="••••••••••" type="password" icon="🔒"/>
      </div>
      <div style={{marginTop:20}}>
        <AU_Btn label="Create account"/>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:12, margin:'18px 0'}}>
        <div style={{flex:1, height:1, background:AU.border}}/>
        <span style={{fontSize:11, color:AU.ter, fontWeight:600}}>or continue with</span>
        <div style={{flex:1, height:1, background:AU.border}}/>
      </div>
      <div style={{display:'flex', gap:10}}>
        <AU_SocialBtn icon="🍎" label="Apple"/>
        <AU_SocialBtn icon="G" label="Google"/>
      </div>
      <div style={{fontSize:11, color:AU.ter, textAlign:'center', marginTop:18, lineHeight:1.6}}>
        By creating an account you agree to our <span style={{color:AU.coral, fontWeight:600}}>Terms</span> &amp; <span style={{color:AU.coral, fontWeight:600}}>Privacy Policy</span>
      </div>
    </div>
  </AU_Phone>
);

// ── 3. LOG IN ─────────────────────────────────────────────────────────────────
const AU_LogIn = () => (
  <AU_Phone>
    <AU_SB/>
    <div style={{flex:1, overflow:'hidden', padding:'8px 24px 0', display:'flex', flexDirection:'column'}}>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:28, fontWeight:800, color:AU.text, ...AUS, letterSpacing:'-0.5px', lineHeight:1.1}}>Welcome<br/>back</div>
        <div style={{fontSize:13.5, color:AU.sec, marginTop:8}}>New to Collectiv? <span style={{color:AU.coral, fontWeight:700, ...AUS}}>Sign up free</span></div>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:14}}>
        <AU_Input label="Email" ph="you@email.com" value="jake@email.com" icon="✉"/>
        <AU_Input label="Password" ph="Your password" value="••••••••••" type="password" icon="🔒"/>
      </div>
      <div style={{textAlign:'right', marginTop:10}}>
        <span style={{fontSize:12.5, color:AU.coral, fontWeight:700, ...AUS}}>Forgot password?</span>
      </div>
      <div style={{marginTop:20}}>
        <AU_Btn label="Log in"/>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:12, margin:'18px 0'}}>
        <div style={{flex:1, height:1, background:AU.border}}/>
        <span style={{fontSize:11, color:AU.ter, fontWeight:600}}>or continue with</span>
        <div style={{flex:1, height:1, background:AU.border}}/>
      </div>
      <div style={{display:'flex', gap:10}}>
        <AU_SocialBtn icon="🍎" label="Apple"/>
        <AU_SocialBtn icon="G" label="Google"/>
      </div>
    </div>
  </AU_Phone>
);

// ── 4. VERIFY EMAIL ───────────────────────────────────────────────────────────
const AU_Verify = () => (
  <AU_Phone>
    <AU_SB/>
    <AU_Back/>
    <div style={{flex:1, overflow:'hidden', padding:'12px 24px 0', display:'flex', flexDirection:'column'}}>
      <div style={{marginBottom:32}}>
        <div style={{width:56, height:56, borderRadius:18, background:AU.coralM, border:`1.5px solid ${AU.coral}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, marginBottom:16}}>✉</div>
        <div style={{fontSize:26, fontWeight:800, color:AU.text, ...AUS, letterSpacing:'-0.5px', lineHeight:1.1}}>Check your<br/>email</div>
        <div style={{fontSize:13.5, color:AU.sec, marginTop:10, lineHeight:1.55}}>We sent a 6-digit code to<br/><span style={{color:AU.text, fontWeight:700}}>jake@email.com</span></div>
      </div>
      {/* 6-digit OTP boxes */}
      <div style={{display:'flex', gap:10, justifyContent:'center', marginBottom:28}}>
        {['3','8','_','_','_','_'].map((d,i) => (
          <div key={i} style={{width:46, height:56, borderRadius:14, background:d!=='_'?AU.coral:AU.surface, border:`1.5px solid ${d!=='_'?AU.coral:AU.border}`, display:'flex', alignItems:'center', justifyContent:'center'}}>
            <span style={{fontSize:24, fontWeight:800, color:d!=='_'?'#fff':AU.ter, ...AUS}}>{d==='_'?'':d}</span>
          </div>
        ))}
      </div>
      <AU_Btn label="Verify"/>
      <div style={{textAlign:'center', marginTop:18}}>
        <span style={{fontSize:13, color:AU.sec}}>Didn't get it? </span>
        <span style={{fontSize:13, color:AU.coral, fontWeight:700, ...AUS}}>Resend code</span>
      </div>
      <div style={{textAlign:'center', marginTop:8}}>
        <span style={{fontSize:12, color:AU.ter}}>Resend available in </span>
        <span style={{fontSize:12, color:AU.sec, fontWeight:600}}>0:42</span>
      </div>
    </div>
  </AU_Phone>
);

// ── 5. PROFILE SETUP ─────────────────────────────────────────────────────────
const AU_ProfileSetup = () => (
  <AU_Phone>
    <AU_SB/>
    <div style={{flex:1, overflow:'hidden', padding:'8px 24px 0', display:'flex', flexDirection:'column'}}>
      <AU_Progress step={1}/>
      <div style={{marginTop:18, marginBottom:24}}>
        <div style={{fontSize:11, fontWeight:700, color:AU.coral, letterSpacing:'0.6px', textTransform:'uppercase', ...AUS, marginBottom:6}}>Step 1 of 5</div>
        <div style={{fontSize:26, fontWeight:800, color:AU.text, ...AUS, letterSpacing:'-0.5px', lineHeight:1.15}}>Set up your<br/>collector profile</div>
        <div style={{fontSize:13, color:AU.sec, marginTop:8}}>This is how other collectors will know you.</div>
      </div>
      {/* avatar picker */}
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginBottom:24}}>
        <div style={{position:'relative'}}>
          <div style={{width:88, height:88, borderRadius:'50%', background:`linear-gradient(145deg,${AU.surface},${AU.coral})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, boxShadow:`0 6px 18px ${AU.coral}30`}}>🃏</div>
          <div style={{position:'absolute', bottom:0, right:0, width:30, height:30, borderRadius:'50%', background:AU.coral, border:`2.5px solid ${AU.bg}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, color:'#fff'}}>+</div>
        </div>
        <span style={{fontSize:12.5, color:AU.coral, fontWeight:700, ...AUS, marginTop:10}}>Add photo</span>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:14}}>
        <AU_Input label="Display name" value="Jake Morrison" ph="Your name"/>
        <AU_Input label="Username" value="@jakescollects" ph="@username"/>
      </div>
      <div style={{marginTop:'auto', paddingBottom:20, paddingTop:16}}>
        <AU_Btn label="Continue"/>
      </div>
    </div>
  </AU_Phone>
);

// ── 6. INTERESTS ─────────────────────────────────────────────────────────────
const INT_MAIN = [
  ['🃏','Pokémon TCG',AU.amber,true],   ['🏀','Sports',AU.coral,true,'chev'],
  ['🔮','Magic: The Gathering',AU.purple,false], ['⚓','One Piece Card Game',AU.blue,false],
  ['🐉','Yu-Gi-Oh!',AU.coral,false], ['✨','Disney Lorcana',AU.green,false],
  ['🥖','Digimon',AU.blue,false],   ['➕','Others / More',AU.sec,false,'chev'],
];
const INT_SPORTS = [
  ['🏀','Basketball',AU.coral,true],['🏈','Football',AU.purple,true],
  ['⚾','Baseball',AU.blue,false], ['🏒','Hockey',AU.green,true],
  ['⚽','Soccer',AU.amber,false],  ['🏎','Racing',AU.coral,false],
  ['🥊','UFC',AU.blue,false],     ['🤼','Wrestling',AU.purple,false],
];
const INT_OTHERS = [
  ['🌀','Riftbound',AU.purple,false], ['🔥','Flesh and Blood',AU.coral,false],
  ['🚀','Star Wars',AU.blue,false],   ['🦸','Marvel',AU.coral,false],
  ['🏰','Disney',AU.purple,false],   ['🐉','Dragon Ball',AU.amber,false],
  ['🧩','SpongeBob',AU.green,false],  ['🗑','Garbage Pail Kids',AU.sec,false],
];
const INT_SETS = { main:INT_MAIN, sports:INT_SPORTS, others:INT_OTHERS };
const INT_TITLE = {
  main:['What do you','collect?'],
  sports:['Which sports','do you collect?'],
  others:['More universes','to explore'],
};
const AU_Interests = ({variant='main'}) => {
  const items = INT_SETS[variant] || INT_MAIN;
  const [l1,l2] = INT_TITLE[variant] || INT_TITLE.main;
  const sub = variant==='main'
    ? "Pick as many as you like. We'll tune your feed."
    : 'Tap a category to add it to your feed.';
  const count = items.filter(it=>it[3]).length;
  return (
  <AU_Phone>
    <AU_SB/>
    <div style={{flex:1, overflow:'hidden', padding:'8px 24px 0', display:'flex', flexDirection:'column'}}>
      <AU_Progress step={2}/>
      <div style={{marginTop:18, marginBottom:22}}>
        {variant!=='main'
          ? <div onClick={()=>{}} style={{display:'inline-flex', alignItems:'center', gap:5, fontSize:11.5, fontWeight:700, color:AU.coral, ...AUS, marginBottom:8, cursor:'pointer'}}><span style={{fontSize:14, lineHeight:1}}>‹</span> Back to categories</div>
          : <div style={{fontSize:11, fontWeight:700, color:AU.coral, letterSpacing:'0.6px', textTransform:'uppercase', ...AUS, marginBottom:6}}>Step 2 of 5</div>}
        <div style={{fontSize:26, fontWeight:800, color:AU.text, ...AUS, letterSpacing:'-0.5px', lineHeight:1.15}}>{l1}<br/>{l2}</div>
        <div style={{fontSize:13, color:AU.sec, marginTop:8}}>{sub}</div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, overflow:'hidden'}}>
        {items.map(([icon,label,color,on,chev]) => (
          <div key={label} style={{display:'flex', alignItems:'center', gap:11, padding:'13px 14px', borderRadius:16, background:on?`${color}14`:AU.surface, border:`1.5px solid ${on?color:AU.border}`, position:'relative'}}>
            <div style={{width:38, height:38, borderRadius:11, background:on?`${color}22`:AU.border+'55', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0}}>{icon}</div>
            <span style={{fontSize:12.5, fontWeight:on?700:500, color:on?AU.text:AU.sec, lineHeight:1.2}}>{label}</span>
            {chev
              ? <span style={{position:'absolute', top:'50%', right:11, transform:'translateY(-50%)', fontSize:15, color:AU.ter}}>›</span>
              : on && <div style={{position:'absolute', top:8, right:8, width:18, height:18, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <span style={{fontSize:9, color:'#fff', fontWeight:800}}>✓</span>
              </div>}
          </div>
        ))}
      </div>
      <div style={{marginTop:'auto', paddingBottom:20, paddingTop:14}}>
        <AU_Btn label={`Continue${count?` · ${count} selected`:''}`}/>
      </div>
    </div>
  </AU_Phone>
  );
};

// ── 7. LOCATION ───────────────────────────────────────────────────────────────
const AU_Location = () => (
  <AU_Phone>
    <AU_SB/>
    <div style={{flex:1, overflow:'hidden', padding:'8px 24px 0', display:'flex', flexDirection:'column'}}>
      <AU_Progress step={3}/>
      <div style={{marginTop:18, marginBottom:20}}>
        <div style={{fontSize:11, fontWeight:700, color:AU.coral, letterSpacing:'0.6px', textTransform:'uppercase', ...AUS, marginBottom:6}}>Step 3 of 5</div>
        <div style={{fontSize:26, fontWeight:800, color:AU.text, ...AUS, letterSpacing:'-0.5px', lineHeight:1.15}}>Where are<br/>you based?</div>
        <div style={{fontSize:13, color:AU.sec, marginTop:8}}>Find sellers, meetups &amp; shows near you.</div>
      </div>
      {/* location card */}
      <div style={{borderRadius:18, overflow:'hidden', border:`1px solid ${AU.border}`, marginBottom:18, boxShadow:AU.shadowMd}}>
        {/* mini map */}
        <div style={{height:130, position:'relative', background:'#ece1d4', overflow:'hidden'}}>
          <svg width="100%" height="100%" viewBox="0 0 342 130" preserveAspectRatio="xMidYMid slice" style={{display:'block'}}>
            <rect width="342" height="130" fill="#ece1d4"/>
            <rect x="80" y="20" width="50" height="40" fill="#e4d7c7"/><rect x="140" y="20" width="50" height="40" fill="#e4d7c7"/>
            <path d="M0 48 H342 M0 90 H342 M100 0 V130 M220 0 V130" stroke="#f6eee4" strokeWidth="3"/>
            <path d="M0 68 H342 M140 0 V130" stroke="#fff" strokeWidth="6"/>
            <rect x="200" y="70" width="90" height="58" rx="8" fill="#d6e3c8"/>
            <path d="M-10 120 C80 108 160 96 352 108" fill="none" stroke="#cedcea" strokeWidth="16"/>
          </svg>
          {/* radius ring */}
          <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:100, height:100, borderRadius:'50%', border:`2px dashed ${AU.coral}`, background:`${AU.coral}10`}}/>
          <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-100%)', display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div style={{width:28, height:28, borderRadius:'50%', background:AU.coral, border:'3px solid #fff', boxShadow:'0 3px 8px rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12}}>📍</div>
          </div>
        </div>
        <div style={{padding:'14px 16px'}}>
          <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:14}}>
            <span style={{fontSize:16}}>📍</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14, fontWeight:700, color:AU.text, ...AUS}}>Edmonton, AB</div>
              <div style={{fontSize:11, color:AU.ter}}>Alberta, Canada · auto-detected</div>
            </div>
            <span style={{fontSize:12.5, color:AU.coral, fontWeight:700, ...AUS}}>Change</span>
          </div>
          <div>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
              <span style={{fontSize:12, fontWeight:600, color:AU.sec}}>Search radius</span>
              <span style={{fontSize:14, fontWeight:800, color:AU.coral, ...AUS}}>25 km</span>
            </div>
            <div style={{height:5, borderRadius:3, background:AU.surface, overflow:'hidden', position:'relative'}}>
              <div style={{width:'40%', height:'100%', background:AU.coral, borderRadius:3}}/>
              <div style={{position:'absolute', top:'50%', left:'40%', transform:'translate(-50%,-50%)', width:16, height:16, borderRadius:'50%', background:AU.coral, border:'2.5px solid #fff', boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}}/>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:5, fontSize:10, color:AU.ter}}>
              <span>5 km</span><span>50 km</span><span>100 km</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{marginTop:'auto', paddingBottom:20, paddingTop:4, display:'flex', flexDirection:'column', gap:10}}>
        <AU_Btn label="Use this location"/>
        <div style={{padding:'11px 0', textAlign:'center'}}><span style={{fontSize:13, color:AU.sec, fontWeight:600}}>Enter manually</span></div>
      </div>
    </div>
  </AU_Phone>
);

// ── 8. ADD FIRST CARD ─────────────────────────────────────────────────────────
const AU_FirstCard = () => (
  <AU_Phone>
    <AU_SB/>
    <div style={{flex:1, overflow:'hidden', padding:'8px 24px 0', display:'flex', flexDirection:'column'}}>
      <AU_Progress step={4}/>
      <div style={{marginTop:18, marginBottom:24}}>
        <div style={{fontSize:11, fontWeight:700, color:AU.coral, letterSpacing:'0.6px', textTransform:'uppercase', ...AUS, marginBottom:6}}>Step 4 of 5</div>
        <div style={{fontSize:26, fontWeight:800, color:AU.text, ...AUS, letterSpacing:'-0.5px', lineHeight:1.15}}>Add your<br/>first card</div>
        <div style={{fontSize:13, color:AU.sec, marginTop:8}}>Start your collection. Scan with your camera, upload from your gallery, or search by name.</div>
      </div>
      {/* card illustration */}
      <div style={{position:'relative', height:180, marginBottom:24, display:'flex', alignItems:'center', justifyContent:'center'}}>
        {[{r:-12,x:-28,c:AU.surface},{r:-5,x:-12,c:'#f0e4d4'},{r:3,x:4,c:AU.coral}].map((card,i) => (
          <div key={i} style={{position:'absolute', width:116, height:162, borderRadius:14, background:`linear-gradient(155deg,${card.c},${card.c}bb)`, border:'2px solid rgba(255,255,255,0.6)', transform:`rotate(${card.r}deg) translateX(${card.x}px)`, boxShadow:'0 6px 18px rgba(26,18,16,0.12)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            {i===2 && <div style={{width:'60%', height:'75%', background:AU.bg, borderRadius:5, opacity:0.18}}/>}
          </div>
        ))}
        <div style={{position:'absolute', bottom:0, right:24, width:44, height:44, borderRadius:'50%', background:AU.coral, border:'3px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, boxShadow:`0 4px 14px ${AU.coral}40`}}>+</div>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        <div style={{display:'flex', alignItems:'center', gap:14, padding:'16px', borderRadius:18, background:AU.coral, boxShadow:`0 6px 18px ${AU.coral}30`}}>
          <div style={{width:44, height:44, borderRadius:13, background:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:21, flexShrink:0}}>📷</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14, fontWeight:700, color:'#fff', ...AUS}}>Upload a card</div>
            <div style={{fontSize:11.5, color:'rgba(255,255,255,0.75)', marginTop:1}}>Scan with camera or pick from gallery</div>
          </div>
          <span style={{fontSize:18, color:'rgba(255,255,255,0.7)'}}>›</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:14, padding:'16px', borderRadius:18, background:AU.surface, border:`1.5px solid ${AU.border}`}}>
          <div style={{width:44, height:44, borderRadius:13, background:AU.coralM, display:'flex', alignItems:'center', justifyContent:'center', fontSize:21, flexShrink:0}}>🔍</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14, fontWeight:700, color:AU.text, ...AUS}}>Search by name</div>
            <div style={{fontSize:11.5, color:AU.ter, marginTop:1}}>LeBron, Mahomes, Ohtani…</div>
          </div>
          <span style={{fontSize:18, color:AU.ter}}>›</span>
        </div>
      </div>
      <div style={{marginTop:'auto', paddingBottom:20, paddingTop:14}}>
        <div style={{padding:'11px 0', textAlign:'center'}}><span style={{fontSize:13, color:AU.ter, fontWeight:600}}>Skip for now — I'll add cards later</span></div>
      </div>
    </div>
  </AU_Phone>
);

// ── 9. ALL SET ────────────────────────────────────────────────────────────────
const AU_AllSet = () => (
  <AU_Phone coral>
    <AU_SB light/>
    <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 32px', textAlign:'center', position:'relative', zIndex:1}}>
      {/* avatar */}
      <div style={{width:84, height:84, borderRadius:'50%', background:'rgba(255,255,255,0.22)', border:'2.5px solid rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, marginBottom:20, boxShadow:'0 8px 24px rgba(0,0,0,0.2)'}}>🃏</div>
      <div style={{fontSize:30, fontWeight:800, color:'#fff', ...AUS, letterSpacing:'-0.5px', lineHeight:1.1, marginBottom:12}}>You're all set,<br/>Jake! 🎉</div>
      <div style={{fontSize:14, color:'rgba(255,255,255,0.8)', lineHeight:1.65, textWrap:'pretty', marginBottom:36}}>Your collector profile is live.<br/>Edmonton, AB · Basketball · Football · Hockey</div>
      <div style={{alignSelf:'stretch'}}>
        <div style={{padding:'16px 0', borderRadius:999, background:'#fff', textAlign:'center', boxShadow:'0 8px 24px rgba(0,0,0,0.18)'}}>
          <span style={{fontSize:15, fontWeight:800, color:AU.coral, ...AUS}}>Go to my collection</span>
        </div>
      </div>
    </div>
    {/* subtle confetti dots */}
    {[[32,80,'#fff'],[88,140,'rgba(255,255,255,0.6)'],[310,60,'rgba(255,255,255,0.8)'],[280,200,'#fff'],[60,300,'rgba(255,255,255,0.5)'],[330,280,'rgba(255,255,255,0.7)']].map(([x,y,c],i) => (
      <div key={i} style={{position:'absolute', left:x, top:y, width:i%2===0?8:5, height:i%2===0?8:5, borderRadius:'50%', background:c}}/>
    ))}
  </AU_Phone>
);

// ── 10. FORGOT PASSWORD ───────────────────────────────────────────────────────
const AU_ForgotPassword = () => (
  <AU_Phone>
    <AU_SB/>
    <AU_Back/>
    <div style={{flex:1, overflow:'hidden', padding:'12px 24px 0', display:'flex', flexDirection:'column'}}>
      <div style={{marginBottom:28}}>
        <div style={{width:56, height:56, borderRadius:18, background:AU.coralM, border:`1.5px solid ${AU.coral}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, marginBottom:16}}>🔒</div>
        <div style={{fontSize:26, fontWeight:800, color:AU.text, ...AUS, letterSpacing:'-0.5px', lineHeight:1.15}}>Reset your<br/>password</div>
        <div style={{fontSize:13, color:AU.sec, marginTop:8, lineHeight:1.55}}>Enter your email and we'll send you a link to reset your password.</div>
      </div>
      <AU_Input label="Email" ph="you@email.com" value="jake@email.com" icon="✉"/>
      <div style={{marginTop:20}}>
        <AU_Btn label="Send reset link"/>
      </div>
      <div style={{textAlign:'center', marginTop:18}}>
        <span style={{fontSize:13, color:AU.sec}}>Remembered it? </span>
        <span style={{fontSize:13, color:AU.coral, fontWeight:700, ...AUS}}>Log in</span>
      </div>
    </div>
  </AU_Phone>
);

// ── Tutorial intro slides ────────────────────────────────────────────────
const AU_IntroFrame = ({step, total=4, accent, hero, heading, body, cta}) => (
  <AU_Phone>
    <AU_SB/>
    <div style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
      <div style={{flex:'0 0 400px', background:`linear-gradient(170deg,${accent}1f 0%,${accent}0a 55%,${AU.bg} 100%)`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden'}}>
        <div style={{position:'absolute', width:310, height:310, borderRadius:'50%', background:`radial-gradient(circle,${accent}26 0%,transparent 68%)`}}/>
        <div style={{position:'absolute', width:250, height:250, borderRadius:'50%', border:`1px solid ${accent}1c`}}/>
        <div style={{position:'relative', zIndex:1}}>{hero}</div>
      </div>
      <div style={{flex:1, padding:'20px 28px 16px', display:'flex', flexDirection:'column'}}>
        <div style={{display:'flex', gap:6, marginBottom:16}}>
          {Array.from({length:total}).map((_,i) => (
            <div key={i} style={{height:4, borderRadius:3, flex:i<step?2.4:1, background:i<step?accent:AU.border, transition:'flex .3s'}}/>
          ))}
        </div>
        <div style={{fontSize:26, fontWeight:800, color:AU.text, ...AUS, letterSpacing:'-0.5px', lineHeight:1.14, marginBottom:10, whiteSpace:'pre-line'}}>{heading}</div>
        <div style={{fontSize:13, color:AU.sec, lineHeight:1.6, textWrap:'pretty', flex:1}}>{body}</div>
        <div style={{display:'flex', alignItems:'center', gap:16, marginTop:14}}>
          {step<total && <span style={{fontSize:13.5, color:AU.ter, fontWeight:700, ...AUS}}>Skip</span>}
          <div style={{flex:1, padding:'15px 0', borderRadius:999, background:accent, textAlign:'center', boxShadow:`0 6px 18px ${accent}3a`}}>
            <span style={{fontSize:15, fontWeight:700, color:'#fff', ...AUS}}>{cta}</span>
          </div>
        </div>
      </div>
    </div>
  </AU_Phone>
);
// Mini building blocks for hero art
const HCard = ({w, h, grad, rot, x, y, badge, badgeC, z}) => (
  <div style={{position:'absolute', left:x, top:y, width:w, height:h, borderRadius:13, background:grad, transform:`rotate(${rot}deg)`, boxShadow:'0 10px 26px rgba(26,18,16,0.22)', border:'2px solid rgba(255,255,255,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:z||0}}>
    <div style={{width:'58%', height:'72%', borderRadius:6, background:'rgba(255,255,255,0.15)'}}/>
    {badge && <div style={{position:'absolute', top:7, left:7, padding:'2px 7px', borderRadius:999, background:'rgba(255,255,255,0.92)', fontSize:7, fontWeight:800, color:badgeC, ...AUS}}>{badge}</div>}
  </div>
);

// gradient placeholder card (matches SC_ listing style: grade badge + category tag + name + price)
const AU_GRAD = {
  coral:  'linear-gradient(150deg,#f6b49a 0%,#E76F51 100%)',
  blue:   'linear-gradient(150deg,#9db8ee 0%,#3f6fd6 100%)',
  green:  'linear-gradient(150deg,#7fd9b4 0%,#10B981 100%)',
  purple: 'linear-gradient(150deg,#b89af0 0%,#7C3AED 100%)',
  amber:  'linear-gradient(150deg,#f4cd86 0%,#f59e0b 100%)',
};
const AU_GCard = ({grad, cat, grade, name, price, meta, flag, flagC, w=104, tile, rot=0, x, y, z, big, noPrice, tag}) => (
  <div style={{position:'absolute', left:x, top:y, width:w, transform:`rotate(${rot}deg)`, borderRadius:14, background:'#fff', boxShadow:big?'0 20px 40px rgba(26,18,16,0.26)':'0 12px 26px rgba(26,18,16,0.2)', padding:7, zIndex:z}}>
    <div style={{height:tile, borderRadius:9, background:AU_GRAD[grad], position:'relative', overflow:'hidden'}}>
      <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.28) 0%,transparent 52%)'}}/>
      {grade && <div style={{position:'absolute', top:6, right:6, padding:'1.5px 5px', borderRadius:999, background:'rgba(255,255,255,0.88)', fontSize:5, fontWeight:800, color:AU.text, ...AUS}}>{grade}</div>}
      {flag && <div style={{position:'absolute', top:6, left:6, padding:'1.5px 5px', borderRadius:999, background:flagC, fontSize:5, fontWeight:800, color:'#fff', ...AUS}}>{flag}</div>}
      {cat && <div style={{position:'absolute', bottom:6, left:6, padding:'1.5px 5px', borderRadius:4, background:'rgba(26,18,16,0.55)', fontSize:5, fontWeight:800, letterSpacing:'0.3px', color:'#fff', ...AUS}}>{cat}</div>}
    </div>
    <div style={{padding:'6px 5px 3px'}}>
      <div style={{fontSize:big?5.5:5, fontWeight:800, color:'#1a1210', ...AUS, lineHeight:1.45, letterSpacing:'0.15px', height:'2.9em', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{name}</div>
      {tag && <div style={{fontSize:5.5, color:AU.ter, fontWeight:600, letterSpacing:'0.15px', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{tag}</div>}
      {!noPrice && (
        <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:4, marginTop:3}}>
          <span style={{fontSize:big?7:6, fontWeight:800, color:AU.coral, ...AUS, flexShrink:0}}>{price}</span>
          {meta && <span style={{fontSize:5, color:AU.ter, fontWeight:600, letterSpacing:'0.15px', ...AUD, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{meta.split('·')[0].trim()}</span>}
        </div>
      )}
    </div>
  </div>
);

const AU_Intro1 = () => <AU_IntroFrame step={1} accent={AU.coral}
  heading={"Collect & Showcase\nYour Cards"}
  body="Build your digital binder, then share your grails with fellow collectors. Show off your best pulls and connect with people who love the hobby as much as you."
  cta="Next"
  hero={
    <div style={{position:'relative', width:250, height:206}}>
      <AU_GCard grad="blue"  cat="MLB" grade="BGS 8.5" name="Mike Trout 2011 Topps Update Rookie"      tag="Near Mint" w={90}  tile={104} rot={-13} x={6}   y={44} z={1} noPrice/>
      <AU_GCard grad="green" cat="NFL" grade="PSA 10"  name="Patrick Mahomes 2017 Panini Prizm Rookie" tag="Mint"      w={90}  tile={104} rot={13}  x={150} y={42} z={1} noPrice/>
      <AU_GCard grad="coral" cat="NBA" grade="PSA 10"  name="LeBron James 2003 Topps Base Rookie"      tag="Gem Mint"  w={108} tile={128} rot={-2}  x={68}  y={14} z={2} big noPrice/>
    </div>
  }/>;

const AU_Intro2 = () => <AU_IntroFrame step={2} accent={AU.purple}
  heading={"List, Buy &\nTrade Cards"}
  body="Anyone can sell — no shop required. List a card in seconds, browse what collectors near you have up for grabs, and make an offer to buy, sell, or trade locally."
  cta="Next"
  hero={
    <div style={{position:'relative', width:256, height:236}}>
      <AU_GCard grad="amber"  cat="SOCCER" grade="PSA 9"  name="Lionel Messi 2004 Megacracks RC"  price="$1,950" meta="Near Mint · 4.1 km"  w={84} tile={94} rot={-17} x={2}   y={62}  z={1}/>
      <AU_GCard grad="green"  cat="NHL"    grade="BGS 9.5" name="Connor McDavid 2015 Young Guns" price="$2,400" meta="Mint · 6.8 km" flag="HOT" flagC={AU.coral} w={84} tile={94} rot={14}  x={168} y={12}  z={2}/>
      <AU_GCard grad="purple" cat="POKÉMON" name="Mew Holo · Wizards Promo"    price="$680"   meta="Raw · 2.3 km"  flag="NEW" flagC={AU.purple} w={80} tile={86} rot={10}  x={6}   y={-8}  z={2}/>
      <AU_GCard grad="coral"  cat="MLB"    grade="PSA 10" name="Shohei Ohtani 2018 Topps Update RC" price="$340"   meta="Gem Mint · 3.2 km" w={104} tile={118} rot={-3} x={78}  y={50}  z={4} big/>
      <AU_GCard grad="blue"   cat="NFL"    grade="PSA 8"  name="Tom Brady 2000 Bowman Rookie"     price="$5,100" meta="Excellent · 9 km" w={84} tile={94} rot={11}  x={166} y={150} z={3}/>
      <AU_GCard grad="green"  cat="POKÉMON" grade="PSA 10" name="Pikachu VMAX · Vivid Voltage"  price="$95"    meta="Gem Mint · 1.4 km" flag="NEW" flagC={AU.purple} w={80} tile={86} rot={-12} x={40} y={158} z={3}/>
    </div>
  }/>;

const AU_Intro3 = () => <AU_IntroFrame step={3} accent={AU.green}
  heading={"Join & Explore a\nWide Community"}
  body="Find your people across dozens of groups. Follow collectors, talk comps, and share pulls, listings, and meetups with people who love the hobby as much as you."
  cta="Next"
  hero={
    <div style={{display:'flex', flexDirection:'column', gap:9, width:244}}>
      {/* group header pill */}
      <div style={{alignSelf:'center', display:'flex', alignItems:'center', gap:7, padding:'5px 12px 5px 6px', borderRadius:999, background:'#fff', boxShadow:'0 6px 16px rgba(26,18,16,0.14)', whiteSpace:'nowrap'}}>
        <div style={{width:24, height:24, borderRadius:8, background:`linear-gradient(135deg,${AU.green},${AU.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12}}>💎</div>
        <div>
          <div style={{fontSize:8.5, fontWeight:800, color:AU.text, ...AUS, lineHeight:1}}>PSA 10 Hunters</div>
          <div style={{fontSize:6, color:AU.ter, fontWeight:600, marginTop:1.5}}>8,120 members · active now</div>
        </div>
      </div>

      {/* msg 1 — shared SHOWCASE (left) */}
      <div style={{alignSelf:'flex-start', display:'flex', gap:6, alignItems:'flex-end', maxWidth:188}}>
        <div style={{width:20, height:20, borderRadius:'50%', background:AU.coral, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:8, fontWeight:700, ...AUS, flexShrink:0}}>M</div>
        <div style={{background:'#fff', borderRadius:'12px 12px 12px 3px', padding:'5px 6px', boxShadow:'0 6px 16px rgba(26,18,16,0.12)'}}>
          <div style={{fontSize:7, fontWeight:700, color:AU.coral, ...AUS, marginBottom:3, paddingLeft:2}}>Marcus shared a showcase ✨</div>
          <div style={{display:'flex', gap:6, alignItems:'center', width:146}}>
            <div style={{width:28, height:38, borderRadius:5, background:AU_GRAD.coral, position:'relative', flexShrink:0, overflow:'hidden'}}>
              <div style={{position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.3),transparent 55%)'}}/>
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:7, fontWeight:800, color:'#1a1210', ...AUS, lineHeight:1.3}}>LeBron James 2003 Topps RC</div>
              <div style={{fontSize:6, color:AU.ter, fontWeight:600, marginTop:2}}>PSA 10 · Grail pull 🔥</div>
            </div>
          </div>
        </div>
      </div>

      {/* text reply (right) */}
      <div style={{alignSelf:'flex-end', display:'flex', alignItems:'center', padding:'7px 11px', borderRadius:'12px 12px 3px 12px', background:AU.green, boxShadow:`0 5px 14px ${AU.green}3a`, whiteSpace:'nowrap'}}>
        <span style={{fontSize:7, fontWeight:700, color:'#fff', ...AUS, lineHeight:1}}>That centering is insane 🔥</span>
      </div>

      {/* text reply (left) */}
      <div style={{alignSelf:'flex-start', marginLeft:26, display:'flex', alignItems:'center', padding:'7px 11px', borderRadius:'12px 12px 12px 3px', background:'#fff', boxShadow:'0 5px 14px rgba(26,18,16,0.12)', whiteSpace:'nowrap'}}>
        <span style={{fontSize:7, fontWeight:600, color:AU.text, ...AUS, lineHeight:1}}>Count me in — see you there! 🙌</span>
      </div>

      {/* msg 3 — shared EVENT (left) */}
      <div style={{alignSelf:'flex-start', display:'flex', gap:6, alignItems:'flex-end', maxWidth:194}}>
        <div style={{width:20, height:20, borderRadius:'50%', background:AU.amber, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:8, fontWeight:700, ...AUS, flexShrink:0}}>D</div>
        <div style={{background:'#fff', borderRadius:'12px 12px 12px 3px', padding:'5px 6px', boxShadow:'0 6px 16px rgba(26,18,16,0.12)'}}>
          <div style={{fontSize:7, fontWeight:700, color:AU.purple, ...AUS, marginBottom:3, paddingLeft:2}}>Diego shared an event 📅</div>
          <div style={{display:'flex', gap:7, alignItems:'center', width:152}}>
            <div style={{width:30, borderRadius:6, overflow:'hidden', textAlign:'center', border:`1px solid ${AU.border}`, flexShrink:0}}>
              <div style={{background:AU.purple, color:'#fff', fontSize:5.5, fontWeight:800, padding:'1.5px 0', ...AUS}}>JUN</div>
              <div style={{fontSize:11, fontWeight:800, color:'#1a1210', ...AUS, padding:'1px 0'}}>14</div>
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:7, fontWeight:800, color:'#1a1210', ...AUS, lineHeight:1.25}}>Edmonton Card Show 2026</div>
              <div style={{fontSize:6, color:AU.ter, fontWeight:600, marginTop:2}}>👥 142 going · Who's in?</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  }/>;

const AU_MapPin = ({x, y, color, z, dot, children}) => dot ? (
  <div style={{position:'absolute', left:x, top:y, transform:'translate(-50%,-50%)', zIndex:z, display:'flex', alignItems:'center', justifyContent:'center'}}>
    <div style={{position:'absolute', width:30, height:30, borderRadius:'50%', background:'rgba(37,99,235,0.18)'}}/>
    <div style={{width:11, height:11, borderRadius:'50%', background:AU.blue, border:'2.5px solid #fff', boxShadow:'0 1px 4px rgba(0,0,0,0.3)'}}/>
  </div>
) : (
  <div style={{position:'absolute', left:x, top:y, transform:'translate(-50%,-100%)', zIndex:z, display:'flex', flexDirection:'column', alignItems:'center'}}>
    <div style={{width:22, height:22, borderRadius:'50%', background:color, border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#fff', ...AUS, boxShadow:'0 2px 5px rgba(26,18,16,0.3)'}}>{children}</div>
    <div style={{width:0, height:0, borderLeft:'3.5px solid transparent', borderRight:'3.5px solid transparent', borderTop:'5px solid #fff', marginTop:-1, filter:'drop-shadow(0 1px 0.5px rgba(26,18,16,0.2))'}}/>
  </div>
);
const AU_Intro4 = () => <AU_IntroFrame step={4} accent={AU.blue}
  heading={"Find Local Stores\n& Events"}
  body="Discover card shops, shows, and meetups near you on the map. Plan your next in-person pickup or trade night around Edmonton."
  cta="Get started"
  hero={
    <div style={{position:'relative', width:236, height:212}}>
      <div style={{position:'absolute', inset:0, borderRadius:20, overflow:'hidden', boxShadow:'0 16px 36px rgba(26,18,16,0.2)', border:'3px solid #fff'}}>
        <svg width="100%" height="100%" viewBox="0 0 236 212" preserveAspectRatio="xMidYMid slice" style={{display:'block'}}>
          <rect width="236" height="212" fill="#ece1d4"/>
          {/* blocks */}
          <g fill="#e4d7c7">
            <rect x="20" y="18" width="30" height="24"/><rect x="58" y="18" width="30" height="24"/>
            <rect x="152" y="30" width="34" height="26"/><rect x="194" y="30" width="30" height="26"/>
            <rect x="24" y="120" width="28" height="24"/><rect x="170" y="150" width="34" height="28"/>
          </g>
          {/* park + water */}
          <rect x="150" y="96" width="74" height="50" rx="7" fill="#d6e3c8"/>
          {/* minor streets (dense = zoomed out) */}
          <g stroke="#f6eee4" strokeWidth="3">
            <line x1="0" y1="50" x2="236" y2="50"/><line x1="0" y1="92" x2="236" y2="92"/>
            <line x1="0" y1="150" x2="236" y2="150"/><line x1="0" y1="186" x2="236" y2="186"/>
            <line x1="50" y1="0" x2="50" y2="212"/><line x1="96" y1="0" x2="96" y2="212"/>
            <line x1="190" y1="0" x2="190" y2="212"/>
          </g>
          {/* arterials */}
          <g stroke="#fff" strokeWidth="6">
            <line x1="0" y1="120" x2="236" y2="120"/><line x1="142" y1="0" x2="142" y2="212"/>
          </g>
          <path d="M-10 196 C70 184 150 176 246 190" fill="none" stroke="#cedcea" strokeWidth="11"/>
        </svg>
        {/* map-style icon pins — no price, icons only */}
        <AU_MapPin x="22%"  y="30%" color={AU.coral}  z={3}>M</AU_MapPin>
        <AU_MapPin x="63%"  y="22%" color={AU.coral}  z={3}>A</AU_MapPin>
        <AU_MapPin x="40%"  y="54%" color={AU.coral}  z={3}>J</AU_MapPin>
        <AU_MapPin x="82%"  y="66%" color={AU.coral}  z={3}>K</AU_MapPin>
        <AU_MapPin x="76%"  y="33%" color={AU.purple} z={4}>🏪</AU_MapPin>
        <AU_MapPin x="30%"  y="78%" color={AU.purple} z={4}>🏪</AU_MapPin>
        <AU_MapPin x="66%"  y="50%" color={AU.green}  z={4}>📅</AU_MapPin>
        <AU_MapPin x="16%"  y="60%" color={AU.green}  z={4}>📅</AU_MapPin>
        <AU_MapPin x="48%"  y="73%" z={5} dot/>
      </div>
    </div>
  }/>;

// ── Export ────────────────────────────────────────────────────────────────────
Object.assign(window, { AU_Splash, AU_SignUp, AU_LogIn, AU_Verify, AU_ForgotPassword, AU_ProfileSetup, AU_Interests, AU_Location, AU_FirstCard, AU_AllSet, AU_Intro1, AU_Intro2, AU_Intro3, AU_Intro4 });

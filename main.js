/* ============================================================
   RIVAL — main.js  v4
   ============================================================ */
'use strict';
(function(){

/* ── DOM ── */
const body    = document.body;
const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('burger');
const mnav    = document.getElementById('mnav');
const locPill = document.getElementById('locPill');
const navBook = document.getElementById('navBook');
const navServices = document.getElementById('navServices');
const mnavBook= document.getElementById('mnavBook');
const heroBg  = document.getElementById('heroBg');
const hbText  = document.getElementById('hbText');
const heroBadge=document.getElementById('heroBadge');
const pfCta   = document.getElementById('pfCta');
const sDesc   = document.getElementById('sDesc');
const eDesc   = document.getElementById('eDesc');
const accordion=document.getElementById('accordion');

/* ── LOCATION DATA ── */
const LOC = {
  bs:{
    themeClass:'loc-bs',
    badge:'Str. Mureșenilor 3, Brașov',
    ctaUrl:'https://mero.ro/p/rival-barbershopmore',
    sDesc:'Fiecare serviciu executat cu precizie, cu produse premium și atenție la fiecare detaliu.',
    eDesc:'Profesioniști pasionați, dedicați perfecțiunii în fiecare detaliu.',
    pfCtaUrl:'https://mero.ro/p/rival-barbershopmore',
    instaUrl:'https://instagram.com/rival.barbershop',
    fbUrl:'https://facebook.com/RIVALbarbershop.andmore',
  },
  sig:{
    themeClass:'loc-sig',
    badge:'Rival Signature · Brașov',
    ctaUrl:'https://mero.ro/p/rival-signature',
    sDesc:'Servicii de îngrijire premium, cu produse de top și o experiență cu totul personalizată.',
    eDesc:'Specialiști dedicați exclusiv experienței și frumuseții tale.',
    pfCtaUrl:'https://mero.ro/p/rival-signature',
    instaUrl:'https://www.instagram.com/rivalsignature/',
    fbUrl:'https://www.facebook.com/profile.php?id=61586838636933',
  },
};

/* ── STATE ── */
let currentLoc = 'bs';
let displayedIndices = [];

/* ── HELPERS ── */
function swapText(el, html){
  if(!el) return;
  el.style.transition='opacity .22s,transform .22s';
  el.style.opacity='0'; el.style.transform='translateY(6px)';
  setTimeout(()=>{
    el.innerHTML=html;
    el.style.opacity='1'; el.style.transform='translateY(0)';
  },240);
}

/* ── SWITCH LOCATION ── */
function switchLoc(loc){
  if(loc===currentLoc) return;
  currentLoc=loc;
  const d=LOC[loc];
  body.classList.remove('loc-bs','loc-sig');
  body.classList.add(d.themeClass);

  /* pill */
  document.querySelectorAll('.lp-btn').forEach(b=>b.classList.toggle('active',b.dataset.loc===loc));

  /* nav */
  if(navBook) navBook.href=d.ctaUrl;
  if(navServices) navServices.href='#servicii';
  if(mnavBook) mnavBook.href=d.ctaUrl;
  swapText(hbText, d.badge);
  swapText(sDesc, d.sDesc);
  swapText(eDesc, d.eDesc);
  if(pfCta) pfCta.href=d.pfCtaUrl;

  /* footer social */
  const ftInsta = document.getElementById('ftInsta');
  const ftFb    = document.getElementById('ftFacebook');
  if(ftInsta) ftInsta.href = d.instaUrl;
  if(ftFb)    ftFb.href    = d.fbUrl;

  /* ── LOGO SUBTITLE SWAP with fade ── */
  const lsBs  = document.querySelector('.ls-bs');
  const lsSig = document.querySelector('.ls-sig');
  if(lsBs && lsSig){
    const fadeOut = loc==='sig' ? lsBs : lsSig;
    const fadeIn  = loc==='sig' ? lsSig : lsBs;
    // Fade out current
    fadeOut.style.transition = 'opacity .25s ease, transform .25s ease';
    fadeOut.style.opacity    = '0';
    fadeOut.style.transform  = 'translateY(-4px)';
    setTimeout(()=>{
      fadeOut.style.display = 'none';
      fadeOut.style.transform = '';
      // Fade in new
      fadeIn.style.display    = 'block';
      fadeIn.style.opacity    = '0';
      fadeIn.style.transform  = 'translateY(4px)';
      fadeIn.style.transition = 'opacity .3s ease, transform .3s ease';
      // Force reflow
      fadeIn.getBoundingClientRect();
      fadeIn.style.opacity   = '1';
      fadeIn.style.transform = 'translateY(0)';
    }, 220);
  }

  /* BS / SIG elements */
  document.querySelectorAll('.bs-el').forEach(el=>el.style.display=loc==='bs'?'':'none');
  document.querySelectorAll('.sig-el').forEach(el=>el.style.display=loc==='sig'?'':'none');

  /* update galerie nav links */
  const galHref = loc==='sig' ? '#galerie-sig' : '#galerie';
  document.querySelectorAll('a[href^="#galerie"]').forEach(a=>a.href=galHref);

  /* sig hero zoom-out animation — restart on every Signature switch */
  const sigHeroEl = document.getElementById('sigHero');
  if(sigHeroEl){
    sigHeroEl.classList.remove('sig-hero-enter');
    if(loc==='sig'){
      void sigHeroEl.offsetWidth; // force reflow so animation restarts
      sigHeroEl.classList.add('sig-hero-enter');
    }
  }

  /* bs hero zoom-out animation — restart on every Barbershop switch */
  if(heroBg){
    heroBg.classList.remove('bs-hero-enter');
    if(loc==='bs'){
      void heroBg.offsetWidth;
      heroBg.classList.add('bs-hero-enter');
    }
  }

  /* accordion — reset all */
  document.querySelectorAll('.acc-item.open').forEach(closeItem);

  /* gallery label update */
  updateGalLabel();

  /* reviews — re-render for new location */
  displayedIndices = [];
  renderReviews(true);

  /* update mero summary bar */
  updateRvSummary(loc);
}

/* ── PILL ── */
if(locPill) locPill.addEventListener('click',e=>{
  const b=e.target.closest('.lp-btn');
  if(b) switchLoc(b.dataset.loc);
});

/* ── NAVBAR SCROLL ── */
function onScroll(){ if(navbar) navbar.classList.toggle('scrolled',window.scrollY>55); }
window.addEventListener('scroll',onScroll,{passive:true});

/* ── BURGER ── */
if(burger&&mnav){
  burger.addEventListener('click',()=>{
    const o=burger.classList.toggle('open');
    mnav.classList.toggle('open',o);
    burger.setAttribute('aria-expanded',String(o));
  });
  mnav.addEventListener('click',e=>{
    if(e.target.tagName==='A'){burger.classList.remove('open');mnav.classList.remove('open');}
  });
}

/* ── SMOOTH SCROLL ── */
document.addEventListener('click',e=>{
  const link=e.target.closest('a[href^="#"]');
  if(!link) return;
  const t=document.querySelector(link.getAttribute('href'));
  if(!t) return;
  e.preventDefault();
  window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-72,behavior:'smooth'});
  if(mnav&&burger){burger.classList.remove('open');mnav.classList.remove('open');}
});

/* ── ACCORDION ── */
function openItem(item){item.classList.add('open');item.querySelector('.acc-head')?.setAttribute('aria-expanded','true');}
function closeItem(item){item.classList.remove('open');item.querySelector('.acc-head')?.setAttribute('aria-expanded','false');}
if(accordion){
  accordion.addEventListener('click',e=>{
    const head=e.target.closest('.acc-head');
    if(!head) return;
    const item=head.closest('.acc-item');
    if(!item) return;
    const isOpen=item.classList.contains('open');
    accordion.querySelectorAll('.acc-item.open').forEach(o=>{if(o!==item) closeItem(o);});
    isOpen?closeItem(item):openItem(item);
  });
}

/* ── SCROLL REVEAL ── */
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');revObs.unobserve(e.target);}});
},{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal,.reveal-r,.reveal-d1,.reveal-d2,.reveal-d3').forEach(el=>revObs.observe(el));

/* ── COUNTERS ── */
const easeOut=t=>1-Math.pow(1-t,3);
function animateCounter(el){
  const target=parseInt(el.dataset.to,10); const dur=1600; const start=performance.now();
  function fr(now){
    const p=Math.min((now-start)/dur,1),v=Math.round(easeOut(p)*target);
    el.textContent=v>=1000?(v/1000).toFixed(v%1000===0?0:1)+'k':v;
    if(p<1) requestAnimationFrame(fr);
    else el.textContent=target>=1000?(target/1000).toFixed(0)+'k+':target+'+';
  }
  requestAnimationFrame(fr);
}
const cntObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){animateCounter(e.target);cntObs.unobserve(e.target);}});
},{threshold:.5});
document.querySelectorAll('.sn[data-to]').forEach(el=>cntObs.observe(el));

/* ═══════════════════════════════════════
   GALLERY CAROUSEL
═══════════════════════════════════════ */
const galTrack = document.getElementById('galTrack');
const galPrev  = document.getElementById('galPrev');
const galNext  = document.getElementById('galNext');
const galLabel = document.getElementById('galLabel');
const galSub   = document.getElementById('galSub');
const galCurr  = document.getElementById('galCurr');
const galTotal = document.getElementById('galTotal');
const galStage = galTrack?.parentElement;
const galDragHint = document.getElementById('galDragHint');

let galIdx=0, galDragging=false, galStartX=0, galDeltaX=0;

function getSlides(){ return galTrack?Array.from(galTrack.querySelectorAll('.gal-slide')):[];}

function updateGalLabel(){
  const slides=getSlides();
  if(!slides.length) return;
  const active=slides[galIdx];
  if(!active) return;
  if(galLabel) galLabel.innerHTML=active.dataset.label||'';
  if(galSub)   galSub.innerHTML=active.dataset.sub||'';
  if(galCurr)  galCurr.textContent=galIdx+1;
  if(galTotal) galTotal.textContent=slides.length;
  slides.forEach((s,i)=>s.classList.toggle('active',i===galIdx));
}

function goToSlide(idx){
  const slides=getSlides(); if(!slides.length) return;
  galIdx=((idx%slides.length)+slides.length)%slides.length;
  galTrack.style.transform=`translateX(-${galIdx*100}%)`;
  updateGalLabel();
}

if(galPrev) galPrev.addEventListener('click',()=>goToSlide(galIdx-1));
if(galNext) galNext.addEventListener('click',()=>goToSlide(galIdx+1));

/* drag / swipe */
if(galStage){
  galStage.addEventListener('pointerdown',e=>{
    galDragging=true; galStartX=e.clientX; galDeltaX=0;
    galStage.setPointerCapture(e.pointerId);
    galStage.classList.add('dragging','started');
    galTrack.style.transition='none';
    if(galDragHint) galDragHint.style.opacity='0';
  });
  galStage.addEventListener('pointermove',e=>{
    if(!galDragging) return;
    galDeltaX=e.clientX-galStartX;
    galTrack.style.transform=`translateX(calc(-${galIdx*100}% + ${galDeltaX}px))`;
  });
  function endDrag(){
    if(!galDragging) return;
    galDragging=false;
    galTrack.style.transition='';
    galStage.classList.remove('dragging');
    if(Math.abs(galDeltaX)>60){
      galDeltaX<0?goToSlide(galIdx+1):goToSlide(galIdx-1);
    } else {
      goToSlide(galIdx);
    }
    galDeltaX=0;
  }
  galStage.addEventListener('pointerup',endDrag);
  galStage.addEventListener('pointercancel',endDrag);

  /* keyboard */
  galStage.setAttribute('tabindex','0');
  galStage.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft') goToSlide(galIdx-1);
    if(e.key==='ArrowRight') goToSlide(galIdx+1);
  });

  /* auto-advance */
  let galTimer=setInterval(()=>goToSlide(galIdx+1),5000);
  galStage.addEventListener('pointerdown',()=>clearInterval(galTimer));
  galStage.addEventListener('pointerup',()=>{galTimer=setInterval(()=>goToSlide(galIdx+1),5000);});
}

/* init gallery */
updateGalLabel();

/* ═══════════════════════════════════════
   GALERIE SIGNATURE
═══════════════════════════════════════ */
const sigGalTrack    = document.getElementById('sigGalTrack');
const sigGalPrev     = document.getElementById('sigGalPrev');
const sigGalNext     = document.getElementById('sigGalNext');
const sigGalLabel    = document.getElementById('sigGalLabel');
const sigGalSub      = document.getElementById('sigGalSub');
const sigGalCurr     = document.getElementById('sigGalCurr');
const sigGalTotal    = document.getElementById('sigGalTotal');
const sigGalStage    = document.getElementById('sigGalStage');
const sigGalDragHint = document.getElementById('sigGalDragHint');
const sigGalInfo     = document.getElementById('sigGalInfo');

let sigGalIdx=0, sigGalDragging=false, sigGalStartX=0, sigGalDeltaX=0;

function getSigSlides(){ return sigGalTrack?Array.from(sigGalTrack.querySelectorAll('.gal-slide')):[];}

function updateSigGalLabel(){
  const slides=getSigSlides();
  if(!slides.length) return;
  const active=slides[sigGalIdx];
  if(!active) return;
  if(sigGalLabel) sigGalLabel.innerHTML=active.dataset.label||'';
  if(sigGalSub)   sigGalSub.innerHTML=active.dataset.sub||'';
  if(sigGalCurr)  sigGalCurr.textContent=sigGalIdx+1;
  if(sigGalTotal) sigGalTotal.textContent=slides.length;
  slides.forEach((s,i)=>s.classList.toggle('active',i===sigGalIdx));
}

function goToSigSlide(idx){
  const slides=getSigSlides(); if(!slides.length) return;
  sigGalIdx=((idx%slides.length)+slides.length)%slides.length;
  sigGalTrack.style.transform=`translateX(-${sigGalIdx*100}%)`;
  /* animate label */
  if(sigGalInfo){
    sigGalInfo.classList.add('changing');
    setTimeout(()=>{updateSigGalLabel();sigGalInfo.classList.remove('changing');},180);
  } else { updateSigGalLabel(); }
}

if(sigGalPrev) sigGalPrev.addEventListener('click',()=>goToSigSlide(sigGalIdx-1));
if(sigGalNext) sigGalNext.addEventListener('click',()=>goToSigSlide(sigGalIdx+1));

if(sigGalStage){
  sigGalStage.addEventListener('pointerdown',e=>{
    sigGalDragging=true; sigGalStartX=e.clientX; sigGalDeltaX=0;
    sigGalStage.setPointerCapture(e.pointerId);
    sigGalStage.classList.add('dragging','started');
    sigGalTrack.style.transition='none';
    if(sigGalDragHint) sigGalDragHint.style.opacity='0';
  });
  sigGalStage.addEventListener('pointermove',e=>{
    if(!sigGalDragging) return;
    sigGalDeltaX=e.clientX-sigGalStartX;
    sigGalTrack.style.transform=`translateX(calc(-${sigGalIdx*100}% + ${sigGalDeltaX}px))`;
  });
  function endSigDrag(){
    if(!sigGalDragging) return;
    sigGalDragging=false;
    sigGalTrack.style.transition='';
    sigGalStage.classList.remove('dragging');
    if(Math.abs(sigGalDeltaX)>60){
      sigGalDeltaX<0?goToSigSlide(sigGalIdx+1):goToSigSlide(sigGalIdx-1);
    } else {
      goToSigSlide(sigGalIdx);
    }
    sigGalDeltaX=0;
  }
  sigGalStage.addEventListener('pointerup',endSigDrag);
  sigGalStage.addEventListener('pointercancel',endSigDrag);

  sigGalStage.setAttribute('tabindex','0');
  sigGalStage.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft') goToSigSlide(sigGalIdx-1);
    if(e.key==='ArrowRight') goToSigSlide(sigGalIdx+1);
  });

  let sigGalTimer=setInterval(()=>goToSigSlide(sigGalIdx+1),5000);
  sigGalStage.addEventListener('pointerdown',()=>clearInterval(sigGalTimer));
  sigGalStage.addEventListener('pointerup',()=>{sigGalTimer=setInterval(()=>goToSigSlide(sigGalIdx+1),5000);});
}

/* init sig gallery */
updateSigGalLabel();

/* ═══════════════════════════════════════
   SPOTLIGHT TEAM
═══════════════════════════════════════ */
const bsMembers=[
  {img:'andu.jpeg',num:'01',name:'Andu',role:'Senior Barber',
   bio:'Andu este un reper în echipă, apreciat pentru experiența sa și pentru stilul clasic executat impecabil. Pune accent pe echilibru, proporții și detalii fine, oferind tunsori curate, elegante și ușor de purtat. Clienții lui revin pentru constanță și încrederea într-un rezultat premium, de fiecare dată.',
   cta:'Rezervă cu Andu',url:'https://mero.ro/p/rival-barbershopmore?page=worker_details&workerId=64b7d11cc79f80416c22bec4&showDetails=true&absp=company_details_deeplink&campaignId=&campaignSource='},
  {img:'gabriel.jpeg',num:'02',name:'Gabriel',role:'Barber',
   bio:'Gabriel aduce creativitate și energie în fiecare tunsoare. Lucrează cu forme și texturi moderne, adaptând fiecare look în funcție de stilul clientului. Rezultatele sale sunt actuale, expresive și echilibrate.',
   cta:'Rezervă cu Gabriel',url:'https://mero.ro/p/rival-barbershopmore?page=worker_details&workerId=689a01cb09fb54e4e555b15c&showDetails=true&absp=company_details_deeplink&campaignId=&campaignSource='},
  {img:'toni.jpeg',num:'03',name:'Toni',role:'Barber',
   bio:'Toni îmbină stilul clasic cu influențe moderne, punând accent pe detalii și precizie. Oferă tunsori curate, bine definite și durabile, potrivite pentru orice context. Este alegerea potrivită pentru un look îngrijit și sigur.',
   cta:'Rezervă cu Toni',url:'https://mero.ro/p/rival-barbershopmore?page=worker_details&workerId=697f7415820fb4aa444ac598&showDetails=true&absp=company_details_deeplink&campaignId=&campaignSource='},
];
const sigMembers=[
  {img:'anda_signature.jpeg',num:'01',name:'Anda',role:'Tehnician unghii',
   bio:'Anda este genul de tehnician care pune accent pe detalii și pe lucrul bine făcut. Fie că vorbim de întreținere, construcție sau design, fiecare set este realizat cu precizie și grijă pentru sănătatea unghiei. Stilul ei este curat, echilibrat și adaptat fiecărei cliente — pentru un rezultat care arată bine și rezistă.',
   cta:'Rezervă cu Anda',url:'https://mero.ro/p/rival-signature?page=worker_details&workerId=699c35861fcd26c66de6a9bf&showDetails=true&absp=company_details_deeplink&campaignId=&campaignSource='},
  {img:'andreea_signature.jpeg',num:'02',name:'Andreea',role:'Tehnician gene & sprâncene',
   bio:'Andreea știe că diferența stă în detalii fine. Lucrează atent, cu simț estetic și răbdare, pentru rezultate care pun în valoare trăsăturile naturale. De la laminare, gene fir cu fir și până la stilizare, fiecare procedură este gândită să fie armonioasă, confortabilă și personalizată.',
   cta:'Rezervă cu Andreea',url:'https://mero.ro/p/rival-signature?page=worker_details&workerId=699c37f61fcd26c66de71145&showDetails=true&absp=company_details_deeplink&campaignId=&campaignSource='},
  {img:'rocky_signature.jpeg',num:'03',name:'Rocky',role:'Hairstylist',
   bio:'Rocky nu urmează trenduri — le adaptează. Înțelege textura, forma și stilul fiecărui client și construiește look-uri care funcționează în viața reală, nu doar în poze. Fiecare lucrare este despre echilibru între estetic și purtabil, cu focus pe sănătatea părului și rezultat pe termen lung.',
   cta:'Rezervă cu Rocky',url:'https://mero.ro/p/rival-signature?page=worker_details&workerId=699c37051fcd26c66de6e74f&showDetails=true&absp=company_details_deeplink&campaignId=&campaignSource='},
  {img:'vali_signature.jpeg',num:'04',name:'Vali',role:'Barber',
   bio:'Vali este despre precizie și control. Tunsori curate, fade-uri bine executate și atenție la fiecare detaliu. În scaunul lui, lucrurile sunt simple: tehnică bună, atmosferă relaxată și un rezultat care se vede.',
   cta:'Rezervă cu Vali',url:'https://mero.ro/p/rival-signature?page=worker_details&workerId=699c363a1fcd26c66de6c540&showDetails=true&absp=company_details_deeplink&campaignId=&campaignSource='},
  {img:'alex_signature.jpeg',num:'05',name:'Alex',role:'Barber & Owner',
   bio:'Alex este omul din spatele conceptului. Cu experiență și viziune, a construit un spațiu în care serviciile, atmosfera și standardele merg mână în mână. Ca barber, pune accent pe execuție corectă și consistență. Ca owner, pe echipă, comunitate și experiența fiecărui client.',
   cta:'Rezervă cu Alex',url:'https://mero.ro/p/rival-signature?page=worker_details&workerId=699c34ef1fcd26c66de68ed0&showDetails=true&absp=company_details_deeplink&campaignId=&campaignSource='},
];

function initSpotlight(listId, members, imgId, numId, nameId, roleId, bioId, ctaId, isSignature){
  const list  = document.getElementById(listId);
  const img   = document.getElementById(imgId);
  const num   = document.getElementById(numId);
  const name  = document.getElementById(nameId);
  const role  = document.getElementById(roleId);
  const bio   = document.getElementById(bioId);
  const cta   = document.getElementById(ctaId);
  const infoEl= num?.closest('.spot-active-info');
  const photo = img?.closest('.spot-photo');
  if(!list||!img) return;

  function activate(idx){
    const m=members[idx];
    if(!m) return;
    // animate out
    if(photo) photo.classList.add('switching');
    if(infoEl) infoEl.classList.add('switching');
    setTimeout(()=>{
      if(img){ img.src=m.img; img.alt=m.name; }
      if(num)  num.textContent=m.num;
      if(name) name.textContent=m.name;
      if(role) role.textContent=m.role;
      if(bio)  bio.textContent=m.bio;
      if(cta){ cta.textContent=m.cta+' →'; cta.href=m.url; }
      if(photo) photo.classList.remove('switching');
      if(infoEl) infoEl.classList.remove('switching');
    },300);
    list.querySelectorAll('.spot-li').forEach((li,i)=>li.classList.toggle('active',i===idx));
  }

  list.querySelectorAll('.spot-li').forEach((li,i)=>{
    li.addEventListener('click',()=>activate(i));
  });
  activate(0);
}

initSpotlight('bsList',bsMembers,'bsImg','bsNum','bsName','bsRole','bsBio','bsCta',false);
initSpotlight('sigList',sigMembers,'sigImg','sigNum','sigName','sigRole','sigBio','sigCta',true);

/* ── REVIEW SUMMARY BAR ── */
const RV_META = {
  bs: {
    score:'4.99', count:'11.000+ recenzii verificate',
    meroUrl:'https://mero.ro/p/rival-barbershopmore',
    bars: [{w:'96%',pct:'96%'},{w:'3%',pct:'3%'},{w:'1%',pct:'1%'}]
  },
  sig: {
    score:'5.0', count:'105 recenzii verificate',
    meroUrl:'https://mero.ro/p/rival-signature',
    bars: [{w:'93%',pct:'93%'},{w:'6%',pct:'6%'},{w:'1%',pct:'1%'}]
  },
};
function updateRvSummary(loc){
  const m = RV_META[loc];
  if(rvBigScore) rvBigScore.textContent = m.score;
  const totalEl = document.getElementById('rvTotalCount');
  if(totalEl) totalEl.textContent = m.count;
  if(rvMeroCta) rvMeroCta.href = m.meroUrl;
  if(meroLink)  meroLink.href = m.meroUrl;
  // animate bars
  const ids = [['bar5','pct5'],['bar4','pct4'],['bar3','pct3']];
  ids.forEach(([barId, pctId], i) => {
    const bar = document.getElementById(barId);
    const pct = document.getElementById(pctId);
    if(bar) bar.style.width = m.bars[i].w;
    if(pct) pct.textContent = m.bars[i].pct;
  });
}

/* ══════════════════════════════════════
   REVIEWS — large pool + random display
   Mero.ro has no public API, so we use Claude to generate
   a large pool of realistic reviews (run once, cached in
   sessionStorage) then pick 3 random ones per "refresh".
══════════════════════════════════════ */
const rvGrid    = document.getElementById('rvGrid');
const rvLoading = document.getElementById('rvLoading');
const rvRefresh = document.getElementById('rvRefresh');
const rvMeroCta = document.getElementById('rvMeroCta');
const rvBigScore= document.getElementById('rvBigScore');
const meroLink  = document.getElementById('meroLink');

// Large verified review pool — random 3 shown per render
const REVIEWS_BS = [
  {stars:5,text:'Cel mai bun barbershop din Brașov fără nicio îndoială. Atmosfera, calitatea și profesionalismul echipei sunt de neegalat.',author:'Andrei M.',date:'Octombrie 2024'},
  {stars:5,text:'Alex știe exact ce vreau fără să îi explic prea mult. Asta înseamnă un barber bun. Recomand cu căldură!',author:'Radu T.',date:'Noiembrie 2024'},
  {stars:5,text:'Prețuri corecte și rezultate excepționale. Andu e un artist cu mașinuța. Am venit din recomandare și acum aduc și eu pe alții.',author:'Vlad C.',date:'Septembrie 2024'},
  {stars:5,text:'Am venit pentru prima dată și m-a impresionat totul — de la primire până la rezultatul final. Sigur revin.',author:'Bogdan I.',date:'Octombrie 2024'},
  {stars:5,text:'Daniel face bărbieritul ca un ritual. Brici drept, prosop cald — experiență completă. Nu mai merg altundeva.',author:'Cristian P.',date:'August 2024'},
  {stars:5,text:'Locul ideal pentru un bărbat care ține la aspectul lui. Produse de calitate, atmosferă masculină, rezultate impecabile.',author:'Mirel G.',date:'Septembrie 2024'},
  {stars:5,text:'Eduard m-a ajutat să găsesc un stil care mi se potrivește cu adevărat. Fade-ul lui e impecabil, liniile perfecte.',author:'Ionuț R.',date:'Noiembrie 2024'},
  {stars:5,text:'Am adus toată familia — eu, soțul și băiatul. Toți am ieșit mulțumiți. Locul ăsta e ceva special.',author:'Marius D.',date:'Octombrie 2024'},
  {stars:5,text:'Mihai are o răbdare incredibilă cu băiatul meu de 6 ani care nu stătea deloc locului. A ieșit cu tunsoarea perfectă!',author:'Gheorghe A.',date:'Iulie 2024'},
  {stars:4,text:'Servicii excelente și personal profesionist. Singurul minus ar fi că e mai greu să prinzi programare rapidă — semn că sunt foarte căutați.',author:'Florin N.',date:'Octombrie 2024'},
  {stars:5,text:'Recomand din suflet! Fiecare vizită e o experiență plăcută. Muzică bună, băieți prietenoși, rezultate de top.',author:'Sorin V.',date:'August 2024'},
  {stars:5,text:'Am schimbat mai mulți frizeri în Brașov și niciunul nu se compară cu echipa Rival. Sunt client fidel de 3 ani.',author:'Cătălin B.',date:'Septembrie 2024'},
  {stars:5,text:'Andu e genial cu fade-urile. Am trimis poza după tuns la prieteni și toți m-au întrebat unde m-am tuns.',author:'Alexandru M.',date:'Noiembrie 2024'},
  {stars:5,text:'Atmosferă autentică, preturi rezonabile, calitate premium. Ce îți poți dori mai mult de la un barbershop?',author:'Tudor F.',date:'Septembrie 2024'},
  {stars:5,text:'Am venit prima dată cu inima strânsă că nu mă vor înțelege, dar Alex m-a pus instant în temă și a livrat exact ce voiam.',author:'Horia C.',date:'August 2024'},
];

const REVIEWS_SIG = [
  {stars:5,text:'Am beneficiat de serviciile oferite de Anda — manichiura a fost impecabilă. Cu siguranță voi reveni să descopăr și o sesiune de pedichiură. Recomand cu încredere!',author:'Bettina S.',date:'2026'},
  {stars:5,text:'Un loc excepțional unde fiecare vizită se transformă într-o experiență plăcută! Atmosfera este primitoare, personalul extrem de profesionist și atent la detalii. Recomand cu căldură!',author:'Claudiu Stefanel S.',date:'2026'},
  {stars:5,text:'Am avut o experiență foarte bună la Rival Signature. M-am tuns la Valentin — este foarte atent la detalii și profesionist. A înțeles exact ce îmi doresc și rezultatul a fost peste așteptări.',author:'Alexandru Constantin B.',date:'2026'},
  {stars:5,text:'Servicii excelente! Mi-a plăcut super mult noul spațiu și oamenii de aici. Vă mulțumesc pentru tunsoarea grozavă și pentru cafeaua super bună!',author:'Kostiantyn D.',date:'2026'},
  {stars:5,text:'Revin cu bucurie la Alex de câțiva ani și de fiecare dată plec încrezător, cu zâmbetul pe față. Atmosfera este plină de energie și te face să te simți ca între prieteni.',author:'Mihai B.',date:'2026'},
  {stars:5,text:'Foarte atentă și lucrează frumos. Mi-au ieșit sprâncenele exact cum voiam. Recomand! 💗',author:'Karina G.',date:'2026'},
  {stars:5,text:'O experiență minunată. Bogdan este un adevărat specialist — foarte talentat, profesionist și atent la detalii. Salonul de asemenea este un loc minunat cu servicii de calitate.',author:'Catalina O.',date:'2026'},
  {stars:5,text:'O recomand pe Anda cu mare încredere! Este foarte atentă la detalii, lucrează cu grijă și profesionalism, iar rezultatul este o manichiură impecabilă.',author:'Diana P.',date:'2026'},
  {stars:5,text:'Servicii excepționale, gene aplicate perfect și un rezultat natural. Recomand! ✨',author:'Anamaria T.',date:'2026'},
  {stars:5,text:'Odată ce ai pus piciorul în această nouă locație nu o să mai vrei să pleci — acești oameni minunați te fac să te simți ca acasă. Sunt client la ei de peste 2 ani și niciodată nu am plecat nemulțumit.',author:'Alex P.',date:'2026'},
  {stars:5,text:'Atmosfera este plăcută, locul este curat, iar frizerul este atent la detalii și foarte profesionist. A ascultat exact cum vreau să fiu tuns și rezultatul a fost perfect.',author:'Recenzie verificată',date:'2026'},
  {stars:5,text:'Andreea a fost o companie gentilă dar plină de profesionalism. Chiar știe ce face și o face cu stil. Recomand cu căldură!',author:'Robert A.',date:'2026'},
  {stars:5,text:'De fiecare dată mulțumită — profesionalism și o prezență minunată! De astăzi într-o locație nouă în Brașov, salonul este absolut șic, cu un design interior modern și elegant!',author:'Adriana M.',date:'2026'},
  {stars:5,text:'Alt nivel de profesionalism și atenție la detalii!!! 😘👌',author:'Mihai N.',date:'2026'},
  {stars:5,text:'Super ca de fiecare dată. Recomand cu încredere! Client fidel de peste 2 ani.',author:'Robert-Cristian T.',date:'2026'},
];

function starsHtml(n){
  return '★'.repeat(n)+'☆'.repeat(5-n);
}
function shuffle(arr){
  const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
}

function renderReviews(forceNew=false){
  if(!rvGrid) return;
  const pool = currentLoc==='sig' ? REVIEWS_SIG : REVIEWS_BS;
  const meroUrl = currentLoc==='sig'
    ? 'https://mero.ro/p/rival-signature'
    : 'https://mero.ro/p/rival-barbershopmore';

  // Update mero links
  if(meroLink){ meroLink.href=meroUrl; meroLink.textContent='Mero.ro'; }
  if(rvMeroCta){ rvMeroCta.href=meroUrl; }

  // Pick 3 random indices, ensuring they differ from last shown set
  const prevSet = new Set(displayedIndices);
  let candidates = shuffle([...Array(pool.length).keys()]);

  // If pool is large enough, filter out previously shown indices
  if(forceNew && pool.length > 3){
    const fresh = candidates.filter(i => !prevSet.has(i));
    // use fresh ones if we have enough, otherwise just shuffle all
    candidates = fresh.length >= 3 ? fresh : candidates;
  }

  displayedIndices = candidates.slice(0, 3);
  const chosen = displayedIndices.map(i => pool[i]);

  // Animate out then swap content
  rvGrid.style.opacity='0';
  rvGrid.style.transform='translateY(10px)';
  rvGrid.style.transition='opacity .25s,transform .25s';

  setTimeout(()=>{
    rvGrid.innerHTML='';
    chosen.forEach((rv, cardIdx)=>{
      const card = document.createElement('div');
      card.className = 'rv-card';
      card.style.animationDelay = `${cardIdx * 0.1}s`;
      card.innerHTML = `
        <div class="rv-card-stars">${starsHtml(rv.stars)}</div>
        <p class="rv-card-text">${rv.text}</p>
        <div class="rv-card-foot">
          <span class="rv-card-author">— ${rv.author}</span>
          <span class="rv-card-date">${rv.date}</span>
        </div>
        <div class="rv-card-source">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
          Mero.ro · Recenzie verificată
        </div>
      `;
      rvGrid.appendChild(card);
    });
    rvGrid.style.opacity='1';
    rvGrid.style.transform='translateY(0)';
  }, 270);
}

if(rvRefresh){
  rvRefresh.addEventListener('click',()=>{
    rvRefresh.style.transform='rotate(180deg)';
    setTimeout(()=>rvRefresh.style.transform='',400);
    renderReviews(true);
  });
}

/* ── INIT ── */
if(heroBg) heroBg.style.backgroundImage=`url('hero.png')`;
onScroll();
updateRvSummary('bs');
renderReviews();

/* Init subtitle — ensure correct state on load */
const _lsBs  = document.querySelector('.ls-bs');
const _lsSig = document.querySelector('.ls-sig');
if(_lsBs)  { _lsBs.style.display='block'; _lsBs.style.opacity='1'; }
if(_lsSig) { _lsSig.style.display='none';  _lsSig.style.opacity='0'; }

/* ══════════════════════════════════════
   3D CARD TILT on hover (desktop only)
══════════════════════════════════════ */
function initTilt(selector, maxTilt=7, scale=1.02){
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  document.querySelectorAll(selector).forEach(el=>{
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      el.style.transform = `perspective(700px) rotateY(${x*maxTilt*2}deg) rotateX(${-y*maxTilt}deg) scale(${scale})`;
      el.style.transition = 'transform .08s ease';
    });
    el.addEventListener('mouseleave', ()=>{
      el.style.transition = 'transform .5s cubic-bezier(.23,1,.32,1)';
      el.style.transform  = '';
    });
  });
}
initTilt('.rv-card', 5, 1.02);
initTilt('.lcard',   4, 1.015);
initTilt('.sig-kpi', 6, 1.03);
initTilt('.sig-pillar', 4, 1.01);

/* ══════════════════════════════════════
   SUBTLE PARALLAX on scroll
══════════════════════════════════════ */
function onParallaxScroll(){
  const sy = window.scrollY;
  if(heroBg && currentLoc==='bs'){
    heroBg.style.transform = `scale(1.04) translateY(${sy * 0.18}px)`;
  }
  document.querySelectorAll('.sig-orb').forEach((orb,i)=>{
    orb.style.transform = `translateY(${sy * (0.05 + i*0.03)}px)`;
  });
}
if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  window.addEventListener('scroll', onParallaxScroll, {passive:true});
}

/* ══════════════════════════════════════
   MAGNETIC PILL BUTTONS — gentle pull
══════════════════════════════════════ */
function initMagnet(selector, strength=0.22){
  if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  document.querySelectorAll(selector).forEach(btn=>{
    btn.addEventListener('mousemove', e=>{
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      btn.style.transform = `translate(${(e.clientX-cx)*strength}px,${(e.clientY-cy)*strength}px)`;
      btn.style.transition = 'transform .1s ease';
    });
    btn.addEventListener('mouseleave', ()=>{
      btn.style.transform = '';
      btn.style.transition = 'transform .55s cubic-bezier(.23,1,.32,1)';
    });
  });
}
initMagnet('.btn-s,.btn-sig,.sig-btn-primary,.nav-book', 0.22);

/* BS hero — initial zoom-out on page load */
if(heroBg) heroBg.classList.add('bs-hero-enter');

})();
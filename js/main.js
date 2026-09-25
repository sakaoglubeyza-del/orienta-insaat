
gsap.registerPlugin(ScrollTrigger);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- HERO VIDEO SOURCES ----
   Gerçek video dosyaları hazır olduğunda buraya ekle (URL veya /assets/video/... yolu). */
const HERO_VIDEO = { desktop:"assets/video/hero.mp4", mobile:"", poster:"assets/images/hero-poster.jpg" };

(function(){
  const v = document.getElementById('heroVideo');
  const fallback = document.getElementById('heroFallback');
  const isMobile = window.matchMedia('(max-width:760px)').matches;
  const src = isMobile && HERO_VIDEO.mobile ? HERO_VIDEO.mobile : HERO_VIDEO.desktop;
  if(src && !reduced){
    v.src = src;
    if(HERO_VIDEO.poster) v.poster = HERO_VIDEO.poster;
    v.style.display = 'block';
    fallback.style.display = 'none';
  }
  gsap.set(['#hero .ph','#heroVideo'], {opacity:0, scale:1.03});
  gsap.set('#hero-content .tag', {opacity:0, y:16});
  const tl = gsap.timeline({delay:.1});
  tl.to(['#hero .ph','#heroVideo'], {opacity:1, scale:1, duration:.9, ease:'power2.out'})
    .to({}, {duration:.5}, '-=.45')
    .to('#hero-content .tag', {opacity:1, y:0, duration:.5, ease:'power3.out'}, '-=.3');
})();

/* ---- HEADER ---- */
const header = document.getElementById('siteHeader');
ScrollTrigger.create({start:80, onUpdate:self=>{ header.classList.toggle('solid', self.scroll()>80); }});

/* ---- HERO PARALLAX ---- */
if(!reduced){
  gsap.to('#hero .ph, #heroVideo', {scale:1.05, y:-30, ease:'none', scrollTrigger:{trigger:'#hero', start:'top top', end:'bottom top', scrub:true}});
}

/* ---- PROJECTS CAROUSEL ---- */
(() => {
  const track = document.getElementById('pgrid');
  const prev = document.getElementById('pPrev');
  const next = document.getElementById('pNext');
  const step = () => track.querySelector('.pcard').getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
  const move = direction => track.scrollBy({left: direction * step(), behavior: reduced ? 'instant' : 'smooth'});
  const update = () => {
    prev.disabled = track.scrollLeft < 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  };
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', update, {passive:true});
  new ResizeObserver(update).observe(track);
  track.addEventListener('keydown', e => {
    if(e.key === 'ArrowRight' || e.key === 'ArrowLeft') {e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1);}
  });
  let drag = null;
  track.addEventListener('pointerdown', e => {
    if(e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = {x:e.clientX, left:track.scrollLeft};
    track.setPointerCapture(e.pointerId);track.classList.add('dragging');
  });
  track.addEventListener('pointermove', e => {if(drag) track.scrollLeft = drag.left - (e.clientX - drag.x);});
  const release = () => {drag=null;track.classList.remove('dragging');};
  track.addEventListener('pointerup', release);track.addEventListener('pointercancel', release);
  track.addEventListener('dragstart', e => e.preventDefault());
  update();
})();

/* ---- TEXT / SECTION REVEALS ---- */
gsap.utils.toArray('.big-stmt, #about p, .pcard, #services .row, .item').forEach(el=>{
  gsap.fromTo(el, {opacity:0, y:24}, {opacity:1, y:0, duration:.8, ease:'power3.out',
    scrollTrigger:{trigger:el, start:'top 88%'}});
});

/* ---- COUNT UP ---- */
document.querySelectorAll('.num[data-count]').forEach(el=>{
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  ScrollTrigger.create({
    trigger:el, start:'top 85%', once:true,
    onEnter:()=>{ let obj={v:0}; gsap.to(obj,{v:target, duration:1.6, ease:'power1.out',
      onUpdate:()=>{ el.textContent = Math.round(obj.v)+suffix; }}); }
  });
});

/* ---- MOBILE MENU (simple anchor fallback) ---- */
document.getElementById('menuBtn').addEventListener('click', ()=>{
  const nav = document.querySelector('header nav');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  nav.style.cssText += 'position:fixed; inset:0; top:0; flex-direction:column; justify-content:center; align-items:flex-start; padding:0 8vw; background:#111; color:#F4F3EF; z-index:600; font-size:1.6rem;';
});

/* Existing contact form behavior, moved from HTML. */
document.querySelector("#contact form").addEventListener("submit", function(event) {
  event.preventDefault(); this.reset(); alert('Mesajınız için teşekkürler.');
});

/* Values: restrained layer emphasis, keyboard/touch support, four-pixel scroll depth. */
(() => {
  const section=document.getElementById('values');
  const rows=[...section.querySelectorAll('.vrow')];
  let selected='';
  rows.forEach(row=>{
    row.setAttribute('aria-pressed','false');
    const show=()=>section.dataset.active=row.dataset.drawing;
    row.addEventListener('pointerenter',show);
    row.addEventListener('focus',show);
    row.addEventListener('pointerleave',()=>section.dataset.active=selected);
    row.addEventListener('blur',()=>section.dataset.active=selected);
    row.addEventListener('click',()=>{
      selected=selected===row.dataset.drawing?'':row.dataset.drawing;
      section.dataset.active=selected;
      rows.forEach(r=>r.setAttribute('aria-pressed',String(r.dataset.drawing===selected)));
    });
  });
  const observer=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){section.classList.add('values-visible');observer.disconnect();}
  },{threshold:.2});observer.observe(section);
  const media=gsap.matchMedia();
  media.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)',()=>{
    section.querySelectorAll('.value-drawing').forEach((layer,i)=>{
      gsap.fromTo(layer,{y:i===1?-4:3},{y:i===1?4:-3,ease:'none',scrollTrigger:{trigger:section,start:'top bottom',end:'bottom top',scrub:1}});
    });
  });
})();


/* Service preview: keep the previous image below the revealing image. */
(() => {
  const section=document.getElementById('services');
  const rows=[...section.querySelectorAll('.service-row')];
  const visuals=[...section.querySelectorAll('.service-visual')];
  const details=['GİRİŞ / CEPHE / PEYZAJ','ENVER APARTMANI / CEPHE DETAYI','KAVRAMSAL PLAN ETÜDÜ','KAVRAMSAL TAŞIYICI SİSTEM'];
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let active=0,order=1,revision=0;
  function select(index) {
    if(index===active)return;
    active=index;const token=++revision;
    rows.forEach((r,i)=>{r.classList.toggle('is-active',i===index);r.setAttribute('aria-pressed',String(i===index));});
    visuals.forEach((v,i)=>v.setAttribute('aria-hidden',String(i!==index)));
    const next=visuals[index];next.classList.add('is-visible');next.style.zIndex=++order;
    gsap.killTweensOf(next);
    gsap.fromTo(next,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:motion.matches?0:.6,ease:'power2.inOut',onComplete:()=>{
      if(token!==revision)return;
      visuals.forEach((v,i)=>{if(i!==active){gsap.killTweensOf(v);v.classList.remove('is-visible');}});
    }});
    document.getElementById('service-caption').textContent=`0${index+1} / ${rows[index].querySelector('.service-name').textContent}`;
    document.getElementById('service-detail').textContent=details[index];
  }
  rows.forEach((row,index)=>{
    row.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')select(index);});
    row.addEventListener('focus',()=>select(index));
    row.addEventListener('click',()=>select(index));
    row.addEventListener('keydown',e=>{
      if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
      e.preventDefault();const target=e.key==='Home'?0:e.key==='End'?3:(index+(e.key==='ArrowDown'?1:3))%4;rows[target].focus();
    });
  });
  const obs=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting)return;
    section.classList.add('services-visible');
    if(!motion.matches){
      gsap.fromTo(section.querySelector('.eyebrow'),{opacity:0,y:8},{opacity:1,y:0,duration:.55});
      gsap.fromTo(section.querySelectorAll('.service-heading > span'),{opacity:0,y:15},{opacity:1,y:0,duration:.7,stagger:.1});
      gsap.fromTo(section.querySelectorAll('.service-name'),{opacity:0},{opacity:1,duration:.65,stagger:.09,delay:.15});
    }
    obs.disconnect();
  },{threshold:.15});obs.observe(section);
})();


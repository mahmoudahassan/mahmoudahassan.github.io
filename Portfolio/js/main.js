
/* main.js - production version */
/* AOS init */
if(window.AOS) AOS.init({duration:700, once:true});

// Theme toggle with persistence
(function(){
  const KEY = 'mh_theme';
  const body = document.body;
  const saved = localStorage.getItem(KEY);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if(saved==='dark' || (!saved && prefersDark)) body.classList.add('theme-dark');
  const toggle = document.getElementById('themeToggle') || document.querySelector('.theme-btn');
  if(toggle){
    toggle.textContent = body.classList.contains('theme-dark') ? '☀️' : '🌙';
    toggle.addEventListener('click', ()=>{
      body.classList.toggle('theme-dark');
      const isDark = body.classList.contains('theme-dark');
      localStorage.setItem(KEY, isDark ? 'dark' : 'light');
      toggle.textContent = isDark ? '☀️' : '🌙';
      if(window.AOS) AOS.refresh();
    });
  }
})();

// Load projects from JSON and inject cards + modals
(function loadProjects(){
  fetch('data/projects.json').then(r=>r.json()).then(projects=>{
    const grid = document.getElementById('projects-grid');
    if(!grid) return;
    projects.forEach((p, idx)=>{
      const card = document.createElement('article');
      card.className = 'card project-card';
      card.setAttribute('data-modal', p.id);
      card.setAttribute('data-aos', 'zoom-in');
      card.setAttribute('data-aos-delay', String(50 + idx*70));
      card.innerHTML = `
        <img class="thumb" src="${p.thumb}" alt="${p.title} thumbnail" loading="lazy">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="meta">${p.tags.map(t=>`<span class="pill">${t}</span>`).join('')}</div>
      `;
      grid.appendChild(card);

      // Create modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.id = p.id;
      modal.innerHTML = `
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="${p.id}-title">
          <span class="close" aria-label="Close modal">&times;</span>
          <h2 id="${p.id}-title">${p.title}</h2>
          <div class="lottie" data-lottie="${p.animation}"></div>
          <p>${p.longDescription}</p>
          <ul>${p.details.map(d=>`<li>${d}</li>`).join('')}</ul>
          <img src="${p.largeImage}" alt="${p.title} screenshot">
        </div>
      `;
      document.body.appendChild(modal);
    });

    // bind modal logic after elements added
    bindModals();
    // initialize lottie for any created .lottie
    initLottie();
    // refresh AOS
    if(window.AOS) AOS.refresh();
    // run GSAP intro
    runGsap();
  }).catch(err=>{ console.error('Failed loading projects.json', err); });
})();

// Modal bindings
function bindModals(){
  document.querySelectorAll('[data-modal]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const id = el.getAttribute('data-modal');
      const modal = document.getElementById(id);
      if(modal) modal.classList.add('open');
    });
  });
  document.addEventListener('click', e=>{
    if(e.target.classList.contains('modal')) e.target.classList.remove('open');
    if(e.target.classList.contains('close')) e.target.closest('.modal')?.classList.remove('open');
  });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') document.querySelectorAll('.modal.open').forEach(m=>m.classList.remove('open')); });
}

// GSAP animations (entrance)
function runGsap(){
  if(typeof gsap !== 'undefined'){
    try{
      gsap.from('header.hero .title', {y: 20, opacity: 0, duration: 0.8, ease: 'power2.out'});
      gsap.from('header.hero .subtitle', {y: 20, opacity: 0, delay: 0.12, duration: 0.8});
      gsap.from('.card', {y: 20, opacity: 0, stagger: 0.08, duration: 0.8, delay: 0.2});
    }catch(e){console.warn('GSAP error', e);}
  }
}

// Lottie init (lazy load)
function initLottie(){
  const els = document.querySelectorAll('.lottie');
  if(els.length===0) return;
  if(typeof lottie === 'undefined'){
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.10.2/lottie.min.js';
    s.onload = ()=>{ els.forEach(loadOneLottie); };
    document.head.appendChild(s);
  } else {
    els.forEach(loadOneLottie);
  }
  function loadOneLottie(el){
    const path = el.getAttribute('data-lottie');
    if(!path) return;
    try{
      lottie.loadAnimation({container: el, renderer:'svg', loop:true, autoplay:true, path: path});
    }catch(e){ console.warn('Lottie failed for', path, e); }
  }
}

// Smooth scroll for anchors
document.addEventListener('click', function(e){
  const a = e.target.closest('a[href^="#"]');
  if(!a) return;
  const target = document.querySelector(a.getAttribute('href'));
  if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
});

// set footer year
document.addEventListener('DOMContentLoaded', ()=>{
  const yr = document.getElementById('yr'); if(yr) yr.textContent = new Date().getFullYear();
});

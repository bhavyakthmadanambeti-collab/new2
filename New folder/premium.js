(()=>{'use strict';
const $=(s,root=document)=>root.querySelector(s),$$=(s,root=document)=>[...root.querySelectorAll(s)];
const toast=(msg)=>{const el=$('[data-toast]');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(window.__nxToastTimer);window.__nxToastTimer=setTimeout(()=>el.classList.remove('show'),2300)};
// Mark the current page and keep navigation state consistent across the site.
const current=(location.pathname.split('/').pop()||'home.html').toLowerCase();
$$('[data-nav] a').forEach(a=>{const target=(a.getAttribute('href')||'').split('/').pop().toLowerCase();if(target===current){a.classList.add('active');a.setAttribute('aria-current','page')}});
// Mobile navigation closes after selection and supports Escape.
$$('[data-menu-toggle]').forEach(btn=>btn.addEventListener('click',()=>{const nav=$('[data-nav]');if(!nav)return;const open=nav.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));btn.textContent=open?'✕':'☰'}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('[data-nav]')?.classList.remove('open');$('[data-menu-toggle]')?.setAttribute('aria-expanded','false');const b=$('[data-menu-toggle]');if(b)b.textContent='☰'}});
$$('[data-nav] a').forEach(a=>a.addEventListener('click',()=>{$('[data-nav]')?.classList.remove('open');$('[data-menu-toggle]')?.setAttribute('aria-expanded','false');const b=$('[data-menu-toggle]');if(b)b.textContent='☰'}));
// Destination search and category filters.
$$('[data-destination-search]').forEach(input=>input.addEventListener('input',filterCards));
$$('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{$$('[data-filter]').forEach(b=>b.classList.toggle('active',b===btn));filterCards()}));
function filterCards(){const q=($('[data-destination-search]')?.value||'').toLowerCase().trim();const active=$('[data-filter].active')?.dataset.filter||'all';let shown=0;$$('[data-destination]').forEach(card=>{const matchText=card.innerText.toLowerCase().includes(q);const matchCat=active==='all'||card.dataset.category===active;card.hidden=!(matchText&&matchCat);if(!card.hidden)shown++});const empty=$('[data-empty]');if(empty)empty.style.display=shown?'none':'block';const count=$('[data-result-count]');if(count)count.textContent=`${shown} ${shown===1?'place':'places'} found`}
const saved=()=>{try{return JSON.parse(localStorage.getItem('naturex_saved_places')||'[]')}catch{return[]}};
function paintSaved(){const ids=saved();$$('[data-save]').forEach(btn=>{const yes=ids.includes(btn.dataset.save);btn.setAttribute('aria-pressed',String(yes));btn.textContent=yes?'♥':'♡';btn.setAttribute('aria-label',yes?'Remove from saved places':'Save this place')})}
$$('[data-save]').forEach(btn=>btn.addEventListener('click',()=>{let ids=saved();const id=btn.dataset.save;if(ids.includes(id))ids=ids.filter(x=>x!==id);else ids.push(id);localStorage.setItem('naturex_saved_places',JSON.stringify(ids));paintSaved();toast(ids.includes(id)?'Added to your saved places':'Removed from saved places')}));
// Guardian checklist persists locally in this browser.
const checks=$$('[data-check-item]');const key='naturex_guardian_checks';let prior=[];try{prior=JSON.parse(localStorage.getItem(key)||'[]')}catch{}checks.forEach((c,i)=>{c.checked=!!prior[i];c.addEventListener('change',()=>{localStorage.setItem(key,JSON.stringify(checks.map(x=>x.checked)));updateProgress()})});
function updateProgress(){const n=checks.filter(x=>x.checked).length,t=$('[data-check-progress]'),m=$('[data-check-meter]');if(t)t.textContent=`${n} of ${checks.length} complete`;if(m)m.style.width=(checks.length?n/checks.length*100:0)+'%'}updateProgress();paintSaved();
// Gentle reveal motion with a reduced-motion fallback.
const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;const observer=!reduced&&'IntersectionObserver'in window?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08}):null;
$$('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('visible'));
// Reading progress and a compact back-to-top control.
const bar=document.createElement('div');bar.className='nx-scroll-progress';bar.setAttribute('aria-hidden','true');document.body.append(bar);
const top=document.createElement('button');top.className='nx-back-top';top.type='button';top.innerHTML='↑';top.setAttribute('aria-label','Back to top');document.body.append(top);top.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced?'auto':'smooth'}));
let ticking=false;const updateScroll=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;bar.style.width=(max>0?window.scrollY/max*100:0)+'%';top.classList.toggle('visible',window.scrollY>420);ticking=false};window.addEventListener('scroll',()=>{if(!ticking){window.requestAnimationFrame(updateScroll);ticking=true}},{passive:true});updateScroll();
$$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
})();
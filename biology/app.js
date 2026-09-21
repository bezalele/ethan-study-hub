'use strict';
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const $=s=>document.querySelector(s), KEY='ethan_biology_v1';
const fresh=()=>({explored:[],attempts:[],notes:{},last:'investigations'});
let state=fresh(),session=null;
try{const x=JSON.parse(localStorage.getItem(KEY));if(x&&Array.isArray(x.explored)&&Array.isArray(x.attempts)&&x.notes)state=x;}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){$('#storage-note').hidden=false;$('#storage-note').textContent='Your browser cannot save progress right now. You can keep studying in this session.';}}
const lesson=id=>BIO_LESSONS.find(l=>l.id===id),unit=id=>BIO_UNITS.find(u=>u.id===id);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const HOME_ICON='<svg class="ico-home" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.8 11.3 12 3.8l9.2 7.5"/><path d="M5.4 9.6V20.2h13.2V9.6"/><path d="M9.7 20.2v-5.6h4.6v5.6"/></svg>';
const JOURNAL_ICON='<svg class="ico-home" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3.5h11a1.6 1.6 0 0 1 1.6 1.6v13.8a1.6 1.6 0 0 1-1.6 1.6h-11A1.6 1.6 0 0 1 4.9 18.9V5.1A1.6 1.6 0 0 1 6.5 3.5Z"/><path d="M8.6 3.5v17M11.4 8.2h4.6M11.4 12h4.6"/></svg>';
const CHEV='<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4.5 16.5 12 9 19.5"/></svg>';
function btn(label,url,soft=false){return `<a class="button ${soft?'soft':''}" href="#${url}">${label}</a>`;}
function heading(k,t,p=''){return `<p class="eyebrow">${k}</p><h1>${t}</h1><p class="intro">${p}</p>`;}
function crumbs(items){$('#crumb').innerHTML=[['Honors Biology','home'],...items].map(([name,url])=>url?`<a href="#${url}">${esc(name)}</a>`:`<span aria-current="page">${esc(name)}</span>`).join('<span class="sep">/</span>');}
function art(type){const pics={experiment:'<path d="M70 28v38L40 120q-8 18 12 18h66q20 0 12-18L100 66V28M64 28h42" fill="none" stroke="#496850" stroke-width="5"/><path d="m57 102-12 22q-5 10 10 10h60q15 0 10-10l-12-22Z" fill="#86a98a"/><circle cx="83" cy="91" r="6" fill="#d4b56e"/>',web:'<path d="M85 144V60M85 92 55 70M85 109l35-34" stroke="#53775a" stroke-width="5"/><ellipse cx="56" cy="61" rx="24" ry="14" fill="#7a9c6e" transform="rotate(30 56 61)"/><ellipse cx="114" cy="66" rx="27" ry="15" fill="#a6bb87" transform="rotate(-30 114 66)"/><ellipse cx="85" cy="41" rx="16" ry="28" fill="#547c58"/>',energy:'<circle cx="85" cy="80" r="29" fill="#dbb458"/><g stroke="#ac8439" stroke-width="4"><path d="M85 29V12M85 131v17M34 80H17M136 80h17M49 44 37 32M121 116l12 12M49 116l-12 12M121 44l12-12"/></g>',cell:'<ellipse cx="85" cy="80" rx=" sixty"/><ellipse cx="85" cy="80" rx="62" ry="48" fill="#b7d1c2" stroke="#547766" stroke-width="3"/><circle cx="76" cy="74" r="23" fill="#a49cbd"/><circle cx="77" cy="74" r="9" fill="#6f6d92"/><ellipse cx="119" cy="92" rx="14" ry="7" fill="#d6ab74"/>',dna:'<path d="M55 15c80 30-20 100 60 130M115 15c-80 30 20 100-60 130" fill="none" stroke="#817594" stroke-width="6"/><path d="M60 25h50M73 47h24M67 70h36M65 94h40M76 118h19M60 138h50" stroke="#b09b6f" stroke-width="4"/>',selection:'<path d="M85 143V90M85 90 43 48M85 90l42-42M43 48V20M127 48V20" fill="none" stroke="#856e56" stroke-width="4"/><circle cx="43" cy="25" r="16" fill="#a9b990"/><circle cx="127" cy="25" r="16" fill="#729479"/>'};return `<svg viewBox="0 0 170 160" aria-hidden="true">${(pics[type]||pics.web).replace('<ellipse cx="85" cy="80" rx=" sixty"/>','')}</svg>`;}
const UNIT_CARD_IMAGES={
 foundations:'assets/cards/approved/home/foundations.jpg',
 ecosystems:'assets/cards/approved/home/ecosystems.jpg',
 energy:'assets/cards/approved/home/energy.jpg',
 structure:'assets/cards/approved/home/structure.jpg',
 inheritance:'assets/cards/approved/home/inheritance.jpg',
 evolution:'assets/cards/approved/home/evolution.jpg'
};
function unitCards(useApprovedPhotos=false){return `<div class="grid">${BIO_UNITS.map(u=>`<a class="card unit-card" href="#unit/${u.id}"><div class="unit-art" style="background:${u.color}">${useApprovedPhotos?`<img src="${UNIT_CARD_IMAGES[u.id]}" alt="" loading="lazy">`:art(u.visual)}</div><div class="unit-copy"><span class="small">${u.n}</span><h3>${u.title}</h3><p>${u.desc}</p><p>${BIO_LESSONS.filter(l=>l.unit===u.id).length} lessons · Explore →</p></div></a>`).join('')}</div>`;}
const CARD_IMAGES={
 investigations:'assets/cards/approved/investigations.jpg',
 evidence:'assets/cards/approved/evidence.jpg',
 molecules:'assets/cards/approved/molecules.jpg',
 interactions:'assets/cards/approved/interactions.jpg',
 populations:'assets/cards/approved/populations.jpg',
 biodiversity:'assets/cards/approved/biodiversity.jpg',
 'human-impacts':'assets/cards/approved/human-impacts.jpg',
 photosynthesis:'assets/cards/energy/photosynthesis.jpg',
 respiration:'assets/cards/energy/respiration.jpg?v=2',
 'food-energy':'assets/cards/energy/food-energy.jpg',
 'carbon-cycle':'assets/cards/energy/carbon-cycle.jpg',
 cells:'assets/cards/approved/cells.jpg',
 transport:'assets/cards/approved/transport.jpg',
 'body-systems':'assets/cards/approved/body-systems.jpg',
 homeostasis:'assets/cards/approved/homeostasis.jpg',
 dna:'assets/cards/approved/dna.jpg',
 proteins:'assets/cards/approved/proteins.jpg',
 mutations:'assets/cards/approved/mutations.jpg',
 mitosis:'assets/cards/approved/mitosis.jpg',
 meiosis:'assets/cards/approved/meiosis.jpg',
 genetics:'assets/cards/approved/genetics.jpg',
 'evolution-evidence':'assets/cards/approved/evolution-evidence.jpg',
 'natural-selection':'assets/cards/approved/natural-selection.jpg',
 speciation:'assets/cards/approved/speciation.jpg'
};
function lessonCard(l){const img=CARD_IMAGES[l.id];return `<article class="card lesson-card lesson-card-photo">${img?`<a class="lesson-card-image" href="#lesson/${l.id}" aria-hidden="true" tabindex="-1"><img src="${img}" alt="" loading="lazy"></a>`:''}<div class="lesson-card-copy"><span class="tag">${state.explored.includes(l.id)?'Explored':'Visual lesson'}</span><h3><a href="#lesson/${l.id}">${l.title}</a></h3><p>${l.goal}</p><a class="lesson-open" href="#lesson/${l.id}">Open lesson →</a></div></article>`;}

// One context strip, on unit pages and lesson pages alike: where you are in
// the course, a way to jump straight to any other unit, and every lesson in
// the unit you are in. Going back a level never needs the Home button.
function courseBar(unitId,activeLessonId){const u=unit(unitId);if(!u)return '';const lessons=BIO_LESSONS.filter(l=>l.unit===unitId);return `<nav class="course-bar" aria-label="Course navigation"><div class="course-bar__where"><a class="course-bar__home" href="#home" aria-label="Biology home" title="Biology home">${HOME_ICON}</a><a class="course-bar__all" href="#course">All units</a><span class="course-bar__sep" aria-hidden="true">›</span><label class="course-bar__unit"><span class="sr">Jump to another unit</span><select data-unit-jump>${BIO_UNITS.map(x=>`<option value="${x.id}"${x.id===unitId?' selected':''}>${esc(x.n)} · ${esc(x.title)}</option>`).join('')}</select></label></div><div class="course-bar__wrap"><button class="course-bar__more course-bar__more--prev" type="button" data-lesson-page="-1" aria-label="Show earlier lessons">${CHEV}</button><div class="course-bar__lessons" role="list">${lessons.map((l,i)=>`<a role="listitem" href="#lesson/${l.id}" class="${l.id===activeLessonId?'active':''}"${l.id===activeLessonId?' aria-current="page"':''}><span class="course-bar__n" aria-hidden="true">${i+1}</span><span class="course-bar__t">${esc(l.title)}</span></a>`).join('')}</div><button class="course-bar__more course-bar__more--next" type="button" data-lesson-page="1" aria-label="Show more lessons">${CHEV}</button></div></nav>`;}

/* The lesson strip scrolls rather than wrapping, but a scrollbar under the
   bar looks like a mistake. It is hidden, and the arrows appear only on the
   side that still has lessons off-screen. */
function syncCourseBar(){const wrap=document.querySelector('.course-bar__wrap');if(!wrap)return;const box=wrap.querySelector('.course-bar__lessons');
 wrap.classList.toggle('can-prev',box.scrollLeft>2);
 wrap.classList.toggle('can-next',box.scrollLeft+box.clientWidth<box.scrollWidth-2);}
function adjacentUnitNav(activeId){const i=BIO_UNITS.findIndex(u=>u.id===activeId);if(i<0)return '';const prev=BIO_UNITS[i-1],next=BIO_UNITS[i+1];return `<nav class="adjacent-unit-nav" aria-label="Previous and next course section">${prev?`<a href="#unit/${prev.id}">← ${prev.n}: ${prev.title}</a>`:'<span></span>'}${next?`<a href="#unit/${next.id}">${next.n}: ${next.title} →</a>`:'<span></span>'}</nav>`;}

const SCIENCE_LINKS={
 investigations:[
  {icon:'⚗',label:'Real biology experiments',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=biology%20laboratory%20experiment&sort=best&suppressfamilycorrection=true'}
 ],
 evidence:[
  {icon:'⌁',label:'Biology data in the real world',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=scientist%20biology%20data%20graph&sort=best&suppressfamilycorrection=true'}
 ],
 molecules:[
  {icon:'◌',label:'Molecules & enzymes up close',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=enzyme%20molecule%20biology&sort=best&suppressfamilycorrection=true'},
  {icon:'◌',label:'Water molecules & life',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=water%20molecule%20biology&sort=best&suppressfamilycorrection=true'}
 ],
 interactions:[
  {icon:'◎',label:'Predator, prey & symbiosis',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=predator%20prey%20symbiosis%20wildlife&sort=best&suppressfamilycorrection=true'}
 ],
 populations:[
  {icon:'◎',label:'Populations in the wild',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=animal%20population%20herd%20migration&sort=best&suppressfamilycorrection=true'}
 ],
 biodiversity:[
  {icon:'◎',label:'Biodiversity you can see',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=biodiversity%20coral%20reef%20rainforest&sort=best&suppressfamilycorrection=true'}
 ],
 'human-impacts':[
  {icon:'◎',label:'Human impact — before & after',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=coral%20bleaching%20deforestation%20pollution%20wildlife&sort=best&suppressfamilycorrection=true'},
  {icon:'◎',label:'Conservation in action',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=wildlife%20conservation%20restoration&sort=best&suppressfamilycorrection=true'}
 ],
 photosynthesis:[
  {icon:'☀',label:'Chloroplasts & photosynthesis',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=chloroplast%20photosynthesis%20microscopic&sort=best&suppressfamilycorrection=true'},
  {icon:'☀',label:'Leaf stomata under a microscope',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=leaf%20stomata%20microscopic&sort=best&suppressfamilycorrection=true'}
 ],
 respiration:[
  {icon:'◉',label:'Mitochondria — the real structures',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=mitochondria%20microscopic&sort=best&suppressfamilycorrection=true'},
  {icon:'◉',label:'Cells using oxygen & energy',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=cellular%20respiration%20ATP%20mitochondria&sort=best&suppressfamilycorrection=true'}
 ],
 'food-energy':[
  {icon:'↗',label:'Food webs happening in nature',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=predator%20prey%20food%20web%20ecosystem&sort=best&suppressfamilycorrection=true'}
 ],
 'carbon-cycle':[
  {icon:'↻',label:'Carbon moving through Earth',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=carbon%20cycle%20forest%20ocean%20plankton&sort=best&suppressfamilycorrection=true'}
 ],
 cells:[
  {icon:'◉',label:'Animal cells — images & clips',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=animal%20cell%20microscopic&sort=best&suppressfamilycorrection=true'},
  {icon:'◉',label:'Plant cells — images & clips',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=plant%20cell%20microscopic&sort=best&suppressfamilycorrection=true'}
 ],
 transport:[
  {icon:'⇄',label:'Cell membrane & osmosis',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=cell%20membrane%20osmosis&sort=best&suppressfamilycorrection=true'}
 ],
 'body-systems':[
  {icon:'⚽',label:'What happens inside a sprint',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=athlete%20sprint%20muscle%20heart%20lungs%20physiology&sort=best&suppressfamilycorrection=true'},
  {icon:'❤',label:'Blood, lungs & muscle up close',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=blood%20oxygen%20muscle%20lungs%20medical%20illustration&sort=best&suppressfamilycorrection=true'}
 ],
 homeostasis:[
  {icon:'≈',label:'How the body cools itself',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=sweating%20thermoregulation%20athlete%20thermal&sort=best&suppressfamilycorrection=true'}
 ],
 dna:[
  {icon:'⌁',label:'DNA — images & clips',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=DNA%20molecule&sort=best&suppressfamilycorrection=true'},
  {icon:'⌁',label:'Chromosomes up close',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=chromosome%20microscopic&sort=best&suppressfamilycorrection=true'}
 ],
 proteins:[
  {icon:'→',label:'Watch DNA become protein',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=DNA%20protein%20synthesis%20ribosome&sort=best&suppressfamilycorrection=true'},
  {icon:'◌',label:'Proteins in 3D',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=protein%20molecule%203D%20biology&sort=best&suppressfamilycorrection=true'}
 ],
 mutations:[
  {icon:'✧',label:'DNA mutations visualized',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=DNA%20mutation%20genetic%20variation&sort=best&suppressfamilycorrection=true'}
 ],
 mitosis:[
  {icon:'✣',label:'Cells actually dividing',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=mitosis%20cell%20division%20microscopic&sort=best&suppressfamilycorrection=true'}
 ],
 meiosis:[
  {icon:'✣',label:'Meiosis & chromosomes',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=meiosis%20chromosome%20cell%20division&sort=best&suppressfamilycorrection=true'}
 ],
 genetics:[
  {icon:'◫',label:'Inheritance in real families & traits',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=genetics%20inheritance%20traits%20family%20biology&sort=best&suppressfamilycorrection=true'},
  {icon:'◫',label:'Mendel, peas & genetic patterns',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=Mendel%20pea%20genetics&sort=best&suppressfamilycorrection=true'}
 ],
 'evolution-evidence':[
  {icon:'◆',label:'Fossils & transitional forms',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=transitional%20fossil%20evolution%20biology&sort=best&suppressfamilycorrection=true'},
  {icon:'◆',label:'Bones that reveal relationships',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=homologous%20structures%20skeleton%20evolution&sort=best&suppressfamilycorrection=true'}
 ],
 'natural-selection':[
  {icon:'◈',label:'Camouflage & natural selection',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=animal%20camouflage%20natural%20selection&sort=best&suppressfamilycorrection=true'}
 ],
 speciation:[
  {icon:'⑂',label:'How populations become different',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=Darwin%20finches%20speciation%20island&sort=best&suppressfamilycorrection=true'},
  {icon:'⑂',label:'Geographic isolation in nature',url:'https://www.gettyimages.com/search/2/image-film?family=creative&phrase=geographic%20isolation%20species%20evolution&sort=best&suppressfamilycorrection=true'}
 ]
};
function scienceLinks(lessonId){
 const links=SCIENCE_LINKS[lessonId];if(!links?.length)return '';
 return `<aside class="science-links" aria-label="See it for real"><div class="science-links-title"><span class="science-spark" aria-hidden="true">✦</span><span><strong>See it for real</strong><small>Pictures & short clips that make this lesson real.</small></span></div><div class="science-link-list">${links.map(x=>`<a href="${x.url}" target="_blank" rel="noopener noreferrer"><span class="science-link-icon" aria-hidden="true">${x.icon}</span><span><span class="science-link-kicker">LOOK CLOSER</span><strong>${esc(x.label)}</strong></span><span class="science-link-arrow" aria-hidden="true">↗</span></a>`).join('')}</div></aside>`;
}
function home(){crumbs([['Home']]);return `<section class="hero hero-photo"><div class="hero-copy"><p class="eyebrow">ETHAN’S BIOLOGY FIELD GUIDE</p><h1>Life makes more sense up close.</h1><p>See the idea. Try it yourself. Connect the dots.</p><div class="controls">${btn('Start exploring','lesson/'+(lesson(state.last)?state.last:'investigations'))}${btn('Explore the course','course',true)}</div><span class="small">Grade 9 · Honors Biology · MCPS topic sequence</span></div><div class="hero-art" aria-hidden="true"></div></section><nav class="home-shortcuts" aria-label="Quick study links"><span>15 minutes, one idea.</span><a href="#practice">Practice questions →</a><a href="#flashcards/all">Vocabulary cards →</a></nav><div class="section-top"><h2>Your biology course</h2><a href="#about">About this guide →</a></div>${unitCards(true)}`;}
function course(id){const u=unit(id);crumbs(u?[['Course','course'],[u.n]]:[['Course']]);if(!u)return heading('THE COURSE','From living systems to living cells','Start wherever your class is, Ethan — or begin with foundations.')+unitCards(true);return courseBar(u.id,null)+heading(u.n.toUpperCase(),u.title,u.desc)+`<div class="controls">${btn('Practice this unit','practice/'+u.id)}${btn('Unit check','check/'+u.id,true)}${btn('Vocabulary','flashcards/'+u.id,true)}</div><div class="grid">${BIO_LESSONS.filter(l=>l.unit===u.id).map(lessonCard).join('')}</div>${adjacentUnitNav(u.id)}`;}
function showLesson(id){const l=lesson(id);if(!l)return missing();state.last=id;save();crumbs([['Course','course'],[unit(l.unit).n,'unit/'+l.unit],[l.title]]);let i=BIO_LESSONS.indexOf(l);return `${courseBar(l.unit,l.id)}<div class="lesson-shell">${heading(unit(l.unit).n.toUpperCase(),l.title,l.goal)}<div class="lesson-tabs"><a href="#" data-scroll="ideas">Key ideas</a><a href="#" data-scroll="examples">Worked examples</a><a href="#" data-scroll="words">Vocabulary</a><a href="#" data-scroll="honors">Honors challenge</a></div>${visualPanel(l.visual,l.id)}${scienceLinks(l.id)}<section id="ideas"><h2>Three ideas to keep</h2><div class="learn-grid">${l.ideas.map(([t,p],i)=>`<article class="card"><span class="number">0${i+1}</span><h3>${t}</h3><p>${p}</p></article>`).join('')}</div></section><p class="callout">Common mistake: ${l.mistake}</p><section id="examples"><h2>See it worked out</h2><div class="two">${l.examples.map(([t,steps])=>`<article class="card worked"><h3>${t}</h3><ol>${steps.map(s=>`<li>${s}</li>`).join('')}</ol></article>`).join('')}</div></section><section class="card honors" id="honors"><p class="eyebrow">HONORS • EXPLAIN YOUR THINKING</p><h2>Your turn, Ethan</h2><p>${l.honors[0]}</p><label for="thinking">Your explanation (saved on this device)</label><textarea id="thinking" placeholder="My claim is… The evidence shows… This makes sense because…">${esc(state.notes[id]||'')}</textarea><details><summary>Compare with a strong response</summary><ul>${l.honors[1].map(s=>`<li>${s}</li>`).join('')}</ul><p class="small">Self-check: did you make a claim, use evidence, and explain the biology? This response is not automatically graded.</p></details></section><section id="words"><h2>Words worth knowing</h2><p class="muted">Tap a term to reveal its meaning.</p><div class="vocab-grid">${l.terms.map(([t,d])=>`<details class="vocab"><summary>${t}</summary><p>${d}</p></details>`).join('')}</div></section><div class="controls">${btn('Practice • 5 questions','practice/'+id)}<button class="soft" id="explored">${state.explored.includes(id)?'✓ Lesson explored':'Mark as explored'}</button></div><p class="small muted">Explored means you have studied the lesson; practice shows what you can recall.</p><div class="section-top">${i?`<a href="#lesson/${BIO_LESSONS[i-1].id}">← Previous lesson</a>`:'<span></span>'}${i<23?`<a href="#lesson/${BIO_LESSONS[i+1].id}">Next: ${BIO_LESSONS[i+1].title} →</a>`:''}</div></div>`;}
// Practice, Unit check and Vocabulary are all reached from a unit, and all
// take either a unit id or a lesson id. Resolving it back to the unit lets
// them carry the same course bar, so there is always a way back to where
// you came from.
function ownerUnit(id){if(!id||id==='all')return null;if(unit(id))return id;const l=lesson(id);return l?l.unit:null;}
function unitCrumbs(id,tail){const u=unit(ownerUnit(id));
 return u?[['Course','course'],[u.n,'unit/'+u.id],[tail]]:[[tail]];}

// Pulled out of route() so the pages that re-render #main can rebind it.
function bindCourseBar(){
 const jump=document.querySelector('[data-unit-jump]');
 if(jump)jump.onchange=e=>{location.hash='unit/'+e.target.value;};
 const act=document.querySelector('.course-bar__lessons a.active');
 if(act){const box=act.parentElement;box.scrollLeft=act.offsetLeft-(box.clientWidth-act.clientWidth)/2;}
 const cbw=document.querySelector('.course-bar__wrap');
 if(cbw){const box=cbw.querySelector('.course-bar__lessons');box.onscroll=syncCourseBar;
  cbw.querySelectorAll('[data-lesson-page]').forEach(b=>b.onclick=()=>box.scrollBy({left:Number(b.dataset.lessonPage)*box.clientWidth*0.8,behavior:'smooth'}));
  syncCourseBar();}
}
function pool(id){return BIO_QUESTIONS.filter(q=>id==='all'||!id||q.unit===id||q.lesson===id);}
function practiceHub(id,check){const ou=ownerUnit(id);crumbs(unitCrumbs(id,check?'Knowledge check':'Practice'));if(id&&!pool(id).length)return missing();return (ou?courseBar(ou,lesson(id)?id:null):'')+heading(check?'RECALL WITHOUT HINTS':'A LITTLE PRACTICE',check?'Check your understanding':'Build confidence, one question at a time',check?'Submit your answers and see all explanations at the end. These are study checks, not school exam predictions.':'Get an explanation after each answer. Questions repeat from a fixed bank of 120.')+(id?`<section class="card"><h2>${lesson(id)?.title||unit(id)?.title||'All topics'}</h2><p>${check?'Balanced questions from each lesson.':'Your score counts your first response. Using a hint is recorded as supported practice.'}</p>${check?'':`<label>Session length <select id="length">${[5,10,20].filter(n=>n<=pool(id).length).map(n=>`<option>${n}</option>`).join('')}</select></label>`}<div class="controls"><button id="start-session">Start ${check?'check':'practice'}</button></div></section>`:`<div class="controls">${btn('Mixed practice','practice/all')}${btn('Mixed check','check/all',true)}</div><div class="grid">${BIO_UNITS.map(u=>`<section class="card"><span class="small">${u.n}</span><h3>${u.title}</h3><div class="controls">${btn('Practice','practice/'+u.id,true)}${btn('Check','check/'+u.id,true)}</div></section>`).join('')}</div>`);}
function startSession(id,check){let qs;if(check){qs=shuffle(BIO_LESSONS.filter(l=>id==='all'||l.unit===id||l.id===id).flatMap(l=>shuffle(l.qs).slice(0,id==='all'?1:2).map(q=>({...q,lesson:l.id,unit:l.unit}))));}else qs=shuffle(pool(id)).slice(0,Number($('#length').value));session={qs,index:0,results:[],check,id,hinted:false,first:null};drawQuestion();}
function record(result){state.attempts.push({...result,date:Date.now()});save();}
function drawQuestion(){let s=session,q=s.qs[s.index];if(!q)return finishSession();s.hinted=false;s.first=null;const choices=shuffle(q.choices);$('#main').innerHTML=`<section class="card question"><p class="eyebrow">${s.check?'KNOWLEDGE CHECK':'PRACTICE'} • ${s.index+1} OF ${s.qs.length}</p><div class="progress-track"><span style="width:${s.index/s.qs.length*100}%"></span></div><h2>${q.prompt}</h2><form id="answer-form"><div class="choices">${choices.map((c,i)=>`<label class="choice"><input type="radio" name="answer" value="${i}" required><span>${esc(c)}</span></label>`).join('')}</div><div class="controls"><button type="submit">${s.check?'Save answer':'Check answer'}</button><button type="button" class="soft" id="skip-question">Skip</button>${s.check?'':'<button type="button" class="soft" id="hint">Study hint</button>'}</div></form><div id="hint-text"></div><div id="feedback" class="feedback" role="status"></div><div id="next-wrap"></div><a class="small" href="#practice">End session</a></section>`;
const complete=(selected,skip=false)=>{const correct=selected===q.answer;if(s.first===null){s.first={id:q.id,correct:correct&&!skip,assisted:s.hinted,selected:skip?'Skipped':selected};s.results.push(s.first);if(!s.check)record(s.first);}if(s.check){s.index++;drawQuestion();return;}$('#feedback').className='feedback '+(correct?'':'error');$('#feedback').textContent=(skip?'Skipped. ':correct?'That’s right. ':'Keep working on this idea. ')+q.explain;$('#answer-form button[type=submit]').disabled=true;$('#skip-question').disabled=true;if($('#hint'))$('#hint').disabled=true;$('#next-wrap').innerHTML='<button id="next-question">'+(s.index+1===s.qs.length?'See results':'Next question →')+'</button>';$('#next-question').onclick=()=>{s.index++;drawQuestion();};};
$('#answer-form').onsubmit=e=>{e.preventDefault();const v=new FormData(e.target).get('answer');if(v!==null)complete(choices[Number(v)]);};$('#skip-question').onclick=()=>complete('',true);if($('#hint'))$('#hint').onclick=()=>{s.hinted=true;$('#hint-text').innerHTML=`<p class="help">Think about this vocabulary: ${lesson(q.lesson).terms.map(t=>`${esc(t[0])} — ${esc(t[1])}`).join('; ')}.</p>`;};}
function finishSession(){let s=session;if(s.check)s.results.forEach(record);const correct=s.results.filter(r=>r.correct&&!r.assisted).length;$('#main').innerHTML=heading('SESSION COMPLETE',`${correct} of ${s.qs.length} independently correct`,`That’s the session done, Ethan. First responses count. Supported answers and skipped questions stay available for review.`)+`<div class="controls">${btn('Review practice','review')}${btn('Choose another topic','practice',true)}</div><section class="card quiz-summary">${s.qs.map((q,i)=>{let r=s.results[i];return `<details><summary>${r.correct?(r.assisted?'Supported':'Correct'):'Review'} · ${q.prompt}</summary><p>Your answer: ${esc(r.selected)}</p><p>Answer: ${esc(q.answer)}</p><p>${q.explain}</p><a href="#lesson/${q.lesson}">Study this lesson →</a></details>`;}).join('')}</section>`;session=null;}
function review(){crumbs([['Review']]);let latest=new Map();state.attempts.forEach(a=>latest.set(a.id,a));let qs=BIO_QUESTIONS.filter(q=>latest.has(q.id)&&(!latest.get(q.id).correct||latest.get(q.id).assisted));return heading('MAKE CONNECTIONS','Review & try again','These are the ones to come back to, Ethan. A question stays here until your latest attempt is right without a hint.')+(qs.length?qs.map(q=>`<section class="card review-row"><h3>${q.prompt}</h3><details><summary>See the explanation</summary><p>${q.explain}</p></details><div class="controls">${btn('Study '+lesson(q.lesson).title,'lesson/'+q.lesson,true)}${btn('Practice this skill','practice/'+q.lesson,true)}</div></section>`).join(''):'<div class="card empty">No questions to review yet. Try a practice session to find your next step.</div>');}
function progress(){crumbs([['Progress']]);let a=state.attempts;return heading('YOUR LEARNING','Small steps add up, Ethan','Progress is saved in this browser. Exploring a lesson is separate from answering independently.')+`<div class="grid"><div class="card stat"><strong>${state.explored.length} / 24</strong>Lessons explored</div><div class="card stat"><strong>${a.length}</strong>Question attempts</div><div class="card stat"><strong>${a.length?Math.round(a.filter(x=>x.correct&&!x.assisted).length/a.length*100)+'%':'—'}</strong>Independent first-response accuracy</div></div><div class="section-top"><h2>Course progress</h2></div>${BIO_UNITS.map(u=>{let ls=BIO_LESSONS.filter(l=>l.unit===u.id),n=ls.filter(l=>state.explored.includes(l.id)).length;return `<div class="card review-row"><a href="#unit/${u.id}">${u.n} · ${u.title}</a><span class="muted"> — ${n} of ${ls.length} explored</span><div class="progress-track"><span style="width:${n/ls.length*100}%"></span></div></div>`;}).join('')}`;}
function flashcards(id){const ou=ownerUnit(id);crumbs(unitCrumbs(id,'Vocabulary'));const bar=ou?courseBar(ou,lesson(id)?id:null):'';let cards=BIO_LESSONS.filter(l=>!id||id==='all'||l.unit===id).flatMap(l=>l.terms.map(t=>[...t,l.title]));cards=shuffle(cards);let i=0;const render=()=>{$('#main').innerHTML=bar+heading('RECALL FIRST','Vocabulary cards','Say the meaning out loud before you reveal it, Ethan — recalling it is what makes it stick.')+`<div class="card flash"><p class="small">${i+1} / ${cards.length} · ${cards[i][2]}</p><h2>${cards[i][0]}</h2><p class="answer-text" id="definition" hidden>${cards[i][1]}</p><div class="controls" style="justify-content:center"><button id="reveal">Reveal meaning</button><button id="next-card" class="soft">Next card →</button></div></div>`;bindCourseBar();$('#reveal').onclick=()=>{$('#definition').hidden=false;};$('#next-card').onclick=()=>{i=(i+1)%cards.length;render();};};if(!cards.length){$('#main').innerHTML=missing();return;}render();}
function about(){crumbs([['About']]);return heading('A GUIDE FOR ETHAN','Honors Biology, made visual','An independent study companion for a grade 9 student at Walter Johnson High School in Maryland.')+`<section class="card"><h2>What this guide follows</h2><p>The five main units follow the public MCPS high-school Biology topic groups. A foundations section builds the investigation, evidence, and chemistry skills used across them. Honors challenges add explanation, interpretation, and reasoning.</p><p>Your teacher’s syllabus determines the exact order, depth, assignments, and exam scope. This is not an official MCPS resource and does not reproduce a Walter Johnson teacher’s course. Share a class syllabus or review sheet to tailor it further.</p><h2>Official course references</h2><ul class="source-list"><li><a href="https://www.montgomeryschoolsmd.org/curriculum/science/hs/">MCPS high-school science: Biology unit sequence</a></li><li><a href="https://www.montgomeryschoolsmd.org/schools/wjhs/departments/science/">Walter Johnson High School: Science department</a></li><li><a href="https://www.montgomeryschoolsmd.org/schools/wjhs/coursebook/">Walter Johnson course bulletin</a></li></ul><h2>How to use the pictures</h2><p>Diagrams are simplified teaching models, not photographs or scale drawings. Read each model’s caption for its assumptions. Change one input, predict what should happen, then explain the result.</p><h2>Study together</h2><p>Ask: “What changed?”, “What evidence supports that?”, and “How would the result change if…?” A clear explanation matters more than memorizing a letter choice.</p></section>`;}
function settings(){crumbs([['Saved progress']]);return heading('ON THIS DEVICE','Your study record','Lesson notes and practice results stay in this browser. They are not sent to a teacher or synced between devices.')+`<section class="card"><h2>Keep a backup</h2><div class="controls"><button id="export">Download progress</button><label>Restore backup <input id="import" type="file" accept="application/json"></label></div><p id="import-status" role="status"></p><h2>Start fresh</h2><p>This clears biology progress only.</p><button class="soft" id="reset">Reset biology progress</button></section>`;}
function journal(){crumbs([['Journal']]);return heading('AFTER SCHOOL','What you learned, Ethan','One short note a day after school. Your dad can comment, and you can reply.')+`<div data-learning-history></div>`;}
function missing(){return heading('NOT FOUND','Nothing here, Ethan — let’s find your next lesson')+btn('Open the course','course');}
function makeInternalLinksPreviewSafe(){const base=`${location.origin}${location.pathname}${location.search}`;document.querySelectorAll('a[href^="#"]').forEach(a=>{const href=a.getAttribute('href');if(href&&href!=='#'&&href!=='#main')a.href=base+href;});}
function route(){session=null;document.body.classList.remove('nav-open');$('#menu').setAttribute('aria-expanded','false');let [page='home',id]=location.hash.slice(1).split('/');if(!page)page='home';document.body.classList.toggle('home-page',page==='home');$('#nav').innerHTML=[['home',HOME_ICON,'Home'],['course','◫','Course'],['practice','✎','Practice'],['flashcards/all','▤','Vocabulary'],['review','↺','Review'],['progress','▥','Progress'],['log',JOURNAL_ICON,'Journal']].map(([p,icon,t])=>`<a href="#${p}" class="${page===p.split('/')[0]||p==='course'&&['unit','lesson'].includes(page)?'active':''}${p==='review'?' nav-gap':''}"><span aria-hidden="true">${icon}</span> &nbsp; ${t}${p==='log'&&window.LearningLog&&LearningLog.newCount('biology')?`<span class="nav-badge">${LearningLog.newCount('biology')}</span>`:''}</a>`).join('');const main=$('#main');if(page==='flashcards'){flashcards(id);}else{main.innerHTML=page==='home'?home():page==='course'||page==='unit'?course(id):page==='lesson'?showLesson(id):page==='practice'||page==='check'?practiceHub(id,page==='check'):page==='review'?review():page==='progress'?progress():page==='log'?journal():page==='about'?about():page==='settings'?settings():page==='search'?searchResults(id):missing();}
makeInternalLinksPreviewSafe();const llEl=document.querySelector('#log-mount');if(llEl&&window.LearningLog)LearningLog.mountButton(llEl,{subject:'biology',label:'Honors Biology',learner:'Ethan',historyHref:'#log'});const lhEl=document.querySelector('[data-learning-history]');if(lhEl&&window.LearningLog){LearningLog.mountHistory(lhEl,{subject:'biology',label:'Honors Biology',learner:'Ethan'});document.querySelectorAll('#nav .nav-badge').forEach(b=>b.remove());}bindCourseBar();if(page==='lesson'&&lesson(id)){mountVisual(lesson(id).visual,id);$('#thinking').oninput=e=>{state.notes[id]=e.target.value;save();};$('#explored').onclick=e=>{if(!state.explored.includes(id))state.explored.push(id);save();e.target.textContent='✓ Lesson explored';};document.querySelectorAll('.lesson-tabs [data-scroll]').forEach(a=>a.onclick=e=>{e.preventDefault();const s=document.getElementById(a.dataset.scroll);if(s)s.scrollIntoView({behavior:'smooth'});});}if($('#start-session'))$('#start-session').onclick=()=>startSession(id,page==='check');if(page==='settings')bindSettings();document.title=(page==='lesson'&&lesson(id)?lesson(id).title+' · ':'')+'Ethan’s Biology Field Guide';window.scrollTo(0,0);main.focus({preventScroll:true});}
function searchResults(id){let q='';try{q=decodeURIComponent(id||'');}catch(e){}crumbs([['Search']]);let ls=BIO_LESSONS.filter(l=>JSON.stringify(l).toLowerCase().includes(q.toLowerCase()));return heading('FIND AN IDEA',`Search: ${esc(q)}`,`${ls.length} lessons found`)+`<div class="grid">${ls.map(lessonCard).join('')}</div>`;}
function bindSettings(){$('#export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='ethan-biology-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};$('#reset').onclick=()=>{if(confirm('Clear all biology notes and progress on this device?')){state=fresh();save();route();}};$('#import').onchange=async e=>{try{let x=JSON.parse(await e.target.files[0].text());if(!Array.isArray(x.explored)||!x.explored.every(id=>lesson(id))||!Array.isArray(x.attempts)||!x.attempts.every(a=>BIO_QUESTIONS.some(q=>q.id===a.id)&&typeof a.correct==='boolean'&&typeof a.assisted==='boolean')||!x.notes||typeof x.notes!=='object')throw Error();if(!confirm('Replace this browser’s biology progress with this backup?'))return;state={explored:[...new Set(x.explored)],attempts:x.attempts,notes:Object.fromEntries(Object.entries(x.notes).filter(([k,v])=>lesson(k)&&typeof v==='string')),last:lesson(x.last)?x.last:'investigations'};save();$('#import-status').textContent='Progress restored.';}catch(e){$('#import-status').textContent='This is not a valid biology progress backup.';}};}
$('#menu').onclick=()=>{const open=document.body.classList.toggle('nav-open');$('#menu').setAttribute('aria-expanded',String(open));};document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.body.classList.remove('nav-open');$('#menu').setAttribute('aria-expanded','false');}});$('#search').onkeydown=e=>{if(e.key==='Enter'){location.hash='search/'+encodeURIComponent(e.target.value.trim());e.target.blur();}};document.querySelector('.skip').onclick=e=>{e.preventDefault();$('#main').focus();};window.addEventListener('hashchange',route);window.addEventListener('resize',syncCourseBar);route();

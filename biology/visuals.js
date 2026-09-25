'use strict';
const svg=(body,label,h=280)=>`<svg viewBox="0 0 600 ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#446d61"/></marker></defs>${body}</svg>`;
const textSVG=(x,y,t,size=18)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#183d36">${esc(t)}</text>`;
const box=(x,y,w,h,t,fill='#e4eee5')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="#789787"/>${textSVG(x+w/2,y+h/2+6,t)}`;
const line=(x,y,a,b)=>`<path d="M${x} ${y}L${a} ${b}" fill="none" stroke="#446d61" stroke-width="2" marker-end="url(#arrow)"/>`;
const VISUAL_NAMES={experiment:'Read an experiment',enzyme:'Enzyme activity explorer',web:'Explore a food web',population:'Population growth model',energy:'Follow matter and energy',cell:'Explore a living cell',membrane:'Which way will water move?',systems:'A sprint is a team effort',feedback:'Trace a feedback loop',dna:'DNA base-pair builder',division:'Compare cell divisions',punnett:'Build a Punnett square',selection:'Selection over generations',tree:'Read a family tree of life',biodiversity:'How does an ecosystem respond to change?',impact:'What happens to the stream?'};
const REAL_LIFE={
 cells:{
  title:"Cells: The Building Blocks of Life",
  intro:"Explore different cells and their amazing parts.",
  slides:[
   {src:'assets/slides/animal-cell.jpg',kicker:"Slide 1",heading:"Animal Cell",body:"A typical animal cell with all the main organelles working together.",labels:"membrane · cytoplasm · nucleus · mitochondria · ER · Golgi · ribosomes"},
   {src:'assets/slides/plant-cell.jpg',kicker:"Slide 2",heading:"Plant Cell",body:"Plant cells have a cell wall, chloroplasts, and a large central vacuole."},
   {src:'assets/slides/human-cells.jpg',kicker:"Slide 3",heading:"Different Human Cells",body:"Same DNA, different shapes and jobs. Cells are specialized for what they do.",labels:"nerve · muscle · white blood cell · red blood cell"},
   {src:'assets/slides/nucleus.jpg',kicker:"Slide 4",heading:"Nucleus",body:"The control center that holds your DNA."},
   {src:'assets/slides/mitochondria.jpg',kicker:"Slide 5",heading:"Mitochondria",body:"Turns food into energy (ATP) for the cell."},
   {src:'assets/slides/er-golgi.jpg',kicker:"Slide 6",heading:"ER and Golgi Apparatus",body:"Rough ER makes proteins. Golgi modifies and packages them.",labels:"rough ER · smooth ER · Golgi · transport vesicles"},
   {src:'assets/slides/ribosome-protein.jpg',kicker:"Slide 7",heading:"Ribosomes",body:"Tiny machines that read instructions and build proteins."}
  ]
 },
 transport:{
  title:"Osmosis in a living cell",
  intro:"This is a microscope view connected to the same water-balance idea shown in the membrane model.",
  exam:"In a hypotonic environment, water tends to enter the cell. Connect what you see to the response that prevents too much water from accumulating.",
  images:[
   {src:"assets/real-life/osmosis-paramecium-micrograph.jpg",alt:"Bright-field microscope image of a Paramecium with a contractile vacuole",label:"Paramecium · bright-field microscope",note:"A contractile vacuole pumps excess water out. It is a real example of a cell managing water that enters by osmosis."}
  ]
 },
 dna:{
  title:"From Cell to DNA to Protein",
  intro:"Follow the incredible journey from a cell to a protein.",
  slides:[
   {src:'assets/slides/animal-cell.jpg',kicker:"Slide 1",heading:"Cell",body:"Everything starts with a cell."},
   {src:'assets/slides/nucleus.jpg',kicker:"Slide 2",heading:"Nucleus",body:"The nucleus holds your DNA."},
   {src:'assets/slides/chromosome.jpg',kicker:"Slide 3",heading:"Chromosome",body:"DNA is tightly coiled into chromosomes."},
   {src:'assets/slides/dna-double-helix.jpg',kicker:"Slide 4",heading:"DNA Double Helix",body:"DNA is a long molecule shaped like a twisted ladder."},
   {src:'assets/slides/gene.jpg',kicker:"Slide 5",heading:"Gene",body:"A gene is a specific segment of DNA with instructions."},
   {src:'assets/slides/dna-letters.jpg',kicker:"Slide 6",heading:"The 4 DNA Letters",body:"DNA uses four chemical letters: A, T, C, and G.",labels:"A pairs with T · C pairs with G"},
   {src:'assets/slides/rna-copy.jpg',kicker:"Slide 7",heading:"RNA Copy (mRNA)",body:"The gene is copied into messenger RNA (mRNA)."},
   {src:'assets/slides/ribosome-protein.jpg',kicker:"Slide 8",heading:"Ribosome",body:"A ribosome reads the mRNA instructions."},
   {src:'assets/slides/amino-acids.jpg',kicker:"Slide 9",heading:"Amino Acids",body:"Amino acids are linked together in the right order."},
   {src:'assets/slides/protein.jpg',kicker:"Slide 10",heading:"Protein",body:"The amino acid chain folds into a protein."},
   {src:'assets/slides/protein-at-work-cell.jpg',kicker:"Slide 11",heading:"Protein at Work: Inside the Cell",body:"Proteins do the work inside the cell."},
   {src:'assets/slides/protein-at-work-membrane.jpg',kicker:"Slide 12",heading:"Protein at Work: At the Membrane",body:"Others work in the cell membrane, controlling what gets in and out."},
   {src:'assets/slides/human-cells.jpg',kicker:"Slide 13",heading:"Same DNA, Different Cells",body:"All your cells have the same DNA, but they use different genes."}
  ]
 },
 mitosis:{
  title:"Mitosis under fluorescence microscopy",
  intro:"The real microscope images in this reference show chromosomes and spindle structures during cell division.",
  exam:"Identify the stage from chromosome position, not from the artificial colors: middle = metaphase; separating = anaphase; two groups at opposite ends = late mitosis.",
  images:[
   {src:"assets/real-life/mitosis-fluorescence.png",alt:"Reference image containing fluorescence micrographs of cells in stages of mitosis",label:"Mitosis · fluorescence microscopy",note:"Blue fluorescence marks DNA/chromosomes and green marks spindle microtubules. The colors come from fluorescent labels used by scientists."}
  ]
 },
 "evolution-evidence":{
  title:"Fossil evidence you can actually see",
  intro:"Fossils are one physical line of evidence scientists combine with anatomy and DNA when reconstructing evolutionary relationships.",
  exam:"A fossil alone does not draw the family tree. Use preserved structures together with homologous anatomy and molecular evidence to support common ancestry.",
  images:[
   {src:"assets/real-life/archaeopteryx-fossil.jpg",alt:"Archaeopteryx reference image including a fossil with preserved skeletal and feather structures",label:"Archaeopteryx · fossil evidence",note:"The fossil portion preserves skeletal and feather features. Fossils let scientists compare structures across organisms and through time."}
  ]
 }
};
/* Two shapes here. `slides` is a paged picture story, one frame at a time,
   for lessons where the point is to follow a sequence. `images` is the older
   side-by-side gallery of real micrographs, still right where the point is
   comparing a clean model against messy real tissue. */
function realLifePanel(lessonId){
 const d=REAL_LIFE[lessonId];if(!d)return '';
 return `<dialog class="real-life-dialog${d.slides?' is-tour':''}" id="real-life-dialog" aria-labelledby="real-life-title"><div class="real-life-shell"><div class="real-life-head"><div><p class="eyebrow">${d.slides?'ILLUSTRATED TOUR':'REAL BIOLOGY'}</p><h2 id="real-life-title">${d.title}</h2></div><div class="real-life-acts">${d.slides?`<span class="ss-count" data-count>1 of ${d.slides.length}</span>`:''}<button type="button" class="soft real-life-close" id="real-life-close" aria-label="Close">Close</button></div></div>${d.slides?'':`<p class="real-life-intro">${d.intro}</p>`}${d.slides?slideshowBody(d):galleryBody(d)}</div></dialog>`;
}
function galleryBody(d){
 return `<div class="real-life-gallery">${d.images.map(x=>`<figure class="real-life-figure"><img src="${x.src}" alt="${x.alt}" loading="lazy"><figcaption><strong>${x.label}</strong><span>${x.note}</span></figcaption></figure>`).join('')}</div><aside class="real-life-exam"><strong>Exam tip</strong><p>${d.exam}</p></aside><p class="small muted real-life-credit">These image files are stored inside Ethan Study Hub. Source and license details are recorded in <code>assets/real-life/SOURCES.md</code>.</p>`;
}
const SS_CHEV='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4.5 16.5 12 9 19.5"/></svg>';
function slideshowBody(d){
 const n=d.slides.length;
 // Picture, then title and words beneath it, the way the catalogue lays
 // its tiles out. Side by side spent half the panel on two lines of text.
 // The slide number lives in the controls, so it is not repeated here.
 const frames=d.slides.map((x,i)=>`<figure class="ss-slide" data-slide="${i}"${i?' hidden':''}><div class="ss-media"${x.todo?'':` style="--shot:url('${x.src}')"`}>${x.todo
   ?`<div class="ss-todo"><strong>Artwork still to come</strong><span>Add the picture as <code>biology/${x.src}</code>, then delete <code>todo:true</code> on this slide.</span></div>`
   :`<img src="${x.src}" alt="${x.heading}" loading="${i?'lazy':'eager'}">`}</div><figcaption class="ss-bot"><h3>${x.heading}</h3><p class="ss-body">${x.body}</p>${x.labels?`<p class="ss-labels">${x.labels.split('·').map(w=>`<span class="ss-chip">${w.trim()}</span>`).join('')}</p>`:''}</figcaption></figure>`).join('');
 const dots=d.slides.map((x,i)=>`<button type="button" class="ss-dot${i?'':' is-on'}" data-go="${i}" aria-label="Go to slide ${i+1}"></button>`).join('');
 return `<div class="ss" data-slideshow><div class="ss-stage">${frames}</div><div class="ss-controls"><button type="button" class="ss-arrow ss-arrow--prev" data-step="-1" aria-label="Previous slide">${SS_CHEV}</button><div class="ss-dots">${dots}</div><button type="button" class="ss-arrow ss-arrow--next" data-step="1" aria-label="Next slide">${SS_CHEV}</button></div></div>`;
}
function bindRealLife(lessonId){
 const dialog=document.getElementById('real-life-dialog'),open=document.getElementById('real-life-open');if(!dialog||!open||!REAL_LIFE[lessonId])return;
 const close=document.getElementById('real-life-close');
 const shut=()=>{if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');};
 open.onclick=()=>{if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');};
 close.onclick=shut;
 dialog.addEventListener('click',e=>{if(e.target===dialog)shut();});

 const ss=dialog.querySelector('[data-slideshow]');if(!ss)return;
 const slides=[...ss.querySelectorAll('[data-slide]')],dots=[...ss.querySelectorAll('[data-go]')],count=dialog.querySelector('[data-count]');
 let at=0;
 const show=i=>{at=(i+slides.length)%slides.length;
  slides.forEach((f,n)=>{f.hidden=n!==at;});
  dots.forEach((b,n)=>b.classList.toggle('is-on',n===at));
  count.textContent=`${at+1} of ${slides.length}`;};
 ss.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>show(at+Number(b.dataset.step)));
 dots.forEach(b=>b.onclick=()=>show(Number(b.dataset.go)));
 // Arrow keys page the story without hunting for the button.
 dialog.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'){e.preventDefault();show(at+1);}
  if(e.key==='ArrowLeft'){e.preventDefault();show(at-1);}});
}
function visualPanel(type,lessonId){const real=REAL_LIFE[lessonId];return `<section class="visual card"><div class="section-top"><div><p class="eyebrow">SEE IT · CHANGE IT · EXPLAIN IT</p><h2>${VISUAL_NAMES[type]}</h2></div><div class="visual-head-actions"><span class="tag">Interactive</span>${real?`<button type="button" class="soft real-life-trigger" id="real-life-open" title="Compare this diagram with real biology">📷 ${real.slides?'Picture tour':'Real image'}</button>`:''}</div></div><div id="visual-controls" class="controls"></div><div id="visual-drawing" class="drawing"></div><p id="visual-caption" class="visual-caption" role="status" aria-live="polite"></p><p class="small muted">Simplified learning model. Read the explanation and assumptions below the image.</p></section>${realLifePanel(lessonId)}`;}
function mountVisual(type,lessonId){
 const controls=document.getElementById('visual-controls'),drawing=document.getElementById('visual-drawing'),caption=document.getElementById('visual-caption');if(!controls)return;bindRealLife(lessonId);
 const buttons=(items,fn)=>{controls.innerHTML=items.map(([value,label])=>`<button class="soft" data-value="${value}">${label}</button>`).join('');controls.querySelectorAll('button').forEach(b=>b.onclick=()=>{controls.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));fn(b.dataset.value);});controls.querySelector('button').click();};
 if(type==='cell'){
 let plant=false,part='nucleus';const descriptions={nucleus:'Nucleus: contains most DNA in a eukaryotic cell and is a site of transcription.',mitochondrion:'Mitochondrion: participates in aerobic respiration. Both plant and animal cells have mitochondria.',membrane:'Cell membrane: selectively regulates exchange. Plant cells also have a wall outside the membrane.',ribosome:'Ribosomes: assemble proteins. They occur in plant, animal, and prokaryotic cells.',chloroplast:'Chloroplast: uses light in photosynthesis. This is a typical photosynthetic plant cell; not all plant cells contain chloroplasts.',vacuole:'Large central vacuole: stores material and helps support a plant cell through water pressure.'};
 controls.innerHTML='<label>Cell type <select id="cell-type"><option value="animal">Animal cell</option><option value="plant">Photosynthetic plant cell</option></select></label><div id="cell-parts" class="controls"></div>';
 const draw=()=>{const parts=['nucleus','mitochondrion','membrane','ribosome',...(plant?['chloroplast','vacuole']:[])];if(!parts.includes(part))part='nucleus';document.getElementById('cell-parts').innerHTML=parts.map(p=>`<button class="soft" data-part="${p}" aria-pressed="${part===p}">${p[0].toUpperCase()+p.slice(1)}</button>`).join('');const highlight=p=>part===p?'stroke="#173f35" stroke-width="5"':'stroke="#6a9181" stroke-width="2"';drawing.innerHTML=svg(`${plant?'<rect x="95" y="15" width="410" height="255" rx="35" fill="#acc493" stroke="#5d794d" stroke-width="8"/>':''}<rect x="${plant?105:110}" y="25" width="${plant?390:380}" height="235" rx="${plant?30:115}" fill="#e3eee1" ${highlight('membrane')}/>${plant?`<rect x="260" y="63" width="195" height="155" rx="25" fill="#c8e1e9" ${highlight('vacuole')}/>`:''}<ellipse cx="230" cy="133" rx="56" ry="48" fill="#d1c0df" ${highlight('nucleus')}/><circle cx="227" cy="132" r="17" fill="#9c85af"/><ellipse cx="340" cy="220" rx="38" ry="17" fill="#efc598" ${highlight('mitochondrion')}/><path d="M310 220l10-8 10 16 10-16 10 16 10-8" stroke="#aa7445" fill="none"/>${[ [155,100],[168,173],[295,70],[394,45],[285,235] ].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#735f7e" ${part==='ribosome'?'stroke="#183d36" stroke-width="3"':''}/>`).join('')}${plant?`<ellipse cx="170" cy="220" rx="35" ry="14" fill="#8ab983" ${highlight('chloroplast')}/><path d="M148 214h44m-44 6h44m-44 6h44" stroke="#3c7750"/>`:''}${textSVG(300,295,plant?'Plant cell schematic':'Animal cell schematic')}`, 'Schematic cell. Select a named structure to highlight it and read its role.',320);caption.textContent=descriptions[part]+' Other structures are omitted; shapes and sizes are simplified.';document.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>{part=b.dataset.part;draw();});};document.getElementById('cell-type').onchange=e=>{plant=e.target.value==='plant';draw();};draw();return;
 }
 if(type==='membrane'){
 controls.innerHTML='<label>Outside solute concentration <input type="range" id="solute" min="0" max="10" value="8"><output id="solute-value"></output></label>';
 const draw=()=>{const out=+document.getElementById('solute').value;document.getElementById('solute-value').textContent=`${out} relative units`;const points=(n,x)=>Array.from({length:n},(_,i)=>`<circle cx="${x+(i%3)*33}" cy="${75+Math.floor(i/3)*35}" r="8" fill="#bd8663"/>`).join('');drawing.innerHTML=svg(`<rect x="45" y="35" width="510" height="180" rx="18" fill="#e5f0f3"/><path d="M300 35V215" stroke="#547e71" stroke-width="9" stroke-dasharray="16 8"/>${points(4,95)}${points(out,380)}${textSVG(165,250,'Inside: 4 units')}${textSVG(435,250,`Outside: ${out} units`)}${out>4?line(220,180,380,180):out<4?line(380,180,220,180):line(240,180,360,180)}${out===4?line(360,158,240,158):''}`,`Two equal-volume compartments separated by a membrane. Inside solute 4 units; outside ${out}.`);caption.textContent=(out>4?'Net water movement: outward; a model animal cell may shrink.':out<4?'Net water movement: inward; a model animal cell may swell.':'No net water movement from this concentration difference; water still moves both ways.')+' Assumptions: water can cross, solute cannot, and pressure differences are initially negligible. Dots represent solute, not water.';};document.getElementById('solute').oninput=draw;draw();return;
 }
 if(type==='punnett'){
 controls.innerHTML='<label>Parent 1 <select id="p1"><option>Aa</option><option>AA</option><option>aa</option></select></label><label>Parent 2 <select id="p2"><option>Aa</option><option>AA</option><option>aa</option></select></label>';
 const draw=()=>{const a=document.getElementById('p1').value,b=document.getElementById('p2').value,c=[...a].flatMap(x=>[...b].map(y=>[x,y].sort().join('')));drawing.innerHTML=`<div class="punnett-wrap"><table class="punnett"><caption>Each box is one equally likely gamete combination</caption><thead><tr><th scope="col">Gametes</th><th scope="col">${a[0]}</th><th scope="col">${a[1]}</th></tr></thead><tbody>${[...b].map((y,j)=>`<tr><th scope="row">${y}</th>${[...a].map(x=>`<td class="${x==='a'&&y==='a'?'recessive':'dominant'}">${[x,y].sort().join('')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;const recessive=c.filter(x=>x==='aa').length*25;caption.textContent=`${a} × ${b}: AA ${c.filter(x=>x==='AA').length*25}%, Aa ${c.filter(x=>x==='Aa').length*25}%, aa ${recessive}%. Dominant phenotype ${100-recessive}%; recessive phenotype ${recessive}%. Single-gene, complete-dominance model with equally likely gametes; each offspring is a new probability event.`;};controls.querySelectorAll('select').forEach(s=>s.onchange=draw);draw();return;
 }
 if(type==='dna'){
 controls.innerHTML='<label>DNA template, written 3′ to 5′ <input id="dna-input" value="TACGGA" maxlength="12" spellcheck="false" autocomplete="off"></label><button id="dna-build">Build pairs</button><label>Partner <select id="dna-mode"><option value="dna">DNA complement</option><option value="rna">RNA transcript</option></select></label>';
 const draw=()=>{const seq=document.getElementById('dna-input').value.toUpperCase().replace(/\s/g,''),rna=document.getElementById('dna-mode').value==='rna';if(!/^[ATCG]{1,12}$/.test(seq)){caption.textContent='Enter 1–12 DNA bases using A, T, C, and G.';return;}const pairs={A:rna?'U':'T',T:'A',C:'G',G:'C'},partner=[...seq].map(c=>pairs[c]).join('');drawing.innerHTML=`<div class="dna-strands"><p>Template DNA · 3′ → 5′</p><div class="bases">${[...seq].map(c=>`<span class="base b-${c}">${c}</span>`).join('')}</div><p>${rna?'RNA':'Complementary DNA'} · 5′ → 3′</p><div class="bases">${[...partner].map(c=>`<span class="base b-${c}">${c}</span>`).join('')}</div></div>`;caption.textContent=`Template 3′-${seq}-5′ pairs with ${rna?'RNA':'DNA'} 5′-${partner}-3′. ${rna?'RNA uses U opposite A; transcription makes RNA, not a protein.':'DNA strands run in opposite directions. This ladder model omits the helix and sugar-phosphate backbones.'}`;};document.getElementById('dna-build').onclick=draw;document.getElementById('dna-mode').onchange=draw;draw();return;
 }
 if(type==='selection'){
 let p=.5,g=0;controls.innerHTML='<label>Ground color <select id="ground"><option value="dark">Dark ground favors dark beetles</option><option value="light">Light ground favors light beetles</option><option value="equal">Equal reproductive success</option></select></label><button id="generation">Next generation</button><button class="soft" id="selection-reset">Reset</button>';
 const draw=()=>{const n=Math.round(p*40);drawing.innerHTML=svg(`<rect x="40" y="20" width="520" height="210" rx="20" fill="${document.getElementById('ground').value==='dark'?'#c5b6a4':'#e9e4d1'}"/>${Array.from({length:40},(_,i)=>{const x=70+i%10*50,y=50+Math.floor(i/10)*48;return `<ellipse cx="${x}" cy="${y}" rx="12" ry="16" fill="${i<n?'#4f5047':'#efdc98'}" stroke="#4f5047"/><path d="M${x-14} ${y-8}h28m-28 16h28" stroke="#4f5047"/>`;}).join('')}${textSVG(300,265,`Generation ${g} · expected dark share ${(p*100).toFixed(1)}%`)}`,'Forty beetle symbols approximate the expected proportions of light and dark inherited color types.');caption.textContent='Hypothetical deterministic model: color is inherited; the favored type contributes 1.5 times as many descendants, the other 1.0. Population size is normalized each generation. Symbols are rounded; this model omits drift, mutation, migration, and mating genetics.';};document.getElementById('generation').onclick=()=>{const ground=document.getElementById('ground').value,a=ground==='dark'?1.5:1,b=ground==='light'?1.5:1;p=p*a/(p*a+(1-p)*b);g++;draw();};document.getElementById('ground').onchange=draw;document.getElementById('selection-reset').onclick=()=>{p=.5;g=0;draw();};draw();return;
 }
 if(type==='population'){
 controls.innerHTML='<label>Resource-supported capacity <input id="capacity" type="range" min="30" max="180" value="100" step="10"><output id="capacity-label"></output></label>';
 const draw=()=>{const k=+document.getElementById('capacity').value;document.getElementById('capacity-label').textContent=k;let n=10;const points=[];for(let t=0;t<=30;t++){points.push([50+t*16,235-n]);n+=.3*n*(1-n/k);}drawing.innerHTML=svg(`<path d="M50 30V235H550" stroke="#6c8278" fill="none"/><path d="M50 ${235-k}H550" stroke="#b48052" stroke-dasharray="5 5"/><polyline points="${points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#3d7761" stroke-width="4"/>${textSVG(300,276,'Time steps')}${textSVG(90,22,'Individuals',15)}${textSVG(40,240,'0',14)}${textSVG(35,137,'100',14)}${textSVG(495,225-k,`Capacity ${k}`,15)}${textSVG(530,254,'30',14)}`,'Logistic population model with population on the vertical axis and time on the horizontal axis.',290);caption.textContent=`Illustrative logistic model: starts at 10 individuals; per-step growth is 0.3 × population × (1 − population/${k}). Change the capacity to compare trajectories. This is not measured wildlife data; real populations also fluctuate and move.`;};document.getElementById('capacity').oninput=draw;draw();return;
 }

 /* Unit 1 - Biodiversity and ecosystem change.

    One woodland, five moments in its life. The organisms share a scene
    rather than sitting in separate boxes, because "variety in one place" is
    the idea and six labelled tanks is not it.

    Species richness is on screen with its definition, so the number means
    something; resilience is introduced on the last state, where the student
    has just watched it happen, rather than announced at the start. Nothing
    here is a simulation: the counts are illustrative and say so. */
 if(type==='biodiversity'){
  const GROUND=214;
  const oak=(x,scale,mode)=>{
   const h=62*scale,r=30*scale;
   if(mode==='stump')return `<path d="M${x-7} ${GROUND}h14v-16h-14Z" fill="#6b5334"/><path d="M${x-7} ${GROUND-16}q7 -6 14 0" fill="#3f3228"/>`;
   const trunk=`<path d="M${x} ${GROUND}v${-h}" stroke="#6b5334" stroke-width="${7*scale}" stroke-linecap="round"/>`;
   if(mode==='bare')return trunk+
    `<path d="M${x} ${GROUND-h}l${-15*scale} ${-14*scale}M${x} ${GROUND-h+6*scale}l${16*scale} ${-16*scale}M${x} ${GROUND-h}v${-14*scale}" stroke="#7d6a52" stroke-width="${3*scale}" fill="none" stroke-linecap="round"/>`;
   const leaf=mode==='scorched'?'#93a07a':'#5f8a4e';
   return trunk+`<circle cx="${x}" cy="${GROUND-h-r*0.55}" r="${r}" fill="${leaf}"/>`+
    `<circle cx="${x-r*0.7}" cy="${GROUND-h-r*0.15}" r="${r*0.62}" fill="${leaf}" opacity=".92"/>`+
    `<circle cx="${x+r*0.72}" cy="${GROUND-h-r*0.2}" r="${r*0.58}" fill="${leaf}" opacity=".92"/>`;
  };
  const shrub=(x,c='#7ea867')=>`<ellipse cx="${x}" cy="${GROUND-11}" rx="19" ry="13" fill="${c}"/>`+
   `<ellipse cx="${x-11}" cy="${GROUND-6}" rx="12" ry="9" fill="${c}" opacity=".9"/>`+
   `<ellipse cx="${x+12}" cy="${GROUND-7}" rx="11" ry="8" fill="${c}" opacity=".9"/>`;
  const grass=(x,c='#8fb367')=>`<path d="M${x-6} ${GROUND}q6-15 2-19M${x} ${GROUND}q2-17 0-21M${x+6} ${GROUND}q-6-15-2-19" stroke="${c}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  const beetle=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="5.5" ry="8" fill="#6d4f35"/><circle cx="${x}" cy="${y-9}" r="3.4" fill="#6d4f35"/>`+
   `<path d="M${x-8} ${y-3}h16M${x-8} ${y+4}h16" stroke="#6d4f35" stroke-width="1.8"/>`;
  const bird=(x,y)=>`<path d="M${x-11} ${y}q11-11 11 0q0-11 11 0" stroke="#5d6f8f" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  /* A fox, and not a cat: the tail is the give-away, so it is thick, low and
     tipped white, and the muzzle comes to a point. */
  const fox=(x)=>`<path d="M${x-15} ${GROUND-14}q-16 2-19-12q7 10 19 4Z" fill="#b87a46"/>`+
   `<path d="M${x-30} ${GROUND-24}q-5-4-4-8q5 5 7 5Z" fill="#f0e6d8"/>`+
   `<ellipse cx="${x}" cy="${GROUND-14}" rx="17" ry="9" fill="#c08552"/>`+
   `<path d="M${x+9} ${GROUND-18}q12-3 15 3q-3 7-15 5Z" fill="#c08552"/>`+
   `<path d="M${x+24} ${GROUND-15}l7 1l-7 3Z" fill="#8d5a2f"/>`+
   `<path d="M${x+8} ${GROUND-22}l1-8 6 6ZM${x+17} ${GROUND-22}l2-7 5 6Z" fill="#a9662f"/>`+
   `<circle cx="${x+18}" cy="${GROUND-15}" r="1.6" fill="#3a2a1c"/>`+
   `<path d="M${x-9} ${GROUND-6}v6M${x+1} ${GROUND-6}v6M${x+10} ${GROUND-6}v6" stroke="#8d5a2f" stroke-width="3.5" stroke-linecap="round"/>`;

  const STATES={
   healthy:{richness:6,status:'Diverse ecosystem',ground:'#cbd8a8',sky:'#eef4ef',
    line:'Species richness means the number of different species in an area.',
    trees:[[80,1,'full'],[152,.88,'full'],[236,.95,'full']],
    shrubs:[300,344,392],grass:[52,112,186,262,332,404,452,506,548],
    beetles:[[124,236],[306,240],[428,234]],birds:[[168,92],[228,74],[436,86]],fox:492,built:false},
   fire:{richness:4,status:'After a fire',ground:'#b6a98c',sky:'#f1ece4',
    line:'Some species decline or leave after the disturbance.',
    trees:[[80,1,'bare'],[152,.88,'stump'],[236,.95,'scorched']],
    shrubs:[344],grass:[262,452,548],
    beetles:[[428,234]],birds:[[436,86]],fox:null,built:false,burn:true},
   disease:{richness:5,status:'After a disease of the oaks',ground:'#cbd8a8',sky:'#eef4ef',
    line:'Disturbances do not affect every species in the same way.',
    trees:[[80,1,'bare'],[152,.88,'bare'],[236,.95,'bare']],
    shrubs:[300,344,392],grass:[52,112,186,262,332,404,452,506,548],
    beetles:[[124,236],[306,240],[428,234]],birds:[[168,92],[228,74],[436,86]],fox:492,built:false},
   habitat:{richness:4,status:'Habitat reduced',ground:'#cbd8a8',sky:'#eef4ef',
    line:'Habitat loss can reduce the number of species an area can support.',
    trees:[[80,1,'full'],[152,.88,'full']],
    shrubs:[300],grass:[52,112,186,262],
    beetles:[[124,236]],birds:[[168,92]],fox:null,built:true},
   later:{richness:6,status:'Recovering',ground:'#c6d7a2',sky:'#eef4ef',
    line:'The ecosystem can recover, but it may not return exactly to its original state.',
    resilience:'Resilience is an ecosystem\u2019s ability to recover after a disturbance.',
    trees:[[84,.42,'full'],[160,.36,'full'],[240,.3,'full']],
    shrubs:[286,330,374,418],grass:[46,96,146,196,246,296,346,396,446,496,542],
    beetles:[[124,236],[264,240],[392,234],[470,238]],birds:[[168,92],[228,74],[436,86]],fox:508,built:false}
  };

  return buttons([['healthy','Healthy ecosystem'],['fire','Fire'],['disease','Disease'],['habitat','Habitat loss'],['later','Years later']],mode=>{
   const st=STATES[mode];

   const built=st.built
    ? `<rect x="404" y="120" width="178" height="${GROUND-120}" fill="#ded8cd"/>`+
      `<rect x="430" y="140" width="56" height="74" fill="#c9bfb0" stroke="#a89c8a"/>`+
      `<path d="M424 140l34-24 34 24Z" fill="#9e8f7d"/>`+
      `<rect x="446" y="176" width="16" height="38" fill="#8d8271"/>`+
      `<rect x="506" y="158" width="52" height="56" fill="#c9bfb0" stroke="#a89c8a"/>`+
      `<path d="M500 158l32-20 32 20Z" fill="#9e8f7d"/>`+
      `<path d="M404 120v${GROUND-120}" stroke="#9a9384" stroke-width="2" stroke-dasharray="7 6"/>`+
      `<text x="493" y="112" text-anchor="middle" font-size="12" fill="#6f675a">woodland cleared</text>`
    : '';
   /* Scorch on the ground rather than marks floating above it. */
   const burn=st.burn
    ? [[118,10],[196,7],[330,9],[470,6]].map(([x,r])=>
       `<ellipse cx="${x}" cy="${GROUND+9}" rx="${r*2.2}" ry="${r*0.7}" fill="#8d7d63" opacity=".55"/>`).join('')
    : '';

   const scene=`<rect x="18" y="48" width="564" height="${GROUND+36-48}" rx="14" fill="${st.sky}" stroke="#cbd6c8"/>`+
    `<rect x="18" y="${GROUND}" width="564" height="36" rx="0" fill="${st.ground}"/>`+
    `<path d="M18 ${GROUND}h564" stroke="#a9b98d" stroke-width="2"/>`+
    built+
    st.trees.map(([x,scale,m])=>oak(x,scale,m)).join('')+
    st.shrubs.map(x=>shrub(x)).join('')+
    st.grass.map(x=>grass(x)).join('')+
    burn+
    st.beetles.map(([x,y])=>beetle(x,y)).join('')+
    st.birds.map(([x,y])=>bird(x,y)).join('')+
    (st.fox?fox(st.fox):'');

   /* Under the scene: what is there, what it is called, and one line. */
   const chip=(x,y,w,text,fill,ink)=>`<rect x="${x}" y="${y}" width="${w}" height="30" rx="10" fill="${fill}" stroke="#b9c9b4"/>`+
    `<text x="${x+w/2}" y="${y+20}" text-anchor="middle" font-size="14" fill="${ink}">${esc(text)}</text>`;
   const panel=chip(18,264,196,st.status,mode==='healthy'||mode==='later'?'#dcecdc':'#f0e6d8','#183d36')+
    chip(224,264,224,`Species richness: ${st.richness} kinds`,'#e8eef5','#1f4653')+
    `<text x="462" y="284" font-size="12.5" fill="#6a7b72">illustrative, not a survey</text>`;

   const lines=`<text x="18" y="322" font-size="14.5" fill="#183d36">${esc(st.line)}</text>`+
    (st.resilience?`<text x="18" y="346" font-size="14.5" fill="#33705a">${esc(st.resilience)}</text>`:'');

   drawing.innerHTML=svg(`${scene}${panel}${lines}`,
    `A woodland: ${st.status.toLowerCase()}. Species richness ${st.richness} kinds. ${st.line}`,
    st.resilience?360:336);
   caption.textContent='Biodiversity means the variety of living things in an ecosystem. Disturbances such as fire, disease, or habitat loss can change which species live there. A resilient ecosystem can recover over time, although it may not return exactly to the way it was before.';
  });
 }

 /* Unit 1 - Human impacts and conservation.

    The test this has to pass: a fourteen-year-old looks at it for five
    seconds and can say what happened, without reading the paragraph below.
    So the scene carries the consequence - the water, the algae, the fish -
    and seven numbered steps say it in plain English underneath.

    Two things are deliberate. The step that lowers the oxygen is the
    decomposers, not the algae "using it up", which is the mistake this
    lesson already warns about. And the oxygen is described in words, never
    a number, because an invented "3 out of 10" reads like a measurement
    somebody took. */
 if(type==='impact'){
  const fish=(x,y,c,sad)=>`<ellipse cx="${x}" cy="${y}" rx="15" ry="9" fill="${c}"/>`+
   `<path d="M${x+13} ${y}l13 -8v16Z" fill="${c}"/>`+
   `<circle cx="${x-7}" cy="${y-3}" r="1.9" fill="#f4f7f5"/>`+
   (sad?`<path d="M${x-13} ${y+4}q4 -4 8 -1" stroke="#f4f7f5" stroke-width="1.6" fill="none"/>`+
        `<circle cx="${x-17}" cy="${y-10}" r="3" fill="none" stroke="#e8efe9" stroke-width="1.5"/>`+
        `<circle cx="${x-23}" cy="${y-19}" r="2" fill="none" stroke="#e8efe9" stroke-width="1.5"/>`
       :`<path d="M${x-13} ${y+2}q4 4 8 1" stroke="#f4f7f5" stroke-width="1.6" fill="none"/>`);
  const algae=(x,y,n,c)=>Array.from({length:n},(_,i)=>
   `<ellipse cx="${x+i*30}" cy="${y+(i%2?7:0)}" rx="14" ry="7" fill="${c}"/>`+
   `<ellipse cx="${x+8+i*30}" cy="${y+10+(i%2?7:0)}" rx="9" ry="5" fill="${c}" opacity=".75"/>`).join('');
  const tuft=(x,y,c)=>`<path d="M${x-5} ${y}q5-13 1-17M${x} ${y}q2-15 0-18M${x+5} ${y}q-5-13-1-17" stroke="${c}" stroke-width="2.5" fill="none"/>`;
  const tree=(x,y,c)=>`<path d="M${x} ${y}v-9" stroke="#6b5334" stroke-width="3"/><circle cx="${x}" cy="${y-17}" r="9" fill="${c}"/>`;
  /* Drawn by hand rather than with the shared marker, whose head scales with
     the stroke width. */
  const flow=(x1,x2,y,h,c)=>`<path d="M${x1} ${y-h/2}H${x2-14}v${-h/2}l16 ${h}l-16 ${h}v${-h/2}H${x1}Z" fill="${c}"/>`;

  const RUNS={
   impact:{
    title:'How fertilizer runoff can hurt a stream',
    water:'#8fa860',lit:false,
    oxygen:'Low dissolved oxygen',fishLine:'Fish can struggle',
    scene:'algae everywhere',
    steps:['Fertilizer on field','Rain washes it in','Nutrients feed algae','Extra algae die','Decomposers use oxygen','Oxygen in water drops','Fish can struggle'],
    spoken:'Fertilizer on the field, rain washes nutrients into the stream, too many nutrients feed algae, the extra algae die and decompose, decomposers use oxygen, oxygen in the water drops, and fish can struggle.',
    note:'Fertilizer adds extra nutrients to the stream. This can cause too much algae to grow. When the extra algae die, decomposers use oxygen to break them down. Less oxygen in the water can make it harder for fish to survive.'},
   buffer:{
    title:'How a buffer strip can protect the stream',
    water:'#9dc6dc',lit:true,
    oxygen:'Higher dissolved oxygen',fishLine:'Healthier conditions for fish',
    scene:'clearer water',
    steps:['Grass and trees','Catch some runoff','Fewer nutrients','Less extra algae','Less to decompose','More oxygen stays','Healthier for fish'],
    spoken:'Grass and trees along the stream catch some of the runoff, fewer nutrients reach the water, there is less extra algae, less material decomposes, more oxygen stays in the water, and conditions are healthier for fish.',
    note:'Grass and trees along the stream can catch some runoff before it reaches the water. Fewer nutrients means less extra algae and less decomposition. That helps keep more oxygen in the water and creates healthier conditions for fish.'}
  };

  return buttons([['impact','Human impact'],['buffer','Conservation response']],mode=>{
   const run=RUNS[mode],lit=run.lit;

   /* --- the scene -------------------------------------------------------- */
   const fieldW=lit?150:168;
   const field=`<rect x="18" y="58" width="${fieldW}" height="96" rx="10" fill="#e3dcc3" stroke="#c3b894"/>`+
    `${[0,1,2,3,4].map(i=>`<circle cx="${40+i*((fieldW-44)/4)}" cy="${80+(i%2)*14}" r="3.5" fill="#c08a4a"/>`).join('')}`+
    `<text x="${18+fieldW/2}" y="146" text-anchor="middle" font-size="12.5" fill="#5d5330">fertilizer on the field</text>`;
   const buffer=lit
    ? `<rect x="176" y="58" width="60" height="96" rx="10" fill="#cfe0bd" stroke="#8fae76"/>`+
      /* Two trees and a tuft between them: enough to read as planting, and it
         leaves the strip's label somewhere to sit. */
      `${tree(192,118,'#6f8f5a')}${tree(220,122,'#89a86b')}${tuft(206,128,'#7f9d5c')}`+
      `<text x="206" y="146" text-anchor="middle" font-size="12" fill="#43613c">buffer</text>`
    : '';
   /* The thin band says "a little" better than the words would, and there is
      no room for them between the buffer and the water. */
   const runoff=lit
    ? flow(240,266,106,7,'#cbb894')
    : flow(196,268,106,22,'#c08a4a')+`<text x="230" y="92" text-anchor="middle" font-size="12" fill="#7d6a45">runoff</text>`;
   const streamX=268;
   const stream=`<rect x="${streamX}" y="58" width="${582-streamX}" height="96" rx="10" fill="${run.water}" stroke="#7d9aa8"/>`+
    (lit?algae(300,78,2,'#86ab6f'):algae(296,76,6,'#5a7a3a'))+
    (lit?`${fish(400,116,'#3f6c85',false)}${fish(470,100,'#3f6c85',false)}${fish(520,128,'#3f6c85',false)}`
        :`${fish(400,118,'#4d5a52',true)}${fish(496,122,'#4d5a52',true)}`)+
    `<text x="${(streamX+582)/2}" y="146" text-anchor="middle" font-size="12.5" fill="${lit?'#1f4653':'#2c3a22'}">${esc(run.scene)}</text>`;

   /* --- seven steps, numbered, so the order needs no connector ----------- */
   const chip=(x,y,w,n,text,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="36" rx="10" fill="${fill}" stroke="#a9bdb2"/>`+
    `<circle cx="${x+18}" cy="${y+18}" r="11" fill="#ffffff" stroke="#a9bdb2"/>`+
    `<text x="${x+18}" y="${y+23}" text-anchor="middle" font-size="12" font-weight="700" fill="#446d61">${n}</text>`+
    `<text x="${x+34}" y="${y+23}" font-size="12" fill="#183d36">${esc(text)}</text>`;
   const tints=lit
    ? ['#cfe3cb','#cfe3cb','#dfe8ee','#dfe8ee','#e6d6c6','#dfe8ee','#d7eede']
    : ['#efe0c6','#dfe8ee','#cfe3cb','#cfe3cb','#e6d6c6','#dfe8ee','#f2ddd0'];
   const W=182,GAP=9;
   const chain=run.steps.map((text,i)=>{
    const col=i%3,rowN=Math.floor(i/3);
    const x=18+col*(W+GAP),y=182+rowN*46;
    return chip(x,y,W,i+1,text,tints[i]);
   }).join('');

   const verdict=`<rect x="18" y="320" width="564" height="42" rx="11" fill="${lit?'#dff0e6':'#f6e3d7'}" stroke="${lit?'#8fb9a2':'#d3ab90'}"/>`+
    `<text x="300" y="346" text-anchor="middle" font-size="16" fill="#183d36">${esc(run.oxygen)}  \u00b7  ${esc(run.fishLine)}</text>`;

   drawing.innerHTML=svg(`${textSVG(300,34,run.title,18)}${field}${buffer}${runoff}${stream}${chain}${verdict}`,
    `${run.title}. ${run.spoken} ${run.oxygen}.`,376);
   caption.textContent=run.note;
  });
 }


 if(type==='web')return buttons([['normal','Show food web'],['loss','What if rabbits decline?']],mode=>{drawing.innerHTML=svg(`${line(140,190,250,65)}${line(150,195,265,190)}${line(350,65,460,65)}${line(350,190,460,85)}${line(340,215,460,245)}${box(30,165,130,65,'Grass')}${box(230,30,135,65,'Rabbits',mode==='loss'?'#efcfbf':'#e4eee5')}${box(230,170,135,65,'Mice')}${box(440,30,130,65,'Foxes')}${box(430,220,150,55,'Owls')}`,'A food web: grass feeds rabbits and mice; rabbits and mice feed foxes; mice feed owls.',310);caption.textContent=mode==='loss'?'Rabbit decline can reduce one food source for foxes. Mice are an alternative, so the final outcome depends on their availability and other interactions. These are possible effects, not an exact prediction.':'Arrows point from food to consumer. This is a simplified example; decomposers and many other connections are omitted. Click the scenario to reason about a change.';});
 if(type==='energy')return buttons([['photo','Photosynthesis'],['resp','Respiration'],['cycle','Carbon connection']],mode=>{const photo=mode==='photo';drawing.innerHTML=mode==='cycle'?svg(`${box(205,20,190,55,'Atmospheric CO₂','#d4e8ed')}${box(30,180,160,65,'Plant biomass')}${box(405,180,160,65,'Consumer biomass','#eadcc6')}${line(220,75,130,177)}${line(190,210,405,210)}${line(480,180,375,75)}${line(105,180,255,75)}${textSVG(105,116,'Photosynthesis',14)}${textSVG(490,120,'Respiration',14)}${textSVG(298,200,'Feeding',14)}`,'Simplified carbon pathways between atmospheric carbon dioxide and plant and consumer biomass.'):svg(`${box(35,95,160,70,photo?'CO₂ + water':'Glucose + O₂','#d8e8e5')}${line(197,130,395,130)}${box(400,95,170,70,photo?'Sugar + O₂':'CO₂ + water','#efe3c8')}${textSVG(300,65,photo?'Light energy enters':'Energy transferred')}${textSVG(300,212,photo?'Chloroplast · photosynthesis':'ATP + heat · respiration')}`,'Summary of '+(photo?'photosynthesis':'aerobic respiration')+' inputs and outputs.');caption.textContent=mode==='cycle'?'Carbon atoms move among reservoirs. This diagram omits soil, oceans, combustion, and other stores. Plants as well as consumers respire.':photo?'Summary: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Light supplies energy; atoms are rearranged. The detailed pathway is more complex.':'Summary: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O. Energy is transferred to ATP and dispersed as heat. Glycolysis is in the cytoplasm; later aerobic stages involve mitochondria in eukaryotes.';});
 if(type==='division')return buttons([['mitosis','Mitosis'],['meiosis','Meiosis']],mode=>{const mei=mode==='meiosis',cells=(cx,cy,n,color)=>`<circle cx="${cx}" cy="${cy}" r="35" fill="${color}" stroke="#658575"/>${Array.from({length:n},(_,i)=>`<path d="M${cx-15+i*10} ${cy-13}v26" stroke="${i%2?'#9d719e':'#426e65'}" stroke-width="5"/>`).join('')}`;drawing.innerHTML=svg(`${cells(300,50,4,'#e6eee1')}${line(280,86,170,140)}${line(320,86,430,140)}${cells(155,180,mei?2:4,'#e8dff0')}${cells(445,180,mei?2:4,'#e8dff0')}${mei?`${line(140,215,95,266)}${line(170,215,215,266)}${line(430,215,385,266)}${line(460,215,505,266)}${[85,225,375,515].map(x=>cells(x,310,2,'#e2ecde')).join('')}`:''}${textSVG(300,mei?374:255,mei?'Four haploid products · 2 chromosomes each':'Two daughter cells · 4 chromosomes each',17)}`,mei?'Overview of a diploid model cell with 4 chromosomes producing four haploid products with 2 each.':'Overview of a cell with 4 chromosomes producing two daughters with 4 each.',mei?405:290);caption.textContent=mei?'Meiosis: DNA is copied once before two divisions. Homologous chromosomes separate first, then sister chromatids. This overview shows chromosome-set counts, not detailed chromatid stages; crossing over is not drawn.':'Mitosis: DNA is copied before division, and duplicated chromosomes are separated so both daughter cells retain the chromosome number. Bars represent chromosome counts in this overview, not all stages of replication.';});
 if(type==='feedback')return buttons([['heat','Temperature rises'],['cold','Temperature falls']],mode=>{const hot=mode==='heat';drawing.innerHTML=svg(`${box(30,20,210,60,hot?'Temperature rises':'Temperature falls','#efe0c6')}${box(350,20,220,60,'Change detected')}${line(240,50,350,50)}${line(465,82,465,175)}${box(320,178,250,65,hot?'Sweating / skin blood flow':'Shivering / less skin flow','#dbe8ec')}${line(320,210,235,210)}${box(25,178,210,65,hot?'Heat loss increases':'Heat retained / produced')}${line(95,178,95,83)}`,'A negative feedback loop connecting a temperature disturbance to responses that counteract it.');caption.textContent=hot?'Negative feedback opposes the temperature rise. Evaporation of sweat can remove heat; effectiveness depends on conditions such as humidity.':'Responses to cooling can include shivering and reduced skin blood flow. These help increase heat production or reduce loss. This is a simplified loop, not a complete account of thermoregulation.';});
 if(type==='systems')return buttons([['lungs','Lungs'],['blood','Circulation'],['muscle','Muscles'],['nerves','Nervous system']],mode=>{drawing.innerHTML=svg(`${box(205,18,190,55,'Lungs',mode==='lungs'?'#bddddc':'#e4eee5')}${box(205,111,190,55,'Blood transport',mode==='blood'?'#e7c4b5':'#e4eee5')}${box(205,204,190,55,'Working muscles',mode==='muscle'?'#ead39c':'#e4eee5')}${line(290,74,290,110)}${line(310,110,310,74)}${line(290,167,290,203)}${line(310,203,310,167)}${box(15,110,160,65,'Nervous signals',mode==='nerves'?'#d7c4e5':'#e4eee5')}${line(174,160,215,218)}${textSVG(485,100,'O₂ delivered',15)}${textSVG(485,135,'CO₂ returned',15)}`,'Lungs exchange gases, blood transports them, and muscles use oxygen for metabolism; nervous signals coordinate activity.');caption.textContent={lungs:'Lungs provide exchange surfaces; oxygen diffuses into blood and carbon dioxide out under typical conditions.',blood:'Circulation connects exchange surfaces with tissues. Gas delivery depends on blood flow and transport capacity.',muscle:'Muscle cells use ATP for contraction and cellular processes to replenish it. Oxygen and fuels support aerobic respiration.',nerves:'Nervous signals coordinate contraction and contribute to regulation. The body’s systems work together rather than independently.'}[mode];});
 if(type==='tree')return buttons([['tree','Read the tree'],['pair','Compare B and C']],mode=>{drawing.innerHTML=svg(`<path d="M80 235V90H230M230 90V38H470M230 90V174H345M345 174V135H470M345 174V225H470" fill="none" stroke="#527b66" stroke-width="4"/><circle cx="230" cy="90" r="7" fill="#ad835c"/><circle cx="345" cy="174" r="${mode==='pair'?12:7}" fill="#ad835c"/>${textSVG(510,44,'Species A')}${textSVG(510,141,'Species B')}${textSVG(510,231,'Species C')}${textSVG(145,275,'Common ancestry',15)}`,'Species B and C share a more recent common ancestor; their lineage joins species A at an older node.',300);caption.textContent=mode==='pair'?'B and C share the highlighted, more recent ancestor. Rotating branches around a node would not change those relationships.':'Read branching connections, not distances between labels. The tree is schematic; branch length here does not represent time or amount of change.';});
 if(type==='enzyme'){
 controls.innerHTML='<label>Model temperature <input id="temperature" type="range" min="0" max="70" value="30"><output id="temperature-value"></output></label>';
 const rate=t=>t<=35?t/35:Math.max(0,1-(t-35)/20),draw=()=>{const t=+document.getElementById('temperature').value,r=rate(t);document.getElementById('temperature-value').textContent=t+' °C';drawing.innerHTML=svg(`<path d="M65 30V225H550" stroke="#678477" fill="none"/><path d="M65 225L300 45L435 225H535" stroke="#578b69" fill="none" stroke-width="4"/><circle cx="${65+t/70*470}" cy="${225-r*180}" r="8" fill="#b8764b"/>${textSVG(310,265,'Temperature (°C)')}${textSVG(100,22,'Relative activity',14)}${textSVG(65,245,'0',14)}${textSVG(300,245,'35',14)}${textSVG(535,245,'70',14)}`,'Hypothetical enzyme activity rises to an optimum and then declines at higher temperature.');caption.textContent=`Model activity: ${Math.round(r*100)}% of its maximum. This deliberately simplified curve has a chosen optimum of 35 °C; it is not measured data or a universal enzyme optimum. Above its working range, loss of structure can reduce activity.`;};document.getElementById('temperature').oninput=draw;draw();return;
 }
 buttons([['graph','Compare growth'],['reason','Explain the evidence']],mode=>{drawing.innerHTML=svg(`<path d="M60 30V225H550" stroke="#678477" fill="none"/>${[0,2,4,6,8].map(n=>`${textSVG(37,230-n*20,String(n),14)}<path d="M60 ${225-n*20}H545" stroke="#dde5db"/>`).join('')}<path d="M60 225L180 185L300 145L420 105L540 65" stroke="#467c60" stroke-width="4" fill="none"/><path d="M60 225L180 215L300 205L420 195L540 185" stroke="#aa7851" stroke-width="4" fill="none" stroke-dasharray="8 5"/>${textSVG(310,275,'Days (0, 1, 2, 3, 4)')}${textSVG(120,20,'Height gained (cm)',14)}${textSVG(410,48,'Light group: 8 cm',16)}${textSVG(410,176,'Dark group: 2 cm',16)}`,'Hypothetical growth data: light group gains 0,2,4,6,8 cm over days 0–4; dark group gains 0,0.5,1,1.5,2 cm.',300);caption.textContent=mode==='reason'?'Claim: the light group grew more under these conditions. Evidence: 8 cm versus 2 cm gained over four days. Reasoning: light supports photosynthesis. Check sample size, variation, and controlled conditions before making a wider causal claim.':'Invented teaching data, not an actual experiment. Solid green: light group; dashed brown: dark group. Light is the treatment; height gained is the measured outcome. What conditions would you keep the same?';});
}

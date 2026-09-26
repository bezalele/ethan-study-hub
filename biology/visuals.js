'use strict';
const svg=(body,label,h=280)=>`<svg viewBox="0 0 600 ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#446d61"/></marker></defs>${body}</svg>`;
const textSVG=(x,y,t,size=18)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#183d36">${esc(t)}</text>`;
const box=(x,y,w,h,t,fill='#e4eee5')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}" stroke="#789787"/>${textSVG(x+w/2,y+h/2+6,t)}`;
const line=(x,y,a,b)=>`<path d="M${x} ${y}L${a} ${b}" fill="none" stroke="#446d61" stroke-width="2" marker-end="url(#arrow)"/>`;
const VISUAL_NAMES={experiment:'Read an experiment',enzyme:'Enzyme activity explorer',web:'Explore a food web',population:'Population growth model',energy:'Follow matter and energy',cell:'Explore a living cell',membrane:'Which way will water move?',systems:'A sprint is a team effort',feedback:'Trace a feedback loop',dna:'DNA base-pair builder',division:'Compare cell divisions',punnett:'Build a Punnett square',selection:'Selection over generations',tree:'Read a family tree of life',photosynthesis:'Follow carbon into a plant',respiration:'Follow energy from glucose to ATP',trophic:'Where does the energy go?',carboncycle:'Follow carbon through Earth',biodiversity:'How does an ecosystem respond to change?',impact:'What happens to the stream?'};
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

   /* --- and what "years later" means, which depends on what happened --- */

   'fire-later':{richness:6,status:'Years after the fire',ground:'#c6d7a2',sky:'#eef4ef',
    line:'After fire, an ecosystem may recover if soil, seeds, roots, and nearby organisms remain.',
    second:'Recovery can happen through ecological succession.',
    trees:[[84,.42,'full'],[160,.36,'full'],[240,.3,'full']],
    shrubs:[286,330,374,418],grass:[46,96,146,196,246,296,346,396,446,496,542],
    beetles:[[124,236],[264,240],[392,234],[470,238]],birds:[[168,92],[228,74],[436,86]],fox:508,built:false},

   'disease-later':{richness:6,status:'Years after the disease',ground:'#c6d7a2',sky:'#eef4ef',
    line:'After disease, some populations may recover, while the community may also change.',
    second:'Here a few resistant oaks remain and shrubs have taken much of the space.',
    trees:[[80,.9,'full'],[152,.5,'full'],[236,.95,'stump']],
    shrubs:[286,330,374,418],grass:[52,112,186,262,332,404,452,506,548],
    beetles:[[124,236],[306,240],[428,234]],birds:[[168,92],[228,74],[436,86]],fox:492,built:false},

   'habitat-later':{richness:4,status:'Years later \u00b7 without restoration',ground:'#cbd8a8',sky:'#eef4ef',
    line:'Habitat loss does not automatically reverse over time. If the land stays developed, the original habitat cannot simply grow back.',
    trees:[[80,1,'full'],[152,.88,'full']],
    shrubs:[300],grass:[52,112,186,262,332],
    beetles:[[124,236]],birds:[[168,92]],fox:null,built:true},

   'habitat-restored':{richness:5,status:'Years later \u00b7 with restoration',ground:'#c6d7a2',sky:'#eef4ef',
    line:'Recovery is possible if habitat is restored, but it takes time and may not recreate the original ecosystem exactly.',
    trees:[[80,1,'full'],[152,.88,'full'],[420,.4,'full'],[500,.34,'full']],
    shrubs:[300,344,470],grass:[52,112,186,262,332,404,452,506,548],
    beetles:[[124,236],[306,240],[428,234]],birds:[[168,92],[436,86]],fox:null,built:'restored'}
  };

  /* The five controls, plus - only where it means something - a choice
     between leaving the land developed and putting habitat back. */
  let picked='healthy',after=null,restored=false;

  const drawControls=()=>{
   const main=[['healthy','Healthy ecosystem'],['fire','Fire'],['disease','Disease'],['habitat','Habitat loss'],['later','Years later']];
   const armed=!!after;
   controls.innerHTML=main.map(([value,label])=>{
    const on=value==='later'?picked==='later':picked===value;
    const off=value==='later'&&!armed;
    return `<button class="soft" data-value="${value}" aria-pressed="${on}"${off?' disabled title="Choose a disturbance first"':''}>${label}</button>`;
   }).join('')+
   (armed?'':'<span class="small muted">Choose a disturbance, then see what happens years later.</span>')+
   (picked==='later'&&after==='habitat'
    ? '<div class="controls" data-restore>'+
      [['no','Without restoration'],['yes','With restoration']].map(([v,l])=>
       `<button class="soft" data-restore-value="${v}" aria-pressed="${(v==='yes')===restored}">${l}</button>`).join('')+
      '</div>'
    : '');
   controls.querySelectorAll('[data-value]').forEach(b=>b.onclick=()=>{
    const v=b.dataset.value;
    if(v==='later'){ if(!after) return; picked='later'; }
    else { picked=v; if(v==='fire'||v==='disease'||v==='habitat'){ after=v; restored=false; } }
    draw();
   });
   controls.querySelectorAll('[data-restore-value]').forEach(b=>b.onclick=()=>{
    restored=b.dataset.restoreValue==='yes';
    draw();
   });
  };

  const draw=()=>{
   drawControls();
   const key=picked==='later'
    ? (after==='habitat'?(restored?'habitat-restored':'habitat-later'):after+'-later')
    : picked;
   const st=STATES[key];

   const built=st.built
    ? (st.built==='restored'
      ? `<rect x="404" y="120" width="178" height="${GROUND-120}" fill="#e6ecdc"/>`+
        `<rect x="430" y="150" width="46" height="64" fill="#c9bfb0" stroke="#a89c8a"/>`+
        `<path d="M424 150l29-20 29 20Z" fill="#9e8f7d"/>`+
        `<path d="M404 120v${GROUND-120}" stroke="#9a9384" stroke-width="2" stroke-dasharray="7 6"/>`+
        `<text x="500" y="112" text-anchor="middle" font-size="12" fill="#4a6b45">replanted</text>`
      : `<rect x="404" y="120" width="178" height="${GROUND-120}" fill="#ded8cd"/>`+
        `<rect x="430" y="140" width="56" height="74" fill="#c9bfb0" stroke="#a89c8a"/>`+
        `<path d="M424 140l34-24 34 24Z" fill="#9e8f7d"/>`+
        `<rect x="446" y="176" width="16" height="38" fill="#8d8271"/>`+
        `<rect x="506" y="158" width="52" height="56" fill="#c9bfb0" stroke="#a89c8a"/>`+
        `<path d="M500 158l32-20 32 20Z" fill="#9e8f7d"/>`+
        `<path d="M404 120v${GROUND-120}" stroke="#9a9384" stroke-width="2" stroke-dasharray="7 6"/>`+
        /* The moment it happens, and the years after it, are different
           sentences: one is the clearing, the other is its persistence. */
        `<text x="493" y="112" text-anchor="middle" font-size="12" fill="#6f675a">${key==='habitat'?'woodland cleared':'still developed'}</text>`)
    : '';
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

   const chip=(x,y,w,text,fill,ink)=>`<rect x="${x}" y="${y}" width="${w}" height="30" rx="10" fill="${fill}" stroke="#b9c9b4"/>`+
    `<text x="${x+w/2}" y="${y+20}" text-anchor="middle" font-size="14" fill="${ink}">${esc(text)}</text>`;
   const good=key==='healthy'||key==='fire-later'||key==='disease-later'||key==='habitat-restored';
   const panel=chip(18,264,250,st.status,good?'#dcecdc':'#f0e6d8','#183d36')+
    chip(278,264,212,`Species richness: ${st.richness} kinds`,'#e8eef5','#1f4653')+
    `<text x="502" y="284" font-size="12" fill="#6a7b72">illustrative</text>`;

   /* The long lines wrap by hand: SVG text does not. */
   const wrap=(text,width)=>{
    const words=String(text).split(' '),lines=[];let line='';
    words.forEach(w=>{
     if((line+' '+w).trim().length*7.1>width){lines.push(line.trim());line=w;}
     else line=(line+' '+w).trim();
    });
    if(line)lines.push(line);
    return lines;
   };
   const lines=wrap(st.line,556).map((t,i)=>`<text x="18" y="${318+i*21}" font-size="14.5" fill="#183d36">${esc(t)}</text>`).join('');
   const secondY=318+wrap(st.line,556).length*21+3;
   const second=st.second?`<text x="18" y="${secondY}" font-size="14.5" fill="#33705a">${esc(st.second)}</text>`:'';

   drawing.innerHTML=svg(`${scene}${panel}${lines}${second}`,
    `A woodland: ${st.status.toLowerCase()}. Species richness ${st.richness} kinds. ${st.line}`,
    (st.second?secondY:318+wrap(st.line,556).length*21)+14);
   caption.textContent='Biodiversity means the variety of living things in an ecosystem. Disturbances such as fire, disease, and habitat loss can affect ecosystems in different ways. Some ecosystems can recover naturally, while others need restoration. Recovery does not always mean returning exactly to the original state.';
  };

  draw();
  return;
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


 /* Unit 2 - Photosynthesis: build with light.

    The point a fourteen-year-old should leave with is that the plant is
    largely built out of the air, which is counter-intuitive enough that the
    picture has to carry it: carbon atoms are drawn as discs, they arrive in
    CO2, and the same discs turn up in the sugar and then in the plant. The
    equation is present but small - support, not the lesson.

    And it says in the same breath that water and minerals are needed too,
    because "plants are made of air" is the overcorrection waiting on the
    far side of the misconception this lesson exists to fix. */
 if(type==='photosynthesis'){
  /* An arrowhead that stays the size it was drawn: the shared one scales
     with stroke-width, which turned a 3px line into a road sign. */
  const DEFS='<defs><marker id="pa" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" refX="9" refY="5.5" orient="auto">'+
   '<path d="M0 1L10 5.5L0 10Z" fill="currentColor"/></marker></defs>';
  const arrow=(d,color,dash)=>`<path d="${d}" stroke="${color}" fill="none" stroke-width="2.6" color="${color}"`+
   (dash?' stroke-dasharray="7 6"':'')+' marker-end="url(#pa)"/>';
  const sun=(x,y,r=25)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#f0cf7a"/>`+
   [0,45,90,135,180,225,270,315].map(a=>{
    const t=a*Math.PI/180;
    return `<path d="M${(x+Math.cos(t)*(r+6)).toFixed(1)} ${(y+Math.sin(t)*(r+6)).toFixed(1)}L${(x+Math.cos(t)*(r+14)).toFixed(1)} ${(y+Math.sin(t)*(r+14)).toFixed(1)}" stroke="#e3b95a" stroke-width="3" stroke-linecap="round"/>`;
   }).join('');
  const carbon=(x,y,r=9)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#5d6b60"/>`+
   `<text x="${x}" y="${y+4.5}" text-anchor="middle" font-size="${Math.max(12,r+3)}" fill="#fff">C</text>`;
  const co2=(x,y)=>`<circle cx="${x-14}" cy="${y}" r="6.5" fill="#9db9c9"/>`+carbon(x,y)+
   `<circle cx="${x+14}" cy="${y}" r="6.5" fill="#9db9c9"/>`;
  const label=(x,y,text,size=13,ink='#183d36',anchor='middle')=>
   `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="${ink}">${esc(text)}</text>`;
  const chip=(x,y,w,head,body,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="46" rx="11" fill="${fill}" stroke="#b9c9b4"/>`+
   `<text x="${x+15}" y="${y+19}" font-size="12" letter-spacing="0.8" fill="#54685c">${esc(head)}</text>`+
   `<text x="${x+15}" y="${y+37}" font-size="14.5" fill="#183d36">${esc(body)}</text>`;
  /* The same plant in both scenes, drawn around a given base point. */
  const plant=(cx,base,k=1)=>{
   const h=110*k;
   return `<path d="M${cx-52*k} ${base}h${104*k}l-${13*k} ${38*k}h-${78*k}Z" fill="#c08f6a"/>`+
    `<rect x="${cx-58*k}" y="${base-12*k}" width="${116*k}" height="${13*k}" rx="5" fill="#a97853"/>`+
    `<path d="M${cx} ${base-10*k}V${base-h}" stroke="#6b8a4e" stroke-width="${8*k}" stroke-linecap="round"/>`+
    `<path d="M${cx} ${base-h+30*k}q-${62*k} ${8*k} -${78*k} -${30*k}q${54*k} -${20*k} ${78*k} ${30*k}Z" fill="#5f8a4e"/>`+
    `<path d="M${cx} ${base-h}q${54*k} -${22*k} ${84*k} ${16*k}q-${46*k} ${35*k} -${84*k} -${16*k}Z" fill="#6f9a57"/>`+
    `<path d="M${cx} ${base-h+22*k}q-${36*k} -${2*k} -${54*k} -${16*k}M${cx} ${base-h+2*k}q${30*k} -${6*k} ${54*k} ${11*k}" stroke="#3f6236" stroke-width="1.7" fill="none"/>`;
  };

  return buttons([['in','Matter in'],['sugar','Build sugar'],['limits','Limiting factors']],mode=>{

   if(mode==='in'){
    drawing.innerHTML=svg(DEFS+
     sun(86,78)+
     plant(300,268)+
     arrow('M118 112L246 180','#d8a944',true)+
     label(150,110,'sunlight \u00b7 energy',13,'#8a6a2a','start')+
     co2(492,150)+co2(536,112)+
     arrow('M466 152L372 166','#5f7f8c')+
     label(492,186,'carbon dioxide from the air',13,'#3d5d69')+
     arrow('M300 330V300','#6b9fc0')+
     arrow('M300 254V196','#6b9fc0',true)+
     label(300,348,'water from the roots',13,'#33627d')+
     chip(18,364,266,'MATTER \u00b7 what it is built from','carbon dioxide + water','#e4eef5')+
     chip(300,364,266,'ENERGY \u00b7 what does the building','sunlight','#f6ecd6'),
     'A plant taking in carbon dioxide from the air and water through its roots, with sunlight arriving as energy.',424);
    caption.textContent='Carbon dioxide and water provide matter. Sunlight provides energy. Matter is what the plant is built from; energy is what does the building.';
    return;
   }

   if(mode==='sugar'){
    drawing.innerHTML=svg(DEFS+
     sun(62,62,20)+
     arrow('M86 88L188 152','#d8a944',true)+
     /* the leaf, opened up */
     `<path d="M170 196q56-92 196-54q-38 98-196 54Z" fill="#5f8a4e"/>`+
     `<ellipse cx="264" cy="156" rx="58" ry="30" fill="#7ba762" stroke="#3f6236"/>`+
     label(264,161,'chloroplast',13,'#1d3419')+
     label(236,240,'photosynthesis happens in here',12,'#3f6236')+
     /* in */
     co2(64,150)+co2(64,196)+co2(64,242)+
     arrow('M92 152L176 170','#5f7f8c')+
     arrow('M92 196H176','#5f7f8c')+
     arrow('M92 240L176 200','#5f7f8c')+
     label(64,272,'carbon dioxide',12.5,'#3d5d69')+
     /* Out: the carbon, now in sugar. Deliberately NOT a count - three
        molecules in and three discs out would read as the equation, and the
        equation says six. The discs trace where the atoms came from; the
        balanced summary underneath does the arithmetic. */
     arrow('M372 150L410 140','#4e7a5f')+
     `<rect x="416" y="118" width="128" height="36" rx="12" fill="#e8eef5" stroke="#a9c0cc"/>`+
     carbon(436,136,9)+
     label(462,141,'carbon from CO\u2082',12.5,'#2d4d5c','start')+
     arrow('M480 158V186','#4e7a5f')+
     `<path d="M416 190h112a26 26 0 0 1 0 52h-112a26 26 0 0 1 0-52Z" fill="#efe0b8" stroke="#c9ad6c"/>`+
     label(472,210,'sugar (glucose)',13,'#6b5520')+
     label(472,230,'C\u2086H\u2081\u2082O\u2086',12.5,'#8a7340')+
     /* out: oxygen */
     arrow('M340 196L352 244','#5f7f8c')+
     `<circle cx="358" cy="258" r="11" fill="#cfe2ea" stroke="#8fb3c4"/>`+
     `<circle cx="378" cy="272" r="8.5" fill="#cfe2ea" stroke="#8fb3c4"/>`+
     label(300,286,'oxygen out',12.5,'#3d5d69')+
     /* and where the sugar ends up: the third link in the same chain */
     arrow('M480 246V272','#9a7f45')+
     `<rect x="416" y="274" width="128" height="40" rx="12" fill="#e6efe1" stroke="#a9c0a2"/>`+
     plant(440,308,.17)+
     label(462,299,'becomes',12,'#4a6b53','start')+
     label(462,312,'plant material',12,'#4a6b53','start')+
     label(300,374,'The carbon atoms in sugar came from carbon dioxide in the air.',15.5,'#183d36')+
     label(300,396,'Water and minerals are needed too \u2014 a plant is not built from air alone.',13,'#4a6b53')+
     label(300,422,'6CO\u2082 + 6H\u2082O + light \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082',13,'#78867d')+
     label(300,440,'The drawing follows where the atoms go; the equation is what balances.',11.5,'#93a099'),
     'Carbon dioxide entering a leaf, the same carbon atoms appearing in a sugar molecule, oxygen leaving, and the sugar becoming plant material.',456);
    caption.textContent='Follow the carbon: it arrives as carbon dioxide, it is built into sugar, and the sugar becomes the plant. Light is the energy that drives the building, not an ingredient - and water and mineral nutrients are needed as well.';
    return;
   }

   /* limiting factors */
   const curve=(k,color,dash)=>{
    const pts=[];
    for(let x=0;x<=100;x+=4){const r=k*(1-Math.exp(-x/22));pts.push([70+x*4.4,252-r*1.6]);}
    return `<polyline points="${pts.map(p=>p.map(n=>n.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="4"${dash?' stroke-dasharray="8 6"':''}/>`;
   };
   drawing.innerHTML=svg(DEFS+
    `<path d="M70 44V252H542" stroke="#6c8278" fill="none" stroke-width="2"/>`+
    label(306,284,'more light \u2192',13,'#54685c')+
    `<text x="34" y="150" font-size="13" fill="#54685c" transform="rotate(-90 34 150)" text-anchor="middle">rate of photosynthesis \u2191</text>`+
    curve(112,'#4e8a5f',false)+
    curve(74,'#8fae76',true)+
    label(468,70,'with more CO\u2082',13,'#2f6a44','start')+
    label(468,164,'with less CO\u2082',13,'#5f7d55','start')+
    label(306,62,'More light makes it faster \u2014 up to a point.',15,'#183d36')+
    label(306,308,'Then something else is holding it back, and more light does not help.',14,'#183d36')+
    chip(18,326,130,'CAN LIMIT IT','light','#f6ecd6')+
    chip(158,326,130,'CAN LIMIT IT','carbon dioxide','#e4eef5')+
    chip(298,326,130,'CAN LIMIT IT','water','#e4eef5')+
    chip(438,326,130,'CAN LIMIT IT','temperature','#f1e6ef'),
    'Two light-response curves: the rate rises with light and then levels off, and it levels off lower when less carbon dioxide is available.',390);
   caption.textContent='Raising one factor speeds photosynthesis only while that factor is the one holding it back. When the curve flattens, something else has become limiting - here, the carbon dioxide. Light, carbon dioxide, water and temperature can each take that role. These curves are illustrative shapes, not measured data.';
  });
 }

 /* Unit 2 - Cellular respiration: make ATP available.

    Four states, one story: fuel and oxygen in, the work of the cell out.
    Two things this has to get right, because both are wrong in most
    fourteen-year-olds' heads before the lesson and in plenty afterwards:
    breathing is not cellular respiration, and a mitochondrion does not make
    energy. So "transferred" is the word everywhere, heat leaves in every
    state that has an arrow to spare, and the body-and-cell distinction is
    drawn rather than asserted.

    Deliberately absent: the Krebs cycle, electron carriers, the transport
    chain, ATP counts. The learning point is where things happen and what
    becomes what. */
 if(type==='respiration'){
  const DEFS='<defs><marker id="ra" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" refX="9" refY="5.5" orient="auto">'+
   '<path d="M0 1L10 5.5L0 10Z" fill="currentColor"/></marker></defs>';
  const arrow=(d,color,dash)=>`<path d="${d}" stroke="${color}" fill="none" stroke-width="2.6" color="${color}"`+
   (dash?' stroke-dasharray="7 6"':'')+' marker-end="url(#ra)"/>';
  const label=(x,y,text,size=13,ink='#183d36',anchor='middle')=>
   `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="${ink}">${esc(text)}</text>`;
  const pill=(x,y,w,h,text,fill,ink,size)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(14,h/2)}" fill="${fill}" stroke="#b3c3bb"/>`+
   label(x+w/2,y+h/2+(size||13)/3+1,text,size||13,ink||'#183d36');
  /* The label sits under the shape, not squeezed inside it. A word small
     enough to fit in a 24px hexagon is a word nobody reads. Pass '' where
     the layout names the molecule some other way. */
  const glucose=(x,y,cap='glucose')=>`<path d="M${x} ${y-16}l14 8v17l-14 8l-14-8v-17Z" fill="#e8c98a" stroke="#c09b52"/>`+
   (cap?label(x,y+36,cap,12.5,'#6b5520'):'');
  const o2=(x,y,cap='oxygen')=>`<circle cx="${x-9}" cy="${y}" r="11" fill="#cfe2ea" stroke="#8fb3c4"/>`+
   `<circle cx="${x+9}" cy="${y}" r="11" fill="#cfe2ea" stroke="#8fb3c4"/>`+
   /* the two outlines meet right where the letters go, so fill the seam first */
   `<ellipse cx="${x}" cy="${y}" rx="12" ry="6" fill="#cfe2ea"/>`+
   label(x,y+4.5,'O\u2082',13,'#3d5d69')+
   (cap?label(x,y+36,cap,12.5,'#3d5d69'):'');
  const atp=(x,y,k=1)=>`<rect x="${x-26*k}" y="${y-15*k}" width="${52*k}" height="${30*k}" rx="${9*k}" fill="#d9e9d6" stroke="#6f9a6a"/>`+
   label(x,y+5*k,'ATP',15*k,'#2f5c34');
  const cell=(cx,cy,rx,ry,fill='#eef4ef')=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="#93a89b" stroke-width="2"/>`;
  const mito=(cx,cy,k=1)=>`<ellipse cx="${cx}" cy="${cy}" rx="${46*k}" ry="${24*k}" fill="#efc9a8" stroke="#b98253" stroke-width="2"/>`+
   `<path d="M${cx-30*k} ${cy-8*k}q${10*k} ${16*k} ${20*k} 0q${10*k} -${16*k} ${20*k} 0" stroke="#b98253" stroke-width="${2.4*k}" fill="none"/>`;
  const heat=(x,y)=>[0,1,2].map(i=>`<path d="M${x+i*13} ${y}q4-8 0-13q-4-6 0-11" stroke="#c08552" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('');

  return buttons([['fuel','Fuel + oxygen'],['inside','Inside the cell'],['work','ATP at work'],['low','Low oxygen']],mode=>{

   if(mode==='fuel'){
    /* The cell is drawn large enough to hold the ATP, because where the ATP
       ends up is half the point: carbon dioxide, water and heat leave; the
       ATP does not. Nothing on the right-hand side of this picture is ATP. */
    drawing.innerHTML=svg(DEFS+
     cell(300,168,138,96)+
     label(300,104,'inside a cell',12,'#54685c')+
     label(300,140,'cellular respiration',16,'#183d36')+
     label(300,160,'transfers energy from glucose',12.5,'#54685c')+
     arrow('M300 172V194','#4e7a5f')+
     atp(300,212)+
     label(300,244,'ATP stays inside the cell',12,'#2f5c34')+
     /* used */
     glucose(66,124,'glucose from food')+o2(66,206)+
     arrow('M94 124H170','#b98253')+
     arrow('M94 206H170','#5f7f8c')+
     /* produced, and dispersed - no ATP among them */
     arrow('M424 124L482 106','#5f7f8c')+
     arrow('M442 168H482','#5f7f8c')+
     arrow('M424 212L482 230','#c08552')+
     label(488,110,'carbon dioxide',12.5,'#3d5d69','start')+
     label(488,173,'water',12.5,'#3d5d69','start')+
     label(488,234,'heat',12.5,'#8a5a2c','start')+
     pill(18,290,564,44,'Breathing brings oxygen into your body. Cellular respiration happens inside your cells.','#e4eef5','#1f4653',14.5)+
     label(300,356,'glucose + O\u2082 \u2192 CO\u2082 + H\u2082O, with energy transferred to ATP and heat',12.5,'#78867d'),
     'A cell using glucose and oxygen. Carbon dioxide, water and heat leave the cell; the ATP stays inside it.',376);
    caption.textContent='Glucose and oxygen are used in cellular respiration. Carbon dioxide and water are produced, some energy is released as heat, and energy from glucose is transferred to ATP inside the cell. The ATP is not something the cell sends out - it is the form the cell can spend, right where it was made. And note where all this happens: breathing is your lungs, respiration is your cells.';
    return;
   }

   if(mode==='inside'){
    drawing.innerHTML=svg(DEFS+
     /* One cell, two places, in order. Rounded rather than elliptical: the
        cytoplasm column runs to the bottom-left, which is precisely the
        corner an ellipse does not have. */
     `<rect x="24" y="48" width="552" height="256" rx="56" fill="#eef4ef" stroke="#93a89b" stroke-width="2"/>`+
     label(300,80,'one cell',13,'#54685c')+
     label(150,118,'CYTOPLASM',11.5,'#54685c')+
     label(150,140,'glycolysis begins here',13.5,'#183d36')+
     glucose(120,184,'')+label(146,189,'glucose',12.5,'#6b5520','start')+
     arrow('M150 214V236','#b98253')+
     label(150,252,'a little ATP,',12.5,'#2f5c34')+
     label(150,268,'and molecules that carry on',12.5,'#54685c')+
     arrow('M214 180H286','#6b8a4e')+
     label(250,166,'then',12,'#54685c')+
     mito(400,170)+
     label(400,120,'MITOCHONDRION',11.5,'#54685c')+
     label(400,222,'later aerobic stages happen here',13,'#183d36')+
     label(400,244,'most of the ATP is made available here',12.5,'#2f5c34')+
     arrow('M452 150L492 132','#5f7f8c')+
     label(496,116,'CO₂ + H₂O',12.5,'#3d5d69')+
     pill(18,318,272,42,'Oxygen is needed for the later stages','#e4eef5','#1f4653',13.5)+
     pill(306,318,276,42,'Plant cells have mitochondria and respire too','#e6efe1','#3c6340',13.5),
     'One cell: glycolysis begins in the cytoplasm, and the later aerobic stages happen in a mitochondrion.',378);
    caption.textContent='Glycolysis starts in the cytoplasm and does not need oxygen. What it produces carries on into the mitochondrion, where the later aerobic stages need oxygen and make most of the ATP available. This is about where and in what order - the chemistry inside each stage is a later course.';
    return;
   }

   if(mode==='work'){
    drawing.innerHTML=svg(DEFS+
     glucose(72,110,'')+label(72,146,'chemical energy',12.5,'#6b5520')+label(72,164,'in food',12.5,'#6b5520')+
     arrow('M100 114L156 124','#b98253')+
     cell(232,140,72,50)+label(232,136,'cellular',12.5,'#183d36')+label(232,152,'respiration',12.5,'#183d36')+
     arrow('M306 140H352','#4e7a5f')+
     atp(392,140,1.15)+
     arrow('M432 140H452','#4e7a5f')+
     /* what the cell spends it on */
     pill(456,92,132,36,'muscles contract','#f3e6da','#7a4e28',12.5)+
     pill(456,136,132,36,'active transport','#e4eef5','#1f4653',12.5)+
     pill(456,180,132,36,'building materials','#e6efe1','#3c6340',12.5)+
     arrow('M432 132L452 112','#4e7a5f')+
     arrow('M432 150L452 194','#4e7a5f')+
     /* the part that is not work */
     arrow('M392 166V204','#c08552',true)+heat(376,238)+
     label(392,262,'some energy leaves as heat',12.5,'#8a5a2c')+
     label(300,312,'Cellular respiration transfers energy from glucose \u2014 it does not create it.',15,'#183d36')+
     pill(18,330,564,44,'ATP is the form the cell can spend: it powers the work, then is remade.','#e6efe1','#2f5c34',14.5),
     'Chemical energy in food passes through cellular respiration into ATP, which powers muscle contraction, active transport and building materials, with some energy leaving as heat.',394);
    caption.textContent='This is why a cell bothers. The energy in glucose is not in a form the cell can spend; ATP is. Respiration transfers it - nothing creates it, and some of it leaves as heat at every step, which is why you warm up when you work.';
    return;
   }

   /* low oxygen */
   const bar=(x,y,w,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="26" rx="8" fill="${fill}" stroke="#96a89b"/>`;
   drawing.innerHTML=svg(DEFS+
    label(300,42,'The same glucose, two situations',16,'#183d36')+
    /* --- enough oxygen ------------------------------------------------- */
    pill(18,62,268,34,'ENOUGH OXYGEN','#e4eef5','#1f4653',13)+
    glucose(52,136)+o2(112,136)+
    arrow('M138 136H172','#5f7f8c')+
    label(228,134,'aerobic',12.5,'#183d36')+
    label(228,152,'respiration',12.5,'#183d36')+
    label(18,204,'much more ATP',13,'#2f5c34','start')+
    bar(18,214,268,'#a8cf9f')+
    label(18,258,'from each glucose molecule',12,'#54685c','start')+
    /* --- limited oxygen ------------------------------------------------ */
    pill(314,62,268,34,'LIMITED OXYGEN','#f3e6da','#7a4e28',13)+
    glucose(348,136,'glucose')+
    arrow('M376 136H408','#b98253')+
    label(416,134,'glycolysis keeps going,',12.5,'#183d36','start')+
    label(416,152,'helped by fermentation',12.5,'#183d36','start')+
    label(314,204,'much less ATP',13,'#7a4e28','start')+
    bar(314,214,64,'#e8c98a')+
    label(314,258,'from each glucose molecule',12,'#54685c','start')+
    /* --- what it means -------------------------------------------------- */
    label(300,296,'When oxygen is limited, fermentation allows glycolysis to keep going.',14.5,'#183d36')+
    label(300,318,'The cell still gets some ATP \u2014 far less than aerobic respiration gets from the same glucose.',13,'#54685c')+
    pill(18,338,564,40,'During a hard sprint, muscles may rely more on glycolysis for a short time.','#f3e6da','#7a4e28',13.5),
    'Two situations for the same glucose: with enough oxygen, aerobic respiration makes much more ATP available; with limited oxygen, fermentation lets glycolysis continue for much less.',396);
   caption.textContent='Fermentation is not respiration without oxygen - it is what lets glycolysis carry on when the aerobic stages cannot. The cell keeps getting a trickle of ATP rather than stopping, and pays for it: the same glucose yields far less than it would aerobically. The bars show that difference, not measured numbers.';
  });
 }

 /* Unit 2 - Food webs and energy pyramids: where the energy goes.

    The lesson's title promises two things and the shared food-web diagram
    only delivered one of them. This visual follows a single chain - grass,
    grasshopper, frog, hawk - through four states, and every one of them is
    making the same point: energy arrives, most of it is spent staying alive
    or disperses as heat, and only what ends up built into an organism's own
    body is there for the next one to eat.

    Four organisms, not a web. A web shows who eats whom; this lesson is
    about how much is left, and a crowded web hides that.

    The 10% figure appears twice and is called an estimate both times. The
    bar in "Energy at one level" carries no numbers at all: its proportions
    are illustrative, and it says so on the picture. */
 if(type==='trophic'){
  const DEFS='<defs><marker id="tr" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" refX="9" refY="5.5" orient="auto">'+
   '<path d="M0 1L10 5.5L0 10Z" fill="currentColor"/></marker></defs>';
  const arrow=(d,color,dash)=>`<path d="${d}" stroke="${color}" fill="none" stroke-width="2.6" color="${color}"`+
   (dash?' stroke-dasharray="7 6"':'')+' marker-end="url(#tr)"/>';
  const label=(x,y,text,size=13,ink='#183d36',anchor='middle')=>
   `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="${ink}">${esc(text)}</text>`;
  const pill=(x,y,w,h,text,fill,ink,size)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(14,h/2)}" fill="${fill}" stroke="#b3c3bb"/>`+
   label(x+w/2,y+h/2+(size||13)/3+1,text,size||13,ink||'#183d36');
  const card=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#f4f7f2" stroke="#b3c3bb"/>`;
  const fmt=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');
  const units=n=>fmt(n)+(n===1?' unit':' units');

  /* The four organisms. Drawn rather than named twice, because a fourteen
     year old reads a picture before he reads a caption. */
  const grass=(x,y)=>`<path d="M${x-15} ${y}q7-21 3-27M${x-7} ${y}q4-24 1-30M${x} ${y}q1-26 -2-32M${x+8} ${y}q-4-24 -1-30M${x+16} ${y}q-7-21 -3-27" stroke="#6b9a4e" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const hopper=(x,y,k=1)=>`<g transform="translate(${x} ${y}) scale(${k})">`+
   '<path d="M4 3l9-14l11 19" stroke="#5c7f3b" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+
   '<path d="M-9 7l-4 9M-1 8l-2 9" stroke="#5c7f3b" stroke-width="2" fill="none" stroke-linecap="round"/>'+
   '<ellipse cx="0" cy="0" rx="19" ry="8" fill="#7fae52" stroke="#5c7f3b"/>'+
   '<path d="M-10 -3q12-5 24 2" stroke="#5c7f3b" stroke-width="1.4" fill="none"/>'+
   '<circle cx="-20" cy="-4" r="6.5" fill="#7fae52" stroke="#5c7f3b"/>'+
   '<circle cx="-22" cy="-5" r="1.6" fill="#2f3f22"/>'+
   '<path d="M-24 -9l-8-7M-21 -10l-5-10" stroke="#5c7f3b" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+
   '</g>';
  const frog=(x,y,k=1)=>`<g transform="translate(${x} ${y}) scale(${k})">`+
   '<path d="M-24 -8q-9 5 -4 12q5 5 11 0Z" fill="#5d8c48" stroke="#446b34"/>'+
   '<path d="M24 -8q9 5 4 12q-5 5 -11 0Z" fill="#5d8c48" stroke="#446b34"/>'+
   '<ellipse cx="0" cy="-12" rx="21" ry="13" fill="#6fa257" stroke="#4d7a3c"/>'+
   '<circle cx="-9" cy="-25" r="6.5" fill="#6fa257" stroke="#4d7a3c"/>'+
   '<circle cx="9" cy="-25" r="6.5" fill="#6fa257" stroke="#4d7a3c"/>'+
   '<circle cx="-9" cy="-26" r="2.4" fill="#22301c"/><circle cx="9" cy="-26" r="2.4" fill="#22301c"/>'+
   '<path d="M-11 -9q11 6 22 0" stroke="#3f6630" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+
   '<path d="M-17 1q-3 5 2 6M17 1q3 5 -2 6" stroke="#4d7a3c" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
   '</g>';
  const hawk=(x,y,k=1)=>`<g transform="translate(${x} ${y}) scale(${k})">`+
   '<path d="M-6 -6q-28-12 -44 2q16 3 23 11q10 5 21-3Z" fill="#a9784f" stroke="#6d4a2d"/>'+
   '<path d="M6 -6q28-12 44 2q-16 3 -23 11q-10 5 -21-3Z" fill="#a9784f" stroke="#6d4a2d"/>'+
   '<path d="M-7 14l7 18l7-18Z" fill="#8e6340" stroke="#6d4a2d"/>'+
   '<ellipse cx="0" cy="0" rx="9" ry="20" fill="#9a6b45" stroke="#6d4a2d"/>'+
   '<circle cx="0" cy="-24" r="7.5" fill="#c6a882" stroke="#6d4a2d"/>'+
   '<path d="M6 -27q8 2 7 6q-4 2 -8 0Z" fill="#d8a13c" stroke="#a9762a" stroke-width="0.8"/>'+
   '<circle cx="2" cy="-26" r="1.7" fill="#2b2118"/>'+
   '</g>';
  const sun=(x,y)=>`<circle cx="${x}" cy="${y}" r="11" fill="#f2d07a" stroke="#d3ac4a"/>`+
   [0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180;
    return `<path d="M${(x+Math.cos(r)*14).toFixed(1)} ${(y+Math.sin(r)*14).toFixed(1)}L${(x+Math.cos(r)*19).toFixed(1)} ${(y+Math.sin(r)*19).toFixed(1)}" stroke="#d3ac4a" stroke-width="2" stroke-linecap="round"/>`;}).join('');

  const TIER=['#b9d6a8','#d8dba6','#ecd2a0','#e6b697'];
  const LEVELS=[['PRODUCERS','Grass'],['PRIMARY CONSUMERS','Grasshopper'],['SECONDARY CONSUMERS','Frog'],['TERTIARY CONSUMERS','Hawk']];

  let mode='arrows',start=10000;
  const STATES=[['arrows','Follow the arrows'],['pyramid','Build the pyramid'],['one','Energy at one level'],['ten','Try the 10% estimate']];
  const STARTS=[1000,5000,10000,20000];

  const drawControls=()=>{
   controls.innerHTML=STATES.map(([v,l])=>
    `<button class="soft" data-value="${v}" aria-pressed="${mode===v}">${l}</button>`).join('')+
    (mode==='ten'
     ? '<div class="controls" data-start><span class="small muted">Producers start with</span>'+
       STARTS.map(v=>`<button class="soft" data-start-value="${v}" aria-pressed="${start===v}">${fmt(v)}</button>`).join('')+
       '</div>'
     : '');
   controls.querySelectorAll('[data-value]').forEach(b=>b.onclick=()=>{mode=b.dataset.value;draw();});
   controls.querySelectorAll('[data-start-value]').forEach(b=>b.onclick=()=>{start=+b.dataset.startValue;draw();});
  };

  const draw=()=>{
   drawControls();

   /* 1. Follow the arrows. Students read food-chain arrows backwards more
         often than any other diagram in the course, so the direction is
         said on the picture, not left to the caption. */
   if(mode==='arrows'){
    const cx=[69,223,377,531];
    const names=['Grass','Grasshopper','Frog','Hawk'];
    const roles=['PRODUCER','PRIMARY CONSUMER','SECONDARY CONSUMER','TERTIARY CONSUMER'];
    drawing.innerHTML=svg(DEFS+
     label(300,36,'One food chain, four feeding levels',15.5,'#183d36')+
     cx.map(x=>card(x-48,76,96,100)).join('')+
     grass(69,150)+hopper(223,126)+frog(377,154)+hawk(531,126,.78)+
     /* after the cards, or the card fill swallows the sunbeam */
     sun(44,30)+label(44,58,'sunlight',11.5,'#8a6a2c')+
     arrow('M46 66L64 112','#d9a441',true)+
     /* named, so the dashed beam is never read as another meal */
     label(134,64,'Light energy enters the producer.',12,'#8a6a2c','start')+
     [0,1,2].map(i=>arrow(`M${cx[i]+52} 126H${cx[i+1]-52}`,'#6b8a4e')).join('')+
     [0,1,2].map(i=>label((cx[i]+cx[i+1])/2,110,'eaten by',11.5,'#54685c')).join('')+
     cx.map((x,i)=>label(x,198,names[i],13.5,'#183d36')).join('')+
     cx.map((x,i)=>label(x,216,roles[i],11.5,'#54685c')).join('')+
     pill(18,236,564,42,'Food-chain arrows point from food → consumer.','#e6efe1','#2f5c34',15)+
     label(300,300,'Grass captures energy from sunlight and stores it in its own biomass.',12.5,'#54685c'),
     'A food chain: grass, then grasshopper, then frog, then hawk, with each arrow pointing from the food to the organism that eats it.',324);
    caption.textContent='Read the arrows the way they are drawn: each one points from the food to the organism eating it, because that is the direction the energy moves. Grass is the producer and everything after it is a consumer. Every food-chain arrow is a transfer of energy that is already in the ecosystem; the sunlight is the one arrow bringing new energy in.';
    return;
   }

   /* 2. The same chain, stacked by how much energy is available. */
   if(mode==='pyramid'){
    const tier=(d,fill)=>`<path d="${d}" fill="${fill}" stroke="#93a89b" stroke-width="1.5"/>`;
    drawing.innerHTML=svg(DEFS+
     label(300,34,'The same chain, drawn as an energy pyramid',15.5,'#183d36')+
     tier('M60 254H540L500 208H100Z',TIER[0])+
     tier('M100 208H500L458 162H142Z',TIER[1])+
     tier('M142 162H458L416 116H184Z',TIER[2])+
     tier('M184 116H416L374 70H226Z',TIER[3])+
     /* Role above, organism beside its number. One long line does not
        fit in the top tier, and the top tier is the whole point. */
     label(300,224,'PRODUCERS',11.5,'#3c6340')+
     label(300,244,'Grass · 10,000 energy units',14,'#183d36')+
     label(300,178,'PRIMARY CONSUMERS',11.5,'#5c6b33')+
     label(300,198,'Grasshopper · 1,000',14,'#183d36')+
     label(300,132,'SECONDARY CONSUMERS',11.5,'#7a5a28')+
     label(300,152,'Frog · 100',14,'#183d36')+
     label(300,86,'TERTIARY CONSUMERS',11.5,'#8a5a2c')+
     label(300,106,'Hawk · 10',14,'#183d36')+
     label(36,204,'× 0.10',11.5,'#7a4e28')+
     label(36,158,'× 0.10',11.5,'#7a4e28')+
     label(36,112,'× 0.10',11.5,'#7a4e28')+
     label(300,284,'Example using the 10% classroom estimate',13,'#54685c')+
     label(300,304,'Real transfer efficiencies vary.',12.5,'#78867d')+
     pill(18,322,564,42,'The pyramid narrows because less energy is available at each higher level.','#e6efe1','#2f5c34',14.5),
     'An energy pyramid of four levels: grass with 10,000 energy units, grasshopper with 1,000, frog with 100 and hawk with 10, each level narrower than the one below.',380);
    caption.textContent='The same four organisms, stacked by how much energy is available at each level. These numbers use the 10% classroom estimate, which is a figure for practice rather than a measurement - real transfer efficiencies vary a good deal. What is reliable is the shape: each level up has less to work with than the one below it.';
    return;
   }

   /* 3. Where the energy actually goes at one level. No percentages: the
         bar is illustrative and says so, because the honest answer is
         "most of it, and it varies". */
   /* Two destinations, not three. Heat is not a third place the energy
      goes - it is what the energy spent on living eventually becomes, so
      it hangs off the life-processes column rather than standing beside
      it. And growing belongs with biomass, not with life processes: it is
      the growing that the next trophic level gets to eat. */
   if(mode==='one'){
    const seg=(x,w,fill)=>`<rect x="${x}" y="68" width="${w}" height="38" fill="${fill}" stroke="#96a89b"/>`;
    const tick=x=>`<path d="M${x} 108V118" stroke="#b3c3bb" stroke-width="1.6"/>`;
    const heat=(x,y)=>[0,1,2].map(i=>`<path d="M${x+i*13} ${y}q4-8 0-13q-4-6 0-11" stroke="#c08552" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('');
    drawing.innerHTML=svg(DEFS+
     label(300,30,'What one frog does with the energy it obtains',15.5,'#183d36')+
     frog(58,60,.55)+
     label(86,58,'energy obtained from food',12,'#54685c','start')+
     seg(40,400,'#cfe0c8')+seg(440,120,'#a8cf9f')+
     tick(240)+tick(500)+
     /* --- used for living, and what becomes of it --------------------- */
     label(240,134,'used for life processes',13,'#2f5c34')+
     label(240,152,'movement \u00b7 metabolism \u00b7 maintaining the body',12,'#54685c')+
     arrow('M240 166V188','#c08552')+
     heat(226,216)+
     label(240,240,'Much of this energy eventually disperses as heat.',12.5,'#8a5a2c')+
     /* --- stored, and therefore edible -------------------------------- */
     label(500,134,'stored as new biomass',12.5,'#2f5c34')+
     label(500,152,'the frog\u2019s own body',12,'#54685c')+
     arrow('M500 166V190','#6b8a4e')+
     hawk(500,216,.62)+
     label(500,252,'on to the hawk',12,'#2f5c34')+
     /* --- the sentence the unit turns on ------------------------------ */
     label(300,288,'Energy stored in biomass can move to the next trophic level',14,'#183d36')+
     label(300,308,'if the organism is eaten.',14,'#183d36')+
     label(300,330,'Energy is transferred and dispersed \u2014 none of it disappears.',12.5,'#54685c')+
     label(300,348,'Proportions in the bar are illustrative, not measured.',12,'#93a099')+
     `<rect x="18" y="362" width="564" height="54" rx="14" fill="#efe7da" stroke="#c9b79a"/>`+
     label(300,384,'Decomposers obtain energy from dead organic material',13,'#6b5520')+
     label(300,403,'and return matter \u2014 nutrients \u2014 to soil, water and air.',12.5,'#6b5520'),
     'A bar showing the energy one frog obtains, divided into a large part used for life processes - movement, metabolism and maintaining the body, much of which eventually disperses as heat - and a smaller part stored as new biomass, which is the part a hawk can obtain.',434);
    caption.textContent='Most of what the frog eats is spent on living: moving about, keeping its chemistry going, holding its body in working order. Much of that energy eventually disperses as heat - heat is where the spent energy ends up, not a third place it goes. What is left over is built into the frog itself, and that is the part a hawk can obtain. Decomposers take their energy from dead material and return matter to the soil, water and air; they do not send the energy back.';
    return;
   }

   /* 4. The arithmetic, with the starting number in his hands. Changing it
         changes every row and changes nothing about the shape of the
         answer - which is the point worth arriving at by himself. */
   const vals=[start,start/10,start/100,start/1000];
   drawing.innerHTML=svg(DEFS+
    label(300,34,'Start with the producers, then take 10% at each step',15,'#183d36')+
    LEVELS.map(([role,who],i)=>{
     const y=60+i*68;
     return `<rect x="40" y="${y}" width="320" height="40" rx="12" fill="${TIER[i]}" stroke="#93a89b"/>`+
      label(54,y+17,role,11.5,'#3f5a44','start')+
      label(54,y+33,who,13,'#183d36','start')+
      label(346,y+27,units(vals[i]),15,'#183d36','end');
    }).join('')+
    grass(505,96)+hopper(505,148,.92)+frog(505,230,.78)+hawk(505,284,.6)+
    [0,1,2].map(i=>{
     const gy=100+i*68;
     return arrow(`M190 ${gy+4}V${gy+24}`,'#7a4e28')+
      label(222,gy+18,fmt(vals[i])+' × 0.10 = '+fmt(vals[i+1]),12.5,'#7a4e28','start');
    }).join('')+
    pill(18,320,564,42,'10% is a practice estimate. Real ecosystems vary.','#f3e6da','#7a4e28',14.5)+
    label(300,384,'These are practice numbers, not measured wildlife data.',12,'#93a099'),
    `An energy calculation. Producers begin with ${fmt(vals[0])} units and each level above receives one tenth of the level below it, giving ${fmt(vals[1])}, then ${fmt(vals[2])}, then ${fmt(vals[3])}.`,400);
   caption.textContent=`Producers start with ${fmt(vals[0])} units. A tenth of that reaches the grasshoppers, a tenth of theirs reaches the frogs, and so on: ${fmt(vals[0])} → ${fmt(vals[1])} → ${fmt(vals[2])} → ${fmt(vals[3])}. Change the starting number and the shape of the answer does not change. After three transfers, only a small fraction of the starting energy remains available at the top level. Ten per cent is a classroom estimate for practice; real ecosystems vary.`;
  };
  draw();return;
 }

 /* Unit 2 - Carbon and matter cycling: where carbon is, and how it moves.

    One Earth-system model, drawn identically in all four states. The buttons
    do not redraw the world; they light up different paths across the same
    six reservoirs, so the thing being learned is that these are the same
    places every time and only the route changes.

    The two ideas the states are built around, in order of how badly they
    are usually got wrong:

      Combustion does not make carbon. It was already underground. Every
      word on that state is chosen so the arrow reads as a move, not a
      source - hence "the carbon was already stored underground".

      Conservation of matter does not mean every reservoir stays the same
      size. That is why the last state carries an arithmetic panel: 12 in,
      8 out, +4, with no atoms created anywhere.

    Deliberately absent: global carbon budgets, real flux figures, anything
    resembling a climate model. The numbers on the balance panel say in
    writing that they are illustrative. */
 if(type==='carboncycle'){
  const DEFS='<defs>'+
   '<marker id="ca" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" refX="9" refY="5.5" orient="auto">'+
   '<path d="M0 1L10 5.5L0 10Z" fill="currentColor"/></marker>'+
   '<marker id="cb" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" refX="9" refY="5.5" orient="auto-start-reverse">'+
   '<path d="M0 1L10 5.5L0 10Z" fill="currentColor"/></marker></defs>';
  const arrow=(d,color,dash,wide)=>`<path d="${d}" stroke="${color}" fill="none" stroke-width="${wide||2.6}" color="${color}"`+
   (dash?' stroke-dasharray="7 6"':'')+' marker-end="url(#ca)"/>';
  const both=(d,color)=>`<path d="${d}" stroke="${color}" fill="none" stroke-width="2.6" color="${color}" marker-start="url(#cb)" marker-end="url(#ca)"/>`;
  const plain=(d,color)=>`<path d="${d}" stroke="${color}" fill="none" stroke-width="2.2"/>`;
  const label=(x,y,text,size=13,ink='#183d36',anchor='middle')=>
   `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" fill="${ink}">${esc(text)}</text>`;
  const pill=(x,y,w,h,text,fill,ink,size)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(14,h/2)}" fill="${fill}" stroke="#b3c3bb"/>`+
   label(x+w/2,y+h/2+(size||13)/3+1,text,size||13,ink||'#183d36');

  /* The six reservoirs, fixed. Every state draws all of them in the same
     place; a state may only fade the ones its path does not touch. */
  const R={
   atm:   {x:24, y:42,  w:552, h:54,  fill:'#dfeaf2', line:'#a9c0cc'},
   plant: {x:32, y:152, w:140, h:80,  fill:'#dcebd6', line:'#93b489'},
   animal:{x:206,y:152, w:140, h:80,  fill:'#f3e6da', line:'#c9a986'},
   ocean: {x:386,y:152, w:190, h:154, fill:'#cfe2ea', line:'#8fb3c4'},
   soil:  {x:32, y:250, w:314, h:56,  fill:'#e7dcc6', line:'#c2ae8b'},
   deep:  {x:24, y:326, w:552, h:54,  fill:'#d4cec5', line:'#9a9086'}
  };
  const res=(k,inner,dim)=>{const b=R[k];
   return `<g${dim?' opacity="0.38"':''}><rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="12" fill="${b.fill}" stroke="${b.line}" stroke-width="1.5"/>${inner}</g>`;};

  const co2=(x,y)=>`<circle cx="${x-12}" cy="${y}" r="6" fill="#9db9c9"/>`+
   `<circle cx="${x}" cy="${y}" r="7.5" fill="#5d6b60"/>`+
   `<circle cx="${x+12}" cy="${y}" r="6" fill="#9db9c9"/>`;
  const tree=(x,y)=>`<path d="M${x} ${y}v-20" stroke="#7a5c38" stroke-width="5" stroke-linecap="round"/>`+
   `<circle cx="${x}" cy="${y-28}" r="13" fill="#6f9a5c"/>`+
   `<circle cx="${x-11}" cy="${y-20}" r="9" fill="#6f9a5c"/>`+
   `<circle cx="${x+11}" cy="${y-21}" r="9" fill="#6f9a5c"/>`;
  const beast=(x,y)=>`<ellipse cx="${x}" cy="${y-16}" rx="22" ry="12" fill="#b58a5e" stroke="#8d6842"/>`+
   `<path d="M${x-20} ${y-6}v6M${x-9} ${y-5}v7M${x+9} ${y-5}v7M${x+19} ${y-6}v6" stroke="#8d6842" stroke-width="3.4" stroke-linecap="round"/>`+
   `<path d="M${x+16} ${y-24}l7-8" stroke="#8d6842" stroke-width="5" stroke-linecap="round"/>`+
   `<circle cx="${x+25}" cy="${y-29}" r="8" fill="#b58a5e" stroke="#8d6842"/>`+
   `<path d="M${x+21} ${y-36}l-3-8M${x+29} ${y-36}l3-8" stroke="#8d6842" stroke-width="2.4" stroke-linecap="round"/>`+
   `<circle cx="${x+28}" cy="${y-30}" r="1.6" fill="#3a2a1c"/>`;
  const crumbs=(x,y)=>`<path d="M${x-26} ${y}q8-7 16 0q8 7 16 0M${x-26} ${y+9}q8-7 16 0q8 7 16 0" stroke="#9a7f45" stroke-width="2.2" fill="none"/>`+
   [[-18,-10],[2,-12],[18,-9]].map(([a,b])=>`<circle cx="${x+a}" cy="${y+b}" r="3" fill="#6b5520"/>`).join('');
  const waves=(x,y)=>[0,1,2].map(i=>`<path d="M${x-58} ${y+i*11}q14-8 29 0q15 8 29 0" stroke="#7aa6ba" stroke-width="2.2" fill="none"/>`).join('');
  const fish=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="14" ry="7" fill="#79a7bb" stroke="#4d7e93"/>`+
   `<path d="M${x+13} ${y}l10-6v12Z" fill="#79a7bb" stroke="#4d7e93"/>`+
   `<circle cx="${x-7}" cy="${y-2}" r="1.6" fill="#173741"/>`;
  const strata=(x,y,w)=>[0,1,2].map(i=>`<path d="M${x} ${y+i*9}h${w}" stroke="#a89e92" stroke-width="1.6"/>`).join('')+
   `<ellipse cx="${x+w/2}" cy="${y+13}" rx="${w*0.34}" ry="6" fill="#5f5648" opacity=".6"/>`;

  /* The world. `fade` names the reservoirs a state is not using. */
  const scene=(fade)=>{
   fade=fade||{};
   return res('atm',
     co2(76,68)+co2(524,68)+
     label(300,64,'ATMOSPHERE',11.5,'#2d4d5c')+
     label(300,86,'carbon dioxide (CO₂) in the air',12.5,'#1f4653'),fade.atm)+
    res('plant',
     tree(102,198)+
     label(102,212,'PLANTS',11.5,'#3c6340')+
     label(102,228,'living biomass',12,'#2f5c34'),fade.plant)+
    res('animal',
     beast(268,198)+
     label(276,212,'ANIMALS',11.5,'#7a5a28')+
     label(276,228,'living biomass',12,'#7a4e28'),fade.animal)+
    res('ocean',
     waves(481,172)+fish(470,284)+
     label(481,218,'OCEAN',11.5,'#2d4d5c')+
     label(481,238,'dissolved carbon',12,'#1f4653')+
     label(481,256,'and living things',12,'#1f4653'),fade.ocean)+
    res('soil',
     crumbs(82,284)+
     label(212,272,'SOIL',11.5,'#6b5520')+
     label(212,292,'dead matter and decomposers',12,'#6b5520'),fade.soil)+
    res('deep',
     strata(44,340,72)+strata(484,340,72)+
     label(300,348,'LONG-TERM STORAGE',11.5,'#4a4038')+
     label(300,368,'rocks and fossil fuels',12.5,'#4a4038'),fade.deep);
  };

  return buttons([['stores','Carbon reservoirs'],['atom','Follow a carbon atom'],['natural','Natural transfers'],['burn','Add combustion']],mode=>{

   /* 1. Where carbon is. No arrows at all - the point of this state is that
         the air is one store among six, not the whole story. */
   if(mode==='stores'){
    drawing.innerHTML=svg(DEFS+scene()+
     label(300,406,'A reservoir is a place where carbon is stored.',14.5,'#183d36')+
     `<rect x="18" y="420" width="564" height="60" rx="14" fill="#e6efe1" stroke="#b3c3bb"/>`+
     label(300,444,'Carbon is not only in the air — it is also in living things,',13,'#2f5c34')+
     label(300,464,'in soil, in the ocean, and locked in rock for very long times.',13,'#2f5c34'),
     'Six carbon reservoirs: the atmosphere, plants, animals, the ocean, soil, and long-term storage in rocks and fossil fuels.',494);
    caption.textContent='Six places carbon can be sitting right now. Most people picture carbon as something in the air, and it is - but far more of it is in the ocean, in soil and in rock, and a good deal of it is in you. A reservoir is simply a store; the rest of this visual is about how carbon gets from one store to another.';
    return;
   }

   /* 2. One atom, one route - and an alternative, so the route never reads
         as the route. The dimmed reservoirs are the ones this path skips. */
   if(mode==='atom'){
    drawing.innerHTML=svg(DEFS+scene({ocean:1,deep:1})+
     arrow('M64 100V148','#4e7a5f')+
     label(74,124,'1  PHOTOSYNTHESIS',11.5,'#2f5c34','start')+
     arrow('M176 192H202','#7a4e28')+
     label(189,176,'2  FEEDING',11.5,'#7a4e28')+
     arrow('M250 148V100','#5f7f8c')+
     label(260,114,'3  CELLULAR',11.5,'#2d4d5c','start')+
     label(260,132,'RESPIRATION',11.5,'#2d4d5c','start')+
     /* or the long way round */
     arrow('M102 236V246','#9a7f45',true)+
     arrow('M268 236V246','#9a7f45',true)+
     label(189,246,'DEATH',11.5,'#6b5520')+
     arrow('M340 248L366 214V100','#9a7f45',true)+
     label(376,124,'DECOMPOSITION',11.5,'#6b5520','start')+
     label(300,406,'The same carbon atom moves through different parts of the system.',14,'#183d36')+
     label(300,426,'This is one possible pathway — carbon can take many other routes.',12.5,'#54685c')+
     pill(18,440,564,42,'Carbon atoms are transferred and rearranged. They do not disappear.','#e6efe1','#2f5c34',13.5),
     'One carbon atom traced from the air into a plant by photosynthesis, into an animal by feeding, and back to the air by respiration, with a dashed alternative through death and decomposition in the soil.',496);
    caption.textContent='Follow one atom. Photosynthesis lifts it out of the air and into a plant; feeding carries it into an animal; respiration puts it back. The dashed route is just as real: the plant or the animal dies, decomposers in the soil break the material down, and the carbon returns from there instead. Same atom, different road - and there are many more roads than these two.';
    return;
   }

   /* 3. The whole network. Respiration from plants and from animals merges
         above the boxes into one labelled arrow, which is both true and the
         only way four process names fit on one line without colliding. */
   if(mode==='natural'){
    drawing.innerHTML=svg(DEFS+scene()+
     arrow('M64 100V148','#4e7a5f')+
     label(74,118,'PHOTOSYNTHESIS',11.5,'#2f5c34','start')+
     plain('M120 150L195 128','#5f7f8c')+plain('M250 150L195 128','#5f7f8c')+
     arrow('M195 130V100','#5f7f8c')+
     label(205,118,'RESPIRATION',11.5,'#2d4d5c','start')+
     arrow('M176 192H202','#7a4e28')+
     label(189,176,'FEEDING',11.5,'#7a4e28')+
     arrow('M102 236V246','#9a7f45')+arrow('M268 236V246','#9a7f45')+
     label(189,246,'DEATH',11.5,'#6b5520')+
     arrow('M340 248L366 214V100','#9a7f45')+
     label(356,142,'DECOMPOSITION',11.5,'#6b5520','end')+
     both('M450 148V100','#4d7e93')+
     label(460,118,'OCEAN EXCHANGE',11.5,'#2d4d5c','start')+
     arrow('M120 310V322','#8a8073',true)+arrow('M480 310V322','#8a8073',true)+
     label(300,320,'slowly, over very long times',11.5,'#6f675d')+
     label(300,406,'The carbon cycle is a network of transfers, not one single loop.',14,'#183d36')+
     pill(18,420,564,44,'A flux is the rate carbon moves from one reservoir to another.','#e4eef5','#1f4653',14),
     'The natural carbon network: photosynthesis into plants, feeding into animals, respiration back to the air, death into the soil, decomposition back to the air, exchange both ways with the ocean, and a slow dashed path into long-term storage.',480);
    caption.textContent='Now all of it at once. Notice there is no single circle to trace: carbon leaves the air by photosynthesis or by dissolving into the ocean, and it comes back by respiration, by decomposition, or out of the sea again. Each arrow is a flux - a rate, not an amount - and the arrows run at very different speeds. Burial into rock is the slowest of them by a long way, which is why it is drawn dashed.';
    return;
   }

   /* 4. The human arrow, and the arithmetic that settles the conservation
         question. The numbers are labelled illustrative on the picture. */
   drawing.innerHTML=svg(DEFS+scene()+
    arrow('M64 100V148','#4e7a5f')+
    label(74,118,'PHOTOSYNTHESIS',11.5,'#2f5c34','start')+
    arrow('M450 100V148','#4d7e93')+
    label(460,118,'OCEAN UPTAKE',11.5,'#2d4d5c','start')+
    arrow('M366 324V100','#c0562f',0,4)+
    label(356,118,'COMBUSTION',11.5,'#a8451f','end')+
    label(356,318,'burning fossil fuels',11.5,'#a8451f','end')+
    label(300,404,'The carbon was already stored underground — combustion moves it into the air.',12,'#183d36')+
    `<rect x="18" y="416" width="564" height="66" rx="14" fill="#f3e6da" stroke="#c9b79a"/>`+
    label(140,440,'INTO the atmosphere',11.5,'#7a4e28')+
    label(140,466,'12 units',16,'#7a4e28')+
    label(300,440,'OUT of the atmosphere',11.5,'#7a4e28')+
    label(300,466,'8 units',16,'#7a4e28')+
    label(460,440,'NET CHANGE',11.5,'#7a4e28')+
    label(460,466,'+4 units',16,'#2f5c34')+
    label(300,504,'12 − 8 = +4. The atmosphere grows because more carbon enters than leaves.',12.5,'#183d36')+
    label(300,522,'Carbon is still conserved — 12 units left the store underground.',12.5,'#54685c')+
    label(300,540,'Illustrative example — not measured Earth data.',11.5,'#93a099'),
    'Combustion drawn as a thick arrow carrying carbon from long-term storage up into the atmosphere, with photosynthesis and ocean uptake removing some again, and a balance panel showing 12 units in, 8 units out, a net change of plus 4.',556);
   caption.textContent='Burning fossil fuels does not make carbon. The atoms were already there, held underground for a very long time; combustion moves them into the air in a moment. Photosynthesis and the ocean take some of it back out, but if 12 units arrive and 8 leave, the atmosphere holds 4 more than it did. Carbon is still conserved. Combustion moved carbon out of long-term storage; in this example 12 units entered the atmosphere and 8 units moved from the atmosphere into other reservoirs such as plants and the ocean, leaving the atmosphere with a net gain of 4. Three stores changed and no atom was made: conservation has never meant each reservoir stays the same size. The figures here are for practice, not measurements of Earth.';
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

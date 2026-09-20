const content = window.EthanStudyHubContent;
const state = { questionIndex: 0, selectedConstitution: 'preamble' };
const storyState = { declaration: { slide: 0 } };

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem('ethanProgress') || '[]');
  } catch (error) {
    return [];
  }
}

function updateProgress() {
  const progress = getProgress();
  const percent = Math.min(100, Math.round((progress.length / 5) * 100));
  const label = document.getElementById('progress');
  if (label) label.textContent = `${percent}% explored`;
}

function mark(x) {
  const entries = getProgress();
  if (!entries.includes(x)) {
    entries.push(x);
    localStorage.setItem('ethanProgress', JSON.stringify(entries));
  }
  updateProgress();
}

function show(id) {
  document.querySelectorAll('.page').forEach((page) => page.classList.remove('active'));
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add('active');
  document.body.classList.remove('no-scroll');
  document.querySelectorAll('header nav button').forEach(b => b.classList.remove('active-nav'));
  const navKey = id === 'story' || id === 'declaration' ? 'learn' : id === 'constitution' || id === 'library' ? 'library' : id;
  const nav = document.querySelector('header nav [data-nav="'+navKey+'"]');
  if (nav) nav.classList.add('active-nav');
  window.scrollTo({top:0,behavior:'instant'});
  mark(navKey);
}


const learnChapters = {
  1:{kicker:'CHAPTER 01 · FOUNDATIONS',title:'Why was American government designed this way?',intro:'Follow one problem through the founding: government must be strong enough to work, but limited enough to protect liberty.',model:'Britain felt too powerful → the Articles were too weak → the Constitution sought balance.',steps:[
    ['Why government?','People need common rules, security, ways to settle disputes, and institutions capable of acting.'],
    ['Colonies & Britain','Colonists lived under British authority while developing their own political habits and expectations.'],
    ['Declaration','Independence turned the conflict into an argument about natural rights and consent of the governed.'],
    ['Articles of Confederation','The first national framework deliberately kept the central government weak.'],
    ['Why it struggled','The national government lacked important tools to raise revenue and coordinate the states.'],
    ['Constitutional Convention','Delegates redesigned the system around stronger national power, representation, and checks.'],
    ['Constitution & Bill of Rights','Power was divided and limited; amendments added explicit protections for individual liberty.'],
    ['Federalism','National and state governments share authority — a tension that continues throughout the course.']]},
  2:{kicker:'CHAPTER 02 · BRANCHES & POWER',title:'Who has power — and who can stop them?',intro:'The Constitution divides national power among institutions that must cooperate but also restrain one another.',model:'Congress makes → President executes → Courts interpret → Bureaucracy implements.',steps:[
    ['Congress','House and Senate represent differently, make laws, control spending, and oversee government.'],
    ['The Presidency','The president executes laws and has formal and informal tools that shape national policy.'],
    ['The Courts','Federal courts resolve disputes and interpret laws and the Constitution.'],
    ['The Bureaucracy','Departments and agencies turn broad laws into everyday administration and policy.'],
    ['Checks & Balances','Appointments, vetoes, impeachment, oversight and judicial review keep power contested.'],
    ['Policymaking','Policy emerges from interaction — not from one branch acting alone.']]},
  3:{kicker:'CHAPTER 03 · LIBERTIES & RIGHTS',title:'What can government do — and what must it not do?',intro:'This chapter separates two ideas that are easy to mix up: liberty from government interference and equal treatment under law.',model:'Civil liberties = freedom FROM government. Civil rights = equal treatment BY government.',steps:[
    ['Bill of Rights','The first ten amendments protect specific liberties and procedural rights.'],
    ['First Amendment','Religion, speech, press, assembly and petition create recurring constitutional conflicts.'],
    ['Due Process & Privacy','Constitutional protections constrain how government can deprive people of liberty.'],
    ['Selective Incorporation','The Fourteenth Amendment helped apply many Bill of Rights protections to the states.'],
    ['Equal Protection','Civil-rights disputes ask when government classifications or unequal treatment violate the Constitution.'],
    ['Cases & Social Change','Court decisions and political movements shape how constitutional promises work in practice.']]},
  4:{kicker:'CHAPTER 04 · BELIEFS & IDEOLOGY',title:'Why do Americans disagree about what government should do?',intro:'Political attitudes come from people and experience before they become polls, ideology, or policy preferences.',model:'Experience → beliefs → public opinion → ideology → policy preferences.',steps:[
    ['Political Socialization','Family, school, community, generation and events can shape political attitudes.'],
    ['Public Opinion','Polls try to measure what populations think; samples and question wording matter.'],
    ['Ideology','Broad beliefs help people organize views about the role of government.'],
    ['Political Events','Major events can change priorities and attitudes over time.'],
    ['Economic Policy','Different views of markets, taxation and government intervention produce policy disagreement.'],
    ['Social Policy','Values and ideas about rights, order and government authority shape social-policy debates.']]},
  5:{kicker:'CHAPTER 05 · POLITICAL PARTICIPATION',title:'How do people influence government?',intro:'Citizens connect to government through more than elections: parties, groups, campaigns and media all transmit political pressure.',model:'People → opinions → organizations → elections → government → policy → people.',steps:[
    ['Voting & Turnout','Rules, resources, motivation and political context affect participation.'],
    ['Political Parties','Parties organize coalitions, recruit candidates and help voters structure choices.'],
    ['Interest Groups','Groups organize around shared interests and try to influence institutions and policy.'],
    ['Elections','Different election systems and institutions shape campaigns and representation.'],
    ['Campaigns & Finance','Candidates use organizations, money, messages and mobilization to compete.'],
    ['Media','Media helps set attention, distribute information and connect political actors with the public.']]}
};

function openLearn(n=1){
  const c=learnChapters[n] || learnChapters[1];
  const target=document.getElementById('learnContent');
  if(target) target.innerHTML=`
    <p class="eyebrow">${c.kicker}</p><h1>${c.title}</h1><p class="learn-intro">${c.intro}</p>
    <div class="mental-model"><small>MENTAL MODEL</small><strong>${c.model}</strong></div>
    <p class="eyebrow learn-zoom-label">ZOOM IN · ONE IDEA AT A TIME</p>
    <div class="learn-steps">${c.steps.map((x,i)=>`<details ${i===0?'open':''}><summary><b>${String(i+1).padStart(2,'0')}</b><span>${x[0]}</span><i>+</i></summary><p>${x[1]}</p></details>`).join('')}</div>
    <div class="chapter-next"><button onclick="show('library')">Connect Documents & Cases →</button>${n<5?`<button onclick="openLearn(${n+1})">Next Chapter →</button>`:'<button onclick="show(\'practice\')">Practice →</button>'}</div>`;
  document.querySelectorAll('.learn-rail [data-chapter]').forEach(b=>b.classList.toggle('active',Number(b.dataset.chapter)===n));
  show('story');
}

function openLibraryNote(title, text){
  const d=document.getElementById('libraryDetail');
  if(d) d.innerHTML='<p class="eyebrow">WHY IT MATTERS</p><h3>'+title+'</h3><p>'+text+'</p><p class="library-hint">Use this as evidence inside the course story — not as an isolated fact to memorize.</p>';
  show('library');
}

function renderJourney() {
  const grid = document.getElementById('journeyGrid');
  if (!grid) return;

  grid.innerHTML = content.journeyChapters.map((chapter) => `
    <article class="journey-card" style="background-image: linear-gradient(180deg, rgba(10,18,16,0.25), rgba(10,18,16,0.7)), url('${chapter.image}')">
      <div class="journey-card-inner">
        <span>${chapter.kicker}</span>
        <h3>${chapter.title}</h3>
        <p>${chapter.summary}</p>
        <button type="button" class="journey-link" onclick="openChapter('${chapter.id}')">Enter chapter →</button>
      </div>
    </article>
  `).join('');
}

function renderDeclaration() {
  const target = document.getElementById('declarationContent');
  if (!target) return;
  const chapter = content.declarationChapter;
  const slideIndex = storyState.declaration.slide || 0;
  const activeSlide = chapter.miniGallery[slideIndex] || chapter.miniGallery[0];
  const heroImage = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Declaration%20independence.jpg?width=1800';

  target.innerHTML = `
    <article class="decl">
      <section class="decl-hero" style="background-image:linear-gradient(90deg,rgba(7,14,12,.90),rgba(7,14,12,.34)),url('${heroImage}')">
        <div class="decl-hero-copy">
          <p class="eyebrow">UNIT 1 · THE STORY &nbsp;&nbsp;&nbsp; CHAPTER 2 OF 5</p>
          <h1>1776 — Declaration<br>of Independence</h1>
          <h2>A bold statement. A new nation. A big question: now what?</h2>
          <p>On July 4, 1776, the thirteen colonies declared that they were no longer part of Britain. The Declaration explained why — and laid out powerful ideas about liberty, rights, and government.</p>
          <div class="decl-actions"><button onclick="document.getElementById('decl-big').scrollIntoView({behavior:'smooth'})">▶ &nbsp; Watch 2 min overview</button><button class="outline" onclick="document.getElementById('decl-doc').scrollIntoView({behavior:'smooth'})">Explore the document →</button></div>
        </div>
        <blockquote>“We hold these truths to be self-evident,<br>that all men are created equal…”<small>— Declaration of Independence (1776)</small></blockquote>
      </section>

      <nav class="decl-timeline" aria-label="Founding journey">
        <button onclick="show('story')"><span>1607–1775</span><b>British Colonies</b></button>
        <button class="active"><span>1776</span><b>Declaration of Independence</b></button>
        <button onclick="show('story')"><span>1781–1789</span><b>Articles of Confederation</b></button>
        <button onclick="show('story')"><span>1787</span><b>Constitutional Convention</b></button>
        <button onclick="show('constitution')"><span>1788–1791</span><b>Constitution + Bill of Rights</b></button>
      </nav>

      <div class="decl-body">
        <section id="decl-big" class="decl-big">
          <p class="eyebrow">THE BIG PICTURE</p><h2>Why the Declaration?</h2>
          <p>The colonies' dispute with British rule grew around representation, imperial authority, taxation, and political rights. The Declaration turned that conflict into a public argument for independence.</p>
          <div class="decl-quote">“Governments are instituted among Men, deriving their just powers from the consent of the governed…”<small>— Declaration of Independence</small></div>
        </section>

        <section class="decl-gallery">
          <div class="decl-stage">
            <img src="${activeSlide.src}" alt="${activeSlide.caption}">
            <button class="prev" onclick="changeDeclarationSlide(-1)" aria-label="Previous image">‹</button>
            <button class="next" onclick="changeDeclarationSlide(1)" aria-label="Next image">›</button>
            <div><b>${activeSlide.caption}</b><small>${activeSlide.credit}</small></div><span>${slideIndex+1} / ${chapter.miniGallery.length}</span>
          </div>
          <div class="decl-thumbs">${chapter.miniGallery.map((x,i)=>`<button class="${i===slideIndex?'active':''}" onclick="setDeclarationSlide(${i})"><img src="${x.src}" alt=""><span>${x.caption}</span></button>`).join('')}</div>
        </section>

        <aside class="decl-side">
          <section><h3>🔑 &nbsp; Key Takeaways</h3><ol>
            <li><b>1</b><span>Explains why the colonies are separating from Britain.</span></li>
            <li><b>2</b><span>Introduces ideas about natural rights, equality, and consent of the governed.</span></li>
            <li><b>3</b><span>Lists grievances used to justify separation.</span></li>
            <li><b>4</b><span>Declares the colonies free and independent states.</span></li>
            <li><b>5</b><span>States principles; it does not design the later federal government.</span></li>
          </ol></section>
          <section><h3>💡 &nbsp; Interesting Fact</h3><p>Thomas Jefferson drafted the initial text, and the Committee of Five and Continental Congress revised it before adoption.</p></section>
        </aside>

        <section id="decl-doc" class="decl-document">
          <div><p class="eyebrow">A CLOSER LOOK</p><h2>The Document</h2><p>The argument moves from principles, to grievances, to a declaration of independence.</p></div>
          <img src="${chapter.miniGallery[1].src}" alt="Declaration of Independence facsimile">
          <div class="decl-doc-tabs"><h3>Explore by Section</h3>
            <button onclick="showDocPart(0)">Preamble <span>›</span></button><button onclick="showDocPart(1)">Grievances <span>›</span></button><button onclick="showDocPart(2)">Declaration <span>›</span></button><button onclick="showDocPart(3)">Signatures <span>›</span></button>
            <p id="decl-doc-detail">Select a section to see what role it plays in the argument.</p>
          </div>
        </section>

        <section class="decl-card"><h3>🌎 &nbsp; Why It Matters</h3><p>The Declaration's language of equality, rights, and consent became a reference point in later American debates about liberty and citizenship.</p></section>
        <section class="decl-card decl-check"><h3>✅ &nbsp; Quick Check</h3><p><b>What was the main purpose of the Declaration of Independence?</b></p>
          <button onclick="checkDecl(this,false)">A. To create a plan for the new government</button><button onclick="checkDecl(this,true)">B. To explain why the colonies were separating from Britain</button><button onclick="checkDecl(this,false)">C. To establish the Bill of Rights</button><p id="decl-feedback"></p>
        </section>
        <section class="decl-card decl-next"><h3>➡️ &nbsp; What’s Next?</h3><p>The Declaration was just the beginning. Next, the new nation tried its first national framework — the Articles of Confederation.</p><button onclick="show('story')">Continue the Story →</button></section>
      </div>
    </article>`;
}

function showDocPart(index) {
  const parts = [
    '<b>Preamble / principles:</b> introduces the argument about equality, rights, and the purpose of government.',
    '<b>Grievances:</b> lists complaints against British rule offered as evidence for separation.',
    '<b>Declaration:</b> announces that the colonies are free and independent states.',
    '<b>Signatures:</b> records the delegates who endorsed the adopted Declaration.'
  ];
  const el=document.getElementById('decl-doc-detail'); if(el) el.innerHTML=parts[index];
}
function checkDecl(button, correct) {
  document.querySelectorAll('.decl-check button').forEach(x=>x.classList.remove('correct','wrong'));
  button.classList.add(correct?'correct':'wrong');
  const f=document.getElementById('decl-feedback');
  if(f) f.textContent=correct?'Correct — the Declaration justified separation; it did not create the later federal government.':'Not quite. Look again at what the document was trying to explain in 1776.';
}

function changeDeclarationSlide(direction) {
  const total = content.declarationChapter.miniGallery.length;
  const current = storyState.declaration.slide || 0;
  storyState.declaration.slide = (current + direction + total) % total;
  renderDeclaration();
}

function setDeclarationSlide(index) {
  storyState.declaration.slide = index;
  renderDeclaration();
}

function openChapter(id) {
  if (id === 'declaration') {
    show('declaration');
    return;
  }

  if (id === 'articles') {
    show('story');
    return;
  }

  if (id === 'constitution') {
    show('constitution');
    return;
  }

  openLearn(1);
}

function renderMap() {
  const unitGrid = document.getElementById('unitGrid');
  if (!unitGrid) return;

  const cards = content.units.map((unit) => {
    const isFeatured = unit.id === 1 ? ' feature' : '';
    return `
      <button class="unit${isFeatured}" type="button" onclick="openUnit(${unit.id})">
        <small>${unit.label}</small>
        <strong>${unit.title}</strong>
        <span>${unit.summary}</span>
      </button>
    `;
  }).join('');

  unitGrid.innerHTML = cards;
}

function renderStory() {
  const timeline = document.getElementById('storyTimeline');
  if (!timeline) return;

  timeline.innerHTML = content.storyScenes.map((scene) => `
    <article class="story-card ${scene.frame}">
      <time>${scene.era}</time>
      <div class="scene-icon" aria-hidden="true">${scene.frame === 'colony' ? '⚓' : scene.frame === 'declaration' ? '📜' : scene.frame === 'articles' ? '🤝' : scene.frame === 'convention' ? '🏛️' : '⚖️'}</div>
      <h3>${scene.title}</h3>
      <p>${scene.summary}</p>
      <div class="mini-label">Question</div>
      <p class="scene-question">${scene.question}</p>
      <div class="mini-label">Key ideas</div>
      <ul>${scene.keyIdeas.map((idea) => `<li>${idea}</li>`).join('')}</ul>
    </article>
  `).join('');
}

function renderConstitution() {
  const grid = document.getElementById('constitutionGrid');
  const detail = document.getElementById('constitutionDetail');

  if (!grid) return;

  grid.innerHTML = content.constitutionSections.map((section) => `
    <button type="button" class="constitution-card ${state.selectedConstitution === section.id ? 'selected' : ''}" onclick="showConstitutionSection('${section.id}')">
      <span>${section.label}</span>
      <strong>${section.title}</strong>
      <small>${section.purpose}</small>
    </button>
  `).join('');

  if (detail) {
    showConstitutionSection(state.selectedConstitution, false);
  }
}

function showConstitutionSection(id, updateSelection = true) {
  const section = content.constitutionSections.find((item) => item.id === id);
  if (!section) return;

  if (updateSelection) {
    state.selectedConstitution = id;
    renderConstitution();
    return;
  }

  const detail = document.getElementById('constitutionDetail');
  if (!detail) return;

  detail.innerHTML = `
    <p class="eyebrow">${section.label}</p>
    <h3>${section.title}</h3>
    <p class="lead small">${section.mentalModel}</p>
    <p>${section.description}</p>
    <div class="detail-notes">
      <span>Purpose</span>
      <strong>${section.purpose}</strong>
    </div>
  `;
}

function renderUnitDetail(n) {
  const unit = content.units.find((item) => item.id === n);
  const target = document.getElementById('unitContent');
  if (!unit || !target) return;

  target.innerHTML = `
    <div class="unit-detail">
      <p class="eyebrow">UNIT 0${n} · ${unit.label.replace(/^UNIT 0\d+ · /, '')}</p>
      <h1>${unit.title}</h1>
      <p class="lead">${unit.focus}</p>
      <h2>Zoom map</h2>
      <div class="topiclist">
        ${unit.topics.map((topic, index) => `<div><b>${n}.${index + 1}</b><span>${topic}</span></div>`).join('')}
      </div>
      <div class="callout">
        <h3>Start here tonight</h3>
        <p>Move from the big historical story into the constitutional structure and then return to the document-driven practice questions.</p>
        <button type="button" class="primary" onclick="show('story')">Open the visual founding story →</button>
      </div>
    </div>
  `;
}

function openUnit(n) {
  renderUnitDetail(n);
  show('unit');
}

function renderQuiz() {
  const quiz = document.getElementById('quiz');
  if (!quiz) return;

  const question = content.practiceQuestions[state.questionIndex % content.practiceQuestions.length];
  const answerHidden = 'style="display:none"';

  quiz.innerHTML = `
    <div class="question-card">
      <h2>${question[0]}</h2>
      <button type="button" class="ghost" onclick="this.nextElementSibling.style.display='block'">Reveal answer</button>
      <div class="answer" ${answerHidden}>${question[1]}</div>
    </div>
  `;
}

function nextQ() {
  state.questionIndex += 1;
  renderQuiz();
}

function bootstrap() {
  renderJourney();
  renderDeclaration();
  renderMap();
  renderStory();
  renderConstitution();
  renderQuiz();
  updateProgress();
  show('home');
}

document.addEventListener('DOMContentLoaded', bootstrap);

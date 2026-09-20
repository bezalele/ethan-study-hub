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
1:{kicker:'CHAPTER 1 OF 5 · FOUNDATIONS',title:'Why was American government designed this way?',intro:'Before memorizing government, follow the problem that created it.',model:'Britain felt too powerful → the Articles were too weak → the Constitution tried to find balance.',story:true,steps:[
['Why do people need government?','Shared rules, protection, public needs and a way to settle disputes require some form of government. The hard question is how much power it should have.'],
['Colonial America','The colonies belonged to Britain but developed habits of local self-government. Conflict grew when British control and colonial expectations collided.'],
['1776 · Declaration of Independence','The colonies explained why they were leaving Britain. The document argues from natural rights and consent of the governed.'],
['1781 · Articles of Confederation','Fear of another powerful central government produced a national system that intentionally gave most power to the states.'],
['Why the Articles struggled','The national government had difficulty raising revenue, regulating interstate commerce and coordinating action among states.'],
['1787 · Constitutional Convention','Delegates met to repair the system and instead designed a new framework with stronger national power divided among institutions.'],
['1788–1791 · Constitution + Bill of Rights','The Constitution organized power. The Bill of Rights added explicit protections for liberty.'],
['Federalism','Power is shared between national and state governments. That relationship continues through the entire course.']]},
2:{kicker:'CHAPTER 2 OF 5 · BRANCHES & POWER',title:'Who has power — and who can stop them?',intro:'Now that the Constitution exists, see how national power is divided.',model:'Congress makes laws → President executes → Courts interpret → Bureaucracy implements.',steps:[['Congress','The House and Senate make federal law, control spending and oversee government.'],['The President','The president executes laws and uses formal and informal powers to influence policy.'],['The Courts','Federal courts resolve disputes and interpret federal law and the Constitution.'],['The Bureaucracy','Departments and agencies administer programs and implement policy.'],['Checks & Balances','Each branch has tools that can restrain the others.'],['Policymaking','Government action usually requires interaction among institutions, not one branch acting alone.']]},
3:{kicker:'CHAPTER 3 OF 5 · LIBERTIES & RIGHTS',title:'What can government do — and what must it not do?',intro:'Once government has power, the next question is how the Constitution protects people.',model:'Civil liberties = freedom from government interference. Civil rights = equal treatment under law.',steps:[['Bill of Rights','The first ten amendments protect specific liberties and procedural rights.'],['First Amendment','Religion, speech, press, assembly and petition create recurring constitutional questions.'],['Due Process & Privacy','Constitutional protections constrain how government can deprive people of liberty.'],['Selective Incorporation','The Fourteenth Amendment is central to applying many Bill of Rights protections to state governments.'],['Equal Protection','Civil-rights disputes ask when unequal government treatment violates the Constitution.'],['Cases & Social Change','Court decisions and political movements affect how constitutional guarantees operate in practice.']]},
4:{kicker:'CHAPTER 4 OF 5 · BELIEFS & IDEOLOGY',title:'Why do Americans disagree about government?',intro:'Institutions respond to people who hold different values, experiences and ideas about government.',model:'Experience → beliefs → public opinion → ideology → policy preferences.',steps:[['Political Socialization','Family, school, community, generation and events can shape political attitudes.'],['Public Opinion','Polling estimates what populations think; sampling and question design affect what we can conclude.'],['Ideology','Broad beliefs help organize views about government and public policy.'],['Political Events','Events can change public priorities and attitudes over time.'],['Economic Policy','Views about markets, taxes and government intervention produce policy disagreements.'],['Social Policy','Ideas about rights, order and government authority shape social-policy disagreements.']]},
5:{kicker:'CHAPTER 5 OF 5 · PARTICIPATION',title:'How do people influence government?',intro:'Finish the course by connecting citizens back to the institutions they influence.',model:'People → opinions → organizations → elections → government → policy → people.',steps:[['Voting & Turnout','Rules, resources, motivation and political context affect participation.'],['Political Parties','Parties organize coalitions, recruit candidates and help structure electoral choices.'],['Interest Groups','Groups organize around shared interests and seek to influence institutions and policy.'],['Elections','Election rules and institutions shape campaigns and representation.'],['Campaigns & Finance','Candidates use organizations, money, messages and mobilization to compete.'],['Media','Media distributes political information and connects citizens, campaigns and government.']]}
};

function openLearn(n=1){
 const c=learnChapters[n]||learnChapters[1], target=document.getElementById('learnContent');
 const topicNames={
  1:['Why government?','Colonial America','Declaration of Independence','Articles of Confederation','Constitutional Convention','Constitution + Bill of Rights','Checks & Balances','Federalism'],
  2:['Congress','President','Courts','Federal Agencies','Checks & Balances','Policymaking'],
  3:['Bill of Rights','First Amendment','Due Process','Equal Protection','Civil Rights','Supreme Court Cases'],
  4:['Political Socialization','Political Opinions','Public Opinion','Ideology','Economic Policy','Social Policy'],
  5:['Voting','Elections','Political Parties','Interest Groups','Campaign Finance','Media']
 };
 const names=topicNames[n];
 const history=n===1?'<div class="history-strip"><small>THE HISTORY BEHIND THIS UNIT</small><div>'+['Colonies','Declaration','Articles','Convention','Constitution','Federalism'].map((x,i)=>'<span>'+x+'</span>'+(i<5?'<i>→</i>':'')).join('')+'</div></div>':'';
 if(target) target.innerHTML=`
 <div class="unit-breadcrumb"><button onclick="show('home')">Home</button><i>›</i><span>${c.kicker.replace('CHAPTER','AREA')}</span></div>
 <div class="chapter-heading"><p class="eyebrow">${c.kicker}</p><h1>${c.title}</h1><p>${c.intro}</p></div>
 <div class="mental-model"><small>THE BIG IDEA</small><strong>${c.model}</strong></div>
 ${history}
 <section class="topic-map"><div><p class="eyebrow">WHAT YOU WILL LEARN</p><h2>Choose a topic to explore</h2><p>You can follow them in order or open the one Ethan is studying at school.</p></div>
 <div class="topic-grid">${c.steps.map((x,i)=>`<button onclick="openTopic(${n},${i})"><b>${String(i+1).padStart(2,'0')}</b><span><strong>${names[i]||x[0]}</strong><small>${x[1]}</small></span><i>→</i></button>`).join('')}</div></section>
 <section id="topicDetail" class="topic-detail" hidden></section>
 <div class="unit-bottom"><button onclick="show('home')">← All 5 course areas</button><button onclick="show('practice')">Practice this course →</button></div>`;
 const p=document.getElementById('lessonProgress'); if(p)p.textContent='Course Area '+n+' of 5';
 state.currentLearn=n;
 show('story');
}

function openTopic(n,i){
 const c=learnChapters[n], x=c.steps[i], d=document.getElementById('topicDetail');
 if(!d)return;
 d.hidden=false;
 const extra=n===1&&i===2?'<button onclick="show(\'declaration\')">Explore the Declaration →</button>':n===1&&i===5?'<button onclick="show(\'constitution\')">Explore the Constitution →</button>':'';
 d.innerHTML='<button class="topic-close" onclick="this.parentElement.hidden=true">Close ×</button><p class="eyebrow">TOPIC '+(i+1)+'</p><h2>'+x[0]+'</h2><p>'+x[1]+'</p>'+extra;
 d.scrollIntoView({behavior:'smooth',block:'center'});
}
function openLibraryNote(title,text){
 const d=document.getElementById('libraryDetail');
 if(d)d.innerHTML='<p class="eyebrow">WHY IT MATTERS</p><h3>'+title+'</h3><p>'+text+'</p><button onclick="history.back()">← Go back</button>';
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

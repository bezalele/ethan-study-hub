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
  if (target) target.classList.add('active');
  document.body.classList.toggle('no-scroll', id === 'map');
  mark(id);
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
  const timelineItems = content.storyScenes;
  const slideIndex = storyState.declaration.slide;
  const activeSlide = chapter.miniGallery[slideIndex] || chapter.miniGallery[0];

  target.innerHTML = `
    <article class="story-chapter-shell">
      <header class="story-hero" style="background-image: linear-gradient(90deg, rgba(9, 18, 15, 0.82), rgba(9, 18, 15, 0.28)), url('${chapter.banner}')">
        <div class="story-hero-inner">
          <div class="story-hero-copy">
            <p class="eyebrow">${chapter.kicker}</p>
            <div class="story-hero-title-wrap">
              <span class="story-hero-date">1776</span>
              <h1>${chapter.title}</h1>
            </div>
            <p class="story-hero-deck">${chapter.deck}</p>
            <div class="story-hero-actions">
              <button type="button" class="primary" onclick="document.getElementById('story-document').scrollIntoView({behavior: 'smooth'});">Explore the document</button>
              <button type="button" class="ghost light" onclick="document.getElementById('story-next').scrollIntoView({behavior: 'smooth'});">What happened next?</button>
            </div>
            <blockquote>“${chapter.quote}”</blockquote>
          </div>

          <aside class="story-side-nav" aria-label="In this chapter">
            <p>In this chapter</p>
            <ol>
              ${chapter.sections.map((section) => `<li>${section.heading}</li>`).join('')}
            </ol>
          </aside>
        </div>
      </header>

      <div class="story-timeline">
        ${timelineItems.map((scene) => {
          const active = scene.frame === 'declaration' ? 'is-active' : '';
          return `
            <article class="story-timeline-card ${active}">
              <span>${scene.era}</span>
              <strong>${scene.title}</strong>
            </article>
          `;
        }).join('')}
      </div>

      <div class="story-main-layout">
        <section class="story-panel story-panel-feature">
          <div class="story-panel-header">
            <span class="eyebrow">The Big Picture</span>
          </div>
          <p>${chapter.intro}</p>
        </section>

        <section class="story-panel story-gallery-panel">
          <div class="story-gallery-header">
            <div>
              <span class="eyebrow">Visual archive</span>
              <h3>Witness the founding moment</h3>
            </div>
            <div class="story-gallery-count">${String(slideIndex + 1).padStart(2, '0')} / ${String(chapter.miniGallery.length).padStart(2, '0')}</div>
          </div>

          <div class="story-gallery-stage">
            <button class="story-gallery-arrow" type="button" aria-label="Previous slide" onclick="changeDeclarationSlide(-1)">←</button>
            <img src="${activeSlide.src}" alt="${activeSlide.caption}">
            <button class="story-gallery-arrow" type="button" aria-label="Next slide" onclick="changeDeclarationSlide(1)">→</button>
          </div>

          <div class="story-gallery-caption">
            <strong>${activeSlide.caption}</strong>
            <span>${activeSlide.credit}</span>
          </div>

          <div class="story-gallery-thumbs">
            ${chapter.miniGallery.map((image, index) => `
              <button class="story-thumb ${index === slideIndex ? 'active' : ''}" type="button" data-thumb-index="${index}" onclick="setDeclarationSlide(${index})">
                <img src="${image.src}" alt="${image.caption}">
              </button>
            `).join('')}
          </div>
        </section>

        <div class="story-lower-grid">
          <section class="story-panel fact-panel">
            <span class="eyebrow">Interesting Fact</span>
            <h3>Why this document still feels modern</h3>
            <p>${chapter.factStrip[2].value} is not just a phrase in a historical document. It became the language people used to test whether government was legitimate.</p>
            <div class="fact-portrait">
              <img src="${chapter.miniGallery[0].src}" alt="Declaration manuscript detail">
            </div>
          </section>

          <section class="story-panel takeaway-panel">
            <span class="eyebrow">Key Takeaways</span>
            <ol>
              ${chapter.takeaways.map((item, index) => `<li><span>${index + 1}</span><p>${item}</p></li>`).join('')}
            </ol>
          </section>
        </div>

        <section id="story-document" class="story-panel doc-panel">
          <div class="story-panel-header">
            <span class="eyebrow">Explore the document</span>
            <h3>Declaration of Independence</h3>
          </div>

          <div class="doc-layout">
            <div class="doc-facsimile">
              <img src="${chapter.miniGallery[0].src}" alt="Declaration of Independence document">
            </div>
            <div class="doc-explorer">
              <ol>
                ${chapter.sections.map((section, index) => `<li class="${index === 0 ? 'active' : ''}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${section.heading}</strong></li>`).join('')}
              </ol>
              <div class="doc-insight">
                <h4>${chapter.sections[0].heading}</h4>
                <p>${chapter.sections[0].body}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="story-panel why-panel">
          <div class="story-panel-header">
            <span class="eyebrow">Why It Matters</span>
            <h3>The Declaration created a new standard.</h3>
          </div>
          <div class="why-grid">
            <div class="why-box">
              <span>01</span>
              <strong>Rights before government</strong>
              <p>The colonists argued that liberty comes from natural rights, not royal permission.</p>
            </div>
            <div class="why-box">
              <span>02</span>
              <strong>Consent creates legitimacy</strong>
              <p>Government is justified only when the governed accept it as a source of order and protection.</p>
            </div>
            <div class="why-box">
              <span>03</span>
              <strong>Revolution as political argument</strong>
              <p>Separation was framed as a moral and political response to failed rule.</p>
            </div>
          </div>
        </section>

        <section class="story-panel quick-check-panel">
          <div class="story-panel-header">
            <span class="eyebrow">Quick Check</span>
            <h3>${chapter.knowledgeCheck[0].question}</h3>
          </div>
          <button type="button" class="ghost reveal-answer" onclick="document.getElementById('chapter-quick-answer').classList.toggle('visible')">Reveal answer</button>
          <div id="chapter-quick-answer" class="quick-answer">
            <p>${chapter.knowledgeCheck[0].answer}</p>
          </div>
        </section>

        <section id="story-next" class="story-panel next-panel">
          <div class="next-panel-image">
            <img src="${content.journeyChapters[1].image}" alt="Articles of Confederation">
          </div>
          <div class="next-panel-copy">
            <span class="eyebrow">What’s Next?</span>
            <h3>${content.journeyChapters[1].title}</h3>
            <p>${content.journeyChapters[1].summary}</p>
            <button type="button" class="primary" onclick="openChapter('${chapter.next.id}')">${chapter.next.label}</button>
          </div>
        </section>

        <nav class="story-bottom-nav" aria-label="Chapter navigation">
          <button type="button" class="ghost" onclick="show('story')">← Previous chapter</button>
          <div class="story-progress"><span>Chapter 01</span><strong>Declaration of Independence</strong></div>
          <button type="button" class="primary" onclick="openChapter('${chapter.next.id}')">Next chapter →</button>
        </nav>
      </div>
    </article>
  `;
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

  show('journey');
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
  show('map');
}

document.addEventListener('DOMContentLoaded', bootstrap);

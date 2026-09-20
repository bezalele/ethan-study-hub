const content = window.EthanStudyHubContent;
const state = { questionIndex: 0, selectedConstitution: 'preamble' };

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
  target.innerHTML = `
    <article class="document-hero" style="background-image: linear-gradient(90deg, rgba(9,18,15,0.72), rgba(9,18,15,0.28)), url('${chapter.banner}')">
      <div class="document-hero-copy">
        <p class="eyebrow">${chapter.kicker}</p>
        <h1>${chapter.title}</h1>
        <p class="deck">${chapter.deck}</p>
        <blockquote>“${chapter.quote}”</blockquote>
      </div>
    </article>

    <div class="chapter-shell">
      <div class="story-intro block">
        <p>${chapter.intro}</p>
      </div>

      <div class="fact-strip">
        ${chapter.factStrip.map((fact) => `
          <div class="fact-box">
            <span>${fact.label}</span>
            <strong>${fact.value}</strong>
          </div>
        `).join('')}
      </div>

      <div class="chapter-grid">
        ${chapter.sections.map((section) => `
          <article class="chapter-panel block">
            <h3>${section.heading}</h3>
            <p>${section.body}</p>
          </article>
        `).join('')}
      </div>

      <div class="takeaway-panel block">
        <p class="eyebrow">KEY TAKEAWAYS</p>
        <ul>
          ${chapter.takeaways.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div class="gallery-block block">
        <p class="eyebrow">VISUAL CONTEXT</p>
        <div class="gallery-grid">
          ${chapter.miniGallery.map((image) => `
            <figure>
              <img src="${image.src}" alt="${image.caption}">
              <figcaption>${image.caption} · ${image.credit}</figcaption>
            </figure>
          `).join('')}
        </div>
      </div>

      <div class="knowledge-panel block">
        <p class="eyebrow">KNOWLEDGE CHECK</p>
        ${chapter.knowledgeCheck.map((pair) => `
          <div class="check-item">
            <strong>${pair.question}</strong>
            <p>${pair.answer}</p>
          </div>
        `).join('')}
      </div>

      <div class="chapter-cta">
        <span>What happened next?</span>
        <button type="button" class="primary" onclick="openChapter('${chapter.next.id}')">${chapter.next.label}</button>
      </div>
    </div>
  `;
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

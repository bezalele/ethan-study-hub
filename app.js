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



const journeyFacts={
  1:{title:'British Colonies',date:'1607–1775',fact:'Thirteen British colonies developed local assemblies and traditions of self-government long before independence.',ask:'Big idea: When should people govern themselves?'},
  2:{title:'Declaration of Independence',date:'1776',fact:'The Declaration explained why the colonies claimed independence and grounded that claim in natural rights and consent of the governed.',ask:'Big idea: Where does legitimate government get its power?'},
  3:{title:'Articles of Confederation',date:'1781–1789',fact:'America’s first national framework left most power with the states and gave the central government limited authority.',ask:'Big idea: What happens when a national government is too weak to act?'},
  4:{title:'Constitutional Convention',date:'1787',fact:'Delegates met to revise the Articles and instead drafted a new Constitution with stronger national institutions and divided powers.',ask:'Big idea: How can government be powerful without becoming too powerful?'},
  5:{title:'Constitution + Bill of Rights',date:'1788–1791',fact:'The Constitution created the federal framework; the first ten amendments added explicit protections for individual liberties.',ask:'Big idea: How do we protect liberty while giving government enough power to work?'}
};
function showJourneyFact(n,el){
 let p=document.getElementById('journeyFactPop');
 if(!p){p=document.createElement('div');p.id='journeyFactPop';p.className='journey-fact-pop';document.body.appendChild(p);}
 const x=journeyFacts[n]; if(!x)return;
 p.innerHTML='<small>QUICK FACT</small><h3>'+x.title+'</h3><div class="fact-date">'+x.date+'</div><p>'+x.fact+'</p><b>'+x.ask+'</b>';
 const r=el.getBoundingClientRect(); p.style.left=Math.min(window.innerWidth-340,Math.max(12,r.left+r.width/2-160))+'px';p.style.top=(r.bottom+10+window.scrollY)+'px';p.classList.add('show');
}
function hideJourneyFact(){const p=document.getElementById('journeyFactPop');if(p)p.classList.remove('show');}

const foundingPages={
 colonies:{chapter:'CHAPTER 1 OF 5',date:'1607–1775',title:'British Colonies',subtitle:'Before independence, Americans learned how to govern locally.',intro:'The colonies were part of the British Empire, but elected colonial assemblies gave many colonists practical experience with representative government.',question:'How did life in the colonies shape American ideas about government?',hero:'COLONIAL AMERICA',takeaways:['Colonists lived under British authority but also used elected colonial assemblies.','Local self-government helped build expectations about representation.','After the Seven Years’ War, disputes over taxes and parliamentary authority intensified.','The conflict gradually moved from protest to independence.'],cards:[['Self-government','Colonial assemblies gave many colonists experience choosing representatives and making local laws.'],['British authority','The colonies remained subject to the Crown and Britain’s imperial system.'],['The conflict grows','Arguments over taxation, representation, and Parliament’s authority became central political disputes.'],['The connection','These experiences help explain why consent and representation became important founding ideas.']],fact:'A useful study connection: Americans did not invent representative government in 1776. Many colonists already had generations of experience with elected assemblies.',next:'Declaration of Independence',nextAction:"show('declaration')"},
 articles:{chapter:'CHAPTER 3 OF 5',date:'1781–1789',title:'Articles of Confederation',subtitle:'The first American national government — intentionally weak.',intro:'After declaring independence, the states needed a way to work together. The Articles created a confederation that preserved strong state sovereignty and gave Congress limited national powers.',question:'Why did America’s first system of government struggle?',hero:'THE FIRST CONSTITUTION',takeaways:['The Articles created a “league of friendship” among sovereign states.','Each state had one vote in Congress.','Congress could not levy taxes directly and lacked broad power to regulate commerce.','Changing the Articles required unanimous state approval.','The system’s weaknesses helped produce the Constitutional Convention.'],cards:[['What it created','A national Congress, but no separate national executive and no national judiciary like those created later by the Constitution.'],['Where power lived','The states retained extensive sovereignty and independence.'],['The money problem','Congress depended heavily on requests to the states rather than directly taxing individuals.'],['Why it matters','The Articles show the founders learning that independence required both liberty and a government capable of acting.']],fact:'The Articles were adopted by Congress in 1777 but did not take effect until Maryland became the 13th state to ratify them on March 1, 1781.',next:'Constitutional Convention',nextAction:"openFoundingPage('convention')"},
 convention:{chapter:'CHAPTER 4 OF 5',date:'1787',title:'Constitutional Convention',subtitle:'Fix the old government — or design a new one?',intro:'Delegates gathered in Philadelphia to revise the Articles of Confederation. They ultimately proposed an entirely new constitutional system with stronger national institutions and divided powers.',question:'How do you make government strong enough to work without making it too powerful?',hero:'PHILADELPHIA · 1787',takeaways:['The Convention met in Philadelphia in 1787.','Delegates moved beyond revising the Articles and drafted a new Constitution.','Representation in Congress was one of the major disputes.','The new design separated legislative, executive, and judicial power.','The proposed Constitution still had to be ratified by the states.'],cards:[['The problem','Many leaders believed the Confederation government lacked sufficient power to address national problems.'],['Representation','Delegates debated how states and populations should be represented in the new Congress.'],['Dividing power','The Constitution distributed authority across branches and between national and state governments.'],['Checks and balances','Institutions received different powers so that no single part of the national government controlled everything.']],fact:'The Convention originally assembled to revise the Articles. The Constitution that emerged was signed on September 17, 1787.',next:'Constitution + Bill of Rights',nextAction:"openFoundingPage('constitution-rights')"},
 'constitution-rights':{chapter:'CHAPTER 5 OF 5',date:'1787–1791',title:'Constitution + Bill of Rights',subtitle:'Build the government. Then protect individual liberty.',intro:'The Constitution established the federal framework of government. Ratification debates helped lead to the addition of the Bill of Rights — the first ten amendments.',question:'How does the American system balance government power with individual liberty?',hero:'A NEW FRAMEWORK',takeaways:['The Constitution establishes the national government and its branches.','Federalism divides authority between national and state governments.','Ratification triggered a major debate over national power and individual liberty.','Congress proposed twelve amendments in 1789.','Ten were ratified in 1791 and became the Bill of Rights.'],cards:[['Constitution','Creates the basic structure and powers of the federal government.'],['Three branches','Legislative, executive, and judicial institutions have distinct constitutional roles.'],['Federalism','Power is divided between the national government and the states.'],['Bill of Rights','The first ten amendments protect specific liberties and place limits on government action.']],fact:'The Constitution was signed in 1787. The Bill of Rights came later: Congress proposed amendments in 1789, and ten were ratified in 1791.',next:'Foundations Course Area',nextAction:'openLearn(1)'}
};
function openFoundingPage(key){
 const x=foundingPages[key], target=document.getElementById('foundingDetailContent'); if(!x||!target)return;
 const meta={
  colonies:{big:'Why did colonial government matter?',matter:'Colonial experience with assemblies, representation, and British authority shaped the political arguments that followed.',nextText:'Tensions with Britain eventually turned into a decision to declare independence.'},
  articles:{big:'Why did the Articles struggle?',matter:'The Articles reveal the central problem the founders faced: how to preserve state independence while creating a national government capable of acting.',nextText:'Concern about the Confederation system led delegates to meet in Philadelphia in 1787.'},
  convention:{big:'Why redesign the government?',matter:'The Convention produced a new framework built around separated institutions, checks and balances, and a stronger national government.',nextText:'The proposed Constitution then faced ratification — and demands for explicit protections of individual liberty.'},
  'constitution-rights':{big:'Why the Constitution and Bill of Rights?',matter:'Together they establish the federal framework and protect specific liberties, creating the foundation for many questions studied throughout AP Government.',nextText:'Now connect the founding story to the full Foundations of American Democracy course area.'}
 }[key];
 const keys=['colonies','declaration','articles','convention','constitution-rights'], labels=['British Colonies','Declaration of Independence','Articles of Confederation','Constitutional Convention','Constitution + Bill of Rights'], dates=['1607–1775','1776','1781–1789','1787','1787–1791'], current=keys.indexOf(key);
 const timeline=keys.map((k,i)=>'<button class="'+(i===current?'active':'')+'" onclick="'+(k==='declaration'?"show('declaration')":"openFoundingPage('"+k+"')")+'"><span>'+dates[i]+'</span><b>'+labels[i]+'</b></button>').join('');
 target.innerHTML=`<article class="decl founding-decl">
  <section class="decl-hero founding-decl-hero">
   <div class="decl-hero-copy"><p class="eyebrow">UNIT 1 · THE STORY &nbsp;&nbsp;&nbsp; ${x.chapter}</p><h1>${x.date} — ${x.title}</h1><h2>${x.subtitle}</h2><p>${x.intro}</p><div class="decl-actions"><button onclick="document.getElementById('founding-big').scrollIntoView({behavior:'smooth'})">▶ &nbsp; Start the overview</button><button class="outline" onclick="document.getElementById('founding-learn').scrollIntoView({behavior:'smooth'})">Explore the ideas →</button></div></div>
   <blockquote>“${x.question}”<small>— The big question</small></blockquote>
  </section>
  <nav class="decl-timeline">${timeline}</nav>
  <div class="decl-body">
   <section id="founding-big" class="decl-big"><p class="eyebrow">THE BIG PICTURE</p><h2>${meta.big}</h2><p>${x.intro}</p><div class="decl-quote">${x.question}<small>Keep this question in mind as you study.</small></div></section>
   <section id="founding-learn" class="founding-gallery"><div class="founding-stage"><div><span>${x.date}</span><h2>${x.title}</h2><p>${x.cards[0][1]}</p></div></div><div class="founding-thumbs">${x.cards.map((c,i)=>'<button onclick="selectFoundingIdea(this,\''+key+'\','+i+')"><b>0'+(i+1)+'</b><span>'+c[0]+'</span></button>').join('')}</div></section>
   <aside class="decl-side"><section><h3>🔑 &nbsp; Key Takeaways</h3><ol>${x.takeaways.map((p,i)=>'<li><b>'+(i+1)+'</b><span>'+p+'</span></li>').join('')}</ol></section><section><h3>💡 &nbsp; Interesting Fact</h3><p>${x.fact}</p></section></aside>
   <section class="decl-document founding-ideas"><div><p class="eyebrow">A CLOSER LOOK</p><h2>Key Ideas</h2><p>Open each idea and explain it in your own words.</p></div><div class="founding-idea-main"><h3>${x.cards[0][0]}</h3><p>${x.cards[0][1]}</p></div><div class="decl-doc-tabs"><h3>Explore by Topic</h3>${x.cards.map((c,i)=>'<button onclick="selectFoundingIdea(this,\''+key+'\','+i+')">'+c[0]+' <span>›</span></button>').join('')}</div></section>
   <section class="decl-card"><h3>🌎 &nbsp; Why It Matters</h3><p>${meta.matter}</p></section>
   <section class="decl-card decl-check"><h3>✅ &nbsp; Quick Check</h3><p><b>${x.question}</b></p><button onclick="this.nextElementSibling.hidden=false">Show study answer</button><p hidden>${x.takeaways.slice(0,2).join(' ')}</p></section>
   <section class="decl-card decl-next"><h3>➡️ &nbsp; What’s Next?</h3><p>${meta.nextText}</p><button onclick="${x.nextAction}">Continue the Story →</button></section>
  </div>
 </article>`;
 show('foundingDetail');
}
function selectFoundingIdea(btn,key,i){
 const x=foundingPages[key], box=document.querySelector('#foundingDetail .founding-idea-main'), stage=document.querySelector('#foundingDetail .founding-stage>div'); if(!x)return;
 if(box)box.innerHTML='<h3>'+x.cards[i][0]+'</h3><p>'+x.cards[i][1]+'</p>';
 if(stage)stage.innerHTML='<span>'+x.date+'</span><h2>'+x.cards[i][0]+'</h2><p>'+x.cards[i][1]+'</p>';
 document.querySelectorAll('#foundingDetail .founding-thumbs button').forEach((b,n)=>b.classList.toggle('active',n===i));
}

const courseAreas=[
 {n:1,title:'Foundations of American Democracy',short:'Foundations',q:'Why was American government designed this way?',summary:'The Constitution, why government was designed this way, checks and balances, and federal versus state powers.',weight:'15–22%',topics:['Ideals of democracy','Declaration → Articles → Constitution','Checks and balances','Federalism'],flow:['Colonial self-government','Declaration of Independence','Articles of Confederation','Constitutional Convention','Constitution & Bill of Rights','Federalism'],fact:'Start with the founding story, then connect each event to a principle of government.'},
 {n:2,title:'Interactions Among Branches of Government',short:'Branches',q:'Who has power — and how can the branches influence one another?',summary:'What Congress, the president, courts, and federal agencies do—and how they influence each other.',weight:'25–36%',topics:['Congress','Presidency','Courts','Federal bureaucracy','Checks and balances'],flow:['Congress makes laws','President executes laws','Agencies implement policy','Courts interpret law','Branches check one another'],fact:'Think of this unit as a system: institutions have different jobs, but none works completely alone.'},
 {n:3,title:'Civil Liberties and Civil Rights',short:'Rights',q:'What freedoms are protected, and how has equal protection developed?',summary:'Individual freedoms, equal protection, the Bill of Rights, and important Supreme Court decisions.',weight:'13–18%',topics:['Bill of Rights','First Amendment','Due process','Equal protection','Supreme Court cases'],flow:['Bill of Rights','Fourteenth Amendment','Selective incorporation','Civil rights movement','Supreme Court interpretation'],fact:'Keep two ideas separate: civil liberties protect freedoms; civil rights focus on equal treatment and protection.'},
 {n:4,title:'American Political Ideologies and Beliefs',short:'Beliefs',q:'Where do political beliefs come from, and how do we measure them?',summary:'How people develop political opinions, differences in political ideologies, and how public opinion is measured.',weight:'10–15%',topics:['Political socialization','Public opinion','Polling','Ideology','Policy views'],flow:['Family & environment','Political socialization','Opinions form','Polls measure opinion','Beliefs connect to policy preferences'],fact:'This unit asks both what people believe and how political scientists can measure those beliefs.'},
 {n:5,title:'Political Participation',short:'Participation',q:'How do people influence government and elections?',summary:'Voting, elections, political parties, interest groups, campaign financing, and the media.',weight:'20–27%',topics:['Voting','Elections','Political parties','Interest groups','Campaign finance','Media'],flow:['Citizens form preferences','Parties & groups organize','Campaigns communicate','People vote & participate','Government responds through policy'],fact:'Participation is broader than voting: parties, groups, campaigns, media, and civic activity all connect people to government.'}
];
function renderCourseMap(){
 const el=document.getElementById('courseMapContent'); if(!el)return;
 el.innerHTML='<div class="cm-grid">'+courseAreas.map((u,i)=>'<article class="cm-card cm'+u.n+'" tabindex="0" onmouseenter="showCoursePreview('+u.n+',this)" onmouseleave="hideCoursePreview()" onfocus="showCoursePreview('+u.n+',this)" onblur="hideCoursePreview()"><div class="cm-num">0'+u.n+'</div><div class="cm-copy"><small>UNIT '+u.n+' · '+u.weight+' OF MULTIPLE-CHOICE SECTION</small><h2>'+u.title+'</h2><p>'+u.summary+'</p><div class="cm-actions"><button onclick="event.stopPropagation();toggleCourseArea('+u.n+',this)">See what you’ll learn ↓</button><button class="primary" onclick="event.stopPropagation();openUnitStudy('+u.n+')">Study this area →</button></div><div class="cm-expand" id="cmExpand'+u.n+'"><b>Topics</b><div>'+u.topics.map(t=>'<span>'+t+'</span>').join('')+'</div><strong>'+u.q+'</strong></div></div></article>').join('')+'</div><div class="cm-rule"><b>How to use this map</b><span>Hover = quick preview</span><i>→</i><span>Expand = see topics</span><i>→</i><span>Study = open the full learning page</span></div>';
}
function showCoursePreview(n,el){let p=document.getElementById('coursePreview');if(!p){p=document.createElement('div');p.id='coursePreview';p.className='course-preview';document.body.appendChild(p)}const u=courseAreas[n-1];p.innerHTML='<small>QUICK PREVIEW</small><h3>'+u.short+'</h3><p>'+u.fact+'</p><b>'+u.q+'</b>';const r=el.getBoundingClientRect();p.style.left=Math.min(innerWidth-350,Math.max(12,r.right-330))+'px';p.style.top=(r.top+scrollY+20)+'px';p.classList.add('show')}
function hideCoursePreview(){const p=document.getElementById('coursePreview');if(p)p.classList.remove('show')}
function toggleCourseArea(n,btn){const x=document.getElementById('cmExpand'+n);if(!x)return;const open=x.classList.toggle('open');btn.textContent=open?'Hide details ↑':'See what you’ll learn ↓'}
function openUnitStudy(n){
 const u=courseAreas[n-1],el=document.getElementById('unitStudyContent');if(!u||!el)return;
 const tabs=courseAreas.map(x=>'<button class="'+(x.n===n?'active':'')+'" onclick="openUnitStudy('+x.n+')"><span>0'+x.n+'</span><b>'+x.short+'</b></button>').join('');
 el.innerHTML='<article class="decl unit-study"><section class="decl-hero unit-study-hero u'+n+'"><div class="decl-hero-copy"><p class="eyebrow">AP U.S. GOVERNMENT · UNIT '+n+' OF 5</p><h1>'+u.title+'</h1><h2>'+u.q+'</h2><p>'+u.summary+'</p><div class="decl-actions"><button onclick="document.getElementById(\'unit-big\').scrollIntoView({behavior:\'smooth\'})">▶ &nbsp; Start the overview</button><button class="outline" onclick="document.getElementById(\'unit-flow\').scrollIntoView({behavior:\'smooth\'})">See the learning path →</button></div></div><blockquote>'+u.weight+'<small>Multiple-choice exam weighting</small></blockquote></section><nav class="unit-tabs">'+tabs+'</nav><div class="decl-body"><section id="unit-big" class="decl-big"><p class="eyebrow">THE BIG PICTURE</p><h2>'+u.q+'</h2><p>'+u.summary+'</p><div class="decl-quote">'+u.fact+'<small>Study lens</small></div></section><section id="unit-flow" class="unit-flow"><p class="eyebrow">LEARN IT IN ORDER</p><h2>The path through this unit</h2><div>'+u.flow.map((x,i)=>'<button onclick="this.classList.toggle(\'open\')"><b>0'+(i+1)+'</b><span>'+x+'</span><i>+</i><p>'+unitTopicDetail(n,i)+'</p></button>').join('')+'</div></section><aside class="decl-side"><section><h3>🔑 &nbsp; What Ethan should know</h3><ol>'+u.topics.map((x,i)=>'<li><b>'+(i+1)+'</b><span>'+x+'</span></li>').join('')+'</ol></section><section><h3>🧠 &nbsp; Study Strategy</h3><p>First understand the big idea. Then learn the sequence. Finally, explain how the pieces connect without looking at the page.</p></section></aside><section class="unit-chart"><p class="eyebrow">SEE THE CONNECTION</p><h2>One visual mental model</h2><div class="unit-flowchart">'+u.flow.map((x,i)=>'<span>'+x+'</span>'+(i<u.flow.length-1?'<i>→</i>':'')).join('')+'</div></section><section class="decl-card"><h3>🌎 &nbsp; Why It Matters</h3><p>'+u.fact+'</p></section><section class="decl-card decl-check"><h3>✅ &nbsp; Quick Check</h3><p><b>'+u.q+'</b></p><button onclick="this.nextElementSibling.hidden=false">Show study prompt</button><p hidden>Use at least two of these ideas in your answer: '+u.topics.slice(0,3).join(', ')+'.</p></section><section class="decl-card decl-next"><h3>✏️ &nbsp; Practice</h3><p>Test the unit with short recall questions and AP-style practice.</p><button onclick="show(\'practice\')">Practice this material →</button></section></div></article>';
 show('unitStudy');
}
function unitTopicDetail(n,i){const d={
1:['Why people create governments and how democratic ideals shaped the founding.','Trace the problem from independence to the first national framework.','See why weaknesses in the Articles led to a new design.','Understand the debates and compromises behind the Constitution.','Connect constitutional structure to rights and limits on power.','See how national and state authority are divided.'],
2:['Congress represents constituents, legislates, budgets, and oversees.','The president executes laws and uses constitutional and political powers.','Federal agencies turn laws into rules and administration.','Courts interpret law and resolve constitutional disputes.','Checks and balances create shared and competing powers.'],
3:['Start with the liberties listed in the Bill of Rights.','The Fourteenth Amendment changed the constitutional relationship between states and individual rights.','Selective incorporation applied many Bill of Rights protections to the states.','Civil-rights struggles centered on equal protection and access.','Court decisions show how constitutional principles are applied.'],
4:['Political beliefs begin developing through family, community, education, events, and other influences.','Political socialization describes how people acquire political attitudes.','Public opinion reflects attitudes across a population.','Polling uses samples and methodology to estimate public opinion.','Ideology helps organize beliefs about government and policy.'],
5:['Citizens develop preferences and decide whether and how to participate.','Parties and interest groups organize political activity.','Campaigns communicate choices and mobilize supporters.','Voting is one major form of participation.','Elections connect participation to officeholding and government.']
};return (d[n]||[])[i]||'Connect this topic to the unit’s big question and explain it in your own words.'}
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
  renderCourseMap();
}

document.addEventListener('DOMContentLoaded', bootstrap);

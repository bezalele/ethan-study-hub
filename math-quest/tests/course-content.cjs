const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.join(__dirname,'..'),ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'course-content.js'),'utf8')+';this.lessons=COURSE_LESSONS;this.bank=COURSE_BANK;',ctx);
const math=require(path.join(root,'unit2-math.js'));
const numerical={
 'signed-numbers':(v,n)=>[-2,2*n+3,(n+3)*(n+1),2][v],
 fractions:(v,n)=>[(2*n+1)/6,(2*n-1)/8,3*n/20,n/6][v],
 'operation-order':(v,n)=>[n+12,4*n+12,2*n*n+1,8*n][v],
 'percent-rates':(v,n)=>[5*n,17*n,3,n/20][v],
 'data-displays':(v,n)=>[2,3,null,2*n+5][v],
 center:(v,n)=>[n+3,n+4,n+3,n+10][v],
 spread:(v,n)=>[n+3,n+11,8,14][v],
 'standard-deviation':(v,n)=>[2,0,n+1,3*(n+1)][v],
 outliers:(v,n)=>[n+30,n-2,null,null][v],
 'compare-data':(v,n)=>v===3?40:null,
 'spreadsheet-tools':(v,n)=>v===1?n+4:null,
};
let count=0;const ids=new Set();for(const t of ctx.lessons){assert.equal(ctx.bank[t.id].length,24);for(const [i,q]of ctx.bank[t.id].entries()){
 assert(!ids.has(q.id));ids.add(q.id);assert(q.steps.length>=2&&q.hint&&q.prompt);assert(math.check(q.answer,q).ok,`${q.id}: correct answer rejected`);assert(!math.check('999999',q).ok,`${q.id}: wrong answer accepted`);
 const v=i%4,n=Math.floor(i/4)+1;
 if(q.kind==='choice'){assert(q.choices.includes(q.answer));assert.equal(new Set(q.choices).size,q.choices.length);for(const alt of q.choices.filter(a=>a!==q.answer))assert(!math.check(alt,q).ok);}
 else if(numerical[t.id]){const expected=numerical[t.id](v,n);assert(math.check(String(expected),q).ok,`${q.id}: independent numerical check`);}
 if(q.kind==='expression'){
  for(const x of [-3,0,2,7])for(const y of [-2,3]){
   const value=q.answer.replace(/x/g,`*(${x})`).replace(/y/g,`*(${y})`);
   const a=n+(t.id==='distribute'?1:3),b=n+2;
   const expected=t.id==='distribute'?[a*(x+b),-a*(x-b),a*(2*x+3),null][v]:[(a+1)*x,(a-2)*x+5+n,3*x+3*y,5*x+2*n][v];
   assert(math.equal(math.parse(value),math.parse(String(expected))),`${q.id}: substitution`);
  }
 }
 count++;
}}
assert.equal(ctx.lessons.length,16);assert.equal(count,384);
assert(math.check('0.5',ctx.bank.fractions[0]).ok); // 1/3+1/6
assert(math.check('2*x+6',ctx.bank.distribute[0]).ok);
console.log('PASS: 16 lessons, 64 worked examples, 320 practice questions; numeric calculations, expression substitution, choices, equivalent fractions and wrong-answer rejection.');

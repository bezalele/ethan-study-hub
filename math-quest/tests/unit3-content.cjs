const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.join(__dirname,'..'),ctx={};vm.createContext(ctx);vm.runInContext(['course-content.js','unit3-content.js','unit3-tools.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n')+';this.ls=COURSE_LESSONS.filter(l=>l.unit===U3_UNIT);this.bank=COURSE_BANK;this.stats=u3Stats;',ctx);
const math=require(path.join(root,'unit2-math.js'));assert.equal(ctx.ls.length,10);let count=0,nums=0;
// Independent answer oracles cover every numerical question, not only acceptance of the authored answer.
const expected={
 'two-way-tables':(v,n)=>{const t=[[6*n,4*n],[3*n,7*n]];return [t.flat().reduce((a,b)=>a+b),t[0][0]+t[1][0],10*n-6*n,t[1][0]][v];},
 'relative-frequencies':(v,n)=>[.3,60,2/3,.55][v],
 'categorical-association':(v,n)=>v===0?30:null,
 'scatter-models':(v,n)=>v===0?n+1:v===3?n+11:null,
 'fitting-lines':(v,n)=>[n+1,n+3,null,4*n+6][v],
 residuals:(v,n)=>[3,-2,2*n+1,null][v],
 'using-correlation':(v,n)=>v<2?(v===0?1:-1)*(.55+n*.05):null,
 'model-predictions':(v,n)=>v===0?28+n:v===2?2:null,
};
const ids=new Set();for(const l of ctx.ls){assert(l.ideas.length>=3&&l.method.length>=3&&l.parent&&l.mistake);assert.equal(ctx.bank[l.id].length,24);for(const [i,q]of ctx.bank[l.id].entries()){
 assert(!ids.has(q.id));ids.add(q.id);assert(q.prompt&&q.hint&&q.steps.length>=2);assert(math.check(q.answer,q).ok,q.id);assert(!math.check('99999',q).ok,q.id);
 if(q.kind==='choice'){assert(q.choices.includes(q.answer));assert.equal(new Set(q.choices).size,q.choices.length);for(const other of q.choices.filter(x=>x!==q.answer))assert(!math.check(other,q).ok,q.id);}
 else{const val=expected[l.id]?.(i%4,Math.floor(i/4)+1);assert.notEqual(val,null,q.id);assert.notEqual(val,undefined,q.id);assert(math.check(String(val),q).ok,q.id+' independently calculated answer');nums++;}
 count++;
}}
assert.equal(count,240);const close=(a,b)=>assert(Math.abs(a-b)<1e-10);
let s=ctx.stats([[1,5],[2,7],[3,9]]);close(s.r,1);close(s.m,2);close(s.b,3);
s=ctx.stats([[1,9],[2,7],[3,5]]);close(s.r,-1);close(s.m,-2);close(s.b,11);
s=ctx.stats([[0,4],[1,1],[2,0],[3,1],[4,4]]);close(s.r,0);close(s.m,0);
assert.equal(ctx.stats([[1,2],[1,3],[1,4]]).r,null);assert.equal(ctx.stats([[1,2],[2,2],[3,2]]).r,null);
// Check correlation invariance under positive rescaling, swapping variables, and sign reversal.
const a=[[1,4],[2,8],[3,7],[4,12]],r=ctx.stats(a).r;close(ctx.stats(a.map(([x,y])=>[60*x,y])).r,r);close(ctx.stats(a.map(([x,y])=>[y,x])).r,r);close(ctx.stats(a.map(([x,y])=>[-x,y])).r,-r);
console.log(`PASS: ${count} authored questions (${nums} independently computed numeric answers), choice distractors, explanations, regression and correlation edge cases.`);

/* Original Unit 3 teaching material. Sequence reference:
 https://im.kendallhunt.com/HS/students/1/3/index.html
 All numerical data and study scenarios below are invented for practice. */
'use strict';
const U3_UNIT='two-variable';
const u3Contexts=['soccer club','art club','robotics club','music club','drama club','chess club'];
function u3Table(n){return [[6*n,4*n],[3*n,7*n]];}
function u3TableText(n){return `A fictional survey records club membership and bus use. Members: ${6*n} bus, ${4*n} no bus. Nonmembers: ${3*n} bus, ${7*n} no bus.`;}
function u3Add(id,title,summary,ideas,method,mistake,parent,make){addCourseLesson(U3_UNIT,id,title,summary,ideas,method,mistake,parent,make);}
u3Add('two-way-tables','Read and complete two-way tables','Organize two categorical variables and distinguish cells from totals.',[
 'A categorical variable describes a group, such as club membership or bus use. A two-way table counts combinations of two categories. Each person appears in exactly one interior cell.',
 'An interior cell is a joint frequency: it belongs to both a row and a column. A row or column total is a marginal frequency. The grand total counts everyone once.',
 'For example: 12 members ride the bus, 8 members do not, 6 nonmembers ride, and 14 nonmembers do not. The member total is 20, the bus total is 18, and the grand total is 40. Read labels before calculating.'
],['Identify what each row and column means.','Add across a row or down a column to find its total.','Find a missing cell by subtraction; verify the row and column totals agree.'],
 'Adding all row totals and all column totals together counts everyone twice.',
 'Ask Ethan to say what a cell means in a complete sentence before adding. Can he point to people who belong to both categories?',(v,n)=>{
 const p=u3TableText(n);
 if(v===0)return cq(p+' How many people were surveyed?',20*n,[`Members: ${6*n}+${4*n}=${10*n}.`,`Nonmembers: ${3*n}+${7*n}=${10*n}.`,`Total: ${10*n}+${10*n}=${20*n}.`],'Add the four interior cells once.');
 if(v===1)return cq(p+' How many people use the bus?',9*n,[`The bus column includes members and nonmembers.`,`${6*n}+${3*n}=${9*n}.`],'Add the two bus counts.');
 if(v===2)return cq(`In a fictional ${u3Contexts[n-1]} survey, ${10*n} members are counted. ${6*n} use the bus. How many members do not use it?`,4*n,[`The two bus categories split the ${10*n} members.`,`Missing count: ${10*n}−${6*n}=${4*n}.`],'Subtract the known cell from its row total.');
 return cq(p+' How many people are both nonmembers and bus users?',3*n,['Both conditions must hold, so use one interior cell.',`The nonmember/bus cell contains ${3*n} people.`],'Find the intersection, not a row total.');
});
u3Add('relative-frequencies','Relative and conditional frequencies','Choose the right denominator and compare proportions fairly.',[
 'Relative frequency is a count divided by a reference total. For a whole-table relative frequency, divide by the grand total; all interior proportions then sum to 1.',
 'Conditional relative frequency restricts the group. “Among members, what fraction ride the bus?” divides the member/bus count by all members, not by everyone. Row percentages sum to 100% within each row.',
 '“Among bus riders, what fraction are members?” reverses the condition and can have a different answer. In a 40-person example with 12 member riders and 18 total riders, these are 12/20 = 60% and 12/18 = 2/3. State the denominator in words.'
],['Underline the group after “among” or “of.”','Use that group’s total as the denominator.','Divide the relevant count by that total. Convert to percent only when requested.'],
 'Changing the reference group changes the question. 60% of members using the bus does not mean 60% of bus users are members.',
 'Ask: “Out of which people?” Have him explain the denominator before calculating.',(v,n)=>{
 const p=u3TableText(n);
 if(v===0)return cq(p+' What fraction of everyone are members who use the bus?', '3/10',[`The joint count is ${6*n}; everyone totals ${20*n}.`,`${6*n}/${20*n}=3/10.`],'Use the grand total.');
 if(v===1)return cq(p+' Among members, what percent use the bus? Enter the number without %.',60,[`Restrict to ${10*n} members.`,`${6*n}/${10*n}=0.6.`,`0.6×100=60%.`],'Use the member total.');
 if(v===2)return cq(p+' Among bus users, what fraction are members?', '2/3',[`There are ${9*n} bus users.`,`${6*n}/${9*n}=2/3.`],'The denominator is the bus column total.');
 return cq(p+' What fraction of everyone do not use the bus?', '11/20',[`No bus: ${4*n}+${7*n}=${11*n}.`,`${11*n}/${20*n}=11/20.`],'First find the no-bus total, then divide by everyone.');
});
u3Add('categorical-association','Association in categorical data','Compare conditional percentages rather than raw counts.',[
 'Two categorical variables are associated in a data set when knowing one category changes the distribution of the other. Compare the same outcome across groups using conditional percentages.',
 'If 18 of 30 members use the bus and 30 of 100 nonmembers do, the rates are 60% and 30%. Although more nonmembers ride in raw numbers, riding is more common proportionally among members.',
 'Equal conditional rates show no association in this table. Differences suggest an association in these observations, but do not automatically establish a pattern in the whole population or prove a cause. Sampling methods and sample size matter.'
],['Compute the outcome percentage within each group.','Compare rates using the same outcome and denominator type.','Describe the difference in percentage points and limit the conclusion to the evidence.'],
 'A 60% rate compared with 30% is 30 percentage points higher, not 30% higher relative to the old rate.',
 'Ask why a larger group can have more riders but a smaller riding percentage.',(v,n)=>{
 if(v===0)return cq(`${6*n} of ${10*n} members and ${3*n} of ${10*n} nonmembers use the bus. How many percentage points higher is the member rate?`,30,[`${6*n}/${10*n}=60%; ${3*n}/${10*n}=30%.`,'60−30=30 percentage points.'],'Compare percentages, not counts.');
 if(v===1)return cc(`In a fictional ${u3Contexts[n-1]} survey, ${6*n} of ${10*n} members and ${10*n} of ${40*n} nonmembers use the bus. Which group has the larger bus-use rate?`,'Members',['Members','Nonmembers','Equal rates'],`Member rate: 60%. Nonmember rate: 25%. Compare rates even though the nonmember bus count is larger.`);
 if(v===2)return cc(`${4*n} of ${10*n} members and ${8*n} of ${20*n} nonmembers choose online books. What does this table show?`,'Equal conditional rates',['Equal conditional rates','A larger rate for members','A larger rate for nonmembers'],`Both rates are 40%. This table shows no association between membership and book choice.`);
 return cc(`In a fictional survey of ${20*n} students, bus-use rates differ between club members and nonmembers. Which claim is supported?`,'An association appears in this sample',['An association appears in this sample','Club membership causes bus use','Every member uses the bus'],'Different conditional rates suggest an association; an observational survey alone does not show a cause.');
});
u3Add('scatter-models','Scatter plots and linear models','Read paired numerical data, direction, and unusual points.',[
 'A scatter plot places each paired observation (x, y) as one point. Label both axes and units. For example, x can be hours practiced and y can be successful shots out of 20.',
 'Describe direction (positive or negative), form (roughly linear or curved), strength (how closely points follow the pattern), and unusual points. Positive means y tends to increase as x increases; it does not mean every point rises.',
 'A linear model ŷ = mx + b predicts a response from an input. The hat on ŷ means predicted, not observed. A model is a summary of the data, so actual observations can differ from predictions.'
],['Identify the input and response with their units.','Describe the overall pattern without joining the dots.','Use a line only when a straight pattern is reasonable, and distinguish predictions from actual observations.'],
 'The x-coordinate comes first. A scatter plot does not require connecting points in the order they were collected.',
 'Ask Ethan what one point tells us about one observation, then ask what the whole cloud suggests.',(v,n)=>{
 if(v===0)return cq(`A player’s point is (${n+1}, ${n+8}), with x = practice hours and y = successful shots. How many practice hours does it represent?`,n+1,['The first coordinate is x.',`x=${n+1}, so the player practiced ${n+1} hours.`],'Read the horizontal coordinate.');
 if(v===1)return cc(`A practice data set has pairs (1,${n+2}), (2,${n+4}), (3,${n+6}), (4,${n+8}). Describe its direction.`,'Positive',['Positive','Negative','No direction'],`As x increases, y increases. These points have an exact positive linear pattern.`);
 if(v===2)return cc(`Toy-car age and resale value follow (1,${80+n}), (2,${60+n}), (3,${40+n}), (4,${20+n}). Describe its direction.`,'Negative',['Positive','Negative','No direction'],`As age increases, value decreases. That is a negative association.`);
 return cq(`A model predicts successful shots by ŷ = 2x + ${n+3}. What does it predict at x = 4 practice hours?`,n+11,[`Substitute x=4.`,`ŷ=2(4)+${n+3}=${n+11}.`],'Replace x with 4.');
});
u3Add('fitting-lines','Fit a line and interpret its equation','Use representative points to estimate slope and intercept.',[
 'A fitted line follows the center of a roughly straight cloud. A reasonable informal fit usually has points on both sides. It need not go through every point or through the origin.',
 'Choose two well-separated points on your fitted line. Compute slope m = (change in y)/(change in x), then use b = y − mx. The chosen line points need not be actual data observations.',
 'In ŷ = 3x + 8, where x is weeks and y is plant height in cm, the predicted increase is 3 cm per week. The intercept predicts 8 cm at week 0; interpret it only if week 0 is meaningful. Least-squares regression is a specific fit that minimizes the sum of squared vertical residuals.'
],['Select two clear points on the proposed line.','Calculate slope using the same order in numerator and denominator.','Solve for b, write the model, and interpret each number using units.'],
 'Slope is not y/x unless the line passes through the origin. Do not choose a line only because it joins two extreme observations.',
 'Ask: “What does one more unit of x do to the prediction?” Let him try a poor line in the explorer and compare its residuals.',(v,n)=>{
 const m=n+1,b=n+3;
 if(v===0)return cq(`A fitted line passes through (1,${m+b}) and (4,${4*m+b}). What is its slope?`,m,[`Change in y: ${4*m+b}−${m+b}=${3*m}.`,'Change in x: 4−1=3.',`Slope=${3*m}/3=${m}.`],'Divide change in y by change in x.');
 if(v===1)return cq(`A fitted line has slope ${m} and passes through (2,${2*m+b}). What is its y-intercept?`,b,[`Use b=y−mx.`,`b=${2*m+b}−${m}(2)=${b}.`],'Substitute the point in y=mx+b.');
 if(v===2)return cc(`A plant-height model is ŷ = ${m}x + ${b}, with x in weeks and y in cm. What does ${m} describe?`,'Predicted height gained per week',['Predicted height gained per week','Height measured at every week','Number of plants observed'],`The slope is ${m} cm per week. It describes a predicted change, not a count of plants.`);
 return cq(`A fitted model is ŷ = ${m}x + ${b}. What y-value does it predict when x = 3?`,3*m+b,[`Substitute x=3.`,`ŷ=${m}×3+${b}=${3*m+b}.`],'Multiply by the input before adding the intercept.');
});
u3Add('residuals','Residuals and model fit','Measure prediction errors and look for patterns in them.',[
 'A residual is observed y minus predicted ŷ. If a model predicts 14 and the actual value is 17, the residual is +3: the point is above the line and the model underpredicted.',
 'A negative residual means the point is below the line and the prediction was too high. The absolute value is the vertical distance from the observation to the fitted line.',
 'A residual plot puts x on the horizontal axis and residual on the vertical axis, with a reference line at zero. A curved residual pattern suggests a straight-line model misses structure. Unpatterned residuals around zero support, but do not prove, that a linear model is suitable.'
],['Calculate the prediction from the model.','Subtract predicted from observed, keeping the sign.','Interpret the error in the original response units and inspect the overall residual pattern.'],
 'Reversing the subtraction reverses the meaning. Residual = observed − predicted, every time.',
 'Have Ethan say “actual minus prediction” aloud. Ask whether a positive residual means the model guessed too high or too low.',(v,n)=>{
 const p=2*n+5;
 if(v===0)return cq(`A model predicts ${p} cm and a plant measures ${p+3} cm. Find the residual in cm.`,3,[`Residual=observed−predicted.`,`${p+3}−${p}=3 cm. The prediction was too low.`],'Actual minus prediction.');
 if(v===1)return cq(`The model ŷ=2x+5 is used at x=${n}. The observed y is ${p-2}. Find the residual.`,-2,[`Prediction: 2(${n})+5=${p}.`,`Residual: ${p-2}−${p}=−2.`],'Find the predicted value first.');
 if(v===2)return cq(`At x=${n}, a model predicts ${p}. The residual is −4. What was the observed value?`,p-4,[`Observed=predicted+residual.`,`${p}+(−4)=${p-4}.`],'Rearrange residual=observed−predicted.');
 return cc(`A linear model for ${u3Contexts[n-1]} data has residuals that form a U-shaped pattern. What should you consider?`,'A curved model may fit better',['A curved model may fit better','The line is necessarily perfect','Residuals must all be positive'],'A systematic curve in residuals suggests the straight line is missing a nonlinear pattern.');
});
u3Add('correlation-coefficient','The correlation coefficient','Interpret r as the direction and strength of a linear association.',[
 'The correlation coefficient r lies between −1 and 1. Its sign gives direction; its absolute value tells how tightly paired numerical data follow a straight line. It has no units.',
 'Values near +1 indicate a strong positive linear association; values near −1 indicate a strong negative one. A value near 0 indicates a weak linear association, but a strong curved relationship can still exist.',
 'For example, r=−0.9 is stronger in linear association than r=+0.4 because 0.9 is closer to 1. r does not describe the slope, the fraction of correct predictions, or a percentage of people. If either variable is constant, r is undefined.'
],['Check the sign to describe direction.','Compare absolute values to judge linear strength.','Inspect the scatter plot for curves and unusual points before drawing a conclusion.'],
 'Negative correlation is not weaker just because the number is negative. r=−1 is a perfect negative linear association.',
 'Ask Ethan to compare −0.85 with +0.30 and explain why absolute value matters.',(v,n)=>{
 const r=(0.7+n*.03).toFixed(2);
 if(v===0)return cc(`A fictional data set has r=−${r}. What is its direction?`,'Negative',['Positive','Negative','No direction'],`The minus sign means y tends to decrease as x increases.`);
 if(v===1)return cc(`Which shows the stronger linear association: A has r=−${r}; B has r=0.30?`,'A',['A','B','Equal strength'],`|−${r}|=${r}, which is greater than 0.30. The sign gives direction, not strength.`);
 if(v===2)return cc(`A calculator reports r=${(1+n/10).toFixed(1)} for ${u3Contexts[n-1]} data. Is that possible?`,'No; r must be between −1 and 1',['No; r must be between −1 and 1','Yes; every positive number is allowed','Only for large samples'],'A correlation coefficient outside [−1,1] is invalid.');
 return cc(`The ${u3Contexts[n-1]} data form a U-shaped curve and have r=0. Which statement is sound?`,'A nonlinear relationship may still exist',['A nonlinear relationship may still exist','There is no possible relationship','The slope must equal one'],'r measures linear association; it does not rule out a clear curved pattern.');
});
u3Add('using-correlation','Use correlation responsibly','Check plots, outliers, units, and the limits of a summary number.',[
 'Inspect the scatter plot along with r. A single unusual observation can substantially change a correlation or fitted line. Do not delete a point just to improve the fit: investigate and explain any exclusion.',
 'Changing to another positive measurement scale, such as hours to minutes or cm to meters, leaves r unchanged. It can change the slope and intercept because those depend on units.',
 'Swapping x and y leaves r unchanged, though prediction equations generally change. A high |r| alone does not establish causation or guarantee useful predictions outside the data. Correlation needs paired numerical observations with variation in both variables.'
],['Confirm the observations are paired and both variables vary.','Read the plot for unusual points, curves, and gaps.','Describe what r supports and explicitly avoid unsupported causal or prediction claims.'],
 'A nearly perfect correlation is not evidence that changing x will necessarily change y.',
 'Ask how the data were gathered and whether one unusual point seems to drive the result.',(v,n)=>{
 const r=(0.55+n*.05).toFixed(2);
 if(v===0)return cq(`Practice time in hours and scores have r=${r}. If time is converted to minutes, what is r?`,r,['Minutes=60×hours: a positive rescaling.',`Correlation has no units and stays ${r}.`],'Positive unit conversions do not change r.');
 if(v===1)return cq(`A data set has r=−${r}. After swapping which variable is called x and which is y, what is r?`,'-'+r,['Correlation is symmetric in x and y.',`It remains −${r}, although the prediction equation can change.`],'Swapping variables does not change correlation.');
 if(v===2)return cc(`One unusually large value changes r for a ${u3Contexts[n-1]} data set. What is the best first response?`,'Investigate the unusual observation',['Investigate the unusual observation','Delete it automatically','Ignore the scatter plot'],'Check for a recording error or a real unusual case, and report the effect rather than silently removing it.');
 return cc(`All ${n+5} students have exactly the same x-value, but their y-values differ. What can you say about r?`,'It is undefined',['It is undefined','It must be zero','It must be one'],'The coefficient divides by a measure of variation in x. With no x variation, that denominator is zero.');
});
u3Add('causation','Correlation, causation, and study design','Separate an observed pattern from evidence of cause and effect.',[
 'An observational study records what already happens. A positive association between practice and performance could reflect a practice effect, prior experience, motivation, or several factors together.',
 'A lurking variable can influence both variables. For example, hot weather can increase both ice-cream sales and swimming activity. One does not have to cause the other.',
 'Random assignment to treatment groups helps balance other influences and supports a causal comparison when an experiment is well conducted. Random sampling serves a different purpose: helping a sample represent a population. Neither makes every study perfect; sample size, adherence, and measurement still matter.'
],['Ask whether researchers assigned a treatment or only observed.','Look for alternative explanations and possible lurking variables.','Distinguish random assignment (causal comparison) from random sampling (representation).'],
 '“Random sample” and “random assignment” are not interchangeable. An observational survey does not become an experiment because its sample was random.',
 'Ask Ethan to invent a third factor that could explain an observed association, then describe a fair experiment.',(v,n)=>{
 const club=u3Contexts[n-1];
 if(v===0)return cc(`Researchers survey ${20*n} ${club} students and find that more practice is associated with better scores. No practice was assigned. What follows?`,'An association, not proof of causation',['An association, not proof of causation','Practice is proven to be the only cause','Scores cannot relate to practice'],'This is observational. Motivation or previous experience might affect both practice and scores.');
 if(v===1)return cc(`In ${n+5} weekly observations, ice-cream sales and swimming visits rise together. Which is a plausible lurking variable?`,'Hot weather',['Hot weather','The spelling of ice cream','The order of table columns'],'Hot weather can encourage both buying ice cream and going swimming.');
 if(v===2)return cc(`A researcher randomly assigns ${20*n} volunteers to a new study method or the usual method, then compares the same test. What is random assignment mainly for?`,'Supporting a fair causal comparison',['Supporting a fair causal comparison','Making the volunteers represent everyone','Guaranteeing identical scores'],'Assignment helps balance other influences between treatment groups; it is not the same as sampling the population.');
 return cc(`A school randomly selects ${20*n} students to survey about study time. What is random sampling mainly for?`,'Making the sample more representative',['Making the sample more representative','Proving study time causes grades','Assigning students a treatment'],'Random selection can improve representation. Researchers have not assigned a treatment, so this remains observational.');
});
u3Add('model-predictions','Predictions and a modeling investigation','Use a model within its data range and explain uncertainty.',[
 'Interpolation predicts within the observed x-range. Extrapolation predicts outside it and can be unreliable because the pattern may change. A numerical answer from an equation is not automatically a sensible real-world prediction.',
 'A model’s output must be interpreted in context. If a model predicts 10.6 successful shots, report about 11 as an estimate, not an actual measurement or a guarantee. Inspect residuals to understand typical errors; avoid claiming a precise error bound from one example.',
 'Try a small investigation: measure paired lengths from 8–12 objects of one type using the same units. Make a scatter plot, fit a line, inspect residuals, and predict a held-out measurement within the original range. Compare prediction with observation and explain limits. These exercises use invented measurements, not a validated biological model.'
],['Record the observed input range and the response units.','Substitute the new input and identify interpolation or extrapolation.','Report an estimate with an explanation of its limits; compare with an observation if available.'],
 'Do not apply a model far beyond the data just because the arithmetic is possible.',
 'Ask Ethan to collect a few paired measurements and explain what would make a prediction more or less trustworthy.',(v,n)=>{
 const b=n+10;
 if(v===0)return cq(`For invented object measurements, ŷ=3x+${b} predicts length in cm from width x in cm. Observed widths run from 2 to 10 cm. Predict length at width 6 cm.`,18+b,[`6 is within [2,10], so this is interpolation.`,`ŷ=3(6)+${b}=${18+b} cm; this is an estimate.`],'Substitute 6 for x.');
 if(v===1)return cc(`A model fitted to widths from 2 to 10 cm is used at width ${15+n} cm. What type of prediction is this?`,'Extrapolation',['Interpolation','Extrapolation','An observed measurement'],`${15+n} lies outside the observed range. The line may no longer describe the relationship there.`);
 if(v===2)return cq(`A model predicts ${n+20} cm for an object. The measured length is ${n+18} cm. What is the absolute prediction error in cm?`,2,[`Residual=${n+18}−${n+20}=−2 cm.`,`Absolute error=|−2|=2 cm.`],'Absolute error is the magnitude of the residual.');
 return cc(`A fitted model from ${n+8} paired observations predicts 10.6 successful shots out of 20. Which report is best?`,'About 11 shots, with prediction uncertainty',['About 11 shots, with prediction uncertainty','Exactly 10.6 actual shots','Guaranteed at least 11 shots'],'A model gives an estimate. Actual shot counts are whole numbers, and the model does not guarantee the result.');
});

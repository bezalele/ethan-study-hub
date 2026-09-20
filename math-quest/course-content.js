/* Original teaching material for Foundations and Algebra 1 Unit 1. */
'use strict';
const COURSE_LESSONS = [];
const COURSE_BANK = {};
function addCourseLesson(unit, id, title, summary, ideas, method, mistake, parent, make) {
  const lesson = {unit, id, title, summary, ideas, method, mistake, parent};
  COURSE_LESSONS.push(lesson);
  COURSE_BANK[id] = Array.from({length:24}, (_, i) => ({
    id:`course-${id}-${i}`, topic:id, unit, title, kind:'number', target:'answer',
    ...make(i % 4, Math.floor(i / 4) + 1),
  }));
}
const cq = (prompt, answer, steps, hint, extra={}) => ({prompt, answer:String(answer), steps, hint, ...extra});
const cc = (prompt, answer, choices, reason) => cq(prompt, answer, [reason, `Answer: ${answer}.`], 'Identify the key feature described, then compare the choices.', {kind:'choice', choices});
const cf = (a,b) => {const gcd=(x,y)=>y?gcd(y,x%y):Math.abs(x);const g=gcd(a,b);return b/g===1?String(a/g):`${a/g}/${b/g}`;};
const cm = a => a.reduce((s,x)=>s+x,0)/a.length;
const cmed = a => {const b=[...a].sort((x,y)=>x-y), m=Math.floor(b.length/2);return b.length%2?b[m]:(b[m-1]+b[m])/2;};
addCourseLesson('foundations','signed-numbers','Positive and negative numbers','Use signs, distance from zero, and the number line.',[
 'Positive numbers are to the right of zero; negative numbers are to the left. A number farther right is greater: −2 is greater than −7.',
 'Adding a positive number moves right. Adding a negative number moves left. Subtracting a number means adding its opposite: 4 − (−3) = 4 + 3.',
 'For multiplication and division, equal signs give a positive result and different signs give a negative result. Absolute value is distance from zero, so |−6| = 6.'
],['Identify the operation; addition rules differ from multiplication rules.','Rewrite subtraction as adding the opposite if helpful.','Find the magnitude, then check the sign against a number line or sign rule.'],
 'Two negatives do not always make a positive: −3 + (−4) is −7. That shortcut applies to multiplication and division.',
 'Ask Ethan to explain the direction of a move before calculating. Use temperatures or a soccer team’s goal difference.',(v,n)=>{
 const a=n+3,b=n+1;
 if(v===0)return cq(`Calculate −${a} + ${b}.`, -a+b,[`Start at −${a}.`,`Move ${b} places right because you are adding a positive number.`,`−${a} + ${b} = ${-a+b}.`],'Adding a positive number moves right.');
 if(v===1)return cq(`Calculate ${n} − (−${a}).`, n+a,['Subtracting a negative is adding its opposite.',`${n} + ${a} = ${n+a}.`],'Replace subtraction of a negative with addition.');
 if(v===2)return cq(`Calculate (−${a}) × (−${b}).`,a*b,['Both factors have the same sign, so the product is positive.',`${a} × ${b} = ${a*b}.`],'Use the multiplication sign rule.');
 return cq(`Calculate |−${a}| + (−${b}).`,a-b,[`|−${a}| = ${a}, the distance from zero.`,`${a} − ${b} = ${a-b}.`],'Evaluate the absolute value first.');
});
addCourseLesson('foundations','fractions','Fractions and decimals','Calculate with fractions and connect them to decimals.',[
 'A fraction a/b means a divided by b, with b nonzero. Multiplying numerator and denominator by the same nonzero number gives an equivalent fraction.',
 'Add or subtract fractions using a common denominator. Multiply fractions straight across. To divide by a nonzero fraction, multiply by its reciprocal.',
 'A decimal is another way to write a number: 0.75 = 75/100 = 3/4. Keep exact fractions when a decimal repeats.'
],['Identify the operation.','Use a common denominator for addition/subtraction, or a reciprocal for division.','Calculate and simplify; estimate to check whether the size makes sense.'],
 'Do not add denominators: 1/2 + 1/3 = 5/6, not 2/5.',
 'Ask why the pieces must be the same size before adding fractions. Let him answer with an exact fraction or an equivalent decimal.',(v,n)=>{
 if(v===0)return cq(`Calculate ${n}/3 + 1/6.`,cf(2*n+1,6),[`Rewrite ${n}/3 as ${2*n}/6.`,`Add numerators: (${2*n}+1)/6.`,`Simplify: ${cf(2*n+1,6)}.`],'Use 6 as a common denominator.');
 if(v===1)return cq(`Calculate ${n}/4 − 1/8.`,cf(2*n-1,8),[`Rewrite ${n}/4 as ${2*n}/8.`,`Subtract numerators: (${2*n}−1)/8 = ${cf(2*n-1,8)}.`],'Use 8 as a common denominator.');
 if(v===2)return cq(`Calculate ${n}/5 × 3/4.`,cf(n*3,20),['Multiply the numerators and multiply the denominators.',`(${n}×3)/(5×4) = ${cf(n*3,20)}.`],'Multiply straight across, then simplify.');
 return cq(`Calculate ${n}/4 ÷ 3/2.`,cf(n,6),['Multiply by the reciprocal of the divisor.',`${n}/4 × 2/3 = ${2*n}/12 = ${cf(n,6)}.`],'The reciprocal of 3/2 is 2/3.');
});
addCourseLesson('foundations','operation-order','Order of operations and substitution','Evaluate expressions in a reliable order.',[
 'An expression names a value; an equation states that two expressions are equal. Evaluate an expression by following its grouping and operations.',
 'Work inside parentheses, then evaluate exponents, then multiply/divide from left to right, then add/subtract from left to right. Multiplication does not automatically come before division.',
 'Substitution replaces a variable with its given value. Use parentheses when substituting a negative number. For example, x² at x = −3 means (−3)² = 9.'
],['Substitute given values using parentheses.','Simplify grouping and powers.','Work through multiplication/division, then addition/subtraction, left to right.'],
 '−3² means −(3²) = −9, while (−3)² = 9. Parentheses change what is squared.',
 'Ask which operation comes first and why, rather than asking only for the final number.',(v,n)=>{
 if(v===0)return cq(`Evaluate ${n}+3×4.`,n+12,['Multiply first: 3×4 = 12.',`Then add: ${n}+12 = ${n+12}.`],'Multiplication comes before addition.');
 if(v===1)return cq(`Evaluate (${n}+3)×4.`,4*(n+3),[`Parentheses first: ${n}+3 = ${n+3}.`,`Then multiply by 4: ${4*(n+3)}.`],'Start inside parentheses.');
 if(v===2)return cq(`Evaluate 2x²+1 when x = −${n}.`,2*n*n+1,[`Substitute: 2(−${n})²+1.`,`Square first: (−${n})² = ${n*n}.`,`Multiply by 2 and add 1: ${2*n*n+1}.`],'The square includes the negative sign because of parentheses.');
 return cq(`Evaluate ${12*n} ÷ 3 × 2.`,8*n,[`Division and multiplication have equal priority; work left to right.`,`${12*n}÷3 = ${4*n}; then ${4*n}×2 = ${8*n}.`],'Do not multiply 3×2 first.');
});
addCourseLesson('foundations','distribute','The distributive property','Expand expressions by multiplying every term.',[
 'a(b+c) = ab+ac: a group repeated a times has both parts repeated a times. For example, 3(x+4) = 3x+12.',
 'The same rule works with subtraction and negative factors. −2(x−5) = −2x+10 because a negative times a negative is positive.',
 'You can use the property in reverse to factor: 6x+12 = 6(x+2). Expanding and factoring write the same quantity in different forms.'
],['Identify the factor outside the parentheses.','Multiply it by every term inside, including signs.','Check by substituting a simple value for the variable.'],
 'Multiplying only the first term changes the expression. The constant must be multiplied too.',
 'Ask Ethan to point to both multiplications. Substituting x=2 is a useful check, though one check alone is not a proof.',(v,n)=>{
 const a=n+1,b=n+2;
 if(v===0)return cq(`Expand ${a}(x+${b}).`,`${a}x+${a*b}`,[`${a}×x = ${a}x.`,`${a}×${b} = ${a*b}.`,`Combine: ${a}x+${a*b}.`],'Multiply the outside number by both terms.',{kind:'expression',target:'expression'});
 if(v===1)return cq(`Expand −${a}(x−${b}).`,`-${a}x+${a*b}`,[`−${a}×x = −${a}x.`,`−${a}×(−${b}) = ${a*b}.`,`Result: −${a}x+${a*b}.`],'Keep the negative sign with the outside factor.',{kind:'expression',target:'expression'});
 if(v===2)return cq(`Expand ${a}(2x+3).`,`${2*a}x+${3*a}`,[`${a}×2x = ${2*a}x.`,`${a}×3 = ${3*a}.`],'Multiply the coefficient of x too.',{kind:'expression',target:'expression'});
 return cq(`Use distribution to calculate ${a}×(${10+b}): split ${10+b} as 10+${b}.`,a*(10+b),[`${a}(10+${b}) = ${10*a}+${a*b}.`,`Add: ${a*(10+b)}.`],'Compute the two smaller products, then add.');
});
addCourseLesson('foundations','like-terms','Combining like terms','Simplify expressions without losing variable parts.',[
 'Like terms have identical variable parts. 3x and −2x are like terms; x and y are not. Constants are like terms with other constants.',
 'Add or subtract the coefficients and keep the variable part: 7x−2x = 5x. An unwritten coefficient is 1, so x+x = 2x.',
 'Distribute first when necessary. Simplifying rewrites an expression; it does not find a numerical value for x.'
],['Expand parentheses if needed.','Group terms with the same variable part, keeping their signs.','Combine coefficients and constants separately.'],
 '3x+2 is not 5x, and x² is not a like term with x.',
 'Ask him to sort terms into x terms, y terms, and constants before calculating.',(v,n)=>{
 const a=n+3;
 if(v===0)return cq(`Simplify ${a}x+2x−x.`,`${a+1}x`,[`The x coefficients are ${a}, 2, and −1.`,`${a}+2−1 = ${a+1}; keep x.`],'The coefficient of −x is −1.',{kind:'expression',target:'expression'});
 if(v===1)return cq(`Simplify ${a}x+5−2x+${n}.`,`${a-2}x+${5+n}`,[`Combine x terms: (${a}−2)x = ${a-2}x.`,`Combine constants: 5+${n} = ${5+n}.`],'Separate variable terms from constants.',{kind:'expression',target:'expression'});
 if(v===2)return cq(`Simplify ${a}x+2y−${n}x+y.`,`3x+3y`,[`x terms: (${a}−${n})x = 3x.`,`y terms: 2y+y = 3y.`,`The result is 3x+3y; x and y cannot merge into one term.`],'Group by letter.',{kind:'expression',target:'expression'});
 return cq(`Simplify 2(x+${n})+3x.`,`5x+${2*n}`,['Distribute: 2x plus twice the constant.',`2x+${2*n}+3x = 5x+${2*n}.`],'Distribute before collecting like terms.',{kind:'expression',target:'expression'});
});
addCourseLesson('foundations','percent-rates','Percentages and unit rates','Connect fractions, decimals, rates, and everyday costs.',[
 'Percent means per hundred: 25% = 25/100 = 0.25. To find a percent of an amount, multiply the amount by the decimal form.',
 'A unit rate tells the amount per one unit. Divide total cost by item count for dollars per item, or distance by time for speed.',
 'After a 20% discount, you pay 80% of the original price. A 10% increase multiplies the original by 1.10. Always identify the starting amount.'
],['Identify the whole or the units in the rate.','Convert the percent to a decimal, or divide to obtain a per-one rate.','Calculate and state what the answer measures.'],
 'A discount amount and a final price are different answers. Check which the question asks for.',
 'Use a shopping or soccer-distance example. Ask Ethan to name the units of his answer.',(v,n)=>{
 if(v===0)return cq(`What is 25% of ${20*n}?`,5*n,['25% = 0.25 = 1/4.',`${20*n}÷4 = ${5*n}.`],'Find one quarter of the total.');
 if(v===1)return cq(`A $${20*n} shirt is 15% off. What is its final price in dollars?`,17*n,[`Discount = 0.15×${20*n} = ${3*n}.`,`Final price = ${20*n}−${3*n} = ${17*n}.`],'You pay 85% of the original price.');
 if(v===2)return cq(`${n+2} notebooks cost $${(n+2)*3}. What is the price per notebook in dollars?`,3,[`Divide total cost by number of notebooks.`,`${(n+2)*3}÷${n+2} = 3 dollars per notebook.`],'Divide dollars by notebooks.');
 return cq(`Write ${n*5}% as a decimal.`,n/20,[`Percent means divide by 100.`,`${n*5}/100 = ${n/20}.`],'Move the decimal point two places left.');
});
addCourseLesson('statistics','data-questions','Statistical questions and data types','Ask questions that anticipate variation.',[
 'A statistical question expects different answers across a group: “How many hours do students sleep?” A question about one fixed fact, such as one student’s age today, is not statistical in this sense.',
 'Numerical data measure or count quantities; categorical data name groups. Jersey numbers look numerical but function as labels, so they are categorical.',
 'Record the observational unit—the person or object being measured—and the variable. A representative sample supports conclusions about a population better than a convenient, biased sample.'
],['Identify who or what is being observed.','Decide whether the values describe categories or quantities.','Check whether the question anticipates variability across observations.'],
 'Numbers used only as labels should not be averaged as if they measured a quantity.',
 'Ask him to write one statistical question about soccer and explain what might vary.',(v,n)=>{
 const contexts=['soccer players','students','runners','classmates','team members','club members'];const g=contexts[n-1];
 if(v===0)return cc(`Which is a statistical question about ${g}?`,'How many hours does each person practice per week?',['How many hours does each person practice per week?','What is 8+2?','What is my age today?'],'Practice hours vary across people, so the question anticipates a distribution of answers.');
 if(v===1)return cc(`The jersey numbers of ${g} are recorded. What type of data are these?`,'Categorical',['Categorical','Numerical'],'Jersey numbers identify people; their differences and averages are not measurements.');
 if(v===2)return cc(`The number of goals scored by each of ${n+8} players is recorded. What type of data is this?`,'Numerical',['Categorical','Numerical'],'Goals are a count. Adding and comparing these quantities is meaningful.');
 return cc(`You want to estimate practice time for all ${g} at school. Which sample is better?`,'A random sample from the full group',['Only the people who practice most','A random sample from the full group','Only your closest friends'],'A random sample from the full group reduces selection bias compared with selecting a special subgroup.');
});
addCourseLesson('statistics','data-displays','Dot plots, histograms, and box plots','Choose and interpret a display that fits the data.',[
 'A dot plot shows one dot for each observation, stacked above its value. Repeated values create taller stacks.',
 'A histogram groups numerical values into intervals. Bar height is frequency, not the value of an individual observation. State interval boundaries so a value is counted exactly once.',
 'A box plot summarizes minimum, Q1, median, Q3, and maximum (or uses whiskers and separate outliers in a modified box plot). It does not show every individual observation. Bar charts compare categories.'
],['Read the variable, units, and axis labels.','Decide whether a mark represents one observation, a count, or a summary.','Count carefully and describe the result in context.'],
 'Do not confuse the height of a histogram bar with the data values along its horizontal axis.',
 'Ask what each dot or bar represents. Use the data explorer below to connect a list with its displays.',(v,n)=>{
 const a=[n,n,n+1,n+2,n+2,n+4];
 if(v===0)return cq(`A dot plot has values ${a.join(', ')}. How many dots are above ${n+2}?`,2,[`Count appearances of ${n+2} in the list.`,`It occurs twice, so there are 2 dots.`],'Each occurrence is one dot.');
 if(v===1)return cq(`Histogram data: ${[n,n+1,n+2,n+3,n+4,n+5].join(', ')}. How many values are in [${n}, ${n+3})? The left boundary is included; the right is excluded.`,3,[`Include ${n}, ${n+1}, and ${n+2}.`,`Exclude ${n+3}; it belongs to the next interval.`,`Frequency = 3.`],'List the values meeting both boundary conditions.');
 if(v===2)return cc(`Which display best compares favorite sports for ${n+10} students?`,'Bar chart',['Bar chart','Histogram','Box plot'],'Favorite sport is categorical. A bar chart compares category counts.');
 return cq(`A frequency table lists ${n} students at 0 goals, ${n+2} at 1 goal, and 3 at 2 goals. How many students are represented?`,2*n+5,[`Add the frequencies, not the goal values.`,`${n}+${n+2}+3 = ${2*n+5} students.`],'Sum the number of students in every row.');
});
addCourseLesson('statistics','distribution-shapes','Describing distribution shapes','Look for symmetry, tails, clusters, and gaps.',[
 'Describe a distribution using shape, center, spread, and unusual features. A symmetric distribution has approximately matching left and right sides.',
 'A right-skewed distribution has a long tail toward larger values. A left-skewed distribution has a long tail toward smaller values. Name the direction of the tail, not where most observations lie.',
 'Clusters are groups of nearby values; gaps are intervals with no observations. A peak is a region of high frequency. Shape descriptions are approximate, especially for small samples.'
],['Inspect the overall pattern instead of one observation.','Locate any longer tail, clusters, or gaps.','Describe the shape with the variable and units when available.'],
 'A pile of small values with a few very large values is right-skewed, not left-skewed.',
 'Ask him to sketch the tail direction and explain why the mean might move toward that tail.',(v,n)=>{
 if(v===0)return cc(`Most wait times are ${n}–${n+3} minutes, with a few as high as ${n+30}. Which description fits?`,'Right-skewed',['Right-skewed','Left-skewed','Symmetric'],'The unusual large times extend the tail to the right.');
 if(v===1)return cc(`Most quiz scores are ${80+n}–100, with a few near ${20+n}. Which description fits?`,'Left-skewed',['Right-skewed','Left-skewed','Uniform'],'The unusual low scores extend the tail toward smaller values.');
 if(v===2)return cc(`Frequencies at values ${n}, ${n+1}, ${n+2}, ${n+3}, ${n+4} are 1, 3, 5, 3, 1. What is the shape?`,'Symmetric',['Symmetric','Right-skewed','Left-skewed'],'Frequencies mirror each other around the center value.');
 return cc(`Data occur near ${n}–${n+2} and ${n+10}–${n+12}, with none between. Which description is best?`,'Two clusters separated by a gap',['Two clusters separated by a gap','All values are equal','One uniform cluster'],'There are two groups of nearby observations and an empty interval between them.');
});
addCourseLesson('statistics','center','Mean and median','Find a typical value and explain what it represents.',[
 'The mean is the total divided by the number of observations. It is the amount each observation would have if the total were shared equally.',
 'The median is the middle of the sorted data. For an even number of observations, average the two middle values. Repeated values still count as separate observations.',
 'The mean is sensitive to extreme values; the median is more resistant. For strongly skewed data, the median often describes a typical observation more usefully.'
],['Count and sort the observations.','For the mean, divide the sum by the count; for the median, find the middle.','Interpret the result using the original units.'],
 'Sorting is essential for the median. For the mean, divide by the count, not the largest value.',
 'Ask him to explain mean as fair sharing and median as the middle person in an ordered line.',(v,n)=>{
 const a=[n,n+2,n+4,n+6];
 if(v===0)return cq(`Find the mean of ${a.join(', ')} minutes.`,n+3,[`Sum = ${4*n+12}; count = 4.`,`Mean = ${4*n+12}/4 = ${n+3} minutes.`],'Add all values, then divide by 4.');
 if(v===1)return cq(`Find the median of ${[n+8,n,n+4,n+2,n+6].join(', ')}.`,n+4,[`Sort: ${[n,n+2,n+4,n+6,n+8].join(', ')}.`,`The third of five observations is ${n+4}.`],'Sort first; there is one middle observation.');
 if(v===2)return cq(`Find the median of ${a.join(', ')}.`,n+3,[`There are four observations. The middle two are ${n+2} and ${n+4}.`,`Their average is (${n+2}+${n+4})/2 = ${n+3}.`],'Average the middle two values.');
 return cq(`Four values have mean ${n+5}. Three are ${n}, ${n+4}, ${n+6}. Find the missing value.`,n+10,[`The required total is 4×${n+5} = ${4*n+20}.`,`The known total is ${3*n+10}.`,`Subtract to find the missing value: ${n+10}.`],'Work backward from mean × count.');
});
addCourseLesson('statistics','spread','Range, quartiles, and IQR','Measure how spread out the middle half of the data is.',[
 'Range is maximum minus minimum. It uses just the extremes, so one unusual observation can change it substantially.',
 'Quartiles divide sorted data into sections. Q1 is the median of the lower half and Q3 the median of the upper half. Here, exclude the overall median when the count is odd; software conventions can differ.',
 'The interquartile range, IQR = Q3−Q1, measures the width of the middle 50% of observations. A box plot’s box extends from Q1 to Q3, with a line at the median.'
],['Sort all values.','Find the median of each half, using the stated convention.','Subtract Q1 from Q3 for IQR, or minimum from maximum for range.'],
 'IQR is not Q3+Q1 and is not the full range. Be consistent about the quartile convention.',
 'Ask Ethan to circle the lower and upper halves before finding their medians.',(v,n)=>{
 const a=[n,n+2,n+4,n+6,n+8,n+10,n+12,n+14];
 const ans=[n+3,n+11,8,14][v], what=['Q1','Q3','IQR','range'][v];
 return cq(`For ${a.join(', ')}, find the ${what}.`,ans,[`Lower half: ${a.slice(0,4).join(', ')}; Q1 = (${n+2}+${n+4})/2 = ${n+3}.`,`Upper half: ${a.slice(4).join(', ')}; Q3 = (${n+10}+${n+12})/2 = ${n+11}.`,v===2?'IQR = Q3−Q1 = 8.':v===3?`Range = ${n+14}−${n} = 14.`:`${what} = ${ans}.`],'Sort the data and find the middle of the appropriate half.');
});
addCourseLesson('statistics','standard-deviation','Understanding standard deviation','Describe distance from the mean in the data’s units.',[
 'Standard deviation measures variability around the mean. A small value means observations tend to be close to the mean; a larger value indicates greater spread.',
 'For a whole population, find the mean, square each deviation, average those squares, and take the square root. For a sample estimate, divide the squared-deviation sum by n−1 instead of n. Technology often offers both results; choose the one requested.',
 'Adding the same constant to every observation shifts the mean but leaves spread unchanged. Multiplying all values by a factor multiplies standard deviation by the absolute value of that factor.'
],['Identify whether the problem specifies population or sample standard deviation.','Find deviations from the mean and square them.','Use the correct divisor, then take the square root and retain the original units.'],
 'Averaging signed deviations always gives zero; that is why we use squared deviations. Standard deviation itself is not in squared units.',
 'Start by comparing which list is more spread out. Calculation should support that picture.',(v,n)=>{
 if(v===0)return cq(`Treat ${n}, ${n}, ${n+4}, ${n+4} as a whole population. Find its standard deviation.`,2,[`Mean = ${n+2}. Deviations: −2, −2, 2, 2.`,`Squared deviations sum to 16. Population variance = 16/4 = 4.`,`Square root of 4 = 2.`],'Find the population variance, then its square root.');
 if(v===1)return cq(`Every observation equals ${n+7}. What is the standard deviation?`,0,['The mean equals every observation.','Every deviation from the mean is zero, so standard deviation is zero.'],'There is no variation.');
 if(v===2)return cq(`A data set has standard deviation ${n+1}. Add 10 to every value. What is the new standard deviation?`,n+1,['Adding a constant shifts every observation and the mean together.','Distances from the mean stay unchanged.'],'A shift changes center, not spread.');
 return cq(`A data set has standard deviation ${n+1}. Multiply every value by 3. What is the new standard deviation?`,3*(n+1),['All distances from the mean become three times as large.',`New standard deviation = 3×${n+1} = ${3*(n+1)}.`],'Scaling changes the spread by the same absolute factor.');
});
addCourseLesson('statistics','outliers','Outliers and their effects','Use a rule to flag unusual values, then investigate.',[
 'An outlier is unusually far from the rest of the distribution. One common rule flags values below Q1−1.5×IQR or above Q3+1.5×IQR.',
 'The fences are thresholds, not necessarily observations. A value exactly on a fence is not flagged by this strict rule.',
 'Extreme values can shift the mean and increase spread. Investigate whether an unusual value is an error or a valid observation; do not remove it just to get a preferred result.'
],['Calculate IQR = Q3−Q1.','Compute both fences.','Compare observations with the fences and explain what should be checked.'],
 'A value being large does not automatically make it an outlier. Use the stated rule and context.',
 'Ask “Could this be a real result?” before discussing whether to exclude a value.',(v,n)=>{
 const q1=n+10,q3=n+18,lo=n-2,hi=n+30;
 if(v===0)return cq(`Q1=${q1} and Q3=${q3}. Find the upper 1.5×IQR fence.`,hi,[`IQR = ${q3}−${q1} = 8.`,`Upper fence = ${q3}+1.5×8 = ${hi}.`],'Add 1.5 times the IQR to Q3.');
 if(v===1)return cq(`Q1=${q1} and Q3=${q3}. Find the lower 1.5×IQR fence.`,lo,['IQR = 8.',`Lower fence = ${q1}−12 = ${lo}.`],'Subtract 1.5 times the IQR from Q1.');
 if(v===2)return cc(`The upper fence is ${hi}. Is a value exactly equal to ${hi} flagged as a high outlier by this rule?`,'No',['Yes','No'],'The rule flags values strictly above the upper fence, not equal to it.');
 return cc(`A recorded time of ${n+150} minutes is flagged as an outlier. What should you do first?`,'Check the record and its context',['Delete it automatically','Check the record and its context','Replace it with the mean'],'A valid unusual observation may contain important information; a recording error may need correction.');
});
addCourseLesson('statistics','compare-data','Comparing distributions','Compare center and spread together, in context.',[
 'A fair comparison uses the same variable, units, and compatible displays. If group sizes differ, relative frequencies can be more informative than counts.',
 'Compare centers to discuss typical values and spreads to discuss consistency. Two teams can have equal medians but very different IQRs.',
 'For roughly symmetric distributions without strong outliers, mean and standard deviation are useful. For skewed data or data with outliers, median and IQR are often better summaries. Summaries alone do not prove a cause.'
],['Check what was measured and whether units match.','Compare typical values using a suitable center.','Compare variability and describe both results in context.'],
 'A higher average is not always better: lower times can be preferable. Read the context before judging.',
 'Ask for two sentences: one about the typical outcome and one about consistency.',(v,n)=>{
 if(v===0)return cc(`Team A has median time ${20+n} seconds; Team B has ${23+n}. Which has the faster typical time?`,'Team A',['Team A','Team B'],'Lower time is faster; Team A has the lower median.');
 if(v===1)return cc(`Teams have equal median scores. Team A has IQR ${n+1}; Team B has IQR ${n+6}. Which has a more tightly grouped middle half?`,'Team A',['Team A','Team B'],'A smaller IQR means less spread in the middle half.');
 if(v===2)return cc(`A salary distribution for ${n+20} people is strongly right-skewed. Which pair is usually more suitable for center and spread?`,'Median and IQR',['Mean and standard deviation','Median and IQR'],'Median and IQR are less sensitive to extreme high salaries.');
 return cq(`Group A: ${n*2} of ${n*5} students walk to school. What percentage walk?`,40,[`Relative frequency = ${n*2}/${n*5} = 2/5.`,`Multiply by 100 to obtain 40%.`],'Divide the part by the whole, then multiply by 100.');
});
addCourseLesson('statistics','spreadsheet-tools','Using spreadsheets for statistics','Use formulas and check what the output means.',[
 'A spreadsheet stores observations in cells. A range such as A2:A9 includes every cell from A2 through A9. Keep a label in A1 and numeric observations below it.',
 'Common formulas include =AVERAGE(A2:A9), =MEDIAN(A2:A9), and =COUNT(A2:A9). STDEV.P uses the population convention and STDEV.S uses the sample convention. These names are supported in Excel and Google Sheets.',
 'Check the input range, missing values, and units before trusting a result. An accidental total row or text entry can change a calculation. A graph needs meaningful labels, units, and appropriate intervals.'
],['Enter one observation per cell with a clear column label.','Choose the statistic and the correct cell range.','Check with a small hand calculation and interpret the output.'],
 'A formula can be syntactically valid but still use the wrong cells or the wrong population/sample setting.',
 'Have Ethan predict whether the result should be small or large before using technology.',(v,n)=>{
 const end=n+5;
 if(v===0)return cc(`Which formula finds the mean of observations in A2 through A${end}?`,`=AVERAGE(A2:A${end})`,[`=AVERAGE(A2:A${end})`,`=SUM(A2:A${end})`,`=COUNT(A2:A${end})`],'AVERAGE divides the numeric total by the number of numeric observations in the range.');
 if(v===1)return cq(`All cells A2 through A${end} contain one numeric observation each. How many observations does COUNT return?`,end-1,[`Count endpoints inclusively: ${end}−2+1.`,`There are ${end-1} observations.`],'The first observation is in row 2, not row 1.');
 if(v===2)return cc(`Cells B2:B${end} contain an entire population. Which standard deviation function should you use?`,'STDEV.P',['STDEV.P','STDEV.S','SUM'],'STDEV.P uses division by n for a full population; STDEV.S uses n−1 for a sample estimate.');
 return cc(`A mean looks unexpectedly high. A${end+1} contains a total, and the formula includes it. What is the best fix?`,'Exclude the total row from the observation range',['Exclude the total row from the observation range','Delete the largest actual observation','Round the answer down'],'A total is not another observation; including it counts the data incorrectly.');
});
addCourseLesson('statistics','data-investigation','Plan a small data investigation','Turn a question into evidence and a careful conclusion.',[
 'Start with a statistical question, define the population, and decide exactly what to measure. Use consistent units and a clear procedure.',
 'Choose a sample that addresses the question without unnecessary selection bias. Voluntary responses may overrepresent people with strong opinions. Record observations consistently and check for errors.',
 'Display the data, summarize center and spread, and answer the question with limitations. An observational comparison can show an association; it does not by itself establish cause and effect.'
],['State the population, variable, and statistical question.','Plan fair sampling and consistent measurements.','Summarize the data and explain what the evidence can and cannot support.'],
 'A small convenient sample cannot automatically represent everyone, and an association is not proof of causation.',
 'Try a small soccer practice-time project together. Ask whose data are missing and whether that might change the conclusion.',(v,n)=>{
 const k=n+10;
 if(v===0)return cc(`You ask ${k} soccer teammates about screen time to estimate all students’ screen time. What is the main limitation?`,'Teammates may not represent all students',['Teammates may not represent all students','Screen time cannot be numerical','A mean is never allowed'],'Selecting only teammates may miss groups with different habits.');
 if(v===1)return cc(`For ${k} students, some commute times are recorded in seconds and some in minutes. What must happen before comparison?`,'Convert all times to the same unit',['Convert all times to the same unit','Add all numbers immediately','Remove every long commute'],'Different units are not directly comparable; conversion makes the numerical values meaningful.');
 if(v===2)return cc(`Among ${k} students, those who practice more have higher scores. Does this observational result prove practice caused the difference?`,'No',['Yes','No'],'Other differences could explain some or all of the association; observational evidence alone does not establish causation.');
 return cc(`You collect ${k} commute times. Which report is most useful?`,'A labeled display, center and spread, plus sampling limitations',['Only the largest time','A labeled display, center and spread, plus sampling limitations','A claim about every student with no caveat'],'A useful report describes the distribution and acknowledges how the data were collected.');
});

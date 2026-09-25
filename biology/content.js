'use strict';
const BIO_UNITS=[
 {id:'foundations',n:'Start here',title:'Think like a biologist',desc:'Ask good questions. Read evidence. Explain why.',color:'#eee2c9',visual:'experiment'},
 {id:'ecosystems',n:'Unit 1',title:'Relationships in ecosystems',desc:'Explore how living things depend on one another.',color:'#dce9d4',visual:'web'},
 {id:'energy',n:'Unit 2',title:'Matter & energy',desc:'Follow carbon, food, and energy through life.',color:'#f4e5b7',visual:'energy'},
 {id:'structure',n:'Unit 3',title:'Structure & function',desc:'From a single cell to a body in balance.',color:'#d5e8e8',visual:'cell'},
 {id:'inheritance',n:'Unit 4',title:'Inheritance & variation',desc:'Read the instructions of life—and how they change.',color:'#e4def1',visual:'dna'},
 {id:'evolution',n:'Unit 5',title:'Natural selection & evolution',desc:'Use evidence to explain change across generations.',color:'#f0ddd1',visual:'selection'}
];
const BIO_LESSONS=[];
// Question format: prompt, correct answer, two distractors, explanation.
function B(unit,id,title,goal,visual,ideas,terms,mistake,examples,honors,qs){BIO_LESSONS.push({unit,id,title,goal,visual,ideas,terms,mistake,examples,honors,qs:qs.map((q,i)=>({id:id+'-'+i,prompt:q[0],answer:q[1],choices:q.slice(1,4),explain:q[4]}))});}
B('foundations','investigations','Design a fair investigation','Identify variables and use a comparison to test an explanation.','experiment',[
 ['Start with a testable question','Biology studies living systems using evidence. A hypothesis proposes an explanation that can be tested. “Does light affect seedling growth?” can be investigated by measuring growth under defined conditions.'],
 ['Change one factor deliberately','The independent variable is the factor you change. The dependent variable is the outcome you measure. Keep other relevant conditions consistent so they do not provide alternative explanations. A comparison group establishes a useful baseline.'],
 ['Repeat and reason','Use multiple organisms or repeated independent trials, record the data, and consider uncertainty. A result supports or challenges an explanation; one investigation rarely proves an explanation for every possible situation.']
],[['Independent variable','Factor deliberately changed'],['Dependent variable','Outcome measured'],['Controlled variable','Relevant condition kept consistent'],['Hypothesis','Testable proposed explanation']],
 'The control group is a comparison group; a controlled variable is a condition you keep consistent. They are not the same thing.',[
 ['Test fertilizer on plants',['Use similar plants and randomly assign them to fertilizer and no-fertilizer groups.','Keep light, water, soil amount, and observation time comparable.','Measure the same growth outcome and compare groups, including variation.']],
 ['Spot a confounding factor',['One group receives fertilizer and more light; the other receives neither.','Either light or fertilizer could explain a growth difference.','Change only the fertilizer treatment and repeat the comparison.']]
],['A plant experiment uses one plant per treatment. Both grow differently. How would you improve the evidence?',['Increase the number of plants per treatment.','Use random assignment and consistent measurement.','Compare both the group averages and variability; do not generalize from one plant.']],[
 ['In an experiment changing hours of light, what is the independent variable?','Hours of light','Plant height measured','Number of leaves produced','The independent variable is the deliberately changed treatment.'],
 ['Which is a measurable dependent variable in a seedling experiment?','Height gained in centimeters','The investigator’s opinion','The name of the pot','Growth in centimeters provides a defined measurement.'],
 ['Why keep water the same in fertilizer groups?','To reduce an alternative explanation','To guarantee identical growth','To make fertilizer unnecessary','If water differs, it could help explain the result.'],
 ['Which conclusion is justified after one well-run experiment?','The evidence supports the hypothesis under these conditions','The hypothesis is permanently proven','All competing ideas are impossible','Scientific conclusions remain open to new evidence and other conditions.'],
 ['Which change improves reliability of a group comparison?','Use several randomly assigned plants per treatment','Choose only the tallest plant afterward','Change light and fertilizer together','Replication and random assignment reduce dependence on unusual individuals.']
]);
B('foundations','evidence','Read graphs and explain evidence','Separate observations, patterns, and biological explanations.','experiment',[
 ['Read before interpreting','Check the title, variables, units, axis scale, and any key. A line’s slope represents change in the vertical quantity per change in the horizontal quantity; a steep-looking line can be caused by the chosen scale.'],
 ['A pattern needs an explanation','An association means two measurements vary together. It does not by itself establish that one causes the other. Think about other factors, sample size, and how the data were collected.'],
 ['Use claim, evidence, reasoning','A claim answers the question. Evidence is a specific observation or numerical result. Reasoning explains why that evidence supports the claim using a biological mechanism. Include limits or exceptions when relevant.']
],[['Claim','Answer supported by the investigation'],['Evidence','Relevant observations or measurements'],['Reasoning','Biological link between evidence and claim'],['Correlation','Association between measured variables']],
 '“The graph goes up” describes a pattern but does not explain the biological cause.',[
 ['Use numbers in an explanation',['Suppose seedlings in the light gain 8 cm on average and those in darkness gain 2 cm in the same time.','Claim: light supports greater growth in this experiment.','Reasoning: light supplies energy for photosynthesis; also consider seed reserves and other controlled conditions.']],
 ['Avoid an unsupported cause',['Ice-cream sales and sunburns both rise in summer.','The association does not show that ice cream causes sunburn.','Greater sun exposure and warm weather are alternative explanations.']]
],['Two groups have different mean growth but highly variable individual results. What else would you want to see?',['Sample sizes and repeated trials.','The full distribution or a defined measure of uncertainty.','Evidence that relevant conditions and sampling were comparable.']],[
 ['Which is evidence rather than a claim?','Mean growth was 8 cm in light and 2 cm in darkness','Light always improves every plant','Plants prefer bright places','Measured numerical results are evidence.'],
 ['What should you read first on an unfamiliar graph?','Axis labels, units, and scale','Only the tallest point','Only the color of the line','Labels and scale determine what the marks mean.'],
 ['Two variables rise together. What does that alone demonstrate?','An association','A proven causal mechanism','A controlled experiment','Correlation alone does not establish causation.'],
 ['Which belongs in reasoning?','How photosynthesis connects light to biomass','Only a repeated claim','An unrelated personal opinion','Reasoning connects evidence to a biological mechanism.'],
 ['Why include sample size in a report?','It helps readers judge how much evidence was collected','It guarantees the result is correct','It replaces repeated measurements','Sample size is part of evaluating the strength and limits of evidence.']
]);
B('foundations','molecules','Molecules that make life work','Connect water, carbon-based molecules, and enzymes to cell processes.','enzyme',[
 ['Life is chemistry in water','Water is polar: its electrical charge is unevenly distributed. This helps it interact with ions and other polar substances. Its heat capacity helps moderate temperature changes in organisms and habitats.'],
 ['Build and use biological molecules','Carbohydrates supply fuel and structural material; lipids form membranes and store energy; proteins perform many structural and chemical roles; nucleic acids store or transmit genetic information. Organisms rearrange atoms from food and the environment to build their own molecules.'],
 ['Enzymes make reactions easier','An enzyme is a biological catalyst, usually a protein. It lowers activation energy without being used up by the reaction. Substrate shape and chemical interactions matter. Temperature and pH can affect enzyme shape and activity; not every enzyme has the same optimum.']
],[['Enzyme','Biological catalyst'],['Substrate','Reactant an enzyme acts on'],['Activation energy','Energy barrier to starting a reaction'],['Denaturation','Loss of a protein’s usual structure']],
 'Enzymes do not supply the reaction’s energy or change the overall energy difference between reactants and products.',[
 ['Identify a membrane component',['A cell needs a flexible barrier between watery environments.','Phospholipids have water-attracting heads and water-avoiding tails.','They arrange into a bilayer with tails inward and heads toward water.']],
 ['Explain an enzyme’s temperature curve',['Activity may rise as temperature increases over a limited range.','Above a suitable range, the enzyme may lose its shape.','Activity then falls because substrate binding and catalysis are disrupted.']]
],['Why can a very high temperature reduce enzyme activity even though particles move faster?',['Faster motion can initially increase collisions.','High heat can disrupt the enzyme’s structure.','Loss of the functional active site can outweigh the collision increase.']],[
 ['Which molecule class includes DNA?','Nucleic acids','Lipids','Carbohydrates','DNA is a nucleic acid that carries genetic information.'],
 ['What does an enzyme lower?','Activation energy','The number of atoms in a reaction','The need for reactants','Catalysts lower the energy barrier to reaction.'],
 ['What usually happens to an enzyme during the reaction it catalyzes?','It can be used again','It is converted entirely into product','It becomes genetic material','A catalyst is not consumed in the overall reaction.'],
 ['Which description fits phospholipids?','They help form cell membranes','They are always enzymes','They encode the genetic code','Phospholipids organize into membrane bilayers.'],
 ['Why can pH affect enzyme activity?','It can change interactions and the shape of the active site','It changes every atom into carbon','It always increases the reaction rate','Enzyme structure and chemical interactions depend on conditions such as pH.']
]);
B('ecosystems','interactions','Who depends on whom?','Describe levels of organization and ecological relationships.','web',[
 ['Zoom from an organism to an ecosystem','An organism is one living individual. A population includes members of one species in an area. A community includes interacting populations. An ecosystem includes that community and its nonliving environment.'],
 ['Resources connect organisms','Biotic factors involve living things; abiotic factors include light, water, temperature, and nutrients. Competition occurs when organisms use the same limited resource. Predation transfers matter and energy when one organism eats another.'],
 ['Relationships differ','In mutualism both partners benefit. In parasitism one benefits while the host is harmed. In commensalism one benefits without a clear effect on the other. Effects depend on context; avoid assigning a relationship from appearance alone.']
],[['Population','One species in a defined area'],['Community','Interacting populations'],['Abiotic','Nonliving environmental factor'],['Competition','Use of the same limited resource']],
 'An ecosystem includes nonliving conditions, not just a list of animals.',[
 ['Classify a pond',['One frog is an organism; all frogs of its species in the pond form a population.','Frogs, algae, insects, and fish together form part of the community.','Add water, light, temperature, and other nonliving conditions to describe the ecosystem.']],
 ['Predict a linked effect',['Grass supports rabbits; rabbits support foxes.','A fall in grass may limit rabbit food.','Foxes may then have less prey, though alternate foods and other factors can change the outcome.']]
],['Two species eat the same insect but live in different habitats. Must they strongly compete?',['Shared diet alone does not establish strong competition.','Consider whether the resource is limited and whether the species overlap in space and time.','Use observations or an experiment to test the interaction.']],[
 ['Which includes both living and nonliving components?','Ecosystem','Population','Organism','An ecosystem includes organisms and the physical environment.'],
 ['Which is abiotic?','Water temperature','A rabbit','An oak tree','Temperature is a nonliving environmental condition.'],
 ['Two plants require the same limited light. What interaction is likely?','Competition','Parasitism','Predation','They share a limited resource.'],
 ['A tick feeds on a mammal and harms it. Which relationship fits?','Parasitism','Mutualism','Commensalism','The parasite benefits at the host’s expense.'],
 ['A bee obtains food while pollinating a flower. Both benefit. Which relationship fits?','Mutualism','Competition','Predation','Both participants benefit in the described interaction.']
]);
B('ecosystems','populations','Population growth and limits','Explain why populations cannot grow without limits.','population',[
 ['Count entries and exits','Births and immigration add individuals; deaths and emigration remove them. A population’s net change depends on all four, not births alone.'],
 ['Resources set limits','With abundant resources, growth can be rapid. As food, space, or other resources become limiting, population growth may slow. Carrying capacity is the population an environment can sustain under given conditions; it can change.'],
 ['Models are simplifications','An exponential model assumes a constant per-capita growth rate. A logistic model adds a limiting capacity and produces an S-shaped curve under its assumptions. Real populations can fluctuate, overshoot, or be affected by disturbances.']
],[['Immigration','Movement into a population'],['Emigration','Movement out of a population'],['Carrying capacity','Sustainable population under given conditions'],['Limiting factor','Resource or condition constraining growth']],
 'Carrying capacity is not a fixed property of a species; changing the habitat can change it.',[
 ['Calculate a population change',['Start with 100 rabbits. Add 20 births and 5 immigrants.','Subtract 12 deaths and 3 emigrants.','The new population is 110: a net increase of 10.']],
 ['Interpret a leveling curve',['The model’s population initially grows quickly.','Growth slows as its size approaches the resource-supported limit.','The leveling pattern is consistent with limiting factors; the graph alone does not identify which resource limits growth.']]
],['A drought reduces plant growth. Predict how it could change herbivore carrying capacity and justify your prediction.',['Less vegetation can reduce food supply.','The habitat may support fewer herbivores.','The outcome depends on other food sources, movement, and the drought’s duration.']],[
 ['Which combination adds individuals?','Births and immigration','Deaths and emigration','Births and deaths only','Births and arrivals increase the count.'],
 ['A population has 50 individuals, 10 births, and 4 deaths, with no movement. What is its new size?','56','64','46','50 + 10 − 4 = 56.'],
 ['Why may growth slow near carrying capacity?','Resources per individual become more limiting','Every organism stops reproducing forever','Energy becomes unlimited','Limited resources constrain survival or reproduction.'],
 ['Can carrying capacity change after habitat loss?','Yes, resource availability can change','No, it is genetically fixed','Only if every individual dies','The environment’s support capacity depends on available habitat and resources.'],
 ['What should a logistic model’s curve be treated as?','A simplified prediction under assumptions','An exact rule for every population','Proof of a particular limiting resource','Models help reasoning but do not capture every real-world influence.']
]);
B('ecosystems','biodiversity','Biodiversity and ecosystem change','Explain resilience without assuming ecosystems stay unchanged.','biodiversity',[
 ['Diversity has several levels','Biodiversity includes variation within species, the variety of species, and the variety of ecosystems. Genetic diversity can help a population respond to changing conditions.'],
 ['Disturbance changes relationships','A storm, fire, disease, or habitat change can alter populations and resources. Ecological succession describes changes in community composition over time. Recovery pathways depend on what survives and on later conditions.'],
 ['Resilience is a capacity, not a guarantee','Resilience is the ability to absorb disturbance and recover or reorganize while maintaining important functions. Multiple species with overlapping roles may support stability, but severe or repeated disturbance can cause major shifts.']
],[['Biodiversity','Variety at genetic, species, and ecosystem levels'],['Disturbance','Event that alters ecological conditions'],['Succession','Community change over time'],['Resilience','Capacity to absorb and respond to disturbance']],
 'Succession does not always end in one permanent, unchanging community.',[
 ['Compare two crop fields',['One field contains genetically similar plants; another contains several resistant varieties.','A disease may affect the varieties differently.','Genetic diversity can reduce the risk that all plants are equally vulnerable.']],
 ['Reason after a fire',['If soil and some organisms remain, recovery starts with those resources.','If no soil remains, building suitable conditions may take much longer.','Identify starting conditions before predicting the recovery pathway.']]
],['A restored wetland has many species but polluted inflow. Is species count alone enough to call it healthy?',['Consider water quality and ecosystem functions.','Measure population trends and interactions, not just a species total.','Evaluate the persistence of the pollution and the wetland’s recovery.']],[
 ['Which is an example of genetic diversity?','Different inherited variants within a species','Only the total number of habitats','The temperature of a pond','Genetic diversity concerns inherited variation among individuals.'],
 ['What is succession?','Change in community composition over time','A guaranteed return to identical conditions','An individual changing its genes on purpose','Succession is ecological change in a community over time.'],
 ['Why can overlapping food sources support resilience?','Consumers may use alternatives if one source declines','They eliminate all competition','They prevent every disturbance','Alternative pathways can buffer some changes.'],
 ['Which statement about biodiversity is sound?','It can support resilience but does not guarantee immunity to disturbance','It makes every ecosystem permanent','It is only the number of large animals','Benefits depend on roles, conditions, and disturbance severity.'],
 ['After disturbance, why examine whether soil remains?','It affects the starting conditions for recovery','It determines the future with absolute certainty','Soil has no role in communities','Soil can retain nutrients, seeds, and organisms that affect recovery.']
]);
B('ecosystems','human-impacts','Human impacts and conservation','Evaluate a solution using evidence and trade-offs.','impact',[
 ['Follow a chain of effects','Land conversion, pollution, overharvesting, introduced species, and climate change can alter ecosystems. Trace how the action changes resources or interactions rather than merely labeling it harmful.'],
 ['A local example: nutrient runoff','Extra nitrogen or phosphorus can support algal growth. When organic material is decomposed, microbes use oxygen; low dissolved oxygen can harm aquatic organisms. The exact response depends on conditions and nutrient limits.'],
 ['Evaluate proposed solutions','Define a goal, measurable criteria, and constraints such as cost or land availability. Compare likely benefits and unintended effects. Monitor results and revise the plan rather than assuming installation guarantees success.']
],[['Runoff','Water carrying material across land'],['Eutrophication','Nutrient enrichment that can drive excess production'],['Conservation','Protection and management of biodiversity and resources'],['Constraint','Limit on a possible solution']],
 'Algae do not simply “use all the oxygen” in every bloom; decomposition and nighttime respiration are important parts of oxygen loss.',[
 ['Explain an oxygen decline',['Nutrients enter water and support more algal biomass.','After organisms die, decomposers break down the organic matter.','Their respiration consumes dissolved oxygen, potentially stressing fish.']],
 ['Compare a conservation design',['A vegetated buffer may reduce runoff before it reaches a stream.','Measure nutrient concentrations and oxygen before and after, with a suitable comparison.','Consider weather, land use, maintenance, and cost when judging the evidence.']]
],['A stream improves after a buffer is planted, but rainfall also decreases. How would you evaluate the claim that the buffer caused the improvement?',['Consider rainfall as an alternative influence.','Use repeated measurements and comparison sites if possible.','Connect the measured changes to a plausible runoff-reduction mechanism.']],[
 ['Which process can lower oxygen after a large algal bloom dies?','Microbial respiration during decomposition','DNA replication in rocks','A permanent end to all photosynthesis','Decomposers use oxygen while breaking down organic matter.'],
 ['Which is a useful conservation success measure?','A sustained improvement in measured habitat conditions','Only the date a project was announced','Only the number of posters printed','Outcomes should match the ecological goal.'],
 ['Why compare costs and benefits of a solution?','Real solutions have constraints and trade-offs','Every solution has identical effects','Cost alone measures biodiversity','Evaluation considers outcomes, feasibility, and unintended consequences.'],
 ['Why can habitat corridors help some species?','They can enable movement between habitat patches','They guarantee no predators','They remove all genetic variation','Connectivity can support movement and gene flow, depending on the species.'],
 ['Which conclusion is best supported by monitoring?','A measured trend with relevant limitations','A claim that one observation proves permanent success','A claim with no baseline','Repeated data and a clear comparison support a more defensible conclusion.']
]);
B('energy','photosynthesis','Photosynthesis: build with light','Trace the source of plant matter and chemical energy.','photosynthesis',[
 ['Capture and transform energy','Photosynthesis uses light energy to support the formation of sugars from carbon dioxide and water. Chloroplasts carry out photosynthesis in plants and algae. Energy is transformed, not created.'],
 ['Track atoms separately from energy','A useful summary is 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. The atoms are rearranged; light is energy, not matter. Much of a growing plant’s dry mass comes from carbon dioxide, with water and mineral nutrients also essential.'],
 ['Conditions limit the rate','Light intensity, carbon dioxide availability, temperature, and water can affect photosynthesis. Increasing one factor may stop increasing the rate when another factor becomes limiting.']
],[['Photosynthesis','Light-driven formation of sugars'],['Chloroplast','Photosynthetic organelle in plants and algae'],['Glucose','A sugar used as fuel and building material'],['Limiting factor','A condition that constrains the process']],
 'Plants do not get most of their dry mass by “eating soil.” Carbon from CO₂ becomes part of organic molecules.',[
 ['Follow a carbon atom',['CO₂ enters a leaf from the air.','Photosynthetic processes incorporate its carbon into organic molecules.','The plant can use that carbon to build cellulose and other material.']],
 ['Explain a light-response plateau',['At low light, extra light may raise the photosynthetic rate.','At a higher light level, CO₂ supply or another factor may limit the rate.','A plateau does not mean light has become matter or that the plant stops using energy.']]
],['A plant grows in soil whose mass changes little. Explain how the plant can gain dry mass.',['Carbon dioxide from the air supplies carbon.','Photosynthesis makes organic molecules using light energy.','Water and mineral nutrients also contribute; matter is conserved across the wider system.']],[
 ['Which supplies much of the carbon in plant biomass?','Carbon dioxide','Sunlight as matter','Oxygen gas alone','Carbon atoms in CO₂ are incorporated into organic molecules.'],
 ['What is light’s role in photosynthesis?','Energy input','Source of carbon atoms','Replacement for water molecules','Light supplies energy, not carbon atoms.'],
 ['Which organelle carries out photosynthesis in a leaf cell?','Chloroplast','Nucleus','Golgi apparatus','Chloroplasts contain the machinery for photosynthesis.'],
 ['What is released in the summary equation?','Oxygen','Nitrogen gas only','No products','The summary includes oxygen among the products.'],
 ['Why can a rate stop rising when light increases?','Another factor may be limiting','Atoms stop being conserved','Light becomes a nutrient atom','Multiple factors constrain biological rates.']
]);
B('energy','respiration','Cellular respiration: make ATP available','Connect food molecules, oxygen, and usable cellular energy.','energy',[
 ['Food contains chemical energy','Cellular respiration transfers energy from organic molecules to ATP and other forms, including heat. ATP helps couple energy-releasing processes to cellular work such as active transport and muscle contraction.'],
 ['Track the overall reaction','A summary of aerobic respiration is glucose + oxygen → carbon dioxide + water, with energy transferred to ATP and heat. Glycolysis occurs in the cytoplasm; in eukaryotes, later aerobic stages are associated with mitochondria.'],
 ['Plants respire too','Plant cells need ATP for work as animal cells do. Photosynthesis and respiration are connected but are different processes with different machinery. Fermentation regenerates NAD⁺ so glycolysis can continue when aerobic pathways are unavailable; it does not yield the same ATP return as complete aerobic respiration.']
],[['ATP','Molecule that transfers energy for cellular work'],['Respiration','Process that transfers energy from fuel molecules'],['Mitochondrion','Organelle involved in aerobic respiration'],['Fermentation','Pathway that permits glycolysis to continue without aerobic processing']],
 'Breathing exchanges gases with the environment. Cellular respiration is a set of chemical reactions inside cells.',[
 ['Connect soccer to cells',['Muscle cells use ATP during movement.','Respiration helps replenish ATP using fuel molecules.','The circulatory and respiratory systems help deliver oxygen and remove carbon dioxide.']],
 ['Explain plant activity at night',['A plant may stop photosynthesizing without light.','Its cells still carry out respiration using stored organic molecules.','Plants therefore do not simply stop all energy processing in darkness.']]
],['Why is “mitochondria create energy” inaccurate?',['Energy is conserved.','Chemical energy is transferred from fuels into ATP and heat.','Mitochondria participate in that transformation rather than creating energy from nothing.']],[
 ['What is a main function of ATP?','Transfer energy for cellular work','Store the entire genome','Replace all enzymes','ATP couples energy availability to cellular processes.'],
 ['Do plant cells carry out cellular respiration?','Yes','Only animal cells do','Only after all chloroplasts disappear','Plant cells need ATP for work and carry out respiration.'],
 ['Where does glycolysis occur?','Cytoplasm','Only inside the nucleus','Only outside the cell','Glycolysis occurs in the cytoplasm.'],
 ['Which gas is a product of aerobic respiration?','Carbon dioxide','Nitrogen only','Hydrogen only','Carbon from fuel molecules can be released as CO₂.'],
 ['What does fermentation help regenerate?','NAD⁺ for glycolysis','New sunlight','A new nucleus','Regenerating NAD⁺ permits glycolysis to continue.']
]);
B('energy','food-energy','Food webs and energy pyramids','Read arrows and estimate transfers between trophic levels.','web',[
 ['Read arrows as transfers','A food-web arrow points from a food source to the organism consuming it: grass → rabbit. Producers form organic molecules; consumers obtain them by eating; decomposers break down organic matter.'],
 ['Energy flows through systems','Organisms use much of the energy they obtain in metabolism, and energy is dispersed as heat. Only some becomes biomass available to the next trophic level. The often-used 10% transfer is a rough teaching approximation, not a universal constant.'],
 ['Matter and energy behave differently','Atoms can cycle between organisms and the environment. Energy flows through the system and becomes less available for biological work as it disperses. Decomposers recycle matter; they do not recycle all energy back into usable sunlight.']
],[['Producer','Organism that builds organic molecules from inorganic sources'],['Consumer','Organism that obtains food by consuming organisms or organic material'],['Trophic level','Feeding position in a food chain'],['Decomposer','Organism that breaks down organic material']],
 'An arrow does not usually point toward “what gets eaten.” In this guide it points from food to consumer.',[
 ['Use the 10% approximation',['Suppose producers store 10,000 energy units in biomass.','At a stated 10% transfer, primary consumers receive 1,000 units.','The next level receives about 100 units under the same assumption.']],
 ['Read a web without overclaiming',['A fox eats rabbits and mice.','If rabbits decline, mice could provide an alternate energy source.','The actual effect depends on mouse availability and other interactions.']]
],['Why are there usually fewer trophic levels than a chain with dozens of large predators would require?',['Only part of one level’s energy becomes biomass for the next.','Successive transfers leave less energy available.','Energy supply therefore constrains food-chain length and biomass.']],[
 ['In grass → rabbit, where does energy move?','From grass to rabbit','From rabbit to grass','From neither organism','The arrow shows a food-to-consumer transfer.'],
 ['At 10% transfer, 2,000 units become how many at the next level?','200','20','2,000','2,000 × 0.10 = 200.'],
 ['Is the 10% rule exact for all ecosystems?','No, transfer efficiencies vary','Yes, without exceptions','It refers only to atom loss','It is an approximation for practice calculations.'],
 ['What do decomposers return to environmental pools?','Matter such as nutrients','All energy as fresh sunlight','New atoms created from nothing','Decomposition returns matter while energy continues to disperse.'],
 ['Which statement distinguishes matter and energy?','Matter cycles; energy flows and disperses','Both are created by predators','Energy cycles perfectly without loss of availability','Atoms can be reused, while usable energy must continually enter many ecosystems.']
]);
B('energy','carbon-cycle','Carbon and matter cycling','Follow carbon through organisms, air, water, and long-term stores.','energy',[
 ['Identify reservoirs and transfers','Carbon is stored in the atmosphere, organisms, soils, oceans, rocks, and fossil fuels. Photosynthesis, respiration, decomposition, ocean exchange, and combustion transfer carbon among these reservoirs.'],
 ['Conserve atoms','Photosynthesis incorporates carbon into organic molecules; respiration and decomposition can return it to the environment. Combustion transfers stored carbon to gases such as CO₂. None of these processes destroys the carbon atoms.'],
 ['Rates and timescales matter','Some transfers occur quickly; others involve long-term geological storage. Burning fossil fuels moves carbon from long-term stores into the atmosphere rapidly relative to its formation. Systems change when inputs and outputs are out of balance.']
],[['Reservoir','A place where matter is stored'],['Flux','Rate of transfer between reservoirs'],['Combustion','Reaction that releases energy when fuel reacts with oxygen'],['Carbon cycle','Transfers of carbon through Earth systems']],
 'A carbon cycle diagram shows pathways, not a guarantee that every reservoir’s amount stays constant.',[
 ['Trace a carbon atom through a meal',['A plant incorporates carbon from atmospheric CO₂.','A person eats the plant or an organism that ate it.','Cellular respiration can return that carbon as CO₂.']],
 ['Explain a reservoir increase',['A reservoir gains 12 units of carbon and loses 8 during an interval.','Its net gain is 4 units.','Conservation still holds: other reservoirs account for the transfers.']]
],['How can atmospheric CO₂ increase even though carbon is conserved?',['Carbon can move into the atmosphere from other reservoirs.','If inputs exceed outputs, atmospheric storage increases.','Conservation concerns the whole defined system, not an unchanged amount in every part.']],[
 ['Which process moves atmospheric carbon into plant organic molecules?','Photosynthesis','Only breathing','Evaporation alone','Photosynthesis incorporates CO₂ carbon into organic material.'],
 ['What happens to carbon atoms during respiration?','They are rearranged and may enter CO₂','They disappear','They become pure energy','Chemical reactions rearrange atoms rather than converting them entirely to energy.'],
 ['A reservoir gains 9 units and loses 5. Its net change is?','+4','+14','−4','Inputs minus outputs equals 4.'],
 ['Why does fossil-fuel combustion affect atmospheric carbon?','It transfers carbon from long-term stores','It creates carbon atoms','It stops every natural cycle','Stored carbon is transferred into the atmosphere.'],
 ['Does a cycling element imply a constant amount in each reservoir?','No','Yes, always','Only if organisms are present','Transfer rates can change reservoir sizes.']
]);
B('structure','cells','Explore plant and animal cells','Connect cell structures to their functions.','cell',[
 ['Cells are organized living systems','All cells have a membrane, cytoplasm, genetic material, and ribosomes. Prokaryotic cells lack a membrane-bound nucleus; eukaryotic cells have a nucleus and membrane-bound organelles.'],
 ['Structure supports function','The membrane regulates exchange. Ribosomes build proteins. The nucleus houses most eukaryotic DNA. Mitochondria support aerobic respiration; endoplasmic reticulum and Golgi structures help make, modify, or transport cellular products.'],
 ['Compare without stereotypes','Plant and animal cells share many structures. A typical photosynthetic plant cell also has chloroplasts, a cellulose wall, and a large central vacuole. Not every plant cell contains chloroplasts—for example, many root cells do not.']
],[['Organelle','Specialized cell structure'],['Eukaryote','Organism with cells containing a nucleus'],['Prokaryote','Organism whose cells lack a membrane-bound nucleus'],['Ribosome','Structure that assembles proteins']],
 'Plant cells have mitochondria and perform respiration too.',[
 ['Choose a structure for a task',['A cell needs to build a protein.','Ribosomes join amino acids using information in mRNA.','Membranes and other organelles may help process and deliver the product.']],
 ['Identify a root cell carefully',['A plant root cell may have a wall and central vacuole.','It may lack chloroplasts because it is not photosynthesizing.','Absence of chloroplasts alone does not prove a cell is animal.']]
],['Why might a cell that secretes many proteins have abundant rough ER and Golgi structures?',['Ribosomes on rough ER make many secreted proteins.','ER and Golgi participate in processing and transport.','The amount and arrangement of structures relate to the cell’s work.']],[
 ['Which structure builds proteins?','Ribosome','Cell wall','Central vacuole','Ribosomes assemble amino acids into proteins.'],
 ['Which feature distinguishes eukaryotic from prokaryotic cells?','A membrane-bound nucleus','Any genetic material','Any ribosomes','Prokaryotes have DNA and ribosomes but no membrane-bound nucleus.'],
 ['Which structure occurs in both typical plant and animal cells?','Mitochondrion','Cellulose cell wall','Chloroplast','Both cell types perform cellular respiration.'],
 ['Must every plant cell have chloroplasts?','No','Yes','Only if it has a nucleus','Many nonphotosynthetic plant cells lack chloroplasts.'],
 ['What is a cell membrane’s major role?','Regulate exchange with the surroundings','Store all hereditary information by itself','Replace every enzyme','The membrane is a selectively permeable boundary.']
]);
B('structure','transport','Diffusion, osmosis, and active transport','Predict net movement across a selectively permeable membrane.','membrane',[
 ['Particles keep moving','Diffusion is net movement down a concentration gradient due to random molecular motion. At equilibrium particles still move, but there is no net concentration-driven flow in one direction.'],
 ['Osmosis is about water','Osmosis is net water movement across a selectively permeable membrane. In the simplified model here, solute cannot cross: water tends to move toward the side with the higher concentration of nonpenetrating solute. Pressure and other conditions can affect the final balance.'],
 ['Some transport requires energy','Facilitated diffusion uses membrane proteins but moves down a gradient without direct energy input from ATP. Active transport uses an energy source to move substances against a gradient or support other energy-requiring transport.']
],[['Diffusion','Net movement down a concentration gradient'],['Osmosis','Water movement across a selectively permeable membrane'],['Gradient','Difference across space'],['Active transport','Energy-dependent transport against a gradient']],
 'Equilibrium does not mean molecules stop moving. It means opposing movements balance on average.',[
 ['Predict water movement',['The outside has more nonpenetrating solute than the inside.','Water can cross, but that solute cannot.','Net water movement is outward; an animal cell may shrink.']],
 ['Distinguish two protein pathways',['A channel lets ions move down their electrochemical gradient.','A pump moves ions against that gradient using energy.','Both use proteins, but only the second is active transport in this comparison.']]
],['Why is “water moves toward more solute” incomplete unless the membrane’s permeability is specified?',['Some solutes can cross and redistribute.','Nonpenetrating solutes determine sustained osmotic differences in the simple model.','Pressure and the movement of other substances can also matter.']],[
 ['At diffusion equilibrium, what happens to particles?','They still move with no net flow','They stop all motion','They only move to one side','Random motion continues even when concentrations are balanced.'],
 ['In the simple model, water crosses toward which side?','Higher nonpenetrating-solute concentration','Lower nonpenetrating-solute concentration always','Whichever side has more organelles','Water tends toward the lower water potential associated here with more nonpenetrating solute.'],
 ['What characterizes active transport?','Energy input can drive movement against a gradient','It never uses proteins','It always stops at identical concentrations','Active transport couples energy to movement that is not simply downhill.'],
 ['Does facilitated diffusion necessarily require ATP?','No','Yes, always','Only for water','Facilitated diffusion uses proteins for downhill transport.'],
 ['An animal cell loses net water to its surroundings. What may happen?','It shrinks','It necessarily divides immediately','Its DNA disappears','Loss of water reduces cell volume.']
]);
B('structure','body-systems','Body systems working together','Explain how structure and coordination support a soccer sprint.','systems',[
 ['Build levels of organization','Specialized cells form tissues; tissues form organs; organs cooperate in organ systems. A structure’s shape, surface area, and connections affect what it can do.'],
 ['Exchange and deliver','In the lungs, thin exchange surfaces support diffusion of gases. The circulatory system transports oxygen, nutrients, and wastes. Digestive processes make nutrients available; kidneys help regulate water, ions, and wastes.'],
 ['Coordinate movement','Nervous signals and chemical messages coordinate responses. Muscle cells contract using ATP, with bones and joints supporting movement. A change in one system can affect others because the body is an interconnected system.']
],[['Tissue','Group of cells contributing to a shared function'],['Organ','Structure composed of multiple tissues'],['Organ system','Organs working together'],['Gas exchange','Movement of respiratory gases across a surface']],
 'No organ works in isolation. “The lungs give muscles energy” skips oxygen delivery and the chemical processes that replenish ATP.',[
 ['Explain a sprint',['Respiratory surfaces exchange gases; the circulation delivers oxygen to working tissues.','Muscle cells use fuel and cellular processes to replenish ATP.','Nervous signals coordinate contraction while several systems respond to increased demand.']],
 ['Connect thin structure with function',['Gas exchange occurs across a thin lung barrier.','A short diffusion distance supports rapid transfer.','A large surface area and blood flow also help maintain exchange.']]
],['Explain why increasing breathing rate alone cannot solve every limitation on oxygen delivery.',['Oxygen must cross exchange surfaces and be transported in blood.','Circulation and oxygen-carrying capacity can limit delivery.','Muscle cells must also use the delivered oxygen in metabolism.']],[
 ['Which sequence moves from smaller to larger organization?','Cell → tissue → organ → organ system','Organ → cell → tissue → organ system','Tissue → organ system → cell → organ','Cells contribute to tissues, which form organs and systems.'],
 ['Why are thin lung exchange surfaces useful?','They reduce diffusion distance','They create oxygen atoms','They remove the need for blood flow','Shorter distance supports gas diffusion.'],
 ['Which system transports oxygen to muscles?','Circulatory system','Skeletal system alone','Digestive system alone','Blood transports oxygen from exchange surfaces to tissues.'],
 ['Which directly powers much cellular work in contracting muscle?','ATP','DNA as a fuel','Sunlight entering the leg','ATP transfers energy for cellular processes including contraction.'],
 ['Why study organ systems together?','Their functions depend on interactions','They never influence one another','Every organ performs the same task','Body functions emerge from coordinated systems.']
]);
B('structure','homeostasis','Homeostasis and feedback','Explain how a response reduces a disturbance.','feedback',[
 ['Maintain a working range','Homeostasis maintains internal conditions within ranges compatible with life. It is dynamic regulation, not perfect constancy. Temperature, water balance, and other variables can change within limits.'],
 ['Trace negative feedback','A sensor detects a change, control processes coordinate a response, and effectors act. In negative feedback, the response reduces the original deviation. Sweating can promote heat loss when body temperature rises.'],
 ['Distinguish positive feedback','Positive feedback amplifies a change until another event stops the process, as in parts of childbirth. “Negative” and “positive” describe the direction of the loop’s effect, not whether the response is good or bad.']
],[['Homeostasis','Dynamic regulation of internal conditions'],['Sensor','Detects a change'],['Effector','Carries out a response'],['Negative feedback','Response that opposes a deviation']],
 'Sweating is not a guarantee of cooling: evaporation and environmental conditions affect heat loss.',[
 ['Trace a cooling response',['Body temperature rises during activity.','Control processes increase sweating and can increase blood flow near the skin.','Evaporating sweat transfers heat away, helping reduce the temperature rise.']],
 ['Identify a feedback sign',['A response makes the initial change smaller.','That is negative feedback.','If a response instead amplifies the initial change, it is positive feedback until some stopping event intervenes.']]
],['Why could high humidity reduce the effectiveness of sweating?',['Cooling depends on evaporation of sweat.','High humidity can reduce the evaporation rate.','Producing sweat and successfully losing heat are not identical outcomes.']],[
 ['What does homeostasis maintain?','A workable range of internal conditions','A body with no internal changes','The same temperature as every environment','Regulation allows variation while keeping conditions compatible with function.'],
 ['A response reduces the original disturbance. Which feedback is this?','Negative feedback','Positive feedback','No possible feedback','Negative feedback counteracts the deviation.'],
 ['What is an effector?','A component carrying out a response','A gene that never changes','Any external food source','Effectors perform the response coordinated by control processes.'],
 ['Why can sweating cool the body?','Evaporation transfers heat away','Sweat destroys heat atoms','Sweat prevents all metabolism','Evaporation takes energy and can remove heat from the body.'],
 ['Does “positive feedback” mean a beneficial response?','No, it means amplification','Yes, always beneficial','It means no response occurs','Feedback labels describe the effect on the initial change.']
]);
B('inheritance','dna','DNA, genes, and chromosomes','Connect the levels of genetic organization.','dna',[
 ['Read the molecule','DNA contains nucleotides with bases A, T, C, and G. In its double-stranded structure, A pairs with T and C pairs with G. The sequence carries information.'],
 ['Distinguish the levels','A chromosome is a long DNA molecule with associated proteins. A gene is a DNA region whose information contributes to a functional product, often a protein. Alleles are different versions of a gene.'],
 ['Copy before dividing','DNA replication uses each existing strand as a template for a complementary strand. Each resulting DNA double helix has one old and one new strand. Copying errors can occur despite proofreading and repair.']
],[['Nucleotide','Building block of DNA or RNA'],['Gene','DNA region contributing information for a functional product'],['Allele','Variant of a gene'],['Chromosome','Organized DNA molecule with associated proteins']],
 'A gene is not the same thing as a chromosome; a chromosome contains many DNA regions, including genes.',[
 ['Build a complementary strand',['Read the shown DNA sequence A T G C.','Match A with T, T with A, G with C, and C with G.','The paired bases opposite it are T A C G; real strands also have opposite directions.']],
 ['Explain copying',['Separate the two template strands.','Build a complementary new strand along each template.','The two resulting double helices each contain an original and a newly made strand.']]
],['Why can two cells contain nearly the same DNA but perform very different jobs?',['Different genes can be expressed at different levels.','Different proteins support different structures and functions.','Cell specialization generally does not require each cell type to discard all unused genes.']],[
 ['Which base pairs with A in DNA?','T','C','G','DNA base pairing matches A with T.'],
 ['Which base pairs with C in DNA?','G','A','T','DNA base pairing matches C with G.'],
 ['What is an allele?','A version of a gene','A whole ecosystem','An energy molecule','Alleles are gene variants.'],
 ['Which describes a chromosome?','A long DNA molecule with associated proteins','A single amino acid','A cell’s entire cytoplasm','Chromosomes organize DNA and associated proteins.'],
 ['After semiconservative replication, each double helix contains?','One old strand and one new strand','Only old strands','Only protein strands','Each original strand templates a new complementary strand.']
]);
B('inheritance','proteins','From DNA to protein','Follow transcription and translation without mixing them up.','dna',[
 ['Transcribe information','In a typical eukaryotic cell, transcription makes RNA from a DNA template in the nucleus. RNA uses U instead of T. Processing produces mRNA that can be exported to the cytoplasm.'],
 ['Translate a message','A ribosome reads mRNA in three-base codons. Transfer RNAs help deliver matching amino acids. The amino-acid sequence forms a polypeptide, which folds and may be modified into a functional protein.'],
 ['Connect sequence to function','Protein shape and interactions influence function. A DNA change may alter an RNA or protein product, but some changes leave the amino-acid sequence unchanged. Gene regulation also affects when and how much product is made.']
],[['Transcription','RNA synthesis from a DNA template'],['Translation','Polypeptide assembly using mRNA information'],['Codon','Three-base mRNA unit read in translation'],['Amino acid','Building block of a protein']],
 'The ribosome reads mRNA codons, not a DNA double helix taken out of the nucleus.',[
 ['Distinguish template and coding strands',['Suppose the DNA template is written 3′-TAC-5′.','Its complementary mRNA is 5′-AUG-3′.','AUG is a start codon in standard translation and specifies methionine.']],
 ['Trace a secreted protein',['DNA information is transcribed into RNA.','A ribosome translates the mRNA into a polypeptide.','Folding, processing, and transport help the product reach its functional location.']]
],['How could a DNA substitution leave a protein’s amino-acid sequence unchanged?',['Different codons can specify the same amino acid.','A change can produce a synonymous codon.','Changes outside translated regions may also leave the sequence unchanged, though some affect regulation.']],[
 ['Which process makes RNA from a DNA template?','Transcription','Translation','Osmosis','Transcription produces an RNA copy from a DNA template.'],
 ['Which structure reads mRNA to assemble a polypeptide?','Ribosome','Cell wall','Central vacuole','Ribosomes perform translation.'],
 ['Which base is used in RNA instead of T?','U','G','C','RNA uses uracil.'],
 ['How many bases make one mRNA codon?','3','2','4','The genetic code is read in three-base codons.'],
 ['Must every DNA substitution change an amino acid?','No','Yes','Only if the cell has mitochondria','The genetic code is redundant, and not all DNA is translated.']
]);
B('inheritance','mutations','Mutations and gene regulation','Explain how genetic changes can have different effects.','dna',[
 ['Mutations change sequence','A mutation is a change in genetic sequence. Substitutions, insertions, and deletions can affect genes differently. In a coding region, an insertion or deletion not divisible by three can shift the reading frame.'],
 ['Effects depend on context','A mutation may be harmful, neutral, or beneficial in a particular environment. It may change a protein, influence gene expression, or have little detectable effect. Mutations do not appear because organisms need a particular improvement.'],
 ['Inheritance depends on the cell','A mutation in a body cell can affect its descendants within that organism. A change in a lineage that produces gametes can be passed to offspring. Regulation changes gene activity without necessarily changing the underlying sequence.']
],[['Mutation','Change in genetic sequence'],['Substitution','Replacement of a nucleotide'],['Frameshift','Change in the reading frame'],['Gene expression','Use of information to produce a functional product']],
 'Not all mutations cause disease, and mutations in an ordinary skin cell are not normally inherited by children.',[
 ['Predict a reading-frame change',['mRNA is grouped into sets of three bases.','Adding one base early in a coding region changes the grouping downstream.','That can change many later codons, unlike adding exactly three bases within the reading frame.']],
 ['Separate mutation from regulation',['Two cells have the same gene sequence.','One expresses the gene strongly and the other scarcely at all.','Different activity can produce different cell functions without a sequence mutation.']]
],['Why can the same genetic variant be advantageous in one environment but not another?',['Its effect interacts with environmental conditions.','A trait can change survival or reproduction differently under different pressures.','“Beneficial” is contextual rather than a permanent label for every situation.']],[
 ['Which is a mutation?','A change in DNA sequence','Any temporary increase in breathing','Every change in diet','Mutation refers to sequence change.'],
 ['A one-base deletion in a coding region can cause?','A frameshift','Guaranteed improvement','Immediate chromosome doubling','A one-base deletion can change downstream codon grouping.'],
 ['Are all mutations harmful?','No','Yes','Only mutations in plants are harmless','Effects vary with location, consequence, and environment.'],
 ['Which mutation can potentially be transmitted through sexual reproduction?','One in a gamete-producing lineage','Only one in a dead skin cell','Only one in a red blood cell without a nucleus','Heritable changes must reach the offspring through reproductive cells.'],
 ['Two cells use the same gene at different levels. What differs?','Gene expression','Necessarily the genetic code','Necessarily their species','Regulation can change gene activity while sequence remains the same.']
]);
B('inheritance','mitosis','The cell cycle and mitosis','Explain growth, repair, and controlled cell division.','division',[
 ['Prepare before separating','During the cell cycle, a cell grows and copies its DNA before division. In mitosis, duplicated chromosomes are distributed into two nuclei. Cytokinesis divides the cytoplasm; these are related but distinct events.'],
 ['Maintain chromosome sets','Mitosis usually preserves chromosome number and produces genetically very similar daughter cells, aside from mutations. Sister chromatids are copied versions joined after replication until they separate.'],
 ['Regulate growth','Signals and checkpoints help coordinate division with cellular conditions. Disruption of growth controls can contribute to cancer. Cell differentiation involves patterns of gene expression that give cells specialized roles.']
],[['Cell cycle','Sequence of growth, DNA copying, and division'],['Mitosis','Division that separates duplicated chromosomes into nuclei'],['Cytokinesis','Division of cytoplasm'],['Sister chromatids','Copied versions of a chromosome']],
 'DNA copying occurs before mitosis, not as a result of the chromosomes pulling apart.',[
 ['Track chromosome number',['A model body cell begins with 4 chromosomes.','It copies its DNA; each chromosome now has two sister chromatids.','After normal mitosis and cytokinesis, each daughter cell has 4 chromosomes.']],
 ['Connect repair to division',['Damaged tissue may need replacement cells.','Appropriately controlled division supplies new cells.','Division without normal regulation can disrupt tissue organization.']]
],['Why must copying and separation both be accurate for normal daughter cells to function?',['Each daughter needs a suitable set of genetic instructions.','Replication errors can alter sequence.','Separation errors can give cells too many or too few chromosomes.']],[
 ['When is DNA copied relative to mitosis?','Before mitosis','Only after cytokinesis','Only during fertilization','DNA replication prepares duplicated chromosomes for mitotic separation.'],
 ['What does cytokinesis divide?','Cytoplasm','The genetic code into a new code','An ecosystem','Cytokinesis divides the cell’s cytoplasm.'],
 ['A cell with 6 chromosomes undergoes normal mitosis. How many does each daughter have?','6','3','12','Mitosis normally preserves the chromosome number.'],
 ['What are sister chromatids?','Copied versions of one chromosome','Always chromosomes from different parents','Two different species','They arise from replication of a chromosome.'],
 ['Why are cell-cycle checkpoints important?','They help regulate division','They guarantee no mutations ever occur','They replace DNA replication','Checkpoints coordinate progression with cellular conditions.']
]);
B('inheritance','meiosis','Meiosis and genetic variation','Explain how sexual reproduction changes chromosome combinations.','division',[
 ['Reduce the chromosome set','Meiosis begins after one round of DNA replication and includes two divisions. Homologous chromosomes separate in the first; sister chromatids separate in the second. The products are haploid in a typical diploid life cycle.'],
 ['Create new combinations','Crossing over exchanges DNA between homologous chromosomes. Independent assortment distributes homologous pairs in different combinations. Fertilization then combines gametes, adding another source of variation.'],
 ['Separate similarity from identity','Homologous chromosomes carry corresponding genes but can have different alleles. Sister chromatids originate as copies. Sexual reproduction rearranges inherited variants; mutations are the ultimate source of new alleles.']
],[['Haploid','One set of chromosomes'],['Diploid','Two sets of chromosomes'],['Homologous chromosomes','Corresponding chromosomes carrying the same kinds of genes'],['Crossing over','Exchange of DNA between homologous chromosomes']],
 'Homologous chromosomes are not necessarily identical; they may carry different alleles.',[
 ['Track a small model',['A diploid cell has 4 chromosomes, arranged as two homologous pairs.','After normal meiosis, haploid products have 2 chromosomes each.','Fertilization of two such gametes restores 4 chromosomes.']],
 ['Explain sibling differences',['Parents make gametes with different allele combinations.','Crossing over and independent assortment help generate the combinations.','Different gametes combine at fertilization, so siblings are not normally genetically identical.']]
],['Why does sexual reproduction require a reduction in chromosome sets before fertilization in this life cycle?',['Fertilization combines two gametes.','Haploid gametes restore the diploid set when joined.','Without reduction, chromosome-set number would increase each generation.']],[
 ['What separates in meiosis I?','Homologous chromosomes','Only identical cells','All amino acids','The first division separates homologous chromosome pairs.'],
 ['A diploid cell has 8 chromosomes. Its normal haploid products have?','4','8','16','Meiosis halves the chromosome-set number.'],
 ['Which process exchanges DNA between homologous chromosomes?','Crossing over','Osmosis','Translation','Crossing over creates new allele combinations along chromosomes.'],
 ['What restores the diploid number in this life cycle?','Fertilization','Diffusion','Photosynthesis','Joining haploid gametes restores two chromosome sets.'],
 ['What is the ultimate source of new alleles?','Mutation','Independent assortment alone','Fertilization alone','Recombination reshuffles variants; mutation produces new sequence variants.']
]);
B('inheritance','genetics','Punnett squares and inheritance','Use a simple model to predict probabilities, not guarantees.','punnett',[
 ['Define the model first','For this single-gene model, each diploid parent has two alleles and each gamete receives one. Genotype describes the allele combination; phenotype is the observable outcome. We use A as dominant over a in a complete-dominance example.'],
 ['Combine possible gametes','Place one parent’s gametes above the square and the other’s beside it. Each box combines one from each parent. For Aa × Aa, the four equally likely combinations are AA, Aa, Aa, and aa.'],
 ['Respect the model’s limits','Probability is not a promise that every four offspring include exactly one aa. Many traits involve multiple genes, environmental effects, incomplete dominance, codominance, or other complexities. Human traits such as eye color are not well modeled as a simple one-gene square.']
],[['Genotype','Allele combination'],['Phenotype','Observable characteristic influenced by genotype and environment'],['Dominant','Expressed in the heterozygote in this model'],['Heterozygous','Having two different alleles at a locus']],
 'Dominant does not mean stronger, more common, or better. It describes expression in a specified inheritance model.',[
 ['Solve Aa × Aa',['Each parent can contribute A or a.','The square gives AA, Aa, Aa, aa.','The probability of aa is 1/4; the dominant phenotype probability is 3/4 in this model.']],
 ['Solve Aa × aa',['The first parent produces A or a gametes; the second contributes only a.','Half the modeled combinations are Aa and half are aa.','Each offspring has a 50% probability of aa under these assumptions.']]
],['Why can four offspring from Aa × Aa all show the dominant phenotype?',['Each conception is a new probability event in this model.','A 3/4 probability does not force an exact ratio in a small sample.','Observed proportions tend to be more stable across larger samples, but are not guaranteed.']],[
 ['In Aa × Aa, what is the probability of aa?','25%','50%','75%','One of four equally likely combinations is aa.'],
 ['Which genotype is heterozygous?','Aa','AA','aa','Heterozygous means two different alleles.'],
 ['In Aa × aa, what is the probability of aa?','50%','25%','100%','Half the gamete combinations produce aa.'],
 ['Does dominant mean an allele is always more common?','No','Yes','Only in all animals','Dominance describes expression, not population frequency.'],
 ['What is a Punnett square’s result?','A probability model under stated assumptions','A guarantee for every small family','A complete model of every human trait','The model predicts probabilities and has limits.']
]);
B('evolution','evolution-evidence','Evidence for common ancestry','Combine fossils, anatomy, and DNA to infer relationships.','tree',[
 ['Use multiple evidence sources','Fossils document organisms from the past. Anatomical similarities, developmental patterns, geographic distributions, and molecular sequences provide additional evidence about evolutionary relationships.'],
 ['Distinguish ancestry from similar function','Homologous structures reflect shared ancestry even when functions differ. Similar functions can also evolve independently, producing analogous features. Sequence similarity can be informative, but comparisons should use appropriate genes and broader evidence.'],
 ['Read a branching tree','A node represents a common ancestor in the model. Relatedness depends on the most recent shared ancestor, not on which names appear closest on the page. Living species at tips are not “more evolved” than other living tips.']
],[['Common ancestor','Ancestral population shared by descendant lineages'],['Homologous','Similar because of shared ancestry'],['Fossil','Preserved evidence of past life'],['Phylogenetic tree','Model of evolutionary relationships']],
 'A tree is not a ladder of progress, and neighboring printed labels do not by themselves establish closest relationship.',[
 ['Read a simple tree',['Species B and C share a recent branching node.','Species A joins their lineage at an older node.','B and C are more closely related to each other in that model.']],
 ['Evaluate similar wings',['Bird and insect wings both support flight.','Their flight function alone does not show that the wings originated from the same ancestral wing structure.','Use structural details and other evidence to distinguish shared ancestry from convergent function.']]
],['Why is agreement among fossil, anatomical, and molecular evidence stronger than a single superficial similarity?',['Different evidence types test the relationship in different ways.','Superficial similarity may arise through convergence.','Converging independent evidence increases confidence while leaving room for revision.']],[
 ['What determines relatedness on a phylogenetic tree?','How recently lineages share an ancestor','The horizontal distance between names alone','Which label is printed highest','Branching relationships, not graphic spacing, encode ancestry.'],
 ['Which can provide evidence for common ancestry?','Corresponding DNA sequences and homologous structures','Only identical habitat','Only body size','Molecular and anatomical evidence can support shared ancestry.'],
 ['Are living tips on a tree ranked from primitive to advanced?','No','Yes','Only if the tree has colors','Evolutionary trees show branching relationships, not a universal progress ranking.'],
 ['What does a node represent in the model?','A common ancestor','An individual’s birthday','A guaranteed extinction','Branching nodes represent shared ancestral lineages.'],
 ['Similar function evolved independently is an example of?','Convergent evolution','Guaranteed identical ancestry for that feature','No evolutionary process','Similar selective conditions can favor similar functions independently.']
]);
B('evolution','natural-selection','Natural selection across generations','Connect heritable variation to differential reproductive success.','selection',[
 ['Start with existing variation','Individuals vary. Some variation is heritable, and some affects survival or reproduction in a given environment. Selection acts on that variation; organisms do not deliberately mutate to obtain the trait they need.'],
 ['Count reproductive contributions','If individuals with a heritable trait leave more surviving offspring on average, the associated variants can increase in frequency. Biological fitness concerns reproductive contribution in context, not simply strength or speed.'],
 ['Separate individuals and populations','Individuals develop and respond during life. Evolution is change in inherited characteristics of populations across generations. Selection is one mechanism; mutation, gene flow, and genetic drift also affect populations.']
],[['Natural selection','Differential reproduction associated with heritable variation'],['Fitness','Relative reproductive contribution'],['Adaptation','Heritable feature shaped by selection in a context'],['Allele frequency','Proportion of copies that are a particular allele']],
 'An organism does not acquire a useful inherited mutation merely because it needs one.',[
 ['Explain camouflage selection',['A population already includes light and dark beetles.','On dark ground, birds may more often detect light beetles.','If color is heritable, descendants of dark beetles can become a larger share over generations.']],
 ['Explain resistance carefully',['Some bacteria already carry variants that reduce susceptibility to an antibiotic.','Exposure can leave those bacteria with a reproductive advantage.','The population’s composition changes; the treatment does not teach each bacterium how to resist.']]
],['If camouflage improves survival but survivors do not reproduce, must the trait increase in the next generation?',['Survival alone is insufficient.','The trait must be heritable and associated with reproductive contribution.','Track descendants, not only the surviving adults.']],[
 ['What must be present for selection to change inherited traits?','Heritable variation linked to reproductive success','Every individual having identical traits','Organisms choosing needed mutations','Selection changes frequencies when heritable differences affect reproduction.'],
 ['What evolves across generations?','Populations','An individual choosing a new species','Only one isolated protein without reproduction','Evolution concerns inherited population change over generations.'],
 ['What does biological fitness refer to?','Reproductive contribution in a particular environment','Strength alone','Lifespan alone','Fitness measures contribution to subsequent generations in context.'],
 ['Why can antibiotic resistance become more common after exposure?','Resistant variants may leave more descendants','Every bacterium decides to become resistant','The antibiotic creates only useful mutations','Selection favors existing or newly arising resistant variants under those conditions.'],
 ['Is natural selection the only mechanism of evolution?','No','Yes','Only in plants','Drift, mutation, and gene flow also change populations.']
]);
B('evolution','speciation','Drift, isolation, and new species','Explain why populations can diverge by more than selection alone.','tree',[
 ['Chance can change frequencies','Genetic drift is random change in allele frequencies, especially influential in small populations. Bottlenecks and founder events can reduce diversity by sampling only part of an original population.'],
 ['Movement and isolation matter','Gene flow moves alleles between populations through reproduction after migration. Reduced gene flow can allow populations to diverge through selection, drift, and mutation. A geographic barrier alone does not instantly create a new species.'],
 ['Use species concepts carefully','For many sexually reproducing organisms, reproductive isolation helps explain speciation. It may arise through different mating times, behaviors, or incompatibilities. This concept has limits for fossils and asexual organisms. Extinction removes lineages and changes biodiversity.']
],[['Genetic drift','Random change in allele frequencies'],['Gene flow','Allele movement between populations'],['Reproductive isolation','Barriers to successful interbreeding'],['Speciation','Formation of distinct species lineages']],
 'A random allele-frequency change is not necessarily evidence that the allele improved survival.',[
 ['Recognize a founder effect',['A few individuals establish a new island population.','Their alleles are a sample of the original population’s variation.','The new frequencies can differ by chance, even before new selection acts.']],
 ['Explain divergence over time',['A barrier reduces interbreeding between populations.','Different pressures and chance changes accumulate across generations.','If reproductive barriers develop, distinct species lineages may result.']]
],['How could two populations in similar environments diverge even without different selection pressures?',['Random drift can change frequencies differently.','Mutations can arise in different lineages.','Reduced gene flow allows differences to persist; divergence is not guaranteed in every case.']],[
 ['Which mechanism changes frequencies by chance?','Genetic drift','Only natural selection','Transcription','Drift reflects random sampling across generations.'],
 ['Where is drift often strongest?','Small populations','Only the largest populations','Only populations without DNA','Sampling effects can be large when few individuals contribute.'],
 ['What is gene flow?','Movement of alleles between reproducing populations','Water crossing a membrane','Energy transfer in a food chain','Migration followed by reproduction can transfer alleles.'],
 ['Does a new geographic barrier immediately guarantee speciation?','No','Yes','Only when it is a river','Reproductive isolation and divergence may develop over time; a barrier alone is not proof.'],
 ['Why is reproductive isolation not a universal species test?','It is difficult to apply to fossils and asexual organisms','All species reproduce sexually','It measures only ATP','Different organisms and evidence require careful use of species concepts.']
]);
const BIO_QUESTIONS=BIO_LESSONS.flatMap(t=>t.qs.map(q=>({...q,lesson:t.id,unit:t.unit})));

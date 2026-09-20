const originalTopics = [
  {
    id: "equations",
    title: "Equations & Inequalities",
    bigPicture:
      "You use equations to uncover unknowns and inequalities to describe possible ranges. This is how decisions get made with limits.",
    realLife:
      "Budgeting for a gaming headset: if the headset costs $x and you can spend at most $90, then x <= 90.",
    studyPoints: [
      "An equation is balanced like a scale. Whatever you do to one side, do to the other.",
      "An inequality describes many answers, not just one.",
      "Number lines help you visualize valid solution ranges.",
    ],
    exercises: [
      {
        title: "Concert Ticket Budget",
        story: "Ethan wants a $32 concert ticket and snacks. He has $50 total.",
        prompt:
          "Write and solve: 32 + s <= 50. What is the maximum snack budget s?",
        answer: "18",
        hint: "Subtract the ticket price from 50.",
        solution:
          "32 + s <= 50 => s <= 18. Maximum snack budget is 18 dollars.",
      },
      {
        title: "Mystery Number",
        story: "A number doubled then increased by 6 gives 20.",
        prompt: "Solve 2x + 6 = 20. What is x?",
        answer: "7",
        hint: "Undo +6 first, then divide by 2.",
        solution: "2x + 6 = 20 => 2x = 14 => x = 7.",
      },
    ],
  },
  {
    id: "linear",
    title: "Linear Relationships",
    bigPicture:
      "Linear models show steady change. Slope tells how fast something changes each step.",
    realLife:
      "Taxi ride cost: base fee + price per kilometer is a classic straight-line model.",
    studyPoints: [
      "Slope is rise/run or rate of change.",
      "In y = mx + b, m is slope and b is starting value.",
      "Parallel lines have equal slopes.",
    ],
    exercises: [
      {
        title: "Streaming Plan",
        story: "A music app charges $5 base + $2 per premium feature pack.",
        prompt: "Write the equation for total cost y with x packs.",
        answer: "y=2x+5",
        hint: "Use y = mx + b with rate 2 and start 5.",
        solution: "Slope is 2 and intercept is 5, so y = 2x + 5.",
      },
      {
        title: "Bike Distance",
        story: "Ethan bikes 4 km every 30 minutes from home.",
        prompt: "If x is 30-minute blocks, write distance equation d.",
        answer: "d=4x",
        hint: "No start distance means intercept 0.",
        solution: "Rate is 4 km per block, starting at 0, so d = 4x.",
      },
    ],
  },
  {
    id: "systems",
    title: "Systems of Equations",
    bigPicture:
      "Systems help compare two conditions at once and find where they agree.",
    realLife:
      "Two mobile data plans with different fees and rates become equal at one usage point.",
    studyPoints: [
      "Solution is the point that satisfies both equations.",
      "Use substitution or elimination.",
      "Graphing shows intersection visually.",
    ],
    exercises: [
      {
        title: "Phone Plans",
        story: "Plan A: y = 20 + 3x. Plan B: y = 10 + 5x where x is GB used.",
        prompt: "At what x are costs equal?",
        answer: "5",
        hint: "Set the right sides equal.",
        solution:
          "20 + 3x = 10 + 5x => 10 = 2x => x = 5. Both plans cost the same at 5 GB.",
      },
      {
        title: "Snack Combo",
        story:
          "2 smoothies + 1 cookie cost $11, and 1 smoothie + 2 cookies cost $10.",
        prompt: "How much is one smoothie?",
        answer: "4",
        hint: "Let smoothie = s and cookie = c. Eliminate one variable.",
        solution:
          "2s + c = 11 and s + 2c = 10. Multiply second by 2: 2s + 4c = 20. Subtract first: 3c = 9 => c = 3. Then s + 2(3) = 10 => s = 4.",
      },
    ],
  },
  {
    id: "functions",
    title: "Functions",
    bigPicture:
      "Functions map each input to exactly one output, helping predict outcomes.",
    realLife:
      "Scoring systems in games convert your actions (input) into points (output).",
    studyPoints: [
      "A function gives one output for each input.",
      "Represent functions with equations, tables, or graphs.",
      "Domain is possible inputs; range is possible outputs.",
    ],
    exercises: [
      {
        title: "Game XP Function",
        story: "Each quest gives 15 XP and Ethan starts with 40 XP.",
        prompt: "Write f(q), where q is number of quests.",
        answer: "f(q)=15q+40",
        hint: "Rate is 15, start is 40.",
        solution: "f(q) = 15q + 40.",
      },
      {
        title: "Input-Output Check",
        story: "Function f(x) = 3x - 2.",
        prompt: "What is f(6)?",
        answer: "16",
        hint: "Substitute x = 6.",
        solution: "f(6) = 3(6) - 2 = 18 - 2 = 16.",
      },
    ],
  },
  {
    id: "exponents",
    title: "Exponents & Exponential Relationships",
    bigPicture:
      "Exponents model repeated multiplication, which explains rapid growth or decay.",
    realLife: "Savings with compound interest grow exponentially over time.",
    studyPoints: [
      "For a positive integer n, x^n means multiply x by itself n times.",
      "Exponential growth has a constant multiplier.",
      "Exponential decay shrinks by a constant factor.",
    ],
    exercises: [
      {
        title: "Savings Growth",
        story:
          "Ethan saves $100 at 10% annual growth for 2 years: A = 100(1.1)^2.",
        prompt: "What is A (rounded to nearest cent)?",
        answer: "121",
        hint: "1.1 squared is 1.21.",
        solution: "A = 100(1.1)^2 = 100(1.21) = 121.",
      },
      {
        title: "Video Views",
        story: "A channel doubles views each day starting at 50 views.",
        prompt: "Write formula V(d) for day d (day 0 is 50).",
        answer: "v(d)=50*2^d",
        hint: "Doubling means multiply by 2 each day.",
        solution: "V(d) = 50 * 2^d.",
      },
    ],
  },
  {
    id: "quadratics",
    title: "Quadratic Relationships",
    bigPicture:
      "Quadratics model curved paths, area changes, and max/min outcomes.",
    realLife: "A basketball shot arc can be approximated by a parabola.",
    studyPoints: [
      "Quadratics have x^2 terms and graph as parabolas.",
      "Factoring helps find roots where graph crosses x-axis.",
      "Vertex gives max/min value.",
    ],
    exercises: [
      {
        title: "Rectangle Garden",
        story: "Area model is A = x^2 + 7x + 12.",
        prompt: "Factor the expression.",
        answer: "(x+3)(x+4)",
        hint: "Find numbers that multiply to 12 and add to 7.",
        solution: "x^2 + 7x + 12 = (x + 3)(x + 4).",
      },
      {
        title: "Zero Points",
        story: "A path follows y = x^2 - 9.",
        prompt: "Find x when y = 0.",
        answer: "-3,3",
        hint: "Set x^2 - 9 = 0 and solve.",
        solution: "x^2 - 9 = 0 => (x - 3)(x + 3)=0 => x = -3 or 3.",
      },
    ],
  },
  {
    id: "statistics",
    title: "Statistics & Data",
    bigPicture:
      "Statistics helps you read patterns, compare groups, and make better decisions from data.",
    realLife:
      "Team performance analysis uses average, spread, and trend lines to improve strategy.",
    studyPoints: [
      "Center: mean, median, mode.",
      "Spread: range and variability matter, not just average.",
      "Relationships between variables can suggest trends.",
    ],
    exercises: [
      {
        title: "Practice Scores",
        story: "Ethan's quiz scores are 70, 80, 90, 100.",
        prompt: "Find the mean score.",
        answer: "85",
        hint: "Add and divide by 4.",
        solution: "(70 + 80 + 90 + 100) / 4 = 340 / 4 = 85.",
      },
      {
        title: "Comparing Consistency",
        story: "Team A scores: 10,10,10,10. Team B: 6,10,14,10.",
        prompt: "Which team is more consistent?",
        answer: "team a",
        hint: "Consistency means less spread.",
        solution: "Team A is more consistent because its spread is 0.",
      },
    ],
  },
];

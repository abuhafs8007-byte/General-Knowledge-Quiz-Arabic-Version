// Quiz Data
const quizData = {
    mathematics: {
        easy: [
            { q: "What is 7 + 5?", opts: ["10", "11", "12", "13"], ans: 2 },
            { q: "Which of these is a negative integer?", opts: ["5", "-3", "0", "2"], ans: 1 },
            { q: "What is 1/2 as a decimal?", opts: ["0.2", "0.25", "0.5", "0.75"], ans: 2 },
            { q: "Solve: 3 × 4", opts: ["7", "12", "9", "14"], ans: 1 },
            { q: "What is the perimeter of a square with side 5 cm?", opts: ["10 cm", "15 cm", "20 cm", "25 cm"], ans: 2 },
            { q: "How many degrees are in a right angle?", opts: ["45°", "90°", "180°", "360°"], ans: 1 },
            { q: "What is the area of a rectangle with length 6 and width 4?", opts: ["10", "20", "24", "26"], ans: 2 },
            { q: "What is 25% of 100?", opts: ["20", "25", "50", "75"], ans: 1 },
            { q: "Which number is a prime number?", opts: ["4", "6", "9", "7"], ans: 3 },
            { q: "What is the next number in the pattern: 2, 4, 6, ?", opts: ["7", "8", "10", "12"], ans: 1 },
            { q: "What is the mean of 2, 4, 6?", opts: ["3", "4", "5", "6"], ans: 1 },
            { q: "Solve: x + 3 = 7", opts: ["2", "3", "4", "5"], ans: 2 },
            { q: "What is 0.1 + 0.2?", opts: ["0.2", "0.3", "0.4", "0.5"], ans: 1 },
            { q: "How many sides does a triangle have?", opts: ["2", "3", "4", "5"], ans: 1 },
            { q: "What is the probability of getting heads when flipping a fair coin?", opts: ["0", "1/4", "1/2", "1"], ans: 2 },
            { q: "What is 9 squared?", opts: ["18", "27", "81", "72"], ans: 2 },
            { q: "Which coordinate represents the origin?", opts: ["(1,0)", "(0,1)", "(0,0)", "(1,1)"], ans: 2 },
            { q: "What is 3/4 as a percentage?", opts: ["50%", "75%", "25%", "100%"], ans: 1 },
            { q: "Simplify: 10 ÷ 2", opts: ["2", "3", "5", "8"], ans: 2 },
            { q: "How many faces does a cube have?", opts: ["4", "6", "8", "12"], ans: 1 }
        ],
        medium: [
            { q: "Solve: 2x = 14", opts: ["5", "6", "7", "8"], ans: 2 },
            { q: "What is the area of a circle with radius 7? (Use π = 22/7)", opts: ["144", "154", "164", "174"], ans: 1 },
            { q: "Simplify: 3/5 + 2/5", opts: ["1", "5/10", "6/10", "5/5"], ans: 3 },
            { q: "What is the volume of a cube with side 4 cm?", opts: ["16", "32", "64", "48"], ans: 2 },
            { q: "If sin 30° = ?", opts: ["1", "1/2", "√3/2", "0"], ans: 1 },
            { q: "Find the median of 3, 7, 9, 11, 15", opts: ["7", "9", "11", "10"], ans: 1 },
            { q: "Solve: 5x - 5 = 20", opts: ["4", "5", "6", "7"], ans: 1 },
            { q: "What is 15% of 200?", opts: ["25", "30", "35", "40"], ans: 1 },
            { q: "What is the slope of a horizontal line?", opts: ["0", "1", "Undefined", "-1"], ans: 0 },
            { q: "Find the perimeter of a circle with diameter 14 (π=22/7)", opts: ["22", "44", "88", "66"], ans: 1 },
            { q: "Solve inequality: x - 4 > 6", opts: ["x > 10", "x < 10", "x = 10", "x ≥ 10"], ans: 0 },
            { q: "What is the next term: 3, 9, 27, ?", opts: ["54", "72", "81", "90"], ans: 2 },
            { q: "If a die is rolled, what is the probability of getting 4?", opts: ["1/4", "1/3", "1/6", "1/2"], ans: 2 },
            { q: "Simplify: (x + 2)(x + 3)", opts: ["x² + 5x + 6", "x² + 6x + 5", "x² + 5x + 5", "x² + 6x + 6"], ans: 0 },
            { q: "What is the sum of interior angles of a triangle?", opts: ["90°", "180°", "270°", "360°"], ans: 1 },
            { q: "Convert 0.75 to fraction", opts: ["1/2", "2/3", "3/4", "4/5"], ans: 2 },
            { q: "Find the mean of 10, 20, 30, 40", opts: ["20", "25", "30", "35"], ans: 1 },
            { q: "Distance between (0,0) and (3,4)?", opts: ["5", "6", "7", "4"], ans: 0 },
            { q: "What is tan 45°?", opts: ["0", "1", "√3", "1/2"], ans: 1 },
            { q: "If 5 pens cost $10, what is cost of 1 pen?", opts: ["$1", "$2", "$3", "$4"], ans: 1 }
        ],
        hard: [
            { q: "Solve: 2x² - 8 = 0", opts: ["±2", "±4", "2", "4"], ans: 0 },
            { q: "What is the derivative of x²?", opts: ["x", "2x", "x²", "2"], ans: 1 },
            { q: "Find the volume of a cylinder with radius 3 and height 7 (π=22/7)", opts: ["198", "207", "189", "216"], ans: 0 },
            { q: "If cos θ = 1/2, θ equals?", opts: ["30°", "45°", "60°", "90°"], ans: 2 },
            { q: "Solve: log₁₀ 1000", opts: ["2", "3", "4", "10"], ans: 1 },
            { q: "What is the sum of first 10 natural numbers?", opts: ["45", "50", "55", "60"], ans: 2 },
            { q: "Equation of line with slope 2 and intercept 3?", opts: ["y=2x+3", "y=3x+2", "y=2x-3", "y=3x-2"], ans: 0 },
            { q: "Find standard deviation of 2,2,2,2", opts: ["0", "1", "2", "4"], ans: 0 },
            { q: "Area of sector with angle 90° and radius 14 (π=22/7)?", opts: ["154", "308", "616", "462"], ans: 0 },
            { q: "If A={1,2,3} and B={2,3,4}, A∩B equals?", opts: ["{1,4}", "{2,3}", "{1,2,3,4}", "{ }"], ans: 1 },
            { q: "Solve: 3x + 2y = 12 when x=2", opts: ["y=2", "y=3", "y=4", "y=5"], ans: 1 },
            { q: "Find nth term of sequence 2,5,8,11,...", opts: ["3n-1", "3n+2", "2n+1", "3n-2"], ans: 0 },
            { q: "Probability of getting two heads when tossing two coins?", opts: ["1/2", "1/3", "1/4", "1/8"], ans: 2 },
            { q: "What is 5! ?", opts: ["60", "100", "120", "720"], ans: 2 },
            { q: "Solve inequality: 2x + 3 ≤ 7", opts: ["x ≤ 2", "x ≥ 2", "x < 2", "x > 2"], ans: 0 },
            { q: "Distance formula is based on which theorem?", opts: ["Pythagoras", "Euclid", "Newton", "Archimedes"], ans: 0 },
            { q: "Find roots of x² - 5x + 6", opts: ["2 and 3", "1 and 6", "-2 and -3", "3 and 6"], ans: 0 },
            { q: "Surface area of cube with side 5?", opts: ["100", "125", "150", "200"], ans: 2 },
            { q: "Mean of grouped data is calculated using?", opts: ["Midpoint", "Median", "Mode", "Range"], ans: 0 },
            { q: "If tan θ = √3, θ equals?", opts: ["30°", "45°", "60°", "90°"], ans: 2 }
        ]
    },
    english: {
        easy: [
            { q: "Choose the correct past tense of 'go'.", opts: ["goed", "went", "gone", "going"], ans: 1 },
            { q: "Which word is a noun?", opts: ["run", "happy", "school", "quickly"], ans: 2 },
            { q: "Select the correct plural form of 'child'.", opts: ["childs", "children", "childes", "childrens"], ans: 1 },
            { q: "Which word is a synonym of 'big'?", opts: ["tiny", "large", "short", "thin"], ans: 1 },
            { q: "Choose the correct sentence.", opts: ["She have a book.", "She has a book.", "She having a book.", "She hads a book."], ans: 1 },
            { q: "Which punctuation ends a question?", opts: [".", "!", ",", "?"], ans: 3 },
            { q: "Identify the adjective in the sentence: 'The red car is fast.'", opts: ["car", "red", "is", "fast"], ans: 1 },
            { q: "Which word is an antonym of 'happy'?", opts: ["sad", "glad", "joyful", "smile"], ans: 0 },
            { q: "Choose the correct homophone: 'I want to ___ to the market.'", opts: ["go", "no", "know", "now"], ans: 0 },
            { q: "What is the main idea of a paragraph?", opts: ["A small detail", "The title", "The central point", "The last sentence"], ans: 2 },
            { q: "Which sentence is in present continuous tense?", opts: ["She eats rice.", "She is eating rice.", "She ate rice.", "She will eat rice."], ans: 1 },
            { q: "Select the correct spelling.", opts: ["becouse", "because", "becaus", "becoze"], ans: 1 },
            { q: "Which word is a verb?", opts: ["dance", "blue", "table", "slow"], ans: 0 },
            { q: "Choose the correct capitalization.", opts: ["monday", "Monday", "mONday", "MONDAY"], ans: 1 },
            { q: "What is a sentence?", opts: ["A group of random words", "A single word", "A complete thought", "A question only"], ans: 2 },
            { q: "Which is an example of an idiom?", opts: ["Break the ice", "Cold water", "Hot sun", "Blue sky"], ans: 0 },
            { q: "Choose the correct article: '___ apple is red.'", opts: ["A", "An", "The", "No article"], ans: 1 },
            { q: "Which word shows action?", opts: ["jump", "red", "soft", "quiet"], ans: 0 },
            { q: "What is the opposite of 'before'?", opts: ["after", "during", "while", "since"], ans: 0 },
            { q: "Choose the correct sentence structure.", opts: ["Running fast the boy.", "The boy running fast.", "The boy is running fast.", "Boy the fast running."], ans: 2 }
        ],
        medium: [
            { q: "Identify the subject in: 'The teacher explained the lesson.'", opts: ["teacher", "explained", "lesson", "the"], ans: 0 },
            { q: "Choose the correct form: 'If I ___ rich, I would travel.'", opts: ["am", "was", "were", "be"], ans: 2 },
            { q: "Which word is a synonym of 'difficult'?", opts: ["easy", "hard", "simple", "clear"], ans: 1 },
            { q: "Select the correct sentence.", opts: ["They was late.", "They were late.", "They is late.", "They be late."], ans: 1 },
            { q: "What is the purpose of a topic sentence?", opts: ["To end a story", "To state the main idea", "To ask a question", "To give examples only"], ans: 1 },
            { q: "Choose the correct punctuation: 'Wow___ that is amazing!'", opts: [".", ",", "!", "?"], ans: 2 },
            { q: "Identify the adverb in: 'She sings beautifully.'", opts: ["She", "sings", "beautifully", "song"], ans: 2 },
            { q: "Which sentence uses future tense?", opts: ["He plays football.", "He played football.", "He will play football.", "He is playing football."], ans: 2 },
            { q: "What literary device compares two things using 'like' or 'as'?", opts: ["Metaphor", "Simile", "Alliteration", "Hyperbole"], ans: 1 },
            { q: "Choose the correct homophone: 'Their house is over ___.'", opts: ["there", "their", "they're", "thier"], ans: 0 },
            { q: "What is the climax in a story?", opts: ["Beginning", "Most exciting point", "Ending", "Title"], ans: 1 },
            { q: "Select the correct plural: 'analysis'", opts: ["analysises", "analysis", "analyses", "analys"], ans: 2 },
            { q: "Which sentence is grammatically correct?", opts: ["Each of the boys have a pen.", "Each of the boys has a pen.", "Each of the boys have pens.", "Each boys has a pen."], ans: 1 },
            { q: "What is an antonym for 'ancient'?", opts: ["old", "modern", "historic", "past"], ans: 1 },
            { q: "Choose the correct indirect speech: He said, 'I am tired.'", opts: ["He said he is tired.", "He said he was tired.", "He says he was tired.", "He said I was tired."], ans: 1 },
            { q: "Identify the conjunction in: 'I stayed home because it rained.'", opts: ["stayed", "home", "because", "rained"], ans: 2 },
            { q: "Which word is spelled correctly?", opts: ["seperate", "separate", "seperete", "seperat"], ans: 1 },
            { q: "What is the tone of a text?", opts: ["Length", "Writer's attitude", "Number of words", "Font size"], ans: 1 },
            { q: "Choose the correct prefix meaning 'not':", opts: ["un-", "re-", "pre-", "mis-"], ans: 0 },
            { q: "Which sentence contains a metaphor?", opts: ["He runs like a cheetah.", "He is a cheetah on the field.", "He runs very fast.", "He runs daily."], ans: 1 }
        ],
        hard: [
            { q: "Identify the gerund in: 'Swimming is good exercise.'", opts: ["Swimming", "is", "good", "exercise"], ans: 0 },
            { q: "Choose the correct form: 'Neither of the answers ___ correct.'", opts: ["are", "were", "is", "be"], ans: 2 },
            { q: "What is dramatic irony?", opts: ["When the character knows more than the audience", "When the audience knows more than the character", "When events repeat", "When a story is funny"], ans: 1 },
            { q: "Select the correct parallel structure.", opts: ["She likes reading, to swim, and biking.", "She likes reading, swimming, and biking.", "She likes to read, swimming, and biking.", "She likes reading, swim, and to bike."], ans: 1 },
            { q: "Which sentence uses the subjunctive mood?", opts: ["I was there.", "If I were you, I would apologize.", "She is happy.", "They went home."], ans: 1 },
            { q: "What is the function of a thesis statement?", opts: ["To summarize the essay", "To introduce characters", "To state the main argument", "To give examples only"], ans: 2 },
            { q: "Identify the oxymoron.", opts: ["Deafening silence", "Bright sun", "Cold ice", "Dark night"], ans: 0 },
            { q: "Choose the correct usage.", opts: ["Whom is calling?", "Who is calling?", "Who are calling?", "Whose is calling?"], ans: 1 },
            { q: "What is an example of alliteration?", opts: ["Peter Piper picked peppers.", "The sun is bright.", "She sings softly.", "It is raining."], ans: 0 },
            { q: "Select the correct sentence.", opts: ["Hardly had he arrived when the show started.", "Hardly he had arrived when the show started.", "He hardly had arrived when the show started.", "Had hardly he arrived when the show started."], ans: 0 },
            { q: "Which word is an abstract noun?", opts: ["Freedom", "Chair", "Dog", "Bottle"], ans: 0 },
            { q: "Choose the correct reported speech: She said, 'I will come.'", opts: ["She said she will come.", "She said she would come.", "She says she would come.", "She said I would come."], ans: 1 },
            { q: "Identify the infinitive phrase.", opts: ["to win the race", "winning the race", "won the race", "wins the race"], ans: 0 },
            { q: "What is the effect of imagery in poetry?", opts: ["To confuse readers", "To create vivid pictures", "To shorten the poem", "To add dialogue"], ans: 1 },
            { q: "Choose the correct sentence with proper punctuation.", opts: ["Its a beautiful day.", "It's a beautiful day.", "Its' a beautiful day.", "Its a beautiful day!"], ans: 1 },
            { q: "Which literary device gives human qualities to objects?", opts: ["Personification", "Hyperbole", "Irony", "Allusion"], ans: 0 },
            { q: "Select the correct conditional sentence.", opts: ["If she studies, she would pass.", "If she studied, she would pass.", "If she studies, she would passed.", "If she study, she would pass."], ans: 1 },
            { q: "What is the meaning of the idiom 'spill the beans'?", opts: ["Cook food", "Reveal a secret", "Make a mess", "Plant seeds"], ans: 1 },
            { q: "Identify the appositive in: 'My brother, a doctor, lives abroad.'", opts: ["My brother", "a doctor", "lives abroad", "abroad"], ans: 1 },
            { q: "Choose the correct sentence with subject-verb agreement.", opts: ["The list of items are on the desk.", "The list of items is on the desk.", "The list of items were on the desk.", "The list of items be on the desk."], ans: 1 }
        ]
    },
    basic_Science: {
        easy: [
            { q: "Which of these is a chemical element?", opts: ["Water", "Oxygen", "Salt", "Sugar"], ans: 1 },
            { q: "The symbol for Sodium is?", opts: ["S", "So", "Na", "N"], ans: 2 },
            { q: "Which of these is a compound?", opts: ["Iron", "Oxygen", "Water", "Gold"], ans: 2 },
            { q: "What is formed when two or more elements combine chemically?", opts: ["Mixture", "Compound", "Solution", "Gas"], ans: 1 },
            { q: "Which activity can cause land pollution?", opts: ["Planting trees", "Recycling", "Dumping refuse", "Cleaning"], ans: 2 },
            { q: "Dirty water from factories causes?", opts: ["Air pollution", "Water pollution", "Noise pollution", "Soil formation"], ans: 1 },
            { q: "Which of these is an element found in air?", opts: ["Nitrogen", "Salt", "Sugar", "Water"], ans: 0 },
            { q: "Noise pollution can damage the?", opts: ["Eyes", "Skin", "Ears", "Nose"], ans: 2 },
            { q: "Which of these is a source of noise pollution?", opts: ["Flowing river", "Birds singing", "Loud speakers", "Wind"], ans: 2 },
            { q: "STIs are mainly spread through?", opts: ["Food", "Air", "Sexual contact", "Water"], ans: 2 },
            { q: "What does STI stand for?", opts: ["Serious Tissue Infection", "Sexually Transmitted Infection", "Skin Treatment Illness", "Simple Transfer Infection"], ans: 1 },
            { q: "HIV attacks which part of the body?", opts: ["Bones", "Immune system", "Skin", "Muscles"], ans: 1 },
            { q: "Which of these can prevent HIV?", opts: ["Sharing needles", "Unsafe sex", "safe sexual activity", "Touching"], ans: 2 },
            { q: "AIDS is caused by?", opts: ["Bacteria", "Virus", "Fungus", "Dust"], ans: 1 },
            { q: "Which form of energy is used when you run?", opts: ["Heat energy", "Sound energy", "Chemical energy", "Light energy"], ans: 2 },
            { q: "The sun gives us which type of energy?", opts: ["Light energy", "Sound energy", "Nuclear waste", "Wind energy"], ans: 0 },
            { q: "Which of these is NOT a form of energy?", opts: ["Heat", "Light", "Air", "Sound"], ans: 2 },
            { q: "Energy that moves objects is called?", opts: ["Stored energy", "Kinetic energy", "Heat energy", "Light energy"], ans: 1 },
            { q: "Air is made up of mainly?", opts: ["Oxygen only", "Nitrogen only", "Nitrogen and oxygen", "Carbon only"], ans: 2 },
            { q: "Which gas in air is needed for breathing?", opts: ["Carbon dioxide", "Nitrogen", "Oxygen", "Helium"], ans: 2 },
            { q: "Which of these pollutes air the most?", opts: ["Trees", "Smoke", "Water", "Sand"], ans: 1 },
            { q: "Burning tyres releases?", opts: ["Clean air", "Fresh oxygen", "Harmful gases", "Water vapour"], ans: 2 },
            { q: "Which of these is NOT an element symbol?", opts: ["H", "O", "CO2", "N"], ans: 2 },
            { q: "Which is an example of land pollution?", opts: ["Oil spill", "Throwing plastics on ground", "Car smoke", "Loud music"], ans: 1 },
            { q: "Which disease is an STI?", opts: ["Malaria", "HIV", "Typhoid", "Cholera"], ans: 1 },
            { q: "Air pollution can cause?", opts: ["Good health", "Breathing problems", "Strong bones", "Clear vision"], ans: 1 },
            { q: "Which gas do plants use from air?", opts: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], ans: 1 },
            { q: "Which is a safe way to reduce pollution?", opts: ["Burning waste", "Dumping in rivers", "Recycling", "Using more plastic"], ans: 2 },
            { q: "Continuous loud music is an example of?", opts: ["Water pollution", "Noise pollution", "Land pollution", "Air pollution"], ans: 1 },
            { q: "What happens when noise is too loud?", opts: ["Improves hearing", "Causes deafness", "Improves sleep", "Cools body"], ans: 1 },
            { q: "Which of these is correctly matched with its symbol?", opts: ["Calcium - Ca", "Carbon - Co", "Chlorine - Clr", "Copper - Cp"], ans: 0 },
            { q: "Which substance is formed when hydrogen combines with oxygen?", opts: ["Salt", "Water", "Air", "Iron"], ans: 1 },
            { q: "Which of these is NOT a compound?", opts: ["Water", "Carbon dioxide", "Oxygen", "Salt"], ans: 2 },
            { q: "Pouring dirty engine oil on the ground leads to?", opts: ["Air pollution", "Water pollution", "Land pollution", "Noise pollution"], ans: 2 },
            { q: "Which situation best shows water pollution?", opts: ["Clean rain falling", "Throwing plastics in river", "Boiling water", "Using tap water"], ans: 1 }
        ],

        medium: [
            { q: "Where does digestion begins?", opts: ["Stomach", "Mouth", "Small intestine", "Large intestine"], ans: 1 },
            { q: "Which is an abiotic factor?", opts: ["Animals", "Plants", "Sunlight", "Bacteria"], ans: 2 },
            { q: "Humans are classified as mammals because they?", opts: ["Lay eggs", "Have hair and feed young with milk", "Live in water", "Have wings"], ans: 1 },
            { q: "Urine is stored in the?", opts: ["Ureter", "Bladder", "Kidney", "Urethra"], ans: 1 },
            { q: "Which waste is removed by lungs?", opts: ["Urea", "Carbon dioxide", "Salt", "Water"], ans: 1 },
            { q: "Sweat mainly removes which substance?", opts: ["Oxygen", "Salt", "Glucose", "Protein"], ans: 1 },
            { q: "Growth means increase in what?", opts: ["Age only", "Size and mass", "Color", "Shape only"], ans: 1 },
            { q: "Which stage comes after infancy?", opts: ["Old age", "Adolescence", "Childhood", "Adulthood"], ans: 2 },
            { q: "A place where an organism lives is called?", opts: ["Community", "Habitat", "Ecosystem", "Adaptation"], ans: 1 },
            { q: "Fish have gills mainly for?", opts: ["Walking", "Breathing", "Seeing", "Smelling"], ans: 1 },
            { q: "Which is a desert adaptation?", opts: ["Broad leaves", "Thick fur", "Water storage", "Webbed feet"], ans: 2 },
            { q: "All living and non-living things interacting with one another form?", opts: ["Habitat", "Ecosystem", "Population", "Species"], ans: 1 },
            { q: "Plants are called producers because they?", opts: ["Eat animals", "Make their food", "Drink water", "Move around"], ans: 1 },
            { q: "Humans are called higher animals because they?", opts: ["Have tails", "Can reason", "Lay eggs", "Have wings"], ans: 1 },
            { q: "Which organ controls thinking in humans?", opts: ["Heart", "Brain", "Liver", "Kidney"], ans: 1 },
            { q: "Rusting mainly affects which material?", opts: ["Wood", "Plastic", "Iron", "Glass"], ans: 2 },
            { q: "What is needed for rusting?", opts: ["Sunlight only", "Water only", "Air and water", "Heat only"], ans: 2 },
            { q: "Which method prevents rusting?", opts: ["Washing", "Painting", "Drying", "Cutting"], ans: 1 },
            { q: "Growth in humans stops at which stage?", opts: ["Childhood", "Adolescence", "Adulthood", "Infancy"], ans: 2 },
            { q: "Which disease can abstinence prevent?", opts: ["Malaria", "HIV", "Typhoid", "Cholera"], ans: 1 },
            { q: "An organism living on another organism is called?", opts: ["Producer", "Parasite", "Predator", "Herbivore"], ans: 1 },
            { q: "Which part stores urine?", opts: ["Kidney", "Bladder", "Ureter", "Liver"], ans: 1 },
            { q: "Which factor affects growth most?", opts: ["Noise", "Nutrition", "Color", "Height of house"], ans: 1 },
            { q: "A frog living in water and land shows?", opts: ["Habitat change", "Adaptation", "Migration", "Extinction"], ans: 1 },
            { q: "Which is a consumer in ecosystem?", opts: ["Grass", "Algae", "Goat", "Tree"], ans: 2 },
            { q: "Which system removes liquid waste?", opts: ["Digestive", "Respiratory", "Excretory", "Circulatory"], ans: 2 },
            { q: "Which part breaks food physically?", opts: ["Teeth", "Tongue", "Liver", "Kidney"], ans: 0 },
            { q: "Which gas causes rusting?", opts: ["Nitrogen", "Oxygen", "Carbon dioxide", "Hydrogen"], ans: 1 },
            { q: "Adolescence is a period of?", opts: ["No growth", "Rapid changes", "Sleeping only", "Old age"], ans: 1 },
            { q: "Which organ helps remove excess water and salt?", opts: ["Skin", "Brain", "Heart", "Bone"], ans: 0 }, { q: "Which organ removes excess water and salts from the body as urine?", opts: ["Liver", "Kidney", "Lung", "Pancreas"], ans: 1 },
            { q: "Which of these best describes growth in living things?", opts: ["Increase in size only", "Increase in number of cells", "Movement only", "Digestion only"], ans: 1 },
            { q: "Which of the following is a component of an ecosystem?", opts: ["Rocks only", "Living and non-living things interacting", "Animals only", "Plants only"], ans: 1 },
            { q: "Humans are called higher animals mainly because they can:", opts: ["Breathe underwater", "Think and reason", "Fly", "Hibernate"], ans: 1 },
            { q: "Rusting of iron is caused by the presence of:", opts: ["Heat only", "Oxygen and water", "Light only", "Carbon dioxide only"], ans: 1 }
        ],

        hard: [{ q: "Which trait is most likely inherited from parents?", opts: ["Tattoo", "Eye color", "Scar", "Language"], ans: 1 }, { q: "Why do siblings look different despite same parents?", opts: ["Same genes", "Different gene combinations", "Same DNA", "No inheritance"], ans: 1 }, { q: "Which is a dominant trait?", opts: ["Hidden trait", "Trait always expressed", "Weak gene", "Environmental trait"], ans: 1 }, { q: "In the activity series, which metal is most reactive?", opts: ["Gold", "Copper", "Potassium", "Silver"], ans: 2 }, { q: "Recessive traits appear only when:", opts: ["Both genes are dominant", "One gene is present", "Both genes are recessive", "No gene is present"], ans: 2 }, { q: "Which metal cannot displace copper from its compound?", opts: ["Zinc", "Iron", "Silver", "Magnesium"], ans: 2 }, { q: "Acids turn blue litmus paper to:", opts: ["Green", "Red", "Yellow", "Black"], ans: 1 }, { q: "Which substance is a base?", opts: ["HCl", "NaOH", "H2SO4", "CO2"], ans: 1 }, { q: "Bases feel:", opts: ["Rough", "Slippery", "Dry", "Hard"], ans: 1 }, { q: "A salt is formed when:", opts: ["Acid reacts with metal", "Acid reacts with base", "Base reacts with water", "Metal reacts with air"], ans: 1 }, { q: "Which is a neutral substance?", opts: ["Vinegar", "Water", "Lime juice", "Soap"], ans: 1 }, { q: "Which device uses electrical energy to produce motion?", opts: ["Heater", "Motor", "Bulb", "Battery"], ans: 1 }, { q: "Electrical energy is produced mainly from:", opts: ["Wind only", "Water only", "Energy conversion", "Light only"], ans: 2 }, { q: "Which device converts electrical energy to heat?", opts: ["Fan", "Bulb", "Electric iron", "Generator"], ans: 2 }, { q: "Which material is a good conductor of electricity?", opts: ["Plastic", "Rubber", "Copper", "Wood"], ans: 2 }, { q: "A material that does not allow current to pass is called:", opts: ["Conductor", "Insulator", "Resistor", "Generator"], ans: 1 }, { q: "Which of these is an insulator?", opts: ["Aluminium", "Iron", "Glass", "Gold"], ans: 2 }, { q: "Radioactivity involves the release of:", opts: ["Light only", "Heat only", "Radiation from nucleus", "Sound waves"], ans: 2 }, { q: "Which element is radioactive?", opts: ["Oxygen", "Uranium", "Iron", "Carbon"], ans: 1 }, { q: "Exposure to radiation can cause:", opts: ["Stronger bones", "Cell damage", "Better vision", "Faster growth"], ans: 1 }, { q: "Ozone layer protects us from:", opts: ["Infrared rays", "Ultraviolet rays", "X-rays", "Gamma rays"], ans: 1 }, { q: "Which gas mainly depletes ozone layer?", opts: ["Oxygen", "Nitrogen", "CFCs", "Hydrogen"], ans: 2 }, { q: "A result of ozone depletion is:", opts: ["Less sunlight", "Skin cancer", "Cold weather", "More rain"], ans: 1 }, { q: "Which acid is found in car batteries?", opts: ["Nitric acid", "Sulfuric acid", "Hydrochloric acid", "Acetic acid"], ans: 1 }, { q: "Which base is used in soap making?", opts: ["NaOH", "HCl", "CO2", "H2"], ans: 0 }, { q: "Which metal reacts fastest with water?", opts: ["Calcium", "Sodium", "Iron", "Copper"], ans: 1 }, { q: "Which trait is NOT inherited?", opts: ["Blood group", "Height", "Tribal marks", "Skin color"], ans: 2 }, { q: "Electric current is the flow of:", opts: ["Protons", "Neutrons", "Electrons", "Ions only"], ans: 2 }, { q: "Which material is used to cover electric wires?", opts: ["Copper", "Silver", "Rubber", "Iron"], ans: 2 }, { q: "Burning of CFCs leads to:", opts: ["Ozone formation", "Ozone depletion", "Cloud formation", "Rainfall"], ans: 1 }, { q: "Which parent trait combination can produce a recessive trait in a child?", opts: ["One dominant and one recessive", "Two dominant", "Two recessive", "No genes"], ans: 2 }, { q: "In the activity series, a metal will displace another metal if it is:", opts: ["Less reactive", "More reactive", "Equal reactive", "Heavier"], ans: 1 }, { q: "Which type of radiation has the lowest penetrating power?", opts: ["Alpha", "Beta", "Gamma", "X-ray"], ans: 0 }, { q: "Which situation increases the risk of ozone layer depletion?", opts: ["Using natural fertilizers", "Release of CFC gases", "Planting trees", "Using solar panels"], ans: 1 }, { q: "Which of the following best describes a conductor?", opts: ["Material that blocks heat", "Material that allows electric current easily", "Material that stores electricity", "Material that produces light"], ans: 1 },

        {
            q: "The least reactive element in the activity series is ____",
            opts: ["Gold (Au)", "Potassium (K)", "Calcium (Ca)", "Zinc (Zn)"],
            ans: 0
        },
        {
            q: "The most reactive element in the activity series is ___",
            opts: ["Copper (Cu)", "Iron (Fe)", "Potassium (K)", "Silver (Ag)"],
            ans: 2
        },
        {
            q: "What is variation?",
            opts: [
                "The exact resemblance between parents and offspring",
                "Differences that exist among individuals of the same species",
                "Changes that occur only due to environmental pollution",
                "The inability of organisms to adapt to their environment"
            ],
            ans: 1
        },
        {
            q: "Which of the following best defines a gene?",
            opts: [
                "A unit of heredity made of DNA that controls specific traits",
                "A visible characteristic only found in adults",
                "A cell organelle responsible for respiration",
                "A chemical substance found only in plants"
            ],
            ans: 0
        },
        {
            q: "Which of the following is NOT true about family traits?",
            opts: [
                "They can be inherited from parents to offspring",
                "They are controlled by genes",
                "They are always identical in all siblings",
                "They can be influenced by both heredity and environment"
            ],
            ans: 2
        }
    ]
    },

    Basic_Technology: {
        easy: [
            { q: "Which tool is used to drive nails into wood?", opts: ["Hammer", "Spanner", "Saw", "Pliers"], ans: 0 },
            { q: "A wheel and axle is an example of what?", opts: ["Machine", "Engine", "Tool box", "Battery"], ans: 0 },
            { q: "Which energy source comes from the Sun?", opts: ["Coal", "Solar", "Petrol", "Diesel"], ans: 1 },
            { q: "What is used to tighten or loosen bolts?", opts: ["Screwdriver", "Spanner", "Chisel", "File"], ans: 1 },
            { q: "A simple electric circuit needs a battery, bulb, and what else?", opts: ["Water", "Wire", "Paper", "Sand"], ans: 1 },
            { q: "Which device is used to send emails?", opts: ["Radio", "Television", "Computer", "Fan"], ans: 2 },
            { q: "Which transport moves on rails?", opts: ["Car", "Bicycle", "Train", "Boat"], ans: 2 },
            { q: "What should you wear to protect your eyes in a workshop?", opts: ["Gloves", "Helmet", "Goggles", "Apron"], ans: 2 },
            { q: "Which of these is a renewable energy source?", opts: ["Coal", "Wind", "Petrol", "Gasoline"], ans: 1 },
            { q: "Which part of a computer shows images?", opts: ["Keyboard", "Mouse", "Monitor", "CPU case"], ans: 2 },
            { q: "A pulley helps to do what?", opts: ["Cut wood", "Lift heavy loads", "Measure length", "Store water"], ans: 1 },
            { q: "Which tool is used to cut wood?", opts: ["Saw", "Hammer", "Spade", "Brush"], ans: 0 },
            { q: "What powers a torchlight?", opts: ["Battery", "Water", "Oil", "Sand"], ans: 0 },
            { q: "Which office machine is used to print documents?", opts: ["Scanner", "Printer", "Router", "Projector"], ans: 1 },
            { q: "Which fuel is used in many cars?", opts: ["Coal", "Petrol", "Wood", "Paper"], ans: 1 },
            { q: "Which device is used for voice communication over distance?", opts: ["Telephone", "Hammer", "Fan", "Cupboard"], ans: 0 },
            { q: "A lever helps to?", opts: ["Increase force", "Produce light", "Store data", "Cool air"], ans: 0 },
            { q: "Which safety rule is correct in a workshop?", opts: ["Run around", "Play with tools", "Follow instructions", "Touch hot metal"], ans: 2 },
            { q: "Which part of a computer is used to type?", opts: ["Mouse", "Keyboard", "Speaker", "Camera"], ans: 1 },
            { q: "Which energy source is non-renewable?", opts: ["Solar", "Wind", "Coal", "Hydro"], ans: 2 }
        ],
        medium: [
            { q: "Which electronic component controls the flow of current?", opts: ["Resistor", "Bulb", "Switch", "Battery"], ans: 2 },
            { q: "What type of energy is stored in a battery?", opts: ["Mechanical", "Chemical", "Sound", "Heat"], ans: 1 },
            { q: "Which manufacturing process involves melting metal into molds?", opts: ["Casting", "Welding", "Filing", "Drilling"], ans: 0 },
            { q: "What is the function of a router in networking?", opts: ["Print documents", "Store files", "Connect networks", "Scan images"], ans: 2 },
            { q: "Which tool is used to measure electrical current?", opts: ["Thermometer", "Ammeter", "Barometer", "Speedometer"], ans: 1 },
            { q: "Which transportation system uses water routes?", opts: ["Air transport", "Road transport", "Rail transport", "Water transport"], ans: 3 },
            { q: "What does IT stand for?", opts: ["Information Technology", "Internet Tools", "Internal Transfer", "Input Terminal"], ans: 0 },
            { q: "Which device converts electrical energy to mechanical energy?", opts: ["Motor", "Battery", "Switch", "Wire"], ans: 0 },
            { q: "Which safety device protects against electric shock?", opts: ["Fuse", "Bulb", "Cable", "Socket"], ans: 0 },
            { q: "Which renewable source uses moving air?", opts: ["Hydro", "Solar", "Wind", "Coal"], ans: 2 },
            { q: "What is the purpose of lubrication in machines?", opts: ["Increase friction", "Reduce friction", "Produce heat", "Stop movement"], ans: 1 },
            { q: "Which tool is best for shaping metal surfaces?", opts: ["File", "Hammer", "Brush", "Rope"], ans: 0 },
            { q: "Which device stores digital data permanently?", opts: ["RAM", "Hard drive", "Monitor", "Keyboard"], ans: 1 },
            { q: "Which process joins metals using heat?", opts: ["Casting", "Welding", "Painting", "Polishing"], ans: 1 },
            { q: "Which communication technology uses satellites?", opts: ["Landline", "Satellite TV", "Post office", "Notice board"], ans: 1 },
            { q: "Which component provides power in a simple circuit?", opts: ["Switch", "Resistor", "Battery", "Wire"], ans: 2 },
            { q: "Which transport is fastest over long distances?", opts: ["Bicycle", "Ship", "Airplane", "Truck"], ans: 2 },
            { q: "Which office device converts paper documents into digital form?", opts: ["Printer", "Scanner", "Router", "Speaker"], ans: 1 },
            { q: "Which simple machine is found in a screwdriver?", opts: ["Pulley", "Wheel and axle", "Lever", "Inclined plane"], ans: 1 },
            { q: "Which non-renewable energy source is formed from dead plants and animals?", opts: ["Solar", "Wind", "Fossil fuel", "Hydro"], ans: 2 }
        ],
        hard: [
            { q: "Which law explains the relationship between voltage, current, and resistance?", opts: ["Newton’s Law", "Ohm’s Law", "Faraday’s Law", "Hooke’s Law"], ans: 1 },
            { q: "What is the main function of a transistor?", opts: ["Store data", "Amplify or switch signals", "Generate heat", "Measure voltage"], ans: 1 },
            { q: "Which manufacturing method removes material to shape a product?", opts: ["Casting", "Molding", "Machining", "Assembling"], ans: 2 },
            { q: "What type of energy conversion occurs in a generator?", opts: ["Electrical to chemical", "Mechanical to electrical", "Heat to sound", "Light to heat"], ans: 1 },
            { q: "Which network topology connects all devices to a central hub?", opts: ["Ring", "Bus", "Star", "Mesh"], ans: 2 },
            { q: "Which safety practice reduces fire risk in workshops?", opts: ["Overloading sockets", "Proper wiring", "Spilling fuel", "Blocking exits"], ans: 1 },
            { q: "Which device converts digital signals to analog for transmission?", opts: ["Router", "Modem", "Switch", "Scanner"], ans: 1 },
            { q: "What is the function of a fuse in a circuit?", opts: ["Increase voltage", "Store energy", "Protect against overload", "Amplify signal"], ans: 2 },
            { q: "Which renewable source uses flowing water to generate power?", opts: ["Solar", "Wind", "Hydroelectric", "Coal"], ans: 2 },
            { q: "Which component temporarily stores data while a computer is running?", opts: ["Hard drive", "RAM", "ROM", "Flash drive"], ans: 1 },
            { q: "Which transportation system relies on internal combustion engines?", opts: ["Electric train", "Sailboat", "Petrol car", "Bicycle"], ans: 2 },
            { q: "What is ergonomics concerned with?", opts: ["Machine speed", "Worker comfort and safety", "Fuel cost", "Color design only"], ans: 1 },
            { q: "Which process permanently joins materials without melting them?", opts: ["Welding", "Casting", "Adhesive bonding", "Drilling"], ans: 2 },
            { q: "Which unit measures electrical resistance?", opts: ["Volt", "Ampere", "Ohm", "Watt"], ans: 2 },
            { q: "Which device is essential for video conferencing?", opts: ["Webcam", "Hammer", "Drill", "Spanner"], ans: 0 },
            { q: "What type of software controls computer hardware?", opts: ["Application software", "System software", "Game software", "Utility only"], ans: 1 },
            { q: "Which energy resource is obtained from uranium?", opts: ["Solar", "Nuclear", "Wind", "Hydro"], ans: 1 },
            { q: "Which tool is most appropriate for measuring small electrical resistance accurately?", opts: ["Voltmeter", "Ammeter", "Ohmmeter", "Thermometer"], ans: 2 },
            { q: "Which modern communication technology uses fiber-optic cables?", opts: ["Telegraph", "Fiber internet", "Smoke signals", "Notice board"], ans: 1 },
            { q: "Which principle allows a lever to multiply force?", opts: ["Magnetism", "Mechanical advantage", "Friction", "Evaporation"], ans: 1 }
        ]
    },
    islamic_Studies: {
        easy: [
            { q: "What is the meaning of 'Ahad' in Sooratul Ikhlaas?", opts: ["One and only", "Most powerful", "Ever-living", "All-hearing"], ans: 0 },
            { q: "Which verse shows ALLAAH does not need anything?", opts: ["Qul huwa Allahu Ahad", "Allahu Samad", "Lam yalid", "Walam yakun lahu kufuwan ahad"], ans: 1 },
            { q: "How many verses are in Sooratul Ikhlaas?", opts: ["3", "4", "5", "6"], ans: 1 },
            { q: "What does 'As-Samad' mean?", opts: ["The Merciful", "The Self Sufficient", "The Creator", "The Judge"], ans: 1 },
            { q: "Which statement is correct about ALLAAH in Sooratul Ikhlaas?", opts: ["He has children", "He was born", "Nothing is like Him", "He rests"], ans: 2 },
            { q: "What is the main theme of Sooratul Ikhlaas?", opts: ["Stories of prophets", "Oneness of ALLAAH", "Prayer rules", "Charity"], ans: 1 },
            { q: "Who attacked the Ka'bah in the Year of the Elephant?", opts: ["Quraysh", "Romans", "Abraha", "Persians"], ans: 2 },
            { q: "What animals did Abraha use in his army?", opts: ["Horses", "Camels", "Elephants", "Lions"], ans: 2 },
            { q: "What destroyed Abraha’s army?", opts: ["Storm", "Fire", "Birds with stones", "Flood"], ans: 2 },
            { q: "What is the Arabic name for the Year of the Elephant?", opts: ["Aam al-Hijrah", "Aam ul-Fil", "Aam al-Nasr", "Aam al-Qamar"], ans: 1 },
            { q: "Why did Abraha want to destroy the Ka'bah?", opts: ["For gold", "To stop pilgrimage to Makkah", "To build houses", "For trade"], ans: 1 },
            { q: "Which bird is mentioned in Surah Al-Fil?", opts: ["Hudhud", "Abaabeel", "Ankabut", "Naml"], ans: 1 },
            { q: "What were the stones made of?", opts: ["Gold", "Clay", "Iron", "Sand"], ans: 1 },
            { q: "Who is the compiler of Hadith collections?", opts: ["Sahabah only", "Scholars like Bukhari", "Kings", "Traders"], ans: 1 },
            { q: "What does Hadith refer to?", opts: ["Qur'an verses", "Sayings and actions of the Prophet", "Stories of kings", "Poems"], ans: 1 },
            { q: "Which of these is a famous Hadith collector?", opts: ["Umar", "Bukhari", "Bilal", "Ali"], ans: 1 },
            { q: "Why were Hadith collected?", opts: ["For stories", "To preserve Sunnah", "For trade", "For war"], ans: 1 },
            { q: "What is Sunnah?", opts: ["Only speech", "Only actions", "Way of the Prophet", "Books"], ans: 2 },
            { q: "Where was the Prophet (SAW) born?", opts: ["Madinah", "Taif", "Makkah", "Yemen"], ans: 2 },
            { q: "In which year was the Prophet (SAW) born?", opts: ["Year of Hijrah", "Year of Elephant", "Year of Victory", "Year of Famine"], ans: 1 },
            { q: "Who was the mother of the Prophet (SAW)?", opts: ["Aminah", "Khadijah", "Aisha", "Fatimah"], ans: 0 },
            { q: "Who was the father of the Prophet (SAW)?", opts: ["Abu Talib", "Abdullah", "Abbas", "Hamzah"], ans: 1 },
            { q: "Who took care of the Prophet after his grandfather died?", opts: ["Abu Bakr", "Umar", "Abu Talib", "Ali"], ans: 2 },
            { q: "What was the nickname of the Prophet in his youth?", opts: ["Al-Ameen", "Al-Farooq", "Al-Athary", "Al-Hakeem"], ans: 0 },
            { q: "What job did the Prophet (SAW) do in his youth?", opts: ["Farmer", "Shepherd", "Soldier", "King"], ans: 1 },
            { q: "Who did the Prophet marry first?", opts: ["Aisha", "Hafsa", "Khadijah", "Zainab"], ans: 2 },
            { q: "What was special about Khadijah (RA)?", opts: ["She was poor", "She was a trader", "She was young only", "She was a slave"], ans: 1 },
            { q: "How old was the Prophet when he married Khadijah?", opts: ["20", "25", "30", "40"], ans: 1 },
            { q: "How old was Khadijah when she married the Prophet?", opts: ["25", "30", "35", "40"], ans: 3 },
            { q: "What quality made Khadijah trust the Prophet?", opts: ["Strength", "Wealth", "Honesty", "Anger"], ans: 2 },
            { q: "What does 'Lam yalid' mean?", opts: ["He was born", "He gives birth", "He did not give birth", "He eats"], ans: 2 },
            { q: "What does 'Walam yulad' mean?", opts: ["He is strong", "He was not born", "He is kind", "He sees"], ans: 1 },
            { q: "What lesson is learnt from Year of Elephant?", opts: ["Trust ALLAAH’s protection", "Fear animals", "Build houses", "Travel more"], ans: 0 },
            { q: "Which city did Abraha come from?", opts: ["Egypt", "Abyssinia", "Iraq", "Syria"], ans: 1 },
            { q: "What is the Ka'bah used for?", opts: ["Trading", "Worship of ALLAAH", "Farming", "Storage"], ans: 1 },
            { q: "Who first supported the Prophet after marriage?", opts: ["Ali", "Abu Talib", "Khadijah", "Umar"], ans: 2 },
            { q: "What type of man was the Prophet before Prophethood?", opts: ["Dishonest", "Trustworthy", "Lazy", "Harsh"], ans: 1 },
            { q: "What does Hadith help Muslims understand?", opts: ["Science only", "Sunnah and Islam", "Trade rules", "Languages"], ans: 1 },
            { q: "Which of these is NOT an attribute of ALLAAH?", opts: ["All-Knowing", "All-Seeing", "Sleeps", "All-Powerful"], ans: 2 },
            { q: "What is the reward of reading Sooratul Ikhlaas often?", opts: ["Nothing", "Equal to one-third Qur'an", "Less reward", "Only for children"], ans: 1 }
        ],

        medium: [
            { q: "What is the main message of Sooratul Kaafiroon?", opts: ["Unity of Muslims", "No compromise in religion", "Charity rules", "Fasting rules"], ans: 1 },
            { q: "What does 'Lakum deenukum waliya deen' mean?", opts: ["Your religion is mine", "My religion is yours", "To you your religion, to me mine", "We share religion"], ans: 2 },
            { q: "How many verses are in Sooratul Kaafiroon?", opts: ["4", "5", "6", "7"], ans: 2 },
            { q: "Where did the Prophet settle after Hijrah?", opts: ["Makkah", "Taif", "Madinah", "Yemen"], ans: 2 },
            { q: "What was the first building the Prophet established in Madinah?", opts: ["Market", "House", "Mosque", "School"], ans: 2 },
            { q: "Who were the helpers in Madinah called?", opts: ["Muhajirun", "Ansar", "Quraysh", "Sahabah"], ans: 1 },
            { q: "What day is Salaatul Jumuah performed?", opts: ["Monday", "Friday", "Saturday", "Sunday"], ans: 1 },
            { q: "How many rak'ahs are in Jumuah prayer?", opts: ["2", "3", "4", "5"], ans: 0 },
            { q: "What is delivered before Jumuah prayer?", opts: ["Adhan", "Khutbah", "Iqamah", "Tasbeeh"], ans: 1 },
            { q: "What must Muslims do during the khutbah?", opts: ["Talk", "Sleep", "Listen quietly", "Leave"], ans: 2 },
            { q: "Belief in Prophets means what?", opts: ["Deny some", "Accept all sent by ALLAAH", "Follow only one", "Ignore them"], ans: 1 },
            { q: "Why were Prophets sent?", opts: ["To entertain", "To guide people", "To fight only", "To build houses"], ans: 1 },
            { q: "Which Prophet is the last?", opts: ["Isa", "Musa", "Muhammad", "Ibrahim"], ans: 2 },
            { q: "What was a major battle between Muslims and Quraysh?", opts: ["Badr", "Hunayn", "Tabuk", "Khaybar"], ans: 0 },
            { q: "What was the result of Battle of Badr?", opts: ["Muslims defeated", "Draw", "Muslims victory", "No fight"], ans: 2 },
            { q: "Why did Quraysh oppose the Prophet?", opts: ["Trade loss", "Message of Islam", "Land issues", "Family issues"], ans: 1 },
            { q: "What time is Fajr prayer?", opts: ["Afternoon", "Before sunrise", "Evening", "Midnight"], ans: 1 },
            { q: "What time is Dhuhr prayer?", opts: ["Morning", "Noon", "Night", "Dawn"], ans: 1 },
            { q: "What time is Maghrib prayer?", opts: ["Before sunrise", "After sunset", "Midnight", "Noon"], ans: 1 },
            { q: "How many obligatory prayers daily?", opts: ["3", "4", "5", "6"], ans: 2 },
            { q: "What happened during conquest of Makkah?", opts: ["Defeat of Muslims", "Peaceful victory", "Destruction of Ka'bah", "Migration"], ans: 1 },
            { q: "How did the Prophet treat enemies in Makkah?", opts: ["Punished all", "Forgave them", "Exiled them", "Ignored them"], ans: 1 },
            { q: "What was removed from the Ka'bah after conquest?", opts: ["Clothes", "Idols", "Gold", "Books"], ans: 1 },
            { q: "What is Tahaarah?", opts: ["Prayer", "Cleanliness", "Charity", "Fasting"], ans: 1 },
            { q: "Which is part of Tahaarah?", opts: ["Eating", "Wudu", "Sleeping", "Walking"], ans: 1 },
            { q: "What invalidates wudu?", opts: ["Eating halal", "Sleeping deeply", "Reading Qur'an", "Talking"], ans: 1 },
            { q: "What is used for dry purification?", opts: ["Water", "Sand", "Oil", "Soap"], ans: 1 },
            { q: "Which attribute means ALLAAH knows all?", opts: ["Al-Aleem", "Al-Qadeer", "As-Samee'", "Al-Hakeem"], ans: 0 },
            { q: "Which attribute means ALLAAH is merciful?", opts: ["Ar-Rahman", "Al-Jabbar", "Al-Azeez", "Al-Qahhar"], ans: 0 },
            { q: "Which attribute means ALLAAH is powerful?", opts: ["Al-Lateef", "Al-Qadeer", "Al-Haleem", "Al-Kareem"], ans: 1 },
            { q: "Which prayer is at night?", opts: ["Fajr", "Isha", "Dhuhr", "Asr"], ans: 1 },
            { q: "What is the call to prayer called?", opts: ["Khutbah", "Adhan", "Dua", "Dhikr"], ans: 1 },
            { q: "Who calls the Adhan?", opts: ["Imam", "Muadhin", "Teacher", "Leader"], ans: 1 },
            { q: "What shows respect during Jumuah?", opts: ["Talking", "Listening", "Eating", "Sleeping"], ans: 1 },
            { q: "Why is Tahaarah important?", opts: ["For health only", "For valid worship", "For fun", "For trade"], ans: 1 },
            { q: "What did Muslims gain in Madinah?", opts: ["Wealth only", "Peace and unity", "Wars only", "Isolation"], ans: 1 },
            { q: "Which group migrated from Makkah?", opts: ["Ansar", "Muhajirun", "Quraysh", "Kings"], ans: 1 },
            { q: "What is belief in Prophets linked to?", opts: ["Iman", "Trade", "Food", "Games"], ans: 0 },
            { q: "Which attribute means ALLAAH provides sustenance?", opts: ["Ar-Razzaq", "Al-Hafeez", "Al-Kareem", "Al-Majeed"], ans: 0 },
            { q: "Which attribute shows ALLAAH forgives sins?", opts: ["Al-Ghafoor", "Al-Jabbar", "Al-Qawiyy", "Al-Adl"], ans: 0 },
            { q: "What is done before prayer for cleanliness?", opts: ["Sleep", "Wudu", "Eat", "Run"], ans: 1 }
        ],

        hard: [
            { q: "Which of these nullifies Tawhid?", opts: ["Salah", "Zakat", "Shirk", "Fasting"], ans: 2 },
            { q: "Why is Shirk considered a major sin?", opts: ["It is a small mistake", "It opposes monotheism", "It increases wealth", "It is encouraged"], ans: 1 },
            { q: "What is the main duty of a Muslim regarding Tawhid?", opts: ["Worship many gods", "Avoid prayer", "Worship Allah alone", "Follow traditions only"], ans: 2 },
            { q: "What is the main theme of Sooratul Mulk?", opts: ["Stories of prophets", "Power of ALLAAH over creation", "Rules of fasting", "Battle history"], ans: 1 },
            { q: "How many verses are in Sooratul Mulk?", opts: ["20", "25", "30", "35"], ans: 2 },
            { q: "What does Sooratul Mulk protect from?", opts: ["Hunger", "Punishment of the grave", "Sickness", "Poverty"], ans: 1 },
            { q: "What is Al-Qadhaa?", opts: ["Human plan", "ALLAAH’s decree", "Prayer", "Charity"], ans: 1 },
            { q: "What is Al-Qadar?", opts: ["Destiny measurement by ALLAAH", "Human choice only", "Weather", "Luck"], ans: 0 },
            { q: "Belief in Qadar includes what?", opts: ["Denying fate", "Believing ALLAAH knows all", "Ignoring actions", "Rejecting effort"], ans: 1 },
            { q: "Which is part of belief in Qadar?", opts: ["ALLAAH writes destiny", "Humans control all", "No planning needed", "Chance rules"], ans: 0 },
            { q: "How should a Muslim react to hardship?", opts: ["Complain", "Be patient", "Blame others", "Quit"], ans: 1 },
            { q: "Who was the first Caliph?", opts: ["Umar", "Ali", "Abu Bakr", "Uthman"], ans: 2 },
            { q: "Who was known for justice among the Caliphs?", opts: ["Abu Bakr", "Umar", "Uthman", "Ali"], ans: 1 },
            { q: "Who compiled the Qur'an into one book?", opts: ["Ali", "Umar", "Abu Bakr", "Uthman"], ans: 2 },
            { q: "Who standardized the Qur'an copies?", opts: ["Abu Bakr", "Umar", "Uthman", "Ali"], ans: 2 },
            { q: "Who was the fourth Caliph?", opts: ["Ali", "Umar", "Uthman", "Abu Bakr"], ans: 0 },
            { q: "What is Shirk?", opts: ["Worshipping ALLAAH alone", "Associating partners with ALLAAH", "Helping others", "Prayer"], ans: 1 },
            { q: "Which is an example of Shirk?", opts: ["Praying to ALLAAH", "Giving charity", "Calling on idols", "Fasting"], ans: 2 },
            { q: "What is the greatest sin in Islam?", opts: ["Lying", "Stealing", "Shirk", "Anger"], ans: 2 },
            { q: "Does ALLAAH forgive Shirk if not repented?", opts: ["Always", "Never", "Sometimes", "Often"], ans: 1 },
            { q: "What is minor Shirk?", opts: ["Showing off in worship", "Idol worship", "Denying ALLAAH", "Ignoring prayer"], ans: 0 },
            { q: "What is Hajj?", opts: ["Daily prayer", "Pilgrimage to Makkah", "Fasting", "Charity"], ans: 1 },
            { q: "When is Hajj performed?", opts: ["Ramadan", "Dhul-Hijjah", "Muharram", "Rajab"], ans: 1 },
            { q: "Which pillar of Islam is Hajj?", opts: ["First", "Third", "Fourth", "Fifth"], ans: 3 },
            { q: "What is the first rite of Hajj?", opts: ["Sa'i", "Ihram", "Tawaf", "Arafah"], ans: 1 },
            { q: "What does Ihram symbolize?", opts: ["Wealth", "Equality and purity", "Power", "Status"], ans: 1 },
            { q: "What is done around the Ka'bah?", opts: ["Running", "Tawaf", "Sleeping", "Eating"], ans: 1 },
            { q: "How many times is Tawaf performed?", opts: ["5", "6", "7", "8"], ans: 2 },
            { q: "What is Sa'i?", opts: ["Standing at Arafah", "Walking between Safa and Marwah", "Throwing stones", "Praying"], ans: 1 },
            { q: "Where do pilgrims stand on the 9th of  day of Dhul-Hijjah?", opts: ["Mina", "Arafah", "Makkah", "Taif"], ans: 1 },
            { q: "What is thrown at Jamarat?", opts: ["Water", "Stones", "Sand", "Food"], ans: 1 },
            { q: "What lesson is learnt from Hajj?", opts: ["Pride", "Unity and submission", "Isolation", "Competition"], ans: 1 },
            { q: "Which Caliph expanded the Islamic state greatly?", opts: ["Abu Bakr", "Umar", "Uthman", "Ali"], ans: 1 },
            { q: "Who faced internal conflicts during his rule?", opts: ["Abu Bakr", "Umar", "Uthman", "Ali"], ans: 3 },
            { q: "What is belief in Qadar linked to?", opts: ["Iman", "Trade", "Health", "Wealth"], ans: 0 },
            { q: "Which Surah begins with 'Tabarakalladhi'?", opts: ["Mulk", "Falaq", "Nas", "Ikhlas"], ans: 0 },
            { q: "What does Sooratul Mulk invite people to reflect on?", opts: ["Food", "Creation of heavens", "Clothes", "Trade"], ans: 1 },
            { q: "What is the danger of Shirk?", opts: ["Loss of wealth", "Invalidates worship", "Causes hunger", "Leads to sleep"], ans: 1 },
            { q: "Who must perform Hajj?", opts: ["Only leaders", "Every Muslim able to", "Children only", "Scholars only"], ans: 1 },
            { q: "What is the reward of accepted Hajj?", opts: ["Wealth", "Status", "Paradise", "Fame"], ans: 2 }

        ]
    },
    civic_Education: {
        easy: [
            { q: "What is the main purpose of government?", opts: ["To entertain citizens", "To maintain order and provide services", "To control the weather", "To run businesses"], ans: 1 },
            { q: "Which branch of government makes laws?", opts: ["Executive", "Judiciary", "Legislative", "Military"], ans: 2 },
            { q: "Voting in elections is a?", opts: ["Punishment", "Right and responsibility", "Game", "Holiday activity"], ans: 1 },
            { q: "Who enforces the laws?", opts: ["Teachers", "Executive branch", "Students", "Farmers"], ans: 1 },
            { q: "The national flag is a symbol of?", opts: ["Sports", "Identity and unity", "Weather", "Trade"], ans: 1 },
            { q: "Citizens should obey laws to?", opts: ["Avoid school", "Keep peace and order", "Earn money", "Travel abroad"], ans: 1 },
            { q: "Paying taxes helps the government to?", opts: ["Build public services", "Buy toys", "Close schools", "Stop elections"], ans: 0 },
            { q: "Freedom of speech means you can?", opts: ["Say anything without limits", "Express opinions responsibly", "Break laws", "Ignore others"], ans: 1 },
            { q: "The judiciary branch is responsible for?", opts: ["Making laws", "Enforcing laws", "Interpreting laws", "Writing textbooks"], ans: 2 },
            { q: "A good citizen participates in?", opts: ["Community activities", "Illegal acts", "Fights", "Rumors"], ans: 0 },
            { q: "Democracy means power belongs to?", opts: ["One king", "The army", "The people", "Judges"], ans: 2 },
            { q: "Respecting others' rights promotes?", opts: ["Conflict", "Peace", "Confusion", "Fear"], ans: 1 },
            { q: "Which is a responsibility of citizens?", opts: ["Breaking rules", "Serving on a jury", "Ignoring laws", "Avoiding taxes"], ans: 1 },
            { q: "National anthem is a?", opts: ["Law book", "Song symbolizing unity", "Court order", "Election result"], ans: 1 },
            { q: "Community development improves?", opts: ["Personal wealth only", "Public facilities and life quality", "Weather patterns", "Foreign trade only"], ans: 1 },
            { q: "Elections are held to?", opts: ["Choose leaders", "Start wars", "Close schools", "Raise taxes"], ans: 0 },
            { q: "Rule of law means?", opts: ["Only leaders follow laws", "Everyone is equal before the law", "Laws change daily", "Courts make money"], ans: 1 },
            { q: "Protecting the environment is a?", opts: ["Government job only", "Citizen responsibility", "Private hobby", "School subject only"], ans: 1 },
            { q: "Leadership requires?", opts: ["Dishonesty", "Responsibility and integrity", "Greed", "Fear"], ans: 1 },
            { q: "Peaceful conflict resolution involves?", opts: ["Violence", "Dialogue and compromise", "Ignoring issues", "Threats"], ans: 1 }
        ],
        medium: [
            { q: "Separation of powers prevents?", opts: ["Economic growth", "Abuse of power", "Voting", "Education reform"], ans: 1 },
            { q: "The executive branch is typically led by a?", opts: ["Chief Justice", "Speaker", "President or Prime Minister", "Governor only"], ans: 2 },
            { q: "A constitution primarily serves to?", opts: ["Entertain citizens", "Outline fundamental laws and principles", "Promote tourism", "Regulate sports"], ans: 1 },
            { q: "Civic participation includes?", opts: ["Avoiding meetings", "Engaging in public discussions", "Ignoring elections", "Spreading rumors"], ans: 1 },
            { q: "Checks and balances ensure?", opts: ["One branch dominates", "Power is shared and limited", "No elections occur", "Courts control all"], ans: 1 },
            { q: "Transparency in leadership builds?", opts: ["Corruption", "Public trust", "Fear", "Secrecy"], ans: 1 },
            { q: "Citizenship can be acquired by?", opts: ["Birth or naturalization", "Buying property only", "Traveling abroad", "Marriage only"], ans: 0 },
            { q: "Public hearings allow citizens to?", opts: ["Vote secretly", "Express opinions on issues", "Write laws alone", "Avoid taxes"], ans: 1 },
            { q: "Judicial review refers to?", opts: ["Reviewing school exams", "Courts examining constitutionality of laws", "Electing judges", "Writing new laws"], ans: 1 },
            { q: "A referendum allows citizens to?", opts: ["Appoint judges", "Vote directly on a policy issue", "Avoid elections", "Change currency"], ans: 1 },
            { q: "Environmental laws are designed to?", opts: ["Increase pollution", "Protect natural resources", "Stop farming", "Ban trade"], ans: 1 },
            { q: "Ethical leadership promotes?", opts: ["Personal gain", "Accountability and fairness", "Corruption", "Secrecy"], ans: 1 },
            { q: "The legislative branch debates bills before?", opts: ["Destroying them", "Voting to pass them", "Sending to police", "Ignoring them"], ans: 1 },
            { q: "Community service strengthens?", opts: ["Individual power", "Social bonds", "Government control", "Military force"], ans: 1 },
            { q: "Civil rights protect individuals from?", opts: ["Government abuse", "Education", "Healthcare", "Travel"], ans: 0 },
            { q: "Majority rule in democracy must respect?", opts: ["No one", "Minority rights", "Only leaders", "Foreigners"], ans: 1 },
            { q: "A fair election requires?", opts: ["Transparency and equal opportunity", "Secret counting only", "Military control", "Limited voters"], ans: 0 },
            { q: "Conflict mediation involves?", opts: ["Violence", "Neutral third-party assistance", "Ignoring disputes", "Punishment only"], ans: 1 },
            { q: "National identity is shaped by?", opts: ["Shared culture and history", "Weather", "Sports only", "Trade routes"], ans: 0 },
            { q: "Active citizenship improves?", opts: ["Community decision-making", "Personal secrecy", "Lawlessness", "Isolation"], ans: 0 }
        ],
        hard: [
            { q: "Constitutional supremacy implies that?", opts: ["Parliament is above the constitution", "The constitution is the highest law", "Judges rule without limits", "Citizens ignore laws"], ans: 1 },
            { q: "Pluralism in democracy refers to?", opts: ["Single-party dominance", "Multiple groups influencing policy", "Military rule", "No elections"], ans: 1 },
            { q: "Impeachment is a process to?", opts: ["Elect leaders", "Remove public officials for misconduct", "Pass budgets", "Create courts"], ans: 1 },
            { q: "Civic accountability requires leaders to?", opts: ["Act secretly", "Answer to the public for actions", "Ignore criticism", "Avoid media"], ans: 1 },
            { q: "Sustainable development balances?", opts: ["Profit and war", "Economic growth, social welfare, and environment", "Taxes and trade", "Cities and villages"], ans: 1 },
            { q: "An independent judiciary ensures?", opts: ["Political control", "Fair and impartial justice", "Executive dominance", "Legislative supremacy"], ans: 1 },
            { q: "Civil disobedience is characterized by?", opts: ["Violent protest", "Peaceful refusal to obey unjust laws", "Secret voting", "Military action"], ans: 1 },
            { q: "Federal systems divide power between?", opts: ["Courts and police", "National and regional governments", "Citizens and judges", "Military branches"], ans: 1 },
            { q: "Good governance includes?", opts: ["Corruption", "Transparency and rule of law", "Censorship", "Nepotism"], ans: 1 },
            { q: "A bill becomes law after?", opts: ["Public protest only", "Legislative approval and executive assent", "Judicial review first", "Media announcement"], ans: 1 },
            { q: "Civic virtue emphasizes?", opts: ["Self-interest", "Commitment to common good", "Isolation", "Private gain"], ans: 1 },
            { q: "Judicial precedent refers to?", opts: ["Old elections", "Past court decisions guiding future cases", "Legislative debates", "Executive orders"], ans: 1 },
            { q: "Participatory democracy encourages?", opts: ["Limited voting", "Direct citizen involvement", "Military leadership", "Single-party rule"], ans: 1 },
            { q: "Human rights are considered?", opts: ["Privileges for leaders", "Universal and inalienable", "Temporary laws", "Optional rules"], ans: 1 },
            { q: "Public policy is best described as?", opts: ["Private decisions", "Government plans and actions", "Court punishments", "Election speeches"], ans: 1 },
            { q: "Electoral integrity requires?", opts: ["Fraud", "Free and fair processes", "Limited candidates", "Secret campaigns"], ans: 1 },
            { q: "Decentralization transfers authority to?", opts: ["Central government only", "Local governments", "Military leaders", "Foreign states"], ans: 1 },
            { q: "Social contract theory suggests that?", opts: ["Citizens and government have mutual obligations", "Leaders rule absolutely", "Courts dominate politics", "Taxes are optional"], ans: 0 },
            { q: "Conflict transformation aims to?", opts: ["Win disputes", "Address root causes sustainably", "Punish opponents", "Ignore tensions"], ans: 1 },
            { q: "Environmental stewardship reflects?", opts: ["Exploiting resources freely", "Responsible management of natural resources", "Industrial secrecy", "Urban expansion only"], ans: 1 }
        ]
    },
    social_Studies: {
        easy: [
            { q: "What tool is used to find directions on a map?", opts: ["Thermometer", "Compass", "Barometer", "Scale"], ans: 1 },
            { q: "Which continent is known as the 'Dark Continent' in history?", opts: ["Asia", "Africa", "Europe", "Australia"], ans: 1 },
            { q: "Rainforests usually have what kind of climate?", opts: ["Cold and dry", "Hot and dry", "Hot and wet", "Cold and windy"], ans: 2 },
            { q: "A large area of flat land is called a?", opts: ["Mountain", "Plateau", "Plain", "Valley"], ans: 2 },
            { q: "Which ocean lies between Africa and Australia?", opts: ["Pacific", "Atlantic", "Indian", "Arctic"], ans: 2 },
            { q: "The Great Wall is located in which country?", opts: ["India", "China", "Japan", "Korea"], ans: 1 },
            { q: "People moving from one country to another is called?", opts: ["Trade", "Migration", "Tourism", "Transport"], ans: 1 },
            { q: "Which resource is used to make paper?", opts: ["Oil", "Wood", "Gold", "Coal"], ans: 1 },
            { q: "Buying and selling goods between countries is called?", opts: ["Migration", "Trade", "Education", "Farming"], ans: 1 },
            { q: "Which institution teaches children basic education?", opts: ["Hospital", "School", "Bank", "Court"], ans: 1 },
            { q: "A group of related people living together is called?", opts: ["Government", "Family", "Company", "Nation"], ans: 1 },
            { q: "Which natural resource provides energy for cars?", opts: ["Coal", "Petroleum", "Wind", "Sunlight"], ans: 1 },
            { q: "The equator divides the Earth into?", opts: ["East and West", "North and South", "Hot and Cold", "Land and Water"], ans: 1 },
            { q: "Which festival is celebrated by Muslims worldwide?", opts: ["Christmas", "Diwali", "Eid", "Hanukkah"], ans: 2 },
            { q: "Mount Everest is found in which mountain range?", opts: ["Andes", "Rockies", "Himalayas", "Alps"], ans: 2 },
            { q: "Which is an example of a renewable resource?", opts: ["Coal", "Oil", "Wind", "Gas"], ans: 2 },
            { q: "Citizens vote during?", opts: ["Harvest", "Elections", "Migration", "Trade fair"], ans: 1 },
            { q: "The study of maps is called?", opts: ["Geology", "Cartography", "Biology", "Meteorology"], ans: 1 },
            { q: "A country ruled by a king or queen is called?", opts: ["Republic", "Democracy", "Monarchy", "Dictatorship"], ans: 2 },
            { q: "Which continent is the smallest?", opts: ["Europe", "Australia", "South America", "Antarctica"], ans: 1 }
        ],
        medium: [
            { q: "Which river is important to ancient Egyptian civilization?", opts: ["Amazon", "Nile", "Yangtze", "Danube"], ans: 1 },
            { q: "A plateau is best described as?", opts: ["Low flat land", "High flat land", "Deep valley", "Coastal area"], ans: 1 },
            { q: "Industrialization mainly increases?", opts: ["Handicrafts", "Factory production", "Nomadic life", "Barter trade"], ans: 1 },
            { q: "Which factor most influences climate?", opts: ["Latitude", "Language", "Religion", "Currency"], ans: 0 },
            { q: "The United Nations was formed after which war?", opts: ["World War I", "World War II", "Cold War", "Civil War"], ans: 1 },
            { q: "Urbanization refers to?", opts: ["Growth of villages", "Movement to rural areas", "Growth of cities", "Decrease in trade"], ans: 2 },
            { q: "Which continent has the Sahara Desert?", opts: ["Asia", "Africa", "Australia", "Europe"], ans: 1 },
            { q: "Exports are goods that are?", opts: ["Bought from abroad", "Sold to other countries", "Destroyed", "Stored locally"], ans: 1 },
            { q: "Cultural traditions are passed through?", opts: ["Weather", "Generations", "Mountains", "Trade routes"], ans: 1 },
            { q: "Which is a push factor for migration?", opts: ["Job opportunities", "Peace", "War", "Good climate"], ans: 2 },
            { q: "Democracy allows citizens to?", opts: ["Choose leaders", "Avoid taxes", "Ignore laws", "Control courts"], ans: 0 },
            { q: "Which region is known for frequent earthquakes due to tectonic activity?", opts: ["Sahara", "Ring of Fire", "Amazon Basin", "Arctic Circle"], ans: 1 },
            { q: "A command economy is controlled by?", opts: ["Private businesses", "Government", "Farmers", "Traders"], ans: 1 },
            { q: "The Silk Road connected China mainly with?", opts: ["Africa", "Europe", "Australia", "America"], ans: 1 },
            { q: "Population density measures?", opts: ["Birth rate", "People per area", "Migration rate", "Trade volume"], ans: 1 },
            { q: "Which country is known for the Renaissance movement?", opts: ["France", "Italy", "Germany", "Spain"], ans: 1 },
            { q: "Deforestation mainly affects?", opts: ["Urban growth", "Climate and wildlife", "Currency value", "Trade laws"], ans: 1 },
            { q: "Globalization increases?", opts: ["Isolation", "International connections", "Local farming only", "Border closures"], ans: 1 },
            { q: "Primary economic activities include?", opts: ["Mining and farming", "Banking", "Teaching", "Transport"], ans: 0 },
            { q: "A referendum allows citizens to?", opts: ["Elect judges", "Vote directly on an issue", "Start trade", "Avoid taxes"], ans: 1 }
        ],
        hard: [
            { q: "Geopolitics studies the relationship between?", opts: ["Weather and farming", "Geography and political power", "Culture and music", "Trade and language"], ans: 1 },
            { q: "The demographic transition model explains changes in?", opts: ["Trade routes", "Population growth rates", "Mountain formation", "Industrial output"], ans: 1 },
            { q: "Mercantilism emphasized?", opts: ["Free trade", "Accumulation of gold and favorable balance of trade", "Agriculture only", "Urbanization"], ans: 1 },
            { q: "Cultural diffusion refers to?", opts: ["Loss of culture", "Spread of cultural traits", "Migration only", "Trade decline"], ans: 1 },
            { q: "The Cold War was mainly between?", opts: ["USA and China", "USA and USSR", "Germany and France", "India and Pakistan"], ans: 1 },
            { q: "Sustainable development aims to?", opts: ["Exploit resources quickly", "Meet present needs without harming future generations", "Stop trade", "Increase pollution"], ans: 1 },
            { q: "A federal system divides power between?", opts: ["Military and police", "Central and regional governments", "Courts only", "Banks and firms"], ans: 1 },
            { q: "The Bretton Woods institutions include the IMF and?", opts: ["WHO", "World Bank", "UNESCO", "NATO"], ans: 1 },
            { q: "Human Development Index measures?", opts: ["Only income", "Health, education, and income", "Trade balance", "Military strength"], ans: 1 },
            { q: "Colonialism primarily involved?", opts: ["Cultural exchange only", "Political and economic control of territories", "Trade agreements", "Urban planning"], ans: 1 },
            { q: "A trade embargo is?", opts: ["Free trade zone", "Ban on trade with a country", "Cultural festival", "Migration policy"], ans: 1 },
            { q: "Urban sprawl refers to?", opts: ["Dense city centers", "Expansion of cities into rural areas", "Village growth", "Population decline"], ans: 1 },
            { q: "The Green Revolution improved?", opts: ["Industrial trade", "Agricultural productivity", "Urban transport", "Mining output"], ans: 1 },
            { q: "A multicultural society is one that?", opts: ["Has one culture", "Includes diverse cultural groups", "Rejects traditions", "Limits migration"], ans: 1 },
            { q: "Resource depletion occurs when?", opts: ["Resources are overused", "Resources increase", "Trade expands", "Population declines"], ans: 0 },
            { q: "The European Union promotes?", opts: ["Isolation", "Economic and political cooperation", "War", "Colonization"], ans: 1 },
            { q: "Brain drain refers to?", opts: ["Loss of skilled workers through migration", "Health problems", "Population growth", "Industrial expansion"], ans: 0 },
            { q: "Climate change is largely driven by?", opts: ["Natural cycles only", "Greenhouse gas emissions", "Ocean tides", "Solar eclipses"], ans: 1 },
            { q: "Civic nationalism is based on?", opts: ["Ethnicity only", "Shared citizenship and values", "Language only", "Religion only"], ans: 1 },
            { q: "International sanctions are used to?", opts: ["Encourage tourism", "Influence a country's behavior", "Promote festivals", "Build schools"], ans: 1 }
        ]
    },
    biology: {
        easy: [
            { q: "What is the basic unit of life?", opts: ["Tissue", "Organ", "Cell", "Atom"], ans: 2 },
            { q: "Which organ pumps blood in the human body?", opts: ["Lungs", "Brain", "Heart", "Liver"], ans: 2 },
            { q: "What gas do plants take in for photosynthesis?", opts: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], ans: 1 },
            { q: "Which part of the cell contains genetic material?", opts: ["Nucleus", "Ribosome", "Cytoplasm", "Membrane"], ans: 0 },
            { q: "What is the process by which plants make food?", opts: ["Respiration", "Digestion", "Photosynthesis", "Transpiration"], ans: 2 },
            { q: "Which blood cells fight infections?", opts: ["Red blood cells", "White blood cells", "Platelets", "Plasma cells"], ans: 1 },
            { q: "What is the largest organ in the human body?", opts: ["Heart", "Skin", "Liver", "Lungs"], ans: 1 },
            { q: "Which microorganism causes the flu?", opts: ["Bacterium", "Virus", "Fungus", "Protozoan"], ans: 1 },
            { q: "What do herbivores mainly eat?", opts: ["Meat", "Plants", "Insects", "Fish"], ans: 1 },
            { q: "Which part of the plant absorbs water?", opts: ["Leaf", "Stem", "Flower", "Root"], ans: 3 },
            { q: "DNA stands for?", opts: ["Deoxyribonucleic Acid", "Dynamic Nucleic Acid", "Double Nitrogen Acid", "Deoxynitric Agent"], ans: 0 },
            { q: "What carries oxygen in the blood?", opts: ["Platelets", "Plasma", "Hemoglobin", "White cells"], ans: 2 },
            { q: "Which system controls body activities?", opts: ["Digestive system", "Nervous system", "Respiratory system", "Circulatory system"], ans: 1 },
            { q: "What is the main source of energy for Earth?", opts: ["Moon", "Wind", "Sun", "Stars"], ans: 2 },
            { q: "Which organ helps in breathing?", opts: ["Kidney", "Lungs", "Stomach", "Pancreas"], ans: 1 },
            { q: "What type of organism makes its own food?", opts: ["Consumer", "Producer", "Decomposer", "Predator"], ans: 1 },
            { q: "Which vitamin is produced when skin is exposed to sunlight?", opts: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], ans: 3 },
            { q: "What structure protects a plant cell?", opts: ["Cell wall", "Chloroplast", "Nucleus", "Mitochondria"], ans: 0 },
            { q: "Which disease is caused by bacteria?", opts: ["Malaria", "Tuberculosis", "Flu", "COVID-19"], ans: 1 },
            { q: "What is a food chain?", opts: ["A type of plant", "Energy flow between organisms", "Animal shelter", "Water cycle"], ans: 1 }
        ],
        medium: [
            { q: "Which organelle is known as the powerhouse of the cell?", opts: ["Nucleus", "Ribosome", "Mitochondrion", "Golgi apparatus"], ans: 2 },
            { q: "What is the function of ribosomes?", opts: ["Energy production", "Protein synthesis", "Waste removal", "Photosynthesis"], ans: 1 },
            { q: "Which blood vessel carries blood away from the heart?", opts: ["Vein", "Capillary", "Artery", "Valve"], ans: 2 },
            { q: "What is the role of chlorophyll?", opts: ["Absorb sunlight", "Store water", "Transport sugar", "Protect roots"], ans: 0 },
            { q: "Which genetic cross produces a 3:1 ratio?", opts: ["Test cross", "Monohybrid cross", "Dihybrid cross", "Back cross"], ans: 1 },
            { q: "What type of reproduction involves one parent?", opts: ["Sexual reproduction", "Binary fusion", "Asexual reproduction", "Pollination"], ans: 2 },
            { q: "Which kingdom includes bacteria?", opts: ["Protista", "Fungi", "Monera", "Plantae"], ans: 2 },
            { q: "What is the primary function of the large intestine?", opts: ["Digest proteins", "Absorb water", "Pump blood", "Produce enzymes"], ans: 1 },
            { q: "Which biome is characterized by low rainfall and extreme temperatures?", opts: ["Tundra", "Rainforest", "Desert", "Savanna"], ans: 2 },
            { q: "What molecule carries genetic instructions?", opts: ["RNA", "DNA", "Protein", "Lipid"], ans: 1 },
            { q: "Which process forms gametes in humans?", opts: ["Mitosis", "Binary fission", "Meiosis", "Budding"], ans: 2 },
            { q: "Which part of the brain controls balance?", opts: ["Cerebrum", "Cerebellum", "Medulla", "Hypothalamus"], ans: 1 },
            { q: "What is mutualism?", opts: ["One benefits, one harmed", "Both benefit", "Neither benefits", "One benefits, other unaffected"], ans: 1 },
            { q: "Which hormone regulates blood sugar?", opts: ["Adrenaline", "Insulin", "Estrogen", "Thyroxine"], ans: 1 },
            { q: "What is the main nitrogenous waste in humans?", opts: ["Ammonia", "Urea", "Uric acid", "Carbon dioxide"], ans: 1 },
            { q: "Which plant tissue transports water?", opts: ["Phloem", "Xylem", "Cambium", "Epidermis"], ans: 1 },
            { q: "What is the role of decomposers?", opts: ["Produce food", "Break down dead matter", "Hunt prey", "Store energy"], ans: 1 },
            { q: "Which pathogen causes malaria?", opts: ["Virus", "Bacterium", "Protozoan", "Fungus"], ans: 2 },
            { q: "Which stage of mitosis separates sister chromatids?", opts: ["Prophase", "Metaphase", "Anaphase", "Telophase"], ans: 2 },
            { q: "What is an adaptation?", opts: ["Random behavior", "Inherited survival trait", "Temporary change", "Learned skill"], ans: 1 }
        ],
        hard: [
            { q: "Which phase of the cell cycle involves DNA replication?", opts: ["G1 phase", "S phase", "G2 phase", "M phase"], ans: 1 },
            { q: "What is the function of tRNA in protein synthesis?", opts: ["Store DNA", "Carry amino acids", "Form ribosomes", "Break proteins"], ans: 1 },
            { q: "Which blood type is known as the universal donor?", opts: ["A", "B", "AB", "O negative"], ans: 3 },
            { q: "What is genetic drift?", opts: ["Gene mutation by radiation", "Random allele frequency change", "Migration of species", "Natural selection"], ans: 1 },
            { q: "Which structure regulates substances entering and leaving the cell?", opts: ["Cell wall", "Nucleus", "Cell membrane", "Cytoskeleton"], ans: 2 },
            { q: "Which enzyme unzips DNA during replication?", opts: ["Ligase", "Helicase", "Polymerase", "Amylase"], ans: 1 },
            { q: "What type of immunity results from vaccination?", opts: ["Passive natural", "Passive artificial", "Active artificial", "Active natural"], ans: 2 },
            { q: "Which ecological pyramid is always upright?", opts: ["Numbers", "Biomass", "Energy", "Population"], ans: 2 },
            { q: "Which hormone triggers ovulation?", opts: ["FSH", "LH", "Progesterone", "Testosterone"], ans: 1 },
            { q: "What is the Hardy-Weinberg principle used to measure?", opts: ["Mutation rate", "Population genetic equilibrium", "Speciation speed", "Ecosystem growth"], ans: 1 },
            { q: "Which organelle modifies and packages proteins?", opts: ["Golgi apparatus", "Lysosome", "Mitochondrion", "Vacuole"], ans: 0 },
            { q: "Which disease is caused by HIV?", opts: ["Tuberculosis", "AIDS", "Malaria", "Hepatitis"], ans: 1 },
            { q: "What is coevolution?", opts: ["Extinction event", "Species evolving independently", "Mutual evolutionary influence", "Migration pattern"], ans: 2 },
            { q: "Which type of RNA forms part of the ribosome?", opts: ["mRNA", "tRNA", "rRNA", "siRNA"], ans: 2 },
            { q: "What is the main function of stomata?", opts: ["Photosynthesis", "Gas exchange", "Water storage", "Support"], ans: 1 },
            { q: "Which process increases genetic variation during meiosis?", opts: ["Binary fission", "Crossing over", "Budding", "Cloning"], ans: 1 },
            { q: "Which biomolecule is the main component of cell membranes?", opts: ["Proteins", "Carbohydrates", "Lipids", "Nucleic acids"], ans: 2 },
            { q: "What is antibiotic resistance?", opts: ["Body rejects drugs", "Bacteria survive antibiotics", "Virus mutation", "Immune weakness"], ans: 1 },
            { q: "Which cycle describes movement of carbon through ecosystems?", opts: ["Nitrogen cycle", "Water cycle", "Carbon cycle", "Oxygen cycle"], ans: 2 },
            { q: "What mechanism drives evolution by favoring beneficial traits?", opts: ["Mutation", "Natural selection", "Genetic drift", "Gene flow"], ans: 1 }
        ]
    },
    chemistry: {
        easy: [
            { q: "The current Vice President of the Federal Republic of Nigeria is", opts: ["Seyi Tinubu", "Godswill Akpabio", "Femi Gbajabiamila", "Kashim Shettima"], ans: 3 },
            { q: "Who is the current Deputy Governor of Lagos state? ", opts: ["Obafemi Hamzat", "Joe Igbokwe", "Babajide Sanwo-olu", "Obasa"], ans: 0 },
            { q: "The Nigerian hero whose picture is on #500 note is", opts: ["Obafemi Awolowo ", "Murtala Muhammed ", "Nnamdi Azikiwe", "Tafawa Balewa"], ans: 2 },
            { q: "Daarul-Hikam Academy is situated in ..... Local Government Area of Lagos state. ", opts: ["Alimosho", "Ojo", "Badagry ", "Iba"], ans: 1 },
            { q: "The first of the ten commandments in Suratul-An'aam is", opts: ["Treat your parents well", "Be just and truthful ", "Join nothing in worship with ALLAAH ", "Abstain from immorality"], ans: 2 },
            { q: "Fulfil the covenant of ALLAAH is the .... commandment. ", opts: ["5", "7", "8", "9"], ans: 3 },
            { q: "Which of these is not one of the commandments? ", opts: ["Be nice", "Beware of killing a soul ", "Give full measure ", "Be just"], ans: 0 },
            { q: "What is the meaning of حَصَّالَةٌ? ", opts: ["Moneybox ", "Keyholder ", "Luggage ", "Case"], ans: 0 },
            { q: "The word lantern in Arabic is:", opts: ["شُعْلَةٌ", "لَمْبَةٌ", "فَانُوسٌ", "مِصْبَاحٌ"], ans: 2 },
            { q: "Radio in Arabic is", opts: ["رَادِيو", "دُرُحٌ", "مِذْيَاعٌ", "A and C"], ans: 3 },
            { q: "\"The commandment \"\"َوَأَوفُو الكَيْل وَالمِيزَانَ بِالقِسْطِ\"\"  means\"", opts: ["Fulfil the covenant of ALLAAH ", "Give full measure and weight ", "Do not approach the property of the orphan", "Follow the straight path of ALLAAH "], ans: 1 },
            { q: "NATO stands for:", opts: ["North Africa Treaty Organisation ", "North America Treaty Organisation ", "North Atlantic Trade Organisation ", "North Atlantic Treaty Organisation "], ans: 3 },
            { q: "ECOWAS is an acronym for:", opts: ["Economics Community of West African States ", "Economy Community of West African States ", "Economic Community of West African States ", "Economics Communities of West African States "], ans: 2 },
            { q: "ECOMOG stands for:", opts: ["ECOWAS Monitoring Group ", "ECOWAS Monetary Group", "ECOWAS Mobility Group ", "None of the above"], ans: 0 },
            { q: "Which is odd? ", opts: ["FIFA", "NFF", "CAF", "FEPA"], ans: 3 },
            { q: "The seat of the Nigerian presidency is the ", opts: ["White House ", "Aso Rock Villa", "Chatham House ", "Bourdillon"], ans: 1 },
            { q: "Cutlery include the following except ", opts: ["Spoon", "Knife ", "Matches", "Fork"], ans: 2 },
            { q: "The money being paid to kidnappers for the release of their victims is called", opts: ["Bail", "Ransom ", "Compensation ", "Fine"], ans: 1 },
            { q: "The fastest means of transportation is", opts: ["Rail", "Road", "Air", "Water"], ans: 2 },
            { q: "The richest black man in the world is", opts: ["Femi Otedola", "Abdul Samad Rabiu (BUA) ", "Mike Adenuga", "Aliko Dangote"], ans: 3 },
            { q: "The Dangote Refinery is located in ", opts: ["Abuja", "Lagos", "Kano", "Portharcourt"], ans: 1 },
            { q: "The capital of Zamfara is", opts: ["Dutse", "Gusau", "Zamfara", "Damaturu "], ans: 1 },
            { q: "The fifth pillar of Islam is ", opts: ["Zakaat", "Hajj", "Sawm", "Shahadah"], ans: 1 },
            { q: "\"Which option correctly translates \"\"Antenna\"\" to Arabic?\"", opts: ["هَوَائِيٌّ", "تَقْوِيمٌ", "تِلْفَازٌ", "نَظَّارَةٌ"], ans: 0 },
            { q: "Mirror in Arabic is:", opts: ["مِرْآةٌ", "مِجْهَرٌ", "مِنْظَارٌ", "مَرْأَةٌ"], ans: 0 },
            { q: "\"\"\"Wall\"\" in Arabic is\"", opts: ["دُرُجٌ", "حَائِطٌ", "جِدَارٌ", "B and C"], ans: 3 },
            { q: "مَقْعَدٌ means ", opts: ["Seat", "Chair", "Table", "A and B"], ans: 3 },
            { q: "\"If it takes 10 minutes for a handkerchief to get dried on a sunny day, how long will it take 3 of such handkerchiefs to dry? \"", opts: ["30 minutes", "3 minutes ", "10 minutes ", "5 minutes "], ans: 2 },
            { q: "The National Security Adviser (NSA) is", opts: ["George Akume", "Nuhu Ribadu ", "Olayemi Cardoso", "Ben Kalu"], ans: 1 },
            { q: "Who is the Secretary to the Government of the Federation (SGF)? ", opts: ["Nasir El Rufai", "Ali Ndume", "Godswill Akpabio", "George Akume"], ans: 3 }
        ],
        medium: [
            { q: "The current Vice President of the Federal Republic of Nigeria is", opts: ["Seyi Tinubu", "Godswill Akpabio", "Femi Gbajabiamila", "Kashim Shettima"], ans: 3 },
            { q: "Who is the current Deputy Governor of Lagos state? ", opts: ["Obafemi Hamzat", "Joe Igbokwe", "Babajide Sanwo-olu", "Obasa"], ans: 0 },
            { q: "The Nigerian hero whose picture is on #500 note is", opts: ["Obafemi Awolowo ", "Murtala Muhammed ", "Nnamdi Azikiwe", "Tafawa Balewa"], ans: 2 },
            { q: "Daarul-Hikam Academy is situated in ..... Local Government Area of Lagos state. ", opts: ["Alimosho", "Ojo", "Badagry ", "Iba"], ans: 1 },
            { q: "The first of the ten commandments in Suratul-An'aam is", opts: ["Treat your parents well", "Be just and truthful ", "Join nothing in worship with ALLAAH ", "Abstain from immorality"], ans: 2 },
            { q: "Fulfil the covenant of ALLAAH is the .... commandment. ", opts: ["5", "7", "8", "9"], ans: 3 },
            { q: "Which of these is not one of the commandments? ", opts: ["Be nice", "Beware of killing a soul ", "Give full measure ", "Be just"], ans: 0 },
            { q: "What is the meaning of حَصَّالَةٌ? ", opts: ["Moneybox ", "Keyholder ", "Luggage ", "Case"], ans: 0 },
            { q: "The word lantern in Arabic is:", opts: ["شُعْلَةٌ", "لَمْبَةٌ", "فَانُوسٌ", "مِصْبَاحٌ"], ans: 2 },
            { q: "Radio in Arabic is", opts: ["رَادِيو", "دُرُحٌ", "مِذْيَاعٌ", "A and C"], ans: 3 },
            { q: "\"The commandment \"\"َوَأَوفُو الكَيْل وَالمِيزَانَ بِالقِسْطِ\"\"  means\"", opts: ["Fulfil the covenant of ALLAAH ", "Give full measure and weight ", "Do not approach the property of the orphan", "Follow the straight path of ALLAAH "], ans: 1 },
            { q: "NATO stands for:", opts: ["North Africa Treaty Organisation ", "North America Treaty Organisation ", "North Atlantic Trade Organisation ", "North Atlantic Treaty Organisation "], ans: 3 },
            { q: "ECOWAS is an acronym for:", opts: ["Economics Community of West African States ", "Economy Community of West African States ", "Economic Community of West African States ", "Economics Communities of West African States "], ans: 2 },
            { q: "ECOMOG stands for:", opts: ["ECOWAS Monitoring Group ", "ECOWAS Monetary Group", "ECOWAS Mobility Group ", "None of the above"], ans: 0 },
            { q: "Which is odd? ", opts: ["FIFA", "NFF", "CAF", "FEPA"], ans: 3 },
            { q: "The seat of the Nigerian presidency is the ", opts: ["White House ", "Aso Rock Villa", "Chatham House ", "Bourdillon"], ans: 1 },
            { q: "Cutlery include the following except ", opts: ["Spoon", "Knife ", "Matches", "Fork"], ans: 2 },
            { q: "The money being paid to kidnappers for the release of their victims is called", opts: ["Bail", "Ransom ", "Compensation ", "Fine"], ans: 1 },
            { q: "The fastest means of transportation is", opts: ["Rail", "Road", "Air", "Water"], ans: 2 },
            { q: "The richest black man in the world is", opts: ["Femi Otedola", "Abdul Samad Rabiu (BUA) ", "Mike Adenuga", "Aliko Dangote"], ans: 3 },
            { q: "The Dangote Refinery is located in ", opts: ["Abuja", "Lagos", "Kano", "Portharcourt"], ans: 1 },
            { q: "The capital of Zamfara is", opts: ["Dutse", "Gusau", "Zamfara", "Damaturu "], ans: 1 },
            { q: "The fifth pillar of Islam is ", opts: ["Zakaat", "Hajj", "Sawm", "Shahadah"], ans: 1 },
            { q: "\"Which option correctly translates \"\"Antenna\"\" to Arabic?\"", opts: ["هَوَائِيٌّ", "تَقْوِيمٌ", "تِلْفَازٌ", "نَظَّارَةٌ"], ans: 0 },
            { q: "Mirror in Arabic is:", opts: ["مِرْآةٌ", "مِجْهَرٌ", "مِنْظَارٌ", "مَرْأَةٌ"], ans: 0 },
            { q: "\"\"\"Wall\"\" in Arabic is\"", opts: ["دُرُجٌ", "حَائِطٌ", "جِدَارٌ", "B and C"], ans: 3 },
            { q: "مَقْعَدٌ means ", opts: ["Seat", "Chair", "Table", "A and B"], ans: 3 },
            { q: "\"If it takes 10 minutes for a handkerchief to get dried on a sunny day, how long will it take 3 of such handkerchiefs to dry? \"", opts: ["30 minutes", "3 minutes ", "10 minutes ", "5 minutes "], ans: 2 },
            { q: "The National Security Adviser (NSA) is", opts: ["George Akume", "Nuhu Ribadu ", "Olayemi Cardoso", "Ben Kalu"], ans: 1 },
            { q: "Who is the Secretary to the Government of the Federation (SGF)? ", opts: ["Nasir El Rufai", "Ali Ndume", "Godswill Akpabio", "George Akume"], ans: 3 }
        ],
        hard: [
            { q: "The current Vice President of the Federal Republic of Nigeria is", opts: ["Seyi Tinubu", "Godswill Akpabio", "Femi Gbajabiamila", "Kashim Shettima"], ans: 3 },
            { q: "Who is the current Deputy Governor of Lagos state? ", opts: ["Obafemi Hamzat", "Joe Igbokwe", "Babajide Sanwo-olu", "Obasa"], ans: 0 },
            { q: "The Nigerian hero whose picture is on #500 note is", opts: ["Obafemi Awolowo ", "Murtala Muhammed ", "Nnamdi Azikiwe", "Tafawa Balewa"], ans: 2 },
            { q: "Daarul-Hikam Academy is situated in ..... Local Government Area of Lagos state. ", opts: ["Alimosho", "Ojo", "Badagry ", "Iba"], ans: 1 },
            { q: "The first of the ten commandments in Suratul-An'aam is", opts: ["Treat your parents well", "Be just and truthful ", "Join nothing in worship with ALLAAH ", "Abstain from immorality"], ans: 2 },
            { q: "Fulfil the covenant of ALLAAH is the .... commandment. ", opts: ["5", "7", "8", "9"], ans: 3 },
            { q: "Which of these is not one of the commandments? ", opts: ["Be nice", "Beware of killing a soul ", "Give full measure ", "Be just"], ans: 0 },
            { q: "What is the meaning of حَصَّالَةٌ? ", opts: ["Moneybox ", "Keyholder ", "Luggage ", "Case"], ans: 0 },
            { q: "The word lantern in Arabic is:", opts: ["شُعْلَةٌ", "لَمْبَةٌ", "فَانُوسٌ", "مِصْبَاحٌ"], ans: 2 },
            { q: "Radio in Arabic is", opts: ["رَادِيو", "دُرُحٌ", "مِذْيَاعٌ", "A and C"], ans: 3 },
            { q: "\"The commandment \"\"َوَأَوفُو الكَيْل وَالمِيزَانَ بِالقِسْطِ\"\"  means\"", opts: ["Fulfil the covenant of ALLAAH ", "Give full measure and weight ", "Do not approach the property of the orphan", "Follow the straight path of ALLAAH "], ans: 1 },
            { q: "NATO stands for:", opts: ["North Africa Treaty Organisation ", "North America Treaty Organisation ", "North Atlantic Trade Organisation ", "North Atlantic Treaty Organisation "], ans: 3 },
            { q: "ECOWAS is an acronym for:", opts: ["Economics Community of West African States ", "Economy Community of West African States ", "Economic Community of West African States ", "Economics Communities of West African States "], ans: 2 },
            { q: "ECOMOG stands for:", opts: ["ECOWAS Monitoring Group ", "ECOWAS Monetary Group", "ECOWAS Mobility Group ", "None of the above"], ans: 0 },
            { q: "Which is odd? ", opts: ["FIFA", "NFF", "CAF", "FEPA"], ans: 3 },
            { q: "The seat of the Nigerian presidency is the ", opts: ["White House ", "Aso Rock Villa", "Chatham House ", "Bourdillon"], ans: 1 },
            { q: "Cutlery include the following except ", opts: ["Spoon", "Knife ", "Matches", "Fork"], ans: 2 },
            { q: "The money being paid to kidnappers for the release of their victims is called", opts: ["Bail", "Ransom ", "Compensation ", "Fine"], ans: 1 },
            { q: "The fastest means of transportation is", opts: ["Rail", "Road", "Air", "Water"], ans: 2 },
            { q: "The richest black man in the world is", opts: ["Femi Otedola", "Abdul Samad Rabiu (BUA) ", "Mike Adenuga", "Aliko Dangote"], ans: 3 },
            { q: "The Dangote Refinery is located in ", opts: ["Abuja", "Lagos", "Kano", "Portharcourt"], ans: 1 },
            { q: "The capital of Zamfara is", opts: ["Dutse", "Gusau", "Zamfara", "Damaturu "], ans: 1 },
            { q: "The fifth pillar of Islam is ", opts: ["Zakaat", "Hajj", "Sawm", "Shahadah"], ans: 1 },
            { q: "\"Which option correctly translates \"\"Antenna\"\" to Arabic?\"", opts: ["هَوَائِيٌّ", "تَقْوِيمٌ", "تِلْفَازٌ", "نَظَّارَةٌ"], ans: 0 },
            { q: "Mirror in Arabic is:", opts: ["مِرْآةٌ", "مِجْهَرٌ", "مِنْظَارٌ", "مَرْأَةٌ"], ans: 0 },
            { q: "\"\"\"Wall\"\" in Arabic is\"", opts: ["دُرُجٌ", "حَائِطٌ", "جِدَارٌ", "B and C"], ans: 3 },
            { q: "مَقْعَدٌ means ", opts: ["Seat", "Chair", "Table", "A and B"], ans: 3 },
            { q: "\"If it takes 10 minutes for a handkerchief to get dried on a sunny day, how long will it take 3 of such handkerchiefs to dry? \"", opts: ["30 minutes", "3 minutes ", "10 minutes ", "5 minutes "], ans: 2 },
            { q: "The National Security Adviser (NSA) is", opts: ["George Akume", "Nuhu Ribadu ", "Olayemi Cardoso", "Ben Kalu"], ans: 1 },
            { q: "Who is the Secretary to the Government of the Federation (SGF)? ", opts: ["Nasir El Rufai", "Ali Ndume", "Godswill Akpabio", "George Akume"], ans: 3 }
        ]
    },
    physics: {
        easy: [
            { q: "What force pulls objects toward Earth?", opts: ["Magnetism", "Friction", "Gravity", "Electricity"], ans: 2 },
            { q: "Which type of energy does a moving object have?", opts: ["Potential energy", "Chemical energy", "Kinetic energy", "Heat energy"], ans: 2 },
            { q: "What is the unit of force?", opts: ["Joule", "Newton", "Watt", "Pascal"], ans: 1 },
            { q: "Which simple machine is a seesaw?", opts: ["Pulley", "Lever", "Wheel and axle", "Inclined plane"], ans: 1 },
            { q: "What happens to the speed of an object if no forces act on it?", opts: ["It stops", "It speeds up", "It stays constant", "It falls"], ans: 2 },
            { q: "Which form of energy is stored in a stretched rubber band?", opts: ["Kinetic", "Sound", "Elastic potential", "Light"], ans: 2 },
            { q: "What is used to measure temperature?", opts: ["Barometer", "Thermometer", "Voltmeter", "Ammeter"], ans: 1 },
            { q: "Which wave can travel through space?", opts: ["Sound wave", "Water wave", "Light wave", "Seismic wave"], ans: 2 },
            { q: "What is the push or pull on an object called?", opts: ["Energy", "Mass", "Force", "Power"], ans: 2 },
            { q: "Which material is attracted to a magnet?", opts: ["Plastic", "Wood", "Iron", "Glass"], ans: 2 },
            { q: "What type of mirror shows a clear reflection?", opts: ["Rough mirror", "Plane mirror", "Paper", "Rubber"], ans: 1 },
            { q: "What happens to sound in a vacuum?", opts: ["It speeds up", "It slows down", "It cannot travel", "It echoes"], ans: 2 },
            { q: "Which energy source gives us light and heat from the Sun?", opts: ["Nuclear energy", "Wind energy", "Solar energy", "Sound energy"], ans: 2 },
            { q: "What is the boiling point of water in Celsius at sea level?", opts: ["50°C", "100°C", "0°C", "212°C"], ans: 1 },
            { q: "Which quantity tells how heavy something feels due to gravity?", opts: ["Mass", "Volume", "Weight", "Density"], ans: 2 },
            { q: "What carries electric current in wires?", opts: ["Protons", "Neutrons", "Electrons", "Photons"], ans: 2 },
            { q: "Which simple machine helps lift a bucket from a well?", opts: ["Lever", "Pulley", "Wedge", "Screw"], ans: 1 },
            { q: "What is friction?", opts: ["A pulling force", "A pushing force", "A force that opposes motion", "Stored energy"], ans: 2 },
            { q: "Which property tells how tightly matter is packed?", opts: ["Speed", "Density", "Temperature", "Voltage"], ans: 1 },
            { q: "What is energy measured in?", opts: ["Watts", "Newtons", "Joules", "Amperes"], ans: 2 }
        ],
        medium: [
            { q: "Which Newton's law states that force equals mass times acceleration?", opts: ["First law", "Second law", "Third law", "Law of gravitation"], ans: 1 },
            { q: "What happens to pressure when the area decreases for the same force?", opts: ["It decreases", "It increases", "It stays same", "It becomes zero"], ans: 1 },
            { q: "Which wave property determines pitch of a sound?", opts: ["Amplitude", "Frequency", "Speed", "Wavelength"], ans: 1 },
            { q: "What is the formula for density?", opts: ["Mass × Volume", "Mass ÷ Volume", "Volume ÷ Mass", "Force ÷ Area"], ans: 1 },
            { q: "Which lens converges light rays?", opts: ["Concave lens", "Convex lens", "Plane mirror", "Flat glass"], ans: 1 },
            { q: "What type of heat transfer occurs in liquids and gases?", opts: ["Conduction", "Radiation", "Convection", "Reflection"], ans: 2 },
            { q: "What is the SI unit of electric current?", opts: ["Volt", "Ampere", "Ohm", "Watt"], ans: 1 },
            { q: "Which energy transformation occurs in a flashlight?", opts: ["Light to heat", "Chemical to light", "Sound to light", "Heat to motion"], ans: 1 },
            { q: "What is momentum equal to?", opts: ["Mass × velocity", "Force × time", "Mass ÷ velocity", "Velocity ÷ mass"], ans: 0 },
            { q: "Which color of light has the shortest wavelength?", opts: ["Red", "Green", "Blue", "Violet"], ans: 3 },
            { q: "What does a transformer change in an electric circuit?", opts: ["Current only", "Resistance only", "Voltage", "Frequency"], ans: 2 },
            { q: "Which simple machine is a ramp?", opts: ["Wedge", "Inclined plane", "Lever", "Pulley"], ans: 1 },
            { q: "What is the acceleration due to gravity on Earth (approx)?", opts: ["5 m/s²", "9.8 m/s²", "15 m/s²", "20 m/s²"], ans: 1 },
            { q: "What happens to kinetic energy when speed doubles?", opts: ["It doubles", "It triples", "It quadruples", "It halves"], ans: 2 },
            { q: "Which instrument measures atmospheric pressure?", opts: ["Thermometer", "Barometer", "Voltmeter", "Hygrometer"], ans: 1 },
            { q: "What type of mirror is used in car side mirrors?", opts: ["Plane", "Convex", "Concave", "Flat"], ans: 1 },
            { q: "Which law states that every action has an equal and opposite reaction?", opts: ["First law", "Second law", "Third law", "Ohm's law"], ans: 2 },
            { q: "What is electrical resistance measured in?", opts: ["Ohms", "Volts", "Amps", "Watts"], ans: 0 },
            { q: "Which factor increases gravitational force?", opts: ["Greater distance", "Smaller masses", "Larger masses", "Zero mass"], ans: 2 },
            { q: "What type of energy is stored in a raised object?", opts: ["Thermal", "Kinetic", "Gravitational potential", "Sound"], ans: 2 }
        ],
        hard: [
            { q: "What is the universal gravitational constant symbol?", opts: ["g", "G", "k", "R"], ans: 1 },
            { q: "Which equation represents Ohm's Law?", opts: ["V = IR", "P = IV", "F = ma", "E = mc²"], ans: 0 },
            { q: "What is the work done when force is applied at 90 degrees to motion?", opts: ["Maximum", "Half", "Zero", "Double"], ans: 2 },
            { q: "Which phenomenon explains bending of light in water?", opts: ["Reflection", "Diffraction", "Refraction", "Dispersion"], ans: 2 },
            { q: "What is the unit of power?", opts: ["Joule", "Newton", "Watt", "Pascal"], ans: 2 },
            { q: "Which wave type requires a medium to travel?", opts: ["Electromagnetic", "Light", "Mechanical", "Radio"], ans: 2 },
            { q: "What is the escape velocity dependent on?", opts: ["Color of object", "Mass and radius of planet", "Temperature", "Speed of light"], ans: 1 },
            { q: "Which law explains conservation of energy?", opts: ["Newton's first law", "Law of inertia", "First law of thermodynamics", "Coulomb's law"], ans: 2 },
            { q: "What is capacitance measured in?", opts: ["Farads", "Henrys", "Teslas", "Webers"], ans: 0 },
            { q: "Which quantity is a vector?", opts: ["Speed", "Distance", "Velocity", "Energy"], ans: 2 },
            { q: "What happens to pressure with increasing depth in a fluid?", opts: ["Decreases", "Remains constant", "Increases", "Becomes zero"], ans: 2 },
            { q: "Which optical defect is corrected by a concave lens?", opts: ["Hyperopia", "Myopia", "Astigmatism", "Presbyopia"], ans: 1 },
            { q: "What is the frequency of a wave with period 0.5 s?", opts: ["0.5 Hz", "1 Hz", "2 Hz", "4 Hz"], ans: 2 },
            { q: "Which field surrounds a moving electric charge?", opts: ["Gravitational field", "Magnetic field", "Thermal field", "Sound field"], ans: 1 },
            { q: "What is the SI unit of pressure?", opts: ["Pascal", "Newton", "Joule", "Watt"], ans: 0 },
            { q: "Which principle explains buoyant force?", opts: ["Pascal's principle", "Bernoulli's principle", "Archimedes' principle", "Hooke's law"], ans: 2 },
            { q: "What is the relationship between wavelength and frequency?", opts: ["Directly proportional", "Inversely proportional", "Equal", "Unrelated"], ans: 1 },
            { q: "Which quantity remains constant in uniform circular motion?", opts: ["Velocity", "Speed", "Acceleration", "Force direction"], ans: 1 },
            { q: "What type of energy is associated with random motion of particles?", opts: ["Kinetic", "Thermal", "Mechanical", "Nuclear"], ans: 1 },
            { q: "Which equation calculates gravitational force between two masses?", opts: ["F = ma", "F = Gm1m2/r2", "P = IV", "E = hf"], ans: 1 }
        ]
    },
}

// State
let currentQuiz = [];
let currentQuestion = 0;
let score = 0;
let selectedTopic = '';
let selectedDifficulty = 'medium';
let selectedAnswers = [];
let timeRemaining = 0;
let timerInterval = null;
let startTime = 0;

let studentName = '';
let tabSwitchCount = 0;
let examSubmitted = false;
let examStarted = false;

// Progress Bar Helper
function updateProgressBar(current, total) {
    const bar = document.getElementById('progressBarFill');
    if (bar && total > 0) {
        const percent = Math.max(0, Math.min(100, (current / total) * 100));
        bar.style.width = percent + '%';
    }
}

// Elements
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');

const numQuestionsInput = document.getElementById('numQuestions');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const topicBtns = document.querySelectorAll('.topic-btn');
const startBtn = document.getElementById('startbtn');
const nextBtn = document.getElementById('nextBtn');
const quitBtn = document.getElementById('quitBtn');
const restartBtn = document.getElementById('restartBtn');
const questionSlider = document.getElementById('questionSlider');

// Event Listeners
topicBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        topicBtns.forEach(b => b.classList.remove('selected'))
        btn.classList.add('selected')
        selectedTopic = btn.dataset.topic
    });
});

difficultyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        difficultyBtns.forEach(b => b.classList.remove('selected'))
        btn.classList.add('selected')
        selectedDifficulty = btn.dataset.difficulty
    });
});

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
quitBtn.addEventListener('click', quitQuiz);
restartBtn.addEventListener('click', restartQuiz);
const prevBtn = document.getElementById('prevBtn');
prevBtn.addEventListener('click', prevQuestion);

// Question slider navigation
questionSlider.addEventListener('input', (e) => {
    const targetQuestion = parseInt(e.target.value, 10) - 1;
    if (!Number.isNaN(targetQuestion) && targetQuestion !== currentQuestion && targetQuestion >= 0 && targetQuestion < currentQuiz.length) {
        currentQuestion = targetQuestion;
        displayQuestion();
    }
});

// Anti-cheat: Tab switch detection
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && !examSubmitted && examStarted) {
        const attemptsRemaining = Math.max(0, 2 - tabSwitchCount);
        const message = `You are attempting to leave the exam tab. You have ${attemptsRemaining} attempts remaining before your exam is submitted automatically. Do you want to continue?`;
        const proceed = confirm(message);

        if (proceed) {
            tabSwitchCount++;
            if (tabSwitchCount >= 3) {
                finishQuiz();
            }
        } else {
            setTimeout(() => {
                if (typeof window.focus === 'function') {
                    window.focus();
                }
            }, 300);
        }
    }
});

window.onbeforeunload = function () {
    if (!examSubmitted && examStarted) {
        return "Your exam is still in progress. Leaving will submit your test.";
    }
};

function startQuiz() {
    // === ADD THIS ===
    studentName = document.getElementById('studentName').value.trim();
    if (!studentName) {
        alert('Please enter your name!');
        return;
    }

    if (!selectedTopic) {
        alert('Please Select a Subject')
        return;
    }

    const numQuestion = parseInt(numQuestionsInput.value)
    if (numQuestion < 5 || numQuestion > 40) {
        alert('Please enter a number between 5 and 40!');
        return;
    }

    // Get questions
    const topicQuestions = quizData[selectedTopic][selectedDifficulty];
    currentQuiz = [];

    while (currentQuiz.length < numQuestion && currentQuiz.length < topicQuestions.length) {
        const randomQuestion = topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
        if (!currentQuiz.includes(randomQuestion)) {
            currentQuiz.push(randomQuestion);
        }
    }

    // ✅ FIX: Shuffle options ONCE here
    currentQuiz = currentQuiz.map(q => {
        const shuffled = q.opts
            .map((option, index) => ({ option, originalIndex: index }))
            .sort(() => Math.random() - 0.5);

        return {
            ...q,
            shuffledOptions: shuffled
        };
    });

    currentQuestion = 0;
    score = 0;
    selectedAnswers = new Array(currentQuiz.length).fill(null);
    startTime = Date.now();

    // Start timer
    timeRemaining = currentQuiz.length * 37.5;
    startTimer();

    tabSwitchCount = 0;
    examStarted = true;
    showScreen('quiz');
    displayQuestion();
}
function startTimer() {
    const timerEl = document.getElementById('timer');
    timerInterval = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (timeRemaining <= 30) {
            timerEl.classList.add('warning');
        } else {
            timerEl.classList.remove('warning');
        }

        if (timeRemaining <= 0) {
            finishQuiz();
        }
    }, 1000);
}

function displayQuestion() {
    const question = currentQuiz[currentQuestion];

    document.getElementById('questionText').textContent = question.q;
    document.getElementById('currentQuestion').textContent = currentQuestion + 1;
    document.getElementById('totalQuestions').textContent = currentQuiz.length;
    updateProgressBar(currentQuestion + 1, currentQuiz.length);

    // Sync slider
    questionSlider.value = currentQuestion + 1;
    questionSlider.max = currentQuiz.length;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    const shuffledOptions = question.shuffledOptions;

    shuffledOptions.forEach(({ option, originalIndex }) => {
        const optionWrapper = document.createElement('label');
        optionWrapper.className = 'option';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'answer';
        radio.value = originalIndex;

        if (selectedAnswers[currentQuestion] === originalIndex) {
            radio.checked = true;
            optionWrapper.classList.add('selected');
        }

        radio.addEventListener('change', () => {
            selectedAnswers[currentQuestion] = originalIndex;
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });

            optionWrapper.classList.add('selected');

            // Show prompt if this is the last question
            if (currentQuestion === currentQuiz.length - 1) {
                setTimeout(() => {
                    alert('You have answered the final question. Click "Submit Exam" when ready.');
                }, 500);
            }
        });

        const textSpan = document.createElement('span');
        textSpan.textContent = option;

        optionWrapper.appendChild(radio);
        optionWrapper.appendChild(textSpan);

        optionsContainer.appendChild(optionWrapper);
    });

    nextBtn.textContent =
        currentQuestion === currentQuiz.length - 1
            ? 'Submit Exam'
            : 'Next Question';

    // Previous button control
    if (prevBtn) {
        prevBtn.disabled = currentQuestion === 0;
    }
}

function nextQuestion() {
    if (currentQuestion < currentQuiz.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        const confirmSubmit = confirm('Are you sure you want to submit your exam? You cannot change your answers after submission.');
        if (confirmSubmit) {
            finishQuiz();
        }
    }
}

function finishQuiz() {
    // === ADD THIS ===
    if (examSubmitted) return; // Prevent multiple submissions
    examSubmitted = true;
    // === END ADD ===

    clearInterval(timerInterval);
    examStarted = false;
    calculateScore();
    const classMapping = {
        easy: 'JSS 1',
        medium: 'JSS 2',
        hard: 'JSS 3'
    };
    const classLevel = classMapping[selectedDifficulty] || 'JSS 2';
    saveScoreToServer(studentName, score, classLevel, currentQuiz.length);
    showScreen('results');
}

function calculateScore() {
    score = 0;
    selectedAnswers.forEach((answer, index) => {
        if (answer === currentQuiz[index].ans) {
            score++;
        }
    });

    const scaledScore = Math.round((score / currentQuiz.length) * 60);
    const percentage = Math.round((score / currentQuiz.length) * 100);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    let message = '';
    let passed = false;
    if (percentage === 100) {
        message = `🌟 Excellent Performance!<br>Grade: A (Distinction)`;
        passed = true;
    } else if (percentage >= 80) {
        message = `🎉 Very Good Performance.<br>Grade: A`;
        passed = true;
    } else if (percentage >= 70) {
        message = `👍 Good Performance.<br>Grade: B`;
        passed = true;
    } else if (percentage >= 60) {
        message = `✔ Fair Performance.<br>Grade: C`;
        passed = true;
    } else if (percentage >= 50) {
        message = `⚠ Pass.<br>Grade: D`;
        passed = true;
    } else {
        message = `❌ Fail.<br>Grade: F`;
        passed = false;
    }
    document.getElementById('finalScore').textContent = `${scaledScore}/60`;
    document.getElementById('scoreMessage').innerHTML = message;
    document.getElementById('correctCount').textContent = score;
    document.getElementById('wrongCount').textContent = currentQuiz.length - score;
    document.getElementById('percentage').textContent = `${percentage}%`;
    document.getElementById('timeTaken').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('topicResult').textContent = selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1);

    const classMapping = {
        easy: 'JSS 1',
        medium: 'JSS 2',
        hard: 'JSS 3'
    };
    document.getElementById('studentNameResult').textContent = studentName || 'N/A';
    document.getElementById('classResult').textContent = classMapping[selectedDifficulty] || 'JSS 2';

    // Play sound and show effect
    setTimeout(() => {
        if (passed) {
            launchConfetti();
            const passSound = document.getElementById('passSound');
            if (passSound) {
                passSound.pause();
                passSound.currentTime = 0;
                passSound.volume = 1;
                passSound.play().catch(() => { });
            }
        } else if (percentage < 50) {
            if (typeof launchFailEffect === 'function') launchFailEffect();
            const failSound = document.getElementById('failSound');
            if (failSound) {
                failSound.pause();
                failSound.currentTime = 0;
                failSound.volume = 1;
                failSound.play().catch(() => { });
            }
        }
    }, 100);
}

// === ADD THIS ===
function saveScoreToServer(name, score, classLevel, totalQuestions) {
    if (!window.db || !window.addDoc || !window.collection) {
        console.warn('Firebase not ready');
        return;
    }

    const scoreOver60 = Math.round((score / totalQuestions) * 60);
    const percentage = Math.round((score / totalQuestions) * 100);

    window.addDoc(window.collection(window.db, 'cbt_scores'), {
        name: name,
        class: classLevel,
        subject: selectedTopic,
        score: score,
        scoreOver60: scoreOver60,
        percentage: percentage,
        totalQuestions: totalQuestions,
        timestamp: new Date()
    }).then(() => {
        console.log('✅ Score saved successfully');
    }).catch((error) => {
        console.error('❌ Error saving score:', error);
    });
}
// View saved scores in Firebase Console → Firestore → cbt_scores
// === END ADD ===

function quitQuiz() {
    if (confirm('Are you sure you want to quit? Your progress will be lost.')) {
        clearInterval(timerInterval);
        restartQuiz();
    }
}

function restartQuiz() {
    studentName = '';
    tabSwitchCount = 0;
    examSubmitted = false;
    examStarted = false;
    document.body.style.pointerEvents = ''; // Unlock interaction

    currentQuiz = [];
    currentQuestion = 0;
    score = 0;
    selectedTopic = '';
    selectedDifficulty = 'medium';
    selectedAnswers = [];
    timeRemaining = 0;
    clearInterval(timerInterval);

    // Reset UI
    topicBtns.forEach(btn => btn.classList.remove('selected'));
    difficultyBtns.forEach(btn => btn.classList.remove('selected'));
    difficultyBtns[1].classList.add('selected');
    numQuestionsInput.value = '40';
    document.getElementById('studentName').value = '';
    // === END ADD ===

    showScreen('start');
}

function showScreen(screen) {
    startScreen.classList.remove('active');
    quizScreen.classList.remove('active');
    resultsScreen.classList.remove('active');

    if (screen === 'start') startScreen.classList.add('active');
    else if (screen === 'quiz') quizScreen.classList.add('active');
    else if (screen === 'results') resultsScreen.classList.add('active');

}

// Initialize
difficultyBtns[1].classList.add('selected');



function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = [
        '#4F46E5', // Indigo  
        '#ffd000', // Soft Blue  
        '#8B5CF6', // Purple  
        '#FFD700', // Gold  
        '#F9FAFB', // Soft White  
    ];
    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,  // random across top
            y: -20,                            // start above screen
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * 2,  // small side movement
            speedY: Math.random() * 3 + 2,     // falling speed
            gravity: 0.05,
            rotation: Math.random() * 360
        });
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confettiPieces.forEach((piece, index) => {
            piece.speedY += piece.gravity;
            piece.x += piece.speedX;
            piece.y += piece.speedY;
            piece.rotation += 5;

            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate(piece.rotation * Math.PI / 180);
            ctx.fillStyle = piece.color;
            ctx.beginPath();
            ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (piece.y > canvas.height) {
                confettiPieces.splice(index, 1);
            }
        });

        if (confettiPieces.length > 0) {
            requestAnimationFrame(update);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    update();
}

const guidelineModal = document.getElementById('guidelineModal');
const confirmBtn = document.getElementById('confirmGuidelines');

confirmBtn.addEventListener('click', () => {
    guidelineModal.style.display = 'none';
});

const toggleReviewBtn = document.getElementById('toggleReviewBtn');
const quizReview = document.getElementById('quizReview');

toggleReviewBtn.addEventListener('click', () => {

    const isVisible = quizReview.style.display === 'block';

    if (quizReview.style.display === 'none') {
        renderQuizReview(); // Render each time user opens it
        quizReview.style.display = 'block';
    } else {
        quizReview.style.display = 'none';
    }

    quizReview.style.display = isVisible ? 'none' : 'block';
    toggleReviewBtn.textContent = isVisible ? '⬇ Show Question Review ⬇' : '⬆ Hide Question Review ⬆';
});


function renderQuizReview() {
    quizReview.innerHTML = ''; // Clear previous content

    currentQuiz.forEach((question, qIndex) => {
        const questionWrapper = document.createElement('div');
        questionWrapper.style.marginBottom = '15px';
        questionWrapper.style.padding = '8px';
        questionWrapper.style.borderRadius = '5px';
        questionWrapper.style.backgroundColor = '#f9f9f9'; // subtle background
        questionWrapper.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';

        const questionTitle = document.createElement('div');
        questionTitle.textContent = `${qIndex + 1}. ${question.q}`;
        questionTitle.style.fontWeight = '500';
        questionTitle.style.marginBottom = '6px';
        questionWrapper.appendChild(questionTitle);

        question.opts.forEach((option, oIndex) => {
            const optionDiv = document.createElement('div');
            optionDiv.textContent = option;
            optionDiv.style.padding = '4px 8px';
            optionDiv.style.borderRadius = '4px';
            optionDiv.style.marginBottom = '3px';
            optionDiv.style.fontSize = '0.95rem';
            optionDiv.style.transition = 'background 0.3s';

            const selected = selectedAnswers[qIndex];
            const correct = question.ans;

            if (oIndex === correct) {
                // correct answer, soft highlight
                optionDiv.style.backgroundColor = '#e0f2f1'; // soft greenish
                optionDiv.style.fontWeight = '500';
            }

            if (selected !== undefined && oIndex === selected && selected !== correct) {
                // user chose wrong, subtle highlight
                optionDiv.style.backgroundColor = '#fce4ec'; // soft pinkish
            }

            questionWrapper.appendChild(optionDiv);
        });

        quizReview.appendChild(questionWrapper);
    });
}


function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
}

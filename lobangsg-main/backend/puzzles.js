const puzzles = [
    // Original Puzzles
    {
        id: 1, groups: { "PLANETS": ["Mercury", "Venus", "Earth", "Mars"], "GAS GIANTS": ["Jupiter", "Saturn", "Uranus", "Neptune"], "THINGS IN THE SKY": ["Sun", "Moon", "Stars", "Comet"], "SPACE EXPLORATION": ["Asteroid", "Meteor", "Rocket", "Pluto"] }
    },
    {
        id: 2, groups: { "PARTS OF A COMPUTER": ["Mouse", "Screen", "Keyboard", "Speaker"], "APPLE PRODUCTS": ["Watch", "Vision", "Mac", "iPhone"], "WEB BROWSERS": ["Safari", "Chrome", "Edge", "Firefox"], "TECH GIANTS": ["Google", "Meta", "Amazon", "Microsoft"] }
    },
    {
        id: 3, groups: { "CONDIMENTS": ["Ketchup", "Mustard", "Mayo", "Relish"], "TYPES OF BREAD": ["Rye", "Pita", "Sourdough", "Ciabatta"], "SANDWICHES": ["Club", "Reuben", "BLT", "Cuban"], "PIZZA TOPPINGS": ["Pepperoni", "Olive", "Mushroom", "Onion"] }
    },
    // New Puzzles
    {
        id: 4, groups: { "SOCIAL MEDIA": ["TikTok", "X", "BeReal", "Threads"], "VIDEO GAMES": ["Fortnite", "Zelda", "Stardew", "Madden"], "STREAMING SERVICES": ["Netflix", "Hulu", "Max", "Disney"], "EMOJIS": ["Smiley", "Heart", "ThumbsUp", "Tears"] }
    },
    {
        id: 5, groups: { "DOG BREEDS": ["Poodle", "Beagle", "Boxer", "Pug"], "FARM ANIMALS": ["Cow", "Pig", "Goat", "Sheep"], "JUNGLE CATS": ["Lion", "Tiger", "Jaguar", "Leopard"], "MYTHICAL CREATURES": ["Dragon", "Unicorn", "Griffin", "Phoenix"] }
    },
    {
        id: 6, groups: { "THINGS IN A PENCIL CASE": ["Eraser", "Ruler", "Sharpener", "Pen"], "MATH SUBJECTS": ["Algebra", "Geometry", "Calculus", "Trig"], "ART SUPPLIES": ["Paint", "Clay", "Charcoal", "Pastel"], "SCHOOLS OF THOUGHT": ["Stoicism", "Hedonism", "Utilitarian", "Existential"] }
    },
    {
        id: 7, groups: { "WEATHER PHENOMENA": ["Rain", "Snow", "Wind", "Hail"], "TYPES OF CLOUDS": ["Cirrus", "Stratus", "Cumulus", "Nimbus"], "NATURAL DISASTERS": ["Tsunami", "Tornado", "Earthquake", "Volcano"], "UNITS OF TEMPERATURE": ["Kelvin", "Celsius", "Rankine", "Fahrenheit"] }
    },
    {
        id: 8, groups: { "MUSICAL INSTRUMENTS": ["Violin", "Piano", "Flute", "Drums"], "ELEMENTS OF MUSIC": ["Rhythm", "Melody", "Harmony", "Tempo"], "FAMOUS COMPOSERS": ["Bach", "Mozart", "Beethoven", "Chopin"], "MUSIC GENRES": ["Rock", "Jazz", "Pop", "Classical"] }
    },
    {
        id: 9, groups: { "BOARD GAMES": ["Monopoly", "Clue", "Risk", "Catan"], "CARD GAMES": ["Poker", "Solitaire", "Hearts", "Bridge"], "THINGS ON A CHESSBOARD": ["King", "Queen", "Rook", "Pawn"], "SPORTS WITH A BALL": ["Soccer", "Tennis", "Baseball", "Cricket"] }
    },
    {
        id: 10, groups: { "KITCHEN APPLIANCES": ["Blender", "Toaster", "Microwave", "Kettle"], "COOKING VERBS": ["Bake", "Fry", "Boil", "Roast"], "TYPES OF PASTA": ["Penne", "Fusilli", "Spaghetti", "Linguine"], "FRUITS": ["Apple", "Banana", "Cherry", "Grape"] }
    },
    // Add even more puzzles here following the same format!
];

// This part is crucial: it automatically creates the flat 'words' list for each puzzle.
puzzles.forEach(puzzle => {
    puzzle.words = Object.values(puzzle.groups).flat();
});

module.exports = puzzles;
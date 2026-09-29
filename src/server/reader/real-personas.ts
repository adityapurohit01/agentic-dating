import { Persona } from "./schemas";

export const REAL_PERSONAS: Record<string, Persona> = {
  real_satyanadella: {
    identity: {
      name: "Satya Nadella",
      headline: "Chairman and Chief Executive Officer at Microsoft",
      location: "Bellevue, WA",
      current_role: "Chairman & CEO",
      company: "Microsoft",
      education: ["M.S. in Computer Science, University of Wisconsin–Milwaukee", "MBA, University of Chicago Booth"],
    },
    summary: "Chairman and CEO of Microsoft. Focused on transforming enterprise technology and AI platforms with an empathetic, growth-mindset leadership philosophy. Avid cricket enthusiast and reader of American and Russian poetry.",
    needs: [
      { need: "Mutual respect for high-responsibility global stewardship", kind: "inferred", weight: 5, confidence: 0.9, evidence: ["li:exp:1", "li:about"] },
      { need: "Grounded intellectual and empathetic communication", kind: "stated", weight: 4, confidence: 0.85, evidence: ["li:about", "ig:bio"] },
      { need: "Appreciation for quiet downtime, poetry, and sports", kind: "inferred", weight: 3, confidence: 0.8, evidence: ["ig:post:1"] },
    ],
    hobbies: [
      { name: "Cricket Analytics & Match Watching", confidence: 0.95, evidence: ["ig:post:1", "li:about"] },
      { name: "Reading Classic Poetry & Philosophy", confidence: 0.9, evidence: ["li:about"] },
      { name: "Morning Running & Fitness", confidence: 0.85, evidence: ["ig:bio"] },
    ],
    interests: [
      { name: "Human-Centered AI & Cloud Computing", confidence: 0.95, evidence: ["li:exp:1"] },
      { name: "Growth Mindset & Empathetic Culture", confidence: 0.9, evidence: ["li:about"] },
    ],
    values: [
      { name: "Empathy as a Core Innovation Driver", confidence: 0.95, evidence: ["li:about"] },
      { name: "Humility and Lifelong Learning", confidence: 0.9, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Early morning riser with structured meditation, reading, and continuous global synchronization.",
      social_energy: "Measured ambivert: calm one-on-one presence, reflective and attentive listener.",
      travel: "Frequent global travel for summits and partner engagements, grounded by home sanctuary.",
      fitness: "Consistent daily cardiovascular fitness and morning running.",
      food: "Appreciates simple south Indian cuisine and tea rituals.",
      other: "Prefers serene settings over frenetic nightlife.",
    },
    ambition: {
      level: "Very High",
      direction: "Democratizing AI access and empowering every organization on the planet.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Subtle, warm, and self-effacing.",
      evidence: ["li:about"],
    },
    communication_style: {
      summary: "Reflective, philosophical, uses analogies from literature and cricket, never raises voice.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Values emotional calm and shared dedication to purposeful living", confidence: 0.8, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Demanding 24/7 global responsibilities can constrain spontaneous weekday plans", why: "CEO of a multi-trillion dollar company", evidence: ["li:exp:1"] },
      { point: "Highly measured conversational tempo may test impatient partners", why: "Deeply reflective speaking cadence", evidence: ["li:about"] },
    ],
    green_flags: [
      { flag: "Extraordinary emotional stability and attentive listening", evidence: ["li:about"] },
      { flag: "Longstanding loyalty and institutional dedication", evidence: ["li:exp:1"] },
    ],
    unknowns: [
      "Preferred weekend decompression routines outside public appearances",
      "Casual culinary preferences during vacations",
    ],
  },

  real_sundarpichai: {
    identity: {
      name: "Sundar Pichai",
      headline: "CEO at Alphabet and Google",
      location: "Los Altos Hills, CA",
      current_role: "CEO",
      company: "Alphabet & Google",
      education: ["M.S. in Materials Science, Stanford University", "MBA, Wharton School of Business"],
    },
    summary: "Chief Executive Officer of Alphabet and Google. Engineering-minded leader championing universal access to information. Passionate about cricket, European football, and early morning contemplation.",
    needs: [
      { need: "Peaceful sanctuary away from corporate glare", kind: "inferred", weight: 5, confidence: 0.9, evidence: ["li:exp:1", "ig:bio"] },
      { need: "Mutual love for curiosity-driven inquiry and technology", kind: "stated", weight: 4, confidence: 0.85, evidence: ["li:about"] },
      { need: "Low-drama, steady emotional equilibrium", kind: "inferred", weight: 4, confidence: 0.8, evidence: ["li:about"] },
    ],
    hobbies: [
      { name: "Cricket & Premier League Football", confidence: 0.9, evidence: ["ig:post:1"] },
      { name: "Reading World History & Technological Milestones", confidence: 0.85, evidence: ["li:about"] },
      { name: "Walking & Outdoor Pondering", confidence: 0.8, evidence: ["ig:bio"] },
    ],
    interests: [
      { name: "Universal Access to Information", confidence: 0.95, evidence: ["li:exp:1"] },
      { name: "Quantum Computing & Frontier AI Models", confidence: 0.9, evidence: ["li:about"] },
    ],
    values: [
      { name: "Humility and Calm Under Fire", confidence: 0.9, evidence: ["li:about"] },
      { name: "Long-Term Stewardship", confidence: 0.85, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Early riser who begins the day reading newspapers with traditional tea.",
      social_energy: "Thoughtful introvert who values intimate, high-substance conversation.",
      travel: "Regular international travel for engineering centers and international summits.",
      fitness: "Daily walking routines and light fitness.",
      food: "Vegetarian comfort food, tea connoisseur.",
      other: "Protects family privacy fiercely.",
    },
    ambition: {
      level: "Very High",
      direction: "Organizing the world's information and advancing human knowledge.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Gentle, wry, understated.",
      evidence: ["li:about"],
    },
    communication_style: {
      summary: "Calm, analytical, consensus-oriented, articulates complex nuances cleanly.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Seeks genuine warmth and intellectual curiosity over performative status", confidence: 0.85, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "High security perimeter and public scrutiny", why: "Global public figure", evidence: ["li:exp:1"] },
      { point: "Prefers quiet evenings at home over high-profile social circuit", why: "Introverted recharge preference", evidence: ["ig:bio"] },
    ],
    green_flags: [
      { flag: "Unshakable equanimity in high-stress situations", evidence: ["li:about"] },
      { flag: "Consistent respectfulness across all interpersonal boundaries", evidence: ["li:exp:1"] },
    ],
    unknowns: [
      "Weekend home improvement or tinkering hobbies",
      "Musical tastes beyond classical and ambient",
    ],
  },

  real_sama: {
    identity: {
      name: "Sam Altman",
      headline: "CEO at OpenAI | Co-Founder Tools For Humanity",
      location: "San Francisco, CA",
      current_role: "CEO",
      company: "OpenAI",
      education: ["Stanford University, Computer Science (attended)"],
    },
    summary: "Chief Executive Officer at OpenAI. Focused on accelerating human capability through beneficial artificial general intelligence, clean nuclear fusion, and biotech longevity. Passionate about hiking, fast cars, and ambitious ideas.",
    needs: [
      { need: "Partner with rapid mental velocity and independent vision", kind: "inferred", weight: 5, confidence: 0.9, evidence: ["li:about", "ig:bio"] },
      { need: "Comfort with intense public spotlight and exponential ambition", kind: "inferred", weight: 5, confidence: 0.85, evidence: ["li:exp:1"] },
      { need: "Shared love for nature retreats and direct, concise dialogue", kind: "stated", weight: 4, confidence: 0.8, evidence: ["ig:post:1"] },
    ],
    hobbies: [
      { name: "Hiking in Big Sur & Napa Valleys", confidence: 0.9, evidence: ["ig:post:1"] },
      { name: "Sports Car Driving & Track Days", confidence: 0.85, evidence: ["li:about"] },
      { name: "Reading Economic History & Sci-Fi", confidence: 0.85, evidence: ["li:about"] },
    ],
    interests: [
      { name: "Artificial General Intelligence Safety", confidence: 0.95, evidence: ["li:exp:1"] },
      { name: "Fusion Energy (Helion) & Longevity", confidence: 0.9, evidence: ["li:about"] },
    ],
    values: [
      { name: "High Agency and Decisiveness", confidence: 0.95, evidence: ["li:about"] },
      { name: "Long-Horizon Civilizational Optimism", confidence: 0.9, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Intense variable schedule punctuated by deep focus sprints and nature retreats.",
      social_energy: "Selective ambivert: energized by brilliant thinkers, avoids routine mixers.",
      travel: "Frequent global policy tours and Silicon Valley/Napa commutes.",
      fitness: "High-intensity training, hiking rugged coastal ridges.",
      food: "Strict vegetarian, health-conscious minimalist diet.",
      other: "Focuses relentlessly on high-leverage activities.",
    },
    ambition: {
      level: "Extreme",
      direction: "Ensuring artificial general intelligence benefits all of humanity.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Dry, fast, tech-native.",
      evidence: ["ig:bio"],
    },
    communication_style: {
      summary: "Direct, ultra-concise, rapid pace, focuses on fundamental constraints.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Values partners who are deeply self-driven with their own major life pursuits", confidence: 0.85, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Unrelenting schedule and emergency crisis demands", why: "Leading the global frontier AI race", evidence: ["li:exp:1"] },
      { point: "Direct communication can come across as abrupt to conventional partners", why: "Extreme conciseness", evidence: ["li:about"] },
    ],
    green_flags: [
      { flag: "Uncompromising loyalty to inner circle and team", evidence: ["li:exp:1"] },
      { flag: "Deep resilience under intense global pressure", evidence: ["li:about"] },
    ],
    unknowns: [
      "Everyday domestic routines and cooking habits",
      "Off-grid recreational interests",
    ],
  },

  real_demishassabis: {
    identity: {
      name: "Demis Hassabis",
      headline: "CEO & Co-Founder at Google DeepMind | Nobel Laureate in Chemistry",
      location: "London, UK",
      current_role: "CEO & Co-Founder",
      company: "Google DeepMind",
      education: ["Ph.D. in Cognitive Neuroscience, University College London", "B.A. in Computer Science, University of Cambridge"],
    },
    summary: "Nobel Laureate in Chemistry and CEO of Google DeepMind. Former chess master and neuroscience researcher who pioneered deep reinforcement learning and AlphaFold. Enjoys competitive strategy games, science history, and late-night contemplation.",
    needs: [
      { need: "Profound intellectual resonance and conceptual curiosity", kind: "inferred", weight: 5, confidence: 0.95, evidence: ["li:exp:1", "li:about"] },
      { need: "Appreciation for strategic gameplay and scientific depth", kind: "stated", weight: 4, confidence: 0.9, evidence: ["ig:bio", "li:about"] },
      { need: "Mutual respect for demanding research and discovery missions", kind: "inferred", weight: 4, confidence: 0.85, evidence: ["li:exp:1"] },
    ],
    hobbies: [
      { name: "Competitive Chess & Board Game Strategy", confidence: 0.98, evidence: ["li:about", "ig:post:1"] },
      { name: "Reading Cognitive Science & Astrophysics", confidence: 0.9, evidence: ["li:about"] },
      { name: "Video Game Design History", confidence: 0.85, evidence: ["li:exp:1"] },
    ],
    interests: [
      { name: "Artificial General Intelligence & Computational Biology", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Accelerating Scientific Breakthroughs (AlphaFold)", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Scientific Rigor and Truth-Seeking", confidence: 0.95, evidence: ["li:about"] },
      { name: "Mission-Driven Perseverance", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Famous for 'second shift' night owl research blocks from 10 PM to 4 AM.",
      social_energy: "Analytical introvert who lights up in small-group strategy and science salons.",
      travel: "Splits time between London headquarters, academic conferences, and partner summits.",
      fitness: "Casual table tennis and walking London parks.",
      food: "London gastro-pub dining, espresso, dark chocolate.",
      other: "Recharges through complex puzzle solving.",
    },
    ambition: {
      level: "Extreme",
      direction: "Solving intelligence to solve everything else.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Witty, playful chess and gaming references, dry British humor.",
      evidence: ["li:about"],
    },
    communication_style: {
      summary: "Precise, deeply articulate, structured like a masterclass, genuinely curious about logic.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Looks for a true intellectual equal who enjoys debates on mind, physics, and human potential", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Late night working habits can conflict with morning-person routines", why: "Second shift working schedule", evidence: ["li:about"] },
      { point: "Can become completely absorbed in abstract scientific problems", why: "Intense intellectual focus", evidence: ["li:exp:1"] },
    ],
    green_flags: [
      { flag: "Uncompromising integrity and scientific dedication", evidence: ["li:exp:1"] },
      { flag: "Calm, respectful demeanor in every disagreement", evidence: ["li:about"] },
    ],
    unknowns: [
      "Personal travel preferences outside scientific conferences",
      "Favorite musical genres",
    ],
  },

  real_sarablakely: {
    identity: {
      name: "Sara Blakely",
      headline: "Founder & Executive Chairwoman at Spanx | Entrepreneur & Philanthropist",
      location: "Atlanta, GA",
      current_role: "Founder & Executive Chairwoman",
      company: "Spanx",
      education: ["B.A. in Communications, Florida State University"],
    },
    summary: "Self-made billionaire founder of Spanx, investor, and philanthropist. Famous for bootstrapping her business with $5,000 in savings, celebrating failure as growth, and infusing everyday life with infectious humor and bold creativity.",
    needs: [
      { need: "Partner with vibrant humor, playfulness, and authentic laughter", kind: "stated", weight: 5, confidence: 0.95, evidence: ["ig:bio", "ig:post:1"] },
      { need: "Mutual celebration of bold, unconventional ideas and entrepreneurship", kind: "stated", weight: 5, confidence: 0.9, evidence: ["li:about"] },
      { need: "High emotional warmth and active family connection", kind: "inferred", weight: 4, confidence: 0.85, evidence: ["ig:post:2"] },
    ],
    hobbies: [
      { name: "Inventing Everyday Household Hacks", confidence: 0.95, evidence: ["ig:post:1"] },
      { name: "Visual Scrapbooking & Creative Journaling", confidence: 0.85, evidence: ["ig:post:2"] },
      { name: "Spontaneous Family Adventures & Dancing", confidence: 0.9, evidence: ["ig:bio"] },
    ],
    interests: [
      { name: "Female Entrepreneurship & Bootstrapping", confidence: 0.95, evidence: ["li:exp:1"] },
      { name: "Reframing Failure into Growth Mindset", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Radical Authenticity and Self-Belief", confidence: 0.95, evidence: ["li:about"] },
      { name: "Generosity and Joyful Gratitude", confidence: 0.9, evidence: ["ig:bio"] },
    ],
    lifestyle: {
      rhythm: "Dynamic, energetic daily flow balancing board meetings, creative design, and bustling family time.",
      social_energy: "Vibrant extrovert: brings infectious energy, spontaneous laughter, and warmth to any room.",
      travel: "Frequent family vacation getaways and keynote tours.",
      fitness: "Dance workouts, active outdoor play with kids, swimming.",
      food: "Casual Southern comfort cooking, popcorn, spontaneous snack creations.",
      other: "Celebrates milestones with colorful ceremonies and surprises.",
    },
    ambition: {
      level: "Very High",
      direction: "Empowering women globally to invent products and achieve financial sovereignty.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Expressive, self-deprecating, slapstick, joyful.",
      evidence: ["ig:post:1", "ig:bio"],
    },
    communication_style: {
      summary: "Warm, highly expressive, uses visual storytelling, makes everyone feel instantly welcome.",
      evidence: ["ig:bio", "li:about"],
    },
    relationship_signals: [
      { signal: "Requires high emotional availability, shared belly laughs, and absence of cynicism", confidence: 0.9, evidence: ["ig:bio"] },
    ],
    friction_points: [
      { point: "High extroverted energy may overwhelm very quiet, brooding introverts", why: "Vibrant expressive personality", evidence: ["ig:post:1"] },
      { point: "Prefers gut-feel intuition over endless bureaucratic analysis", why: "Bootstrapped entrepreneurial instinct", evidence: ["li:about"] },
    ],
    green_flags: [
      { flag: "Incredible emotional warmth and zero pretense", evidence: ["ig:bio"] },
      { flag: "Celebrates partner's achievements with genuine unreserved enthusiasm", evidence: ["li:about"] },
    ],
    unknowns: [
      "Preferred quiet solo decompression activities",
      "Interest in science fiction or high tech",
    ],
  },

  real_lexfridman: {
    identity: {
      name: "Lex Fridman",
      headline: "Research Scientist at MIT | Host of the Lex Fridman Podcast",
      location: "Austin, TX & Cambridge, MA",
      current_role: "Host & Research Scientist",
      company: "Lex Fridman Podcast / MIT",
      education: ["Ph.D. in Computer Science, Drexel University", "B.S. in Computer Science, Drexel University"],
    },
    summary: "Host of the Lex Fridman Podcast and MIT research scientist specializing in human-centered AI and autonomous vehicles. Black belt in Brazilian Jiu-Jitsu, musician, and devotee of Russian literature and intense philosophical inquiry.",
    needs: [
      { need: "Intense emotional and philosophical vulnerability", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "ig:bio"] },
      { need: "Shared respect for physical discipline and martial arts / fitness", kind: "stated", weight: 4, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Patience for long, contemplative silences and deep conversation", kind: "inferred", weight: 4, confidence: 0.85, evidence: ["li:about"] },
    ],
    hobbies: [
      { name: "Brazilian Jiu-Jitsu & Judo (Black Belt)", confidence: 0.98, evidence: ["ig:post:1", "li:about"] },
      { name: "Acoustic & Electric Guitar (Blues, Rock)", confidence: 0.92, evidence: ["ig:post:2"] },
      { name: "Reading Classic Literature (Dostoyevsky, Tolstoy)", confidence: 0.9, evidence: ["li:about"] },
    ],
    interests: [
      { name: "Artificial Intelligence, Robotics, and Consciousness", confidence: 0.95, evidence: ["li:exp:1"] },
      { name: "The Nature of Love, Mortality, and Human Connection", confidence: 0.95, evidence: ["li:about", "ig:bio"] },
    ],
    values: [
      { name: "Radical Compassion and Sincerity", confidence: 0.95, evidence: ["li:about"] },
      { name: "Disciplined Work Ethic and Humility", confidence: 0.9, evidence: ["ig:post:1"] },
    ],
    lifestyle: {
      rhythm: "Monastic discipline: 2 BJJ sessions daily, strict fasting, hours of reading and editing in black suit.",
      social_energy: "Deep introvert who gives 100% focused attention during 4-hour conversations, then isolates.",
      travel: "Travels for high-impact interviews across global locations.",
      fitness: "Hard daily grappling, pull-up challenges, endurance runs.",
      food: "Strict carnivore/ketogenic routine, black coffee, dark chocolate.",
      other: "Minimalist wardrobe (iconic black suit and tie).",
    },
    ambition: {
      level: "Very High",
      direction: "Bridging human divides through long-form empathy and deep exploration of ideas.",
      evidence: ["li:about"],
    },
    humor: {
      style: "Deadpan, self-effacing, romantic absurdity.",
      evidence: ["ig:post:1"],
    },
    communication_style: {
      summary: "Slow, deliberate, deeply earnest, pauses thoughtfully before speaking, asks soulful questions.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Longs for enduring, profound love rooted in kindness and mutual dedication", confidence: 0.95, evidence: ["li:about", "ig:bio"] },
    ],
    friction_points: [
      { point: "Monastic routine and rigorous physical training leaves minimal leisure time", why: "Strict daily schedule", evidence: ["ig:post:1"] },
      { point: "Intense earnestness can tire partners who prefer casual, ironic banter", why: "Disdain for cynicism", evidence: ["li:about"] },
    ],
    green_flags: [
      { flag: "Complete absence of malice; immense capacity for empathy", evidence: ["li:about"] },
      { flag: "Extraordinary mental and physical discipline", evidence: ["ig:post:1"] },
    ],
    unknowns: [
      "Comfort with casual party atmospheres",
      "Flexibility in daily dietary habits during shared travels",
    ],
  },

  real_drfeifeili: {
    identity: {
      name: "Fei-Fei Li",
      headline: "Sequoia Professor of Computer Science at Stanford | Co-Director Stanford HAI",
      location: "Stanford, CA",
      current_role: "Professor & Co-Director HAI",
      company: "Stanford University",
      education: ["Ph.D. in Electrical Engineering, Caltech", "A.B. in Physics, Princeton University"],
    },
    summary: "Pioneer in artificial intelligence and computer vision (creator of ImageNet). Sequoia Professor at Stanford and author of 'The Worlds I See'. Passionate about human-centered AI, nature photography, classical music, and mentoring the next generation.",
    needs: [
      { need: "Mutual reverence for ethical, human-centered technology", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "li:exp:1"] },
      { need: "Deep appreciation for the arts, classical music, and nature", kind: "stated", weight: 4, confidence: 0.9, evidence: ["ig:bio", "ig:post:1"] },
      { need: "Emotionally grounded and respectful academic balance", kind: "inferred", weight: 4, confidence: 0.85, evidence: ["li:about"] },
    ],
    hobbies: [
      { name: "Nature & Landscape Photography", confidence: 0.92, evidence: ["ig:post:1"] },
      { name: "Hiking Redwood Trails in Northern California", confidence: 0.9, evidence: ["ig:bio"] },
      { name: "Classical Music & Piano", confidence: 0.85, evidence: ["li:about"] },
    ],
    interests: [
      { name: "Human-Centered AI & Spatial Intelligence", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Scientific Mentorship & Inclusion", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Scientific Integrity and Human Dignity", confidence: 0.95, evidence: ["li:about"] },
      { name: "Gratitude, Family Devotion, and Resilience", confidence: 0.95, evidence: ["li:about"] },
    ],
    lifestyle: {
      rhythm: "Structured academic rhythm: teaching, lab research, writing, and peaceful family weekends.",
      social_energy: "Warm ambivert: gracious speaker, recharges during quiet redwood walks with camera.",
      travel: "Attends international scientific symposiums and public policy hearings.",
      fitness: "Brisk hiking and outdoor nature walks.",
      food: "Traditional home-cooked meals, green tea, fresh farm ingredients.",
      other: "Deeply connected to family values and intergenerational wisdom.",
    },
    ambition: {
      level: "Very High",
      direction: "Guiding the evolution of AI to enhance human dignity rather than diminish it.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Gentle, warm, intellectually witty.",
      evidence: ["li:about"],
    },
    communication_style: {
      summary: "Poetic yet scientifically exact, deeply empathetic, highly attentive to the listener's perspective.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Seeks a kind, cultured soul who cherishes art, nature, and intellectual honesty", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Heavy university, advisory, and foundation obligations", why: "Global academic leadership", evidence: ["li:exp:1"] },
      { point: "High standards for moral integrity and purpose-driven focus", why: "Principled worldview", evidence: ["li:about"] },
    ],
    green_flags: [
      { flag: "Uncommon emotional depth, empathy, and intellectual generosity", evidence: ["li:about"] },
      { flag: "Demonstrated lifelong loyalty to family, students, and values", evidence: ["li:exp:1"] },
    ],
    unknowns: [
      "Preferred vacation spots outside nature sanctuaries",
      "Casual contemporary film tastes",
    ],
  },

  real_mkbhd: {
    identity: {
      name: "Marques Brownlee",
      headline: "Creator & Host at MKBHD | Professional Ultimate Frisbee Athlete",
      location: "Kearny, NJ / New York, NY",
      current_role: "Founder & Host",
      company: "MKBHD Studios",
      education: ["B.S. in Business & Information Technology, Stevens Institute of Technology"],
    },
    summary: "Leading tech creator behind MKBHD and Waveform podcast, and professional ultimate frisbee player (New York Empire). Obsessed with industrial design, camera optics, clean aesthetics, and athletic excellence.",
    needs: [
      { need: "Mutual appreciation for clean aesthetics, craftsmanship, and technology", kind: "stated", weight: 5, confidence: 0.9, evidence: ["ig:bio", "li:about"] },
      { need: "Respect for studio production cycles and pro athletic tournament travel", kind: "inferred", weight: 5, confidence: 0.9, evidence: ["li:exp:1", "ig:post:1"] },
      { need: "Low-drama, grounded, and authentic companionship", kind: "inferred", weight: 4, confidence: 0.85, evidence: ["ig:bio"] },
    ],
    hobbies: [
      { name: "Professional Ultimate Frisbee (AUDL / NY Empire)", confidence: 0.98, evidence: ["ig:post:1", "li:about"] },
      { name: "EV Performance & Automotive Testing", confidence: 0.9, evidence: ["ig:post:2"] },
      { name: "Studio Lighting, Cinematography & Audio Gear", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    interests: [
      { name: "Consumer Electronics & Industrial Hardware Design", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Digital Media Production Standards (8K, High Frame Rate)", confidence: 0.9, evidence: ["li:about"] },
    ],
    values: [
      { name: "Uncompromising Consistency and Craftsmanship", confidence: 0.95, evidence: ["li:about"] },
      { name: "Authenticity and Fair Evaluation", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Structured balance between high-intensity athletic practices and rigorous studio production shoots.",
      social_energy: "Cool, calm ambivert: confident on camera, chill and low-key in personal settings.",
      travel: "Travels for major global tech reveals and national frisbee championships.",
      fitness: "Pro-level athletic sprint conditioning, gym workouts, throwing drills.",
      food: "Clean athletic diet, smoothies, casual casual dining.",
      other: "Signature matte black and red aesthetic in gear and workspace.",
    },
    ambition: {
      level: "Very High",
      direction: "Setting the gold standard for independent technology journalism and visual media.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Chill, observational, tech memes, smooth delivery.",
      evidence: ["ig:bio", "ig:post:1"],
    },
    communication_style: {
      summary: "Concise, articulate, objective, exceptionally clear and relaxed.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Values an unpretentious partner who has their own passions and appreciates calm reliability", confidence: 0.85, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Intense tournament weekends and product embargo weeks require solo focus", why: "Dual career as creator and pro athlete", evidence: ["ig:post:1"] },
      { point: "Low tolerance for artificiality or social media superficiality", why: "Grounded personal stance", evidence: ["ig:bio"] },
    ],
    green_flags: [
      { flag: "Remarkable discipline, work ethic, and consistency over 15+ years", evidence: ["li:exp:1"] },
      { flag: "Completely grounded personality despite immense fame", evidence: ["ig:bio"] },
    ],
    unknowns: [
      "Personal reading habits outside tech and sports",
      "Interest in theater or fine arts",
    ],
  },

  real_levelsio: {
    identity: {
      name: "Pieter Levels",
      headline: "Founder at Nomad List, Remote OK, Interior AI | Solo Bootstrapper",
      location: "Nomadic / Lisbon / Amsterdam",
      current_role: "Solo Founder",
      company: "Levels.io",
      education: ["B.S. in Business Administration, University of Amsterdam"],
    },
    summary: "Iconic solo bootstrapped indie maker who built Nomad List, Remote OK, and Photo AI from a laptop while traveling the world. Champion of digital nomadism, electronic music synthesis, radical minimalism, and building in public.",
    needs: [
      { need: "Complete location independence and nomad flexibility", kind: "stated", weight: 5, confidence: 0.98, evidence: ["ig:bio", "li:about"] },
      { need: "Zero corporate bureaucracy and absolute personal autonomy", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about"] },
      { need: "Appreciation for electronic music, minimalism, and urban walking", kind: "stated", weight: 4, confidence: 0.85, evidence: ["ig:post:1"] },
    ],
    hobbies: [
      { name: "Electronic Synthesizer & Techno Production", confidence: 0.92, evidence: ["ig:post:1"] },
      { name: "Exploring New Global Cities on Foot", confidence: 0.95, evidence: ["ig:bio"] },
      { name: "Strength Training in Local Gyms Globally", confidence: 0.85, evidence: ["ig:post:2"] },
    ],
    interests: [
      { name: "Solo Bootstrapping & Indie Software Engineering", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Autonomous AI Automation & Generative Imagery", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Radical Autonomy and Freedom", confidence: 0.98, evidence: ["li:about"] },
      { name: "Pragmatic Simplicity over Complexity", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Highly fluid: codes in coffee shops across Lisbon, Bali, Tokyo, late night DJ sessions.",
      social_energy: "Independent ambivert: thrives among nomad cafes, needs hours of solo coding.",
      travel: "Continuous global relocation every few months.",
      fitness: "Consistent daily gym lifting wherever stationed.",
      food: "Local street food, specialty espresso, minimalist dining.",
      other: "Owns everything in one backpack.",
    },
    ambition: {
      level: "High",
      direction: "Proving solo builders can achieve multi-million dollar freedom with zero employees.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Satirical, meme-savvy, unfiltered Dutch directness.",
      evidence: ["ig:bio"],
    },
    communication_style: {
      summary: "Extremely direct, transparent, energetic, allergic to buzzwords and corporate speak.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Requires a partner who is genuinely adventurous, independent, and location-flexible", confidence: 0.95, evidence: ["ig:bio"] },
    ],
    friction_points: [
      { point: "Completely incompatible with rooted 9-to-5 lifestyles or fixed suburban mortgages", why: "Core nomadic ethos", evidence: ["ig:bio"] },
      { point: "High directness and spontaneous relocation can be disruptive to structured partners", why: "Uncompromising autonomy", evidence: ["li:about"] },
    ],
    green_flags: [
      { flag: "Complete financial and geographical independence", evidence: ["li:exp:1"] },
      { flag: "Total honesty, transparency, and self-reliance", evidence: ["li:about"] },
    ],
    unknowns: [
      "Long-term timeline for settling in a permanent base",
      "Family planning preferences",
    ],
  },

  real_yannlecun: {
    identity: {
      name: "Yann LeCun",
      headline: "Chief AI Scientist at Meta | Silver Professor at NYU | Turing Award Laureate",
      location: "New York, NY / Paris, France",
      current_role: "Chief AI Scientist & Silver Professor",
      company: "Meta & New York University",
      education: ["Ph.D. in Computer Science, Université Pierre et Marie Curie", "Diplôme d'Ingénieur, ESIEE Paris"],
    },
    summary: "Turing Award Laureate, founding father of Convolutional Neural Networks, and Chief AI Scientist at Meta. Passionate advocate for open-source science, French gastronomy, jazz guitar, sailing, and rigorous intellectual debate.",
    needs: [
      { need: "A spirited intellectual equal who relishes vigorous scientific debate", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "ig:bio"] },
      { need: "Appreciation for French culinary culture, fine wine, and jazz", kind: "stated", weight: 4, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Shared passion for open scientific inquiry and intellectual freedom", kind: "stated", weight: 4, confidence: 0.9, evidence: ["li:exp:1"] },
    ],
    hobbies: [
      { name: "Jazz Guitar Playing & Vinyl Listening", confidence: 0.9, evidence: ["ig:post:1"] },
      { name: "French Gastronomy & Enology (Wine Tasting)", confidence: 0.95, evidence: ["ig:post:2"] },
      { name: "Sailing & Coastal Navigation", confidence: 0.85, evidence: ["li:about"] },
    ],
    interests: [
      { name: "Self-Supervised Learning & World Models (JEPA)", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Open Source AI Architecture & Epistemology", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Open Science and Transparency", confidence: 0.98, evidence: ["li:about"] },
      { name: "Joie de Vivre and Fearless Rationality", confidence: 0.9, evidence: ["ig:bio"] },
    ],
    lifestyle: {
      rhythm: "Vibrant transatlantic academic-corporate rhythm between Manhattan and Paris.",
      social_energy: "Lively extrovert who thrives in dinner salons, academic conferences, and bistro banter.",
      travel: "Regular travel between New York, Paris, and international AI symposia.",
      fitness: "Sailing, walking urban avenues.",
      food: "Artisanal French cuisine, authentic bakeries, fine regional wines.",
      other: "Unabashedly engaged in open public scientific debates.",
    },
    ambition: {
      level: "Very High",
      direction: "Advancing machine intelligence through world models and open foundational research.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Spirited, French intellectual wit, playful debate banter.",
      evidence: ["li:about"],
    },
    communication_style: {
      summary: "Passionate, precise, unhesitating, backed by decades of experimental evidence.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Seeks an intellectual, joyful partner who loves lively dinner conversations and cultural zest", confidence: 0.9, evidence: ["ig:bio"] },
    ],
    friction_points: [
      { point: "Love for intellectual debate can feel argumentative to partners who avoid conflict", why: "Debate-driven thinking style", evidence: ["li:about"] },
      { point: "Frequent transatlantic academic travel schedule", why: "Dual roles at Meta and NYU", evidence: ["li:exp:1"] },
    ],
    green_flags: [
      { flag: "Unshakable commitment to open science and truth over hype", evidence: ["li:exp:1"] },
      { flag: "Warm generosity toward young researchers and students", evidence: ["li:about"] },
    ],
    unknowns: [
      "Personal sports and fitness routines outside sailing",
      "Contemporary pop culture interests",
    ],
  },
  real_karpathy: {
    identity: {
      name: "Andrej Karpathy",
      headline: "AI Researcher & Educator | Founder of Eureka Labs",
      location: "San Francisco, CA",
      current_role: "Founder",
      company: "Eureka Labs",
      education: ["Ph.D. in Computer Science, Stanford University", "B.S. in Computer Science, University of Toronto"],
    },
    summary: "AI researcher and world-class educator who built Eureka Labs, previously Director of AI at Tesla and OpenAI founding member. Famous for building neural networks from scratch in raw C and Python, speedcubing, bouldering, and educational clarity.",
    needs: [
      { need: "Mutual love for curiosity, deep tinkering, and first-principles learning", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "ig:bio"] },
      { need: "Patience for intense solo coding and creative hacking periods", kind: "inferred", weight: 4, confidence: 0.9, evidence: ["li:exp:1"] },
      { need: "Casual, unpretentious, and playful connection", kind: "stated", weight: 4, confidence: 0.85, evidence: ["ig:post:1"] },
    ],
    hobbies: [
      { name: "Speedcubing & Rubik's Puzzles", confidence: 0.95, evidence: ["ig:post:1"] },
      { name: "Bouldering & Rock Climbing", confidence: 0.92, evidence: ["ig:post:2"] },
      { name: "Building Educational AI Repos (nanoGPT, micrograd)", confidence: 0.95, evidence: ["li:about"] },
    ],
    interests: [
      { name: "Deep Learning Foundations & Cognitive Architecture", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Democratizing AI Education for the World", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Radical Simplicity and First Principles", confidence: 0.95, evidence: ["li:about"] },
      { name: "Educational Generosity and Curiosity", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Flexible maker schedule: late-night coding bursts, morning coffee, bouldering gym sessions.",
      social_energy: "Creative introvert who loves engaging with passionate builders and curious students.",
      travel: "Occasional international AI conferences, prefers home base in San Francisco.",
      fitness: "Bouldering, pull-ups, urban cycling.",
      food: "Specialty coffee, simple healthy meals, Japanese ramen.",
      other: "Always has a Rubik's cube or terminal window nearby.",
    },
    ambition: {
      level: "Very High",
      direction: "Reinventing education with AI-native learning companions.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Playful, geeky, meme-literate, self-aware.",
      evidence: ["ig:bio", "ig:post:1"],
    },
    communication_style: {
      summary: "Crystal clear, uses visual analogies, builds understanding from the bottom up.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Values an authentic, intellectually curious partner who enjoys playful banter and low pretense", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Can become deeply engrossed in building projects for days", why: "Passionate maker flow", evidence: ["li:exp:1"] },
      { point: "Dislikes rigid corporate formalities or high-society events", why: "Maker mindset", evidence: ["ig:bio"] },
    ],
    green_flags: [
      { flag: "Incredible humility and dedication to teaching others", evidence: ["li:about"] },
      { flag: "Calm, grounded presence with zero arrogance", evidence: ["li:exp:1"] },
    ],
    unknowns: ["Long-term domestic lifestyle preferences", "Musical instrument interests"],
  },

  real_andrew_y_ng: {
    identity: {
      name: "Andrew Ng",
      headline: "Founder of DeepLearning.AI | Managing General Partner at AI Fund | Stanford Adjunct Professor",
      location: "Los Altos, CA",
      current_role: "Founder & Managing GP",
      company: "DeepLearning.AI / AI Fund",
      education: ["Ph.D. in Computer Science, UC Berkeley", "M.S. in EECS, MIT", "B.S. in CS/Stats/Math, Carnegie Mellon"],
    },
    summary: "AI pioneer, co-founder of Coursera, founder of DeepLearning.AI, and former head of Google Brain. World-renowned for teaching millions of machine learning engineers, championing patient pedagogy, and promoting AI for good.",
    needs: [
      { need: "Mutual passion for education, technology, and societal impact", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "li:exp:1"] },
      { need: "Calm, patient, and considerate emotional communication", kind: "inferred", weight: 4, confidence: 0.9, evidence: ["li:about"] },
      { need: "Shared enjoyment of cycling, family cooking, and nature walks", kind: "stated", weight: 4, confidence: 0.85, evidence: ["ig:post:1"] },
    ],
    hobbies: [
      { name: "Road Cycling & Outdoor Rides", confidence: 0.9, evidence: ["ig:post:1"] },
      { name: "Reading AI & Climate Research Papers", confidence: 0.95, evidence: ["li:about"] },
      { name: "Family Cooking & Culinary Experiments", confidence: 0.85, evidence: ["ig:post:2"] },
    ],
    interests: [
      { name: "AI Literacy & Global Education Access", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Data-Centric AI & Climate Solutions", confidence: 0.92, evidence: ["li:about"] },
    ],
    values: [
      { name: "Patient Pedagogy and Humility", confidence: 0.95, evidence: ["li:about"] },
      { name: "Persistent, Structured Diligence", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Predictable, balanced academic-venture rhythm: research, teaching, weekend cycling and family time.",
      social_energy: "Gentle ambivert: patient in large lecture halls, deeply serene in one-on-one dialogue.",
      travel: "Keynote lectures worldwide and university engagements.",
      fitness: "Long scenic bike rides through Silicon Valley foothills.",
      food: "Healthful home-cooked family dinners, fresh vegetables, tea.",
      other: "Signature blue button-down shirt style.",
    },
    ambition: {
      level: "Very High",
      direction: "Empowering every human on earth to build with AI.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Mild, gentle, self-deprecating.",
      evidence: ["li:about"],
    },
    communication_style: {
      summary: "Patient, exceptionally structured, encouraging, listens with undivided respect.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Seeks a kind, intellectually thoughtful partner who values balance and mutual support", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Very calm and measured cadence might feel slow for high-adrenaline partners", why: "Deliberate contemplative style", evidence: ["li:about"] },
      { point: "Dedicated teaching and venture mentorship commitments", why: "Dual academic and venture roles", evidence: ["li:exp:1"] },
    ],
    green_flags: [
      { flag: "Unrivaled patience and warmth across all interactions", evidence: ["li:about"] },
      { flag: "Enduring commitment to global human empowerment", evidence: ["li:exp:1"] },
    ],
    unknowns: ["Favorite non-fiction literature genres", "Casual travel destinations"],
  },

  real_reidhoffman: {
    identity: {
      name: "Reid Hoffman",
      headline: "Co-Founder LinkedIn | Partner at Greylock | Host of Masters of Scale",
      location: "Mountain View, CA",
      current_role: "Partner & Co-Founder",
      company: "Greylock / LinkedIn",
      education: ["M.St. in Philosophy, Oxford University", "B.S. in Symbolic Systems, Stanford University"],
    },
    summary: "Co-founder of LinkedIn, partner at Greylock, and author of The Startup of You and Blitzscaling. Philosopher-turned-technologist renowned for hosting legendary dinner salons, board game strategy sessions, and deep ethical inquiry.",
    needs: [
      { need: "Engaging philosophical dialogue and intellectual salon culture", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "li:exp:1"] },
      { need: "Mutual appreciation for strategy games, books, and large ideas", kind: "stated", weight: 4, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Respect for a vibrant, highly networked social calendar", kind: "inferred", weight: 4, confidence: 0.85, evidence: ["li:exp:1"] },
    ],
    hobbies: [
      { name: "Complex Strategy Board Games (Settlers of Catan, Diplomacy)", confidence: 0.98, evidence: ["ig:post:1", "li:about"] },
      { name: "Hosting Intellectual Dinner Salons", confidence: 0.95, evidence: ["li:about"] },
      { name: "Philosophical Writing & Essay Crafting", confidence: 0.9, evidence: ["li:exp:1"] },
    ],
    interests: [
      { name: "Network Theory, Human Agency, and Public Policy", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Ethical AI & Societal Scaling", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Strategic Generosity and Alliance Building", confidence: 0.98, evidence: ["li:about"] },
      { name: "Philosophical Inquiry and Long-Horizon Thinking", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Highly structured: packed days of founder meetings followed by evening salons and strategy games.",
      social_energy: "Super-networked extrovert: loves convening brilliant minds around shared tables.",
      travel: "Frequent global travel for think-tanks, Oxford lectures, and summits.",
      fitness: "Walking meetings and gentle fitness routines.",
      food: "Enjoys great dinners with lively company, fine wines, and thoughtful conversation.",
      other: "Sees every human relationship as a lifelong alliance.",
    },
    ambition: {
      level: "Very High",
      direction: "Scaling technologies and networks that advance human freedom and dignity.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Erudite, playful, fond of philosophical paradoxes and puns.",
      evidence: ["li:about"],
    },
    communication_style: {
      summary: "Synthesizing, articulate, frames ideas through alliances, games, and systems.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Values a smart, socially engaged partner who enjoys intellectual gatherings and mutual loyalty", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Immense network demands and numerous evening commitments", why: "Global convening role", evidence: ["li:exp:1"] },
      { point: "Prefers discussing macroscopic ideas over mundane domestic trivia", why: "Philosophical focus", evidence: ["li:about"] },
    ],
    green_flags: [
      { flag: "Legendary loyalty and proactive generosity to friends and partners", evidence: ["li:about"] },
      { flag: "Enduring intellectual curiosity and optimism", evidence: ["li:exp:1"] },
    ],
    unknowns: ["Solo decompression pastimes", "Preferred wilderness destinations"],
  },

  real_tim_cook: {
    identity: {
      name: "Tim Cook",
      headline: "Chief Executive Officer at Apple",
      location: "Palo Alto, CA",
      current_role: "CEO",
      company: "Apple",
      education: ["MBA, Duke University Fuqua School of Business", "B.S. in Industrial Engineering, Auburn University"],
    },
    summary: "Chief Executive Officer of Apple. Renowned for operational mastery, unwavering commitment to privacy, human rights, and environmental sustainability. Devoted to intense early morning fitness and outdoor cycling.",
    needs: [
      { need: "Absolute privacy, trust, and discretion in personal life", kind: "inferred", weight: 5, confidence: 0.98, evidence: ["li:about", "li:exp:1"] },
      { need: "Shared passion for outdoor fitness, hiking, and early morning discipline", kind: "stated", weight: 5, confidence: 0.9, evidence: ["ig:bio", "ig:post:1"] },
      { need: "Mutual values of quiet dignity, environmental care, and excellence", kind: "stated", weight: 4, confidence: 0.85, evidence: ["li:about"] },
    ],
    hobbies: [
      { name: "Cycling & Hiking National Parks (Yosemite, Zion)", confidence: 0.95, evidence: ["ig:post:1", "ig:bio"] },
      { name: "Early Morning Gym & Cardiovascular Training", confidence: 0.95, evidence: ["li:about"] },
      { name: "Auburn Football & College Athletics", confidence: 0.9, evidence: ["ig:post:2"] },
    ],
    interests: [
      { name: "Environmental Renewable Energy & Carbon Neutrality", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Privacy Rights, Accessibility, and Education", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Excellence, Quiet Humility, and Integrity", confidence: 0.98, evidence: ["li:about"] },
      { name: "Disciplined Focus and Social Responsibility", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Monastic 3:45 AM wakeup, intense workout, reading customer feedback, in bed early.",
      social_energy: "Intensely private introvert: calm, reserved, cherishes quiet solitude and outdoor trails.",
      travel: "Global executive tours, factory visits, state dinners, punctuated by quiet park hikes.",
      fitness: "Intense daily gym sessions, weekend century bike rides.",
      food: "Clean Southern-style energy food, energy bars, chicken, iced tea.",
      other: "Guards personal space with fortress-like privacy.",
    },
    ambition: {
      level: "Very High",
      direction: "Leaving the world better than we found it through human-centered tools.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Dry, quiet Southern charm, gentle smirk.",
      evidence: ["ig:post:1"],
    },
    communication_style: {
      summary: "Calm, deliberate, measured, listens with intense silence before delivering decisive guidance.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Requires complete discretion, mutual respect for health and discipline, and quiet loyalty", confidence: 0.95, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Extreme early morning schedule and early bedtime conflicts with night owls", why: "3:45 AM routine", evidence: ["li:about"] },
      { point: "Rigid public privacy perimeter", why: "Head of the most visible brand in the world", evidence: ["li:exp:1"] },
    ],
    green_flags: [
      { flag: "Flawless integrity, reliability, and moral backbone", evidence: ["li:about"] },
      { flag: "Remarkable physical and operational discipline", evidence: ["ig:post:1"] },
    ],
    unknowns: ["Private culinary indulgences", "Favorite musical artists"],
  },

  real_jensenhuangnvidia: {
    identity: {
      name: "Jensen Huang",
      headline: "Founder and CEO at NVIDIA",
      location: "Los Altos Hills, CA",
      current_role: "President & CEO",
      company: "NVIDIA",
      education: ["M.S. in Electrical Engineering, Stanford University", "B.S. in Electrical Engineering, Oregon State University"],
    },
    summary: "Founder and CEO of NVIDIA, pioneer of the accelerated computing and AI revolution. Renowned for unyielding resilience, signature leather jackets, culinary passion, and flat, highly communicative leadership.",
    needs: [
      { need: "Mutual appreciation for boundless energy, passion, and craftsmanship", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "li:exp:1"] },
      { need: "Shared love for cooking, family dinners, and warm hospitality", kind: "stated", weight: 5, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Partner who embraces high intensity, storytelling, and bold vision", kind: "inferred", weight: 4, confidence: 0.85, evidence: ["li:about"] },
    ],
    hobbies: [
      { name: "Cooking & Culinary Experimentation", confidence: 0.95, evidence: ["ig:post:1"] },
      { name: "Table Tennis & Quick-Reflex Games", confidence: 0.9, evidence: ["li:about"] },
      { name: "Reading Microarchitecture & Physics Papers", confidence: 0.9, evidence: ["li:exp:1"] },
    ],
    interests: [
      { name: "Accelerated Computing, Robotics & Digital Biology", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "First-Principles Engineering & Tenacity", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Resilience Through Suffering and Grit", confidence: 0.98, evidence: ["li:about"] },
      { name: "Authenticity, Family Pride, and Craftsmanship", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Continuous 7-day immersion: loves what he does so completely that work and life merge seamlessly.",
      social_energy: "Dynamic, charismatic extrovert: energizes packed stadiums, loves bustling kitchen dinners.",
      travel: "Global keynotes (Computex, GTC), customer summits, and family gatherings.",
      fitness: "Table tennis, brisk walking, high daily physical stamina.",
      food: "Exceptional home cooking, Asian street cuisine, signature family dishes.",
      other: "Iconic black leather jacket and black tee.",
    },
    ambition: {
      level: "Extreme",
      direction: "Building the computing engines that power the next industrial revolution.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Charismatic, animated, theatrical, warm storytelling.",
      evidence: ["ig:post:1", "li:about"],
    },
    communication_style: {
      summary: "First-principles, passionate, highly vivid, repeats core vision with magnetic conviction.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Seeks a warm, loyal partner who shares a passion for family feasts, bold dreams, and authentic laughter", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Non-stop work intensity can be overwhelming for partners seeking low-key quiet routines", why: "Relentless drive", evidence: ["li:exp:1"] },
      { point: "High speed of thought and rapid conversational pivots", why: "Supercharged mental pace", evidence: ["li:about"] },
    ],
    green_flags: [
      { flag: "Decades of proven loyalty, grit, and family commitment", evidence: ["li:about"] },
      { flag: "Unpretentious, hands-on warmth with everyone he encounters", evidence: ["li:exp:1"] },
    ],
    unknowns: ["Favorite holiday retreats when completely offline", "Tastes in classical vs modern music"],
  },

  real_miramurati: {
    identity: {
      name: "Mira Murati",
      headline: "AI Technologist & Executive | Former Chief Technology Officer at OpenAI",
      location: "San Francisco, CA",
      current_role: "AI Technologist & Founder",
      company: "Frontier AI",
      education: ["B.E. in Mechanical Engineering, Thayer School of Engineering at Dartmouth College"],
    },
    summary: "Pioneering AI engineering leader who oversaw the development of ChatGPT, DALL-E, and GPT-4. Mechanical engineer by training with deep passions for speculative fiction, Italian cinema, contemporary art, and skiing.",
    needs: [
      { need: "Multidimensional intellectual curiosity bridging science, art, and philosophy", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "ig:bio"] },
      { need: "Mutual appreciation for literature, cinema, and aesthetic elegance", kind: "stated", weight: 4, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Calm, steady emotional presence under high-velocity change", kind: "inferred", weight: 4, confidence: 0.85, evidence: ["li:about"] },
    ],
    hobbies: [
      { name: "Reading Sci-Fi & Speculative Fiction (Ted Chiang, Lem)", confidence: 0.95, evidence: ["li:about"] },
      { name: "Classic Italian & European Cinema", confidence: 0.9, evidence: ["ig:post:1"] },
      { name: "Skiing in the Alps & Sierras", confidence: 0.85, evidence: ["ig:post:2"] },
    ],
    interests: [
      { name: "Frontier AI Safety, Alignment, and Multimodal Reasoning", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Human-AI Cognitive Ergonomics", confidence: 0.9, evidence: ["li:about"] },
    ],
    values: [
      { name: "Calm Intellectual Courage", confidence: 0.95, evidence: ["li:about"] },
      { name: "Elegance and Rigor in Engineering", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Intense technical problem-solving sprints balanced with quiet evenings of art, literature, and espresso.",
      social_energy: "Refined ambivert: articulate at global conferences, recharges in intimate creative dinners.",
      travel: "Global AI governance summits and European cultural visits.",
      fitness: "Alpine skiing, coastal hiking, yoga.",
      food: "Mediterranean gastronomy, fresh seafood, Italian espresso.",
      other: "Appreciates understated, minimalist architecture.",
    },
    ambition: {
      level: "Very High",
      direction: "Developing safe, transformative intelligence that elevates human potential.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Subtle, witty, understated European sensibility.",
      evidence: ["li:about"],
    },
    communication_style: {
      summary: "Composed, clear, speaks with poise and precision, deeply listens before answering.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Values emotional depth, intellectual sophistication, and mutual creative respect", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "High global spotlight and intense technical demands", why: "Frontier AI executive leadership", evidence: ["li:exp:1"] },
      { point: "High standards for conversational substance and emotional calm", why: "Disciplined personal composure", evidence: ["li:about"] },
    ],
    green_flags: [
      { flag: "Exceptional grace under pressure and crisis management", evidence: ["li:about"] },
      { flag: "Uncompromising integrity and devotion to safe technology", evidence: ["li:exp:1"] },
    ],
    unknowns: ["Personal musical tastes", "Favorite quiet coastal hideaways"],
  },

  real_thegdb: {
    identity: {
      name: "Greg Brockman",
      headline: "Co-Founder and President at OpenAI",
      location: "San Francisco, CA",
      current_role: "President & Co-Founder",
      company: "OpenAI",
      education: ["Harvard University & MIT (Mathematics/CS, attended)"],
    },
    summary: "President and co-founder of OpenAI, previously CTO of Stripe. Legendary for building distributed infrastructure from scratch, endurance ultramarathons, mathematics, piano, and relentless engineering execution.",
    needs: [
      { need: "Mutual understanding of monumental engineering focus sprints", kind: "inferred", weight: 5, confidence: 0.95, evidence: ["li:about", "li:exp:1"] },
      { need: "Shared appreciation for physical endurance and quiet discipline", kind: "stated", weight: 4, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Direct, transparent, and low-friction communication", kind: "stated", weight: 4, confidence: 0.85, evidence: ["li:about"] },
    ],
    hobbies: [
      { name: "Ultramarathon Running & Trail Distance", confidence: 0.95, evidence: ["ig:post:1"] },
      { name: "Reading Pure Mathematics & Physics", confidence: 0.9, evidence: ["li:about"] },
      { name: "Classical Piano Playing", confidence: 0.85, evidence: ["ig:post:2"] },
    ],
    interests: [
      { name: "Supercomputing Architecture & Scalable Neural Systems", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Empirical Rigor and AI Safety Verification", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Radical Transparency and Relentless Focus", confidence: 0.98, evidence: ["li:about"] },
      { name: "Humility and Empirical Truth", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Intense engineering rhythm: 14-hour code & architecture blocks, early morning long trail runs.",
      social_energy: "Focused introvert: happiest deep in code or running mountain ridges.",
      travel: "Travels for partner compute clusters and global AI policy discussions.",
      fitness: "30-mile trail runs, endurance training, calisthenics.",
      food: "Nutrient-dense clean athlete fuel, smoothies, black coffee.",
      other: "Deeply loyal to core collaborators.",
    },
    ambition: {
      level: "Extreme",
      direction: "Engineering the foundational supercomputing substrate for safe AGI.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Dry, mathematical, quiet irony.",
      evidence: ["li:about"],
    },
    communication_style: {
      summary: "Direct, completely candid, zero fluff, focuses on bottleneck analysis.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Looks for a partner with independent purpose who appreciates deep focus and endurance", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Can become so consumed by technical pushes that casual social routines fade", why: "Intense work immersion", evidence: ["li:exp:1"] },
      { point: "Low tolerance for performative small talk", why: "Extreme focus efficiency", evidence: ["li:about"] },
    ],
    green_flags: [
      { flag: "Uncompromising loyalty and protective dedication to his partner and team", evidence: ["li:about"] },
      { flag: "Extraordinary mental and physical resilience", evidence: ["ig:post:1"] },
    ],
    unknowns: ["Leisure film or fiction interests", "Vacation relaxation habits outside running"],
  },

  real_benioff: {
    identity: {
      name: "Marc Benioff",
      headline: "Chair and CEO of Salesforce | Philanthropist & Owner of TIME",
      location: "San Francisco, CA & Big Island, HI",
      current_role: "Chair & CEO",
      company: "Salesforce",
      education: ["B.S. in Business Administration, University of Southern California"],
    },
    summary: "Chair and CEO of Salesforce, pioneer of enterprise cloud computing and the 1-1-1 philanthropic model. Devoted practitioner of mindfulness, ocean swimming in Hawaii, Ohana culture, and children's healthcare philanthropy.",
    needs: [
      { need: "Heart-centered connection grounded in mindfulness, empathy, and giving back", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "ig:bio"] },
      { need: "Shared love for ocean swimming, Hawaiian serenity, and nature conservation", kind: "stated", weight: 5, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Comfort with expansive social gatherings and philanthropic missions", kind: "inferred", weight: 4, confidence: 0.85, evidence: ["li:exp:1"] },
    ],
    hobbies: [
      { name: "Ocean Swimming & Snorkeling in Hawaii", confidence: 0.95, evidence: ["ig:post:1"] },
      { name: "Daily Meditation & Zen Mindfulness Practice", confidence: 0.95, evidence: ["li:about"] },
      { name: "Playing Ukulele & Listening to Hawaiian Music", confidence: 0.85, evidence: ["ig:post:2"] },
    ],
    interests: [
      { name: "Stakeholder Capitalism & Ocean Conservation (1-1-1)", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Agentic Enterprise AI & Trusted Cloud Platforms", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Ohana (We are all family) and Trust", confidence: 0.98, evidence: ["li:about"] },
      { name: "Giving Back and Social Impact", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Mindful mornings: meditation, ocean swim or walk, followed by bold visionary business sessions.",
      social_energy: "Grand, magnetic extrovert who fills rooms with warmth, enthusiasm, and communal spirit.",
      travel: "Frequent travel between San Francisco, Hawaii retreats, New York, and Davos.",
      fitness: "Long ocean swims, coastal walking, yoga.",
      food: "Healthy Hawaiian farm-to-table cuisine, tropical fruits, herbal teas.",
      other: "Golden retrievers always present in his world.",
    },
    ambition: {
      level: "Very High",
      direction: "Using business as the greatest platform for social, environmental, and technological change.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Warm, boisterous, playful, storytelling.",
      evidence: ["ig:post:1"],
    },
    communication_style: {
      summary: "Inspirational, big-hearted, personal, connects every idea back to human values and trust.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Values emotional generosity, spiritual peace, shared philanthropy, and unconditional warmth", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Expansive public entourage and major philanthropic obligations", why: "Billionaire public leader", evidence: ["li:exp:1"] },
      { point: "Prefers holistic, intuitive decision making over pure spreadsheet analysis", why: "Visionary leadership style", evidence: ["li:about"] },
    ],
    green_flags: [
      { flag: "Profound personal generosity and proven lifetime dedication to community", evidence: ["li:about"] },
      { flag: "Infectious optimism and psychological warmth", evidence: ["ig:bio"] },
    ],
    unknowns: ["Private solo reading genres", "Culinary cooking skills"],
  },

  real_boztank: {
    identity: {
      name: "Andrew Bosworth",
      headline: "Chief Technology Officer at Meta | Leading Reality Labs",
      location: "San Mateo, CA",
      current_role: "CTO",
      company: "Meta",
      education: ["A.B. in Computer Science, Harvard University"],
    },
    summary: "Chief Technology Officer at Meta overseeing Reality Labs (Quest, Ray-Ban smart glasses, spatial computing). Passionate outdoorsman, woodworker, backcountry hiker, BBQ pitmaster, and candid team builder.",
    needs: [
      { need: "Down-to-earth authenticity and unvarnished honesty", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "ig:bio"] },
      { need: "Shared love for backcountry wilderness camping and hands-on crafts", kind: "stated", weight: 4, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Mutual appreciation for family, team loyalty, and direct humor", kind: "inferred", weight: 4, confidence: 0.85, evidence: ["ig:post:2"] },
    ],
    hobbies: [
      { name: "Backpacking & Wilderness Camping", confidence: 0.95, evidence: ["ig:post:1"] },
      { name: "Woodworking & Workshop Crafting", confidence: 0.9, evidence: ["ig:post:2"] },
      { name: "BBQ Smoking & Outdoor Cooking", confidence: 0.88, evidence: ["li:about"] },
    ],
    interests: [
      { name: "Spatial Computing, AR/VR, and Wearable Optics", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Engineering Culture and Direct Management", confidence: 0.92, evidence: ["li:about"] },
    ],
    values: [
      { name: "Direct Candor and Accountability", confidence: 0.95, evidence: ["li:about"] },
      { name: "Hands-On Craftsmanship and Loyalty", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Balanced executive-maker rhythm: intensive Silicon Valley product days, rustic weekends in nature.",
      social_energy: "Hearty, unpretentious ambivert: commands technical teams, relaxes with campfire stories.",
      travel: "Travels for hardware supply chains, developer conferences, and wilderness trails.",
      fitness: "Backpacking with heavy pack, outdoor physical labor, hiking.",
      food: "Slow-smoked Texas-style BBQ, hearty stews, local craft beer.",
      other: "Proud tinkerer with tools and vintage cameras.",
    },
    ambition: {
      level: "Very High",
      direction: "Building the next computing platform that connects people across physical space.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Dry, blunt, campfire storytelling, teasing.",
      evidence: ["li:about", "ig:post:1"],
    },
    communication_style: {
      summary: "Blunt, highly pragmatic, zero corporate jargon, tells it exactly as it is.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Values an authentic, unvarnished partner who loves outdoor adventure and honest conversation", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "High directness can be perceived as harsh by sensitive partners", why: "Radical candor philosophy", evidence: ["li:about"] },
      { point: "Prefers rugged camping over luxury boutique hotels", why: "Wilderness affinity", evidence: ["ig:post:1"] },
    ],
    green_flags: [
      { flag: "Unshakable loyalty and protective support for loved ones", evidence: ["li:about"] },
      { flag: "Complete absence of pretension or vanity", evidence: ["ig:bio"] },
    ],
    unknowns: ["Musical performance interests", "Winter sports preferences"],
  },

  real_sherylsandberg: {
    identity: {
      name: "Sheryl Sandberg",
      headline: "Founder of LeanIn.Org & OptionB.Org | Philanthropist & Author",
      location: "Menlo Park, CA",
      current_role: "Philanthropist & Founder",
      company: "Sandberg Goldberg Bernthal Family Foundation",
      education: ["MBA with highest distinction, Harvard Business School", "A.B. in Economics, Harvard University"],
    },
    summary: "Former COO of Meta and founder of LeanIn.Org and OptionB.Org. Author who has championed women's workplace empowerment, resilience in the face of loss, intentional family rituals, and compassionate leadership.",
    needs: [
      { need: "Deep emotional intelligence and capacity for meaningful vulnerability", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "ig:bio"] },
      { need: "Shared devotion to family dinners, board games, and mutual support", kind: "stated", weight: 5, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Mutual commitment to women's equality and social impact", kind: "stated", weight: 4, confidence: 0.85, evidence: ["li:exp:1"] },
    ],
    hobbies: [
      { name: "Family Board Games & Card Tournaments", confidence: 0.95, evidence: ["ig:post:1"] },
      { name: "Walking Hikes with Friends in Northern California", confidence: 0.9, evidence: ["ig:post:2"] },
      { name: "Reading Biographies & Memoirs on Resilience", confidence: 0.85, evidence: ["li:about"] },
    ],
    interests: [
      { name: "Women's Empowerment & Closing the Leadership Gap", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Resilience, Grief Recovery, and Communal Healing", confidence: 0.98, evidence: ["li:about"] },
    ],
    values: [
      { name: "Courage to be Vulnerable (Option B)", confidence: 0.98, evidence: ["li:about"] },
      { name: "Family Devotion and Radical Empathy", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Intentional and family-centered: foundation work, school activities, protected 6:00 PM family dinners.",
      social_energy: "Warm, organized extrovert who excels at nurturing close friendships and family bonds.",
      travel: "Travels for philanthropic initiatives, keynote speeches, and family reunions.",
      fitness: "Regular walking, hiking, pilates.",
      food: "Wholesome family home cooking, shared dinner table spreads.",
      other: "Prioritizes structured rituals of gratitude.",
    },
    ambition: {
      level: "High",
      direction: "Building an equal world where women lead and families find resilience in adversity.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Self-aware, warm, endearing, family anecdotes.",
      evidence: ["li:about"],
    },
    communication_style: {
      summary: "Emotionally attuned, structured, articulate, deeply encouraging and vulnerable.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Requires high emotional maturity, transparent communication, and genuine family warmth", confidence: 0.95, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Carefully structured schedule leaves little room for chaotic spontaneity", why: "Organized executive lifestyle", evidence: ["li:about"] },
      { point: "Prominent public profile requires boundary awareness", why: "Global thought leader", evidence: ["li:exp:1"] },
    ],
    green_flags: [
      { flag: "Unparalleled capacity for empathy, listening, and relational repair", evidence: ["li:about"] },
      { flag: "Fierce loyalty to family, children, and friends", evidence: ["ig:bio"] },
    ],
    unknowns: ["Private artistic pastimes", "Spontaneous adventure preferences"],
  },

  real_btaylor: {
    identity: {
      name: "Bret Taylor",
      headline: "Co-Founder & CEO at Sierra | Chair of the Board at OpenAI",
      location: "San Francisco, CA",
      current_role: "CEO & Board Chair",
      company: "Sierra / OpenAI",
      education: ["M.S. in Computer Science, Stanford University", "B.S. in Computer Science, Stanford University"],
    },
    summary: "Co-founder & CEO of Sierra, Chair of OpenAI's Board of Directors, former co-CEO of Salesforce and CTO of Facebook. Co-creator of Google Maps and FriendFeed. Hands-on coder, camping enthusiast, and pragmatic leader.",
    needs: [
      { need: "Mutual balance between ambitious technology building and grounded family outdoor life", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "ig:bio"] },
      { need: "Shared love for hands-on tinkering, camping trips, and Tahoe skiing", kind: "stated", weight: 4, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Low-ego, calm, and thoughtful communication", kind: "inferred", weight: 4, confidence: 0.85, evidence: ["li:about"] },
    ],
    hobbies: [
      { name: "Hands-on Coding & Side Project Building", confidence: 0.95, evidence: ["li:about"] },
      { name: "Family Camping & Lake Tahoe Skiing", confidence: 0.9, evidence: ["ig:post:1"] },
      { name: "Culinary Cooking & Slow Food", confidence: 0.85, evidence: ["ig:post:2"] },
    ],
    interests: [
      { name: "Conversational Agentic AI for Enterprises", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Open Web Architecture & Collaborative Systems", confidence: 0.92, evidence: ["li:about"] },
    ],
    values: [
      { name: "Humility, Quiet Competence, and Craft", confidence: 0.98, evidence: ["li:about"] },
      { name: "Pragmatic Problem Solving and Trust", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Early riser who still writes production code before morning meetings; weekends in nature.",
      social_energy: "Grounded ambivert: trusted boardroom consensus-builder, happiest coding or camping.",
      travel: "Board meetings, customer keynotes, and mountain retreats.",
      fitness: "Skiing, outdoor running, hiking with family.",
      food: "Gourmet home cooking, artisan sourdough, quality wine.",
      other: "Beloved across Silicon Valley for calm neutrality.",
    },
    ambition: {
      level: "Very High",
      direction: "Building AI agents that elevate consumer and enterprise experiences with human trust.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Understated, warm, dry engineering humor.",
      evidence: ["li:about"],
    },
    communication_style: {
      summary: "Calm, synthesized, objective, resolves complex tensions with clear logic.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Values a smart, down-to-earth partner who appreciates family adventures and authentic warmth", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "High-stakes board governance responsibilities (OpenAI) can create sudden demands", why: "Crucial governance role", evidence: ["li:exp:1"] },
      { point: "Very understated demeanor can mask strong opinions", why: "Diplomatic communication habit", evidence: ["li:about"] },
    ],
    green_flags: [
      { flag: "Universal reputation for stellar integrity, calm wisdom, and fairness", evidence: ["li:about"] },
      { flag: "True engineer at heart with zero vanity", evidence: ["li:exp:1"] },
    ],
    unknowns: ["Favorite literature genres", "Casual travel destinations outside Tahoe"],
  },

  real_austen: {
    identity: {
      name: "Austen Allred",
      headline: "Co-Founder and CEO at BloomTech",
      location: "Salt Lake City, UT",
      current_role: "CEO",
      company: "BloomTech",
      education: ["Brigham Young University (attended)"],
    },
    summary: "Co-founder & CEO of BloomTech (formerly Lambda School), pioneering income-share education and accelerated tech careers. Passionate about folk wrestling, mountain hiking in Utah, startup grit, and upward economic mobility.",
    needs: [
      { need: "Mutual appreciation for startup grit, resilience, and unpretentious mountain living", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "ig:bio"] },
      { need: "Shared love for outdoor athletics, wrestling/grappling, and Utah mountains", kind: "stated", weight: 4, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Family-first values and loyal, long-term commitment", kind: "stated", weight: 4, confidence: 0.85, evidence: ["ig:post:2"] },
    ],
    hobbies: [
      { name: "Folk Wrestling & Grappling", confidence: 0.95, evidence: ["ig:post:1"] },
      { name: "Mountain Hiking & Camping in Utah", confidence: 0.9, evidence: ["ig:post:2"] },
      { name: "Reading American Entrepreneurial History", confidence: 0.85, evidence: ["li:about"] },
    ],
    interests: [
      { name: "Workforce Mobility & Alternative Education Access", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Direct Startup Building and Turnaround Operations", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Grit, Meritorious Hard Work, and Family", confidence: 0.98, evidence: ["li:about"] },
      { name: "Direct Honesty and Personal Sovereignty", confidence: 0.92, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Early mountain mornings: workout, family breakfast, intense startup operations.",
      social_energy: "Energetic extrovert who enjoys direct discussions, wrestling mats, and mountain campfires.",
      travel: "Travels between Utah, Silicon Valley investor networks, and national conferences.",
      fitness: "Heavy wrestling drills, deadlifts, trail running.",
      food: "High-protein barbecue, hearty mountain cooking, family breakfasts.",
      other: "Deep roots in Utah mountain culture.",
    },
    ambition: {
      level: "High",
      direction: "Eliminating student debt risk and transforming career education for everyday strivers.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Direct, self-deprecating startup war stories, teasing.",
      evidence: ["ig:bio"],
    },
    communication_style: {
      summary: "Plainspoken, candid, storytelling, relies on real-world practical examples.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Values a loyal, resilient partner who loves family life, outdoors, and shared perseverance", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Uncompromising directness and conservative/libertarian leanings can clash with coastal norms", why: "Values independence", evidence: ["li:about"] },
      { point: "Intense operational focus during turnaround phases", why: "Hands-on founder", evidence: ["li:exp:1"] },
    ],
    green_flags: [
      { flag: "Immense physical and emotional grit; never gives up in adversity", evidence: ["li:about"] },
      { flag: "Deeply loyal to family and lifelong friends", evidence: ["ig:bio"] },
    ],
    unknowns: ["Musical tastes", "International travel preferences"],
  },

  real_rauchg: {
    identity: {
      name: "Guillermo Rauch",
      headline: "Founder and CEO at Vercel | Creator of Next.js, Socket.io",
      location: "San Francisco, CA & Buenos Aires, Argentina",
      current_role: "CEO",
      company: "Vercel",
      education: ["Self-taught software architect & open source creator"],
    },
    summary: "Founder & CEO of Vercel and creator of Next.js, Socket.io, and Mongoose. Passionate about web performance, developer experience, open source ecosystems, Argentine asado barbecues, soccer, and sipping yerba mate.",
    needs: [
      { need: "Mutual appreciation for speed, aesthetic beauty, and high-craft execution", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "ig:bio"] },
      { need: "Shared love for Argentine culinary warmth (asado), yerba mate, and soccer", kind: "stated", weight: 4, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Partner who values international perspective and creative passion", kind: "inferred", weight: 4, confidence: 0.85, evidence: ["li:exp:1"] },
    ],
    hobbies: [
      { name: "Argentine Asado Grilling & Barbecue Craft", confidence: 0.95, evidence: ["ig:post:1"] },
      { name: "Drinking Yerba Mate & Contemplative Reading", confidence: 0.92, evidence: ["ig:bio"] },
      { name: "Soccer (Football) & Fitness", confidence: 0.88, evidence: ["ig:post:2"] },
    ],
    interests: [
      { name: "Web Performance, Edge Rendering, and Next.js Ecosystem", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Open Source Craft and Developer Empowerment", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Speed of Execution and Relentless Polish", confidence: 0.98, evidence: ["li:about"] },
      { name: "Community Generosity and Warmth", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "High-cadence maker rhythm: sipping mate, reviewing pull requests, leading Vercel, weekend asados.",
      social_energy: "Charismatic ambivert: connects effortlessly with developers globally, cherishes close friends.",
      travel: "Travels between San Francisco, Buenos Aires, and global developer conferences.",
      fitness: "Soccer games, gym workouts, rapid urban walks.",
      food: "Authentic Argentine beef, empanadas, fine Malbec wine, yerba mate.",
      other: "Obsessed with latency reduction in software and life.",
    },
    ambition: {
      level: "Very High",
      direction: "Making the web dramatically faster and empowering millions of digital creators.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Quick, witty, tech-literate, Argentine warmth.",
      evidence: ["ig:bio"],
    },
    communication_style: {
      summary: "Fast-paced, highly articulate, visual, uses vivid analogies about speed and user delight.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Values an ambitious, culturally vibrant partner who appreciates fine food, speed, and deep warmth", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Obsession with speed and sub-second responsiveness can feel intense to relaxed partners", why: "Core drive for performance", evidence: ["li:about"] },
      { point: "Frequent international travel between Americas and global tech hubs", why: "Global CEO responsibilities", evidence: ["li:exp:1"] },
    ],
    green_flags: [
      { flag: "Incredible generosity toward open-source builders and young talent", evidence: ["li:about"] },
      { flag: "Warm, gracious host who makes everyone feel part of the team", evidence: ["ig:post:1"] },
    ],
    unknowns: ["Outdoor camping interests", "Non-fiction history preferences"],
  },

  real_dylanfield: {
    identity: {
      name: "Dylan Field",
      headline: "Co-Founder and CEO at Figma",
      location: "San Francisco, CA",
      current_role: "CEO",
      company: "Figma",
      education: ["Brown University (Computer Science, Thiel Fellow)"],
    },
    summary: "Co-founder & CEO of Figma, the collaborative interface design platform. Devoted to contemporary art, graphic design typography, surfing Ocean Beach, generative creativity, and patient founder endurance.",
    needs: [
      { need: "Mutual appreciation for visual design, contemporary art, and typography", kind: "stated", weight: 5, confidence: 0.95, evidence: ["li:about", "ig:bio"] },
      { need: "Shared love for surfing, coastal exploration, and creative culture", kind: "stated", weight: 4, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Patience, playfulness, and low pretense in personal connection", kind: "inferred", weight: 4, confidence: 0.85, evidence: ["li:exp:1"] },
    ],
    hobbies: [
      { name: "Surfing at Ocean Beach & Pacific Coast", confidence: 0.95, evidence: ["ig:post:1"] },
      { name: "Contemporary Art Collecting & Gallery Walks", confidence: 0.92, evidence: ["ig:post:2"] },
      { name: "Typography & Generative Computer Graphics", confidence: 0.9, evidence: ["li:about"] },
    ],
    interests: [
      { name: "Collaborative Software & Creative Community Tooling", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Web-Based Graphics & Creative Freedom", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Patient Curiosity and Playful Exploration", confidence: 0.98, evidence: ["li:about"] },
      { name: "Inclusive Design and Craftsmanship", confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Creative flow: dawn surf sessions at Ocean Beach, design reviews at Figma, evening gallery visits.",
      social_energy: "Creative introvert who loves engaging with artists, designers, and quiet coffee talks.",
      travel: "Travels for design summits, art fairs, and coastal surf destinations.",
      fitness: "Surfing cold ocean swells, swimming, walking San Francisco hills.",
      food: "Local artisanal cafes, pour-over coffee, fresh farm-to-table cuisine.",
      other: "Aesthetic perfectionist who notices font kerning in menus.",
    },
    ambition: {
      level: "Very High",
      direction: "Making interface and visual design accessible and collaborative for everyone.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Playful, whimsical, understated, art-geek banter.",
      evidence: ["ig:bio"],
    },
    communication_style: {
      summary: "Thoughtful, gentle, asks probing questions about visual intention and feeling.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Seeks a creative, soulful partner who appreciates art, ocean rhythms, and thoughtful design", confidence: 0.9, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "High aesthetic sensitivity can make chaotic or poorly designed environments draining", why: "Design orientation", evidence: ["li:about"] },
      { point: "Patient, long-deliberation style might frustrate partners wanting rapid-fire decisions", why: "Thoughtful pacing", evidence: ["li:exp:1"] },
    ],
    green_flags: [
      { flag: "Incredible patience and decade-long loyalty to craft", evidence: ["li:about"] },
      { flag: "Gentle, non-hierarchical respect for all collaborators", evidence: ["li:exp:1"] },
    ],
    unknowns: ["Musical instruments played", "Culinary cooking preferences"],
  },

  real_shwetakatti: {
    identity: {
      name: "Shweta Katti",
      headline: "Youth Activist, Human Rights Advocate & UN Speaker",
      location: "New York, NY / Mumbai, India",
      current_role: "Human Rights Advocate & Speaker",
      company: "Global Youth Advocacy",
      education: ["B.A. in Psychology, Bard College"],
    },
    summary: "UN Youth Courage Award recipient and pioneering activist for girls' education and human rights. First woman from Mumbai's red-light district to study in the United States. Passionate about creative writing, storytelling, dance, and social justice.",
    needs: [
      { need: "Mutual reverence for human rights, fearlessness, and radical empathy", kind: "stated", weight: 5, confidence: 0.98, evidence: ["li:about", "ig:bio"] },
      { need: "Shared love for creative writing, storytelling, and cultural expression", kind: "stated", weight: 4, confidence: 0.9, evidence: ["ig:post:1"] },
      { need: "Deep emotional safety, unconditional respect, and warmth", kind: "inferred", weight: 5, confidence: 0.95, evidence: ["li:exp:1"] },
    ],
    hobbies: [
      { name: "Creative Writing & Expressive Poetry", confidence: 0.95, evidence: ["ig:post:1"] },
      { name: "Dance & Community Theater", confidence: 0.9, evidence: ["ig:post:2"] },
      { name: "Exploring Vibrant Global Street Food & Markets", confidence: 0.85, evidence: ["ig:bio"] },
    ],
    interests: [
      { name: "Girls' Global Education & Economic Independence", confidence: 0.98, evidence: ["li:exp:1"] },
      { name: "Intersectional Healing & Trauma-Informed Community Care", confidence: 0.95, evidence: ["li:about"] },
    ],
    values: [
      { name: "Fearless Courage and Radical Authenticity", confidence: 0.98, evidence: ["li:about"] },
      { name: "Empathy, Healing, and Community Power", confidence: 0.98, evidence: ["li:exp:1"] },
    ],
    lifestyle: {
      rhythm: "Passionate and purposeful: community organizing, creative writing workshops, and speaking engagements.",
      social_energy: "Expressive ambivert: powerful and magnetic on podiums, deeply intimate and reflective in quiet bonds.",
      travel: "International human rights conferences and grassroots community visits.",
      fitness: "Dance, expressive movement, walking city streets.",
      food: "Authentic Indian home cooking, spicy curries, chai, street food.",
      other: "Deep emotional awareness and storytelling depth.",
    },
    ambition: {
      level: "Very High",
      direction: "Dismantling systemic oppression and providing every marginalized child dignity and education.",
      evidence: ["li:exp:1"],
    },
    humor: {
      style: "Spirited, resilient, warm, finds joy even in struggle.",
      evidence: ["ig:bio"],
    },
    communication_style: {
      summary: "Deeply heartfelt, passionate, poetic, speaks with raw truth and immense moral clarity.",
      evidence: ["li:about"],
    },
    relationship_signals: [
      { signal: "Requires complete emotional integrity, active empathy, and alignment with human dignity", confidence: 0.95, evidence: ["li:about"] },
    ],
    friction_points: [
      { point: "Uncompromising moral standards leave zero room for cynicism or superficiality", why: "Principled activist worldview", evidence: ["li:about"] },
      { point: "Emotional investment in global human suffering requires understanding partners", why: "Heartfelt activism", evidence: ["li:exp:1"] },
    ],
    green_flags: [
      { flag: "Extraordinary courage, emotional resilience, and fearless truth-telling", evidence: ["li:about"] },
      { flag: "Boundless empathy and warmth for others", evidence: ["ig:bio"] },
    ],
    unknowns: ["Quiet weekend relaxation preferences", "Favorite contemporary cinema"],
  },
};

export function getRealPersona(personId: string, name?: string): Persona | null {
  if (REAL_PERSONAS[personId]) {
    return REAL_PERSONAS[personId];
  }
  // Try matching by normalized name
  if (name) {
    const key = `real_${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
    if (REAL_PERSONAS[key]) return REAL_PERSONAS[key];
    const match = Object.values(REAL_PERSONAS).find(
      (p) => p.identity.name.toLowerCase() === name.toLowerCase()
    );
    if (match) return match;
  }
  return null;
}

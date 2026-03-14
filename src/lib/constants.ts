// ===== NAVIGATION =====
export const navLinks = [
  { label: "Start", href: "/" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Athletiktraining", href: "/athletiktraining" },
  { label: "Ernährung", href: "/ernaehrung" },
  { label: "Leistungen", href: "/leistungen" },
  { label: "Referenzen", href: "/referenzen" },
] as const;

// ===== CONTACT INFO =====
export const contact = {
  email: "primeathleteacademy@primeathleteacademy.com",
  location: "95448 Bayreuth",
  calendlyUrl: "https://calendly.com/kehl-jonas/30min?month=2026-03",
  instagramUrl: "https://www.instagram.com/prime_athlete_academy?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  instagramHandle: "@prime_athlete_academy",
  websiteUrl: "https://primeathleteacademy.com",
} as const;

// ===== COACHES =====
export const coaches = [
  {
    name: "Jonas Kehl",
    role: "Co-Founder & Head Coach",
    imageSrc: "/images/coaches/jonas-kehl.jpg",
    actionImageSrc: "/images/coaches/jonas-kehl-action.jpg",
    initials: "JK",
    bio: "Nach 8 Jahren beim FC Bayern München weiß ich genau, was es braucht, um auf höchstem Niveau zu performen. Als aktiver Profifußballer und studierter Sportwissenschaftler verbinde ich Praxiserfahrung mit wissenschaftlicher Expertise – und genau das gebe ich an meine Athleten weiter.",
    highlights: [
      { text: "8 Jahre FC Bayern München", icon: "trophy" },
      { text: "Aktiver Profifußballer (4. Liga)", icon: "football" },
      { text: "Sportwissenschaft-Studium", icon: "graduation" },
    ],
    licenses: [
      "Ernährungsberater A-Lizenz",
      "Athletiktrainer A-Lizenz",
      "Personal Trainer Lizenz",
    ],
  },
  {
    name: "Patrick Scheder",
    role: "Co-Founder & Head Coach",
    imageSrc: "/images/coaches/patrick-scheder.jpg",
    actionImageSrc: "/images/coaches/patrick-scheder-action.jpg",
    initials: "PS",
    bio: "Ich habe die Jugendabteilungen des 1. FC Nürnberg und FC Carl Zeiss Jena durchlaufen und spiele aktuell als Profi in der 4. Liga. Mit über 150.000 Followern auf Social Media inspiriere ich täglich Athleten, ihr volles Potenzial auszuschöpfen – und helfe ihnen dabei, es auch wirklich zu erreichen.",
    highlights: [
      { text: "Jugend bei 1. FC Nürnberg & FC Carl Zeiss Jena", icon: "football" },
      { text: "Aktiver Profifußballer (4. Liga)", icon: "trophy" },
      { text: "150k+ Social Media Follower", icon: "users" },
    ],
    licenses: [
      "Ernährungsberater A-Lizenz",
      "Athletiktrainer A-Lizenz",
      "Personal Trainer Lizenz",
    ],
  },
] as const;

// ===== MISSION =====
export const mission = {
  headline: "Entfessle dein volles Potenzial",
  text: "Schnelligkeit, Explosivität, Stabilität und Ausdauer bilden das Herzstück des modernen Fußballs. Wir verbinden Athletiktraining mit High-Performance- und Ernährungscoaching, damit du dich Woche für Woche spürbar weiterentwickelst.",
};

// ===== TRAINING PILLARS =====
export const trainingPillars = [
  {
    title: "Schnelligkeit",
    subtitle: "Speed & Agility",
    description:
      "Werde schneller auf den ersten Metern und im Antritt. Individualisiertes Sprinttraining, Beschleunigungs-Drills und Richtungswechsel-Training für explosive Geschwindigkeit auf dem Platz.",
    features: [
      "Sprintmechanik-Optimierung",
      "Antrittstraining & Beschleunigung",
      "Richtungswechsel & Agility",
    ],
    icon: "zap",
    imageSrc: "/images/training/speed.jpg",
  },
  {
    title: "Explosivkraft",
    subtitle: "Explosive Power",
    description:
      "Maximale Kraft in minimaler Zeit. Plyometrisches Training, Krafttraining und spezifische Übungen für Sprungkraft, Schusskraft und Zweikampfstärke.",
    features: [
      "Plyometrie & Sprungkraft",
      "Maximalkraft-Training",
      "Zweikampf-Vorbereitung",
    ],
    icon: "flame",
    imageSrc: "/images/training/explosiveness.jpg",
  },
  {
    title: "Stabilität",
    subtitle: "Core & Stability",
    description:
      "Ein stabiler Körper ist die Basis für alles andere. Funktionelles Core-Training, Gleichgewichtsarbeit und Verletzungsprävention für langfristige Performance.",
    features: [
      "Funktionelles Core-Training",
      "Balance & Propriozeption",
      "Verletzungsprävention",
    ],
    icon: "shield",
    imageSrc: "/images/training/stability.jpg",
  },
  {
    title: "Ausdauer",
    subtitle: "Endurance & Conditioning",
    description:
      "90 Minuten auf höchstem Niveau performen. Individualisierte Ausdauerprogramme, HIT-Training und Conditioning, abgestimmt auf deine Position und Spielweise.",
    features: [
      "Positionsspezifisches Conditioning",
      "High-Intensity Intervalltraining",
      "Laktatschwellen-Training",
    ],
    icon: "heart",
    imageSrc: "/images/training/endurance.jpg",
  },
] as const;

// ===== NUTRITION SERVICES =====
export const nutritionServices = [
  {
    title: "Individuelle Ernährungspläne",
    description: "Maßgeschneiderte Pläne basierend auf deinem Trainingspensum, deiner Position und deinen Zielen.",
    icon: "clipboard",
  },
  {
    title: "Matchday-Nutrition",
    description: "Exakte Ernährungsprotokolle für vor, während und nach dem Spiel für maximale Leistung.",
    icon: "calendar",
  },
  {
    title: "Supplement-Beratung",
    description: "Evidenzbasierte Empfehlungen für Nahrungsergänzungsmittel, die wirklich einen Unterschied machen.",
    icon: "pill",
  },
  {
    title: "Regenerations-Ernährung",
    description: "Optimale Nährstoffversorgung für schnellere Erholung nach Training und Spiel.",
    icon: "refresh",
  },
  {
    title: "Schlaf-Optimierung",
    description: "Ernährungsstrategien und Routinen für besseren Schlaf und damit bessere Regeneration.",
    icon: "moon",
  },
  {
    title: "Einkaufslisten & Rezepte",
    description: "Praktische Einkaufslisten und einfache, schnelle Rezepte, die in deinen Alltag passen.",
    icon: "shoppingCart",
  },
] as const;

// ===== WHAT YOU GET (LEISTUNGEN) =====
export const deliverables = [
  { text: "Individueller Trainingsplan", icon: "dumbbell" },
  { text: "Individueller Ernährungsplan", icon: "apple" },
  { text: "Video-Anleitungen für jede Übung", icon: "video" },
  { text: "24/7 WhatsApp-Support", icon: "messageCircle" },
  { text: "Wöchentliche 1-zu-1 Calls", icon: "phone" },
  { text: "Gruppencalls mit allen Athleten", icon: "users" },
  { text: "Spieltags-Protokolle", icon: "clipboardList" },
  { text: "Warm-up & Cool-down Pläne", icon: "activity" },
  { text: "Regenerationspläne", icon: "rotateCcw" },
  { text: "Regelmäßige Plan-Anpassungen", icon: "settings" },
  { text: "Fortschritts-Tracking", icon: "trendingUp" },
  { text: "Verletzungsprävention", icon: "shield" },
] as const;

// ===== PROCESS STEPS =====
export const processSteps = [
  {
    step: "01",
    title: "Erstgespräch",
    description:
      "Kostenloser Call, in dem wir dich und deine Ziele kennenlernen. Kein Sales-Pitch – wir schauen ehrlich, ob wir zusammenpassen.",
    icon: "messageSquare",
  },
  {
    step: "02",
    title: "Analyse & Plan",
    description:
      "Wir analysieren deine aktuelle Situation und erstellen deinen individuellen Trainings- und Ernährungsplan.",
    icon: "clipboardCheck",
  },
  {
    step: "03",
    title: "Umsetzung",
    description:
      "Du startest mit deinem Plan und wir begleiten dich rund um die Uhr. Video-Anleitungen, Check-ins und direkter Draht.",
    icon: "rocket",
  },
  {
    step: "04",
    title: "Optimierung",
    description:
      "Regelmäßige Anpassungen basierend auf deinen Fortschritten. Wir optimieren kontinuierlich für deine beste Performance.",
    icon: "trendingUp",
  },
] as const;

// ===== TESTIMONIALS =====
export const testimonials = [
  {
    name: "Kolja Oudenne",
    team: "Hannover 96",
    league: "2. Bundesliga",
    quote:
      "Das Coaching hat meine Athletik auf ein neues Level gebracht. Die individuelle Betreuung und die wissenschaftlich fundierten Methoden machen den Unterschied.",
    imageSrc: "/images/testimonials/kolja-oudenne.jpg",
  },
  {
    name: "Robin Heußer",
    team: "Eintracht Braunschweig",
    league: "2. Bundesliga",
    quote:
      "Jonas und Patrick verstehen als aktive Profis genau, was man braucht. Die Trainingspläne sind perfekt auf meinen Spielplan abgestimmt.",
    imageSrc: "/images/testimonials/robin-heusser.jpg",
  },
  {
    name: "Jannick Hofmann",
    team: "Rot-Weiß Essen",
    league: "3. Liga",
    quote:
      "Seit ich mit PAA arbeite, hat sich meine Explosivkraft und Regeneration deutlich verbessert. Absolute Empfehlung für jeden ambitionierten Fußballer.",
    imageSrc: "/images/testimonials/jannick-hofmann.jpg",
  },
  {
    name: "Veron Dobruna",
    team: "Aktiver Profifußballer",
    league: "4. Liga",
    quote:
      "Jonas hat mich die letzten 2 Jahre in der Sommer- und Winterpause trainiert. Mit der intensiveren Betreuung durch PAA und der Ernährungsoptimierung sehe ich nun noch deutlichere Verbesserungen in meiner Leistung.",
    imageSrc: "/images/testimonials/veron-dobruna.jpg",
  },
  {
    name: "Kaan Kurt",
    team: "Aktiver Profifußballer",
    league: "Regionalliga",
    quote:
      "Das Training mit PAA hat meine körperliche Leistungsfähigkeit auf ein komplett neues Level gehoben. Die individuelle Betreuung und die professionelle Herangehensweise haben mich als Spieler spürbar weiterentwickelt.",
    imageSrc: "/images/testimonials/kaan-kurt.jpg",
  },
  {
    name: "Alexander Prokopenko",
    team: "Aktiver Profifußballer",
    league: "Regionalliga",
    quote:
      "Ich arbeite schon lange mit Patrick an meiner Athletik und Ernährung. Durch die intensivere Zusammenarbeit mit PAA in den letzten Monaten habe ich nochmals spürbare Fortschritte gemacht.",
    imageSrc: "/images/testimonials/alexander-prokopenko.jpg",
  },
] as const;

// ===== STATS =====
export const stats = [
  { value: 8, suffix: "+", label: "Jahre FC Bayern" },
  { value: 150, suffix: "k+", label: "Community" },
  { value: 2, suffix: ".", label: "Liga Klienten" },
] as const;

// ===== INSTAGRAM POSTS (Update URLs as needed) =====
export const instagramPosts = [
  "https://www.instagram.com/p/EXAMPLE1/",
  "https://www.instagram.com/p/EXAMPLE2/",
  "https://www.instagram.com/p/EXAMPLE3/",
  "https://www.instagram.com/p/EXAMPLE4/",
  "https://www.instagram.com/p/EXAMPLE5/",
  "https://www.instagram.com/p/EXAMPLE6/",
] as const;

// ===== NUTRITION FAQ =====
export const nutritionFaq = [
  {
    question: "Muss ich auf alles verzichten, was mir schmeckt?",
    answer:
      "Auf keinen Fall. Wir arbeiten mit einem flexiblen Ansatz, der sich an deinen Alltag und Vorlieben anpasst. Es geht nicht um Verzicht, sondern um smarte Ernährungsstrategien, die zu dir passen.",
  },
  {
    question: "Bekomme ich einen festen Ernährungsplan?",
    answer:
      "Ja, du bekommst einen individuellen Plan, der auf deinen Bedarf, dein Training und deine Ziele abgestimmt ist. Wir passen ihn regelmäßig an deine Fortschritte und Saisonphase an.",
  },
  {
    question: "Wie sieht die Ernährung an Spieltagen aus?",
    answer:
      "Du bekommst ein detailliertes Matchday-Protokoll: Was du wann vor, während und nach dem Spiel essen und trinken solltest für maximale Leistung und optimale Regeneration.",
  },
  {
    question: "Kann ich das Coaching auch nutzen, wenn ich abnehmen oder zunehmen will?",
    answer:
      "Absolut. Ob Muskelaufbau, Gewichtsmanagement oder reine Leistungsoptimierung – wir passen die Ernährungsstrategie individuell an dein Ziel an.",
  },
] as const;

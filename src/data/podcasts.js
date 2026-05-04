/**
 * Mock podcasts for the SM MPR mobile prototype.
 *
 * Shape follows the podcast detail screen (`podcastInfo`): show title, square artwork,
 * long description, and a vertical list of episode cards (title, small art, new dot,
 * date + duration line).
 *
 * Podcast info reference:
 * https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19585-135699
 */

/** Max episodes per show (prototype cap). */
export const MAX_EPISODES_PER_PODCAST = 10;

/** @typedef {Object} PodcastEpisode
 * @property {string} id
 * @property {string} title
 * @property {string} thumbnail Square art for the episode row.
 * @property {boolean} isNew Shown with status dot in the comp (e.g. `EpisodeCard` “new”).
 * @property {string} releaseDate Display like Figma: `M / D / YYYY` with spaces around slashes.
 * @property {string} duration Display like Figma: `1 hr 15 mins` or `42 mins`.
 */

/**
 * @typedef {Object} Podcast
 * @property {string} id
 * @property {string} categoryId
 * @property {string} categoryLabel Display category (browse grouping).
 * @property {string} title
 * @property {string} thumbnail Square show art (large hero in `podcastInfo`).
 * @property {string} description Show blurb (truncate + “More…” in UI).
 * @property {PodcastEpisode[]} episodes Length ≤ {@link MAX_EPISODES_PER_PODCAST}.
 */

export const PODCAST_CATEGORIES = [
  { id: "news", label: "News" },
  { id: "comedy", label: "Comedy" },
  { id: "society-culture", label: "Society & Culture" },
  { id: "business", label: "Business" },
  { id: "true-crime", label: "True Crime" },
  { id: "sports", label: "Sports" },
  { id: "health-fitness", label: "Health & Fitness" },
  { id: "religion-spirituality", label: "Religion & Spirituality" },
  { id: "arts", label: "Arts" },
  { id: "education", label: "Education" },
  { id: "history", label: "History" },
  { id: "tv-film", label: "TV & Film" },
  { id: "science", label: "Science" },
  { id: "technology", label: "Technology" },
  { id: "music-shows", label: "Music" },
  { id: "kids-family", label: "Kids & Family" },
  { id: "leisure", label: "Leisure" },
  { id: "fiction", label: "Fiction" },
  { id: "government", label: "Government" },
];

const PODCASTS_PER_CATEGORY = 20;

/**
 * Fixed show titles (20 per category), indexed 0–19 in build order.
 * @type {Record<string, string[]>}
 */
const SHOW_TITLES_BY_CATEGORY = {
  news: [
    "The Daily Dispatch",
    "World Briefing Room",
    "Capitol Beat",
    "Morning Wire Summit",
    "The Fifth Estate Report",
    "Global Ledger Live",
    "Frontline Tonight",
    "The Bulletin Hour",
    "City Desk Confidential",
    "Breaking Dawn News",
    "Signal & Noise",
    "The Press Pool",
    "Overnight Edition",
    "National Notebook",
    "Crisis Watch Radio",
    "The Fact Check Desk",
    "Democracy Nowcast",
    "Pulse of the Planet",
    "Evening Standard Time",
    "The Interpreter Files",
  ],
  comedy: [
    "Laugh Track Optional",
    "The Late Night Snack",
    "Bits & Pieces",
    "Hecklers Welcome",
    "Open Mic Confidential",
    "The Roast Room",
    "Punchline Study Hall",
    "Dad Jokes Anonymous",
    "Crowd Work Only",
    "Whiskey & Wit",
    "The Riff Raff Hour",
    "Stand-Up Science",
    "Comedy Cellar Stories",
    "Improv Emergency",
    "The Heckle Response Unit",
    "Jokes Per Minute",
    "After Midnight Bits",
    "The Callback Podcast",
    "Room for One More",
    "Serious Fun Only",
  ],
  "society-culture": [
    "The Human Layer",
    "Culture Trip Diary",
    "Neighbors & Strangers",
    "The Norm Report",
    "Soft Power Stories",
    "Rituals & Rhythms",
    "Class Reunion Forever",
    "The Dinner Table",
    "Belonging Lab",
    "Modern Manners",
    "Second Acts",
    "The Civic Salon",
    "Backyard Philosophers",
    "Small Town Secrets",
    "Urban Mythologies",
    "The Etiquette Guild",
    "Sunday Kind of Love",
    "Counterculture Club",
    "The Commons Podcast",
    "Life in Beta",
  ],
  business: [
    "The Ledger Line",
    "Market Makers Unplugged",
    "Startup Graveyard Stories",
    "Boardroom Breach",
    "Capital Allocated",
    "The Ops Manual",
    "Exit Interview Only",
    "Risk & Reward Radio",
    "Pricing Power Hour",
    "The KPI Sessions",
    "Venture Human",
    "Supply Chain Diaries",
    "Earnings Call After Dark",
    "The Memo",
    "Scale With Grace",
    "Customer Zero",
    "Due Diligence Diaries",
    "The Pivot Table",
    "Margin Notes",
    "Work in Progress Weekly",
  ],
  "true-crime": [
    "Cold Case Atlas",
    "Evidence Room B",
    "The Alibi Hour",
    "Witness Stand Stories",
    "Missing on Monday",
    "Shadow of Doubt",
    "The Tip Line",
    "Crime Scene Tape",
    "No Body Club",
    "The Accomplice",
    "Dead Reckoning",
    "Person of Interest Only",
    "Small Town Noir",
    "The Unresolved List",
    "Forensic Audio",
    "Case File 7",
    "The Interrogation Tapes",
    "After Midnight Murders",
    "The Jury Box",
    "Red Herring Radio",
  ],
  sports: [
    "Fourth & Longform",
    "The Press Box Podcast",
    "Injury Timeout",
    "Stats Don't Lie Much",
    "Halftime Hot Takes",
    "The Home Team Advantage",
    "Draft Day Dreams",
    "Cleats & Coffee",
    "Extra Innings Only",
    "The Replay Room",
    "Bench Mob Radio",
    "Championship DNA",
    "Fantasy Regrets",
    "The Huddle Breakdown",
    "Overtime Confessions",
    "Underdog Hour",
    "The Athlete's Notebook",
    "Arena Echoes",
    "Season Ticket Stories",
    "Postgame Therapy",
  ],
  "health-fitness": [
    "Rest Day Radio",
    "The Recovery Project",
    "Macros & Mindset",
    "Sleep Debt Diaries",
    "Gym Therapy Sessions",
    "Longevity Ledger",
    "Heart Rate Variability Club",
    "The Hydration Hour",
    "Mobility Minutes",
    "Stronger Than Yesterday",
    "Doctor's Orders (Unofficial)",
    "The Whole Food Week",
    "Breathwork Breakroom",
    "Injury Prevention Society",
    "Mile Marker Meditations",
    "The Protein Report",
    "Cold Plunge Chronicles",
    "Desk to 5K",
    "Hormone Highway",
    "Wellness Without Woo",
  ],
  "religion-spirituality": [
    "Sacred Ordinary Time",
    "The Examen Hour",
    "Faith & Doubt Club",
    "Liturgy Life",
    "Monastery Road",
    "Scripture & Snacks",
    "The Quiet Chapel",
    "Interfaith Introductions",
    "Sabbath Stories",
    "Grace Notes Daily",
    "Pilgrim's Podcast",
    "The Lectionary Lounge",
    "Contemplative Commute",
    "Saints & Strangers",
    "Prayer Bench Radio",
    "Theology for Everyone",
    "The Awakening Bell",
    "Sacred Text Study Hall",
    "Devotion in the Chaos",
    "Soulful Questions",
  ],
  arts: [
    "The Studio Visit",
    "Curtain Call Stories",
    "Palette Knife Confessions",
    "Museum After Hours",
    "The Critique Session",
    "Analog Artist Radio",
    "Design Debt Diaries",
    "Jazz in the Afternoon",
    "Opening Night Only",
    "The Curation Desk",
    "Street Art Atlas",
    "Composer's Kitchen",
    "Ballet Breakdown",
    "Film Stock Forever",
    "The Gallery Ghost",
    "Performance Anxiety Hour",
    "Ceramics & Coffee",
    "Poetry at Lunch",
    "The Aesthetics Lab",
    "Metronome Society",
  ],
  education: [
    "Pedagogy Unpacked",
    "The Homework Hotline",
    "Classroom Hacks",
    "Dean's List Diaries",
    "Lifelong Learners Lab",
    "Substitute Stories",
    "Office Hours Only",
    "Standards & Storytelling",
    "The Study Group",
    "SEL After School",
    "Lecture Capture Confessions",
    "Financial Aid Fridays",
    "The Admissions Angle",
    "STEM & Friends",
    "Special Education Stories",
    "College Ready Maybe",
    "The Faculty Lounge",
    "Tutor in Your Ear",
    "Report Card Radio",
    "Curriculum Underground",
  ],
  history: [
    "The Archive Hour",
    "Primary Sources Only",
    "Forgotten Frontiers",
    "Revolutions in Progress",
    "The Timeline Show",
    "Empire Builders Anonymous",
    "Silk Road Stories",
    "Before Yesterday",
    "History's Loose Threads",
    "The Map Room",
    "Regime Change Diaries",
    "Artifact Atlas",
    "Oral History Club",
    "Battlefield Echoes",
    "The Mingling Centuries",
    "Hidden Figures Studio",
    "Cold War Coffee",
    "Byzantine Breakdown",
    "The Historian's Desk",
    "Footnotes Live",
  ],
  "tv-film": [
    "Spoiler Alert Society",
    "Pilot Season Therapy",
    "The Writers' Room Leak",
    "Box Office Autopsy",
    "Streaming Wars Daily",
    "Director's Commentary Only",
    "Finale Post-Mortem",
    "The Binge Watcher's Guide",
    "Casting Couch Stories",
    "Prestige TV Anonymous",
    "Credits Roll Radio",
    "Sequel Syndrome",
    "Awards Season Armchair",
    "The Green Room",
    "Cult Classic Club",
    "Sitcom Science",
    "Noir at Night",
    "Soundstage Stories",
    "The Adaptation Files",
    "Episode Zero",
  ],
  science: [
    "Method & Madness",
    "Peer Review Party",
    "The Petri Dish",
    "Quantum Coffee Break",
    "Field Notes Live",
    "Hypothesis Kitchen",
    "Cosmos in Your Car",
    "Lab Safety Optional",
    "The Ig Nobel Hour",
    "Climate by Degrees",
    "Specimen Stories",
    "Nature Briefing Audio",
    "Telescope Time",
    "The Double Blind",
    "Entropy Everywhere",
    "Marine Biology Club",
    "Particle Fiction",
    "Genome Jazz",
    "The Replication Crisis Show",
    "Ask a Scientist",
  ],
  technology: [
    "Patch Notes & Prayers",
    "The Stack Trace",
    "VC Twitter Therapy",
    "SaaS Graveyard Tours",
    "DevOps Diaries",
    "Hardware TearDown Club",
    "The Terms of Service Hour",
    "Zero Day Stories",
    "Cloud Cost Confessions",
    "AI Alignment Anonymous",
    "Keyboard Shortcuts Only",
    "The Burnout Buffer",
    "Open Source Oral History",
    "Product Roadmap Fiction",
    "Firmware After Dark",
    "The API Playground",
    "Serverless Skeptics",
    "Encryption Lullabies",
    "Startup Lawyer Lunch",
    "Version Two Syndrome",
  ],
  "music-shows": [
    "Songwriters in the Round",
    "The Setlist Show",
    "Press Play & Cry",
    "Behind the Board",
    "Sample Culture Radio",
    "Vinyl Emergency",
    "Tour Bus Confidential",
    "One Hit Rewind",
    "The Encore Hour",
    "Gear Talk Only",
    "Local Scene Report",
    "Chorus Line Stories",
    "Rhythm Section Therapy",
    "The A&R Desk",
    "Festival Survival Guide",
    "Cover Band Chronicles",
    "Music Theory for Humans",
    "The Bridge Build",
    "Loudness Wars Peace",
    "Audition Tape Stories",
  ],
  "kids-family": [
    "Storytime Express",
    "The Bedtime Wind-Down",
    "Why Why Why Cast",
    "Snack Break Podcast",
    "Superhero Science Jr.",
    "The Playground Pulse",
    "Family Meeting Minutes",
    "Dinosaur Dinner Club",
    "Calm Corner Audio",
    "Road Trip Riddles",
    "The Chore Chart Show",
    "Homework Buddy Radio",
    "Feelings Are Facts",
    "Grandma's Tales Reboot",
    "Screen Time Detox",
    "Silly Songs Saturday",
    "The Tooth Fairy Files",
    "Pet Club Confidential",
    "Weekend Adventure Map",
    "Growing Pains & Gains",
  ],
  leisure: [
    "Hobby Lobby (Not That One)",
    "Weekend Project Warriors",
    "The Knitting Circle Audio",
    "Garden Plot Twists",
    "Board Game Babylon",
    "Cocktail Chemistry",
    "Travel Hack Hotline",
    "RV Reality Check",
    "Puzzle Therapy Hour",
    "Collectors Anonymous",
    "Slow Living Lab",
    "BBQ Border Radio",
    "Fishing Tale Fibs",
    "Tea Time Tangent",
    "The DIY Disaster Zone",
    "Antique Mall Mysteries",
    "Camping Without Bears",
    "Record Store Saturdays",
    "Amateur Astronomy Club",
    "Leisure Studies Major",
  ],
  fiction: [
    "The Neon Archives",
    "Midnight on Marrow Lane",
    "The Last Lighthouse",
    "Department of Shadows",
    "Engine Heart Society",
    "Letters Never Sent",
    "The Quiet Apocalypse",
    "Clockwork Hearts Radio",
    "Beneath the Borough",
    "Starlight Salvage Co.",
    "The Memory Thief Files",
    "Crimson Carriage Tales",
    "Ash & Echo",
    "The Third Bell",
    "Borrowed Time Station",
    "Glasshive Stories",
    "The Orchid Protocol",
    "Saltwater Scripts",
    "Velvet Rope Confidential",
    "The Far Platform",
  ],
  government: [
    "The Hearing Room",
    "Policy Wonk Breakfast",
    "Capitol Corridor Diaries",
    "FOIA & Chill",
    "Local Government Lore",
    "Election Administration Now",
    "The Whistleblower Hour",
    "Red Tape Radio",
    "Municipal Minutes",
    "Defense Briefing (Unofficial)",
    "The Budget Battleground",
    "Rulemaking Roadshow",
    "Civil Service Stories",
    "The Select Committee Club",
    "Public Comment Period",
    "Filibuster Fuel",
    "Agency Atlas",
    "Ballot Measure Breakdown",
    "The Oversight Desk",
    "Democracy Maintenance Manual",
  ],
};

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Large square show art */
export function podcastThumbnailUrl(podcastId) {
  return `https://picsum.photos/seed/${encodeURIComponent(`pod-${podcastId}`)}/600/600`;
}

/** Small square episode art */
export function episodeThumbnailUrl(podcastId, episodeId) {
  return `https://picsum.photos/seed/${encodeURIComponent(`ep-${podcastId}-${episodeId}`)}/128/128`;
}

const EP_HOOKS = [
  "guest interview",
  "listener mailbag",
  "expert panel",
  "field recording",
  "case update",
  "season recap",
  "bonus clip",
  "deep dive",
  "explainer",
  "roundtable",
];

function podcastDescription(categoryLabel, title) {
  return (
    `${title} is a prototype Stingray podcast in ${categoryLabel}. Each run mixes interviews, explainers, and stories you can follow in order—or dip into mid-season. ` +
    `Episodes drop on a steady cadence in this mock catalog; subtitles hint at the topic so rows feel like a real show list. ` +
    `Subscribe and Share in the UI mirror the Figma podcast header actions.`
  );
}

function formatDurationMinutes(totalMins) {
  const m = Math.max(5, Math.min(180, totalMins));
  const hr = Math.floor(m / 60);
  const mn = m % 60;
  if (hr === 0) return `${mn} mins`;
  if (mn === 0) return hr === 1 ? `1 hr` : `${hr} hr`;
  return hr === 1 ? `1 hr ${mn} mins` : `${hr} hr ${mn} mins`;
}

/** Anchor calendar so dates look like the comp (April 2024) and go backward per episode. */
function releaseDateDisplay(episodeIndex) {
  const base = new Date(2024, 3, 25);
  base.setDate(base.getDate() - episodeIndex * 9);
  return `${base.getMonth() + 1} / ${base.getDate()} / ${base.getFullYear()}`;
}

function buildEpisodes(podcastId, podcastIndex) {
  /** @type {PodcastEpisode[]} */
  const out = [];
  const h = hashString(podcastId);

  for (let i = 0; i < MAX_EPISODES_PER_PODCAST; i += 1) {
    const epNum = MAX_EPISODES_PER_PODCAST - i + 120;
    const hook = EP_HOOKS[(i + h + podcastIndex) % EP_HOOKS.length];
    const title = `Ep ${epNum}: ${hook} — topics, beats, and show notes`;
    const episodeId = `e${i + 1}`;
    const mins = 28 + ((h + i * 17 + podcastIndex * 3) % 52);
    out.push({
      id: `${podcastId}__${episodeId}`,
      title,
      thumbnail: episodeThumbnailUrl(podcastId, episodeId),
      isNew: i === 0,
      releaseDate: releaseDateDisplay(i),
      duration: formatDurationMinutes(mins),
    });
  }
  return out;
}

function buildPodcast(category, index) {
  const titles = SHOW_TITLES_BY_CATEGORY[category.id];
  if (!titles || titles.length !== PODCASTS_PER_CATEGORY) {
    throw new Error(
      `podcasts: expected ${PODCASTS_PER_CATEGORY} fixed titles for category "${category.id}"`,
    );
  }
  const title = titles[index];
  const id = `${category.id}__${String(index).padStart(2, "0")}`;
  return {
    id,
    categoryId: category.id,
    categoryLabel: category.label,
    title,
    thumbnail: podcastThumbnailUrl(id),
    description: podcastDescription(category.label, title),
    episodes: buildEpisodes(id, index),
  };
}

function buildCatalog() {
  /** @type {Podcast[]} */
  const all = [];
  for (const cat of PODCAST_CATEGORIES) {
    for (let i = 0; i < PODCASTS_PER_CATEGORY; i += 1) {
      all.push(buildPodcast(cat, i));
    }
  }
  return all;
}

/** 19 × 20 shows; each show has {@link MAX_EPISODES_PER_PODCAST} episodes. */
export const PODCASTS = buildCatalog();

/** @type {Map<string, Podcast>} */
const byId = new Map(PODCASTS.map((p) => [p.id, p]));

export function getPodcastById(id) {
  return byId.get(id) ?? null;
}

/** Resolves `{ podcast, episode }` only if `episodeId` belongs to this show (`PodcastEpisode.id`). */
export function getPodcastEpisodeById(podcastId, episodeId) {
  const podcast = getPodcastById(podcastId);
  if (!podcast || !episodeId) {
    return null;
  }
  const episode =
    podcast.episodes.find((e) => e.id === episodeId) ?? null;
  if (!episode) {
    return null;
  }
  return { podcast, episode };
}

export function getPodcastsByCategory(categoryId) {
  return PODCASTS.filter((p) => p.categoryId === categoryId);
}

export function getPodcastCategoryById(categoryId) {
  return PODCAST_CATEGORIES.find((c) => c.id === categoryId) ?? null;
}

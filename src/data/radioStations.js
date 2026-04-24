/**
 * Mock radio stations for the SM MPR mobile prototype.
 *
 * Distinct from **music channels** (curated music streams) in `musicChannels.js`.
 * Use these for FM/AM-style browse, “station” detail, and radio player stubs.
 *
 * **International:** categories are flat for now (20 stations). A future UX pass
 * should nest International under continents, then countries / regions / cities—see
 * `docs/figma-nodes.md` (Radio mock data — International TODO).
 */

/** @typedef {Object} RadioStation
 * @property {string} id Stable id: `{categoryId}__{00–19}`.
 * @property {string} categoryId Key from {@link RADIO_STATION_CATEGORIES}.
 * @property {string} categoryLabel Display grouping label.
 * @property {string} name Station brand / display name.
 * @property {string} thumbnail Square artwork URL (prototype placeholder).
 * @property {string} description Blurb for station info screens.
 * @property {string[]} tags Short labels (format, locale, mood) for chips or lists.
 * @property {string} [frequencyLabel] Optional dial position, e.g. `FM 94.5` (prototype fiction).
 */

export const RADIO_STATION_CATEGORIES = [
  { id: "near-you", label: "Near You" },
  { id: "international", label: "International" },
  { id: "news", label: "News" },
  { id: "talk", label: "Talk" },
  { id: "sports", label: "Sports" },
  { id: "public", label: "Public" },
  { id: "religion", label: "Religion" },
];

/**
 * Planned continental buckets for International (not used in station rows yet—see docs).
 * @type {{ id: string, label: string }[]}
 */
export const INTERNATIONAL_CONTINENTS_PLANNED = [
  { id: "africa", label: "Africa" },
  { id: "asia", label: "Asia" },
  { id: "australasia", label: "Australasia" },
  { id: "central-america", label: "Central America" },
  { id: "europe", label: "Europe" },
  { id: "north-america", label: "North America" },
  { id: "south-america", label: "South America" },
];

const STATIONS_PER_CATEGORY = 20;

export function radioStationThumbnailUrl(stationId) {
  return `https://picsum.photos/seed/${encodeURIComponent(`radio-${stationId}`)}/512/512`;
}

function descriptionFor(categoryLabel, name) {
  return (
    `${name} is a mock Stingray radio station in the ${categoryLabel} row—live-style programming, station imaging, and dial-friendly branding for clickable prototypes. ` +
    `Replace copy and artwork with real market data when available.`
  );
}

function tagsFor(categoryId, index) {
  const base = {
    "near-you": ["Local", "FM", "Community", "Nearby", "Live"],
    international: ["World", "Stream", "Global", "Shortwave", "Live"],
    news: ["News", "Updates", "Breaking", "Live", "Network"],
    talk: ["Talk", "Call-in", "Opinion", "Live", "Daytime"],
    sports: ["Sports", "Scores", "Play-by-play", "Live", "Home team"],
    public: ["Public", "Nonprofit", "Culture", "News", "Member"],
    religion: ["Faith", "Inspirational", "Teaching", "Music", "Live"],
  };
  const pool = base[categoryId] ?? ["Radio", "Live", "Stream"];
  const out = [];
  for (let i = 0; i < 5; i += 1) out.push(pool[(index + i) % pool.length]);
  return [...new Set(out)];
}

function frequencyFor(categoryId, index) {
  if (categoryId === "international" || categoryId === "public") {
    return undefined;
  }
  const fm = 88 + ((index * 3 + categoryId.length * 7) % 31);
  const point = (index * 7) % 10;
  return `FM ${fm}.${point}`;
}

/** 20 fixed station names per category (index 0–19). */
const STATION_NAMES_BY_CATEGORY = {
  "near-you": [
    "River City Morning FM",
    "Lakeside Drive Radio",
    "Metro Pulse 92",
    "Old Town Community Radio",
    "Harbor Light FM",
    "Canyon Road Radio",
    "Union Square Audio",
    "North Loop Live",
    "Southside Sound",
    "Market Street Mix",
    "Elm & 4th Radio",
    "Riverside Public FM",
    "Central Park Radio",
    "Warehouse District FM",
    "Uptown Local Live",
    "Suburban Signal",
    "Campus Edge Radio",
    "Industrial Way FM",
    "Waterfront Wave",
    "Neighborhood Notes AM",
  ],
  international: [
    "Global Voice Radio",
    "Worldlink Newsstream",
    "Atlas Shortwave One",
    "Continental Morning",
    "Pacific Rim Audio",
    "Euro Morning Report",
    "Atlantic Bridge Radio",
    "CrossBorder FM",
    "International Desk Live",
    "World Service Evenings",
    "Global Highway Radio",
    "Latitude Line FM",
    "Meridian World Radio",
    "Horizon Talk International",
    "Capitol World Feed",
    "Overseas Edition FM",
    "Planet Pulse Radio",
    "Diplomat Channel Audio",
    "Embassy Row Radio",
    "Worldstage Livestream",
  ],
  news: [
    "National News Network",
    "Capital Report Radio",
    "Morning Headlines FM",
    "The Bulletin Channel",
    "24/7 Newsdesk Live",
    "Metro News Now",
    "Coast to Coast Briefing",
    "Prime Time Newsradio",
    "The Wire Update",
    "Breaking Story FM",
    "City Desk Radio",
    "World Affairs Now",
    "Evening Edition Live",
    "Newsroom Central",
    "The Daily Ledger Radio",
    "Pulse News FM",
    "Front Page Audio",
    "Investigative Hour Radio",
    "Summit News Network",
    "Nightline Newsradio",
  ],
  talk: [
    "Open Line Live",
    "The Caller Hour",
    "Drive Time Debate",
    "City Hall Talk Radio",
    "Crossfire Afternoons",
    "The Hot Mic FM",
    "Listener Line Live",
    "Opinion Alley Radio",
    "Town Square Talk",
    "After Dark Call-In",
    "The Panel Show Radio",
    "Breakfast Banter FM",
    "Prime Argument Radio",
    "Voices & Views Live",
    "The Soapbox Channel",
    "Straight Talk FM",
    "Roundtable Radio",
    "The Interview Hour",
    "Talkback Nation",
    "Midday Mediation Radio",
  ],
  sports: [
    "Home Team Sports Radio",
    "Stadium Live FM",
    "Locker Room Talk",
    "Game Day Central",
    "Press Box Radio",
    "Sideline Signal",
    "Extra Innings Audio",
    "Gridiron Radio Live",
    "Hardwood Highlights FM",
    "Puck Drop Radio",
    "Finish Line Sports",
    "Tailgate Nation FM",
    "Play-by-Play Now",
    "Sports Desk Live",
    "Morning Sports Drive",
    "All-Access Athletics",
    "Coach's Corner Radio",
    "Scoreboard Central FM",
    "Draft Room Audio",
    "Championship Sports Radio",
  ],
  public: [
    "Community Public Radio",
    "Civic Square FM",
    "Member Supported Audio",
    "Open Air Public Media",
    "Neighbor Network Radio",
    "Town Hall Public FM",
    "Library Lane Radio",
    "Forum Public Audio",
    "Heritage Public Radio",
    "Voices of the Commons",
    "Documentary Hour Public",
    "Arts & Ideas FM",
    "Science Front Public Radio",
    "Storytellers Public FM",
    "Local Lens Radio",
    "Citizen Band Public",
    "Spectrum Public Audio",
    "Bridge Public Radio",
    "Signal Hill Public FM",
    "Common Ground Radio",
  ],
  religion: [
    "Faith Forward Radio",
    "Morning Devotion FM",
    "Grace Notes Live",
    "Sacred Hour Audio",
    "Hope Line Radio",
    "Scripture Study FM",
    "Worship Wave Radio",
    "Prayer Chapel Live",
    "Testimony Talk FM",
    "Gospel Drive Radio",
    "Inspiration Morning",
    "Fellowship Frequency",
    "Revival Road Radio",
    "Sanctuary Sound FM",
    "Praise & Teaching Live",
    "Crossroads Faith Radio",
    "Lighthouse Gospel FM",
    "Covenant Community Audio",
    "Redeemer Radio Live",
    "Alleluia Afternoons FM",
  ],
};

function buildStation(category, index) {
  const names = STATION_NAMES_BY_CATEGORY[category.id];
  if (!names || names.length !== STATIONS_PER_CATEGORY) {
    throw new Error(
      `radioStations: expected ${STATIONS_PER_CATEGORY} names for category "${category.id}"`,
    );
  }
  const name = names[index];
  const id = `${category.id}__${String(index).padStart(2, "0")}`;
  const frequencyLabel = frequencyFor(category.id, index);
  return {
    id,
    categoryId: category.id,
    categoryLabel: category.label,
    name,
    thumbnail: radioStationThumbnailUrl(id),
    description: descriptionFor(category.label, name),
    tags: tagsFor(category.id, index),
    ...(frequencyLabel ? { frequencyLabel } : {}),
  };
}

function buildCatalog() {
  /** @type {RadioStation[]} */
  const all = [];
  for (const cat of RADIO_STATION_CATEGORIES) {
    for (let i = 0; i < STATIONS_PER_CATEGORY; i += 1) {
      all.push(buildStation(cat, i));
    }
  }
  return all;
}

/** 7 × 20 stations. */
export const RADIO_STATIONS = buildCatalog();

/** @type {Map<string, RadioStation>} */
const byId = new Map(RADIO_STATIONS.map((s) => [s.id, s]));

export function getRadioStationById(id) {
  return byId.get(id) ?? null;
}

export function getRadioStationsByCategory(categoryId) {
  return RADIO_STATIONS.filter((s) => s.categoryId === categoryId);
}

export function getRadioStationCategoryById(categoryId) {
  return RADIO_STATION_CATEGORIES.find((c) => c.id === categoryId) ?? null;
}

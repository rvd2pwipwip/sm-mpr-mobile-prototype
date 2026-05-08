/**
 * International radio browse tree (prototype).
 * Pill labels for North America / Canada / Alberta match Figma `19871:33453`.
 * Every geo node gets **20** generated `RadioStation` rows (IDs `geo-{nodeSlug}-00` … `19`).
 */

import {
  INTERNATIONAL_CONTINENTS_PLANNED,
  getRadioStationById,
  radioStationThumbnailUrl,
} from "./radioStations.js";

export { INTERNATIONAL_CONTINENTS_PLANNED };

/** @typedef {import("./radioStations.js").RadioStation} RadioStation */

const STATIONS_PER_GEO_NODE = 20;

const GEO_NAME_HINTS = [
  "FM",
  "Radio",
  "Audio",
  "Live",
  "Sound",
  "Wave",
  "Public",
  "Community",
  "Talk",
  "News",
];

function geoDescription(regionLabel, name) {
  return `${name} is mock international radio in ${regionLabel} for Search → Radio browse prototypes.`;
}

function slugFromNodeId(nodeId) {
  return nodeId.replace(/[^a-z0-9]+/gi, "-");
}

/**
 * @param {string} nodeId
 * @param {string} nodeLabel
 * @returns {RadioStation[]}
 */
function makeStationBlock(nodeId, nodeLabel) {
  const slug = slugFromNodeId(nodeId);
  const list = [];
  for (let i = 0; i < STATIONS_PER_GEO_NODE; i += 1) {
    const id = `geo-${slug}-${String(i).padStart(2, "0")}`;
    const hint = GEO_NAME_HINTS[i % GEO_NAME_HINTS.length];
    const name = `${nodeLabel} ${hint} ${i + 1}`;
    const fm = 88 + ((i * 3 + slug.length * 7) % 21);
    const point = i % 10;
    list.push({
      id,
      name,
      categoryId: "international",
      categoryLabel: "International",
      frequencyLabel: `FM ${fm}.${point}`,
      description: geoDescription(nodeLabel, name),
      tags: [nodeLabel.slice(0, 40)],
      thumbnail: radioStationThumbnailUrl(id),
    });
  }
  return list;
}

/** @type {Map<string, RadioStation[]>} */
const stationsByGeoNodeId = new Map();

/** @type {Map<string, RadioStation>} */
const geoStationById = new Map();

function ensureStationsForNode(nodeId, nodeLabel) {
  if (stationsByGeoNodeId.has(nodeId)) return;
  const block = makeStationBlock(nodeId, nodeLabel);
  stationsByGeoNodeId.set(nodeId, block);
  for (const s of block) geoStationById.set(s.id, s);
}

/** Leaf / stub geo row: no children, same 20 generated stations as other nodes. */
function leafGeo(id, label, parentId, type = "country") {
  return { id, label, type, parentId, childIds: [] };
}

/**
 * Geo hierarchy nodes. Pill order matches Figma `19871:33453` where applicable.
 * @type {Record<string, { id: string, label: string, type: 'continent'|'country'|'subdivision'|'city', parentId: string | null, childIds: string[] }>}
 */
export const GEO_BROWSE_NODES = {
  "north-america": {
    id: "north-america",
    label: "North America",
    type: "continent",
    parentId: null,
    childIds: [
      "bermuda",
      "canada",
      "caribbean-islands",
      "greenland",
      "mexico",
      "st-pierre-miquelon",
      "united-states",
    ],
  },
  bermuda: leafGeo("bermuda", "Bermuda", "north-america"),
  canada: {
    id: "canada",
    label: "Canada",
    type: "country",
    parentId: "north-america",
    childIds: [
      "alberta",
      "british-columbia",
      "manitoba",
      "new-brunswick",
      "newfoundland-and-labrador",
      "northwest-territories",
      "nova-scotia",
      "nunavut",
      "ontario",
      "prince-edward-island",
      "quebec",
      "saskatchewan",
      "yukon",
    ],
  },
  "caribbean-islands": leafGeo("caribbean-islands", "Caribbean Islands", "north-america"),
  greenland: leafGeo("greenland", "Greenland", "north-america"),
  mexico: leafGeo("mexico", "Mexico", "north-america"),
  "st-pierre-miquelon": leafGeo(
    "st-pierre-miquelon",
    "St. Pierre-Miquelon",
    "north-america",
  ),
  "united-states": leafGeo("united-states", "United States", "north-america"),

  alberta: {
    id: "alberta",
    label: "Alberta",
    type: "subdivision",
    parentId: "canada",
    childIds: [
      "calgary",
      "edmonton",
      "lethbridge",
      "lloydminster",
      "medicine-hat",
      "red-deer",
    ],
  },
  "british-columbia": leafGeo("british-columbia", "British Columbia", "canada", "subdivision"),
  manitoba: leafGeo("manitoba", "Manitoba", "canada", "subdivision"),
  "new-brunswick": leafGeo("new-brunswick", "New Brunswick", "canada", "subdivision"),
  "newfoundland-and-labrador": leafGeo(
    "newfoundland-and-labrador",
    "Newfoundland and Labrador",
    "canada",
    "subdivision",
  ),
  "northwest-territories": leafGeo(
    "northwest-territories",
    "Northwest Territories",
    "canada",
    "subdivision",
  ),
  "nova-scotia": leafGeo("nova-scotia", "Nova Scotia", "canada", "subdivision"),
  nunavut: leafGeo("nunavut", "Nunavut", "canada", "subdivision"),
  ontario: leafGeo("ontario", "Ontario", "canada", "subdivision"),
  "prince-edward-island": leafGeo(
    "prince-edward-island",
    "Prince Edward Island",
    "canada",
    "subdivision",
  ),
  quebec: leafGeo("quebec", "Quebec", "canada", "subdivision"),
  saskatchewan: leafGeo("saskatchewan", "Saskatchewan", "canada", "subdivision"),
  yukon: leafGeo("yukon", "Yukon", "canada", "subdivision"),

  calgary: leafGeo("calgary", "Calgary", "alberta", "city"),
  edmonton: leafGeo("edmonton", "Edmonton", "alberta", "city"),
  lethbridge: leafGeo("lethbridge", "Lethbridge", "alberta", "city"),
  lloydminster: leafGeo("lloydminster", "Lloydminster", "alberta", "city"),
  "medicine-hat": leafGeo("medicine-hat", "Medicine Hat", "alberta", "city"),
  "red-deer": leafGeo("red-deer", "Red Deer", "alberta", "city"),
};

for (const node of Object.values(GEO_BROWSE_NODES)) {
  ensureStationsForNode(node.id, node.label);
}

for (const c of INTERNATIONAL_CONTINENTS_PLANNED) {
  if (!GEO_BROWSE_NODES[c.id]) {
    ensureStationsForNode(c.id, c.label);
  }
}

/** Flat catalog of all international geo mock stations (Search / export). */
export const RADIO_GEO_MOCK_STATIONS = Array.from(geoStationById.values());

export function getGeoMockStationById(id) {
  return geoStationById.get(id) ?? null;
}

/** Home catalog + geo mock rows (for `/radio/:id` stub). */
export function resolveRadioStationForStub(id) {
  return getGeoMockStationById(id) ?? getRadioStationById(id);
}

/**
 * @param {string} continentId
 */
export function syntheticContinentNode(continentId) {
  const meta = INTERNATIONAL_CONTINENTS_PLANNED.find((c) => c.id === continentId);
  if (!meta) return null;
  if (GEO_BROWSE_NODES[continentId]) return null;
  return {
    id: continentId,
    label: meta.label,
    type: "continent",
    parentId: null,
    childIds: [],
  };
}

/**
 * @param {string[]} segments e.g. `['north-america','canada']`
 * @returns {{ node: object } | { invalid: true }}
 */
export function resolveGeoNodeFromSegments(segments) {
  if (segments.length === 0) return { invalid: true };
  let first = GEO_BROWSE_NODES[segments[0]];
  if (!first) {
    first = syntheticContinentNode(segments[0]);
  }
  if (!first) return { invalid: true };
  let current = first;
  for (let i = 1; i < segments.length; i += 1) {
    const seg = segments[i];
    if (!current.childIds?.includes(seg)) return { invalid: true };
    const next = GEO_BROWSE_NODES[seg];
    if (!next) return { invalid: true };
    current = next;
  }
  return { node: current };
}

export function getChildGeoNodes(parentNode) {
  if (!parentNode?.childIds?.length) return [];
  return parentNode.childIds
    .map((id) => GEO_BROWSE_NODES[id])
    .filter(Boolean)
    .map((n) => ({ id: n.id, label: n.label, type: n.type }));
}

export function getPopularStationsForGeoNode(nodeId) {
  const existing = stationsByGeoNodeId.get(nodeId);
  if (existing) return existing.map((s) => ({ ...s }));
  const node = GEO_BROWSE_NODES[nodeId];
  if (node) {
    ensureStationsForNode(node.id, node.label);
    return (stationsByGeoNodeId.get(nodeId) ?? []).map((s) => ({ ...s }));
  }
  const meta = INTERNATIONAL_CONTINENTS_PLANNED.find((c) => c.id === nodeId);
  if (meta) {
    ensureStationsForNode(meta.id, meta.label);
    return (stationsByGeoNodeId.get(nodeId) ?? []).map((s) => ({ ...s }));
  }
  return [];
}

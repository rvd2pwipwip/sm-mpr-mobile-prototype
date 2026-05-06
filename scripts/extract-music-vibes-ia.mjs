/**
 * Downloads the public “1000+ lineup” vibe spreadsheets and writes
 * `src/data/musicVibesIa.broad1000.json`.
 *
 * Requires: `unzip` on PATH (macOS/Linux), network access.
 * Run: node scripts/extract-music-vibes-ia.mjs
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "src", "data", "musicVibesIa.broad1000.json");

const SOURCES = [
  {
    vibeId: "genre",
    spreadsheetId: "1NLXRHZqB20_59IzJSNG6pdQnl63QJN9c7lTx16SFEz8",
    spreadsheetUrl:
      "https://docs.google.com/spreadsheets/d/1NLXRHZqB20_59IzJSNG6pdQnl63QJN9c7lTx16SFEz8/edit",
  },
  {
    vibeId: "activity",
    spreadsheetId: "1togeO1V3x2xgQ0THs-dE7TW8lGxxawnD94CUdgEMqqk",
    spreadsheetUrl:
      "https://docs.google.com/spreadsheets/d/1togeO1V3x2xgQ0THs-dE7TW8lGxxawnD94CUdgEMqqk/edit",
  },
  {
    vibeId: "mood",
    spreadsheetId: "1ZB-6tNdsMO4jacNyeyRu7lP6AFRJQMngEXCmyybpU84",
    spreadsheetUrl:
      "https://docs.google.com/spreadsheets/d/1ZB-6tNdsMO4jacNyeyRu7lP6AFRJQMngEXCmyybpU84/edit",
  },
  {
    vibeId: "era",
    spreadsheetId: "1aVv3nkgkSi82nL4C3RjBdcy0wK-1jIxjYHnURAT-09o",
    spreadsheetUrl:
      "https://docs.google.com/spreadsheets/d/1aVv3nkgkSi82nL4C3RjBdcy0wK-1jIxjYHnURAT-09o/edit",
  },
  {
    vibeId: "theme",
    spreadsheetId: "1Kr-_3lUS54MbdTDyV-WB-YDh02SaLW1-KKl1Wklzp7E",
    spreadsheetUrl:
      "https://docs.google.com/spreadsheets/d/1Kr-_3lUS54MbdTDyV-WB-YDh02SaLW1-KKl1Wklzp7E/edit",
  },
];

function decodeXmlEntities(s) {
  return s
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

/**
 * @param {string} xml
 * @returns {string[]}
 */
function sheetNamesFromWorkbookXml(xml) {
  const names = [];
  const re = /<sheet[^>]*\bname="([^"]+)"/g;
  let m;
  while ((m = re.exec(xml))) {
    names.push(decodeXmlEntities(m[1]));
  }
  return names;
}

/**
 * @param {Buffer} xlsxBuffer
 */
function getWorkbookXmlFromXlsx(xlsxBuffer) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vibes-ia-"));
  const xlsxPath = path.join(tmp, "workbook.xlsx");
  fs.writeFileSync(xlsxPath, xlsxBuffer);
  execFileSync("unzip", ["-q", "-o", xlsxPath, "xl/workbook.xml", "-d", tmp]);
  const xmlPath = path.join(tmp, "xl", "workbook.xml");
  const xml = fs.readFileSync(xmlPath, "utf8");
  fs.rmSync(tmp, { recursive: true, force: true });
  return xml;
}

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function gvizCsvUrl(spreadsheetId, sheetName) {
  const q = new URLSearchParams({
    tqx: "out:csv",
    sheet: sheetName,
  });
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?${q.toString()}`;
}

/**
 * One-column gviz CSV: "cell" per line.
 * @param {string} text
 * @returns {string[]}
 */
function parseGvizSingleColumn(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith('"') && line.endsWith('"')) {
        return line
          .slice(1, -1)
          .replaceAll('""', '"')
          .trim();
      }
      return line.trim();
    });
}

/**
 * @param {string} spreadsheetId
 * @param {string} sheetName
 */
async function fetchSheetColumn(spreadsheetId, sheetName) {
  const url = gvizCsvUrl(spreadsheetId, sheetName);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return parseGvizSingleColumn(await res.text());
}

/**
 * Second tab lists tags; header is `tag` or `name` (source uses `tag` today).
 * @param {string[]} col
 */
function parseTagListColumn(col) {
  if (col.length === 0) return [];
  const header = col[0].toLowerCase();
  if (header === "tag" || header === "name") {
    return col.slice(1).filter(Boolean);
  }
  return col.filter(Boolean);
}

/**
 * Subcategory sheets: column `name`, row2 = parent tag, following rows = sub-tags.
 * If Google cannot resolve the sheet it falls back to the first tab — rejected unless row2 matches `tag`.
 * @param {string[]} col
 * @param {string} tag
 * @returns {string[] | null} `null` = no valid sub-sheet; otherwise sub-tag list (may be empty).
 */
function parseSubcategoriesColumn(col, tag) {
  if (col.length < 2) return null;
  const h = col[0].toLowerCase();
  if (h !== "name") return null;
  if (col[1] !== tag) return null;
  return col.slice(2).filter(Boolean);
}

async function extractVibeBlock(source) {
  const { spreadsheetId, spreadsheetUrl, vibeId } = source;
  const xlsxBuf = await fetchBuffer(
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=xlsx`,
  );
  const xml = getWorkbookXmlFromXlsx(xlsxBuf);
  const sheetNames = sheetNamesFromWorkbookXml(xml);
  if (sheetNames.length < 2) {
    throw new Error(`${vibeId}: expected ≥2 worksheets, got ${sheetNames.length}`);
  }
  const vibesSheet = sheetNames[0];
  const tagsSheet = sheetNames[1];
  if (vibesSheet.toLowerCase() !== "vibes") {
    throw new Error(
      `${vibeId}: expected first worksheet "vibes", got "${vibesSheet}"`,
    );
  }

  const overviewLabels = parseTagListColumn(
    await fetchSheetColumn(spreadsheetId, vibesSheet),
  );
  const tagLabels = parseTagListColumn(
    await fetchSheetColumn(spreadsheetId, tagsSheet),
  );

  const tags = [];
  for (const label of tagLabels) {
    const col = await fetchSheetColumn(spreadsheetId, label);
    const subs = parseSubcategoriesColumn(col, label);
    if (subs === null) {
      tags.push({ label });
    } else if (subs.length === 0) {
      tags.push({ label, subcategories: [] });
    } else {
      tags.push({ label, subcategories: subs });
    }
  }

  return {
    vibeId,
    spreadsheetId,
    spreadsheetUrl,
    worksheets: sheetNames,
    overviewTab: vibesSheet,
    tagsTab: tagsSheet,
    overviewLabels,
    tags,
  };
}

async function main() {
  const taxonomy = [];
  for (const src of SOURCES) {
    taxonomy.push(await extractVibeBlock(src));
  }

  const doc = {
    description:
      "Music vibes IA for broad (1000+ channel) territories, extracted from public Google Sheets (one spreadsheet per top-level vibe).",
    lineup: "broad",
    channelThreshold: "1000+",
    extractedAt: new Date().toISOString(),
    sources: SOURCES.map((s) => ({
      vibeId: s.vibeId,
      spreadsheetId: s.spreadsheetId,
      spreadsheetUrl: s.spreadsheetUrl,
    })),
    taxonomy,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(doc, null, 2)}\n`, "utf8");
  console.log(`Wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

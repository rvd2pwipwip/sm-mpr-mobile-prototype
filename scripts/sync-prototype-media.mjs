#!/usr/bin/env node
/**
 * Download picsum placeholders into packages/shared/media for offline demos.
 * Run once on Wi-Fi: npm run media:sync
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MUSIC_CHANNELS } from "../packages/shared/data/musicChannels.js";
import { PODCASTS } from "../packages/shared/data/podcasts.js";
import { RADIO_STATIONS } from "../packages/shared/data/radioStations.js";
import { RADIO_GEO_MOCK_STATIONS } from "../apps/mobile/src/data/radioInternationalBrowse.js";
import { picsumSquareUrl } from "../packages/shared/data/mediaUrls.js";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MEDIA_ROOT = path.join(REPO_ROOT, "packages/shared/media");

const CONCURRENCY = 6;

/** @type {{ dest: string, url: string }[]} */
const jobs = [];

for (const ch of MUSIC_CHANNELS) {
  jobs.push({
    dest: path.join(MEDIA_ROOT, "music/512", `${encodeURIComponent(ch.id)}.jpg`),
    url: picsumSquareUrl(ch.id, 512),
  });
}

for (const p of PODCASTS) {
  jobs.push({
    dest: path.join(
      MEDIA_ROOT,
      "podcasts/show/600",
      `${encodeURIComponent(p.id)}.jpg`,
    ),
    url: `https://picsum.photos/seed/${encodeURIComponent(`pod-${p.id}`)}/600/600`,
  });
}

function addRadioStationJobs(stations) {
  for (const s of stations) {
    jobs.push({
      dest: path.join(MEDIA_ROOT, "radio/512", `${encodeURIComponent(s.id)}.jpg`),
      url: picsumSquareUrl(`radio-${s.id}`, 512),
    });
  }
}

addRadioStationJobs(RADIO_STATIONS);
addRadioStationJobs(RADIO_GEO_MOCK_STATIONS);

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadOne({ dest, url }) {
  if (await fileExists(dest)) {
    return "skip";
  }
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`${res.status} ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  return "ok";
}

async function runPool(items, worker) {
  let index = 0;
  let ok = 0;
  let skip = 0;
  let fail = 0;

  async function run() {
    while (index < items.length) {
      const i = index;
      index += 1;
      const item = items[i];
      try {
        const result = await worker(item);
        if (result === "skip") skip += 1;
        else ok += 1;
      } catch (err) {
        fail += 1;
        console.error(`FAIL ${item.dest}\n  ${err.message}`);
      }
      if ((ok + skip + fail) % 50 === 0) {
        process.stdout.write(`\r${ok + skip + fail}/${items.length}...`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, () => run()),
  );
  process.stdout.write("\n");
  return { ok, skip, fail };
}

console.log(`Syncing ${jobs.length} images to packages/shared/media ...`);
console.log(
  "(Episode art reuses show art; includes international geo radio mock stations.)\n",
);

const { ok, skip, fail } = await runPool(jobs, downloadOne);

console.log(`Done: ${ok} downloaded, ${skip} already present, ${fail} failed.`);
if (fail > 0) {
  process.exitCode = 1;
}

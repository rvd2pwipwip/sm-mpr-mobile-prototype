/**
 * Copy for the dumb Cast prototype — `docs/mobile/Plans/Cast-prototype-implementation-plan.md`.
 */

export const CAST_DEVICE_OPTIONS = [
  { id: "living-room", name: "Living Room" },
  { id: "kitchen", name: "Kitchen" },
  { id: "home-cinema", name: "Home Cinema" },
];

export const CAST_TO_TITLE = "Cast to";

export const NETWORK_ACCESS = {
  title: "Network Access",
  lead:
    "This app needs Local Network Access to Cast",
  body: [
    "To connect to your devices, this app needs access to your Wi-Fi network.",
    'To Cast, select "OK" when the app asks to connect to your local network.',
  ],
  ok: "OK",
  cancel: "Cancel",
};

export const LOCAL_NETWORK = {
  title: "Local Network",
  lead: 'Allow "Stingray Music" to find devices on local networks?',
  body: [
    "This will allow the app to connect to speakers and other devices on your Wi-Fi network.",
  ],
  ok: "OK",
  block: "Block",
};

export const CASTING_ON = {
  title: "Casting on",
  lineCasting: "Casting on",
  ok: "OK",
  stopCasting: "Stop Casting",
};

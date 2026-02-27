import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const DEBUG_PATH = join(process.env.HOME || "~", ".openclaw", "logs", "telegram-discord-mirror-debug.jsonl");

function safeWriteDebug(obj: unknown) {
  try {
    mkdirSync(dirname(DEBUG_PATH), { recursive: true });
    appendFileSync(DEBUG_PATH, JSON.stringify({ ts: new Date().toISOString(), ...((obj as object) || {}) }) + "\n", "utf8");
  } catch {
    // no-op: debug logging must never break the hook
  }
}

function get(obj: any, path: string, fallback?: any) {
  return path.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj) ?? fallback;
}

const handler = async (event: any) => {
  // Only inspect inbound message events
  if (event?.type !== "message" || event?.action !== "received") return;

  // Probe channel identification across possible payload shapes
  const channel =
    get(event, "channel") ||
    get(event, "context.channel") ||
    get(event, "message.channel") ||
    get(event, "inbound.channel") ||
    "unknown";

  if (channel !== "telegram") return;

  // Log a compact payload fingerprint for mapping confirmation
  safeWriteDebug({
    note: "telegram inbound observed",
    keys: Object.keys(event || {}),
    channel,
    chatId: get(event, "chatId") || get(event, "context.chatId") || get(event, "message.chatId") || null,
    sender: get(event, "sender") || get(event, "message.sender") || null,
    body: get(event, "body") || get(event, "message.text") || get(event, "message.body") || null,
  });

  // Placeholder: mirror implementation goes here after payload keys are verified.
  // Intention: send formatted mirror into Discord channel 1476842437312909396.
  // Keep this scaffold side-effect free until mapping is confirmed.
};

export default handler;

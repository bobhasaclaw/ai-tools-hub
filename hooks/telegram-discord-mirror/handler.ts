import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const DEBUG_PATH = join(process.cwd(), "telegram-discord-mirror-debug.jsonl");

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
  // First, log all message-related events so we can verify runtime shape.
  if (event?.type === "message") {
    const probeChannel =
      get(event, "channel") ||
      get(event, "context.channel") ||
      get(event, "message.channel") ||
      get(event, "inbound.channel") ||
      "unknown";

    safeWriteDebug({
      note: "message event observed",
      action: event?.action || null,
      keys: Object.keys(event || {}),
      channel: probeChannel,
      chatId: get(event, "chatId") || get(event, "context.chatId") || get(event, "message.chatId") || null,
      sender: get(event, "sender") || get(event, "message.sender") || null,
      body: get(event, "body") || get(event, "message.text") || get(event, "message.body") || null,
    });
  }

  // Only process inbound Telegram events for future forwarding.
  if (event?.type !== "message" || event?.action !== "received") return;

  const channel =
    get(event, "channel") ||
    get(event, "context.channel") ||
    get(event, "message.channel") ||
    get(event, "inbound.channel") ||
    "unknown";

  if (channel !== "telegram") return;

  safeWriteDebug({ note: "telegram inbound observed (ready for mirror wiring)", channel });

  // Placeholder: mirror implementation goes here after payload keys are verified.
};

export default handler;

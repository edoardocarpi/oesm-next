/**
 * OESM — Logger
 * Semplice logger strutturato. In produzione può essere sostituito con Winston o Pino.
 */

const isDev = process.env.NODE_ENV !== "production";

function format(level, message) {
  const ts = new Date().toISOString();
  return `[${ts}] ${level.toUpperCase().padEnd(5)} ${message}`;
}

export const logger = {
  info:  (msg) => console.log(format("info", msg)),
  warn:  (msg) => console.warn(format("warn", msg)),
  error: (msg) => console.error(format("error", msg)),
  debug: (msg) => { if (isDev) console.debug(format("debug", msg)); },
};

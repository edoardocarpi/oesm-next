import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import routes from "./api/routes.js";
import { logger } from "./utils/logger.js";

const app  = express();
const PORT = process.env.PORT ?? 3001;
const IS_PROD = process.env.NODE_ENV === "production";

// ─── 1. Helmet — HTTP security headers ───────────────────────────────────────
// Sets: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection,
//       Strict-Transport-Security, Content-Security-Policy, etc.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc:  ["'none'"],
      styleSrc:   ["'none'"],
      imgSrc:     ["'none'"],
      connectSrc: ["'self'"],
    },
  },
  // Force HTTPS in production
  hsts: IS_PROD ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
}));

// ─── 2. CORS — whitelist esplicita ───────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "https://oesm.net",
  "https://www.oesm.net",
  // Preview deploys Vercel
  /^https:\/\/oesm-next(-[a-z0-9]+)?\.vercel\.app$/,
  // Sviluppo locale
  ...(IS_PROD ? [] : ["http://localhost:3000", "http://localhost:3001"]),
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permetti richieste senza origin (curl, Postman, same-origin)
    if (!origin) return callback(null, true);
    const allowed = ALLOWED_ORIGINS.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    if (allowed) return callback(null, true);
    logger.warn(`CORS blocked: ${origin}`);
    callback(new Error("CORS policy violation"));
  },
  methods: ["GET"],          // solo GET — nessun POST pubblico
  allowedHeaders: ["Content-Type"],
  maxAge: 86400,             // preflight cache 24h
}));

app.use(express.json({ limit: "10kb" }));  // limite payload

// ─── 3. Rate limiting per tier ───────────────────────────────────────────────

// Tier generale: 120 req / 15 min per IP
const generalLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              120,
  standardHeaders:  "draft-7",
  legacyHeaders:    false,
  message:          { error: "Troppe richieste. Riprova tra qualche minuto.", code: "RATE_LIMIT" },
  skip: (req) => req.path === "/api/v1/health",  // health non limitato
});

// Tier CSV / download: 20 req / 15 min per IP (anti-scraping)
const downloadLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             20,
  standardHeaders: "draft-7",
  legacyHeaders:   false,
  message:         { error: "Limite download raggiunto. Riprova tra qualche minuto.", code: "DOWNLOAD_LIMIT" },
  keyGenerator:    (req) => req.ip + ":download",
});

// Tier pipeline (admin): 10 req / ora
const adminLimiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             10,
  standardHeaders: "draft-7",
  legacyHeaders:   false,
  message:         { error: "Limite operazioni admin raggiunto.", code: "ADMIN_LIMIT" },
  keyGenerator:    (req) => req.ip + ":admin",
});

app.use(generalLimiter);

// ─── 4. Request logger ───────────────────────────────────────────────────────
app.use((req, _res, next) => {
  // Non loggare IP completi in produzione (GDPR)
  const ipFragment = IS_PROD
    ? req.ip?.split(".").slice(0, 2).join(".") + ".x.x"
    : req.ip;
  logger.info(`${req.method} ${req.path} [${ipFragment}]`);
  next();
});

// ─── 5. Security: rimuovi header informativi ─────────────────────────────────
app.disable("x-powered-by");  // non esporre "Express"

// ─── 6. Routes ───────────────────────────────────────────────────────────────
app.use("/api/v1", routes(downloadLimiter, adminLimiter));

// ─── 7. 404 ──────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint non trovato" });
});

// ─── 8. Error handler ────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  // Non esporre stack trace in produzione
  if (IS_PROD) {
    logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({ error: "Errore interno del server" });
  } else {
    logger.error(err.stack);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`OESM Backend in ascolto su porta ${PORT}`);
  logger.info(`Ambiente: ${process.env.NODE_ENV ?? "development"}`);
  logger.info(`CORS origins: ${ALLOWED_ORIGINS.length} configurate`);
});

// app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");
const session = require("express-session");

const { configurePassport, passport } = require("./config/passport");
const requireAuth = require("./middleware/requireAuth");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Body
app.use(bodyParser.json());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Z-Key"],
  })
);

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

// Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// ✅ Test login shim (must be before routes that check req.isAuthenticated)
if (process.env.NODE_ENV === "test") {
  app.use((req, res, next) => {
    if (req.headers["x-test-auth"] === "1") {
      req.isAuthenticated = () => true;
      req.user = { username: "testuser" };
    }
    next();
  });
}


// Root check
app.get("/", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const username = req.user?.username || req.user?.displayName || "GitHub user";
    return res.send(`You are logged in, ${username}`);
  }
  res.send("Logged out");
});

// Test-only public route (no DB) — PUBLIC
if (process.env.NODE_ENV === "test") {
  app.get("/__test__/public", (req, res) => res.json({ ok: true }));
}

// Auth protection (ONLY ONCE)
app.use(requireAuth);

// Test-only private route (no DB) — PRIVATE
if (process.env.NODE_ENV === "test") {
  app.get("/__test__/private", (req, res) => res.json({ ok: true }));
}

// Routes
app.use("/", require("./routes"));

app.use(errorHandler);

module.exports = app;

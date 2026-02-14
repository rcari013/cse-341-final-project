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


if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Body
app.use(bodyParser.json());


app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Z-Key"],
  })
);


app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);

// Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Swagger UI (PUBLIC)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use("/auth", require("./routes/auth"));

// ✅ Test login shim (ONLY for Jest)
if (process.env.NODE_ENV === "test") {
  app.use((req, res, next) => {
    if (req.headers["x-test-auth"] === "1") {
      req.isAuthenticated = () => true;
      req.user = { username: "testuser" };
    }
    next();
  });

  // Test-only routes
  app.get("/__test__/public", (req, res) => res.json({ ok: true }));
}

// Root check (PUBLIC)
app.get("/", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const username = req.user?.username || req.user?.displayName || "GitHub user";
    return res.send(`You are logged in, ${username}`);
  }
  res.send("Logged out");
});



app.use(requireAuth);

app.use("/", require("./routes"));

if (process.env.NODE_ENV === "test") {
  app.get("/__test__/private", (req, res) => res.json({ ok: true }));
}

app.use(errorHandler);

module.exports = app;

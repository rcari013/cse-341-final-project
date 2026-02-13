const passport = require("passport");
const { Strategy: GitHubStrategy } = require("passport-github2");

const configurePassport = () => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        if (process.env.NODE_ENV !== "test") {
            console.warn("GitHub OAuth not set up. Skipping strategy.");
        }
        return;
        }


  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.GITHUB_CALLBACK_URL ||
          "https://cse-341-final-project-1t9z.onrender.com/auth/github/callback",
      },
      (accessToken, refreshToken, profile, done) => done(null, profile)
    )
  );

  console.log("GitHub OAuth strategy loaded");
};

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = { configurePassport, passport };

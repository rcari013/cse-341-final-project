const router = require("express").Router();
const passport = require("passport");

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/failed", session: true }),
  (req, res) => res.redirect("/auth/success")
);

router.get("/success", (req, res) => {
  res.status(200).json({ message: "Authenticated", user: req.user });
});

router.get("/failed", (req, res) => {
  res.status(401).json({ message: "GitHub auth failed" });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => res.status(200).json({ message: "Logged out" }));
  });
});

module.exports = router;

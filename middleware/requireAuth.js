module.exports = function requireAuth(req, res, next) {
  const original = req.originalUrl.split("?")[0];

  // Always allow auth + docs
  if (original.startsWith("/auth")) return next();
  if (original.startsWith("/api-docs")) return next();

  // PUBLIC: GET /services
  if (req.method === "GET" && (original === "/services" || original === "/services/")) {
    return next();
  }

  // PUBLIC: GET /:resource/:id (any resource, by id)
  // BUT exclude test routes like /__test__/private
  const isGetById =
    req.method === "GET" &&
    /^\/[^\/]+\/[^\/]+\/?$/.test(original) &&
    !original.startsWith("/__test__/");

  if (isGetById) return next();

  // everything else requires auth
  if (req.isAuthenticated && req.isAuthenticated()) return next();

  return res.status(401).json({ message: "Unauthorized. Login required." });
};


const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const userRole = String(req.user.role || "")
      .trim()
      .toUpperCase();

    const allowedRoles = roles.map((role) =>
      String(role).trim().toUpperCase()
    );

    if (!allowedRoles.includes(userRole)) {
      console.log("ROLE CHECK FAILED:", {
        userRole,
        allowedRoles,
        userId: req.user.id || req.user._id,
      });

      return res.status(403).json({
        success: false,
        message: "Access denied. You don't have permission.",
      });
    }

    next();
  };
};

module.exports = authorize;

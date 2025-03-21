module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send("Error: You must be logged in to access this page.");
};

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
        return next();
    }
    res.status(403).send("Error: Access Denied. Admins Only.");
};

module.exports.isGuest = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.role = "guest";
        return next();
    }
    res.status(403).send("Error: Guests Only.");
};

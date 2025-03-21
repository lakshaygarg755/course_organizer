module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in to access this page.");
    res.redirect("/login");
};

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
        return next();
    }
    req.flash("error", "Access Denied: Admins Only.");
    res.redirect("/");
};

module.exports.isGuest = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.role = "guest";
        return next();
    }
    res.redirect("/");
};

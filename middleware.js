const isAuthenticatedAndAuthorized = (roles) => (req, res, next) => {
    if (req.session && req.session.isLoggedIn && roles.includes(req.session.userRole)) {
      next();
    } else {
      res.redirect('/');
    }
  };
  
  module.exports = { isAuthenticatedAndAuthorized };
  
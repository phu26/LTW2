module.exports = (req, res, next) => {
  if (req.user) {
    res.locals.isAuthenticated = true;
    res.locals.authUser = req.user;
 
    if(req.user.f_Permission ==3)
    res.locals.writer = true;
  }

  next();
}
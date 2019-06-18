module.exports = (req, res, next) => {
  if (req.user) {
    res.locals.isAuthenticated = true;
    res.locals.authUser = req.user;
    if(req.user.f_Permission ==1)
    res.locals.guest = true;
    
    if(req.user.f_Permission ==2)
    res.locals.subscriber = true;

    if(req.user.f_Permission ==3)
    res.locals.writer = true;
 
    if(req.user.f_Permission ==4){
    res.locals.editor = true;
  
    }

    if(req.user.f_Permission ==5)
    res.locals.admin = true;
  }

  next();
}
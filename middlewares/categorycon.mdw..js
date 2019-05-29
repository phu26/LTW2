var categoryModel = require('../models/catecon');
module.exports = (req,res,next) => {
   
    categoryModel.coon().then(rows => {res.locals.cc = rows;
    
    next();
    });
}
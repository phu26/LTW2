var db = require('../utils/db')
module.exports = {
    all: () => {
            
        return db.load('select * from products');
    },
    allByCat: catID => {
            
        return db.load(`select * from products where CatID= ${catID}`);
    },
    single: id => {
            
        return db.load(`select * from products where ProID  = ${id}`);
    },
   
    add: entity => {
        return db.add('products',entity);
    }
};
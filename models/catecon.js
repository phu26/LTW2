var db = require('../utils/db')
module.exports = {
    all: () => {
            
        return db.load('select * from products');
    },
    coon: () =>{
        return db.load(`select c.* from categoriescon c LEFT JOIN con g on g.CatID = c.CatID GROUP by c.CatNamecon `)
    }
    ,
    single: id => {
            
        return db.load(`select * from products where ProID  = ${id}`);
    },
   
    add: entity => {
        return db.add('products',entity);
    }
};
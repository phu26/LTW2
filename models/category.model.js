var db = require('../utils/db')
module.exports = {
    all: () => {
            
        return db.load('select * from categories');
    },
    single: id => {
            
        return db.load(`select * from categories where CatID = ${id}`);
    },
    allWithDetails: () => {
            
        return db.load(`select c.*, count(p.ProID) as num_of_products from categories c left join products p on c.CatID = p.CatID group by c.CatID,c.CatName`);
    },
    add: entity => {
        return db.add('categories',entity);
    }
};
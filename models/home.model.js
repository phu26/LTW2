var db = require('../utils/db')
module.exports = {
    all: () => {
            
        return db.load(`SELECT * FROM products WHERE TinyDes!='' ORDER BY Click DESC limit 3`);
    },
    New: () => {
            
        return db.load(`SELECT * FROM products ORDER by CreatedAt DESC limit 3 `);
    },
    top10: () => {
            
        return db.load(`SELECT DISTINCT c.CatID FROM categories c, products p WHERE c.CatID=p.CatID ORDER by p.CreatedAt DESC limit 10`);
    },
    
    top1in10: catID  => {
            
        return db.load(`SELECT * from  products p WHERE p.CatID = ${catID} ORDER by p.CreatedAt DESC limit 1
        `);
    },

};




    
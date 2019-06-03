var db = require('../utils/db')
module.exports = {
    all: () => {
            
        return db.load(`SELECT * FROM products WHERE TinyDes!='' ORDER BY Click DESC limit 3`);
    },
    New: () => {
            
        return db.load(`SELECT * FROM products ORDER by CreatedAt DESC limit 3 `);
    }
     
    
};


    
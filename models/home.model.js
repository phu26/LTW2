var db = require('../utils/db')
module.exports = {
    all: () => {
            
        return db.load(`SELECT c.CatName,p.* from  categories c ,products p WHERE p.CatID=c.CatID and p.TinyDes!='' ORDER BY Click DESC limit 3`);
    },
    all2: () => {
            
        return db.load(`SELECT c.CatName,p.* from  categories c ,products p WHERE p.CatID=c.CatID and p.TinyDes!='' and Click>0 ORDER BY Click DESC limit 10`);
    },
    New: () => {
            
        return db.load(`SELECT c.CatName,p.* from  categories c ,products p WHERE p.CatID=c.CatID and p.TinyDes!='' ORDER by p.CreatedAt DESC limit 10  `);
    },
    top10CM: () => {
            
        return db.load(`SELECT DISTINCT c.CatID FROM categories c, products p WHERE c.CatID=p.CatID ORDER by p.CreatedAt DESC limit 10`);
    },
    
    top1in10: catID  => {
            
        return db.load(`SELECT * from  products p WHERE p.CatID = ${catID} ORDER by p.CreatedAt DESC limit 1
        `);
    },

};




    
var db = require('../utils/db')
var config = require('../config/default.json');
module.exports = {
    all: () => {
            
        return db.load(`SELECT * FROM products `);
    },
    allByCat: catID => {
            
        return db.load(`select * from products where CatID= ${catID} and TinyDes!=''` );
    },
    single: id => {
            
        return db.load(`select * from products where ProID = '${id}'`);
    },
    single2: id => {
            
      return db.load(`select * from pic where ProID  = ${id}`);
  },

    add: entity => {
        return db.add('products',entity);
    },
    countByCat: catId => {
        return db.load(`select count(*) as total from products where CatID = ${catId} and TinyDes!=''`);
      },
      pageByCat: (catId, start_offset) => {
        var lim = config.paginate.default;
        return db.load(`select * from products where CatID = ${catId} and TinyDes!='' limit ${lim} offset ${start_offset}`);
      },
     
      countBySubCat: (subcatId) => {  
        return db.load(`select count(*) as total from products where subCatID = ${subcatId} and TinyDes!=''`);
      },
      pageBySubCat: (subID, start_offset) => {
        var lim = config.paginate.default;
        return db.load(`select * from products where subCatID = ${subID} and TinyDes!='' limit ${lim} offset ${start_offset}`);
      },
      countByTag: (tagID) => {  
        return db.load(`select COUNT(*) as total from products p ,itiemtag i where p.ProID=i.proID and i.tagID=${tagID} and TinyDes!=''`);
      },
      pageByTag: (tagID, start_offset) => {
        var lim = config.paginate.default;
        return db.load(`select p.*  from products p ,itiemtag i where p.ProID=i.proID and i.tagID=${tagID} and TinyDes!='' limit ${lim} offset ${start_offset}`);
      },
      update: entity => {
        var id = entity.ProID;
        delete entity.ProID;
        return db.update('products', 'ProID', entity, id);
      },
    
      delete: id => {
        return db.delete('products', 'ProID', id);
      },
     
      Click: id => {
            
        return db.load(`UPDATE products SET Click = Click + 1 where ProID=${id}`);
    },
    single3: name => {
            
      return db.load(`select * from users where f_Name = '${name}'`);
  },
   AddCmt: (content, idU,idP) => {
    return db.load(`INSERT INTO  comment( Content, idUser, idProduct,CreatedAt) VALUES ('${content}',${idU},'${idP}',now())`);
},
ShowCmt: name => {
            
  return db.load(`SELECT DISTINCT c.*,u.f_Name FROM  comment c 
  LEFT JOIN users u on c.idUser = u.f_ID
  RIGHT JOIN products p on c.idProduct = '${name}'`);
},
related: name => {
            
  return db.load(`select * from products where ProName != '${name}' `);
},

tagInfo: name => {
            
  return db.load(`select * from tag where tagName = '${name}' `);
},
addTag: entity => {
  return db.load(`INSERT INTO tag(tagName) VALUES ('${entity}')`);
},
addITag: entity => {
  return db.add('itiemtag',entity);
},
IDsingle: () => {
            
  return db.load(`SELECT ProID FROM products ORDER by CreatedAt DESC limit 1`);
},
IDsingle2: id => {
            
  return db.load(`select tagID from tag where tagName = '${id}' `);
},
alltag: () => {
            
  return db.load(`SELECT  tagName from  tag `);
},
};
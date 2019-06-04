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
            
        return db.load(`select * from products where ProName = '${id}'`);
    },
    single2: id => {
            
      return db.load(`select * from pic where ProID  = ${id}`);
  },
    add: entity => {
        return db.add('products',entity);
    },
    countByCat: catId => {
        return db.load(`select count(*) as total from products where CatID = ${catId}`);
      },
      pageByCat: (catId, start_offset) => {
        var lim = config.paginate.default;
        return db.load(`select * from products where CatID = ${catId} limit ${lim} offset ${start_offset}`);
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
            
        return db.load(`UPDATE products SET Click = Click + 1 where ProName='${id}'`);
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
};
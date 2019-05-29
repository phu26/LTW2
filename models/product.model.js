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
      }
};
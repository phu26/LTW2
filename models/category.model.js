var db = require('../utils/db');

module.exports = {
  all: () => {
    return db.load('select * from categories');
  },

  allWithDetails: () => {
    return db.load(`
    select c.*, count(p.ProID) as num_of_products
    from categories c left join products p on c.CatID = p.CatID 
    and p.TinyDes!=''
    group by c.CatID, c.CatName
    `);
  },

  single: id => {
    return db.load(`select * from categories where CatID = ${id}`);
  },

  /**
   * @param {*} entity { CatName: ... }
   */
  add: entity => {
    return db.add('categories', entity);
  },

  /**
   * @param {*} entity { CatID, CatName }
   */
  update: entity => {
    var id = entity.CatID;
    delete entity.CatID;
    return db.update('categories', 'CatID', entity, id);
  },

  delete: id => {
    return db.delete('categories', 'CatID', id);
  }
};

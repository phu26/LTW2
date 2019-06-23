var db = require('../utils/db');

module.exports = {
  all: () => {
    return db.load('select * from categories ');
  },
  subcat: id  => {
    return db.load(`select * from subcategories where subid= ${id}`);
  },
  singleEditor: id =>
  {
    return db.load(`select * from editor where CatID= ${id}`);
  },
  updateEditor: entity  => {
    var id = entity.id;
    delete entity.id;
    return db.update('Editor', 'id', entity, id);
  },
  insertEditor: entity  => {
    return db.add('Editor',entity);
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

  subsingle: id => {
    return db.load(`select * from subcategories where subID = ${id}`);
  },

  singleEmpty: id => {
    return db.load(`select c.* from categories c, products p where c.CatID = p.CatID and c.CatID=${id} group by CatID,CatName having count(p.ProID)=0`);
  },
  subCatbyCat: id => {
    return db.load(`SELECT * FROM subcategories WHERE CatID= ${id}`);
  },
   
  /**
   * @param {*} entity { CatName: ... }
   */
  add: entity => {
    return db.add('categories', entity);
  },
  /**
   * @param {*} entity { subName,CatID }
   */
  addsub: entity => {
    return db.add('subcategories', entity);
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
  },

  subdelete: id => {
    return db.delete('subcategories', 'subID', id);
  }
  
};

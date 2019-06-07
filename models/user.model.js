var db = require('../utils/db');

module.exports = {
  all: () => {
    return db.load('select * from users');
  },

  single: id => {
    return db.load(`select * from users where f_ID = ${id}`);
  },

  singleByUserName: userName => {
    return db.load(`select * from users where f_Username = '${userName}'`);
  },
  singleByUserNameAd: userName => {
    return db.load(`select * from users where f_Username = '${userName}' and f_Permission = 1`);
  },
  singleByUserNameWriter : userName =>{
    return db.load(`select * from users where f_Username = '${userName}' and f_Permission = 3`);
  },
  add: entity => {
    return db.add('users', entity);
  },

  update: entity => {
    var id = entity.f_ID;
    delete entity.f_ID;
    return db.update('users', 'f_ID', entity, id);
  },

  delete: id => {
    return db.delete('users', 'f_ID', id);
  },
  Addpic:(id,pic) => {
    return db.load(`INSERT INTO users( Pic) VALUES ('${pic}') where f_ID = ${id}`);
  },
  Updatepic:(id,pic) => {
    return db.load(`UPDATE  users SET Pic='${pic}' where f_ID = ${id}`);
  },
};

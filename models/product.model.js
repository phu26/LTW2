var db = require('../utils/db')
var config = require('../config/default.json');
module.exports = {
    all: () => {
            
        return db.load(`SELECT * FROM products where TrangThai = 3`);
    },
    allbySub: id =>{
      return db.load(`SELECT * FROM products where SubCatID = '${id}'`)
    },
    search: (string,start_offset) => {
      var lim = config.paginate.default;
      return db.load(`SELECT * FROM products p
      WHERE 
      	p.TrangThai =3 AND p.ProName LIKE '%${string}%'
         OR p.TrangThai =3 AND p.TinyDes LIKE '%${string}%'
         OR p.TrangThai =3 AND p.FullDes LIKE '%${string}%'
         
         ORDER BY p.ProID DESC
         limit ${lim} offset ${start_offset}
         `);
  },
  searchCount: string => {
            
    return db.load(`SELECT count(*) FROM products p
    WHERE p.ProName LIKE '%${string}%'
       OR p.TinyDes LIKE '%${string}%'
       OR p.FullDes LIKE '%${string}%'
       AND p.TrangThai =3
       `);
},
    allByCat: catID => {
            
        return db.load(`select * from products where CatID= ${catID} and TinyDes!='' and TrangThai = 3` );
    },
    single: id => {
            
        return db.load(`select * from products where ProID = '${id}' and TrangThai = 3`);
    },
    single2: id => {
            
      return db.load(`select * from pic where ProID  = ${id}`);
  },

    add: entity => {
        return db.add('products',entity);
    },
    countByCat: catId => {
        return db.load(`select count(*) as total from products where CatID = ${catId} and TinyDes!='' and TrangThai = 3`);
      },
      pageByCat: (catId, start_offset) => {
        var lim = config.paginate.default;
        return db.load(`select * from products where CatID = ${catId} and TinyDes!='' and TrangThai = 3 limit ${lim} offset ${start_offset}`);
      },
     
      countBySubCat: (subcatId) => {  
        return db.load(`select count(*) as total from products where subCatID = ${subcatId} and TinyDes!='' and TrangThai = 3`);
      },
      pageBySubCat: (subID, start_offset) => {
        var lim = config.paginate.default;
        return db.load(`select * from products where subCatID = ${subID} and TinyDes!='' and TrangThai = 3 limit ${lim} offset ${start_offset}`);
      },
      countByTag: (tagID) => {  
        return db.load(`select COUNT(*) as total from products p ,itiemtag i where p.ProID=i.proID and i.tagID=${tagID} and TinyDes!='' and p.TrangThai = 3`);
      },
      pageByTag: (tagID, start_offset) => {
        var lim = config.paginate.default;
        return db.load(`select p.*  from products p ,itiemtag i where p.ProID=i.proID and i.tagID=${tagID} and TinyDes!='' and p.TrangThai = 3 limit ${lim} offset ${start_offset}`);
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
    return db.load(`INSERT INTO  comment( Content, idUser, idProduct,CreatedAt) VALUES ('${content}',${idU},${idP},now())`);
},
ShowCmt: name => {
            
  return db.load(`SELECT DISTINCT c.*,u.f_Name FROM  comment c 
  LEFT JOIN users u on c.idUser = u.f_ID
  RIGHT JOIN products p on c.idProduct = ${name}`);
},
related: name => {
            
  return db.load(`select * from products where ProID != ${name} and TrangThai = 3 `);
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
proByUser0: id => {
            
  return db.load(`SELECT * FROM products WHERE author = ${id} and TrangThai = 0 `);
},
proByUser1: id => {
            
  return db.load(`SELECT * FROM products WHERE author = ${id} and TrangThai = 1 `);
},
proByUser2: id => {
            
  return db.load(`SELECT * FROM products WHERE author = ${id} and TrangThai = 2 `);
},
proByUser3: id => {
            
  return db.load(`SELECT * FROM products WHERE author = ${id} and TrangThai = 3 `);
},
proByUser4: id => {
            
  return db.load(`SELECT * FROM products WHERE author = ${id} and TrangThai = 4 `);
},
single3: id => {
            
  return db.load(`SELECT p.*,c.CatName,s.subName FROM products p,categories c,subcategories s WHERE p.ProID = ${id} and p.CatID = c.CatID and s.CatID = c.CatID and p.subCatID = s.subID`);
},
gettag: id=> {
            
  return db.load(`SELECT t.* FROM tag t , itiemtag i WHERE i.proID = ${id} and t.tagID = i.tagID`);
},
delP: id=> {
            
  return db.load(`DELETE FROM products WHERE ProID =${id}`);
},
delI: id=> {
            
  return db.load(`DELETE FROM itiemtag WHERE proID = ${id}`);
},
getCD: id=> {
            
  return db.load(`Select CatID FROM editor WHERE user_ID  = ${id}`);
},
getProCat: id=> {
            
  return db.load(`SELECT p.*,u.f_Name FROM products p,users u,editor e WHERE p.CatID =${id} and p.CatID=e.CatID and p.author=u.f_ID`);
},
Accept: id=> {
            
  return db.load(`UPDATE products SET TrangThai = 1 WHERE ProID = ${id}`);
},
Decline: id=> {
            
  return db.load(`UPDATE products SET TrangThai = 2 WHERE ProID = ${id}`);
},
isNT: id=> {
            
  return db.load(`SELECT noTi FROM notification WHERE ProID = ${id} and user_ID=0 or ProID=0 and user_ID = ${id} `);
},
addNT:(id,message,idu)=> {
            
  return db.load(`INSERT INTO notification( ProID, noTi,user_ID) VALUES (${id},'${message}',${idu})`);
},
updateNT:(id,message)=> {
            
  return db.load(`UPDATE notification SET noTi= '${message}' where ProID=${id} and user_ID=0  or ProID= and user_ID=${id} `);
},
updatePro:(id,ProName,TinyDes,FullDes,CatID,subCatID)=> {
            
  return db.load(`UPDATE products SET ProName="${ProName}",TinyDes='${TinyDes}',FullDes='${FullDes}',CatID=${CatID},subCatID=${subCatID} WHERE ProID =${id} `);
},
isitiemTag: (id,idtag)=> {
            
  return db.load(`SELECT * FROM itiemtag WHERE proID = ${id} and tagID= ${idtag}`);
},
updateitiemTag: (id,idtag)=> {
            
  return db.load(`UPDATE itiemtag SET tagID = ${idtag} WHERE proID = ${id}`);
},
delNT: (id)=> {
            
  return db.load(`delete from notification WHERE proID = ${id} and user_ID=0 or  proID = 0 and user_ID=${id}`);
},
proByALL0: ()=> {
            
  return db.load(`SELECT p.*,u.f_Name FROM products p,users u WHERE  p.author=u.f_ID and TrangThai =0`);
},
proByALL1: ()=> {
            
  return db.load(`SELECT p.*,u.f_Name FROM products p,users u WHERE  p.author=u.f_ID and TrangThai =1 `);
},

proByALL2: ()=> {
            
  return db.load(`SELECT p.*,u.f_Name FROM products p,users u WHERE  p.author=u.f_ID and TrangThai =2 `);
},

proByALL3: () => {
            
  return db.load(`SELECT p.*,u.f_Name FROM products p,users u WHERE  p.author=u.f_ID and TrangThai =3`);
},

proByALL4: () => {
            
  return db.load(`SELECT p.*,u.f_Name FROM products p,users u WHERE  p.author=u.f_ID and TrangThai =4`);
},

acceptBy: (idu,proid,time) => {
            
  return db.load(`INSERT INTO news(user_ID, ProID, CreatedAt) VALUES (${idu},${proid},'${time}')`);
},

add22: entity => {
  return db.add('news',entity);
},
XuatBan: (id) => {
            
  return db.load(`UPDATE products SET TrangThai= 3 WHERE ProID = ${id}`);
},
Upper: (id) => {
            
  return db.load(`UPDATE products SET TrangThai= 4 WHERE ProID = ${id}`);
},

ED: (id) => {
            
  return db.load(`SELECT * FROM news n ,users u,products p where n.user_ID = u.f_ID and n.ProID=p.ProID and n.user_ID=${id}`);
},

};



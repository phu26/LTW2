var db = require('../utils/db')
module.exports = {
    all: () => {
            
        return db.load('select * from categories');
    },
    add: entity => {
        return db.add('categories',entity);
    }
};
var express = require ('express');
var catogoryModel = require('../models/category.model');
var productModel = require('../models/product.model');
var router = express.Router();


router.get('/',(req,res)=>{
    catogoryModel.allWithDetails()
    .then(rows => {
       res.render('categories/index',{
           categories: rows
        });
      
    })
    .catch(error => {
        res.render('error',{ layout: false})
    }) ;
    
})

router.get('/add',(req,res)=>{res.render('categories/add');})
router.post('/add',(req,res)=>{
  
    catogoryModel.add(req.body).then(id => {
        console.log(id);
        res.render('categories/add');
    });
    })

 /* categoryModel.single(id)
        .then(rows =>{if (rows.length >0  )
        {
            res.render('vwCategories/edit',{
                error:false,
                category: row[0]
            });
        }
    else
{
    res.render('vwCategories/edit',{
        error: true
    });
}}).catch(next);
*/
router.get('/:id/products',(req,res,next)=>{
    var id= req.params.id;
    if(isNaN(id))
    {
        res.render('vwProducts/byCat',{error: true});
        return;
    }
    productModel.allByCat(id).then(rows => {
res.render('vwProducts/byCat',{
    error: false,
    empty: rows.length === 0,
    products: rows
});
    }).catch(next);
})
module.exports = router;
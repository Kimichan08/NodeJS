const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads');
    },
    filename: (req, file, callback) => {
        let time = Date.now();
        callback(null,time + file.originalname);
    }
})
const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'demo',
    charset:'utf8_unicode_ci'
});

conn.connect((error)=>{
    if (error) throw error.stack;    
    console.log('connected as id' + conn.threadId);
})
app.get('/',(req,res)=>{
    res.render('layout/index');
})

//CRUD danh muc san pham
//lay ra danh muc
app.get('/category/list',(req,res)=>{
    conn.query("SELECT * FROM category",(error,category)=>{
        if (error) {
            res.send(error)
        } else {
            res.render('category/list',{category});
        }
    })
});

// them thong tin danh muc
app.get('/category/add',(req,res)=>{
    res.render('category/add');
})

app.post('/category/add',(req,res)=>{
    let sql = `INSERT INTO category(name,status) VALUES ('${req.body.name}','${req.body.status}')`;
    conn.query(sql,(err,result)=>{
        if (err) {
            res.send(err);
        } else {
            res.redirect('/category/list');
        }
    })
})


// sua thong tin danh muc
app.get('/category/edit/:id',(req,res)=>{
    let id = req.params.id;
    
    conn.query(`SELECT * FROM category WHERE id = ${id}`,(err,result)=>{
        if (err) {
            res.send(err);
        } else {
            let cate = result[0];
            res.render('category/edit',{cate});
        }
    })
})

app.post('/category/edit/:id',(req,res)=>{
    let id = req.params.id;
    conn.query(`UPDATE category SET name='${req.body.name}', status='${req.body.status}' WHERE id = ${id}`,(err,category)=>{
        if (err) {
            res.send(err);
        } else {
            res.redirect('/category/list');
        }
    });
})

// xoa danh muc
app.get('/category/delete/:id',(req,res)=>{
    let id = req.params.id;
    conn.query(`DELETE FROM category WHERE id = ${id}`,(err,category)=>{
        if (err) {
            res.send(err);
        } else {
            res.redirect('/category/list');
        }
    })
})

//CRUD san pham
//lay ra danh sach san pham
app.get('/product/list',(req,res)=>{
    conn.query("SELECT * FROM product",(error,product)=>{
        if (error) {
            res.send(error)
        } else {
            res.render('product/list',{product});
        }
    })
})

// them san pham
app.get('/product/add',(req,res)=>{
    conn.query("SELECT * FROM category",(error,category)=>{
        if (error) {
            res.send(error)
        } else {
            res.render('product/add',{category});
        }
    })
})

app.post('/product/add',upload.single('avatar'),(req,res)=>{
    let sql = `INSERT INTO product(name,price,image,category_id,status) VALUES ('${req.body.name}','${req.body.price}','${req.file.filename}','${req.body.category_id}','${req.body.status}') `;
    conn.query(sql,(err,result)=>{
        if (err) {
            res.send(err);
        } else {
            res.redirect('/product/list');
        }
    })
})

// sua san pham
app.get('/product/edit/:id',(req,res)=>{
    let id = req.params.id;
    
    conn.query(`SELECT * FROM product WHERE id = ${id}`,(err,result)=>{
        if (err) {
            res.send(err);
        } else {
            conn.query("SELECT * from category", (errr, category) => {
                if (errr) {
                    res.send(errr)
                } else {
                    res.render('product/edit', { category, pro: result[0] });
                }
            })
        }
    })
})

app.post('/product/edit/:id',upload.single('avatar'),(req,res)=>{
    let id = req.params.id;
    conn.query(`UPDATE product SET name='${req.body.name}',price='${req.body.price}',image='${req.file.filename}',category_id='${req.body.category_id}', status='${req.body.status}' WHERE id = ${id}`,(err,product)=>{
        if (err) {
            res.send(err);
        } else {
            res.redirect('/product/list');
        }
    });
})
// xóa sản phẩm
app.get('/product/delete/:id',(req,res)=>{
    let id = req.params.id;
    conn.query(`DELETE FROM product WHERE id = ${id}`,(err,product)=>{
        if (err) {
            res.send(err);
        } else {
            res.redirect('/product/list');
        }
    })
})

// upload anh
app.get('/upload', (req, res) => {
    res.render('upload');
})

app.post('/upload', upload.single('avatar'), (req, res) => {
    console.log(req.file.filename, req.body);
})

app.listen(3000, () => {
    console.log("listen to 3000");
})
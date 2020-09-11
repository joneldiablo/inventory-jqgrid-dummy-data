const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./DB.json');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json())

app.post('/inventario', (req, res) => {
    console.log(req.body);
    let inv = db.inventario; //;
    if (req.body._search) {
        if (req.body.target2) {
            inv = inv.filter(elem => elem.productName.includes(req.body.target2));
        }
        if (req.body.target1 && req.body.target1 != '0') {
            let suc =
                db.sucursales.find(elem => elem.id == req.body.target1);
            inv = inv.filter(elem => elem.branchName.includes(suc.value));
        }
    }
    res.jsonp({
        data: inv.slice(req.body.start, req.body.length * req.body.draw),
        draw: req.body.draw,
        recordsFiltered: inv.length
    });
});

app.post('/sucursales', (req, res) => {
    console.log(req);
    res.jsonp({ Cat_Branch: db.sucursales });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
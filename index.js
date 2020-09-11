const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./DB.json');
const app = express();
const port = 3000;
const corsOptions = {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 204
}

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "HEAD, OPTIONS, GET, POST, PUT, PATCH, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
    })
    next();
});

app.options("*", cors(), (req, res) => {
    res.status(200).send("Preflight request allowed");
});

app.post('/inventario', cors(), (req, res) => {
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
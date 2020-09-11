/* // server.js
var jsonServer = require("json-server");
var server = jsonServer.create();
var router = jsonServer.router("./DB.json");
var middlewares = jsonServer.defaults();
server.use(function(req, res, next) {
  console.log(req.method);
  if (req.method === "POST") {
var qs = require("querystring");
var body = "";
req.on("data", function(data) {
body += data;
});
req.on("end", function() {
var POST = qs.parse(body);
console.log(POST);
});
} else if (req.method === "GET") {
var url = require("url");
var urlParts = url.parse(req.url, true);
console.log(urlParts.query);
}
    next();
});
server.use(middlewares);
server.use(router);
server.listen(3000, function() {
    console.log("JSON Server is running");
});
router.render = function(req, res) {
    //console.log( req.url );
    //console.log( router.db.__wrapped__.inventario.length );
    if (req.url.indexOf("/inventario") === 0) {
        var records = router.db.__wrapped__.inventario.length;
        res.jsonp({
            rows: res.locals.data,
            total: Math.ceil(records / res.locals.data.length),
            page: req._page,
            records: records
        });
    } else {
        res.jsonp(res.locals.data);
    }
}; */

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
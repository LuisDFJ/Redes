const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

var LED1 = 1;
var LED2 = 1;

var C1 = 0;
var C2 = 0;
var P1 = 0;
var P2 = 0;
var V1 = 0;
var V2 = 0;
var PD1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var PD2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res) => {
    const options = {
        root: path.join(__dirname,'/public')
    }
    res.sendFile('index.html', options);
});

app.post("/output", (req,res) => {
    console.log(req.body.data);
    if (req.body.data === 'Q') {
        LED1 ^= 1;
        res.json({state: LED1});
    }
    if (req.body.data === 'q') {
        LED2 ^= 1;
        res.json({state: LED2});
    }
});

app.post("/input", (req,res) => {
    console.log(req.body.data);
    C1 = Math.random() * 300;
    C2 = Math.random() * 300;
    V1 = Math.random() * 5;
    V2 = Math.random() * 5;
    P1 = C1 * V1;
    P2 = C2 * V2;
    PD1.shift();
    PD1.push(P1);
    PD2.shift();
    PD2.push(P2);
    if (req.body.data === 'OK') {
        res.json({Current1: C1, Current2: C2, Power1: P1, Power2: P2, Voltage1: V1, Voltage2: V2, PowerData1: PD1, PowerData2: PD2});
    }
});

app.use(express.static(path.join(__dirname,'/public')));

const server = app.listen(port, () => {
    console.log("Listo");
});

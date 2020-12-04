const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const { parse } = require('path');
const { json } = require('body-parser');
const sPort = new SerialPort('/dev/ttyACM1');

const app = express();
const port = 3030;


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
var Commands = ['{"typ":"c","data":0.00}',
                '{"typ":"C","data":0.00}',
                '{"typ":"V","data":0.00}',
                '{"typ":"v","data":0.00}'];
var CommandsJSON;

const parser = sPort.pipe(new Readline({ delimiter: '\r\n'}));

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
    sPort.write("c");
    sPort.write("C");
    sPort.write("V");
    sPort.write("v");
    Commands[0] = Commands[0].replace("\u0000\u0000", "");
    //console.log(JSON.parse(Commands[0]));
    for (var i = 0; i < 4; i++) {
        var obj = JSON.parse(Commands[i]);
        switch (obj.typ) {
            case 'C':
                C1 = obj.data;
            break;
            case 'c':
                C2 = obj.data;
            break;
            case 'V':
                V1 = obj.data;
            break;
            case 'v':
                V2 = obj.data;
            break;
        }
    }
    P1 = C1 * V1;
    P2 = C2 * V2;
    PD1.shift();
    PD1.push(P1);
    PD2.shift();
    PD2.push(P2);
    if (req.body.data === 'OK') {
        res.json({Current1: C1, Current2: C2, Power1: P1, Power2: P2, Voltage1: V1, Voltage2: V2, PowerData1: PD1, PowerData2: PD2});
    } else {
        console.log('ERROR at /input');
    }
});

app.use(express.static(path.join(__dirname,'/public')));

const server = app.listen(port, () => {
    console.log("Listo");  
});

parser.on('data', (data) => {
    Commands.shift();
    Commands.push(data);
});


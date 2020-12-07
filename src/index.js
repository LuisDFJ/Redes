const process = require('process');
const express = require('express');
const os = require('os');
const path = require('path');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const { parse } = require('path');
const { json } = require('body-parser');
const sPort = new SerialPort(process.argv[2], { baudRate: 9600});

const app = express();
const port = 3030;


var LED1 = 0;
var LED2 = 0;

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

const parser = sPort.pipe(new Readline({ delimiter: '\n'}));

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
        sPort.write("Q");
    }
    if (req.body.data === 'q') {
        LED2 ^= 1;
        res.json({state: LED2});
        sPort.write("q");
    }
});

app.post("/input", (req,res) => {
    sPort.write("c");
    sPort.write("C");
    sPort.write("V");
    sPort.write("v");
    for (var i = 0; i < 4; i++) {
        try {
            var obj = JSON.parse(Commands[i]);
            switch (obj.typ) {
                case 'C':
                    C1 = LED1 * obj.data;
                break;
                case 'c':
                    C2 = LED2 * obj.data;
                break;
                case 'V':
                    V1 = LED1 * 10.0 * obj.data/1024.0;
                break;
                case 'v':
                    V2 = LED2 * 10.0 * obj.data/1024.0;
                break;
            }
        } catch(e) {
            console.log("ERROR");
        }
    }
    console.log("C1:",C1,"C2:",C2,"V1:",V1,"V2:",V2);
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
    console.log("Ready");
    console.log("Serial port at:", process.argv[2]);
    console.log("Listening at: https://" + os.networkInterfaces().wlp3s0[0].address + ":" + port);
});

parser.on('data', (data) => {
    if (data[8] !== 'q' && data [8] !== 'Q') {
        Commands.shift();
        Commands.push(data);
    }
});

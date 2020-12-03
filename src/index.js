const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const options = {
        root: path.join(__dirname,'/public/gauge')
    }
    res.sendFile('index.html', options);
});

app.use(express.static(path.join(__dirname,'/public/gauge')));

const server = app.listen(port, () => {
    console.log("Listo");
});

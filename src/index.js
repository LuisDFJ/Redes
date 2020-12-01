const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("Helloworld!");
});

app.get('/hola', (req, res) => {
    res.send("HolaMundo!");
});

const server = app.listen(port, () => {
    console.log("Listo");
});

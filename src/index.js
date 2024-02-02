const express = require('express');
const app = express();
const port = 3000;

const test = require('./routes/test.js');

app.use(express.json()); 

app.use('/', test);

app.listen(port, ()=> {
    console.log(`Application exemple à l'écoute sur le port ${port}!`);
})
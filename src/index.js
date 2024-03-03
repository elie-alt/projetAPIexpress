const express = require('express');
const app = express();
const port = 3000;

const test = require('./routes/test.js');
const auth = require('./routes/auth.js');

app.use(express.json()); 

app.use('/', test);
app.use('/', auth);

app.listen(port, ()=> {
    console.log(`Application exemple à l'écoute sur le port ${port}!`);
})
const express = require('express')
const { bananaSplit } = require('./index')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/', bananaSplit);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

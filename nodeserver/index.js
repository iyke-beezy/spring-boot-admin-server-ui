const express = require('express');
const cors = require('cors');
const apiRouter = require('./apiRouter');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// allow cors requests
app.use(cors());

app.use("/", apiRouter);

app.listen(5050, () => {
    console.log('Application running on PORT 5050');
})
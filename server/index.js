require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { SERVER_PORT } = process.env;
const { getPairings, getList, seed, test, addStudent } = require('./controller.js');

app.use(express.json());
app.use(cors());

// DEV
app.post('/seed', seed);
// app.get('/test', test);

//Add Students to List
app.post('/studentadd', addStudent);

// Get Student List
app.get('/studentlist', getList);
// Generate Pairings
app.get('/pairings', getPairings);
// app.get('/pairone', onePair);

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));

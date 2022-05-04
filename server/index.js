require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { SERVER_PORT } = process.env;
const { getPairings, getList, onePair, seed } = require('./controller.js');

app.use(express.json());
app.use(cors());

// DEV
app.post('/seed', seed);

// Get Student List
app.get('/studentlist', getList);
// Generate Pairings
app.get('/pairings', getPairings);
app.get('/pairone', onePair);

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`));

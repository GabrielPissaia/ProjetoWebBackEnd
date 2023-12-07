const express = require('express');

const routes = require('./src/routes.js');

require('./src/database/index.js');

const app = express();

app.use(express.json());

app.use(routes);

app.listen(3000);
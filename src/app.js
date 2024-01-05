const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const apiRouter = require('./routers/api.router');

app.use(express.static('./static'));

app.use('/api', apiRouter);

app.listen(PORT);

console.log('App started on http://localhost:' + PORT);

module.exports = app;
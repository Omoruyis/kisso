require('./config/config')

const { router } = require('./routes/index')
const bodyParser = require('body-parser');
const express = require("express");
const cors = require("cors")
const app = express();

app.use(cors())
app.use(bodyParser.json())
app.use(router)

const port = process.env.PORT

app.listen(port, function () {
  console.log(`app listening on port ${port}!`);
});

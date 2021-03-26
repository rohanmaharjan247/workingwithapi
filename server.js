//Install express server
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8081;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Serve only the static files form the dist directory
app.use("/", express.static(__dirname + "/dist/DictionaryApi"));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname+'/dist/DictionaryApi/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(port, () =>{
  console.log("App listening to:", port)
});

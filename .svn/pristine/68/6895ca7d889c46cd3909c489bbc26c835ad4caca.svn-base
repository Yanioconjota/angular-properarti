var express = require("express");

var app = express();

app.use( "/app", express.static( __dirname + "/app" ) );
app.use( "/node_modules", express.static( __dirname + "/node_modules" ) );
app.use( "/statics", express.static( __dirname + "/statics" ) );

app.get("/ngProject", function( req, res){
  res.sendFile( __dirname + "/app/index.html" );
});

app.listen(9000);

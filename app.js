var express = require('express'),
	app = express(),
	port = process.argv[2] || 4000,
	PG = require('./pricegrabber/pricegrabber'),
	bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); 
app.get('/pricegrabber/:cntry/:prdct/:st/:type',PG.getPGrequest);

app.listen(port,function(){
	console.log("Server pricegrabber run on port " + port);
});
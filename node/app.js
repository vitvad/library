
/**
 * Module dependencies.
 */
var express = require('express')
	, http = require('http')
	, path = require('path');


var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('address', process.env.ADDRESS || 'epuakhaw0143');
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret: new Date().toString()}));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});





/* DB connection */
require('./database')(app);

/*Route*/


require('./routes/index')(app);
require('./routes/user')(app);
require('./routes/books')(app);


/* Global Rout */

/*Go!*/
http.createServer(app).listen( app.get('port') , function(req, res){
	console.log("Express server listening on " + app.get('address') + ":" + app.get('port'));
	console.log("Express server started on ", new Date());
});

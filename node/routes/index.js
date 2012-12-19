/*
 * GET home page.
 */

module.exports = function(app){
	app.get('/', start);
	app.get('/index', start);

	function start(req, res){
		console.log(req.session);
		if(req.session && req.session.user){
			getUserBooks(req, res, function(req, res, docs){
				res.render('index', {
					title: 'Home Page. Welcomme ' + req.session.user.login
					, user: req.session.user
					, books: docs ? docs : []
				});
			})

		}else{
			res.redirect('login');
		}
	};

	function getUserBooks(req, res, cb){
		var collection = new app.DB.mongo.db.Collection(app.DB.client, 'books'),
			perPage = 5,
			curPage = 0

		if(res.app.route.indexOf("/books")!=-1){
			collection.find({"owner": req.session.user.email}).toArray(function(err, docs) {
				if(err) console.log("Find books by owner field: ", err);
				cb(req, res, docs);
			});
		}else{

			collection.find().skip(curPage * perPage).limit(perPage).toArray(function(err, docs) {
				if(err) console.log("Find all books: ", err);
				cb(req, res, docs);
			});
		}
	};

};
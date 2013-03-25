var F = require("../functions");

module.exports = function(app){
	app.all('/books', userBooks);

/* Functions */
	function userBooks(req, res){
		if(!F.checkAuth(req, res)) res.redirect('login');
		else{
			if(req.body && ("books.newbook" in req.body)){
				createBook(req, res);
			}else{
				getUserBooks(req, res, function(req, res, docs ){
					console.log("User books: ", docs);
					res.render("books/books", {
						user: req.session.user,
						books: docs ? docs : []
					});
				});
			}
		}
	}

	function createBook(req, res){
		console.log("Create book [res.body]: ", req.body)

		var collection = new app.DB.mongo.db.Collection(app.DB.client, 'books'),
			Book = {
				title: req.body["book.title"],
				author: req.body["book.author"],
				year: req.body["book.year"],
				tags: parseTags(req.body["book.tags"]),
				owner: req.session.user.email,
				status: {
					available: true,
					user: req.session.user.email
				},
				query : [],
				description: req.body["book.description"]
			};


			collection.insert(Book, {safe: true}, function(err, docs) {
				if (err){
					console.log(err);
					res.render('books/createBook', {errorMess: "Something going wrong!" });
				}else{
					res.redirect("/books");
				};

			});
	};

	function getUserBooks(req, res, cb){
		var collection = new app.DB.mongo.db.Collection(app.DB.client, 'books'),
			perPage = 5,
			curPage = 0

		console.log("Current route: ", req.route.path);

		if(req.route.path && req.route.path.indexOf("/books")!=-1){
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

	function parseTags(str){
		var res = [];
		str.split(', ').forEach(function(el){
			res.push({
				name: el,
				url: "#"
			});
		});
		return res;
	};

}
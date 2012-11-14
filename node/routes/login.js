exports.start = function(req, res){
	if(req.query.email){
		console.log(req.app);
	/*	req.app.get('db').open(function (error, client) {
			if (error) throw error;
			var collection = new mongodb.Collection(client, 'users');
			collection.find({email: req.query.email}).toArray(function(err, docs) {
				console.log(docs);
				if(docs.length){
					if(docs.pass === req.query.pass){
						res.render('index', { title: 'Epam Library' });
					}else{
						res.render('login', { title: 'Login', errorMess: "wrong pass" });
					}
				}else{
					res.render('login', { title: 'Login', errorMess: "No such user" });
				};
			});
		});*/

	}else{
		res.render('login', { title: 'Login' });
	}
};
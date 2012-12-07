var F = require("../functions");

module.exports = function(app){
	app.all('/login', loginPage);

	app.all('/create', createUser);

	app.all('/user', userInfo);

	app.get('/logout', logout);



/* Functions */

	function loginForm(req, res){
		res.render('user/login');
	};

	function loginPage(req, res){
		if(req.body.email){
			var collection = new app.DB.mongo.db.Collection(app.DB.client, 'users');
			collection.findOne({email: req.body.email}, function(err, docs) {
				console.log(docs);
				if(docs){
					console.log('pass', docs.pass , req.body.pass);
					if(docs.pass === req.body.pass){
						req.session.user = docs;
						/**/
						res.redirect('index');

					}else{
						res.render('user/login', {errorMess: "wrong pass" });
					}
				}else{
					res.render('user/login', {errorMess: "No such user" });
				};

			});
		}else loginForm(req, res);
	}

	function createUser(req, res){
		console.log("POST data: ", req.body)
		if(req.body["user-create"]){

			var collection = new app.DB.mongo.db.Collection(app.DB.client, 'users'),
				User = {
					description: req.body["description"],
					login: req.body["name"],
					email: req.body["email"],
					pass: req.body["pass"],
					role: req.body["role"]
				},
				validation = F.validateUser(User);

				console.log("validation :", validation);

				if(validation === true){
					collection.insert(User, {safe: true}, function(err, docs) {
						if (err){
							console.log(err);
							if(err.message.indexOf('E11000 ') !== -1){
								res.render('user/createUser', {errorMess: "User with this email already exist!" });
							}else{
								res.render('user/createUser', {errorMess: "Something going wrong!" });
							}
						}else{
							req.session.user = User;
							console.log(docs);
							res.redirect('index');
						};

					});

				}else{
					res.render('user/createUser', { errorMess: validation.errorMess });
				}
				
		}else{
			res.render('user/createUser');
		}
	};


	function userInfo(req, res){
		console.log("user info ", req.body, req.session);

		if(!F.checkAuth(req, res)){

			res.redirect('login');

		}else if(req.body.email){

			if(req.body.pass != req.session.user.pass){
				res.render('user/userInfo',{errorMess: "Please specify your old password", user: req.session.user});
			}else{
				var collection = new app.DB.mongo.db.Collection(app.DB.client, 'users'),
					User = {
						description: req.body["description"] || req.session.description,
						login: req.body["name"] || req.session.name,
						email: req.body["email"] || req.session.email,
						role: req.body["role"] || req.session.user.role,
						pass: req.body["pass"]
					},
					validation = F.validateUser(User);

				if(validation === true){
					console.log("req.session.user", req.session.user);

					collection.update({"email": req.session.user.email} , {$set: User },{safe: true}, function(err, doc){
						console.log("update user ", err, doc);
						if (err){
							console.log(err);
							res.render('user/userInfo', {errorMess: "Something going wrong!" });
						}else{
							console.log("user updated ", User);
							req.session.user = User;
							res.render('user/userInfo', {user: req.session.user });
						}
					});
				}else{
					res.render('user/userInfo',{errorMess: validation.errorMess, user: req.session.user});
				}
			}
		}else{
			/* render iser info page */
			res.render('user/userInfo', {user: req.session.user });
		}
		
	}

	function logout(req, res){
		req.session.destroy();
		res.redirect('index');
	};
}
var F = require("../functions");

module.exports = function(app){
	app.all('/books', userBooks);

/* Functions */
	function userBooks(req, res){
		if(!F.checkAuth(req, res)) res.redirect('login');
		else{
			res.render("books/userBook", {user: req.session.user});
		}
	}
}
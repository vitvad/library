/*
 * GET home page.
 */

module.exports = function(app){
	app.get('/', start);
	app.get('/index', start);

	function start(req, res){
		console.log(req.session);
		if(req.session && req.session.user){
			res.render('index', {
							title: 'Home Page. Welcomme ' + req.session.user.login
							, user: req.session.user
						});
		}else{
			res.redirect('login');
		}
	};
};
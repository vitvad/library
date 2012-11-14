
/*
 * GET home page.
 */

exports.index = function(req, res){
	/*if(!req.app.get('currentUser')){
		res.render('login', {title: "Login"});
	}else{*/
		res.render('index', { title: 'Epam library' });
	//}
};
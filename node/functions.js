/*
	TODO:
	-checkAuth: user email validation wrong :(
*/

module.exports = {
	checkAuth: function(req, res, noRedirect){
		console.log("checkAuth ", req.session, req.session.user);
		return (req.session.user) ? true : false;
	},
	validateUser: function(user){
		var emailRegExp = new RegExp("^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");

		if(!user.login || user.login =="") return {errorMess: "Please fill user name field."};

		console.log("test email: ", emailRegExp.test(user.email))
		if(!user.email || user.email =="" || !(emailRegExp.test(user.email)) ) return {errorMess: "Something wrong with email adress"};

		if(!user.pass || user.pass =="" || user.pass.length < 4) return {errorMess: "Please use password more then 3 symbols."};
		return true;
	}
}
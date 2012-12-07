module.exports = function(app){

	var mongoDB = require("mongodb");
	var dbServer = new mongoDB.Server("127.0.0.1", 27017,{});
	var dbConnection = new mongoDB.Db('library', dbServer,{});
	dbConnection.open(function (error, client) {
		if (error) throw error;
		app.DB = {
				"mongo": {
					"db": mongoDB,
					"server": dbServer,
					"connection": dbConnection
				},
				"error": error,
				"client": client
				};
	});
}
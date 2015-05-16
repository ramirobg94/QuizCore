var models = require('../models/models.js');

//MW para hacer una pregunta favorita
//http://localhost:5000/user/XX/favourites/YY?_method=put
exports.new = function(req, res, next){
	var quiz = req.quiz;
	var user = req.user;

	user.hasQuiz(quiz).then(function(result){
		if(result){
			console.log("ya es favorita");
			next();
			return;
		} else {
			user.addQuiz(quiz).then(function(){
				user.hasQuiz(quiz).then(function(result){
					console.log("el" +user.id + "hizo favorita a la pregunta" + quiz.id + "con exito");
				})
			})
		}
	});

}

//MW para quitar una pregunta de favorita
exports.destroy = function(req, res){
	console.log("llego a este otro");
	var quiz = req.quiz;
	var user = req.user;
	console.log("llego a este otro");

user.hasQuiz(quiz).then(function(result){
	console.log(result);
		if(result){
			console.log("es favorita");
			
			user.removeQuiz(quiz).then(function(){
				user.hasQuiz(quiz).then(function(result){
					console.log(" el" +user.id + " quito de favorita a la pregunta " + quiz.id + " con exito");
				})
			})
		}
	});
}

//Mw para listar preguntas favoritas
exports.listFav = function(req, res, next){

}

//<span class="glyphicon glyphicon-star"></span>
//<span class="glyphicon glyphicon-star-empty"></span>
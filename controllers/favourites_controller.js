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
	var quiz = req.quiz;
	var user = req.user;
	console.log("llego a este otro");
/*
	if(user.hasQuiz(quiz)){
		console.log('si lo tiene');
		user.remove(quiz).then(function(){
			console.log('ahora deberia ser false' + user.hasQuiz(quiz));
		});
	}
*/

}

//Mw para listar preguntas favoritas
exports.listFav = function(req, res, next){

}

//<span class="glyphicon glyphicon-star"></span>
//<span class="glyphicon glyphicon-star-empty"></span>
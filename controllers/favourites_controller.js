var models = require('../models/models.js');
var quizes = [];

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
		res.redirect(req.session.redir.toString());
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
		} else {
			console.log("no es favorita");
		}
		res.redirect(req.session.redir.toString());
	});
}

//Mw para listar preguntas favoritas
exports.listFav = function(req, res){
	var favs = [];
	var quizes2 = [];
	index = 0;
	index2 = 0;

		models.favourites.findAll({
			where: {UserId: Number(req.session.user.id) },
			order: 'QuizId ASC'
		}).then(function(a){
						quizes = [];
			for(index = 0; index < a.length;index++){
			favs.push(a[index].dataValues.QuizId);
			}
		}).then(function(){
			index2 = 0;
		}).then(function(){
				//console.log(favs.length);
			for(index2 = 0; index2 < favs.length; index2++){
				console.log("index2" + index2)
					models.Quiz.find({
									where:{ id: Number(favs[index2])},
									include: [{model: models.Comment}]
								}).then(function(quiz){
									quizes.push(quiz);
								}).then(function(){
								//	console.log(quizes);
								//	console.log(favs.length);
								//	console.log(index2);
									console.log(index2 >= (favs.length-1));
									if(index2 >= (favs.length-1)){
										console.log("Despues de buscar" + index2);
					//console.log(quizes);
									}	

								});
								

			}
		}).then(function(){
			//console.log(quizes);
		}).then(function(){
				res.render('quizes/index.ejs', {quizes: quizes, errors: [], misearch: '', search: '', favs: favs});
		});



/*
models.favourites.findAll({
			where: { UserId: Number(req.session.user.id) }
		}).then(function(a){
			console.log("busca");
			quizes=[];

			for(index = 0; index < a.length;index++){
					favs.push(a[index].dataValues.QuizId);
						models.Quiz.find({
							where:{ id: Number(a[index].dataValues.QuizId)},
							include: [{model: models.Comment}]
						}).then(function(quiz){
								quizes.push(quiz)
								//console.log(quizes);
								//console.log(quizes);
								quizes2 =quizes;
						});
				} 


		});

if(quizes2 !== null){
	console.log(quizes);
			console.log(favs);
				res.render('quizes/index.ejs', {quizes: quizes2, errors: [], misearch: '', search: '', favs: favs});
}
*/

}

//<span class="glyphicon glyphicon-star"></span>
//<span class="glyphicon glyphicon-star-empty"></span>